# Petitions

A modern petition platform built with Next.js where users can create, sign, and track petitions for causes they care about.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn-UI](https://ui.shadcn.com/)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [BetterAuth](https://www.better-auth.com/) (email/password)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL running locally

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your PostgreSQL credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/petitions
# BETTER_AUTH_SECRET=your-secure-random-secret

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/auth/          # BetterAuth API routes
│   ├── protected/          # Protected pages (require auth)
│   ├── sign-in/            # Authentication page
│   └── page.tsx            # Home page with petition grid
├── components/             # Reusable React components
│   └── petition-card.tsx   # Petition display card
├── db/                     # Database layer
│   ├── index.ts            # Drizzle client connection
│   └── schema.ts           # Database schema (tables)
├── lib/                    # Shared utilities
│   ├── auth.ts             # BetterAuth server config
│   ├── auth-client.ts      # BetterAuth React client
│   └── utils.ts            # Utility functions
└── drizzle.config.ts       # Drizzle Kit configuration
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema directly (dev) |
| `npm run db:studio` | Open Drizzle Studio GUI |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret key for auth tokens |
| `BETTER_AUTH_URL` | Base URL for auth (http://localhost:3000) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Client-side auth URL |

## License

MIT
