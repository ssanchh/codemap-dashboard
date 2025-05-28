# CodeMap Dashboard - Production Deployment Guide

## 🚀 Subdomain Setup: app.codemapai.io

This guide covers deploying the CodeMap Dashboard to the subdomain `app.codemapai.io` while the main landing page remains on `codemapai.io` (Framer).

## 📋 Pre-Deployment Checklist

### 1. Domain Configuration
- ✅ Main site: `codemapai.io` (Framer)
- ✅ App subdomain: `app.codemapai.io` (Next.js Dashboard)
- ✅ Vercel custom domain configured

### 2. Environment Variables Setup

Copy the values from `.env.production` to your Vercel environment variables:

```bash
# Clerk Authentication - Production
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_FRONTEND_API=clerk.app.codemapai.io
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase - Production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe - Production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
NEXT_PUBLIC_APP_URL=https://app.codemapai.io
```

## 🔧 Service Configuration

### Clerk Setup
1. **Update Authorized Domains**:
   - Add `app.codemapai.io` to authorized domains
   - Add `codemapai.io` for cross-domain authentication

2. **Update Redirect URLs**:
   - Sign-in redirect: `https://app.codemapai.io/dashboard`
   - Sign-up redirect: `https://app.codemapai.io/dashboard`

3. **Frontend API Configuration**:
   - Set Frontend API to: `clerk.app.codemapai.io`

### Stripe Configuration
1. **Update Webhook Endpoint**:
   - URL: `https://app.codemapai.io/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

2. **Update Success/Cancel URLs** in checkout sessions:
   - Success: `https://app.codemapai.io/dashboard?success=true`
   - Cancel: `https://app.codemapai.io/pricing?canceled=true`

### Supabase Configuration
1. **Update Site URL**:
   - Set to: `https://app.codemapai.io`

2. **Add Redirect URLs**:
   - `https://app.codemapai.io/**`
   - `https://codemapai.io/**` (for cross-domain auth)

## 🚀 Deployment Steps

### 1. Vercel Deployment
```bash
# Build and deploy
npm run build
vercel --prod
```

### 2. Domain Configuration
1. Go to Vercel Dashboard → Project Settings → Domains
2. Add custom domain: `app.codemapai.io`
3. Configure DNS records as instructed by Vercel

### 3. Environment Variables
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add all production environment variables
3. Set environment to "Production"

## 🔄 User Flow

### Authentication Flow
1. **Landing Page**: `codemapai.io` (Framer)
   - Sign Up button → `https://app.codemapai.io/sign-up`
   - Sign In button → `https://app.codemapai.io/sign-in`

2. **App Subdomain**: `app.codemapai.io` (Next.js)
   - Root `/` → Redirects based on auth status
   - Authenticated → `/dashboard`
   - Not authenticated → `/sign-in`

3. **Cross-Domain Authentication**:
   - Users can sign up on Framer site
   - Seamlessly access dashboard on subdomain
   - Session persists across domains

## 📁 File Structure
```
app.codemapai.io/
├── /                    # Auth-based redirect
├── /dashboard           # Main SaaS interface
├── /pricing            # Subscription plans
├── /download           # Protected downloads
├── /account            # Account management
├── /sign-in            # Authentication
└── /sign-up            # Registration
```

## 🔒 Security Considerations

### Environment Variables
- ✅ All sensitive keys in Vercel environment variables
- ✅ `.env.production` excluded from git
- ✅ Different keys for development/production

### Authentication
- ✅ Clerk handles secure cross-domain auth
- ✅ Protected API routes with middleware
- ✅ Session validation on all protected pages

### Downloads
- ✅ Authentication required for all downloads
- ✅ Subscription-based access control
- ✅ Secure file serving through API routes

## 🧪 Testing Checklist

### Pre-Production Testing
- [ ] Build completes without errors
- [ ] All environment variables configured
- [ ] Clerk authentication works
- [ ] Stripe checkout functional
- [ ] Database connections established
- [ ] Download functionality works

### Post-Deployment Testing
- [ ] `app.codemapai.io` loads correctly
- [ ] Sign-up flow from Framer site works
- [ ] Dashboard access after authentication
- [ ] Subscription upgrade process
- [ ] Download access based on plan
- [ ] Account management features

## 🚨 Troubleshooting

### Common Issues

1. **Authentication Redirect Loops**:
   - Check Clerk authorized domains
   - Verify redirect URLs in Clerk dashboard
   - Ensure `NEXT_PUBLIC_CLERK_FRONTEND_API` is correct

2. **Stripe Webhook Failures**:
   - Verify webhook URL in Stripe dashboard
   - Check webhook secret in environment variables
   - Monitor webhook logs in Stripe

3. **Database Connection Issues**:
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure service role key has proper permissions

4. **Download Access Issues**:
   - Check user subscription status in database
   - Verify file paths in `public/downloads/`
   - Test API route `/api/download` directly

## 📊 Monitoring

### Key Metrics to Monitor
- Authentication success rate
- Subscription conversion rate
- Download completion rate
- API response times
- Error rates

### Recommended Tools
- Vercel Analytics (built-in)
- Clerk Dashboard (authentication metrics)
- Stripe Dashboard (payment metrics)
- Supabase Dashboard (database metrics)

## 🔄 Maintenance

### Regular Tasks
- Monitor error logs in Vercel
- Check webhook delivery in Stripe
- Review user activity in Clerk
- Monitor database performance in Supabase
- Update download files as needed

### Security Updates
- Rotate API keys quarterly
- Review and update RLS policies
- Monitor for suspicious authentication patterns
- Keep dependencies updated

---

## 🎉 Deployment Complete!

Once deployed, your CodeMap Dashboard will be live at:
- **Main App**: https://app.codemapai.io
- **Landing Page**: https://codemapai.io (Framer)

Users can seamlessly move between the marketing site and the SaaS application with persistent authentication. 