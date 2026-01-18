import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ENDPOINTS } from '@/constants/api';
import { AuthStorage } from '@/utils/storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; username?: string }>({});
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        const newErrors: { email?: string; password?: string; confirmPassword?: string; username?: string } = {};

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        }


        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(ENDPOINTS.SIGNUP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ ...errors, email: data.error || 'Failed to create account' });
                if (Platform.OS === 'web') {
                    window.alert(data.error || 'Failed to create account');
                } else {
                    Alert.alert('Error', data.error || 'Failed to create account');
                }
                return;
            }

            if (Platform.OS === 'web') {
                window.alert('Account created successfully! Please login.');
                router.replace('/login');
            } else {
                Alert.alert('Success', 'Account created successfully! Please login.', [
                    { text: 'OK', onPress: () => router.replace('/login') }
                ]);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to connect to server';
            if (Platform.OS === 'web') {
                window.alert(errorMessage);
            } else {
                Alert.alert('Error', errorMessage);
            }
            console.error('Signup error:', error);
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
                        Create Account
                    </ThemedText>
                    <ThemedText type="subtitle" style={styles.subtitle}>
                        Join MyDailyPlanner
                    </ThemedText>

                    <ThemedView style={styles.form}>
                        <ThemedView style={styles.inputContainer}>
                            <ThemedText style={styles.label}>Username</ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.background,
                                        color: colors.text,
                                        borderColor: errors.username ? '#ff4444' : colors.icon + '40',
                                    },
                                ]}
                                placeholder="Enter your username"
                                placeholderTextColor={colors.icon}
                                value={username}
                                onChangeText={(text) => {
                                    setUsername(text);
                                    if (errors.username) {
                                        setErrors({ ...errors, username: undefined });
                                    }
                                }}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {errors.username && (
                                <ThemedText style={styles.errorText}>{errors.username}</ThemedText>
                            )}
                        </ThemedView>

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
                                placeholder="Create a password (min 6 chars)"
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

                        <ThemedView style={styles.inputContainer}>
                            <ThemedText style={styles.label}>Confirm Password</ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.background,
                                        color: colors.text,
                                        borderColor: errors.confirmPassword ? '#ff4444' : colors.icon + '40',
                                    },
                                ]}
                                placeholder="Confirm your password"
                                placeholderTextColor={colors.icon}
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    if (errors.confirmPassword) {
                                        setErrors({ ...errors, confirmPassword: undefined });
                                    }
                                }}
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {errors.confirmPassword && (
                                <ThemedText style={styles.errorText}>{errors.confirmPassword}</ThemedText>
                            )}
                        </ThemedView>

                        <TouchableOpacity
                            style={[styles.signupButton, { backgroundColor: colors.tint }]}
                            onPress={handleSignup}>
                            <ThemedText style={styles.signupButtonText}>Sign Up</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginLink}
                            onPress={() => router.back()}>
                            <ThemedText style={styles.loginLinkText}>
                                Already have an account? <ThemedText style={{ color: colors.tint, fontWeight: 'bold' }}>Login</ThemedText>
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
        marginBottom: 32,
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
    signupButton: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    signupButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    loginLink: {
        marginTop: 16,
        alignItems: 'center',
    },
    loginLinkText: {
        fontSize: 14,
    },
});
