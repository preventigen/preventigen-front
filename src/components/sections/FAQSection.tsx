"use client";

import { useState } from "react";
import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";

type Item = { q: string; a: string };

function FAQItem({
  item,
  index,
  open,
  onToggle,
}: {
  item: Item;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const id = `faq-${index}`;
  return (
    <div className="rounded-2xl border border-border bg-surface">
      <button
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
      >
        <span className="text-heading font-medium">{item.q}</span>
        <span className="text-muted">{open ? "−" : "+"}</span>
      </button>
      <div id={id} className={`px-5 pb-5 ${open ? "block" : "hidden"}`}>
        <p className="text-muted leading-relaxed">{item.a}</p>
      </div>
    </div>
  );
}

export function FAQSection() {
  const items: Item[] = [
    {
      q: "¿PreventiGen reemplaza a mi médico?",
      a: "No. PreventiGen acompaña la prevención y la comprensión de datos, pero la evaluación y decisión final siempre es médica.",
    },
    {
      q: "¿Esto es un diagnóstico automático?",
      a: "No. La plataforma no diagnostica automáticamente ni reemplaza una consulta médica.",
    },
    {
      q: "¿Qué datos necesito para empezar?",
      a: "Podés comenzar con información clínica básica. Según el caso, pueden incorporarse laboratorios, biomarcadores y genética.",
    },
    {
      q: "¿Qué es un gemelo digital?",
      a: "Es un modelo clínico virtual construido con datos relevantes para comprender mejor tu salud y explorar escenarios.",
    },
    {
      q: "¿Cómo se usa la IA?",
      a: "Como apoyo para ordenar información, priorizar señales y facilitar el seguimiento longitudinal con un enfoque responsable.",
    },
    {
      q: "¿Qué pasa con mi privacidad?",
      a: "El sistema se diseña con confidencialidad, control de acceso por roles y trazabilidad de acciones.",
    },
    {
      q: "¿Atienden urgencias o emergencias?",
      a: "No. Ante una urgencia o emergencia, acudí a un servicio médico o de emergencias.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="preguntas" className="scroll-mt-24 py-16 sm:py-20 bg-surface-muted/40">
      <Container>
        <SectionHeader title="Preguntas frecuentes" />

        <div className="mt-10 space-y-3">
          {items.map((item, idx) => (
            <FAQItem
              key={item.q}
              item={item}
              index={idx}
              open={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
