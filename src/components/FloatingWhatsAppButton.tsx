"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";

import { getWhatsAppHref } from "@/src/lib/contact";

export function FloatingWhatsAppButton() {
  const href = getWhatsAppHref("Hola, quiero hablar con PreventiGen por WhatsApp.");
  const timeoutRef = useRef<number | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolling(true);
      setIsSettling(false);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
        setIsSettling(true);

        window.setTimeout(() => {
          setIsSettling(false);
        }, 420);
      }, 140);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Abrir WhatsApp"
      className="fixed bottom-5 right-5 z-40"
    >
      <span
        className={[
          "flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white",
          "shadow-[0_14px_35px_rgba(37,211,102,0.24)] ring-1 ring-white/50",
          "transition-[transform,box-shadow,background-color] duration-300 ease-out",
          "hover:bg-[#1fb85a] hover:shadow-[0_16px_38px_rgba(37,211,102,0.3)]",
          isScrolling ? "translate-y-[3px] scale-[0.97]" : "",
          isSettling ? "animate-[whatsapp-float-bounce_420ms_cubic-bezier(0.22,1,0.36,1)]" : "",
        ].join(" ")}
      >
        <MessageCircle className="h-5 w-5" />
      </span>
    </a>
  );
}
