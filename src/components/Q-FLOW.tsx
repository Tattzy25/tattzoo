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
    return () => window.removeEventListener("tattty:answer-submitted", handler);
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
              <Card className="min-h-[260px] sm:min-h-80 md:min-h-[420px] p-4 sm:p-6 md:p-8 rounded-2xl border border-accent/50 bg-background/60 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                <CardHeader>
                  {(q.id === 'question_one' || q.id === 'question_two') ? (
                    (() => {
                      const tq = tattooQuotes[q.id as 'question_one' | 'question_two'];
                      return (
                        <div className="flex flex-col gap-1">
                          {tq.blocks.map((b, idx) => (
                            <div
                              key={idx}
                              className={`${tq.colorClass}`}
                              style={{
                                fontFamily: tq.fontFamily,
                                fontSize: `${b.size}px`,
                                textShadow: tq.textShadow,
                                textAlign: b.align || 'left',
                                letterSpacing: '1px',
                              }}
                            >
                              {b.text}
                            </div>
                          ))}
                        </div>
                      );
                    })()
                  ) : (
                    <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-[Orbitron] tracking-wider leading-tight text-foreground">{q.label}</CardTitle>
                  )}
                  {q.helpText && <CardDescription className="text-sm sm:text-base text-muted-foreground">{q.helpText}</CardDescription>}
                  <div className="text-xs sm:text-sm text-muted-foreground">Min {q.minCharacters} characters</div>
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