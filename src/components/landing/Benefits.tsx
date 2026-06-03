import { useEffect, useRef, useState } from "react";
import { TrendingUp, ShoppingBag, DollarSign, Users } from "lucide-react";

const cards = [
  { icon: TrendingUp, title: "Mais movimento nas lojas", desc: "Picos de tráfego em dias de jogos elevam o ritmo de vendas em todos os canais." },
  { icon: ShoppingBag, title: "Maior procura por categorias específicas", desc: "Bebidas, snacks, padaria e confeitaria explodem em consumo durante a Copa." },
  { icon: DollarSign, title: "Oportunidade de aumentar o ticket médio", desc: "Combos e kits temáticos elevam o valor de cada carrinho vendido." },
  { icon: Users, title: "Mais chances de fidelizar clientes", desc: "Quem compra bem durante o evento volta mais vezes ao longo do ano." },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

export function Benefits() {
  const [titleRef, titleInView] = useInView();

  return (
    <section className="relative bg-brand-green-darker py-14 md:py-28">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          ref={titleRef}
          className={`mx-auto max-w-3xl text-center text-3xl font-black leading-tight text-foreground md:text-4xl lg:text-5xl ${titleInView ? "animate-view-in" : "opacity-0"}`}
        >
          Por que tantos lojistas <span className="text-brand-yellow">se preparam antes da Copa?</span>
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 md:gap-6 lg:grid-cols-4">
          {cards.map((c, i) => (
            <CardItem key={c.title} card={c} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CardItem({ card, delay }: { card: typeof cards[number]; delay: number }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={`group relative overflow-hidden rounded-2xl border border-brand-gold/30 bg-card p-5 shadow-elegant transition-all hover:border-brand-yellow hover:-translate-y-1.5 md:p-6 ${inView ? "animate-view-in" : "opacity-0"}`}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-yellow/10 blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold text-primary-foreground shadow-gold">
          <card.icon className="h-6 w-6" />
        </div>
        <h3 className="mt-5 text-lg font-bold leading-tight text-foreground">{card.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
      </div>
    </div>
  );
}
