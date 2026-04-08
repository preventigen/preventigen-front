"use client";

import { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getWhatsAppHref, hasEmailJsConfig, publicContactConfig } from "@/src/lib/contact";

import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  reason: "Prevención" | "Genética" | "Biomarcadores" | "Otro";
  message: string;
  consent: boolean;
};

const initial: FormState = {
  fullName: "",
  email: "",
  phone: "",
  reason: "Prevención",
  message: "",
  consent: false,
};

function Helper({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-muted-foreground">{children}</p>;
}

export function ContactSection() {
  const [data, setData] = useState<FormState>(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState(
    "No pudimos enviar tu solicitud. Por favor, intentá nuevamente."
  );

  const emailJsReady = hasEmailJsConfig();
  const whatsappHref = getWhatsAppHref("Hola, quiero recibir información sobre PreventiGen.");
  const whatsappLabel = publicContactConfig.whatsappNumberRaw;

  const canSubmit = useMemo(() => {
    return (
      data.fullName.trim().length >= 3 &&
      data.email.includes("@") &&
      data.phone.trim().length >= 6 &&
      data.consent
    );
  }, [data]);

  const missing = useMemo(() => {
    const items: string[] = [];

    if (data.fullName.trim().length < 3) items.push("nombre");
    if (!data.email.includes("@")) items.push("email");
    if (data.phone.trim().length < 6) items.push("teléfono");
    if (!data.consent) items.push("consentimiento");

    return items;
  }, [data]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    if (!emailJsReady) {
      setStatus("error");
      setErrorMessage(
        "En este momento no pudimos procesar tu solicitud. Por favor, intentá nuevamente más tarde."
      );
      return;
    }

    setStatus("loading");
    setErrorMessage("No pudimos enviar tu solicitud. Por favor, intentá nuevamente.");

    const trimmedMessage = data.message.trim();
    const trimmedPhone = data.phone.trim();
    const trimmedName = data.fullName.trim();
    const trimmedEmail = data.email.trim();

    try {
      await emailjs.send(
        publicContactConfig.emailJs.serviceId,
        publicContactConfig.emailJs.templateId,
        {
          full_name: trimmedName,
          from_name: trimmedName,
          email: trimmedEmail,
          reply_to: trimmedEmail,
          phone: trimmedPhone,
          contact_phone: trimmedPhone,
          reason: data.reason,
          message: trimmedMessage || "No dejó mensaje adicional.",
          consent: data.consent ? "Sí" : "No",
          submitted_at: new Date().toLocaleString("es-AR", {
            dateStyle: "full",
            timeStyle: "short",
          }),
          source: "Landing PreventiGen",
        },
        {
          publicKey: publicContactConfig.emailJs.publicKey,
        }
      );

      setStatus("success");
      setData(initial);
    } catch (error) {
      console.error("Error enviando email:", error);
      setStatus("error");
      setErrorMessage(
        "No pudimos enviar tu solicitud en este momento. Por favor, intentá nuevamente en unos minutos."
      );
    }
  }

  return (
    <section id="contacto" className="scroll-mt-24 bg-surface-muted/40 py-16 sm:py-20">
      <Container>
        <SectionHeader
          title="Solicitar contacto"
          subtitle="Dejanos tus datos y te contactamos para orientarte con un primer paso claro."
        />

        <div className="mt-6 flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-surface/60">
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            Respuesta en 24–48 hs hábiles
          </Badge>
          <Badge variant="outline" className="bg-surface/60">
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
            Privacidad desde el diseño
          </Badge>
          <Badge variant="outline" className="bg-surface/60">
            <Stethoscope className="mr-1.5 h-3.5 w-3.5" />
            Enfoque de apoyo clínico
          </Badge>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <BlurFade inView delay={0.05} className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8"
            >
              <div className="pointer-events-none absolute -top-20 left-1/2 h-44 w-[560px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

              <div className="relative">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-foreground">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-heading font-semibold">Tu consulta, bien orientada</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Completá lo básico y, si querés, agregá detalles. Nosotros ordenamos el resto.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-6">
                  <div>
                    <p className="text-sm font-semibold text-heading">Datos de contacto</p>
                    <div className="mt-4 grid gap-4">
                      <div>
                        <Label htmlFor="fullName" className="text-heading">
                          Nombre y apellido <span className="text-muted-foreground">*</span>
                        </Label>
                        <div className="mt-2 flex items-center gap-2">
                          <Input
                            id="fullName"
                            placeholder="Ej: Juan Pérez"
                            value={data.fullName}
                            onChange={(e) =>
                              setData((current) => ({ ...current, fullName: e.target.value }))
                            }
                            required
                          />
                        </div>
                        <Helper>Solo para dirigirnos a vos correctamente.</Helper>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="email" className="text-heading">
                            Email <span className="text-muted-foreground">*</span>
                          </Label>
                          <div className="mt-2 flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="Ej: nombre@correo.com"
                              value={data.email}
                              onChange={(e) =>
                                setData((current) => ({ ...current, email: e.target.value }))
                              }
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="phone" className="text-heading">
                            Teléfono <span className="text-muted-foreground">*</span>
                          </Label>
                          <div className="mt-2 flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              placeholder="Ej: +54 9 11 1234 5678"
                              value={data.phone}
                              onChange={(e) =>
                                setData((current) => ({ ...current, phone: e.target.value }))
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-border/70" />

                  <div>
                    <p className="text-sm font-semibold text-heading">Tu consulta</p>

                    <div className="mt-4 grid gap-4">
                      <div>
                        <Label className="text-heading">Motivo de consulta</Label>
                        <Select
                          value={data.reason}
                          onValueChange={(value) =>
                            setData((current) => ({
                              ...current,
                              reason: value as FormState["reason"],
                            }))
                          }
                        >
                          <SelectTrigger className="mt-2 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Prevención">Prevención</SelectItem>
                            <SelectItem value="Genética">Genética</SelectItem>
                            <SelectItem value="Biomarcadores">Biomarcadores</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <Helper>Esto nos ayuda a derivar tu consulta al enfoque correcto.</Helper>
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-heading">
                          Mensaje (opcional)
                        </Label>
                        <Textarea
                          id="message"
                          className="mt-2 min-h-[120px]"
                          placeholder="Ej: Quiero entender qué estudios conviene sumar o qué objetivo me conviene priorizar."
                          value={data.message}
                          onChange={(e) =>
                            setData((current) => ({ ...current, message: e.target.value }))
                          }
                        />
                        <Helper>Con 2 o 3 líneas alcanza.</Helper>
                      </div>

                      <div className="rounded-2xl border border-border bg-surface-muted p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="consent"
                            checked={data.consent}
                            onCheckedChange={(checked) =>
                              setData((current) => ({ ...current, consent: Boolean(checked) }))
                            }
                          />
                          <div className="mt-0.5">
                            <Label htmlFor="consent" className="font-medium text-foreground">
                              Acepto que me contacten por WhatsApp o llamada.{" "}
                              <span className="text-muted-foreground">*</span>
                            </Label>
                            <Helper>
                              Tus datos se usan únicamente para responder tu solicitud.
                            </Helper>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Button
                          type="submit"
                          disabled={!canSubmit || status === "loading" || !emailJsReady}
                          size="lg"
                        >
                          {status === "loading" ? "Enviando..." : "Enviar solicitud"}
                        </Button>

                        {!canSubmit && status === "idle" ? (
                          <p className="text-xs text-muted-foreground">
                            Para enviar, completá:{" "}
                            <span className="text-foreground">{missing.join(", ")}</span>.
                          </p>
                        ) : null}

                        {whatsappHref ? (
                          <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
                          >
                            <MessageCircle className="h-4 w-4" />
                            ¿Preferís escribirnos por WhatsApp?
                          </a>
                        ) : null}

                        {status === "success" ? (
                          <Alert className="border-success/30 bg-success/10">
                            <AlertTitle className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Solicitud enviada
                            </AlertTitle>
                            <AlertDescription>
                              ¡Listo! Te contactaremos para orientarte y definir próximos pasos.
                            </AlertDescription>
                          </Alert>
                        ) : null}

                        {status === "error" ? (
                          <Alert variant="destructive">
                            <AlertTitle>No pudimos enviarlo</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
                          </Alert>
                        ) : null}

                        <p className="text-xs text-muted-foreground">
                          PreventiGen no atiende urgencias. Ante una emergencia, acudí a un servicio
                          médico.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </BlurFade>

          <BlurFade inView delay={0.12} className="lg:col-span-5">
            <div className="grid gap-4 lg:sticky lg:top-28">
              <div className="rounded-3xl border border-border bg-surface p-6">
                <p className="text-heading font-semibold">Qué pasa después</p>
                <ol className="mt-4 space-y-3 text-sm text-foreground">
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-xs text-accent">
                      1
                    </span>
                    <span>Revisamos tu motivo y el contexto.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-xs text-accent">
                      2
                    </span>
                    <span>Te orientamos sobre información útil para empezar.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-xs text-accent">
                      3
                    </span>
                    <span>Definimos próximos pasos con criterio clínico.</span>
                  </li>
                </ol>

                <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-5">
                  <p className="text-heading font-medium">
                    La información de este sitio no sustituye una consulta médica.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    PreventiGen acompaña y organiza información para una mejor orientación.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-surface p-6">
                <p className="text-heading font-semibold">Canales</p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="rounded-2xl border border-border bg-surface-muted p-4">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </p>

                    {whatsappHref && whatsappLabel ? (
                      <>
                        <p className="mt-1 font-medium text-heading">{whatsappLabel}</p>
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-primary hover:text-primary/80"
                        >
                          Abrir chat
                        </a>
                      </>
                    ) : (
                      <p className="mt-1 text-muted-foreground">
                        También podés dejarnos tu consulta desde el formulario y te contactaremos a
                        la brevedad.
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-border bg-surface-muted p-4">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" /> Formulario de contacto
                    </p>
                    <p className="mt-1 font-medium text-heading">Respuesta personalizada</p>
                    <p className="mt-1 text-muted-foreground">
                      Dejanos tus datos y tu motivo de consulta para orientarte con el próximo paso
                      más adecuado.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-surface-muted p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-heading font-medium">Privacidad</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tus datos se usan únicamente para responder tu solicitud y orientarte.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </Container>
    </section>
  );
}