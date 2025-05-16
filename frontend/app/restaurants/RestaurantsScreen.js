import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BASE_URL } from '../config';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RestaurantsScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Platform.OS === 'web'
          ? window.alert('Πρέπει να συνδεθείς πρώτα!')
          : Alert.alert('Προσοχή', 'Πρέπει να συνδεθείς πρώτα!');
        router.replace('/login');
      }
    };
    checkAuth();
  }, []);

  const fetchRestaurants = async (query = '') => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/restaurants`, {
        headers: { Authorization: `Bearer ${token}` },
        params: query ? { name: query } : {},
      });

      setRestaurants(
        Array.isArray(response.data)
          ? response.data.filter((r) => r?.restaurant_id && r?.name)
          : []
      );
    } catch (err) {
      console.error('❌ Σφάλμα:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchRestaurants(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleLogout = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      await AsyncStorage.removeItem('token');
      router.replace('/login');
    });
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/booking?restaurantId=${item.restaurant_id}`)}
    >
      <View style={styles.iconWrap}>
        <Text style={styles.emoji}>
          {item.name.toLowerCase().includes('pizza')
            ? '🍕'
            : item.name.toLowerCase().includes('burger')
            ? '🍔'
            : item.name.toLowerCase().includes('sushi')
            ? '🍣'
            : '🍽️'}
        </Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>
          <Ionicons name="location-sharp" size={14} /> {item.location}
        </Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{item.description}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={22} color="#FF6B3C" />
          {'  '} Εστιατόρια
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => router.push('/profile')} style={styles.buttonIcon}>
            <Ionicons name="person-outline" size={18} color="#fff" />
          </TouchableOpacity>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity onPress={handleLogout} style={styles.buttonIcon}>
              <Ionicons name="log-out-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder=" Αναζήτηση εστιατορίου..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#FF6B3C" style={{ marginTop: 40 }} />
      ) : restaurants.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
          Δεν βρέθηκαν αποτελέσματα.
        </Text>
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item, index) =>
            item?.restaurant_id ? item.restaurant_id.toString() : index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  buttonIcon: {
    backgroundColor: '#FF6B3C',
    padding: 10,
    borderRadius: 100,
    elevation: 4,
    shadowColor: '#FF6B3C',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    marginBottom: 16,
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
  },
  iconWrap: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF3EE',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  emoji: {
    fontSize: 24,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  location: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  tag: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#FFEEE6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B3C',
  },
});
