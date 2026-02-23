"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/src/components/magic/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { formatDateTime } from "@/src/lib/formatters";
import type { AnalisisIA } from "@/src/lib/api/types";

interface AnalisisIaResultProps {
  analisis: AnalisisIA;
}

export function AnalisisIaResult({ analisis }: AnalisisIaResultProps) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(analisis.respuesta);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle>Resultado del analisis</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDateTime(analisis.createdAt)} · {analisis.tipoPrompt ?? "sistema"}
          </p>
        </div>

        <Button type="button" size="sm" variant="outline" onClick={onCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copiado" : "Copiar"}
        </Button>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm text-heading">{analisis.respuesta}</p>
      </CardContent>
    </Card>
  );
}
