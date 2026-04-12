export interface BlueprintTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompt: string;
  tags: string[];
}

export const BLUEPRINT_TEMPLATES: BlueprintTemplate[] = [
  {
    id: "saas-starter",
    name: "SaaS Starter",
    description: "Next.js 15, Auth, Drizzle, Stripe, and Dashboard.",
    icon: "Layout",
    prompt: "Build a modern SaaS starter with Next.js 15, Supabase Auth, Drizzle ORM (PostgreSQL), and a Stripe integration for payments. Include a dark-mode dashboard with charts.",
    tags: ["Fullstack", "SaaS", "Payments"]
  },
  {
    id: "ai-chatbot",
    name: "AI Chatbot",
    description: "Multi-model chat interface with Groq and memory.",
    icon: "MessageSquare",
    prompt: "Create a production-ready AI chatbot using Next.js 15, Groq Llama-3, and a PostgreSQL message history. Implement a clean, chat-style UI with streaming responses.",
    tags: ["AI", "LLM", "Chat"]
  },
  {
    id: "portfolio-pro",
    name: "Portfolio Pro",
    description: "High-performance portfolio with Framer Motion.",
    icon: "User",
    prompt: "Generate a premium portfolio site for a software engineer. Include a bento-grid project gallery, smooth Framer Motion animations, and a contact form with server actions.",
    tags: ["Frontend", "Portfolio", "Design"]
  },
  {
    id: "ecom-lite",
    name: "E-comm Lite",
    description: "Simple store with cart and Stripe checkout.",
    icon: "ShoppingBag",
    prompt: "Build a lightweight e-commerce site with a product gallery, cart functionality, and Stripe checkout integration. Use Next.js 15 and Tailwind CSS.",
    tags: ["E-commerce", "Stripe", "Store"]
  }
];
