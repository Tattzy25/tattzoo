"use client";
import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { tatttyQuestions } from "@/data/field-labels";
import useEmblaCarousel from "embla-carousel-react";
import { sessionDataStore } from "@/services/submissionService";
import { tattooQuotes } from "@/data/tattoo-quotes";

export default function QFlow() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [viewportRef, embla] = useEmblaCarousel({ loop: false, align: "start" });

  const syncQuestion = useCallback((idx: number) => {
    const id = tatttyQuestions[idx]?.id ?? "question_one";
    const anyWin = window as any;
    if (typeof anyWin.tatttySetQuestion === "function") {
      anyWin.tatttySetQuestion(id);
    } else {
      anyWin.tatttyCurrentQuestionId = id;
      window.dispatchEvent(new CustomEvent("tattty:question-changed", { detail: { id } }));
    }
  }, []);

  const onSelect = useCallback(() => {
    if (!embla) return;
    const idx = embla.selectedScrollSnap();
    setSelectedIndex(idx);
    syncQuestion(idx);
  }, [embla, syncQuestion]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    onSelect();

    // Expose external controls for switching questions
    (window as any).tatttyScrollTo = (index: number) => {
      if (!embla) return;
      const clamped = Math.max(0, Math.min(index, tatttyQuestions.length - 1));
      embla.scrollTo(clamped);
      syncQuestion(clamped);
    };
  }, [embla, onSelect]);

  useEffect(() => {
    const source = sessionDataStore.getSourceCardData();
    const initial: Record<string, string> = {};
    if (source?.question1?.answer) initial["question_one"] = source.question1.answer;
    if (source?.question2?.answer) initial["question_two"] = source.question2.answer;
    setAnswers(initial);
    const handler = (e: any) => {
      const id = e?.detail?.id;
      const text = e?.detail?.text;
      if (id && text) {
        setAnswers(prev => ({ ...prev, [id]: text }));
      }
    };
    window.addEventListener("tattty:answer-submitted", handler);
    window.addEventListener("tattty:answer-draft", handler);
    return () => {
      window.removeEventListener("tattty:answer-submitted", handler);
      window.removeEventListener("tattty:answer-draft", handler);
    };
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!embla) return;
    if (e.key === "ArrowLeft") embla.scrollPrev();
    if (e.key === "ArrowRight") embla.scrollNext();
  }, [embla]);

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 max-w-5xl mx-auto">
      <div className="overflow-hidden" ref={viewportRef} tabIndex={0} onKeyDown={onKeyDown}>
        <div className="flex">
          {tatttyQuestions.map((q) => (
            <div key={q.id} className="min-w-full px-3 sm:px-4 md:px-6">
              <Card className="p-4 sm:p-6 md:p-8 rounded-2xl border border-accent/50 bg-background/60 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                <CardHeader>
                  {(q.id === 'question_one' || q.id === 'question_two') ? (
                    (() => {
                      const tq = tattooQuotes[q.id as 'question_one' | 'question_two'];
                      const size = Math.max(...tq.blocks.map(b => b.size));
                      return (
                        <div className="flex flex-col gap-1">
                          <div
                            className={`${tq.colorClass}`}
                            style={{
                              fontFamily: tq.fontFamily,
                              fontSize: `${size}px`,
                              textShadow: tq.textShadow,
                              textAlign: 'center',
                              letterSpacing: '1px',
                            }}
                          >
                            {q.label}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-[Orbitron] tracking-wider leading-tight text-foreground">{q.label}</CardTitle>
                  )}
                  
                </CardHeader>
                <CardContent>
                  {answers[q.id] && (
                    <div className="text-base sm:text-lg md:text-xl text-foreground whitespace-pre-wrap wrap-break-word">
                      {answers[q.id]}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="sr-only">Question {selectedIndex + 1} of {tatttyQuestions.length}</div>
    </div>
  );
}