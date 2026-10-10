import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';
import Feather from '../components/Icon';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScalePress from '../components/ScalePress';
import FadeInUp from '../components/FadeInUp';
import { Skeleton } from '../components/Skeleton';
import useLazy from '../hooks/useLazy';
import { useLocation } from '../context/LocationContext';
import { colors, fonts } from '../theme';
import { CONTENT_W, SCREEN_W, sp, wrap } from '../layout';

const START_MIN = 18;
// Demo: one "minute" passes every 4 seconds so you can watch the whole journey.
const TICK_MS = 4000;
const RIDER_NAME = 'Feranmi';

// Route and map furniture in design coordinates (390 x 330).
const ROUTE = [
  [70, 250],
  [70, 200],
  [230, 200],
  [230, 90],
  [330, 90],
];
const STEPS = [
  { title: 'Order confirmed', sub: 'Smoke & Spice Grill accepted your order' },
  { title: 'Being prepared', sub: 'Grilled and packed' },
  { title: 'On the way', sub: 'Your rider is heading to Lekki Phase 1' },
  { title: 'Delivered', sub: 'Enjoy your meal' },
];

const MAP_S = CONTENT_W / 390;
const MAP_H = Math.round(300 * MAP_S);

function segments() {
  const segs = [];
  let total = 0;
  for (let i = 0; i < ROUTE.length - 1; i += 1) {
    const [x1, y1] = ROUTE[i];
    const [x2, y2] = ROUTE[i + 1];
    const len = Math.abs(x2 - x1) + Math.abs(y2 - y1);
    segs.push({ x1, y1, x2, y2, len });
    total += len;
  }
  return { segs, total };
}

function Pulse({ size, color, style }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(v, { toValue: 1, duration: 1400, easing: Easing.out(Easing.quad), useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [v]);
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] }),
          transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.6, 2] }) }],
        },
        style,
      ]}
    />
  );
}

function RouteMap({ navigation, progress, top }) {
  const s = MAP_S;
  const { segs, total } = useMemo(segments, []);

  const dots = useMemo(() => {
    const out = [];
    segs.forEach((sg) => {
      const n = Math.floor(sg.len / 12);
      for (let i = 0; i <= n; i += 1) {
        const t = i / Math.max(n, 1);
        out.push([sg.x1 + (sg.x2 - sg.x1) * t, sg.y1 + (sg.y2 - sg.y1) * t]);
      }
    });
    return out;
  }, [segs]);

  const { input, xs, ys } = useMemo(() => {
    let acc = 0;
    const inp = [0];
    const x = [ROUTE[0][0] * s];
    const y = [ROUTE[0][1] * s];
    segs.forEach((sg, i) => {
      acc += sg.len;
      inp.push(acc / total);
      x.push(ROUTE[i + 1][0] * s);
      y.push(ROUTE[i + 1][1] * s);
    });
    return { input: inp, xs: x, ys: y };
  }, [segs, total, s]);

  const R = 15;
  const tx = progress.interpolate({ inputRange: input, outputRange: xs.map((v) => v - R) });
  const ty = progress.interpolate({ inputRange: input, outputRange: ys.map((v) => v - R) });
  const abs = (x, y, w, h, extra) => ({ position: 'absolute', left: x * s, top: y * s, width: w * s, height: h * s, ...extra });

  return (
    <View style={{ width: SCREEN_W, height: MAP_H, backgroundColor: colors.map, overflow: 'hidden', alignItems: 'center' }}>
      <View style={{ width: CONTENT_W, height: MAP_H }}>
        {[90, 200].map((y) => (
          <View key={`h${y}`} style={abs(-10, y - 8, 410, 16, { backgroundColor: colors.bg })} />
        ))}
        {[70, 230, 330].map((x) => (
          <View key={`v${x}`} style={abs(x - 8, -10, 16, 350, { backgroundColor: colors.bg })} />
        ))}
        <View style={abs(90, 110, 120, 70, { backgroundColor: colors.greenTint, borderRadius: 10 * s })} />
        {dots.map(([x, y], i) => (
          <View key={i} style={{ position: 'absolute', left: x * s - 2, top: y * s - 2, width: 4, height: 4, borderRadius: 2, backgroundColor: colors.brand }} />
        ))}
        <View style={{ position: 'absolute', left: 70 * s - 10, top: 250 * s - 10, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.bg }} />
        </View>
        <View style={{ position: 'absolute', left: 330 * s - 13, top: 90 * s - 13, width: 26, height: 26, alignItems: 'center', justifyContent: 'center' }}>
          <Pulse size={26} color={colors.brand} />
          <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' }} />
          </View>
        </View>
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: R * 2,
            height: R * 2,
            borderRadius: R,
            backgroundColor: '#fff',
            borderWidth: 2,
            borderColor: colors.brand,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ translateX: tx }, { translateY: ty }],
          }}
        >
          <MaterialCommunityIcons name="moped" size={17} color={colors.brand} />
        </Animated.View>
      </View>

      <ScalePress
        onPress={() => navigation.navigate('Home')}
        accessibilityRole="button"
        accessibilityLabel="Back to home"
        outerStyle={{ position: 'absolute', left: sp(20), top: top + sp(10) }}
        style={styles.back}
      >
        <Feather name="arrow-left" size={sp(18)} color={colors.ink} />
      </ScalePress>
    </View>
  );
}

function Step({ title, sub, state, filled, last }) {
  const fill = useRef(new Animated.Value(filled ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(fill, { toValue: filled ? 1 : 0, duration: 700, useNativeDriver: false }).start();
  }, [filled, fill]);

  const done = state === 'done';
  const now = state === 'now';
  return (
    <View style={{ flexDirection: 'row', gap: sp(12) }}>
      <View style={{ alignItems: 'center', width: 20 }}>
        <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
          {now && <Pulse size={20} color={colors.brand} />}
          <View
            style={[
              styles.dot,
              done && { backgroundColor: colors.green, borderWidth: 0 },
              now && { borderWidth: 3, borderColor: colors.brand },
              !done && !now && { borderWidth: 2, borderColor: colors.dash },
            ]}
          >
            {done && <Feather name="check" size={12} color="#fff" />}
          </View>
        </View>
        {!last && (
          <View style={styles.line}>
            <Animated.View style={{ width: 2, backgroundColor: colors.green, height: fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} />
          </View>
        )}
      </View>
      <View style={{ flex: 1, gap: 1, paddingBottom: sp(12) }}>
        <Text style={{ fontFamily: state === 'next' ? fonts.bodyMedium : fonts.bodyBold, fontSize: sp(14.5), color: state === 'next' ? colors.muted : colors.ink }}>{title}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
    </View>
  );
}

export default function TrackingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { selected } = useLocation();
  const [minutes, setMinutes] = useState(START_MIN);
  const mapLoading = useLazy(700, []);
  const progress = useRef(new Animated.Value(0.12)).current;

  useEffect(() => {
    const id = setInterval(() => setMinutes((m) => Math.max(0, m - 1)), TICK_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 0.12 + 0.88 * (1 - minutes / START_MIN),
      duration: TICK_MS * 0.9,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [minutes, progress]);

  const current = minutes > 0 ? 2 : 3;
  const delivered = minutes === 0;
  const stateOf = (i) => (i < current || (delivered && i === 3) ? 'done' : i === current ? 'now' : 'next');
  const mapH = MAP_H;

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: sp(24) }} showsVerticalScrollIndicator={false}>
      <View>
        {mapLoading ? <Skeleton height={mapH} radius={0} /> : <RouteMap navigation={navigation} progress={progress} top={insets.top} />}
      </View>

      <View style={[wrap, styles.sheet]}>
        <FadeInUp style={styles.etaRow}>
          <View style={{ gap: 2 }}>
            <Text style={styles.eyebrow}>{delivered ? 'STATUS' : 'ARRIVING IN'}</Text>
            <Text style={styles.eta}>{delivered ? 'Delivered' : `${minutes} min`}</Text>
          </View>
          <View style={[styles.badge, delivered && { backgroundColor: colors.green }]}>
            <Text style={[styles.badgeText, delivered && { color: '#fff' }]}>{delivered ? 'Delivered' : 'On the way'}</Text>
          </View>
        </FadeInUp>

        <View>
          {STEPS.map((st, i) => (
            <FadeInUp key={st.title} delay={120 + i * 90}>
              <Step title={st.title} sub={i === 2 ? 'Your rider is heading to ' + selected.line : st.sub} state={stateOf(i)} filled={i < current || (delivered && i < 3)} last={i === STEPS.length - 1} />
            </FadeInUp>
          ))}
        </View>

        <FadeInUp delay={520} style={styles.rider}>
          <View style={styles.avatar}>
            <Feather name="user" size={sp(20)} color={colors.ink} />
          </View>
          <View style={{ flex: 1, gap: 1 }}>
            <Text style={styles.riderName}>{RIDER_NAME}</Text>
            <Text style={styles.sub}>Your rider</Text>
          </View>
          <ScalePress accessibilityRole="button" accessibilityLabel="Message rider" style={[styles.round, { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line2 }]}>
            <Feather name="message-square" size={sp(16)} color={colors.ink} />
          </ScalePress>
          <ScalePress accessibilityRole="button" accessibilityLabel="Call rider" style={[styles.round, { backgroundColor: colors.brand }]}>
            <Feather name="phone" size={sp(16)} color="#fff" />
          </ScalePress>
        </FadeInUp>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  back: { width: sp(40), height: sp(40), borderRadius: sp(20), backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  sheet: { marginTop: -sp(22), backgroundColor: colors.bg, borderTopLeftRadius: sp(24), borderTopRightRadius: sp(24), paddingHorizontal: sp(20), paddingTop: sp(20), gap: sp(14) },
  etaRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  eyebrow: { fontFamily: fonts.bodyMedium, fontSize: sp(11), letterSpacing: 0.6, color: colors.muted },
  eta: { fontFamily: fonts.display, fontSize: sp(30), lineHeight: sp(34), letterSpacing: -0.5, color: colors.ink },
  badge: { backgroundColor: colors.greenTint, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { fontFamily: fonts.bodyBold, fontSize: sp(12), color: colors.greenInk },
  dot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  line: { flex: 1, width: 2, minHeight: 10, backgroundColor: colors.dash, marginVertical: 2, overflow: 'hidden' },
  sub: { fontFamily: fonts.body, fontSize: sp(12), color: colors.muted },
  rider: { flexDirection: 'row', alignItems: 'center', gap: sp(12), padding: sp(10), paddingHorizontal: sp(12), backgroundColor: '#fff', borderRadius: sp(16), borderWidth: 1, borderColor: colors.line, marginTop: sp(8), marginBottom: sp(8) },
  avatar: { width: sp(42), height: sp(42), borderRadius: sp(21), backgroundColor: colors.sand, alignItems: 'center', justifyContent: 'center' },
  riderName: { fontFamily: fonts.bodyBold, fontSize: sp(14.5), color: colors.ink },
  round: { width: sp(40), height: sp(40), borderRadius: sp(20), alignItems: 'center', justifyContent: 'center' },
});
