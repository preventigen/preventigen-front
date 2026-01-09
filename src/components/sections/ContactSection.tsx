"use client";

import { useMemo, useState } from "react";
import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { PrimaryButton } from "../ui/PrimaryButton";

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
          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-surface p-6">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-heading">Nombre y apellido</label>
                <input
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  placeholder="Ej: Juan Pérez"
                  value={data.fullName}
                  onChange={(e) => setData((s) => ({ ...s, fullName: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-heading">Email</label>
                <input
                  type="email"
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  placeholder="Ej: nombre@correo.com"
                  value={data.email}
                  onChange={(e) => setData((s) => ({ ...s, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-heading">Teléfono</label>
                <input
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  placeholder="Ej: +54 11 1234 5678"
                  value={data.phone}
                  onChange={(e) => setData((s) => ({ ...s, phone: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-heading">Motivo de consulta</label>
                <select
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  value={data.reason}
                  onChange={(e) =>
                    setData((s) => ({ ...s, reason: e.target.value as FormState["reason"] }))
                  }
                >
                  <option>Prevención</option>
                  <option>Genética</option>
                  <option>Biomarcadores</option>
                  <option>Otro</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-heading">Mensaje (opcional)</label>
                <textarea
                  className="mt-2 min-h-[120px] w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  placeholder="Contanos brevemente tu consulta"
                  value={data.message}
                  onChange={(e) => setData((s) => ({ ...s, message: e.target.value }))}
                />
              </div>

              <label className="flex items-start gap-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-border"
                  checked={data.consent}
                  onChange={(e) => setData((s) => ({ ...s, consent: e.target.checked }))}
                />
                Acepto que me contacten por WhatsApp o llamada.
              </label>

              <div className="flex items-center gap-3">
                <PrimaryButton type="submit" disabled={!canSubmit || status === "loading"}>
                  {status === "loading" ? "Enviando..." : "Enviar"}
                </PrimaryButton>

                {status === "success" ? (
                  <p className="text-sm text-success">
                    ¡Listo! Recibimos tu solicitud. Te contactaremos para orientarte.
                  </p>
                ) : null}

                {status === "error" ? (
                  <p className="text-sm text-danger">
                    No pudimos enviar tu solicitud. Por favor, intentá nuevamente.
                  </p>
                ) : null}
              </div>

              <p className="text-xs text-muted">
                PreventiGen no atiende urgencias. Ante una emergencia, acudí a un servicio médico.
              </p>
            </div>
          </form>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-heading font-semibold">Contacto</h3>
            <p className="mt-2 text-muted leading-relaxed">
              Completá el formulario y te contactamos para orientarte. Si querés, también podés dejar un
              mensaje por WhatsApp (opcional).
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-xl border border-border bg-surface-muted p-4">
                <p className="text-muted">Canal</p>
                <p className="mt-1 font-medium text-heading">WhatsApp (opcional)</p>
                <p className="mt-1 text-muted">Agregá tu link cuando lo tengas.</p>
              </div>
              <div className="rounded-xl border border-border bg-surface-muted p-4">
                <p className="text-muted">Email</p>
                <p className="mt-1 font-medium text-heading">contacto@preventigen.com</p>
                <p className="mt-1 text-muted">(placeholder, reemplazar)</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-5">
              <p className="text-heading font-medium">
                La información de este sitio no sustituye una consulta médica.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
