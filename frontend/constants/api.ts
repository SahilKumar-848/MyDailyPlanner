import { Platform } from 'react-native';

/**
 * API Base URL
 * - Android Emulator: http://10.0.2.2:5000
 * - iOS Simulator: http://localhost:5000
 * - Web: http://localhost:5000
 * - Physical Device: Replace with your machine's local IP address (e.g., http://192.168.1.5:5000)
 */
export const API_BASE_URL = Platform.select({
    android: 'http://192.168.0.107:5000', // Use LAN IP for physical Android device
    ios: 'http://192.168.0.107:5000',     // Use LAN IP for physical iOS device
    web: 'http://localhost:5000',
    default: 'http://192.168.0.107:5000', // Fallback to LAN IP
});

export const ENDPOINTS = {
    SIGNUP: `${API_BASE_URL}/signup`,
    LOGIN: `${API_BASE_URL}/login`,
};
