# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Nuxt 4.6.4 requires Node 22.22.3 or a supported newer version; `.nvmrc` records 22.22.3. The default local API is `http://127.0.0.1:3001/api/v1`. Set `NUXT_API_BASE` for server-side requests and `NUXT_PUBLIC_API_BASE` for browser requests if the deployment uses different addresses. The backend CORS origin must match the frontend origin. Set `NUXT_PUBLIC_DEMO_MODE=true` to expose the separate `/demo` fixture view; demo results are not saved to the API.

Run `npm run typecheck` with a compatible Node version. Current project-wide typecheck limitations are documented in `../backend/docs/implementation/FRONTEND_INTEGRATION.md`.

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
