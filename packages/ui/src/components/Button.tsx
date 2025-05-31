import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

export interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary';
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  style,
  textStyle,
  ...props
}) => {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        style as ViewStyle,
      ]}
      {...props}
    >
      <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#E5E5EA',
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#000000',
  },
});
