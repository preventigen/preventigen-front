import { Container } from "../ui/Container";
import { Badge } from "../ui/Badge";
import { PrimaryButton } from "../ui/PrimaryButton";

type Props = {
  backgroundImageSrc?: string; // vos lo completás
  backgroundVideoSrc?: string; // opcional
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
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-heading/10 via-heading/40 to-heading/80" />
      </div>

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          <h1 className="text-white text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Medicina preventiva con datos, criterio médico e IA.
          </h1>

          <p className="mt-5 text-white/85 text-base leading-relaxed sm:text-lg">
            PreventiGen integra información clínica y tecnología avanzada para ayudarte a anticiparte,
            comprender mejor tu salud y tomar decisiones informadas junto a un profesional.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#contacto">
              <PrimaryButton className="w-full sm:w-auto">Solicitar contacto</PrimaryButton>
            </a>
            <p className="text-xs sm:text-sm text-white/70">
              No es atención de urgencias. Te contactamos para orientarte.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            <Badge variant="accent" className="border-white/15 text-white bg-white/10">
              Prevención personalizada
            </Badge>
            <Badge variant="accent" className="border-white/15 text-white bg-white/10">
              Confidencialidad
            </Badge>
            <Badge variant="accent" className="border-white/15 text-white bg-white/10">
              Acompañamiento médico
            </Badge>
          </div>
        </div>
      </Container>
    </section>
  );
}
