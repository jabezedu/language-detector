"use client";

import { useState, useEffect } from "react";
import { detectLanguage, SAMPLES, DetectionResult } from "@/lib/detector";

export default function LanguageDetectorPage() {
  const [text, setText] = useState(SAMPLES[0].text);
  const [debouncedText, setDebouncedText] = useState(SAMPLES[0].text);
  const [result, setResult] = useState<DetectionResult>(() => detectLanguage(SAMPLES[0].text));

  // Debounce input changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(text);
    }, 180);
    return () => clearTimeout(handler);
  }, [text]);

  useEffect(() => {
    setResult(detectLanguage(debouncedText));
  }, [debouncedText]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl mb-1 text-emerald-600 dark:text-emerald-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Language &amp; Script Detector
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Real-time statistical language identification using character trigram distributions, function-word lexicons, and Unicode range parsing.
          </p>
        </header>

        {/* Sample Language Buttons */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-4 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Load Language Samples
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLES.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setText(s.text)}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="lang-input" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Input Text ({text.length} characters)
            </label>
            {text && (
              <button
                type="button"
                onClick={() => setText("")}
                className="text-xs text-slate-500 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            id="lang-input"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text in any language or script to identify..."
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-y text-sm leading-relaxed"
          />
        </div>

        {/* Results Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-xs uppercase font-medium text-slate-400">Detected Writing Script</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {result.script}
              </div>
            </div>
            {result.topCandidates.length > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Primary: {result.topCandidates[0].language} ({result.topCandidates[0].confidence}%)
              </span>
            )}
          </div>

          {result.isTooShort ? (
            <div className="py-6 text-center text-xs text-amber-600 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200/60 dark:border-amber-900/40">
              Not enough text to reliably identify language. Please enter at least 20 characters.
            </div>
          ) : (
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Top Candidate Languages
              </span>

              <div className="space-y-3">
                {result.topCandidates.map((c, idx) => (
                  <div key={c.language} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-[10px]">#{idx + 1}</span>
                        {c.language}
                        <span className="text-[10px] text-slate-400 font-mono">({c.code})</span>
                      </span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">{c.confidence}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${c.confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* "Why" line */}
              {result.matchedWords.length > 0 && (
                <div className="pt-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Key evidence: </span>
                  Matching lexical markers: {result.matchedWords.map((w) => `"${w}"`).join(", ")}.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
