import React, { useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { Skeleton } from './Skeleton';

// Remote image: skeleton while loading, fade-in when ready, tinted block if it fails.
// <LazyImage uri="https://..." style={{ width: 120, height: 120 }} radius={14} fallback="#F3D9B8" />
export default function LazyImage({ uri, style, radius = 0, resizeMode = 'cover', fallback = '#E9DFCD' }) {
  const [state, setState] = useState('loading'); // loading | ready | failed
  const opacity = useRef(new Animated.Value(0)).current;

  const onLoad = () => {
    setState('ready');
    Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  };

  return (
    <View style={[{ overflow: 'hidden', borderRadius: radius, backgroundColor: fallback }, style]}>
      {state === 'loading' && (
        <Skeleton width="100%" height="100%" radius={radius} style={{ position: 'absolute' }} />
      )}
      {state !== 'failed' && (
        <Animated.Image
          source={{ uri }}
          resizeMode={resizeMode}
          onLoad={onLoad}
          onError={() => setState('failed')}
          style={{ width: '100%', height: '100%', opacity }}
        />
      )}
    </View>
  );
}
