import { useEffect, useMemo, useState } from 'react';
import { Image } from 'react-native';
import { getColors } from 'react-native-image-colors';

import { colors } from '../../styles/color';

const BLACK = '#000000';
const MIN_BLACK_TEXT_CONTRAST = 4.5;

export const DEFAULT_MUSIC_THEME = {
  backgroundColor: colors.bgLayerWeak,
  waveColor: colors.fgLayerNeutralWeak,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeHex(hex) {
  if (typeof hex !== 'string') return null;

  const value = hex.trim();

  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    return value.toUpperCase();
  }

  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    const r = value[1];
    const g = value[2];
    const b = value[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }

  return null;
}

function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;

  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
}

function rgbToHex({ r, g, b }) {
  const toHex = (value) =>
    Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function rgbToHsl({ r, g, b }) {
  const nextR = r / 255;
  const nextG = g / 255;
  const nextB = b / 255;

  const max = Math.max(nextR, nextG, nextB);
  const min = Math.min(nextR, nextG, nextB);
  const diff = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    switch (max) {
      case nextR:
        h = (nextG - nextB) / diff + (nextG < nextB ? 6 : 0);
        break;
      case nextG:
        h = (nextB - nextR) / diff + 2;
        break;
      default:
        h = (nextR - nextG) / diff + 4;
        break;
    }

    h /= 6;
  }

  return { h, s, l };
}

function hslToRgb({ h, s, l }) {
  if (s === 0) {
    const gray = l * 255;
    return { r: gray, g: gray, b: gray };
  }

  const hueToRgb = (p, q, t) => {
    let nextT = t;

    if (nextT < 0) nextT += 1;
    if (nextT > 1) nextT -= 1;
    if (nextT < 1 / 6) return p + (q - p) * 6 * nextT;
    if (nextT < 1 / 2) return q;
    if (nextT < 2 / 3) return p + (q - p) * (2 / 3 - nextT) * 6;

    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: hueToRgb(p, q, h + 1 / 3) * 255,
    g: hueToRgb(p, q, h) * 255,
    b: hueToRgb(p, q, h - 1 / 3) * 255,
  };
}

function hslToHex(hsl) {
  return rgbToHex(hslToRgb(hsl));
}

function getRelativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const toLinear = (value) => {
    const channel = value / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  };

  const r = toLinear(rgb.r);
  const g = toLinear(rgb.g);
  const b = toLinear(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(colorA, colorB) {
  const luminanceA = getRelativeLuminance(colorA);
  const luminanceB = getRelativeLuminance(colorB);

  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);

  return (lighter + 0.05) / (darker + 0.05);
}

function makeReadableBackground(hex) {
  const normalized = normalizeHex(hex);

  if (!normalized) {
    return DEFAULT_MUSIC_THEME.backgroundColor;
  }

  if (getContrastRatio(normalized, BLACK) >= MIN_BLACK_TEXT_CONTRAST) {
    return normalized;
  }

  const hsl = rgbToHsl(hexToRgb(normalized));

  for (let lightness = hsl.l; lightness <= 0.96; lightness += 0.02) {
    const candidate = hslToHex({
      h: hsl.h,
      s: hsl.s,
      l: lightness,
    });

    if (getContrastRatio(candidate, BLACK) >= MIN_BLACK_TEXT_CONTRAST) {
      return candidate;
    }
  }

  return '#F2F2F2';
}

function makeWaveColor(backgroundColor) {
  const rgb = hexToRgb(backgroundColor);

  if (!rgb) {
    return DEFAULT_MUSIC_THEME.waveColor;
  }

  const hsl = rgbToHsl(rgb);

  return hslToHex({
    h: hsl.h,
    s: clamp(hsl.s * 1.08, 0.25, 1),
    l: clamp(hsl.l * 0.55, 0.16, 0.42),
  });
}

function pickImageColor(result) {
  if (!result) return null;

  const candidates =
    result.platform === 'ios'
      ? [
          result.background,
          result.primary,
          result.secondary,
          result.detail,
        ]
      : [
          result.dominant,
          result.average,
          result.vibrant,
          result.muted,
          result.lightVibrant,
        ];

  return candidates.find((color) => normalizeHex(color)) ?? null;
}

function getImageUri(imageSource) {
  if (!imageSource) return null;

  if (typeof imageSource === 'string') {
    return imageSource;
  }

  if (typeof imageSource === 'number') {
    return Image.resolveAssetSource(imageSource)?.uri ?? null;
  }

  if (typeof imageSource === 'object' && imageSource.uri) {
    return imageSource.uri;
  }

  return null;
}

export function withOpacity(hex, opacity) {
  const rgb = hexToRgb(hex);

  if (!rgb) {
    return hex;
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

export default function useAlbumTheme(imageSource, enabled = true) {
  const imageUri = useMemo(() => getImageUri(imageSource), [imageSource]);
  const [theme, setTheme] = useState(DEFAULT_MUSIC_THEME);

  useEffect(() => {
    let cancelled = false;

    if (!enabled || !imageUri) {
      setTheme(DEFAULT_MUSIC_THEME);
      return;
    }

    getColors(imageUri, {
      fallback: DEFAULT_MUSIC_THEME.backgroundColor,
      cache: true,
      key: imageUri,
    })
      .then((result) => {
        if (cancelled) return;

        const pickedColor = pickImageColor(result);
        const backgroundColor = makeReadableBackground(pickedColor);
        const waveColor = makeWaveColor(backgroundColor);

        setTheme({
          backgroundColor,
          waveColor,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setTheme(DEFAULT_MUSIC_THEME);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, imageUri]);

  return theme;
}