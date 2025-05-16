import { Platform } from 'react-native';

const LOCAL_IP = '192.168.1.5'; 

export const BASE_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000/api'
    : `http://${LOCAL_IP}:3000/api`;
