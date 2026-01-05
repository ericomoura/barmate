import { useEffect, useState } from 'react';
import { read, write } from '../storage/localStorage';

export function useLocalStorage<T>(key: string, initial: T): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(() => read<T>(key, initial));

  useEffect(() => { write<T>(key, value)}, [key, value]);

  return [value, setValue];
}