"use client";

import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/magic/ui/accordion";
import { BlurFade } from "@/src/components/magic/ui/blur-fade";
import { HelpCircle, ShieldCheck, Stethoscope, Sparkles } from "lucide-react";
import { ShimmerButton } from "@/src/components/magic/ui/shimmer-button";

type Item = { q: string; a: string; tag?: "clínico" | "IA" | "datos" | "urgencias" };

const tagStyles: Record<NonNullable<Item["tag"]>, string> = {
  clínico: "bg-primary/10 text-primary border-primary/20",
  IA: "bg-accent/15 text-primary border-accent/40 ring-1 ring-accent/25 shadow-sm",
  datos: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300",
  urgencias: "bg-destructive/10 text-destructive border-destructive/20",
};

function Tag({ children, kind }: { children: React.ReactNode; kind: NonNullable<Item["tag"]> }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide",
        tagStyles[kind],
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export function FAQSection() {
  const items: Item[] = [
    {
      q: "¿PreventiGen reemplaza a mi médico?",
      a: "No. PreventiGen acompaña la prevención y la comprensión de datos, pero la evaluación y la decisión final siempre es médica.",
      tag: "clínico",
    },
    {
      q: "¿Esto es un diagnóstico automático?",
      a: "No. La plataforma no realiza diagnósticos automáticos ni reemplaza una consulta médica. Organiza información para apoyar la lectura y el seguimiento.",
      tag: "clínico",
    },
    {
      q: "¿Qué datos necesito para empezar?",
      a: "Podés comenzar con información clínica básica. Según el caso, pueden incorporarse laboratorios, biomarcadores y (si aplica) genética.",
      tag: "datos",
    },
    {
      q: "¿Qué es un gemelo digital?",
      a: "Es un modelo clínico virtual construido con datos relevantes para comprender mejor tu salud y explorar escenarios de forma segura.",
      tag: "IA",
    },
    {
      q: "¿Cómo se usa la IA?",
      a: "Como apoyo para ordenar información, priorizar señales y facilitar el seguimiento longitudinal con un enfoque responsable.",
      tag: "IA",
    },
    {
      q: "¿Qué pasa con mi privacidad?",
      a: "El sistema se diseña con confidencialidad, control de acceso por roles y trazabilidad de acciones.",
      tag: "datos",
    },
    {
      q: "¿Atienden urgencias o emergencias?",
      a: "No. Ante una urgencia o emergencia, acudí a un servicio médico o de emergencias.",
      tag: "urgencias",
    },
  ];

  return (
    <section id="preguntas" className="scroll-mt-24 py-16 sm:py-20 bg-surface-muted/40">
      <Container>
        <SectionHeader
          title="Preguntas frecuentes"
          subtitle="Respuestas claras y directas para que sepas qué esperar."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          {/* FAQ */}
          <BlurFade inView delay={0.08} className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface">
              {/* subtle top glow */}
              <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[520px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

              <div className="flex items-start gap-3 border-b border-border/60 px-6 py-5">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-heading font-semibold">¿En qué podemos ayudarte?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Si una respuesta no te alcanza, podés pedir contacto y te orientamos.
                  </p>
                </div>
              </div>

              <div className="px-3 py-2 sm:px-6 sm:py-4">
                <Accordion type="single" collapsible defaultValue="item-0">
                  {items.map((item, idx) => (
                    <AccordionItem
                      key={item.q}
                      value={`item-${idx}`}
                      className="border-b border-border/60 last:border-b-0"
                    >
                      <AccordionTrigger
                        className={[
                          "group rounded-2xl px-3 py-4 text-left text-heading",
                          "hover:bg-surface-muted/60 hover:no-underline",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                          "data-[state=open]:bg-surface-muted/60",
                        ].join(" ")}
                      >
                        <div className="flex w-full items-center justify-between gap-3">
                          <div className="flex flex-col gap-2">
                            <span className="font-semibold">{item.q}</span>
                            {item.tag ? (
                              <div className="flex items-center gap-2">
                                <Tag kind={item.tag}>
                                  {item.tag === "clínico"
                                    ? "Enfoque clínico"
                                    : item.tag === "IA"
                                    ? "IA aplicada"
                                    : item.tag === "datos"
                                    ? "Datos y privacidad"
                                    : "Urgencias"}
                                </Tag>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-6 pb-5 pt-1 text-muted-foreground leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </BlurFade>

          {/* Side panel */}
          <BlurFade inView delay={0.14} className="lg:col-span-4">
            <div className="rounded-3xl border border-border bg-surface p-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-heading font-semibold">¿No encontraste tu respuesta?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Te orientamos para entender tu caso y próximos pasos.
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-3 text-sm text-foreground">
                <li className="flex gap-2">
                  <Stethoscope className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>Enfoque de apoyo, no reemplazo clínico.</span>
                </li>
                <li className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>Privacidad y cuidado de datos desde el diseño.</span>
                </li>
              </ul>

              <div className="mt-6">
                <a href="#contacto" className="block w-full">
                  <ShimmerButton
                          shimmerColor="rgba(255, 255, 255, 0.35)"
                          shimmerDuration="4.5s"
                          shimmerSize="0.12em"
                          borderRadius="14px"
                          background="var(--color-primary)"
                          className="h-11 w-full px-6 text-sm font-medium text-primary-foreground shadow-sm"
                        >
                          Solicitar contacto
                        </ShimmerButton>
                </a>

                <p className="mt-3 text-xs text-muted-foreground">
                  No es atención de urgencias. Si es una emergencia, acudí a un servicio médico.
                </p>
              </div>
            </div>
          </BlurFade>
        </div>
      </Container>
    </section>
  );
}
