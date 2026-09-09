import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';
import { isValidEmail } from '@/lib/validation';

const MIN_PASSWORD_LENGTH = 8;

function validateSignup(email: string, password: string, confirmPassword: string): string | null {
  if (!email.trim()) return 'Enter your email address.';
  if (!isValidEmail(email)) return 'Enter a valid email address.';
  if (!password) return 'Enter a password.';
  if (password.length < MIN_PASSWORD_LENGTH) return 'Password must be at least 8 characters.';
  if (!confirmPassword) return 'Confirm your password.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return null;
}

export default function SignupScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignUp() {
    if (isSubmitting) return;

    const validationError = validateSignup(email, password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      router.replace('/');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">Sign up</ThemedText>
          <ThemedText themeColor="textSecondary">
            Create an account to start verifying your understanding.
          </ThemedText>
        </ThemedView>

        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Email"
          placeholder="Email"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="newPassword"
          autoComplete="new-password"
          accessibilityLabel="Password"
          placeholder="Password"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
        />

        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          textContentType="newPassword"
          autoComplete="new-password"
          accessibilityLabel="Confirm password"
          placeholder="Confirm password"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
        />

        {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sign up"
          disabled={isSubmitting}
          onPress={handleSignUp}
          style={({ pressed }) => [pressed && styles.pressed, isSubmitting && styles.disabled]}>
          <ThemedView type="backgroundSelected" style={styles.button}>
            <ThemedText type="smallBold">{isSubmitting ? 'Signing up…' : 'Sign up'}</ThemedText>
          </ThemedView>
        </Pressable>

        <ThemedView style={styles.footer}>
          <ThemedText themeColor="textSecondary">Already have an account?</ThemedText>
          <Link href="/login">
            <ThemedText type="linkPrimary">Log in</ThemedText>
          </Link>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  header: {
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  input: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    fontSize: 16,
  },
  errorText: {
    color: '#e5484d',
  },
  button: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.five,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
});
