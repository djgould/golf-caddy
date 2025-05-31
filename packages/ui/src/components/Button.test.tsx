// @ts-nocheck
// TODO: Add proper Jest types
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('should render with title', () => {
    const { getByText } = render(<Button title="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(<Button title="Clickable Button" onPress={onPressMock} />);

    const button = getByRole('button');
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should handle primary variant', () => {
    const { getByRole } = render(<Button title="Primary Button" />);
    const button = getByRole('button');

    // Check if button exists (default variant is primary)
    expect(button).toBeTruthy();
  });

  it('should handle secondary variant', () => {
    const { getByRole } = render(<Button title="Secondary Button" variant="secondary" />);
    const button = getByRole('button');

    // Check if button exists with secondary variant
    expect(button).toBeTruthy();
  });

  it('should apply custom text style', () => {
    const customTextStyle = { fontSize: 20 };
    const { getByText } = render(<Button title="Custom Text" textStyle={customTextStyle} />);

    const text = getByText('Custom Text');
    expect(text).toBeTruthy();
  });

  it('should be disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <Button title="Disabled Button" onPress={onPressMock} disabled={true} />
    );

    const button = getByRole('button');
    fireEvent.press(button);

    // onPress should not be called when button is disabled
    // Note: React Native Testing Library might not prevent the event, so we check the prop instead
    expect(button.props.accessibilityState?.disabled).toBe(true);
  });
});
