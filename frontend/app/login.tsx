/**
 * Login Screen Component
 * Handles user authentication with email and password
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ENDPOINTS } from '@/constants/api';
import { AuthStorage } from '@/utils/storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Load saved credentials if remember me was enabled
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const authState = await AuthStorage.getAuthState();
      const rememberMeValue = await AuthStorage.getRememberMe();

      if (authState && rememberMeValue && authState.isAuthenticated && authState.token) {
        setEmail(authState.user?.email || '');
        setRememberMe(true);
        // Auto-login with token (simply navigate for now)
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Invalid credentials';
        if (Platform.OS === 'web') {
          window.alert(errorMessage);
        } else {
          Alert.alert('Error', errorMessage);
        }
        return;
      }

      const authState = {
        isAuthenticated: true,
        user: data.user,
        token: data.token,
        rememberMe,
      };

      if (rememberMe) {
        await AuthStorage.saveAuthState(authState);
        await AuthStorage.saveRememberMe(true);
      } else {
        await AuthStorage.clearAuthState(); // Clear previous state if not remembering
        // But wait, if we don't remember, we still need to be logged in for the session.
        // The previous logic was clearing auth state if !rememberMe.
        // Usually we want to save auth state in memory or storage regardless, but "remember me" controls persistence across restarts.
        // For now, I'll save it to storage to keep the session active, but I might need to clear it on app close if !rememberMe (not easy in RN).
        // I'll just save it to storage for now as the app relies on it for "is authenticated".
        // Use a different key or mechanism if strict session vs persistent is needed. 
        // Adapting to existing pattern: 
        await AuthStorage.saveAuthState(authState);
        await AuthStorage.saveRememberMe(false);
      }

      // Navigate to main screen
      router.replace('/(tabs)');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
      if (Platform.OS === 'web') {
        window.alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
      console.error('Login error:', error);
    }
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Daily Planner
          </ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Sign in to continue
          </ThemedText>


          <ThemedView style={styles.form}>
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: errors.email ? '#ff4444' : colors.icon + '40',
                  },
                ]}
                placeholder="Enter your email"
                placeholderTextColor={colors.icon}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.email && (
                <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
              )}
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: errors.password ? '#ff4444' : colors.icon + '40',
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={colors.icon}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.password && (
                <ThemedText style={styles.errorText}>{errors.password}</ThemedText>
              )}
            </ThemedView>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}>
              <ThemedView
                style={[
                  styles.checkbox,
                  rememberMe && { backgroundColor: colors.tint },
                ]}>
                {rememberMe && (
                  <ThemedText style={styles.checkmark}>✓</ThemedText>
                )}
              </ThemedView>
              <ThemedText style={styles.checkboxLabel}>Remember Me</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: colors.tint }]}
              onPress={handleLogin}>
              <ThemedText style={styles.loginButtonText}>Login</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signupLink}
              onPress={() => router.push('/signup')}>
              <ThemedText style={styles.signupLinkText}>
                Don't have an account? <ThemedText style={{ color: colors.tint, fontWeight: 'bold' }}>Sign Up</ThemedText>
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.7,
  },

  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#0a7ea4',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
  },
  loginButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  signupLink: {
    marginTop: 8,
    alignItems: 'center',
  },
  signupLinkText: {
    fontSize: 14,
  },
});

