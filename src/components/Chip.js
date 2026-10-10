import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import ScalePress from './ScalePress';
import { colors, fonts } from '../theme';
import { sp } from '../layout';

// Selectable pill. Colours cross-fade between selected / unselected.
export default function Chip({ label, active, onPress, radius = 999, minHeight = sp(36), px = sp(16), fill = false }) {
  const a = useRef(new Animated.Value(active ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(a, { toValue: active ? 1 : 0, duration: 220, useNativeDriver: false }).start();
  }, [active, a]);

  const bg = a.interpolate({ inputRange: [0, 1], outputRange: ['#FFFFFF', colors.ink] });
  const bd = a.interpolate({ inputRange: [0, 1], outputRange: [colors.line2, colors.ink] });
  const tc = a.interpolate({ inputRange: [0, 1], outputRange: [colors.ink, colors.bg] });

  return (
    <ScalePress
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      outerStyle={fill ? { flex: 1 } : undefined}
    >
      <Animated.View
        style={{
          minHeight,
          paddingHorizontal: px,
          borderRadius: radius,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bg,
          borderColor: bd,
        }}
      >
        <Animated.Text style={{ fontFamily: fonts.bodyMedium, fontSize: sp(13), color: tc }}>
          {label}
        </Animated.Text>
      </Animated.View>
    </ScalePress>
  );
}
