import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { colors } from '../theme';

const JOLLOF = ['#E8662E', '#D8501F', '#F0883F'];

// The flat plate illustration from the design. `spin` slowly rotates it
// (small garnish dots make the rotation visible).
export default function Plate({ size = 150, colors: pc = JOLLOF, spin = false }) {
  const rot = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!spin) return undefined;
    const loop = Animated.loop(
      Animated.timing(rot, { toValue: 1, duration: 28000, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [spin, rot]);

  const rotate = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const mid = size * 0.836;
  const inner = size * 0.459;
  const dot = size * 0.07;

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.bg,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate }],
      }}
    >
      <View
        style={{
          width: mid,
          height: mid,
          borderRadius: mid / 2,
          backgroundColor: pc[0],
          borderWidth: size * 0.057,
          borderColor: pc[1],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: inner,
            height: inner,
            borderRadius: inner / 2,
            backgroundColor: pc[2],
            borderWidth: size * 0.041,
            borderColor: pc[0],
          }}
        />
        {spin &&
          [0, 1, 2].map((i) => {
            const a = (i * 2 * Math.PI) / 3;
            const r = mid * 0.3;
            return (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  width: dot,
                  height: dot,
                  borderRadius: dot / 2,
                  backgroundColor: colors.green,
                  transform: [{ translateX: Math.cos(a) * r }, { translateY: Math.sin(a) * r }],
                }}
              />
            );
          })}
      </View>
    </Animated.View>
  );
}

// Square tinted tile with a ring, used in lists.
export function Thumb({ tint, ring, size = 68 }) {
  const c = size * (44 / 68);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 16,
        backgroundColor: tint,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: c,
          height: c,
          borderRadius: c / 2,
          backgroundColor: colors.bg,
          borderWidth: size * (7 / 68),
          borderColor: ring,
        }}
      />
    </View>
  );
}
