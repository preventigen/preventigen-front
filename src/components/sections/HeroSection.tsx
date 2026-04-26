"use client";

import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { getWhatsAppHref } from "@/src/lib/contact";

import { Container } from "../ui/Container";

type Props = {
  backgroundImageSrc?: string;
  backgroundVideoSrc?: string;
};

export function HeroSection({ backgroundImageSrc, backgroundVideoSrc }: Props) {
  const whatsappHref =
    getWhatsAppHref("Hola, quiero solicitar contacto por BLUE ZONES EXPERIENCE.") ?? "#contacto";
  const opensWhatsApp = whatsappHref.startsWith("https://wa.me/");

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0">
        {backgroundVideoSrc ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={backgroundImageSrc}
          >
            <source src={backgroundVideoSrc} />
          </video>
        ) : (
          <div
            className="h-full w-full bg-surface-muted"
            style={
              backgroundImageSrc
                ? {
                    backgroundImage: `url(${backgroundImageSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          />
        )}

        <div className="absolute inset-0">
          <FlickeringGrid
            className="h-full w-full opacity-15 [mask-image:radial-gradient(60%_55%_at_50%_30%,#000_0%,transparent_70%)] [mask-repeat:no-repeat] [mask-size:cover] [mask-position:center] [webkit-mask-image:radial-gradient(60%_55%_at_50%_30%,#000_0%,transparent_70%)]"
            color="rgb(255, 255, 255)"
            maxOpacity={0.14}
            flickerChance={0.2}
            squareSize={3}
            gridGap={6}
          />
        </div>

        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-heading/10 via-heading/40 to-heading/80" />
      </div>

      <Container className="relative py-20 sm:py-24 lg:py-28">
        <div className="max-w-3xl">
          <BlurFade delay={0.02}>
            <div className="inline-flex rounded-2xl bg-white px-4 py-3 shadow-[0_14px_40px_rgba(15,23,42,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-heading sm:text-sm">
                BLUE ZONES EXPERIENCE • MEDICINA DE LONGEVIDAD
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.05}>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Medicina preventiva con datos, criterio médico e IA.
            </h1>
          </BlurFade>

          <BlurFade delay={0.12}>
            <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">
              PreventiGen integra información clínica y tecnología avanzada para ayudarte a
              anticiparte, comprender mejor tu salud y tomar decisiones informadas junto a un
              profesional.
            </p>
          </BlurFade>

          <BlurFade delay={0.18}>
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
                  Solicitar contacto
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
          </BlurFade>

          <BlurFade delay={0.24}>
            <div className="mt-7 flex flex-wrap gap-2">
              <Badge variant="outline" className="border-white/15 bg-white/10 text-white">
                Prevención personalizada
              </Badge>
              <Badge variant="outline" className="border-white/15 bg-white/10 text-white">
                Confidencialidad
              </Badge>
              <Badge variant="outline" className="border-white/15 bg-white/10 text-white">
                Acompañamiento médico
              </Badge>
            </div>
          </BlurFade>
        </div>
      </Container>
    </section>
  );
}
