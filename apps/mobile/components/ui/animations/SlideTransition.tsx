import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SlideTransitionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export const SlideTransition: React.FC<SlideTransitionProps> = ({
  children,
  direction = 'right',
  duration = 300,
  onSwipeLeft,
  onSwipeRight,
  className = '',
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const initialOffset = getInitialOffset(direction);

    if (direction === 'left' || direction === 'right') {
      translateX.value = initialOffset;
      translateX.value = withTiming(0, {
        duration,
        easing: Easing.out(Easing.quad),
      });
    } else {
      translateY.value = initialOffset;
      translateY.value = withTiming(0, {
        duration,
        easing: Easing.out(Easing.quad),
      });
    }

    opacity.value = withTiming(1, {
      duration: duration * 0.8,
      easing: Easing.out(Easing.quad),
    });
  }, [direction, duration, translateX, translateY, opacity]);

  const getInitialOffset = (dir: string): number => {
    switch (dir) {
      case 'left':
        return -SCREEN_WIDTH;
      case 'right':
        return SCREEN_WIDTH;
      case 'up':
        return -100;
      case 'down':
        return 100;
      default:
        return SCREEN_WIDTH;
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const swipeThreshold = SCREEN_WIDTH * 0.3;

      if (event.translationX > swipeThreshold && onSwipeRight) {
        translateX.value = withTiming(
          SCREEN_WIDTH,
          {
            duration: 200,
          },
          () => {
            runOnJS(onSwipeRight)();
          }
        );
      } else if (event.translationX < -swipeThreshold && onSwipeLeft) {
        translateX.value = withTiming(
          -SCREEN_WIDTH,
          {
            duration: 200,
          },
          () => {
            runOnJS(onSwipeLeft)();
          }
        );
      } else {
        translateX.value = withTiming(0, {
          duration: 200,
          easing: Easing.out(Easing.quad),
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyle, { flex: 1 }]} className={className}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
