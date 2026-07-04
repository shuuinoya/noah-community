// Curated country list (not exhaustive ISO-3166) — common nationalities among
// Noah's user base. "other" lets anyone not listed still complete signup.
export const COUNTRIES = [
  { code: 'jp', ja: '日本', en: 'Japan', vi: 'Nhật Bản' },
  { code: 'vn', ja: 'ベトナム', en: 'Vietnam', vi: 'Việt Nam' },
  { code: 'cn', ja: '中国', en: 'China', vi: 'Trung Quốc' },
  { code: 'kr', ja: '韓国', en: 'South Korea', vi: 'Hàn Quốc' },
  { code: 'ph', ja: 'フィリピン', en: 'Philippines', vi: 'Philippines' },
  { code: 'th', ja: 'タイ', en: 'Thailand', vi: 'Thái Lan' },
  { code: 'id', ja: 'インドネシア', en: 'Indonesia', vi: 'Indonesia' },
  { code: 'np', ja: 'ネパール', en: 'Nepal', vi: 'Nepal' },
  { code: 'in', ja: 'インド', en: 'India', vi: 'Ấn Độ' },
  { code: 'br', ja: 'ブラジル', en: 'Brazil', vi: 'Brazil' },
  { code: 'us', ja: 'アメリカ', en: 'United States', vi: 'Hoa Kỳ' },
  { code: 'gb', ja: 'イギリス', en: 'United Kingdom', vi: 'Vương quốc Anh' },
  { code: 'ca', ja: 'カナダ', en: 'Canada', vi: 'Canada' },
  { code: 'au', ja: 'オーストラリア', en: 'Australia', vi: 'Úc' },
  { code: 'fr', ja: 'フランス', en: 'France', vi: 'Pháp' },
  { code: 'de', ja: 'ドイツ', en: 'Germany', vi: 'Đức' },
  { code: 'other', ja: 'その他', en: 'Other', vi: 'Khác' },
];

export function countryLabel(code, lang) {
  const c = COUNTRIES.find((x) => x.code === code);
  if (!c) return code || '';
  return c[lang] || c.en;
}
