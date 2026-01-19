"use client";

import { useMemo, useState } from "react";
import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BlurFade } from "@/components/ui/blur-fade";

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

export function ContactSection() {
  const [data, setData] = useState<FormState>(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const canSubmit = useMemo(() => {
    return (
      data.fullName.trim().length >= 3 &&
      data.email.includes("@") &&
      data.phone.trim().length >= 6 &&
      data.consent
    );
  }, [data]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("loading");
    try {
      // Si después armás API real, podés apuntar a /api/contact
      // Por ahora: simulamos envío.
      await new Promise((r) => setTimeout(r, 800));
      setStatus("success");
      setData(initial);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contacto" className="scroll-mt-24 py-16 sm:py-20 bg-surface-muted/40">
      <Container>
        <SectionHeader
          title="Solicitar contacto"
          subtitle="Dejanos tus datos y te contactamos para orientarte."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <BlurFade inView delay={0.05}>
            <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-surface p-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-heading">
                    Nombre y apellido
                  </Label>
                  <Input
                    id="fullName"
                    className="mt-2"
                    placeholder="Ej: Juan Pérez"
                    value={data.fullName}
                    onChange={(e) => setData((s) => ({ ...s, fullName: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-heading">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="mt-2"
                    placeholder="Ej: nombre@correo.com"
                    value={data.email}
                    onChange={(e) => setData((s) => ({ ...s, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-heading">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    className="mt-2"
                    placeholder="Ej: +54 11 1234 5678"
                    value={data.phone}
                    onChange={(e) => setData((s) => ({ ...s, phone: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label className="text-heading">Motivo de consulta</Label>
                  <Select
                    value={data.reason}
                    onValueChange={(value) =>
                      setData((s) => ({ ...s, reason: value as FormState["reason"] }))
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
                </div>

                <div>
                  <Label htmlFor="message" className="text-heading">
                    Mensaje (opcional)
                  </Label>
                  <Textarea
                    id="message"
                    className="mt-2 min-h-[120px]"
                    placeholder="Contanos brevemente tu consulta"
                    value={data.message}
                    onChange={(e) => setData((s) => ({ ...s, message: e.target.value }))}
                  />
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={data.consent}
                    onCheckedChange={(checked) =>
                      setData((s) => ({ ...s, consent: Boolean(checked) }))
                    }
                  />
                  <Label htmlFor="consent" className="text-foreground">
                    Acepto que me contacten por WhatsApp o llamada.
                  </Label>
                </div>

                <div className="flex flex-col gap-3">
                  <Button type="submit" disabled={!canSubmit || status === "loading"}>
                    {status === "loading" ? "Enviando..." : "Enviar"}
                  </Button>

                  {status === "success" ? (
                    <Alert className="border-success/30 bg-success/10 text-success">
                      <AlertTitle>OK</AlertTitle>
                      <AlertDescription>
                        ¡Listo! Recibimos tu solicitud. Te contactaremos para orientarte.
                      </AlertDescription>
                    </Alert>
                  ) : null}

                  {status === "error" ? (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        No pudimos enviar tu solicitud. Por favor, intentá nuevamente.
                      </AlertDescription>
                    </Alert>
                  ) : null}
                </div>

                <p className="text-xs text-muted-foreground">
                  PreventiGen no atiende urgencias. Ante una emergencia, acudí a un servicio médico.
                </p>
              </div>
            </form>
          </BlurFade>

          <BlurFade inView delay={0.12}>
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-heading font-semibold">Contacto</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Completá el formulario y te contactamos para orientarte. Si querés, también podés dejar un
                mensaje por WhatsApp (opcional).
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="rounded-xl border border-border bg-surface-muted p-4">
                  <p className="text-muted-foreground">Canal</p>
                  <p className="mt-1 font-medium text-heading">WhatsApp (opcional)</p>
                  <p className="mt-1 text-muted-foreground">Agregá tu link cuando lo tengas.</p>
                </div>
                <div className="rounded-xl border border-border bg-surface-muted p-4">
                  <p className="text-muted-foreground">Email</p>
                  <p className="mt-1 font-medium text-heading">contacto@preventigen.com</p>
                  <p className="mt-1 text-muted-foreground">(placeholder, reemplazar)</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-5">
                <p className="text-heading font-medium">
                  La información de este sitio no sustituye una consulta médica.
                </p>
              </div>
            </div>
          </BlurFade>
        </div>
      </Container>
    </section>
  );
}
