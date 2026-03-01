 "use client";

import { useState } from "react";

type Faq = {
  q: string;
  a: string;
};

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="border-[3px] border-black shadow-neo-lg overflow-hidden bg-white">
      {faqs.map((f, i) => {
        const isOpen = openIndex === i;

        return (
          <div
            key={i}
            className="border-b-2 border-black last:border-0"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#FFFBEB] transition-colors"
            >
              <div>
                <p className="font-display font-extrabold text-base uppercase text-black mb-1 text-left">
                  {f.q}
                </p>
                {isOpen && (
                  <p className="text-sm font-medium text-black/60 leading-relaxed text-left">
                    {f.a}
                  </p>
                )}
              </div>
              <span className="font-display font-extrabold text-xl text-black select-none">
                {isOpen ? "−" : "+"}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

