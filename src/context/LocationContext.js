import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocationContext = createContext(null);
const KEY = 'brokoto:locations:v1';

const DEFAULTS = [
  { id: 'home', label: 'Home', line: 'Lekki Phase 1, Lagos', icon: 'home' },
  { id: 'work', label: 'Work', line: 'Victoria Island, Lagos', icon: 'briefcase' },
  { id: 'yaba', label: 'Yaba', line: 'Yaba, Lagos', icon: 'map-pin' },
  { id: 'ikeja', label: 'Ikeja GRA', line: 'Ikeja GRA, Lagos', icon: 'map-pin' },
];

export function LocationProvider({ children }) {
  const [list, setList] = useState(DEFAULTS);
  const [selId, setSelId] = useState('home');
  const [ready, setReady] = useState(false);

  // Load saved addresses once on start.
  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!raw) return;
        const d = JSON.parse(raw);
        if (Array.isArray(d.list) && d.list.length) {
          setList(d.list);
          if (d.selId) setSelId(d.selId);
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  // Save whenever the list or selection changes (after the first load).
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(KEY, JSON.stringify({ list, selId })).catch(() => {});
  }, [list, selId, ready]);

  const value = useMemo(
    () => ({
      list,
      selected: list.find((a) => a.id === selId) || list[0],
      select: setSelId,
      add: (label, line) => {
        const id = 'a' + Date.now();
        setList((l) => [...l, { id, label: label.trim() || 'Other', line: line.trim(), icon: 'map-pin' }]);
        setSelId(id);
      },
    }),
    [list, selId]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export const useLocation = () => useContext(LocationContext);
