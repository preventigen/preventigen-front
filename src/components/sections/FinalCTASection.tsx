"use client";

import { ArrowRight, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { getWhatsAppHref } from "@/src/lib/contact";

import { Container } from "../ui/Container";

function HeroChip({ children }: { children: React.ReactNode }) {
  return (
    <Badge
      variant="outline"
      className="border-white/15 bg-white/10 text-white/90 hover:bg-white/15"
    >
      {children}
    </Badge>
  );
}

export function FinalCTASection() {
  const whatsappHref =
    getWhatsAppHref("Hola, quiero solicitar contacto por BLUE ZONES EXPERIENCE.") ?? "#contacto";
  const opensWhatsApp = whatsappHref.startsWith("https://wa.me/");

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <BlurFade inView delay={0.06}>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-heading">
            <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(900px_circle_at_18%_20%,rgba(45,212,191,0.22),transparent_60%),radial-gradient(800px_circle_at_88%_80%,rgba(31,111,235,0.18),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-black/15" />

            <div className="relative px-6 py-10 sm:px-10 sm:py-12">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                    <Sparkles className="h-4 w-4" />
                    Un primer paso claro y acompañado
                  </div>

                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Hablemos sobre tu prevención
                  </h2>

                  <p className="mt-3 max-w-2xl leading-relaxed text-white/80">
                    Si querés orientación y un primer paso claro, escribinos por WhatsApp o dejá tus
                    datos en el formulario para acompañarte.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <a
                      href={whatsappHref}
                      target={opensWhatsApp ? "_blank" : undefined}
                      rel={opensWhatsApp ? "noopener noreferrer" : undefined}
                      aria-label="Abrir WhatsApp para solicitar contacto"
                    >
                      <ShimmerButton
                        shimmerColor="rgba(255, 255, 255, 0.35)"
                        shimmerDuration="4.5s"
                        shimmerSize="0.12em"
                        borderRadius="14px"
                        background="var(--color-primary)"
                        className="h-11 px-6 text-sm font-medium text-primary-foreground shadow-sm"
                      >
                        <span className="inline-flex items-center gap-2">
                          Solicitar contacto <ArrowRight className="h-4 w-4" />
                        </span>
                      </ShimmerButton>
                    </a>

                    <div className="flex flex-col gap-1">
                      <a
                        href="#contacto"
                        className="text-sm font-medium text-white/80 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        Ir al formulario
                      </a>
                      <p className="text-xs text-white/70 sm:text-sm">
                        No es atención de urgencias. Te contactamos para orientarte.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <HeroChip>Prevención personalizada</HeroChip>
                    <HeroChip>Confidencialidad</HeroChip>
                    <HeroChip>Acompañamiento médico</HeroChip>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <p className="font-semibold text-white">Qué pasa después</p>
                    <ol className="mt-4 space-y-3 text-sm text-white/80">
                      <li className="flex gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs text-white/90">
                          1
                        </span>
                        <span>Nos contás tu objetivo y el contexto, sin compromiso.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs text-white/90">
                          2
                        </span>
                        <span>Te orientamos sobre qué información sirve para empezar.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs text-white/90">
                          3
                        </span>
                        <span>Definimos próximos pasos con criterio clínico.</span>
                      </li>
                    </ol>

                    <div className="mt-6 space-y-3 text-sm text-white/80">
                      <div className="flex gap-2">
                        <Stethoscope className="mt-0.5 h-4 w-4 text-white/60" />
                        <span>Enfoque de apoyo, no reemplazo médico.</span>
                      </div>
                      <div className="flex gap-2">
                        <ShieldCheck className="mt-0.5 h-4 w-4 text-white/60" />
                        <span>Privacidad y cuidado de datos desde el diseño.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 h-px w-full bg-white/10" />
            </div>
          </div>
        </BlurFade>
      </Container>
    </section>
  );
}
