import { Dimensions } from 'react-native';

// Responsive sizing. Design baseline is a 390pt-wide phone.
// sp(n) scales n with screen width (clamped, so small phones and tablets stay sane).
// Content is capped at MAX_W and centred on wide screens.
export const MAX_W = 520;
const { width, height } = Dimensions.get('window');
const base = Math.min(width, MAX_W);
const scale = Math.max(0.86, Math.min(base / 390, 1.12));

export const sp = (n) => Math.round(n * scale * 2) / 2;
export const SCREEN_W = width;
export const SCREEN_H = height;
export const CONTENT_W = base;
export const wrap = { width: '100%', maxWidth: MAX_W, alignSelf: 'center' };
