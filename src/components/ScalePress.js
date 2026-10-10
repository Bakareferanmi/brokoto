import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

// Press feedback: springs down on press-in, back up on release.
export default function ScalePress({
  onPress,
  style,
  outerStyle,
  children,
  scaleTo = 0.96,
  ...rest
}) {
  const s = useRef(new Animated.Value(1)).current;
  const to = (v) =>
    Animated.spring(s, {
      toValue: v,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => to(scaleTo)}
      onPressOut={() => to(1)}
      style={outerStyle}
      {...rest}
    >
      <Animated.View style={[style, { transform: [{ scale: s }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
