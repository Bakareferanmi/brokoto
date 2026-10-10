import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';
import { colors, fonts } from '../theme';

// Small count bubble that pops whenever the number changes.
export default function Badge({ count, style }) {
  const s = useRef(new Animated.Value(1)).current;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    Animated.sequence([
      Animated.timing(s, { toValue: 1.35, duration: 110, useNativeDriver: true }),
      Animated.spring(s, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  }, [count, s]);

  if (!count) return null;
  return (
    <Animated.View
      style={[
        {
          minWidth: 17,
          height: 17,
          borderRadius: 9,
          paddingHorizontal: 4,
          backgroundColor: colors.brand,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1.5,
          borderColor: '#fff',
          transform: [{ scale: s }],
        },
        style,
      ]}
    >
      <Text style={{ color: '#fff', fontSize: 10, fontFamily: fonts.bodyBold }}>{count}</Text>
    </Animated.View>
  );
}
