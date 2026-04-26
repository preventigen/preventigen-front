"use client";

import { Activity, BrainCircuit, Building2, ChevronRight, Stethoscope } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { getWhatsAppHref } from "@/src/lib/contact";

import { Container } from "../ui/Container";

const pillars = [
  {
    icon: Activity,
    title: "Diagnóstico avanzado",
    description:
      "Edad biológica, genética, biomarcadores y data para entender el punto de partida con criterio clínico.",
  },
  {
    icon: BrainCircuit,
    title: "Seguimiento personalizado",
    description:
      "IA + gemelo digital + plataforma CITE/ECAMM para sostener lectura longitudinal y decisiones mejor informadas.",
  },
  {
    icon: Stethoscope,
    title: "Intervención médica",
    description:
      "Programas validados disponibles en Argentina para convertir datos y seguimiento en acción concreta.",
  },
];

export function BlueZonesExperienceSection() {
  const whatsappHref =
    getWhatsAppHref("Hola, quiero solicitar contacto por BLUE ZONES EXPERIENCE.") ?? "#contacto";
  const opensWhatsApp = whatsappHref.startsWith("https://wa.me/");

  return (
    <section id="blue-zones-experience" className="py-16 sm:py-20">
      <Container>
        <BlurFade inView delay={0.04}>
          <div className="overflow-hidden rounded-3xl border border-border bg-surface">
            <div className="border-b border-border/70 bg-gradient-to-br from-heading to-heading/90 px-6 py-8 text-white sm:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <Badge variant="outline" className="border-white/15 bg-white/10 text-white">
                    <Building2 className="mr-1.5 h-3.5 w-3.5" />
                    BLUE ZONES EXPERIENCE
                  </Badge>

                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Longevidad integrada al Real Estate
                  </h2>

                  <p className="mt-3 leading-relaxed text-white/80">
                    BLUE ZONES EXPERIENCE integra medicina de longevidad dentro del Real Estate,
                    combinando salud, tecnología y experiencia premium.
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
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
                      Solicitar contacto por WhatsApp
                    </ShimmerButton>
                  </a>
                  <a
                    href="#contacto"
                    className="inline-flex items-center gap-1 text-sm font-medium text-white/80 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    Ir al formulario
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-4 px-6 py-6 sm:px-8 lg:grid-cols-3">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon;

                return (
                  <BlurFade key={pillar.title} inView delay={0.08 + index * 0.06}>
                    <Card className="h-full rounded-3xl border-border bg-background/80 py-0 shadow-none">
                      <CardHeader className="px-6 pt-6">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Pilar {index + 1}
                          </span>
                        </div>
                        <CardTitle className="text-xl text-heading">{pillar.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="px-6 pb-6">
                        <p className="leading-relaxed text-muted-foreground">{pillar.description}</p>
                      </CardContent>
                    </Card>
                  </BlurFade>
                );
              })}
            </div>
          </div>
        </BlurFade>
      </Container>
    </section>
  );
}
