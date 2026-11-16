// ===== املأ هاتين القيمتين من مشروع Supabase الجديد: Project Settings → API =====
export const SUPABASE_URL = 'https://zmssushpynpsrlkswltf.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_oZWjUnNbz4aCURnHiGperw_aqNzm3wB';
// ================================================================================

export const SESSION_KEY = 'zikra.session.token';
export const THEME_KEY = 'zikra.theme.mode.v2';

// لوحة ألوان ZIKRA: الوضع الفاتح الهادئ هو الافتراضي.
export const COLORS_DARK = {
  bg: '#0B0B0C',
  surface: '#141416',
  surfaceAlt: '#1C1C1F',
  border: '#2A2A2E',
  text: '#F3F3F4',
  textMuted: '#94949C',
  primary: '#F3F3F4',
  onPrimary: '#0B0B0C',
  danger: '#FF6B6B',
  success: '#F3F3F4',
  overlay: 'rgba(0,0,0,0.62)',
  scrim: 'rgba(11,11,12,0.78)',
  white: '#FFFFFF',
  black: '#000000',
};

export const COLORS_LIGHT = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F4F5',
  border: '#EBEBED',
  text: '#0E0E10',
  textMuted: '#85858C',
  primary: '#0E0E10',
  onPrimary: '#FFFFFF',
  danger: '#D23B3B',
  success: '#0E0E10',
  overlay: 'rgba(0,0,0,0.50)',
  scrim: 'rgba(255,255,255,0.82)',
  white: '#FFFFFF',
  black: '#000000',
};

export const COLORS = COLORS_LIGHT;

// ضع ملفات الخطوط الثلاثة داخل assets/fonts بالأسماء والامتدادات الموضحة في README.
export const FONTS = {
  black: 'thmanyahsans-Black',
  medium: 'thmanyahsans-Medium',
  light: 'thmanyahsans-Light',
  regular: 'thmanyahsans-Medium',
  bold: 'thmanyahsans-Black',
};
export const RADIUS = { card: 16, button: 12, pill: 999 };
export const SPACING = 16;

// الأفتارات: لون + رمز
export const AVATARS = [
  { id: 'avatar_01', bg: '#D8D8DC', icon: 'heart' },
  { id: 'avatar_02', bg: '#BFC0C5', icon: 'leaf' },
  { id: 'avatar_03', bg: '#A8A9AF', icon: 'moon' },
  { id: 'avatar_04', bg: '#D0D0D4', icon: 'sun' },
  { id: 'avatar_05', bg: '#B7B8BE', icon: 'star' },
  { id: 'avatar_06', bg: '#E2E2E5', icon: 'camera' },
  { id: 'avatar_07', bg: '#9C9DA4', icon: 'home' },
  { id: 'avatar_08', bg: '#C5C6CB', icon: 'flower' },
  { id: 'avatar_09', bg: '#B0B1B7', icon: 'cloud' },
  { id: 'avatar_10', bg: '#D5D5D9', icon: 'coffee' },
  { id: 'avatar_11', bg: '#A5A6AC', icon: 'mountain' },
  { id: 'avatar_12', bg: '#C0C1C6', icon: 'music' },
];

export const LIMITS = { maxImages: 10, maxTitle: 100, maxDescription: 2900, maxComment: 1000 };
