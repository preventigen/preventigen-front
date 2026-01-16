"use client";

import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BlurFade } from "@/components/ui/blur-fade";

type Item = { q: string; a: string };

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

  return (
    <section id="preguntas" className="scroll-mt-24 py-16 sm:py-20 bg-surface-muted/40">
      <Container>
        <SectionHeader title="Preguntas frecuentes" />

        <BlurFade inView delay={0.08}>
          <div className="mt-10 rounded-2xl border border-border bg-surface px-6">
            <Accordion type="single" collapsible defaultValue="item-0">
              {items.map((item, idx) => (
                <AccordionItem key={item.q} value={`item-${idx}`}>
                  <AccordionTrigger className="text-heading">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted leading-relaxed">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </BlurFade>
      </Container>
    </section>
  );
}
