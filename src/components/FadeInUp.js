import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// Entrance animation. Use `delay` to stagger lists and sections.
export default function FadeInUp({
  delay = 0,
  distance = 16,
  duration = 420,
  style,
  children,
}) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [v, delay, duration]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: v,
          transform: [
            { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
