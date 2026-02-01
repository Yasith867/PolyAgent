# Quick Deployment Reference

## Environment Variables for Vercel Dashboard

Copy and paste these into your Vercel project settings:

### DATABASE_URL
```
postgresql://neondb_owner:npg_GV3Yk8HBrpld@ep-soft-sun-ah2kjfzz-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### SESSION_SECRET
```
mySecretKey123
```

### CLOUDFLARE_ACCOUNT_ID
```
73f1e9175a176f57897836f2a4599448
```

### CLOUDFLARE_API_TOKEN
```
oPtnAje9A1Fm6EHDkztH-7VJ2at7ufXYXsLdvdut
```

### NODE_ENV
```
production
```

---

## Quick Deploy Steps

1. **Go to Vercel**: https://vercel.com/new
2. **Import your repository**
3. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`
4. **Add all environment variables above**
5. **Click Deploy**

That's it! Your app will be live in a few minutes.

---

## Post-Deployment Checklist

- [ ] Visit your deployment URL
- [ ] Test API endpoints: `https://your-app.vercel.app/api/...`
- [ ] Verify database connection
- [ ] Check Cloudflare integration
- [ ] Test all major features
- [ ] (Optional) Add custom domain

---

## Quick Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Add environment variable
vercel env add VARIABLE_NAME
```

---

## Troubleshooting

**Build fails?** Check build logs in Vercel dashboard

**API not working?** Verify environment variables are set

**Database errors?** Check DATABASE_URL is correct and database is accessible

**Need help?** See full guide in [DEPLOYMENT.md](./DEPLOYMENT.md)
