"use client";

import { Container } from "../ui/Container";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";

export function FinalCTASection() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <BlurFade inView delay={0.06}>
          <div className="rounded-3xl border border-border bg-heading px-6 py-10 sm:px-10">
            <h2 className="text-white text-2xl font-semibold tracking-tight sm:text-3xl">
              Hablemos sobre tu prevención
            </h2>
            <p className="mt-3 text-white/80 leading-relaxed max-w-2xl">
              Si querés orientación y un primer paso claro, dejá tus datos y te contactamos para acompañarte.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
                <a href="#contacto">Solicitar contacto</a>
              </Button>
              <p className="text-xs sm:text-sm text-white/70">
                No es atención de urgencias. Te contactamos para orientarte.
              </p>
            </div>
          </div>
        </BlurFade>
      </Container>
    </section>
  );
}
