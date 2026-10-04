export interface DetectionCandidate {
  language: string;
  code: string;
  confidence: number;
}

export interface DetectionResult {
  script: string;
  topCandidates: DetectionCandidate[];
  matchedWords: string[];
  isTooShort: boolean;
}

export const COMMON_WORDS: Record<string, string[]> = {
  English: ['the', 'and', 'of', 'to', 'in', 'is', 'that', 'for', 'with', 'as', 'was', 'are', 'this', 'have', 'from', 'which'],
  Spanish: ['el', 'la', 'de', 'que', 'en', 'los', 'del', 'se', 'las', 'por', 'un', 'para', 'con', 'una', 'su', 'como'],
  French: ['le', 'la', 'de', 'et', 'les', 'des', 'en', 'un', 'du', 'une', 'est', 'pour', 'dans', 'que', 'avec', 'sur'],
  German: ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich', 'des', 'auf', 'für', 'ist', 'nicht', 'eine'],
  Italian: ['di', 'il', 'la', 'che', 'in', 'per', 'un', 'del', 'da', 'non', 'si', 'una', 'dei', 'con', 'ed', 'sono'],
  Portuguese: ['de', 'que', 'do', 'da', 'em', 'um', 'para', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais'],
};

export const TRIGRAMS: Record<string, string[]> = {
  English: ['the', 'and', 'ing', 'ion', 'ent', 'her', 'tha', 'nth', 'for', 'ere', 'ate', 'ter'],
  Spanish: ['que', 'del', 'ion', 'los', 'ent', 'con', 'ado', 'ica', 'ida', 'nte', 'est', 'las'],
  French: ['que', 'les', 'des', 'ent', 'ion', 'our', 'ait', 'ant', 'ous', 'tio', 'est', 'eme'],
  German: ['der', 'ein', 'sch', 'ich', 'nde', 'die', 'und', 'den', 'cht', 'gen', 'ter', 'che'],
  Italian: ['che', 'one', 'ion', 'ell', 'ent', 'per', 'ato', 'del', 'zio', 'nte', 'con', 'ano'],
  Portuguese: ['que', 'ent', 'com', 'ade', 'par', 'ara', 'est', 'nto', 'con', 'men', 'ndo', 'res'],
};

const LANG_CODES: Record<string, string> = {
  English: 'en',
  Spanish: 'es',
  French: 'fr',
  German: 'de',
  Italian: 'it',
  Portuguese: 'pt',
  Hindi: 'hi',
  Tamil: 'ta',
  Arabic: 'ar',
  Russian: 'ru',
  Chinese: 'zh',
  Japanese: 'ja',
  Korean: 'ko',
};

export const SAMPLES: { label: string; text: string }[] = [
  { label: 'English', text: 'The natural language processing algorithm analyzes text to extract meaningful insights and grammatical structure.' },
  { label: 'Spanish', text: 'El procesamiento del lenguaje natural permite que los ordenadores comprendan el texto y el habla humana con gran precisión.' },
  { label: 'French', text: 'Le traitement automatique du langage naturel permet aux ordinateurs de comprendre et d analyser les documents écrits.' },
  { label: 'German', text: 'Die Verarbeitung natürlicher Sprache ermöglicht es Computern, menschliche Sprache und Texte präzise zu verstehen.' },
  { label: 'Italian', text: 'Il trattamento del linguaggio naturale consente ai computer di comprendere e analizzare il testo con modelli statistici.' },
  { label: 'Portuguese', text: 'O processamento de linguagem natural é uma subárea da ciência da computação que analisa o texto de forma inteligente.' },
  { label: 'Hindi', text: 'प्राकृतिक भाषा प्रसंस्करण कंप्यूटर को मानव भाषा को समझने और व्याख्या करने की क्षमता प्रदान करता है।' },
  { label: 'Tamil', text: 'இயற்கை மொழி செயலாக்கம் கணினிகளுக்கு மனித மொழியைப் புரிந்துகொள்ளவும் பகுப்பாய்வு செய்யவும் உதவுகிறது.' },
  { label: 'Arabic', text: 'تتيح معالجة اللغة الطبيعية لأجهزة الكمبيوتر فهم النصوص والتفاعل مع اللغة البشرية بدقة عالية.' },
  { label: 'Russian', text: 'Обработка естественного языка позволяет компьютерам анализировать и понимать структуру человеческой речи.' },
];

export function detectScript(text: string): { script: string; isNonLatin: boolean; directLang?: string } {
  if (/[\u0900-\u097F]/.test(text)) return { script: 'Devanagari (Hindi)', isNonLatin: true, directLang: 'Hindi' };
  if (/[\u0B80-\u0BFF]/.test(text)) return { script: 'Tamil', isNonLatin: true, directLang: 'Tamil' };
  if (/[\u0600-\u06FF]/.test(text)) return { script: 'Arabic', isNonLatin: true, directLang: 'Arabic' };
  if (/[\u0400-\u04FF]/.test(text)) return { script: 'Cyrillic (Russian/Slavic)', isNonLatin: true, directLang: 'Russian' };
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return { script: 'Japanese (Kana)', isNonLatin: true, directLang: 'Japanese' };
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(text)) return { script: 'Hangul (Korean)', isNonLatin: true, directLang: 'Korean' };
  if (/[\u4E00-\u9FFF]/.test(text)) return { script: 'Han (Chinese)', isNonLatin: true, directLang: 'Chinese' };
  return { script: 'Latin', isNonLatin: false };
}

export function detectLanguage(rawText: string): DetectionResult {
  const text = rawText.trim();
  if (text.length < 20) {
    const { script } = detectScript(text);
    return {
      script,
      topCandidates: [],
      matchedWords: [],
      isTooShort: true,
    };
  }

  const { script, isNonLatin, directLang } = detectScript(text);

  if (isNonLatin && directLang) {
    return {
      script,
      topCandidates: [{ language: directLang, code: LANG_CODES[directLang] || 'und', confidence: 100 }],
      matchedWords: [`Native ${script} characters`],
      isTooShort: false,
    };
  }

  const lower = text.toLowerCase();
  const words = lower.match(/[a-zA-ZÀ-ÿ'-]+/g) || [];
  const wordsSet = new Set(words);

  // Extract character trigrams
  const triCounts: Record<string, number> = {};
  for (let i = 0; i <= lower.length - 3; i++) {
    const tri = lower.slice(i, i + 3);
    triCounts[tri] = (triCounts[tri] || 0) + 1;
  }

  const scores: { language: string; score: number; why: string[] }[] = [];

  for (const [lang, commonList] of Object.entries(COMMON_WORDS)) {
    let wordMatches = 0;
    const matchedCommon: string[] = [];
    for (const w of commonList) {
      if (wordsSet.has(w)) {
        wordMatches += 2.5;
        matchedCommon.push(w);
      }
    }

    let trigramMatches = 0;
    const triList = TRIGRAMS[lang] || [];
    for (const tri of triList) {
      if (triCounts[tri]) {
        trigramMatches += triCounts[tri];
      }
    }

    const totalScore = wordMatches * 3 + trigramMatches;
    scores.push({
      language: lang,
      score: totalScore,
      why: matchedCommon,
    });
  }

  scores.sort((a, b) => b.score - a.score);

  const top3 = scores.slice(0, 3);
  const totalScore = top3.reduce((acc, curr) => acc + Math.max(curr.score, 0.1), 0);

  const topCandidates: DetectionCandidate[] = top3.map((item) => ({
    language: item.language,
    code: LANG_CODES[item.language] || 'und',
    confidence: Math.round((Math.max(item.score, 0.1) / totalScore) * 100),
  }));

  // Ensure confidence sum is exactly 100%
  const sum = topCandidates.reduce((acc, c) => acc + c.confidence, 0);
  if (topCandidates.length > 0 && sum !== 100) {
    topCandidates[0].confidence += 100 - sum;
  }

  const strongestMatches = top3[0].why.slice(0, 6);

  return {
    script,
    topCandidates,
    matchedWords: strongestMatches,
    isTooShort: false,
  };
}
