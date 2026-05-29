"use client";

import { useCallback, useEffect, useState, type DependencyList } from 'react';

import { getApiErrorMessage } from '@/services/api-error';

export function useApiData<T>(
  loader: () => Promise<T>,
  dependencies: DependencyList,
  initialData: T,
) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setData(await loader());
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo cargar la informacion.'));
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, setData, loading, error, reload };
}
