import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface PressableScaleProps extends PressableProps {
  children: React.ReactNode;
  scaleValue?: number;
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const PressableScale: React.FC<PressableScaleProps> = ({
  children,
  scaleValue = 0.95,
  className = '',
  onPressIn,
  onPressOut,
  ...pressableProps
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = (event: any) => {
    scale.value = withSpring(scaleValue, {
      damping: 15,
      stiffness: 200,
    });
    opacity.value = withTiming(0.8, { duration: 100 });
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
    opacity.value = withTiming(1, { duration: 150 });
    onPressOut?.(event);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <AnimatedPressable
      style={animatedStyle}
      className={className}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...pressableProps}
    >
      {children}
    </AnimatedPressable>
  );
};
