import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Feather from '../components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScalePress from '../components/ScalePress';
import FadeInUp from '../components/FadeInUp';
import Chip from '../components/Chip';
import Badge from '../components/Badge';
import LocationPicker from '../components/LocationPicker';
import LazyImage from '../components/LazyImage';
import { RowSkeleton } from '../components/Skeleton';
import useLazy from '../hooks/useLazy';
import { useCart } from '../context/CartContext';
import { CATEGORIES, DISHES, PLACES, unsplash } from '../data';
import { colors, fonts, naira } from '../theme';
import { sp, wrap } from '../layout';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { count } = useCart();
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  // Restaurants are "fetched": skeletons first, then staggered fade-in.
  // Switching category re-runs it.
  const loading = useLazy(1100, [cat]);

  const places = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PLACES.filter(
      (p) =>
        (cat === 'All' || p.cats.includes(cat)) &&
        (!term || p.name.toLowerCase().includes(term) || p.kind.toLowerCase().includes(term))
    );
  }, [cat, q]);

  const featured = DISHES.jollof;
  const circle = sp(168);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={[wrap, { paddingTop: insets.top + sp(10), paddingHorizontal: sp(20), paddingBottom: sp(24), gap: sp(14) }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <FadeInUp style={styles.headerRow}>
        <View style={styles.brandRow}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" accessibilityLabel="Brokoto logo" />
          <Text style={styles.brand}>Brokoto</Text>
        </View>
        <View>
          <ScalePress onPress={() => navigation.navigate('Cart')} accessibilityRole="button" accessibilityLabel="Open cart" style={styles.cartBtn}>
            <Feather name="shopping-bag" size={sp(18)} color={colors.ink} />
          </ScalePress>
          <Badge count={count} style={{ position: 'absolute', top: -4, right: -4 }} />
        </View>
      </FadeInUp>

      <FadeInUp delay={60}>
        <LocationPicker />
      </FadeInUp>

      <FadeInUp delay={110}>
        <Text style={styles.h1}>What are you craving today?</Text>
      </FadeInUp>

      <FadeInUp delay={160}>
        <View style={styles.search}>
          <Feather name="search" size={sp(17)} color={colors.muted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search dishes or restaurants"
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            accessibilityLabel="Search dishes or restaurants"
          />
        </View>
      </FadeInUp>

      <FadeInUp delay={210}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: sp(8), paddingHorizontal: sp(20) }} style={{ marginHorizontal: -sp(20) }}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} />
          ))}
        </ScrollView>
      </FadeInUp>

      <FadeInUp delay={260}>
        <ScalePress onPress={() => navigation.navigate('Dish', { dishId: featured.id })} accessibilityRole="button" scaleTo={0.98} style={styles.featured}>
          <View style={styles.featuredText}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>CHEF'S PICK</Text>
            </View>
            <View style={{ gap: 3 }}>
              <Text style={styles.featuredTitle}>{featured.short}</Text>
              <Text style={styles.featuredSub}>
                {featured.sub} · {naira(featured.price)}
              </Text>
            </View>
          </View>
          <View style={[styles.featuredPhoto, { width: circle, height: circle, borderRadius: circle / 2 }]}>
            <LazyImage uri={unsplash(featured.image, 500)} style={{ width: '100%', height: '100%' }} fallback="#8B52E8" />
          </View>
        </ScalePress>
      </FadeInUp>

      <FadeInUp delay={310} style={styles.sectionRow}>
        <Text style={styles.h2}>Near you</Text>
        <ScalePress onPress={() => setCat('All')} accessibilityRole="button">
          <Text style={styles.link}>See all</Text>
        </ScalePress>
      </FadeInUp>

      <View style={{ gap: sp(10) }}>
        {loading ? (
          <>
            <RowSkeleton />
            <RowSkeleton />
          </>
        ) : places.length === 0 ? (
          <FadeInUp>
            <Text style={styles.empty}>Nothing matches that yet.</Text>
          </FadeInUp>
        ) : (
          places.map((p, i) => (
            <FadeInUp key={`${cat}-${p.id}`} delay={i * 90}>
              <ScalePress onPress={() => navigation.navigate('Dish', { dishId: p.dishId })} accessibilityRole="button" scaleTo={0.98} style={styles.place}>
                <LazyImage uri={unsplash(DISHES[p.dishId].image, 240)} radius={sp(12)} fallback={p.tint} style={{ width: sp(56), height: sp(56) }} />
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={styles.placeName} numberOfLines={1}>{p.name}</Text>
                  <Text style={styles.placeKind} numberOfLines={1}>{p.kind}</Text>
                </View>
                <View style={styles.time}>
                  <Feather name="clock" size={sp(13)} color={colors.muted} />
                  <Text style={styles.timeText}>{p.time}</Text>
                </View>
              </ScalePress>
            </FadeInUp>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: sp(8) },
  logo: { width: sp(30), height: sp(30) },
  brand: { fontFamily: fonts.display, fontSize: sp(20), letterSpacing: -0.4, color: colors.brand },
  cartBtn: { width: sp(42), height: sp(42), borderRadius: sp(21), backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line2, alignItems: 'center', justifyContent: 'center' },
  address: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', minHeight: 32 },
  addressText: { fontFamily: fonts.bodyMedium, fontSize: sp(14), color: colors.ink },
  h1: { fontFamily: fonts.display, fontSize: sp(26), lineHeight: sp(31), letterSpacing: -0.5, color: colors.ink },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: sp(46), paddingHorizontal: sp(14), backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line2, borderRadius: sp(14) },
  searchInput: { flex: 1, fontFamily: fonts.body, fontSize: sp(14), color: colors.ink, paddingVertical: 0 },
  featured: { flexDirection: 'row', height: sp(150), borderRadius: sp(20), backgroundColor: colors.brand, overflow: 'hidden' },
  featuredText: { flex: 1, padding: sp(18), justifyContent: 'space-between', paddingRight: sp(110) },
  tag: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontFamily: fonts.bodyBold, fontSize: sp(10), letterSpacing: 0.8, color: '#fff' },
  featuredTitle: { fontFamily: fonts.display, fontSize: sp(19), lineHeight: sp(22), color: '#fff' },
  featuredSub: { fontFamily: fonts.body, fontSize: sp(12.5), color: 'rgba(255,255,255,0.85)' },
  featuredPhoto: { position: 'absolute', right: -sp(36), top: sp(-9), overflow: 'hidden' },
  sectionRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: sp(2) },
  h2: { fontFamily: fonts.display, fontSize: sp(17), color: colors.ink },
  link: { fontFamily: fonts.bodyMedium, fontSize: sp(13), color: colors.brand },
  place: { flexDirection: 'row', alignItems: 'center', gap: sp(12), padding: sp(8), backgroundColor: '#fff', borderRadius: sp(16), borderWidth: 1, borderColor: colors.line },
  placeName: { fontFamily: fonts.bodyBold, fontSize: sp(14.5), color: colors.ink },
  placeKind: { fontFamily: fonts.body, fontSize: sp(12), color: colors.muted },
  time: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingRight: 6 },
  timeText: { fontFamily: fonts.bodyMedium, fontSize: sp(12), color: colors.muted },
  empty: { fontFamily: fonts.body, fontSize: sp(14), color: colors.muted, paddingVertical: 24, textAlign: 'center' },
});
