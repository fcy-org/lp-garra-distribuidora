import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IMaskInput } from "react-imask";
import {
  ArrowLeft,
  ArrowRight,
  Store,
  ShoppingCart,
  Croissant,
  Coffee,
  ChefHat,
  Check,
  Trophy,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { captureLead, getTrackingParams, trackMetaLead } from "@/lib/tracking";
import { Confetti } from "./Confetti";

type Business = "Supermercado" | "Mercadinho" | "Conveniência" | "Padaria" | "Distribuidora / Revenda" | "Outro";
type Range = "Até R$ 3.000" | "R$ 3.000 a R$ 10.000" | "R$ 10.000 a R$ 30.000" | "Acima de R$ 30.000";

interface FormData {
  business: Business | "";
  categories: string[];
  range: Range | "";
  city: string;
  name: string;
  email: string;
  whatsapp: string;
  cnpj: string;
  customBusiness: string;
}

const STORAGE_KEY = "garra_escalacao_v1";

const empty: FormData = {
  business: "",
  categories: [],
  range: "",
  city: "",
  name: "",
  email: "",
  whatsapp: "",
  cnpj: "",
  customBusiness: "",
};

const businessOptions: { value: Business; icon: typeof Store }[] = [
  { value: "Supermercado", icon: ShoppingCart },
  { value: "Mercadinho", icon: Store },
  { value: "Conveniência", icon: Coffee },
  { value: "Padaria", icon: Croissant },
  { value: "Distribuidora / Revenda", icon: ChefHat },
  { value: "Outro", icon: Store },
];

const categoryOptions = [
  "Balas e chicletes", "Pirulitos e mastigáveis", "Jujubas e gomas",
  "Chocolates e snacks doces", "Produtos infantis", "Ainda não vendo muitas guloseimas",
];

const rangeOptions: Range[] = [
  "Até R$ 3.000",
  "R$ 3.000 a R$ 10.000",
  "R$ 10.000 a R$ 30.000",
  "Acima de R$ 30.000",
];

const piauiCities = [
  "Acauã", "Agricolândia", "Água Branca", "Alagoinha do Piauí", "Alegrete do Piauí",
  "Alto Longá", "Altos", "Alvorada do Gurguéia", "Amarante", "Angical do Piauí",
  "Anísio de Abreu", "Antônio Almeida", "Aroazes", "Aroeiras do Itaim", "Arraial",
  "Assunção do Piauí", "Avelino Lopes", "Baixa Grande do Ribeiro", "Barra D'Alcântara",
  "Barras", "Barreiras do Piauí", "Barro Duro", "Batalha", "Bela Vista do Piauí",
  "Belém do Piauí", "Beneditinos", "Bertolínia", "Betânia do Piauí", "Boa Hora",
  "Bocaina", "Bom Jesus", "Bom Princípio do Piauí", "Bonfim do Piauí", "Boqueirão do Piauí",
  "Brasileira", "Brejo do Piauí", "Buriti dos Lopes", "Buriti dos Montes", "Cabeceiras do Piauí",
  "Cajazeiras do Piauí", "Cajueiro da Praia", "Caldeirão Grande do Piauí", "Campinas do Piauí",
  "Campo Alegre do Fidalgo", "Campo Grande do Piauí", "Campo Largo do Piauí", "Campo Maior",
  "Canavieira", "Canto do Buriti", "Capitão de Campos", "Capitão Gervásio Oliveira",
  "Caracol", "Caraúbas do Piauí", "Caridade do Piauí", "Castelo do Piauí", "Caxingó",
  "Cocal", "Cocal de Telha", "Cocal dos Alves", "Coivaras", "Colônia do Gurguéia",
  "Colônia do Piauí", "Conceição do Canindé", "Coronel José Dias", "Corrente",
  "Cristalândia do Piauí", "Cristino Castro", "Curimatá", "Currais", "Curralinhos",
  "Curral Novo do Piauí", "Demerval Lobão", "Dirceu Arcoverde", "Dom Expedito Lopes",
  "Dom Inocêncio", "Domingos Mourão", "Elesbão Veloso", "Eliseu Martins", "Esperantina",
  "Fartura do Piauí", "Flores do Piauí", "Floresta do Piauí", "Floriano", "Francinópolis",
  "Francisco Ayres", "Francisco Macedo", "Francisco Santos", "Fronteiras", "Geminiano",
  "Gilbués", "Guadalupe", "Guaribas", "Hugo Napoleão", "Ilha Grande", "Inhuma",
  "Ipiranga do Piauí", "Isaías Coelho", "Itainópolis", "Itaueira", "Jacobina do Piauí",
  "Jaicós", "Jardim do Mulato", "Jatobá do Piauí", "Jerumenha", "João Costa",
  "Joaquim Pires", "Joca Marques", "José de Freitas", "Juazeiro do Piauí", "Júlio Borges",
  "Jurema", "Lagoa Alegre", "Lagoa de São Francisco", "Lagoa do Barro do Piauí",
  "Lagoa do Piauí", "Lagoa do Sítio", "Lagoinha do Piauí", "Landri Sales", "Luís Correia",
  "Luzilândia", "Madeiro", "Manoel Emídio", "Marcolândia", "Marcos Parente", "Massapê do Piauí",
  "Matias Olímpio", "Miguel Alves", "Miguel Leão", "Milton Brandão", "Monsenhor Gil",
  "Monsenhor Hipólito", "Monte Alegre do Piauí", "Morro Cabeça no Tempo", "Morro do Chapéu do Piauí",
  "Murici dos Portelas", "Nazaré do Piauí", "Nazária", "Nossa Senhora de Nazaré",
  "Nossa Senhora dos Remédios", "Nova Santa Rita", "Novo Oriente do Piauí", "Novo Santo Antônio",
  "Oeiras", "Olho D'Água do Piauí", "Padre Marcos", "Paes Landim", "Pajeú do Piauí",
  "Palmeira do Piauí", "Palmeirais", "Paquetá", "Parnaguá", "Parnaíba", "Passagem Franca do Piauí",
  "Patos do Piauí", "Pau D'Arco do Piauí", "Paulistana", "Pavussu", "Pedro II",
  "Pedro Laurentino", "Picos", "Pimenteiras", "Pio IX", "Piracuruca", "Piripiri",
  "Porto", "Porto Alegre do Piauí", "Prata do Piauí", "Queimada Nova", "Redenção do Gurguéia",
  "Regeneração", "Riacho Frio", "Ribeira do Piauí", "Ribeiro Gonçalves", "Rio Grande do Piauí",
  "Santa Cruz do Piauí", "Santa Cruz dos Milagres", "Santa Filomena", "Santa Luz",
  "Santa Rosa do Piauí", "Santana do Piauí", "Santo Antônio de Lisboa", "Santo Antônio dos Milagres",
  "Santo Inácio do Piauí", "São Braz do Piauí", "São Félix do Piauí", "São Francisco de Assis do Piauí",
  "São Francisco do Piauí", "São Gonçalo do Gurguéia", "São Gonçalo do Piauí",
  "São João da Canabrava", "São João da Fronteira", "São João da Serra", "São João da Varjota",
  "São João do Arraial", "São João do Piauí", "São José do Divino", "São José do Peixe",
  "São José do Piauí", "São Julião", "São Lourenço do Piauí", "São Luis do Piauí",
  "São Miguel da Baixa Grande", "São Miguel do Fidalgo", "São Miguel do Tapuio",
  "São Pedro do Piauí", "São Raimundo Nonato", "Sebastião Barros", "Sebastião Leal",
  "Sigefredo Pacheco", "Simões", "Simplício Mendes", "Socorro do Piauí", "Sussuapara",
  "Tamboril do Piauí", "Tanque do Piauí", "Teresina", "União", "Uruçuí", "Valença do Piauí",
  "Várzea Branca", "Várzea Grande", "Vera Mendes", "Vila Nova do Piauí", "Wall Ferraz",
];

const processingMessages = [
  { icon: "⚽", text: "Analisando seu perfil..." },
  { icon: "🏆", text: "Montando seu mix campeão..." },
  { icon: "📈", text: "Identificando guloseimas de maior giro..." },
  { icon: "🦅", text: "Preparando sua recomendação..." },
];

const categoryEmoji: Record<string, string> = {
  "Balas e chicletes": "🍬",
  "Pirulitos e mastigáveis": "🍭",
  "Jujubas e gomas": "🟢",
  "Chocolates e snacks doces": "🍫",
  "Produtos infantis": "🛒",
  "Ainda não vendo muitas guloseimas": "✨",
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function normalizeCity(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isPiauiCity(value: string) {
  const city = normalizeCity(value);
  return piauiCities.some((c) => normalizeCity(c) === city);
}

function isValidCnpj(value: string) {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const calcDigit = (base: string, weights: number[]) => {
    const sum = base.split("").reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const firstDigit = calcDigit(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calcDigit(cnpj.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return firstDigit === Number(cnpj[12]) && secondDigit === Number(cnpj[13]);
}

function computePotential(d: FormData): "ALTO" | "MÉDIO" | "EM DESENVOLVIMENTO" {
  const score =
    (d.range === "Acima de R$ 30.000" ? 3 : d.range === "R$ 10.000 a R$ 30.000" ? 2 : d.range === "R$ 3.000 a R$ 10.000" ? 1 : 0) +
    (d.categories.length >= 4 ? 2 : d.categories.length >= 2 ? 1 : 0);
  if (score >= 4) return "ALTO";
  if (score >= 2) return "MÉDIO";
  return "EM DESENVOLVIMENTO";
}

function recommendedCategories(d: FormData): string[] {
  const base = new Set(d.categories);
  if (d.business === "Padaria") {
    base.add("Balas e chicletes");
    base.add("Chocolates e snacks doces");
    base.add("Produtos infantis");
  }
  if (d.business === "Supermercado" || d.business === "Mercadinho") {
    base.add("Balas e chicletes");
    base.add("Jujubas e gomas");
    base.add("Pirulitos e mastigáveis");
  }
  if (d.business === "Conveniência") {
    base.add("Balas e chicletes");
    base.add("Pirulitos e mastigáveis");
    base.add("Chocolates e snacks doces");
  }
  if (d.business === "Distribuidora / Revenda") {
    base.add("Balas e chicletes");
    base.add("Jujubas e gomas");
    base.add("Produtos infantis");
  }
  const categories = Array.from(base)
    .filter((category) => category !== "Ainda não vendo muitas guloseimas")
    .slice(0, 6);
  return categories.length > 0 ? categories : ["Balas e chicletes", "Produtos infantis", "Chocolates e snacks doces"];
}

function getBusinessLabel(d: FormData) {
  return d.business === "Outro" ? d.customBusiness : d.business;
}

function buildWhatsAppUrl(d: FormData) {
  const business = getBusinessLabel(d);
  const msg = `Olá, Garra Distribuidora.\n\nAcabei de concluir minha Escalação Campeã de Guloseimas para a Copa.\n\nNome: ${d.name}\nE-mail: ${d.email}\nWhatsApp: ${d.whatsapp}\nCNPJ: ${d.cnpj}\nTipo de estabelecimento: ${business}\nCidade: ${d.city} - PI\nFaixa de compra mensal: ${d.range}\nProdutos com mais saída: ${d.categories.join(", ")}\n\nGostaria de receber minha recomendação de mix.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function Qualification() {
  const [step, setStep] = useState(0); // 0..3 form, 4 processing, 5 result
  const [data, setData] = useState<FormData>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...empty, ...JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  useEffect(() => {
    if (step === 4) {
      const t = setTimeout(() => setStep(5), 3500);
      return () => clearTimeout(t);
    }
  }, [step]);

  const totalSteps = 4;
  const progress = step <= totalSteps ? (step / totalSteps) * 100 : 100;

  const validateStep = (s: number): boolean => {
    const e: typeof errors = {};
    if (s === 0 && !data.business) e.business = "Selecione uma opção";
    if (s === 0 && data.business === "Outro" && data.customBusiness.trim().length < 2) {
      e.customBusiness = "Informe o tipo de estabelecimento";
    }
    if (s === 1 && data.categories.length === 0) e.categories = "Escolha ao menos uma opção";
    if (s === 2 && !data.range) e.range = "Selecione uma faixa";
    if (s === 3) {
      if (data.name.trim().length < 2) e.name = "Informe seu nome";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) e.email = "Informe um e-mail válido";
      if (onlyDigits(data.whatsapp).length < 10) e.whatsapp = "Informe um WhatsApp válido";
      if (!isPiauiCity(data.city)) e.city = "Informe uma cidade do Piauí";
      if (!isValidCnpj(data.cnpj)) e.cnpj = "Informe um CNPJ válido";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitLead = async () => {
    const eventId = crypto.randomUUID();
    const trackingParams = getTrackingParams(eventId);

    trackMetaLead(eventId);

    await captureLead({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: onlyDigits(data.whatsapp),
      whatsapp: onlyDigits(data.whatsapp),
      cnpj: onlyDigits(data.cnpj),
      document: onlyDigits(data.cnpj),
      business: getBusinessLabel(data),
      business_type: getBusinessLabel(data),
      city: data.city.trim(),
      purchase_range: data.range,
      categories: data.categories,
      campaign: "Guloseimas Copa",
      interest_products: data.categories,
      potential: computePotential(data),
      source: "Escalação Campeã de Guloseimas",
      ...trackingParams,
      state: "PI",
    });
  };

  const next = async () => {
    if (!validateStep(step)) return;
    if (step === 3) {
      setIsSubmitting(true);
      try {
        await submitLead();
      } catch (error) {
        console.error("Erro ao capturar lead", error);
      } finally {
        setIsSubmitting(false);
        setStep(4);
      }
    } else {
      setStep(step + 1);
    }
  };

  const selectAndAdvance = (update: Partial<FormData>) => {
    setData((current) => ({ ...current, ...update }));
    setErrors({});
    setStep((currentStep) => Math.min(currentStep + 1, 3));
  };

  const back = () => setStep(Math.max(0, step - 1));

  return (
    <section id="escalacao" className="relative bg-gradient-stadium py-14 md:py-28">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        {step < 4 && (
          <div className="mb-8 text-center md:mb-10">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-green-deep/60 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-yellow sm:px-4 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span className="min-w-0 truncate">Ferramenta exclusiva</span>
            </div>
            <h2 className="mt-4 text-3xl font-black leading-tight text-foreground md:text-5xl">
              Monte sua <span className="text-shimmer">Escalação Campeã</span>
            </h2>
            <p className="mt-3 text-muted-foreground md:text-lg">
              Responda rapidamente para receber uma recomendação de mix para vender mais na Copa.
            </p>
            <p className="mt-2 text-xs font-semibold text-brand-gold">
              Atendimento para estabelecimentos no Piauí.
            </p>
          </div>
        )}

        <div className="relative overflow-hidden rounded-2xl border border-brand-gold/30 bg-card/80 p-4 shadow-elegant backdrop-blur sm:p-6 md:rounded-3xl md:p-10">
          {step < 4 && (
            <div className="mb-8">
              <div className="mb-2 flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Etapa {step + 1} de {totalSteps}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-brand-green-darker">
                <motion.div
                  className="h-full bg-gradient-gold"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <StepWrapper title="Qual o seu tipo de negócio?" error={errors.business}>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {businessOptions.map(({ value, icon: Icon }) => {
                      const active = data.business === value;
                      return (
                        <button
                          key={value}
                          onClick={() => {
                            if (value === "Outro") {
                              setData({ ...data, business: value });
                              setErrors({});
                              return;
                            }
                            selectAndAdvance({ business: value, customBusiness: "" });
                          }}
                          className={`group flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-center transition-all sm:p-5 ${
                            active
                              ? "border-brand-yellow bg-brand-yellow/10 shadow-gold"
                              : "border-border bg-input/40 hover:border-brand-gold/60"
                          }`}
                        >
                          <Icon className={`h-7 w-7 ${active ? "text-brand-yellow" : "text-muted-foreground group-hover:text-brand-gold"}`} />
                          <span className="text-sm font-semibold leading-tight text-foreground">{value}</span>
                        </button>
                      );
                    })}
                  </div>
                  {data.business === "Outro" && (
                    <div className="mt-5">
                      <input
                        type="text"
                        value={data.customBusiness}
                        onChange={(e) => setData({ ...data, customBusiness: e.target.value })}
                        placeholder="Digite o tipo de estabelecimento"
                        maxLength={80}
                        className="w-full rounded-xl border-2 border-border bg-input/40 px-4 py-3 text-base font-semibold text-foreground outline-none transition focus:border-brand-yellow sm:px-5 sm:py-4 sm:text-lg"
                      />
                      {errors.customBusiness && (
                        <p className="mt-3 text-sm font-semibold text-destructive">{errors.customBusiness}</p>
                      )}
                    </div>
                  )}
                </StepWrapper>
              )}

              {step === 1 && (
                <StepWrapper title="Quais produtos costumam ter mais saída no seu ponto?" error={errors.categories}>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                    {categoryOptions.map((c) => {
                      const active = data.categories.includes(c);
                      return (
                        <button
                          key={c}
                          onClick={() => selectAndAdvance({ categories: [c] })}
                          className={`relative min-h-14 rounded-xl border-2 p-4 text-sm font-semibold leading-tight transition-all ${
                            active
                              ? "border-brand-yellow bg-brand-yellow/10 text-brand-yellow shadow-gold"
                              : "border-border bg-input/40 text-foreground hover:border-brand-gold/60"
                          }`}
                        >
                          {active && (
                            <Check className="absolute right-2 top-2 h-4 w-4 text-brand-yellow" />
                          )}
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </StepWrapper>
              )}

              {step === 2 && (
                <StepWrapper title="Qual faixa de compra mensal faz sentido para o seu negócio?" error={errors.range}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {rangeOptions.map((r) => {
                      const active = data.range === r;
                      return (
                        <button
                          key={r}
                          onClick={() => selectAndAdvance({ range: r })}
                          className={`min-h-16 rounded-xl border-2 p-4 text-left text-sm font-bold leading-tight transition-all sm:p-5 sm:text-base ${
                            active
                              ? "border-brand-yellow bg-brand-yellow/10 text-brand-yellow shadow-gold"
                              : "border-border bg-input/40 text-foreground hover:border-brand-gold/60"
                          }`}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>
                </StepWrapper>
              )}

              {step === 3 && (
                <StepWrapper
                  title="Preencha seus dados para receber uma recomendação de mix"
                  subtitle="Atendemos estabelecimentos no Piauí. A cidade informada precisa ser do estado."
                >
                  <div className="grid gap-4">
                    <FieldError error={errors.name}>
                      <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        placeholder="Nome"
                        maxLength={80}
                        className="w-full rounded-xl border-2 border-border bg-input/40 px-4 py-3 text-base font-semibold text-foreground outline-none transition focus:border-brand-yellow sm:px-5 sm:py-4 sm:text-lg"
                      />
                    </FieldError>

                    <FieldError error={errors.email}>
                      <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        placeholder="E-mail"
                        maxLength={120}
                        autoComplete="email"
                        className="w-full rounded-xl border-2 border-border bg-input/40 px-4 py-3 text-base font-semibold text-foreground outline-none transition focus:border-brand-yellow sm:px-5 sm:py-4 sm:text-lg"
                      />
                    </FieldError>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FieldError error={errors.whatsapp}>
                        <IMaskInput
                          mask="(00) 00000-0000"
                          value={data.whatsapp}
                          onAccept={(v: string) => setData({ ...data, whatsapp: v })}
                          placeholder="WhatsApp"
                          className="w-full rounded-xl border-2 border-border bg-input/40 px-4 py-3 text-base font-semibold text-foreground outline-none transition focus:border-brand-yellow sm:px-5 sm:py-4 sm:text-lg"
                        />
                      </FieldError>

                      <FieldError error={errors.cnpj}>
                        <IMaskInput
                          mask="00.000.000/0000-00"
                          value={data.cnpj}
                          onAccept={(v: string) => setData({ ...data, cnpj: v })}
                          placeholder="CNPJ"
                          className="w-full rounded-xl border-2 border-border bg-input/40 px-4 py-3 text-base font-semibold text-foreground outline-none transition focus:border-brand-yellow sm:px-5 sm:py-4 sm:text-lg"
                        />
                      </FieldError>
                    </div>

                    <FieldError error={errors.city}>
                      <input
                        type="text"
                        list="piaui-cities"
                        value={data.city}
                        onChange={(e) => setData({ ...data, city: e.target.value })}
                        placeholder="Cidade no Piauí"
                        maxLength={80}
                        className="w-full rounded-xl border-2 border-border bg-input/40 px-4 py-3 text-base font-semibold text-foreground outline-none transition focus:border-brand-yellow sm:px-5 sm:py-4 sm:text-lg"
                      />
                      <datalist id="piaui-cities">
                        {piauiCities.map((city) => (
                          <option key={city} value={city} />
                        ))}
                      </datalist>
                    </FieldError>
                  </div>
                </StepWrapper>
              )}

              {step === 4 && <Processing />}

              {step === 5 && <Result data={data} onRestart={() => { setStep(0); setData(empty); }} />}
            </motion.div>
          </AnimatePresence>

          {step < 4 && (
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={back}
                disabled={step === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-muted-foreground transition hover:text-foreground disabled:opacity-40 sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
              <button
                onClick={next}
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-4 text-center text-sm font-black uppercase tracking-wider text-primary-foreground shadow-gold transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-75 sm:w-auto sm:px-7"
              >
                <span>{isSubmitting ? "Enviando..." : step === 3 ? "Receber recomendação" : "Continuar"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StepWrapper({
  title,
  subtitle,
  error,
  children,
}: {
  title: string;
  subtitle?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xl font-bold leading-tight text-foreground md:text-2xl">{title}</h3>
      {subtitle && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>}
      <div className="mt-6">{children}</div>
      {error && <p className="mt-3 text-sm font-semibold text-destructive">{error}</p>}
    </div>
  );
}

function FieldError({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      {children}
      {error && <span className="mt-2 block text-sm font-semibold text-destructive">{error}</span>}
    </label>
  );
}

function Processing() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % processingMessages.length), 800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Confetti count={30} />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-brand-yellow/30 border-t-brand-yellow"
      >
        <Trophy className="h-10 w-10 text-brand-yellow" />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-8 text-center text-lg font-bold leading-tight text-foreground md:text-2xl"
        >
          <span className="mr-2">{processingMessages[index].icon}</span>
          {processingMessages[index].text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function Result({ data, onRestart }: { data: FormData; onRestart: () => void }) {
  const potential = computePotential(data);
  const cats = recommendedCategories(data);
  const potentialColor =
    potential === "ALTO"
      ? "text-brand-yellow"
      : potential === "MÉDIO"
      ? "text-brand-gold"
      : "text-muted-foreground";

  return (
    <div className="relative text-center">
      <Confetti count={40} />
      <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-brand-gold bg-brand-green-deep/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-yellow sm:px-4 sm:text-xs">
        <Trophy className="h-3.5 w-3.5 shrink-0" />
        <span className="min-w-0 truncate">Resultado pronto</span>
      </div>
      <h3 className="mt-4 text-3xl font-black leading-tight text-foreground md:text-4xl">
        Seu Mix Campeão Está <span className="text-shimmer">Pronto</span>
      </h3>

      <div className="mt-8 rounded-2xl border border-brand-gold/40 bg-brand-green-darker/60 p-4 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Potencial identificado
        </p>
        <p className={`mt-2 text-3xl font-black leading-tight sm:text-4xl md:text-5xl ${potentialColor}`}>{potential}</p>
      </div>

      <div className="mt-8 text-left">
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Mix recomendado
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {cats.map((c) => (
            <span
              key={c}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-green-deep/60 px-3 py-2 text-sm font-semibold leading-tight text-foreground sm:px-4"
            >
              <span className="shrink-0">{categoryEmoji[c] ?? "⭐"}</span>
              <span className="min-w-0 break-words">{c}</span>
            </span>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground md:text-base">
        Com base nas suas respostas, identificamos quais categorias podem ajudar seu estabelecimento
        a vender mais durante a Copa.
      </p>

      <a
        href={buildWhatsAppUrl(data)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-gold px-5 py-4 text-center text-sm font-black uppercase tracking-wider text-primary-foreground shadow-gold transition hover:scale-[1.02] sm:px-8 sm:py-5 md:text-lg"
      >
        <MessageCircle className="h-5 w-5 shrink-0" />
        <span>Receber recomendação no WhatsApp</span>
      </a>
      <button onClick={onRestart} className="mt-4 text-xs font-semibold text-muted-foreground hover:text-foreground">
        Refazer quiz
      </button>
    </div>
  );
}
