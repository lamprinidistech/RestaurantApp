import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BASE_URL } from './config';

const foodIcons = ['🍕', '🍣', '🍝', '🍔', '🌮', '🥗', '🍜'];

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [emoji, setEmoji] = useState(foodIcons[0]);

  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const titleSlideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const runTitleSlide = () => {
    Animated.sequence([
      Animated.timing(titleSlideAnim, {
        toValue: 50,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(titleSlideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();
  };

  useEffect(() => {
    runTitleSlide();
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start();

      let next;
      do {
        next = foodIcons[Math.floor(Math.random() * foodIcons.length)];
      } while (next === emoji);
      setEmoji(next);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const animateTabChange = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      animateTabChange();
      runTitleSlide();
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });

      const message = response.data.message || 'Σύνδεση επιτυχής!';
      const token = response.data.token;

      if (!token) {
        throw new Error('Δεν ελήφθη JWT token από τον server.');
      }

      await AsyncStorage.setItem('token', token);

      if (Platform.OS === 'web') {
        window.alert(`✅ ${message}`);
      } else {
        Alert.alert('✅ Επιτυχία', message);
      }

      router.push('/restaurants');
    } catch (error) {
      const message =
        (error.response?.data && error.response.data.message) ||
        'Κάτι πήγε στραβά.';
      if (Platform.OS === 'web') {
        window.alert('❌ Σφάλμα\n' + message);
      } else {
        Alert.alert('❌ Σφάλμα', message);
      }
    }
  };

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      const message = 'Συμπλήρωσε όλα τα πεδία.';
      if (Platform.OS === 'web') {
        window.alert('❌ Σφάλμα\n' + message);
      } else {
        Alert.alert('❌ Σφάλμα', message);
      }
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/register`, {
        name,
        email,
        password,
      });

      const message = response.data.message || 'Εγγραφή επιτυχής!';
      if (Platform.OS === 'web') {
        window.alert(`✅ ${message}`);
      } else {
        Alert.alert('✅ Επιτυχία', message);
      }

      setActiveTab('login');
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      const message =
        (error.response?.data && error.response.data.message) ||
        'Κάτι πήγε στραβά.';
      if (Platform.OS === 'web') {
        window.alert('❌ Σφάλμα\n' + message);
      } else {
        Alert.alert('❌ Σφάλμα', message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.appTitle, { transform: [{ translateX: titleSlideAnim }] }]}
      >
        RestaurantApp
      </Animated.Text>

      <Animated.Text
        style={[styles.logo, { transform: [{ translateX: slideAnim }] }]}
      >
        {emoji}
      </Animated.Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => handleTabChange('login')}>
          <Text style={[styles.tab, activeTab === 'login' && styles.activeTab]}>
            <Ionicons name="log-in-outline" size={16} /> Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('signup')}>
          <Text style={[styles.tab, activeTab === 'signup' && styles.activeTab]}>
            <Ionicons name="person-add-outline" size={16} /> Sign-up
          </Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        {activeTab === 'login' ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={22}
                  color="#999"
                  style={styles.eyeIcon}
                />
              </Pressable>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={22}
                  color="#999"
                  style={styles.eyeIcon}
                />
              </Pressable>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
              <Text style={styles.loginText}>Sign up</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  logo: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    borderRadius: 30,
    padding: 4,
    marginBottom: 32,
    alignSelf: 'center',
  },
  tab: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 30,
    color: '#555',
    overflow: 'hidden',
  },
  activeTab: {
    backgroundColor: '#FF6B3C',
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    fontSize: 16,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingRight: 10,
    marginBottom: 18,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#FF6B3C',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 5,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
