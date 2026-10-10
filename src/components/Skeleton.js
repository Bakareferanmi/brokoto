import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { colors } from '../theme';
import { sp } from '../layout';

// Pulsing placeholder block shown while content "loads".
export function Skeleton({ width = '100%', height = 16, radius = 8, style }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [v]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: '#E9DFCD',
          opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] }),
        },
        style,
      ]}
    />
  );
}

// Skeleton that mirrors a restaurant / cart row.
export function RowSkeleton() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: sp(12),
        padding: sp(8),
        backgroundColor: colors.card,
        borderRadius: sp(16),
        borderWidth: 1,
        borderColor: colors.line,
      }}
    >
      <Skeleton width={sp(56)} height={sp(56)} radius={sp(12)} />
      <View style={{ flex: 1, gap: 8 }}>
        <Skeleton width="70%" height={14} />
        <Skeleton width="45%" height={11} />
      </View>
      <Skeleton width={52} height={12} />
    </View>
  );
}

// Fallback shown while a lazily loaded screen's code is fetched.
export function ScreenSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: sp(20), paddingTop: 64, gap: 14 }}>
      <Skeleton width="50%" height={26} radius={8} />
      <Skeleton height={sp(140)} radius={sp(20)} />
      <RowSkeleton />
      <RowSkeleton />
    </View>
  );
}
