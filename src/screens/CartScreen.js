import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import Feather from '../components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScalePress from '../components/ScalePress';
import FadeInUp from '../components/FadeInUp';
import AnimatedNumber from '../components/AnimatedNumber';
import LazyImage from '../components/LazyImage';
import Plate from '../components/Plate';
import { RowSkeleton } from '../components/Skeleton';
import useLazy from '../hooks/useLazy';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { unsplash } from '../data';
import { colors, fonts, naira } from '../theme';
import { sp, wrap } from '../layout';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DELIVERY = 800;
const PROMO_CODE = 'BROKOTO10'; // demo code: 10% off

function CartItem({ item, index, onQty }) {
  return (
    <FadeInUp delay={index * 90}>
      <View style={styles.item}>
        <LazyImage uri={unsplash(item.image, 240)} radius={sp(12)} fallback={item.tint} style={{ width: sp(56), height: sp(56) }} />
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.itemNote}>{item.note}</Text>
          <Text style={styles.itemPrice}>{naira(item.unit * item.qty)}</Text>
        </View>
        <View style={styles.pill}>
          <Pressable onPress={() => onQty(item.key, item.qty - 1)} accessibilityRole="button" accessibilityLabel={`Remove one ${item.name}`} hitSlop={10}>
            <Feather name={item.qty === 1 ? 'trash-2' : 'minus'} size={sp(14)} color={colors.ink} />
          </Pressable>
          <Text style={styles.pillText}>×{item.qty}</Text>
          <Pressable onPress={() => onQty(item.key, Math.min(item.qty + 1, 20))} accessibilityRole="button" accessibilityLabel={`Add one ${item.name}`} hitSlop={10}>
            <Feather name="plus" size={sp(14)} color={colors.ink} />
          </Pressable>
        </View>
      </View>
    </FadeInUp>
  );
}

export default function CartScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { items, subtotal, dispatch } = useCart();
  const { selected } = useLocation();
  const loading = useLazy(700, []);
  const [code, setCode] = useState('');
  const [promo, setPromo] = useState(false);
  const [bad, setBad] = useState(false);
  const [placing, setPlacing] = useState(false);
  const shake = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const discount = promo ? Math.round(subtotal * 0.1) : 0;
  const total = items.length ? subtotal - discount + DELIVERY : 0;

  const setQty = (key, qty) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch({ type: 'SET_QTY', key, qty });
  };

  const applyPromo = () => {
    if (code.trim().toUpperCase() === PROMO_CODE) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setPromo(true);
      setBad(false);
    } else {
      setBad(true);
      Animated.sequence(
        [10, -10, 8, -8, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))
      ).start();
    }
  };

  const placeOrder = () => {
    if (placing || !items.length) return;
    setPlacing(true);
    timer.current = setTimeout(() => {
      dispatch({ type: 'PLACE', total });
      setPlacing(false);
      navigation.navigate('Orders');
    }, 900);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[wrap, { paddingTop: insets.top + sp(10), paddingHorizontal: sp(20), paddingBottom: sp(20), gap: sp(16) }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FadeInUp style={styles.titleRow}>
          <ScalePress onPress={() => navigation.navigate('Home')} accessibilityRole="button" accessibilityLabel="Back to home" style={styles.back}>
            <Feather name="arrow-left" size={sp(18)} color={colors.ink} />
          </ScalePress>
          <Text style={styles.h1}>Your cart</Text>
        </FadeInUp>

        {loading ? (
          <View style={{ gap: sp(10) }}>
            <RowSkeleton />
            <RowSkeleton />
          </View>
        ) : items.length === 0 ? (
          <FadeInUp style={styles.emptyWrap}>
            <Plate size={sp(120)} spin />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <ScalePress onPress={() => navigation.navigate('Home')} accessibilityRole="button" style={styles.emptyBtn}>
              <Text style={styles.emptyBtnText}>Browse restaurants</Text>
            </ScalePress>
          </FadeInUp>
        ) : (
          <>
            <FadeInUp style={{ gap: 2 }}>
              <Text style={styles.eyebrow}>FROM</Text>
              <Text style={styles.from}>Smoke & Spice Grill</Text>
              <Text style={[styles.eyebrow, { marginTop: 8 }]}>DELIVER TO</Text>
              <Text style={styles.from}>{selected.line}</Text>
            </FadeInUp>

            <View style={{ gap: sp(10) }}>
              {items.map((it, i) => (
                <CartItem key={it.key} item={it} index={i} onQty={setQty} />
              ))}
            </View>

            <FadeInUp delay={200}>
              <Animated.View style={[styles.promo, bad && { borderColor: '#B3261E' }, { transform: [{ translateX: shake }] }]}>
                <Feather name="tag" size={sp(16)} color={colors.green} />
                <TextInput
                  value={code}
                  onChangeText={(t) => {
                    setCode(t);
                    setBad(false);
                  }}
                  placeholder="Promo code"
                  placeholderTextColor={colors.muted}
                  autoCapitalize="characters"
                  style={styles.promoInput}
                  accessibilityLabel="Promo code"
                />
                <Pressable onPress={applyPromo} accessibilityRole="button" style={{ minHeight: 40, justifyContent: 'center' }}>
                  <Text style={styles.apply}>{promo ? 'Applied' : 'Apply'}</Text>
                </Pressable>
              </Animated.View>
              {bad && <Text style={styles.err}>That code isn't valid.</Text>}
            </FadeInUp>
          </>
        )}
      </ScrollView>

      <View style={[wrap, styles.sheet, { paddingBottom: sp(14) }]}>
        <View style={styles.row}>
          <Text style={styles.rowText}>Subtotal</Text>
          <AnimatedNumber value={subtotal} style={styles.rowText} />
        </View>
        {promo && items.length > 0 && (
          <FadeInUp distance={8} style={styles.row}>
            <Text style={[styles.rowText, { color: colors.green }]}>Promo {PROMO_CODE}</Text>
            <Text style={[styles.rowText, { color: colors.green }]}>-{naira(discount)}</Text>
          </FadeInUp>
        )}
        <View style={styles.row}>
          <Text style={styles.rowText}>Delivery</Text>
          <Text style={styles.rowText}>{items.length ? naira(DELIVERY) : naira(0)}</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.total}>Total</Text>
          <AnimatedNumber value={total} style={styles.total} />
        </View>
        <ScalePress
          onPress={placeOrder}
          accessibilityRole="button"
          accessibilityState={{ disabled: !items.length || placing }}
          style={[styles.place, !items.length && { opacity: 0.4 }]}
        >
          {placing ? <ActivityIndicator color="#fff" /> : <Text style={styles.placeText}>Place order</Text>}
        </ScalePress>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: sp(12) },
  back: { width: sp(40), height: sp(40), borderRadius: sp(20), backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line2, alignItems: 'center', justifyContent: 'center' },
  h1: { fontFamily: fonts.display, fontSize: sp(24), letterSpacing: -0.4, color: colors.ink },
  eyebrow: { fontFamily: fonts.bodyMedium, fontSize: sp(11), letterSpacing: 0.6, color: colors.muted },
  from: { fontFamily: fonts.bodyBold, fontSize: sp(14.5), color: colors.ink },
  item: { flexDirection: 'row', alignItems: 'center', gap: sp(12), padding: sp(8), backgroundColor: '#fff', borderRadius: sp(16), borderWidth: 1, borderColor: colors.line },
  itemName: { fontFamily: fonts.bodyBold, fontSize: sp(13.5), lineHeight: sp(17), color: colors.ink },
  itemNote: { fontFamily: fonts.body, fontSize: sp(12), color: colors.muted },
  itemPrice: { fontFamily: fonts.bodyBold, fontSize: sp(13.5), color: colors.ink },
  pill: { flexDirection: 'row', alignItems: 'center', gap: sp(8), backgroundColor: colors.chip, borderRadius: 999, paddingHorizontal: sp(10), paddingVertical: sp(7), marginRight: 2 },
  pillText: { fontFamily: fonts.bodyBold, fontSize: sp(13), color: colors.ink },
  promo: { flexDirection: 'row', alignItems: 'center', gap: 10, height: sp(46), paddingHorizontal: sp(14), backgroundColor: '#fff', borderWidth: 1, borderStyle: 'dashed', borderColor: colors.dash, borderRadius: sp(14) },
  promoInput: { flex: 1, fontFamily: fonts.body, fontSize: sp(14), color: colors.ink, paddingVertical: 0 },
  apply: { fontFamily: fonts.bodyBold, fontSize: sp(13), color: colors.brand },
  err: { fontFamily: fonts.body, fontSize: sp(12), color: '#B3261E', marginTop: 6 },
  emptyWrap: { alignItems: 'center', gap: sp(14), paddingVertical: sp(40) },
  emptyTitle: { fontFamily: fonts.display, fontSize: sp(18), color: colors.ink },
  emptyBtn: { height: sp(44), paddingHorizontal: sp(22), borderRadius: 999, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  emptyBtnText: { color: '#fff', fontFamily: fonts.bodyBold, fontSize: sp(14) },
  sheet: { paddingHorizontal: sp(20), paddingTop: sp(16), backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.line, borderTopLeftRadius: sp(24), borderTopRightRadius: sp(24), gap: sp(8) },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowText: { fontFamily: fonts.body, fontSize: sp(14), color: colors.body },
  totalRow: { paddingTop: sp(8), borderTopWidth: 1, borderTopColor: colors.line },
  total: { fontFamily: fonts.display, fontSize: sp(17), color: colors.ink },
  place: { height: sp(48), borderRadius: 999, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginTop: sp(4) },
  placeText: { color: '#fff', fontFamily: fonts.bodyBold, fontSize: sp(15) },
});
