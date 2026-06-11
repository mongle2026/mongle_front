// hooks/useToast.js

import { useCallback, useEffect, useRef, useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'warning',
  });

  const timerRef = useRef(null);

  const hideToast = useCallback(() => {
    setToast(prev => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const showToast = useCallback(
    ({
      message,
      type = 'warning',
      duration = 3000,
    }) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setToast({
        visible: true,
        message,
        type,
      });

      timerRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    },
    [hideToast],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}