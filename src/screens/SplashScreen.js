import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScalePress from '../components/ScalePress';
import { colors, fonts } from '../theme';
import { MAX_W, sp } from '../layout';

function Dot({ delay }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(v, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.delay(400 - delay),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [v, delay]);
  return (
    <Animated.View
      style={{
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: colors.brand,
        opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
        transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
      }}
    />
  );
}

export default function SplashScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const logo = useRef(new Animated.Value(0)).current;
  const word = useRef(new Animated.Value(0)).current;
  const dots = useRef(new Animated.Value(0)).current;
  const btn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(logo, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
      Animated.timing(word, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(dots, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(btn, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(() => navigation.replace('Tabs'), 3200);
    return () => clearTimeout(t);
  }, [logo, word, dots, btn, navigation]);

  const rise = (v) => ({
    opacity: v,
    transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
  });

  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <Animated.Image
          source={require('../../assets/logo.png')}
          style={{
            width: sp(120),
            height: sp(120),
            opacity: logo,
            transform: [
              { scale: logo.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }) },
              { rotate: logo.interpolate({ inputRange: [0, 1], outputRange: ['-8deg', '0deg'] }) },
            ],
          }}
          resizeMode="contain"
          accessibilityLabel="Brokoto logo"
        />
        <Animated.Text style={[styles.word, rise(word)]}>Brokoto</Animated.Text>
        <Animated.View style={[styles.dots, rise(dots)]}>
          <Dot delay={0} />
          <Dot delay={150} />
          <Dot delay={300} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.btnWrap, { bottom: Math.max(insets.bottom, 16) + sp(24) }, rise(btn)]}>
        <View style={styles.btnInner}>
          <ScalePress onPress={() => navigation.replace('Tabs')} accessibilityRole="button" style={styles.btn}>
            <Text style={styles.btnText}>Get started</Text>
          </ScalePress>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: sp(16), paddingBottom: sp(56) },
  word: { fontFamily: fonts.display, fontSize: sp(34), letterSpacing: -1, color: colors.brand, textAlign: 'center' },
  dots: { flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center' },
  btnWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  btnInner: { width: '100%', maxWidth: MAX_W, paddingHorizontal: sp(20) },
  btn: { height: sp(48), borderRadius: 999, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontFamily: fonts.bodyBold, fontSize: sp(15) },
});
