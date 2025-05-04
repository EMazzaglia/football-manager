import axios from 'axios';
import { Platform } from 'react-native';

// Select the right API URL based on platform
let BASE_URL = 'http://localhost:3000';

if (Platform.OS === 'ios') {
    // For iOS simulator connecting to Docker
    BASE_URL = 'http://localhost:3000';
} else if (Platform.OS === 'android') {
    // For Android emulator
    BASE_URL = 'http://10.0.2.2:3000';
}

// For physical devices, you'll need to use your machine's local network IP
// BASE_URL = 'http://192.168.1.100:3000';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;