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

function validateLogin(email: string, password: string): string | null {
  if (!email.trim()) return 'Enter your email address.';
  if (!isValidEmail(email)) return 'Enter a valid email address.';
  if (!password) return 'Enter your password.';
  return null;
}

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogIn() {
    if (isSubmitting) return;

    const validationError = validateLogin(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
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
          <ThemedText type="subtitle">Log in</ThemedText>
          <ThemedText themeColor="textSecondary">
            Log in to continue verifying your understanding.
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
          textContentType="password"
          autoComplete="current-password"
          accessibilityLabel="Password"
          placeholder="Password"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
        />

        {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log in"
          disabled={isSubmitting}
          onPress={handleLogIn}
          style={({ pressed }) => [pressed && styles.pressed, isSubmitting && styles.disabled]}>
          <ThemedView type="backgroundSelected" style={styles.button}>
            <ThemedText type="smallBold">{isSubmitting ? 'Logging in…' : 'Log in'}</ThemedText>
          </ThemedView>
        </Pressable>

        <ThemedView style={styles.footer}>
          <ThemedText themeColor="textSecondary">Don&apos;t have an account?</ThemedText>
          <Link href="/signup">
            <ThemedText type="linkPrimary">Sign up</ThemedText>
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
