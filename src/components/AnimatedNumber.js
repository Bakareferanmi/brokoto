import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text } from 'react-native';
import { naira } from '../theme';

// Counts smoothly from the old value to the new one.
export default function AnimatedNumber({ value, style, duration = 450 }) {
  const anim = useRef(new Animated.Value(value)).current;
  const [text, setText] = useState(naira(value));

  useEffect(() => {
    const id = anim.addListener(({ value: v }) => setText(naira(v)));
    return () => anim.removeListener(id);
  }, [anim]);

  useEffect(() => {
    Animated.timing(anim, { toValue: value, duration, useNativeDriver: false }).start();
  }, [value, duration, anim]);

  return <Text style={style}>{text}</Text>;
}
