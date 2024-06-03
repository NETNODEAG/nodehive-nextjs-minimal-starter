# nodehive-nextjs-starter

## 1. Installation

### 1.1 Create a new Next.js app

Create a new Next.js app using one of the following starter templates, where everything is set up for you automatically.

**Basic starter**

```
npx create-next-app frontend.example.ch -e https://github.com/NETNODEAG/nodehive-nextjs-starter/tree/main
cd frontend.example.ch
cp .env.example .env
open localhost:3000
npm run dev

```

### 1.2 Linking Your Frontend to Drupal

Here are the streamlined steps to connect your frontend with Drupal:

1. Navigate to your frontend project directory:

```
cd frontend.example.ch
```

2. Create a local environment file from the example:

```
cp .env.example .env.local
```

3. Open `.env.local` and populate the necessary environment variables required for Drupal deployments. Refer to your Drupal deployment documentation for specifics. Save the changes when done.

### 1.2 Run the project!

```
cd frontend.example.ch
nvm use
npm install
npm run dev
```

### 1.3 Adapt the project to your needs

#### Startpage

To change the default landing page of your application, follow the steps outlined below. This process involves modifying the `STARTPAGE_SLUG` value to reflect the Node ID of the page you wish to make your new start page.

1. Locate File: Go to your project's `src/app/` directory and open `page.tsx`.
2. Change Value: Find the `STARTPAGE_SLUG` constant and replace its current value with your desired Node ID as a string (e.g., "12345").
3. Save and Test: Save the file, then run the application to confirm that the new start page matches the specified Node ID.

## 3. Deployment

### 3.1 Deploy on Vercel

The most straightforward method to deploy your NodeHive Next.js application is to use the Vercel Platform, which is developed by the creators of Next.js.

To initiate a new project quickly, simply click the "Deploy" button ⚡️

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNETNODEAG%2Fnodehive-nextjs-starter&env=NEXT_PUBLIC_DRUPAL_REST_BASE_URL,NEXT_PUBLIC_DRUPAL_BASE_URL,NEXT_IMAGE_DOMAIN,NEXT_PUBLIC_FRONTEND_BASE_URL,NEXT_PUBLIC_COOKIE_USER,NEXT_PUBLIC_COOKIE_USER_TOKEN,NEXT_PUBLIC_DRUPAL_NODEHIVE_SPACE_ID,NODEHIVE_STARTPAGE_SLUG,NODEHIVE_DEFAULT_LANGUAGE&project-name=nodehive-nextjs-starter&repository-name=nodehive-nextjs-starter&redirect-url=https%3A%2F%2Fdocs.nodehive.com&demo-title=nodehive-nextjs-starter&demo-description=Official%20NodeHive%20NextJS%20Starter%20Template&demo-url=https%3A%2F%2Fnodehive-nextjs-starter.vercel.app)
