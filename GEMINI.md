# Myanmar Precision Systems — Project Context

## Project Overview
This is the official website for **Myanmar Precision Systems (MPS)**, a specialist instrument service center based in Yangon, Myanmar. The site is deployed at `precisionmyanmar-sigma.vercel.app`.

## Tech Stack
- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **Animation:** Framer Motion (`motion/react`)
- **Icons:** Lucide React
- **Email:** EmailJS (`@emailjs/browser`)
- **Deployment:** Vercel (auto-deploy from GitHub `Ksky1995/test2`)

## Project Structure
```
test2/
├── src/
│   ├── App.tsx          # Main file — ALL components live here
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── components/
│   └── ui/              # shadcn/ui components (DO NOT EDIT)
├── public/              # Static images and assets
├── index.html
├── vite.config.ts
└── package.json
```

## Important: Everything is in App.tsx
All page sections are components inside `src/App.tsx`:
- `Navbar` — Top navigation bar
- `Hero` — Landing section with background image
- `TechnicalMatrix` — Services/calibration section (id="services")
- `EquipmentBento` — Equipment showcase (id="equipment")
- `TechnicalSolutions` — Embedded systems section (id="solutions")
- `ContactMinimal` — Contact form with EmailJS (id="contact")
- `CompactFooter` — Footer

## Navigation System
The site uses a **tab-based** navigation system (not React Router). The active tab is managed by `activeTab` state in the main `App` component. Tabs: `home`, `services`, `solutions`, `contact`.

## Design Language
- **Dark theme** — Deep navy/black backgrounds
- **Accent colors** — Each tab has its own color theme (blue, green, amber, purple)
- **PCB/Circuit aesthetic** — Technical labels like `BOARD_ID:`, `PCB_LABEL`, circuit animations
- **Typography** — All caps, mono fonts, tight tracking
- **Motion** — Framer Motion animations on all sections

## Business Information
- **Company:** Myanmar Precision Systems
- **Location:** North Dagon Township, Yangon, Myanmar
- **Phone:** +959 428 014 092, +959 758 653 198
- **WhatsApp:** https://wa.me/959428014092
- **Services:** Survey instrument calibration, soil testing, concrete testing, GPS/GNSS, embedded systems/MCU recovery
- **Brands serviced:** Leica, Topcon, Sokkia, Trimble, Nikon

## EmailJS Configuration
- **Service ID:** myanmarprecisionsystems
- **Template ID:** template_qb60bf6
- **Public Key:** nAjrX8oMq7nJNLyE6
- **Form fields (name attributes):** from_name, company, phone, from_email, equipment_type, service_type, equipment, message, contact_pref

## Coding Rules
1. **Do NOT install new packages** without asking first
2. **Do NOT edit** anything inside `components/ui/` — these are shadcn components
3. **Keep all new components inside App.tsx** unless told otherwise
4. **Always use Tailwind classes** for styling — no inline styles unless necessary
5. **Mobile-first** — all components accept `isMobile` prop for responsive behavior
6. **After any change**, remind to run: `git add . && git commit -m "..." && git push origin main`

## Common Tasks & How to Do Them
- **Add a new section:** Create a new component in App.tsx, add it to `renderContent()` switch
- **Change colors:** Edit `TAB_THEMES` object at the top of App.tsx
- **Add images:** Place image in `public/` folder, reference as `src="filename.jpg"`
- **Update business info:** Search for the text in App.tsx and replace

## Deployment
- Push to `main` branch → Vercel auto-deploys in ~1-2 minutes
- Live URL: `precisionmyanmar-sigma.vercel.app`
- Build command: `npm run build`
- Output directory: `dist`
