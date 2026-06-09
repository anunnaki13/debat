export const DEFAULT_OPENROUTER_MODEL = "openrouter/free";

export const CHEAP_OPENROUTER_MODELS = [
  {
    id: "openrouter/free",
    label: "Gratis: OpenRouter Free Router",
    note: "Gratis, cocok untuk coba-coba; bisa kena limit.",
  },
  {
    id: "inclusionai/ling-2.6-flash",
    label: "Murah: inclusionAI Ling 2.6 Flash",
    note: "Live pricing rendah di Models API OpenRouter.",
  },
  {
    id: "meta-llama/llama-3.1-8b-instruct",
    label: "Murah: Llama 3.1 8B Instruct",
    note: "Ringan untuk debat teks sederhana.",
  },
  {
    id: "mistralai/mistral-nemo",
    label: "Murah: Mistral Nemo",
    note: "Murah dan cukup nyaman untuk chat.",
  },
] as const;
