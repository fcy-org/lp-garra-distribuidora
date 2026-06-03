import { motion } from "framer-motion";
import { Trophy, ArrowRight, TrendingUp, Truck, PackageOpen, Headset } from "lucide-react";
import heroImage from "@/assets/hero-eagle-shopping.webp";
import { Confetti } from "./Confetti";

const benefits = [
  { icon: TrendingUp, text: "Categorias com maior potencial de giro" },
  { icon: Truck, text: "Frete grátis" },
  { icon: PackageOpen, text: "Oportunidades para ampliar o mix de produtos" },
  { icon: Headset, text: "Atendimento especializado da Garra Distribuidora" },
];

export function Hero({ onCta }: { onCta: () => void }) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-hero stadium-glow">
      <Confetti count={50} />
      <div className="container mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:gap-12 md:py-24 lg:grid-cols-2 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-brand-gold bg-brand-green-deep/80 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-brand-yellow backdrop-blur shadow-gold sm:px-4 sm:text-xs">
            <Trophy className="h-4 w-4" />
            <span className="min-w-0 truncate">Escalação Campeã da Copa</span>
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl text-3xl font-black leading-[1.08] text-foreground sm:text-4xl md:text-5xl lg:mx-0 lg:max-w-none lg:text-6xl">
            Prepare seu negócio para{" "}
            <span className="text-shimmer">vender mais durante a Copa</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:mt-6 md:text-xl lg:mx-0">
            Receba gratuitamente uma recomendação personalizada com categorias e oportunidades que podem
            aumentar suas vendas durante o maior evento esportivo do mundo.
          </p>

          <ul className="mx-auto mt-8 max-w-md space-y-3 text-left lg:mx-0 lg:max-w-none">
            {benefits.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-base text-foreground">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-brand-gold/40 bg-brand-green-deep/80 text-brand-yellow shadow-[0_0_18px_rgba(250,204,21,0.22)]">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="pt-1">{text}</span>
              </li>
            ))}
          </ul>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCta}
            className="group mx-auto mt-10 inline-flex w-full max-w-sm items-center justify-center gap-3 rounded-full bg-gradient-gold px-6 py-4 text-center text-sm font-black uppercase tracking-wider text-primary-foreground shadow-gold transition-all hover:shadow-elegant sm:w-auto sm:px-8 sm:py-5 md:text-lg lg:mx-0"
          >
            <span>Quero minha escalação</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </motion.button>

          <p className="mt-4 text-xs text-muted-foreground">
            Grátis · Sem compromisso · Resposta imediata no WhatsApp
          </p>
          <p className="mt-2 text-xs font-semibold text-brand-gold">
            Atendimento para estabelecimentos no Piauí.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative mx-auto min-h-[280px] w-full max-w-[520px] sm:min-h-[360px] lg:min-h-[560px] lg:max-w-none"
        >
          <div className="absolute inset-x-6 bottom-4 top-8 rounded-full bg-brand-yellow/25 blur-3xl sm:inset-x-8 sm:bottom-6 sm:top-10" aria-hidden />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/30 blur-2xl md:h-96 md:w-96" aria-hidden />
          <div className="absolute left-1/2 top-1/2 h-[72%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-yellow/25 bg-brand-yellow/15 shadow-[0_0_70px_rgba(250,204,21,0.38),0_0_130px_rgba(22,163,74,0.28)] blur-xl" aria-hidden />
          <div className="absolute inset-x-8 bottom-4 h-20 rounded-full bg-black/30 blur-2xl sm:inset-x-10 sm:bottom-6 sm:h-24" aria-hidden />
          <img
            src={heroImage}
            alt="Águia da Garra Distribuidora com carrinho de produtos no estádio da Copa"
            width={1280}
            height={1280}
            fetchPriority="high"
            decoding="async"
            className="relative mx-auto w-full max-w-[620px] drop-shadow-[0_0_28px_rgba(250,204,21,0.35)] drop-shadow-[0_30px_55px_rgba(0,0,0,0.45)]"
          />
        </motion.div>
      </div>
    </section>
  );
}
