import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { DISHES } from '../data';
import { LocationProvider } from './LocationContext';

const CartContext = createContext(null);

// Seeded with the same two lines shown in the design.
const SEED = [
  {
    key: 'jollof|Medium',
    dishId: 'jollof',
    name: DISHES.jollof.name,
    note: 'Medium spice',
    unit: DISHES.jollof.price,
    qty: 1,
    tint: DISHES.jollof.tint,
    image: DISHES.jollof.image,
  },
  {
    key: 'suya|Extra onions',
    dishId: 'suya',
    name: DISHES.suya.name,
    note: 'Extra onions',
    unit: DISHES.suya.price,
    qty: 2,
    tint: DISHES.suya.tint,
    image: DISHES.suya.image,
  },
];

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.some((x) => x.key === action.item.key);
      const items = exists
        ? state.items.map((x) =>
            x.key === action.item.key
              ? { ...x, qty: Math.min(x.qty + action.item.qty, 20) }
              : x
          )
        : [...state.items, action.item];
      return { ...state, items };
    }
    case 'SET_QTY':
      return {
        ...state,
        items: state.items
          .map((x) => (x.key === action.key ? { ...x, qty: action.qty } : x))
          .filter((x) => x.qty > 0),
      };
    case 'PLACE':
      return { items: [], order: { id: Date.now(), total: action.total } };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: SEED, order: null });
  const value = useMemo(() => {
    const count = state.items.reduce((n, x) => n + x.qty, 0);
    const subtotal = state.items.reduce((n, x) => n + x.unit * x.qty, 0);
    return { items: state.items, order: state.order, count, subtotal, dispatch };
  }, [state]);
  return (
    <CartContext.Provider value={value}>
      <LocationProvider>{children}</LocationProvider>
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
