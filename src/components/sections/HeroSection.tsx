"use client";

import { Container } from "../ui/Container";
import { Badge } from "@/src/components/magic/ui/badge";
import { BlurFade } from "@/src/components/magic/ui/blur-fade";
import { FlickeringGrid } from "@/src/components/magic/ui/flickering-grid";
import { ShimmerButton } from "@/src/components/magic/ui/shimmer-button";

type Props = {
  backgroundImageSrc?: string; 
  backgroundVideoSrc?: string; 
};

export function HeroSection({ backgroundImageSrc, backgroundVideoSrc }: Props) {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Background media */}
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
                ? { backgroundImage: `url(${backgroundImageSrc})`, backgroundSize: "cover", backgroundPosition: "center" }
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
          <BlurFade delay={0.05}>
            <h1 className="text-white text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Medicina preventiva con datos, criterio médico e IA.
            </h1>
          </BlurFade>

          <BlurFade delay={0.12}>
            <p className="mt-5 text-white/85 text-base leading-relaxed sm:text-lg">
              PreventiGen integra información clínica y tecnología avanzada para ayudarte a anticiparte,
              comprender mejor tu salud y tomar decisiones informadas junto a un profesional.
            </p>
          </BlurFade>

          <BlurFade delay={0.18}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#contacto">
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
              <p className="text-xs sm:text-sm text-white/70">
                No es atención de urgencias. Te contactamos para orientarte.
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.24}>
            <div className="mt-7 flex flex-wrap gap-2">
              <Badge variant="outline" className="border-white/15 text-white bg-white/10">
                Prevención personalizada
              </Badge>
              <Badge variant="outline" className="border-white/15 text-white bg-white/10">
                Confidencialidad
              </Badge>
              <Badge variant="outline" className="border-white/15 text-white bg-white/10">
                Acompañamiento médico
              </Badge>
            </div>
          </BlurFade>
        </div>
      </Container>
    </section>
  );
}
