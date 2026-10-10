import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '../components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Badge from '../components/Badge';
import { useCart } from '../context/CartContext';
import { colors, fonts } from '../theme';
import { MAX_W, sp } from '../layout';

const TABS = {
  Home: { label: 'Home', icon: 'home' },
  Cart: { label: 'Cart', icon: 'shopping-bag' },
  Orders: { label: 'Orders', icon: 'file-text' },
};

function TabItem({ tab, focused, onPress, badge }) {
  const v = useRef(new Animated.Value(focused ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(v, { toValue: focused ? 1 : 0, friction: 5, tension: 120, useNativeDriver: true }).start();
  }, [focused, v]);

  const color = focused ? colors.brand : colors.muted;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: focused }} accessibilityLabel={tab.label} style={styles.item}>
      <Animated.View
        style={{
          transform: [
            { scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) },
            { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -1] }) },
          ],
        }}
      >
        <Feather name={tab.icon} size={sp(21)} color={color} filled={focused} />
        {badge ? <Badge count={badge} style={{ position: 'absolute', top: -7, right: -11 }} /> : null}
      </Animated.View>
      <Text style={{ fontFamily: focused ? fonts.bodyBold : fonts.bodyMedium, fontSize: sp(11), color }}>{tab.label}</Text>
    </Pressable>
  );
}

export default function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const { count } = useCart();
  return (
    <View style={styles.outer}>
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const onPress = () => {
            const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
          };
          return <TabItem key={route.key} tab={TABS[route.name]} focused={focused} onPress={onPress} badge={route.name === 'Cart' ? count : 0} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.line },
  bar: { width: '100%', maxWidth: MAX_W, alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 12, paddingTop: 6 },
  item: { minWidth: 64, minHeight: 46, alignItems: 'center', justifyContent: 'center', gap: 2 },
});
