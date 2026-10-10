import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from './Icon';
import ScalePress from './ScalePress';
import { useLocation } from '../context/LocationContext';
import { colors, fonts } from '../theme';
import { sp } from '../layout';

const ROW_H = sp(56);
const FORM_H = sp(172);

export default function LocationPicker() {
  const { list, selected, select, add } = useLocation();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState('');
  const [line, setLine] = useState('');
  const o = useRef(new Animated.Value(0)).current;
  const h = useRef(new Animated.Value(0)).current;

  const target = open ? (list.length + 1) * ROW_H + 2 + (adding ? FORM_H : 0) : 0;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(h, { toValue: target, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(o, { toValue: open ? 1 : 0, duration: 220, useNativeDriver: false }),
    ]).start();
  }, [target, open, h, o]);

  const gap = o.interpolate({ inputRange: [0, 1], outputRange: [0, 8] });
  const rotate = o.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const canSave = line.trim().length >= 3;

  const toggle = () => {
    if (open) setAdding(false);
    setOpen((v) => !v);
  };
  const pick = (a) => {
    select(a.id);
    setAdding(false);
    setOpen(false);
  };
  const save = () => {
    if (!canSave) return;
    add(label, line);
    setLabel('');
    setLine('');
    setAdding(false);
    setOpen(false);
  };

  return (
    <View>
      <ScalePress
        onPress={toggle}
        scaleTo={0.98}
        accessibilityRole="button"
        accessibilityLabel="Change delivery address"
        accessibilityState={{ expanded: open }}
        style={styles.button}
      >
        <View style={styles.pin}>
          <Icon name="map-pin" size={sp(17)} color={colors.brand} filled />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>Deliver to</Text>
          <Text style={styles.line} numberOfLines={1}>{selected.line}</Text>
        </View>
        <Animated.View style={[styles.chev, { transform: [{ rotate }] }]}>
          <Icon name="chevron-down" size={sp(15)} color={colors.ink} />
        </Animated.View>
      </ScalePress>

      <Animated.View style={{ height: h, marginTop: gap, opacity: o, overflow: 'hidden' }}>
        <View style={styles.panel}>
          {list.map((a) => {
            const active = a.id === selected.id;
            return (
              <Pressable
                key={a.id}
                onPress={() => pick(a)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={({ pressed }) => [styles.row, styles.rowLine, (active || pressed) && { backgroundColor: colors.brandTint }]}
              >
                <View style={[styles.rowIcon, active && { backgroundColor: '#fff' }]}>
                  <Icon name={a.icon} size={sp(16)} color={active ? colors.brand : colors.ink} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowLabel}>{a.label}</Text>
                  <Text style={styles.rowSub} numberOfLines={1}>{a.line}</Text>
                </View>
                {active && <Icon name="check" size={sp(18)} color={colors.brand} />}
              </Pressable>
            );
          })}

          <Pressable
            onPress={() => setAdding((v) => !v)}
            accessibilityRole="button"
            style={({ pressed }) => [styles.row, adding && styles.rowLine, pressed && { backgroundColor: colors.chip }]}
          >
            <View style={styles.addIcon}>
              <Icon name={adding ? 'minus' : 'plus'} size={sp(16)} color={colors.brand} />
            </View>
            <Text style={styles.addText}>{adding ? 'Cancel' : 'Add new address'}</Text>
          </Pressable>

          {adding && (
            <View style={styles.form}>
              <TextInput
                value={label}
                onChangeText={setLabel}
                placeholder="Label (e.g. Mum's place)"
                placeholderTextColor={colors.muted}
                autoCapitalize="words"
                returnKeyType="next"
                style={styles.input}
                accessibilityLabel="Address label"
              />
              <TextInput
                value={line}
                onChangeText={setLine}
                placeholder="Street, area, city"
                placeholderTextColor={colors.muted}
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={save}
                style={styles.input}
                accessibilityLabel="Address"
              />
              <ScalePress onPress={save} accessibilityRole="button" style={[styles.save, !canSave && { opacity: 0.4 }]}>
                <Text style={styles.saveText}>Save address</Text>
              </ScalePress>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: { flexDirection: 'row', alignItems: 'center', gap: sp(10), padding: sp(8), paddingRight: sp(10), backgroundColor: '#fff', borderRadius: sp(14), borderWidth: 1, borderColor: colors.line2 },
  pin: { width: sp(34), height: sp(34), borderRadius: sp(17), backgroundColor: colors.brandTint, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontFamily: fonts.body, fontSize: sp(11), color: colors.muted },
  line: { fontFamily: fonts.bodyMedium, fontSize: sp(14), color: colors.ink },
  chev: { width: sp(26), height: sp(26), borderRadius: sp(13), backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  panel: { backgroundColor: '#fff', borderRadius: sp(14), borderWidth: 1, borderColor: colors.line2, overflow: 'hidden' },
  row: { height: ROW_H, flexDirection: 'row', alignItems: 'center', gap: sp(12), paddingHorizontal: sp(12) },
  rowLine: { borderBottomWidth: 1, borderBottomColor: colors.line },
  rowIcon: { width: sp(32), height: sp(32), borderRadius: sp(16), backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontFamily: fonts.bodyMedium, fontSize: sp(14), color: colors.ink },
  rowSub: { fontFamily: fonts.body, fontSize: sp(12), color: colors.muted },
  addIcon: { width: sp(32), height: sp(32), borderRadius: sp(16), borderWidth: 1, borderStyle: 'dashed', borderColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  addText: { fontFamily: fonts.bodyMedium, fontSize: sp(14), color: colors.brand },
  form: { height: FORM_H, padding: sp(12), gap: sp(8) },
  input: { height: sp(44), borderWidth: 1, borderColor: colors.line2, borderRadius: sp(12), paddingHorizontal: sp(12), fontFamily: fonts.body, fontSize: sp(14), color: colors.ink, backgroundColor: colors.bg },
  save: { height: sp(44), borderRadius: 999, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#fff', fontFamily: fonts.bodyBold, fontSize: sp(14) },
});
