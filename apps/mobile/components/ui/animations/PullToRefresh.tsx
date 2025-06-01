import React, { useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  refreshing?: boolean;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  refreshing = false,
  className = '',
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = Math.min(event.translationY * 0.5, 100);
        scale.value = 1 + Math.min(event.translationY * 0.001, 0.1);
      }
    })
    .onEnd((event) => {
      if (event.translationY > 80 && !isRefreshing) {
        runOnJS(handleRefresh)();
      }

      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      });
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 100,
      });
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle} className={className}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing || refreshing}
              onRefresh={handleRefresh}
              tintColor="#10b981"
              colors={['#10b981']}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
};
