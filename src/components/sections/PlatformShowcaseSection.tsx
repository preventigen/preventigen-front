"use client";

import type { ComponentType, ReactNode } from "react";
import Image from "next/image";
import {
  Activity,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ClipboardPlus,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";

type Feature = {
  id?: string;
  badge: string;
  title: string;
  intro: string;
  description: string;
  slogan: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  imageKind: "wide" | "balanced" | "tall";
  imageLabel: string;
  chips: string[];
  bullets: string[];
  Icon: ComponentType<{ className?: string }>;
};

const overviewItems = [
  {
    title: "Panel médico",
    text: "Prioridades, alertas y pacientes activos en una sola vista.",
    Icon: LayoutDashboard,
  },
  {
    title: "Historia ordenada",
    text: "Datos clínicos, estudios y antecedentes bien estructurados.",
    Icon: ClipboardPlus,
  },
  {
    title: "IA contextual",
    text: "Resumen previo a la consulta con foco en lo relevante.",
    Icon: BrainCircuit,
  },
  {
    title: "Gemelo digital",
    text: "Simulación clínica para evaluar escenarios con más seguridad.",
    Icon: Sparkles,
  },
];

const features: Feature[] = [
  {
    id: "ecamm",
    badge: "Dashboard clínico",
    title: "Toda la información, en un solo lugar.",
    intro:
      "Accedé a un panel centralizado para ver lo importante sin perder tiempo entre pantallas.",
    description:
      "Una visión rápida y clara para priorizar y tomar decisiones con contexto.",
    slogan: "Visión rápida. Decisiones con contexto.",
    imageSrc: "/images/1 dashboard medico.png",
    imageAlt: "Dashboard médico de PreventiGen con métricas y resumen clínico.",
    imageWidth: 1920,
    imageHeight: 838,
    imageKind: "wide",
    imageLabel: "Resumen general",
    chips: ["Pacientes activos", "Alertas relevantes", "Últimas consultas"],
    bullets: [
      "Pacientes activos",
      "Alertas relevantes",
      "Últimas consultas y evoluciones",
      "Indicadores clave del estado general",
    ],
    Icon: LayoutDashboard,
  },
  {
    badge: "Gestión del paciente",
    title: "Organizá la información clínica de forma simple y estructurada.",
    intro:
      "Cada ingreso mantiene el historial ordenado desde el inicio, con una lógica clara para el trabajo diario.",
    description:
      "Todo el historial en un solo lugar, accesible y ordenado.",
    slogan: "Orden clínico desde el primer ingreso.",
    imageSrc: "/images/2 carga nuevo paciente.png",
    imageAlt: "Pantalla de carga de nuevo paciente en PreventiGen.",
    imageWidth: 1920,
    imageHeight: 1605,
    imageKind: "balanced",
    imageLabel: "Nuevo paciente",
    chips: ["Datos del paciente", "Evoluciones", "Documentación"],
    bullets: [
      "Datos del paciente",
      "Informes médicos",
      "Evoluciones y antecedentes",
      "Estudios y documentos",
    ],
    Icon: ClipboardPlus,
  },
  {
    id: "ia",
    badge: "Análisis con IA",
    title: "Antes de cada consulta, obtené un diagnóstico contextual completo.",
    intro:
      "La IA organiza el contexto clínico para que llegues a la consulta con una lectura rápida y accionable.",
    description:
      "Te brinda un panorama claro y resumido para que llegues a la consulta con la mejor información posible.",
    slogan: "Más precisión. Mejor criterio clínico.",
    imageSrc: "/images/3 analisis IA.png",
    imageAlt: "Pantalla de análisis clínico con IA en PreventiGen.",
    imageWidth: 1920,
    imageHeight: 838,
    imageKind: "wide",
    imageLabel: "Análisis previo",
    chips: ["Historial clínico", "Tratamientos previos", "Síntomas recurrentes"],
    bullets: [
      "Historial clínico",
      "Tratamientos previos",
      "Evolución del paciente",
      "Síntomas recurrentes",
    ],
    Icon: BrainCircuit,
  },
  {
    id: "gemelo",
    badge: "Gemelo digital",
    title: "Probá antes de decidir.",
    intro:
      "Simulá tratamientos, medicación o intervenciones sobre el gemelo digital del paciente antes de llevarlos a la práctica.",
    description:
      "Reducí el margen de error y tomá decisiones con mayor seguridad.",
    slogan: "Menos incertidumbre. Más seguridad clínica.",
    imageSrc: "/images/4 gemelo.png",
    imageAlt: "Interfaz de gemelo digital del paciente en PreventiGen.",
    imageWidth: 1920,
    imageHeight: 3264,
    imageKind: "tall",
    imageLabel: "Simulación clínica",
    chips: ["Riesgos potenciales", "Contraindicaciones", "Resultados posibles"],
    bullets: [
      "Detectá alergias o contraindicaciones",
      "Evaluá riesgos potenciales",
      "Anticipá resultados posibles",
    ],
    Icon: Sparkles,
  },
  {
    badge: "Asistente clínico",
    title: "Asistente inteligente para el médico",
    intro:
      "Consultá a la IA sobre el paciente en tiempo real y usala como apoyo para profundizar la lectura clínica.",
    description:
      "Una segunda mirada, siempre disponible.",
    slogan: "Explorá hipótesis con respaldo contextual.",
    imageSrc: "/images/5 asistente medico.png",
    imageAlt: "Asistente médico con IA integrado en PreventiGen.",
    imageWidth: 1920,
    imageHeight: 3264,
    imageKind: "tall",
    imageLabel: "Asistente médico",
    chips: ["Consultas específicas", "Diagnósticos", "Alternativas"],
    bullets: [
      "Analiza el estado del paciente",
      "Responde consultas específicas",
      "Ayuda a explorar diagnósticos y alternativas",
    ],
    Icon: Bot,
  },
];

function SurfaceCard({
  children,
  className = "",
  accent = false,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  const panel = accent
    ? "rounded-[28px] border border-accent/25 bg-gradient-to-br from-accent/10 via-surface/85 to-primary/5 p-6 shadow-sm backdrop-blur-sm sm:p-7"
    : "rounded-[28px] border border-border/80 bg-surface/75 p-6 shadow-sm backdrop-blur-sm sm:p-7";

  const outer =
    "group relative overflow-hidden rounded-[28px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md";

  return (
    <>
      <div className={`lg:hidden ${outer} ${className}`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(34rem_24rem_at_15%_10%,rgba(45,212,191,0.12),transparent_55%)]"
        />
        <div className={panel}>{children}</div>
      </div>

      <MagicCard
        className={`hidden lg:block ${outer} ${className}`}
        gradientFrom="var(--color-accent)"
        gradientTo="var(--color-primary)"
        gradientColor="var(--color-accent)"
        gradientOpacity={accent ? 0.16 : 0.12}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(34rem_24rem_at_15%_10%,rgba(45,212,191,0.12),transparent_55%)]"
        />
        <div className={panel}>{children}</div>
      </MagicCard>
    </>
  );
}

function BadgeMini({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function OverviewCard({
  title,
  text,
  Icon,
}: {
  title: string;
  text: string;
  Icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/55 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/12 text-foreground ring-1 ring-accent/20">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-heading">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProductShot({
  feature,
}: {
  feature: Feature;
}) {
  const frameHeight =
    feature.imageKind === "tall"
      ? "min-h-[24rem] sm:min-h-[30rem]"
      : feature.imageKind === "balanced"
        ? "min-h-[21rem] sm:min-h-[24rem]"
        : "min-h-[18rem] sm:min-h-[20rem]";

  const imageClassName =
    feature.imageKind === "tall"
      ? "h-auto max-h-[30rem] w-auto max-w-full object-contain"
      : feature.imageKind === "balanced"
        ? "h-auto max-h-[23rem] w-auto max-w-full object-contain"
        : "h-auto w-full object-contain";

  return (
    <div className="rounded-[26px] border border-border/80 bg-background/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <div className="flex items-center justify-between rounded-[18px] border border-border/70 bg-surface-muted/70 px-4 py-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent/65" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary/45" />
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong/55" />
        </div>
        <span>{feature.imageLabel}</span>
      </div>

      <div
        className={`relative mt-3 flex items-center justify-center overflow-hidden rounded-[22px] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(239,249,248,0.72))] px-4 py-4 ${frameHeight}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.12),transparent_48%)]"
        />
        <Image
          src={feature.imageSrc}
          alt={feature.imageAlt}
          width={feature.imageWidth}
          height={feature.imageHeight}
          sizes="(min-width: 1280px) 36rem, (min-width: 1024px) 42vw, 100vw"
          className={`relative z-10 rounded-[18px] shadow-[0_24px_60px_rgba(15,23,42,0.14)] ${imageClassName}`}
        />
      </div>
    </div>
  );
}

function FeatureStory({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const reverse = index % 2 === 1;
  const Icon = feature.Icon;

  return (
    <article id={feature.id} className="scroll-mt-24">
      <SurfaceCard accent={feature.id === "gemelo"}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center xl:gap-10">
          <div className={reverse ? "lg:order-2" : ""}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <BadgeMini>{feature.badge}</BadgeMini>
                <h3 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-heading sm:text-[1.95rem]">
                  {feature.title}
                </h3>
              </div>

              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/12 text-foreground ring-1 ring-accent/20 sm:flex">
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-base leading-relaxed text-foreground/90">
              {feature.intro}
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {feature.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {feature.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {feature.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/50 px-4 py-3"
                >
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-foreground" />
                  <span className="text-sm leading-relaxed text-foreground">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/10 px-5 py-4">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
                En una frase
              </p>
              <p className="mt-2 text-lg font-semibold leading-snug text-heading">
                {feature.slogan}
              </p>
            </div>
          </div>

          <div className={reverse ? "lg:order-1" : ""}>
            <ProductShot feature={feature} />
          </div>
        </div>
      </SurfaceCard>
    </article>
  );
}

export function PlatformShowcaseSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-surface-muted/45 via-background to-background"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-[-12%] -z-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-[-10%] -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />

      <Container>
        <SectionHeader
          title="Conocé cómo funciona PreventiGen"
          subtitle="Transformá la forma en que gestionás pacientes, tomás decisiones y reducís riesgos clínicos."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          <BlurFade inView delay={0.04} className="lg:col-span-5">
            <SurfaceCard accent className="h-full">
              <BadgeMini>Recorrido del sistema</BadgeMini>

              <h3 className="mt-4 text-2xl font-semibold leading-tight text-heading">
                Una plataforma pensada para que el flujo clínico se sienta claro, rápido y confiable.
              </h3>

              <p className="mt-4 leading-relaxed text-muted-foreground">
                Desde el tablero inicial hasta la simulación sobre el gemelo digital, cada vista organiza la complejidad para que el profesional trabaje con más contexto y menos fricción.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/55 p-4">
                  <p className="text-sm font-semibold text-heading">Pensado para la práctica real</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Jerarquía visual clara, lecturas rápidas y acceso inmediato a la historia clínica.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/55 p-4">
                  <p className="text-sm font-semibold text-heading">Diseñado para decidir mejor</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    IA contextual, alertas relevantes y simulación clínica dentro del mismo ecosistema.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/20 bg-background/45 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  PreventiGen no reemplaza al médico. Ordena, resume y amplía el contexto para potenciar el criterio clínico.
                </p>
              </div>
            </SurfaceCard>
          </BlurFade>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {overviewItems.map((item, index) => (
              <BlurFade key={item.title} inView delay={0.08 + index * 0.05}>
                <OverviewCard {...item} />
              </BlurFade>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {features.map((feature, index) => (
            <BlurFade key={feature.title} inView delay={0.04 + index * 0.04}>
              <FeatureStory feature={feature} index={index} />
            </BlurFade>
          ))}
        </div>

        <BlurFade inView delay={0.28} className="mt-8">
          <SurfaceCard accent>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:items-center">
              <div>
                
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-heading sm:text-[2rem]">
                  Una nueva forma de ejercer la medicina
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-foreground">
                  PreventiGen no reemplaza al médico.
                  <br />
                  Lo potencia.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Más información, más seguridad y menos incertidumbre en cada consulta.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  "Mejora la toma de decisiones",
                  "Reduce riesgos clínicos",
                  "Optimiza el seguimiento de pacientes",
                  "Aporta claridad en cada consulta",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/55 px-4 py-4"
                  >
                    <Activity className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
                    <p className="text-sm leading-relaxed text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </SurfaceCard>
        </BlurFade>
      </Container>
    </section>
  );
}
