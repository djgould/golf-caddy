import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '@/global.css';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../components/ui/error';
import { TRPCProvider, TRPCErrorBoundary } from '../src/hooks/api';
import { globalErrorHandler } from '../src/services/error';
import { useEffect } from 'react';
// Import network test for debugging
import '../src/utils/networkTest';
import { initDevAuth } from '../src/services/devAuth';

globalErrorHandler.initialize();

export default function RootLayout() {
  useEffect(() => {
    // Initialize development authentication
    initDevAuth();
    
    // Initialize any crash reporting service here
    // For example, if using Sentry:
    // errorLogger.initializeCrashReporter(Sentry.captureException);
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TRPCErrorBoundary>
          <TRPCProvider>
            <GluestackUIProvider mode="light">
              <SafeAreaProvider>
                <StatusBar style="auto" />
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(auth)/login"
                    options={{
                      title: 'Login',
                      presentation: 'modal',
                    }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </SafeAreaProvider>
            </GluestackUIProvider>
          </TRPCProvider>
        </TRPCErrorBoundary>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
