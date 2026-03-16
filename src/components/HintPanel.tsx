"use client";

import { AnimatePresence, motion } from "motion/react";

type HintPanelProps = {
  hint: string;
  open: boolean;
  onToggle: () => void;
};

export default function HintPanel({ hint, open, onToggle }: HintPanelProps) {
  return (
    <section
      className="flex w-full flex-col items-center"
      aria-label="Hint for today's puzzle"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="hint-content"
        className="bg-amber-50 py-1 px-3 rounded-3xl border border-amber-300/70 cursor-pointer text-sm font-semibold text-amber-700/90"
      >
        <span className="text-base" aria-hidden>
          💡
        </span>
        <span>{open ? "  Hide hint" : "  Need a hint?"}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="hint-content"
            role="region"
            aria-label="Hint content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.2 },
            }}
            className="overflow-hidden"
          >
            <div
              className="
                mt-3 rounded-xl border border-amber-300/70
                bg-amber-50 py-3 pl-4 pr-4 text-sm text-amber-900
              "
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-700/90">
                Hint
              </p>
              <p className="leading-relaxed">{hint}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
