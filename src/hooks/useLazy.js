import { useEffect, useState } from 'react';

// Simulates a network fetch. Returns true while "loading".
// Re-runs whenever `deps` change, so changing a filter shows skeletons again.
export default function useLazy(delay = 900, deps = []) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return loading;
}
