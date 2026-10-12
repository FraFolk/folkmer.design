// Work = case studies as Product Designer, in homepage order.
export const projects = [
  {
    slug: 'accessibility',
    tags: ['Accessibility', 'Crédit Agricole', 'Sky'],
    title: 'Accessibility that sticks',
    summary: 'From 300+ recurring defects to a process that prevents them. Then the proof: one client from 50% to 85% compliance, two touchpoints at 100%.',
    cover: 'sky',
  },
  {
    slug: 'aon',
    tags: ['End-to-end', 'Insurance', 'Ownership'],
    title: 'Aon: joined to execute, ended up owning the design',
    summary: 'I joined doing execution and became the only design reference, from functional analysis to dev handoff. Screens under NDA: ask me in person.',
    cover: 'aon',
  },
];

// Alé has its own section (co-founder), not a case among the others.
export const ale = {
    slug: 'ale',
    tags: ['Co-founder', 'Product Discovery', 'AI Workflow'],
    title: 'Alé: an app for climbers, by climbers',
    summary: 'I co-founded it and I lead the product design. From 50+ survey answers and 5 interviews to an MVP launching in December 2026.',
    href: '/ale/',
    image: '/img/card-ale.webp',
    alt: 'The Alé app on a phone, lying on granite next to climbing shoes, a rope and a chalk bag.',
  };

// Lab: what I build and explore with AI, outside the case studies. Carousel order.
// visual: 'agents' | 'pdf' | 'soon' are drawn in code; otherwise `image` is used.
export const lab = [
  {
    slug: 'agents',
    kind: 'Exploring',
    title: 'My AI agents team',
    summary: 'Three small agents do my weekly admin every Monday. They never send or publish anything without my OK.',
    href: '/lab/agents/',
    cta: 'Read more',
    image: '/img/lab-agents.webp',
    alt: 'News, the Monday paper an agent prepares for me: masthead, an October calendar and a half-solved sudoku, on dark green leaves. The articles are blurred.',
  },
  {
    slug: 'accessible-pdf',
    kind: 'Exploring',
    title: 'Accessible PDFs, with AI',
    summary: 'PDFs are everywhere and almost never accessible. Can AI make them readable for everyone, screen readers included?',
    href: '/lab/accessible-pdf/',
    cta: 'Read more',
    visual: 'pdf',
  },
  {
    slug: 'studio-pieri',
    kind: 'Website · Live',
    title: 'Studio Dentistico Pieri',
    summary: 'A website for a family dental practice in Genoa: clear, fast and easy to read for every patient.',
    href: 'https://www.studiodentisticopieri.com/',
    external: true,
    cta: 'Visit the site',
    image: '/img/lab-pieri.webp',
    alt: 'Studio Dentistico Pieri homepage: three dentists smiling, the title "Il dentista di famiglia a Genova, dal 1992" and a "Prenota una visita" button.',
  },
  {
    slug: 'clothing-shop',
    kind: 'Website · In progress',
    title: 'A clothing shop',
    summary: 'A showcase website for an independent clothing shop.',
    visual: 'soon',
    soon: 'Coming soon',
  },
];
