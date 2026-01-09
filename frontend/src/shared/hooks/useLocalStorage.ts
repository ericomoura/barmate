import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { read, write } from '../storage/localStorage';

export function useLocalStorage<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => read<T>(key, initial));

  useEffect(() => { write<T>(key, value)}, [key, value]);

  return [value, setValue];
}