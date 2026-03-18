# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 starter template for NodeHive, a headless CMS powered by Drupal. It connects to a Drupal backend via the `nodehive-js` SDK and provides visual editing capabilities through the Puck page builder.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run test         # Run Playwright e2e tests
npm run storybook    # Start Storybook on port 6006
```

Run a single Playwright test:
```bash
npx playwright test src/e2e/example.spec.ts
```

## Architecture

### Routing & i18n
- Uses Next.js App Router with dynamic `[lang]` segment for internationalization
- Routes: `src/app/[lang]/` - all pages are language-prefixed
- i18n config: `src/config/i18n-config.ts` - defines available locales
- Dictionaries: `src/dictionaries/{lang}.json`

### Drupal Content Mapping
Content from Drupal is rendered through a component registry pattern:

- **Nodes** (`src/components/drupal/node/`): Map Drupal node types to React components
  - Registry: `nodes.ts` maps types like `node--page` to components
  - Add new node types by creating a component and registering in `nodes.ts`

- **Paragraphs** (`src/components/drupal/paragraph/`): Map Drupal paragraph types
  - Registry: `paragraphs.ts`

- **Fragments** (`src/components/drupal/fragment/`): Reusable content blocks
  - Registry: `fragments.ts`

### Puck Page Builder
Visual page editing via `@puckeditor/core`:

- Config: `src/components/drupal/node/puck-page/puck.page.config.tsx`
- Components are organized by category: sections, layout, content, organisms
- Each Puck component has three files:
  - `component.tsx` - The React component
  - `component.config.tsx` - Puck field definitions and render wrapper
  - `component.stories.tsx` - Storybook stories

For creating new Puck components, see the `puck-component` skill in `.claude/skills/puck-component/`.

#### Puck Page Settings (Root Fields)
The Puck editor exposes page-level settings (published state, URL alias, metadata) as root fields. These require the following fields on the Drupal content type:

- `field_puck_data` (Text, long) – Stores the Puck JSON data
- `field_metadata_title` (Text) – SEO title
- `field_metadata_description` (Text, long) – SEO description
- `field_metadata_image` (Entity reference to media--image) – OG image

`status` and `path.alias` are core node properties and always available.

If a project does not use these metadata fields, remove them from the `root.fields` in `puck.page.config.tsx` and strip the corresponding `pageSettings` logic from `puck-editor.tsx` and `api/puck/publish/route.ts`.

The Puck template system requires a Fragment type `puck_template` with a `field_puck_template_data` (Text, long) field in Drupal.

### Theme Components
Located in `src/components/theme/`:
- `atoms-content/` - Content primitives (Heading, BodyCopy, Image, Video, etc.)
- `atoms-layout/` - Layout primitives (Container, Grid, TwoColumns, Space)
- `organisms/` - Composed components (Card, Statistics)
- `sections/` - Full-width sections (Hero)
- `global-layout/` - Header, Footer, Navigation

### NodeHive Client
`src/lib/nodehive-client.ts` provides:
- `createServerClient()` - Auto-resolves between user/service auth
- `createUserClient()` - OAuth password grant for logged-in users
- `createServiceClient()` - OAuth client credentials for anonymous access

### Styling
- Tailwind CSS 4 with `@tailwindcss/forms` and `@tailwindcss/typography`
- Uses `class-variance-authority` for component variants
- `cn()` utility from `src/lib/utils.ts` for class merging

## Code Conventions

- **File naming**: kebab-case enforced by ESLint (`check-file` plugin)
- **Path alias**: `@/*` maps to `./src/*`
- **React Compiler**: Enabled in `next.config.ts`
- SVGs are imported as React components via `@svgr/webpack`

## Environment Variables

Key variables (see `.env.example`):
- `NEXT_PUBLIC_DRUPAL_REST_BASE_URL` - Drupal backend URL
- `NODEHIVE_OAUTH_FRONTEND_CLIENT_ID/SECRET` - Service account OAuth
- `NODEHIVE_OAUTH_USER_CLIENT_ID/SECRET` - User login OAuth
- `NEXT_IMAGE_DOMAINS` - Comma-separated allowed image domains
