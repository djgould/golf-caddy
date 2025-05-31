import { render as rtlRender, type RenderOptions } from '@testing-library/react-native';
import React, { type ReactElement } from 'react';

// Custom render function with providers
export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Add custom provider options here in the future
}

export function render(ui: ReactElement, options?: CustomRenderOptions) {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    // Wrap with providers as needed (Navigation, Theme, etc.)
    return React.createElement(React.Fragment, null, children);
  };

  return rtlRender(ui, { wrapper: AllTheProviders, ...options });
}

// Re-export everything from React Native Testing Library
export * from '@testing-library/react-native';

// Custom matchers for React Native
export const reactNativeMatchers = {
  toBeVisible(received: any) {
    const element = received?._fiber || received;
    const style = element?.memoizedProps?.style || {};

    const isVisible =
      style.display !== 'none' && style.opacity !== 0 && style.width !== 0 && style.height !== 0;

    return {
      pass: isVisible,
      message: () =>
        isVisible ? 'expected element not to be visible' : 'expected element to be visible',
    };
  },
};
