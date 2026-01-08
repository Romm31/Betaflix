# Betaflix

**Streaming Anime Rasa Nusantara** — Aplikasi streaming anime dengan tampilan mirip Netflix dan tema Indonesia yang elegan.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

## Features

- **Netflix-like UI** — Layout, hover effects, dan carousel seperti Netflix
- **Tema Nusantara** — Warna merah bata, emas kunyit, pattern batik subtle
- **Dark/Light Mode** — Toggle tema dengan next-themes
- **Fully Responsive** — Mobile-first design
- **Fast Loading** — Server-side rendering dengan caching
- **Search Debounce** — Pencarian real-time dengan debounce 400ms
- **Video Player** — Player dengan selector resolusi (360p-1080p)

## Getting Started

### Prerequisites

- Node.js 18+
- npm atau yarn

### Installation

```bash
# Clone repository
git clone <repo-url>
cd betaflix

# Install dependencies
npm install

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build for Production

```bash
# Build
npm run build

# Start production server
npm run start
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **Theme**: next-themes
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout dengan ThemeProvider
│   ├── page.tsx            # Home page
│   ├── loading.tsx         # Loading skeleton
│   ├── error.tsx           # Error boundary
│   ├── not-found.tsx       # 404 page
│   ├── search/page.tsx     # Search page
│   ├── movies/page.tsx     # Movies listing
│   ├── anime/[urlId]/      # Anime detail
│   ├── watch/[chapterUrlId]/ # Video player
│   └── api/proxy/          # CORS proxy fallback
├── components/
│   ├── ui/                 # shadcn components
│   ├── Navbar.tsx          # Navigation bar
│   ├── Footer.tsx          # Footer
│   ├── HeroBanner.tsx      # Hero section
│   ├── RowCarousel.tsx     # Horizontal carousel
│   ├── AnimeCard.tsx       # Poster card
│   ├── AnimeGrid.tsx       # Grid layout
│   ├── VideoPlayer.tsx     # Video player
│   ├── Skeletons.tsx       # Loading skeletons
│   └── providers.tsx       # Theme provider
└── lib/
    ├── types.ts            # TypeScript types
    ├── api.ts              # API wrapper
    └── utils.ts            # Utility functions
```

## Theme Colors

| Color      | Light Mode | Dark Mode | Usage            |
| ---------- | ---------- | --------- | ---------------- |
| Primary    | `#8B2323`  | `#B83A3A` | Merah bata/marun |
| Accent     | `#D4A84B`  | `#E5B85C` | Emas kunyit      |
| Background | `#FDF8F3`  | `#0D0D0D` | Krem / Charcoal  |

## API Endpoints

Base URL: `https://api.sansekai.my.id`

| Endpoint                                     | Description     |
| -------------------------------------------- | --------------- |
| `/anime/latest?page=1`                       | Anime terbaru   |
| `/anime/search?query=...`                    | Cari anime      |
| `/anime/detail?urlId=...`                    | Detail anime    |
| `/anime/movie`                               | Daftar movie    |
| `/anime/getvideo?chapterUrlId=...&reso=480p` | Video streaming |

## Caching Strategy

- **Home page**: `revalidate: 60` (1 menit)
- **Movies**: `revalidate: 60` (1 menit)
- **Search**: `revalidate: 300` (5 menit)
- **Detail**: `revalidate: 30` (30 detik)
- **Video**: No cache (fresh setiap request)

## Menambah Kategori Row Baru

1. Buka `src/app/page.tsx`
2. Fetch data di `HomeContent`:
   ```tsx
   const newCategory = await fetchNewCategory();
   ```
3. Tambah `RowCarousel`:
   ```tsx
   <RowCarousel title="Kategori Baru" animeList={newCategory} />
   ```

## Deploy ke Vercel

1. Push ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Deploy otomatis!

Tidak perlu environment variables karena API public.

## 📄 License

MIT License

---

**Made with love in Indonesia**
