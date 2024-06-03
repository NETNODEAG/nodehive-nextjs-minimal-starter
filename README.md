# nodehive-nextjs-minimal-starter

## 1. Installation

### 1.1 Create a new Next.js app

Create a new Next.js app using one of the following starter templates, where everything is set up for you automatically.

**Basic starter**

```
npx create-next-app frontend.example.ch -e https://github.com/NETNODEAG/nodehive-nextjs-minimal-starter/tree/main
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

To ensure the correct configuration of your application's default landing page, please follow these updated steps. This involves updating the environment variables in your .env.local file.

Update the environment variables as follows:

```
# NodeHive
NEXT_PUBLIC_DRUPAL_REST_BASE_URL=<drupal_backend_url>
NEXT_PUBLIC_DRUPAL_BASE_URL=<drupal_backend_url>
NEXT_IMAGE_DOMAIN=<drupal_backend_url>

# Frontend
NEXT_PUBLIC_FRONTEND_BASE_URL=<nextjs_frontend_url>

# Drupal NodeHive
NEXT_PUBLIC_NODEHIVE_SPACE_NAME="nodehive"
NEXT_PUBLIC_DRUPAL_NODEHIVE_SPACE_ID=<drupal_nodehive_space_id>
NODEHIVE_STARTPAGE_ID=<your_desired_node_id>
NODEHIVE_DEFAULT_LANGUAGE=en
```

Replace the placeholders with the appropriate values:

- `<drupal_backend_url>`: Your Drupal backend URL.
- `<nextjs_frontend_url>`: Your Next.js frontend URL.
- `<drupal_nodehive_space_id>`: Your Drupal NodeHive space ID.
- `<your_desired_node_id>`: The Node ID you want to set as the start page.

Please ensure all changes are made to keep your application functioning correctly.

## 2. Backend configuration

### 2.1 Multilanguage Setup

The minimal starter is configured to support multiple languages. To enable this feature, follow these steps:

1. Add Additional Languages: Add the additional languages you want to support. Make sure to configure the language settings appropriately for each language.

2. Configure Prefixes: Set up the URL prefixes for each language. This step is crucial to ensure that your application's URLs are correctly routed based on the selected language.

3. Enable Translations for Content Types: Ensure that translations are enabled for all relevant content types in your application.

By following these steps, you will have a fully functional multilingual setup for your application.

## 3. Deployment

### 3.1 Deploy on Vercel

The most straightforward method to deploy your NodeHive Next.js application is to use the Vercel Platform, which is developed by the creators of Next.js.

To initiate a new project quickly, simply click the "Deploy" button ⚡️

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNETNODEAG%2Fnodehive-nextjs-starter&env=NEXT_PUBLIC_DRUPAL_REST_BASE_URL,NEXT_PUBLIC_DRUPAL_BASE_URL,NEXT_IMAGE_DOMAIN,NEXT_PUBLIC_FRONTEND_BASE_URL,NEXT_PUBLIC_COOKIE_USER,NEXT_PUBLIC_COOKIE_USER_TOKEN,NEXT_PUBLIC_DRUPAL_NODEHIVE_SPACE_ID,NODEHIVE_STARTPAGE_SLUG,NODEHIVE_DEFAULT_LANGUAGE&project-name=nodehive-nextjs-starter&repository-name=nodehive-nextjs-starter&redirect-url=https%3A%2F%2Fdocs.nodehive.com&demo-title=nodehive-nextjs-starter&demo-description=Official%20NodeHive%20NextJS%20Starter%20Template&demo-url=https%3A%2F%2Fnodehive-nextjs-starter.vercel.app)
