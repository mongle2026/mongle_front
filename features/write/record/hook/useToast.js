// hooks/useToast.js

import { useCallback, useEffect, useRef, useState } from 'react';
import { colors } from '../../../../shared/styles/color';

export function useToast() {
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'warning',
    color: colors.fgPositive,
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
      color = colors.fgPositive,
    }) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setToast({
        visible: true,
        message,
        type,
        color,
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