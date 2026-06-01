import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { Hero } from "@/components/landing/Hero";
import { Benefits } from "@/components/landing/Benefits";
import { Qualification } from "@/components/landing/Qualification";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Escalação Campeã da Copa — Garra Distribuidora" },
      {
        name: "description",
        content:
          "Receba uma recomendação personalizada de categorias e oportunidades para vender mais durante a Copa com a Garra Distribuidora.",
      },
      { property: "og:title", content: "Escalação Campeã da Copa — Garra Distribuidora" },
      {
        property: "og:description",
        content:
          "Monte sua escalação campeã e abasteça seu negócio para o maior evento esportivo do mundo.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const scrollToForm = useCallback(() => {
    document.getElementById("escalacao")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Hero onCta={scrollToForm} />
      <Benefits />
      <Qualification />
      <footer className="border-t border-brand-gold/20 bg-brand-green-darker py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Garra Distribuidora · Escalação Campeã da Copa
      </footer>
    </main>
  );
}
