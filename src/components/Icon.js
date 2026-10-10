import React from 'react';
import { Ionicons, Feather } from '@expo/vector-icons';

// [outline, filled] Ionicons for each icon name the app uses.
const MAP = {
  'map-pin': ['location-outline', 'location'],
  'chevron-down': ['chevron-down', 'chevron-down'],
  'shopping-bag': ['bag-handle-outline', 'bag-handle'],
  search: ['search-outline', 'search'],
  clock: ['time-outline', 'time'],
  home: ['home-outline', 'home'],
  'file-text': ['receipt-outline', 'receipt'],
  'arrow-left': ['arrow-back', 'arrow-back'],
  minus: ['remove', 'remove'],
  plus: ['add', 'add'],
  'trash-2': ['trash-outline', 'trash'],
  tag: ['pricetag-outline', 'pricetag'],
  check: ['checkmark', 'checkmark'],
  user: ['person-outline', 'person'],
  'message-square': ['chatbubble-outline', 'chatbubble'],
  phone: ['call-outline', 'call'],
  briefcase: ['briefcase-outline', 'briefcase'],
};

export default function Icon({ name, size = 24, color, filled = false, style }) {
  const pair = MAP[name];
  if (!pair) return <Feather name={name} size={size} color={color} style={style} />;
  return <Ionicons name={filled ? pair[1] : pair[0]} size={size} color={color} style={style} />;
}
