import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BASE_URL } from './config';

export default function BookingScreen() {
  const { restaurantId } = useLocalSearchParams();
  const router = useRouter();

  const [restaurantName, setRestaurantName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const today = new Date();
  const daysAhead = Array.from({ length: 14 }).map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    return {
      label: date.toLocaleDateString('en-GB', { weekday: 'short' }),
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
    };
  });

  const timeOptions = [
    '08:30 - 10:30',
    '10:30 - 12:30',
    '15:00 - 17:00',
    '17:00 - 19:00',
    '19:00 - 21:00',
    '21:00 - 00:00',
  ];

  const getEmoji = (name) => {
    if (!name) return '🍽️';
    const lower = name.toLowerCase();
    if (lower.includes('pizza')) return '🍕';
    if (lower.includes('burger')) return '🍔';
    if (lower.includes('sushi')) return '🍣';
    if (lower.includes('pasta')) return '🍝';
    if (lower.includes('taco')) return '🌮';
    if (lower.includes('salad')) return '🥗';
    return '🍽️';
  };

  useEffect(() => {
    const fetchRestaurantName = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/restaurants`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const restaurant = response.data.find(
          (r) => r.restaurant_id?.toString() === restaurantId
        );
        if (restaurant) setRestaurantName(restaurant.name);
      } catch {
        setRestaurantName('Εστιατόριο');
      }
    };
    fetchRestaurantName();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const animateBounce = () => {
    bounceAnim.setValue(0.9);
    Animated.spring(bounceAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      return Alert.alert('⚠️ Παρακαλώ επίλεξε ημερομηνία και ώρα για την κράτησή σου.');
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${BASE_URL}/reservations`,
        {
          restaurant_id: restaurantId,
          date: selectedDate,
          time: selectedTime.split(' - ')[0],
          people_count: peopleCount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('✅ Επιτυχής κράτηση! Σου ευχόμαστε καλή όρεξη 🍽️');
      router.push('/restaurants');
    } catch {
        Alert.alert('❌ Κάτι πήγε στραβά. Δοκίμασε ξανά ή έλεγξε τη σύνδεσή σου.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              animateBounce();
              router.back();
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#FF6B3C" />
          </TouchableOpacity>
          <Text style={styles.header}>
            {getEmoji(restaurantName)} Κράτηση σε {restaurantName}
          </Text>
        </View>

        <View style={styles.previewBox}>
          <Text style={styles.previewText}>{selectedDate || 'Ημ/νία'} | {selectedTime || 'Ώρα'} | {peopleCount} άτομα</Text>
        </View>

        <Text style={styles.label}>Ημερομηνία</Text>
        <FlatList
          horizontal
          data={daysAhead}
          keyExtractor={(item) => item.date}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.dateItem, selectedDate === item.date && styles.selectedDate]}
              onPress={() => setSelectedDate(item.date)}
            >
              <Text style={[styles.dateLabel, selectedDate === item.date && styles.selectedText]}>
                {item.label}
              </Text>
              <Text style={[styles.dateNumber, selectedDate === item.date && styles.selectedText]}>
                {item.day}
              </Text>
            </TouchableOpacity>
          )}
        />

        <Text style={styles.label}>Ώρα</Text>
        <View style={styles.timeGrid}>
          {timeOptions.map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.timeSlot, selectedTime === time && styles.selectedTimeSlot]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[styles.timeText, selectedTime === time && styles.selectedText]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Άτομα</Text>
        <View style={styles.peopleRow}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => setPeopleCount(Math.max(1, peopleCount - 1))}
          >
            <Ionicons name="remove" size={20} color="#FF6B3C" />
          </TouchableOpacity>
          <Text style={styles.peopleCount}>{peopleCount}</Text>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => setPeopleCount(peopleCount + 1)}
          >
            <Ionicons name="add" size={20} color="#FF6B3C" />
          </TouchableOpacity>
        </View>

        <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleBooking} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmText}>Confirm</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 100,
    paddingBottom: 100,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginRight: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  previewBox: {
    backgroundColor: '#f1f1f1',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 24,
  },
  previewText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  dateList: {
    marginBottom: 20,
  },
  dateItem: {
    width: 60,
    height: 80,
    borderRadius: 14,
    backgroundColor: '#f1f1f1',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDate: {
    backgroundColor: '#FF6B3C',
  },
  dateLabel: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  selectedText: {
    color: '#fff',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    marginBottom: 30,
  },
  timeSlot: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#FF6B3C',
  },
  timeText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  peopleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  counterBtn: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
  },
  peopleCount: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 20,
  },
  confirmButton: {
    backgroundColor: '#FF6B3C',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
