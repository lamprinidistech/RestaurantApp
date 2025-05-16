import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BASE_URL } from './config';

const getToken = async () => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('token');
  }
  return await AsyncStorage.getItem('token');
};

export default function ProfileScreen() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchReservations = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${BASE_URL}/user/reservations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReservations(response.data);
    } catch (err) {
      Alert.alert('❌ Σφάλμα', 'Δεν ήταν δυνατή η φόρτωση των κρατήσεων.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      'Επιβεβαίωση',
      'Είσαι σίγουρος ότι θέλεις να διαγράψεις την κράτηση;',
      [
        { text: 'Ακύρωση', style: 'cancel' },
        {
          text: 'Διαγραφή',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await getToken();
              await axios.delete(`${BASE_URL}/reservations/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert('✅ Επιτυχής', 'Η κράτηση διαγράφηκε.');
              fetchReservations();
            } catch {
              Alert.alert('❌ Σφάλμα', 'Η διαγραφή απέτυχε.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const reservationDate = new Date(item.date);
    const now = new Date();
    const isPast = reservationDate < now;

    return (
      <View style={styles.card}>
        <Text style={styles.name}>{item.restaurant_name}</Text>
        <Text style={styles.detail}>📅 {item.date}</Text>
        <Text style={styles.detail}>🕒 {item.time}</Text>
        <Text style={styles.detail}>👥 {item.people_count} άτομα</Text>

        <View style={styles.actions}>
          {isPast ? (
            <Text style={styles.pastNotice}>Ολοκληρωμένη κράτηση</Text>
          ) : (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.reservation_id)}
            >
              <Ionicons name="trash" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          <Ionicons name="person-circle-outline" size={22} color="#FF6B3C" /> Προφίλ
        </Text>

        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/restaurants')}>
          <Ionicons name="arrow-back-outline" size={18} color="#fff" />
          <Text style={styles.backText}>Πίσω</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}> Ιστορικό Κρατήσεων</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6B3C" style={{ marginTop: 40 }} />
      ) : reservations.length === 0 ? (
        <Text style={styles.emptyText}>Δεν υπάρχουν κρατήσεις.</Text>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.reservation_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
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
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#FF6B3C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  backText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  deleteBtn: {
    backgroundColor: '#FF3C38',
    padding: 10,
    borderRadius: 10,
  },
  pastNotice: {
    color: '#999',
    fontStyle: 'italic',
    fontSize: 13,
    marginTop: 6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontSize: 15,
  },
});
