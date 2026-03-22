/**
 * Anti-ATLAS heterogeneity engine for satellite letters.
 * Each letter gets a unique visual combination to defeat USCIS boilerplate detection.
 */

const FONT_COMBOS = [
  { font: 'Times New Roman', headerColor: '#1a365d' },
  { font: 'Calibri', headerColor: '#2d3748' },
  { font: 'Garamond', headerColor: '#1a202c' },
  { font: 'Georgia', headerColor: '#2c5282' },
  { font: 'Cambria', headerColor: '#2b6cb0' },
  { font: 'Book Antiqua', headerColor: '#1e3a5f' },
  { font: 'Palatino', headerColor: '#2a4365' },
  { font: 'Century Schoolbook', headerColor: '#234e70' },
  { font: 'Bookman Old Style', headerColor: '#1b3a4b' },
  { font: 'Arial', headerColor: '#2d3748' },
  { font: 'Trebuchet MS', headerColor: '#1a365d' },
  { font: 'Verdana', headerColor: '#2c5282' },
  { font: 'Tahoma', headerColor: '#1e3a5f' },
  { font: 'Lucida Sans', headerColor: '#2a4365' },
  { font: 'Franklin Gothic', headerColor: '#234e70' },
];

const HEADER_STYLES = [
  'centered',
  'left-aligned',
  'right-logo',
  'minimal',
  'bordered',
  'underlined',
  'bold-caps',
  'italic-serif',
];

const DOC_FORMATS = [
  'traditional-letter',
  'modern-block',
  'semi-block',
  'academic-style',
  'corporate-memo',
  'executive-brief',
];

export interface LetterFormat {
  font: string;
  headerColor: string;
  headerStyle: string;
  docFormat: string;
  comboKey: string;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Selects a unique visual combination for each satellite letter.
 * Ensures no two letters from the same client share the same combo.
 */
export function selectHeterogeneousFormat(
  clientId: string,
  letterIndex: number,
  existingCombos: string[] = [],
): LetterFormat {
  const seed = hashCode(`${clientId}-${letterIndex}`);

  let combo: string;
  let attempts = 0;

  do {
    const fontIdx = (seed + attempts) % FONT_COMBOS.length;
    const headerIdx = (seed + attempts * 3) % HEADER_STYLES.length;
    const formatIdx = (seed + attempts * 7) % DOC_FORMATS.length;

    combo = `${fontIdx}-${headerIdx}-${formatIdx}`;
    attempts++;
  } while (existingCombos.includes(combo) && attempts < 100);

  const [fontIdx, headerIdx, formatIdx] = combo.split('-').map(Number);

  return {
    font: FONT_COMBOS[fontIdx].font,
    headerColor: FONT_COMBOS[fontIdx].headerColor,
    headerStyle: HEADER_STYLES[headerIdx],
    docFormat: DOC_FORMATS[formatIdx],
    comboKey: combo,
  };
}
