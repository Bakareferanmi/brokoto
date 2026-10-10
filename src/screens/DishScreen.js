import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Feather from '../components/Icon';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScalePress from '../components/ScalePress';
import FadeInUp from '../components/FadeInUp';
import Chip from '../components/Chip';
import LazyImage from '../components/LazyImage';
import AnimatedNumber from '../components/AnimatedNumber';
import { useCart } from '../context/CartContext';
import { DISHES, SPICES, unsplash } from '../data';
import { colors, fonts } from '../theme';
import { SCREEN_H, sp, wrap } from '../layout';

export default function DishScreen({ route, navigation }) {
  const dish = DISHES[route.params?.dishId] || DISHES.jollof;
  const insets = useSafeAreaInsets();
  const { dispatch } = useCart();
  const [qty, setQty] = useState(1);
  const [spice, setSpice] = useState('Medium');
  const [fav, setFav] = useState(false);
  const [added, setAdded] = useState(false);
  const timer = useRef(null);

  const hero = useRef(new Animated.Value(0)).current;
  const heart = useRef(new Animated.Value(1)).current;
  const qtyScale = useRef(new Animated.Value(1)).current;
  const addScale = useRef(new Animated.Value(1)).current;
  const check = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(hero, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    return () => clearTimeout(timer.current);
  }, [hero]);

  const bump = () =>
    Animated.sequence([
      Animated.timing(qtyScale, { toValue: 1.3, duration: 80, useNativeDriver: true }),
      Animated.spring(qtyScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

  const change = (d) => {
    setQty((n) => Math.max(1, Math.min(9, n + d)));
    bump();
  };

  const toggleFav = () => {
    setFav((f) => !f);
    Animated.sequence([
      Animated.timing(heart, { toValue: 1.4, duration: 100, useNativeDriver: true }),
      Animated.spring(heart, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  const addToCart = () => {
    if (added) return;
    dispatch({
      type: 'ADD',
      item: {
        key: `${dish.id}|${spice} spice`,
        dishId: dish.id,
        name: dish.name,
        note: `${spice} spice`,
        unit: dish.price,
        qty,
        tint: dish.tint,
        image: dish.image,
      },
    });
    setAdded(true);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(addScale, { toValue: 0.96, duration: 90, useNativeDriver: true }),
        Animated.spring(addScale, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]),
      Animated.spring(check, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
    timer.current = setTimeout(() => navigation.navigate('Tabs', { screen: 'Cart' }), 800);
  };

  const heroH = Math.min(sp(300), SCREEN_H * 0.4);
  const photoStyle = {
    opacity: hero,
    transform: [{ scale: hero.interpolate({ inputRange: [0, 1], outputRange: [1.15, 1] }) }],
  };

  return (
    <View style={styles.root}>
      <View style={[styles.hero, { height: heroH + insets.top, backgroundColor: dish.tint }]}>
        <Animated.View style={[StyleSheet.absoluteFill, photoStyle]}>
          <LazyImage uri={unsplash(dish.image, 900)} fallback={dish.tint} style={{ width: '100%', height: '100%' }} />
        </Animated.View>
        <ScalePress
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          outerStyle={[styles.topBtn, { left: sp(20), top: insets.top + sp(10) }]}
          style={styles.circle}
        >
          <Feather name="arrow-left" size={sp(19)} color={colors.ink} />
        </ScalePress>
        <Pressable
          onPress={toggleFav}
          accessibilityRole="button"
          accessibilityLabel="Save to favourites"
          style={[styles.topBtn, { right: sp(20), top: insets.top + sp(10) }]}
        >
          <Animated.View style={[styles.circle, { transform: [{ scale: heart }] }]}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={sp(19)} color={colors.brand} />
          </Animated.View>
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1, marginTop: -sp(24) }} contentContainerStyle={[wrap, styles.content]} showsVerticalScrollIndicator={false}>
        <FadeInUp delay={120} style={{ gap: 4 }}>
          <Text style={styles.eyebrow}>{dish.restaurant.toUpperCase()}</Text>
          <Text style={styles.title}>{dish.name}</Text>
        </FadeInUp>
        <FadeInUp delay={200}>
          <Text style={styles.desc}>{dish.description}</Text>
        </FadeInUp>
        <FadeInUp delay={280} style={{ gap: 8 }}>
          <Text style={styles.label}>Spice level</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {SPICES.map((s) => (
              <Chip key={s} label={s} active={spice === s} onPress={() => setSpice(s)} radius={sp(12)} minHeight={sp(42)} fill />
            ))}
          </View>
        </FadeInUp>
      </ScrollView>

      <FadeInUp delay={340} distance={30}>
        <View style={[wrap, styles.bar, { paddingBottom: Math.max(insets.bottom, 10) + sp(8) }]}>
          <View style={styles.stepper}>
            <ScalePress onPress={() => change(-1)} accessibilityRole="button" accessibilityLabel="Decrease quantity" style={styles.stepBtn}>
              <Feather name="minus" size={sp(15)} color={colors.ink} />
            </ScalePress>
            <Animated.Text style={[styles.qty, { transform: [{ scale: qtyScale }] }]}>{qty}</Animated.Text>
            <ScalePress onPress={() => change(1)} accessibilityRole="button" accessibilityLabel="Increase quantity" style={styles.stepBtn}>
              <Feather name="plus" size={sp(15)} color={colors.ink} />
            </ScalePress>
          </View>

          <Animated.View style={{ flex: 1, transform: [{ scale: addScale }] }}>
            <Pressable onPress={addToCart} accessibilityRole="button" style={styles.add}>
              {added ? (
                <Animated.View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transform: [{ scale: check.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
                  }}
                >
                  <Feather name="check" size={sp(17)} color="#fff" />
                  <Text style={styles.addText}>Added to cart</Text>
                </Animated.View>
              ) : (
                <>
                  <Text style={styles.addText}>Add to cart</Text>
                  <AnimatedNumber value={dish.price * qty} style={styles.addText} />
                </>
              )}
            </Pressable>
          </Animated.View>
        </View>
      </FadeInUp>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: { overflow: 'hidden' },
  topBtn: { position: 'absolute', zIndex: 2 },
  circle: { width: sp(40), height: sp(40), borderRadius: sp(20), backgroundColor: 'rgba(251,246,238,0.94)', alignItems: 'center', justifyContent: 'center' },
  content: { backgroundColor: colors.bg, borderTopLeftRadius: sp(24), borderTopRightRadius: sp(24), paddingHorizontal: sp(20), paddingTop: sp(20), paddingBottom: sp(16), gap: sp(12), minHeight: sp(260) },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: sp(11), letterSpacing: 0.8, color: colors.brand },
  title: { fontFamily: fonts.display, fontSize: sp(24), lineHeight: sp(28), letterSpacing: -0.4, color: colors.ink },
  desc: { fontFamily: fonts.body, fontSize: sp(14), lineHeight: sp(21), color: colors.body },
  label: { fontFamily: fonts.bodyMedium, fontSize: sp(13), color: colors.ink },
  bar: { flexDirection: 'row', alignItems: 'center', gap: sp(12), paddingHorizontal: sp(20), paddingTop: sp(12), backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.line },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: colors.chip, borderRadius: 999, padding: 3 },
  stepBtn: { width: sp(36), height: sp(36), borderRadius: sp(18), backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  qty: { minWidth: sp(26), textAlign: 'center', fontFamily: fonts.bodyBold, fontSize: sp(15), color: colors.ink },
  add: { height: sp(46), borderRadius: 999, backgroundColor: colors.brand, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: sp(20) },
  addText: { color: '#fff', fontFamily: fonts.bodyBold, fontSize: sp(14.5) },
});
