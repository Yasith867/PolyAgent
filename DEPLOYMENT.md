# Deploying to Vercel

This guide will help you deploy your application to Vercel with all necessary environment variables.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/cli) (optional, but recommended)

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Connect Your Repository

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click "Add New Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Or select "Import Git Repository" and paste your repository URL

### Step 2: Configure Project Settings

1. **Framework Preset**: Select "Other" or "Vite"
2. **Root Directory**: Leave as `.` (project root)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist/public`
5. **Install Command**: `npm install`

### Step 3: Add Environment Variables

In the "Environment Variables" section, add the following:

| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_GV3Yk8HBrpld@ep-soft-sun-ah2kjfzz-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |
| `SESSION_SECRET` | `mySecretKey123` |
| `CLOUDFLARE_ACCOUNT_ID` | `73f1e9175a176f57897836f2a4599448` |
| `CLOUDFLARE_API_TOKEN` | `oPtnAje9A1Fm6EHDkztH-7VJ2at7ufXYXsLdvdut` |
| `NODE_ENV` | `production` |

> **Important**: Make sure to add these environment variables for all environments (Production, Preview, and Development) or select which environments need them.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at the provided URL

---

## Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

From your project directory, run:

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N** (first time) or **Y** (if already created)
- What's your project's name? Enter a name or press enter for default
- In which directory is your code located? **.**

### Step 4: Add Environment Variables

You can add environment variables via the CLI:

```bash
vercel env add DATABASE_URL
# Paste the value when prompted

vercel env add SESSION_SECRET
# Paste the value when prompted

vercel env add CLOUDFLARE_ACCOUNT_ID
# Paste the value when prompted

vercel env add CLOUDFLARE_API_TOKEN
# Paste the value when prompted

vercel env add NODE_ENV
# Enter: production
```

Or add them via the Vercel dashboard at:
`https://vercel.com/<your-username>/<project-name>/settings/environment-variables`

### Step 5: Redeploy with Environment Variables

After adding the environment variables, redeploy:

```bash
vercel --prod
```

---

## Post-Deployment

### Verify Your Deployment

1. Visit your deployment URL
2. Check that the API routes work: `https://your-app.vercel.app/api/<your-endpoint>`
3. Test database connectivity
4. Test Cloudflare integration (if applicable)

### Database Migration

If you need to push database schema changes, you can run:

```bash
npm run db:push
```

Make sure your local environment has access to the production database, or set up a separate script for production migrations.

### Domain Setup (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

---

## Troubleshooting

### Build Failures

- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json` (not just `devDependencies`)
- Verify your build command produces the correct output directory

### Environment Variables Not Working

- Make sure environment variables are set for the correct environment (Production/Preview/Development)
- Redeploy after adding new environment variables
- Check that variable names match exactly (case-sensitive)

### API Routes Not Working

- Verify the `vercel.json` routing configuration
- Check that your Express routes are properly exported
- Ensure database connection is established

### Database Connection Issues

- Verify DATABASE_URL is correctly formatted
- Check that your database allows connections from Vercel's IP ranges
- For Neon, ensure connection pooling is enabled

---

## Environment Variables Reference

Here's what each environment variable is used for:

- **DATABASE_URL**: PostgreSQL connection string for your Neon database
- **SESSION_SECRET**: Secret key for Express session management
- **CLOUDFLARE_ACCOUNT_ID**: Your Cloudflare account identifier
- **CLOUDFLARE_API_TOKEN**: API token for Cloudflare services
- **NODE_ENV**: Application environment (set to `production`)

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Deploying a Full-Stack App](https://vercel.com/docs/frameworks/vite)
- [Environment Variables Guide](https://vercel.com/docs/projects/environment-variables)
