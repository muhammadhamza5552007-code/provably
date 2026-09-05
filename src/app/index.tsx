import { useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const INITIAL_PROMPT = 'Your understanding question will appear here.';
const CHECKING_PROMPT = 'Analyzing your code... (AI integration coming in a future step)';

export default function HomeScreen() {
  const theme = useTheme();
  const [code, setCode] = useState('');
  // Tracks whether the user has asked for a check yet, so the placeholder below
  // can switch states. No analysis actually runs — that arrives with the AI step.
  const [hasRequestedCheck, setHasRequestedCheck] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">Provably</ThemedText>
          <ThemedText themeColor="textSecondary">
            Paste code you didn&apos;t write line by line, and prove you understand it.
          </ThemedText>
        </ThemedView>

        <ThemedText type="code" style={styles.sectionLabel}>
          your code
        </ThemedText>

        <TextInput
          value={code}
          onChangeText={setCode}
          multiline
          // Code should never be autocorrected or auto-capitalized.
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          accessibilityLabel="Code to check your understanding of"
          placeholder="Paste your code here…"
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.codeInput,
            { backgroundColor: theme.backgroundElement, color: theme.text },
          ]}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Check my understanding"
          onPress={() => setHasRequestedCheck(true)}
          style={({ pressed }) => pressed && styles.pressed}>
          <ThemedView type="backgroundSelected" style={styles.button}>
            <ThemedText type="smallBold">Check my understanding</ThemedText>
          </ThemedView>
        </Pressable>

        <ThemedView type="backgroundElement" style={styles.questionCard}>
          <ThemedText themeColor="textSecondary">
            {hasRequestedCheck ? CHECKING_PROMPT : INITIAL_PROMPT}
          </ThemedText>
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
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
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  header: {
    gap: Spacing.two,
  },
  sectionLabel: {
    textTransform: 'uppercase',
  },
  codeInput: {
    // Grows with the available space so long pastes stay workable on any screen.
    flex: 1,
    minHeight: 160,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    fontFamily: Fonts.mono,
    fontSize: 13,
    lineHeight: 20,
    // Android centers multiline text vertically by default.
    textAlignVertical: 'top',
  },
  pressed: {
    opacity: 0.7,
  },
  button: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.five,
    alignItems: 'center',
  },
  questionCard: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
  },
});
