import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, DollarSign, Users } from "lucide-react";

const cards = [
  { icon: TrendingUp, title: "Mais movimento nas lojas", desc: "Picos de tráfego em dias de jogos elevam o ritmo de vendas em todos os canais." },
  { icon: ShoppingBag, title: "Maior procura por categorias específicas", desc: "Bebidas, snacks, padaria e confeitaria explodem em consumo durante a Copa." },
  { icon: DollarSign, title: "Oportunidade de aumentar o ticket médio", desc: "Combos e kits temáticos elevam o valor de cada carrinho vendido." },
  { icon: Users, title: "Mais chances de fidelizar clientes", desc: "Quem compra bem durante o evento volta mais vezes ao longo do ano." },
];

export function Benefits() {
  return (
    <section className="relative bg-brand-green-darker py-14 md:py-28">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center text-3xl font-black leading-tight text-foreground md:text-4xl lg:text-5xl"
        >
          Por que tantos lojistas <span className="text-brand-yellow">se preparam antes da Copa?</span>
        </motion.h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 md:gap-6 lg:grid-cols-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-brand-gold/30 bg-card p-5 shadow-elegant transition-all hover:border-brand-yellow md:p-6"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-yellow/10 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold text-primary-foreground shadow-gold">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold leading-tight text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
