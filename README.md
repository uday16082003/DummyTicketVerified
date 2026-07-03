# VisaFly — Next.js Landing Page

A modern landing page for verified dummy flight tickets (visa applications), built with **Next.js 15**, **React 19**, and **TypeScript**.

## Setup (run once)

If you cloned this repo or need to install dependencies manually:

```bash
cd /home/administrator/Desktop/Dummy
npm install
```

### Fresh Next.js setup (alternative)

If starting from scratch in an empty folder:

```bash
cd /home/administrator/Desktop/Dummy
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Then copy the `src/` components from this project.

## Run locally

```bash
cd /home/administrator/Desktop/Dummy
npm run dev
```

Open **http://localhost:3000**

## Production build

```bash
npm run build
npm start
```

## Project structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout + fonts + metadata
│   ├── page.tsx        # Home page
│   └── globals.css     # Design system + hero styles
└── components/
    ├── Navbar.tsx      # Sticky nav + mobile menu
    └── Hero.tsx        # Hero section + ticket card
```

## Sections (built incrementally)

- [x] Navigation + Hero
- [ ] How It Works
- [ ] Pricing
- [ ] Sample Tickets
- [ ] Reviews
- [ ] FAQ
- [ ] Footer + CTA
