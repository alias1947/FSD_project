# Deploying to Vercel - Step by Step Guide

## ⚠️ Important Warning About Data Storage

**Your app currently uses JSON files for data storage. Vercel is a serverless platform with a read-only file system (except `/tmp`), which means:**

- ❌ Data written to JSON files won't persist between requests
- ❌ Files are reset on each deployment
- ❌ Multiple serverless functions can't share file writes

**For testing/demos**: This will work but data won't persist.
**For production**: You need to migrate to a database (MongoDB, Supabase, etc.)

---

## Method 1: Deploy via Vercel CLI (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
This will open your browser to authenticate.

### Step 3: Deploy
Navigate to your project directory and run:
```bash
vercel
```

You'll be prompted with:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No (for first time)
- **Project name?** → Press Enter (uses folder name) or type custom name
- **Directory?** → Press Enter (uses `.`)
- **Override settings?** → No

### Step 4: Deploy to Production
```bash
vercel --prod
```

Your site will be live at: `https://your-project-name.vercel.app`

---

## Method 2: Deploy via GitHub (Recommended for Continuous Deployment)

### Step 1: Push to GitHub
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create a repository on GitHub, then:
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

### Step 2: Import Project on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click **"Deploy"**

### Step 3: Automatic Deployments
- Every push to `main` branch = Production deployment
- Every push to other branches = Preview deployment

---

## Method 3: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. If you haven't connected GitHub:
   - Click **"Import Git Repository"**
   - Authorize Vercel to access your GitHub
4. Select your repository
5. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
6. Click **"Deploy"**

---

## Build Configuration

Vercel automatically detects Next.js, but if you need custom settings, create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

---

## Environment Variables (if needed)

If you add environment variables later:

1. Go to your project on Vercel dashboard
2. **Settings** → **Environment Variables**
3. Add your variables
4. Redeploy

---

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility (Next.js 14 needs Node 18+)

### Data Not Persisting
- This is expected with JSON file storage on Vercel
- Consider migrating to a database (see below)

### Import Errors
- Make sure `tsconfig.json` paths are correct
- Check that all TypeScript types are properly exported

---

## Quick Fix for Data Persistence (Temporary Solution)

For a quick demo, you can use Vercel KV (Key-Value store) or migrate to a free database. I can help you:
1. Set up MongoDB Atlas (free) or Supabase (free)
2. Migrate your data layer to use the database
3. Update your API routes

Would you like me to help with the database migration?

---

## Post-Deployment Checklist

- [ ] Test all features (login, create study jam, join/leave)
- [ ] Check responsive design on mobile
- [ ] Verify all API routes work
- [ ] Test dark mode
- [ ] Share the URL with your users!

---

## Useful Vercel Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# Remove a deployment
vercel remove [deployment-url]

# List all deployments
vercel ls
```

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Vercel Discord: https://vercel.com/discord

