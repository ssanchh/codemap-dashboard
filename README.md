# CodeMap Dashboard

A modern SaaS dashboard for CodeMap - an AI coding assistant optimization tool. Built with Next.js 14, TypeScript, TailwindCSS, Clerk authentication, Stripe payments, and Supabase database.

## Features

- 🔐 **User Authentication** - Secure authentication with Clerk
- 💳 **Subscription Management** - Stripe integration for payments
- 📊 **Dashboard Analytics** - User subscription and usage tracking
- 🎨 **Modern UI** - Beautiful interface with TailwindCSS and shadcn/ui
- 🗄️ **Database** - Supabase for user and subscription data
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Authentication**: Clerk
- **Payments**: Stripe
- **Database**: Supabase
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Clerk account
- Stripe account
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd codemap-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and fill in your credentials:
   
   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # App Configuration
   NEXT_PUBLIC_APP_URL=https://app.codemapai.io
   # For local development, use: http://localhost:3000
   ```

### Database Setup

1. **Create Supabase tables**
   
   Run the SQL script in your Supabase dashboard:
   ```sql
   -- Copy and paste the contents of database/schema.sql
   ```

2. **Configure Row Level Security**
   
   The schema includes RLS policies for secure data access.

### Stripe Setup

1. **Create Products and Prices**
   - Create monthly and yearly subscription products in Stripe
   - Note down the Price IDs
   - Update the price IDs in `src/lib/stripe.ts`

2. **Set up Webhooks** (for production)
   - Add webhook endpoint: `https://app.codemapai.io/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy webhook secret to environment variables

3. **For local development**
   - Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   - Or use a dummy webhook secret for testing without payments

### Running the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) for local development
   
   Production app is available at [https://app.codemapai.io](https://app.codemapai.io)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── create-checkout-session/
│   │   ├── user/
│   │   └── webhooks/stripe/
│   ├── dashboard/         # Dashboard page
│   ├── pricing/           # Pricing page
│   ├── sign-in/           # Authentication pages
│   └── sign-up/
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── Navigation.tsx    # Navigation component
└── lib/                  # Utility libraries
    ├── stripe.ts         # Stripe configuration
    ├── supabase.ts       # Supabase client
    └── utils.ts          # Utility functions
```

## Key Features

### Authentication
- Secure user authentication with Clerk
- Protected routes and middleware
- User session management

### Subscription Management
- Multiple pricing tiers (Free, Monthly Pro, Yearly Pro)
- Stripe checkout integration
- Webhook handling for subscription updates
- Automatic user provisioning

### Dashboard
- User subscription status
- Account information
- Quick actions for plan management
- Feature comparison

## API Routes

- `GET /api/user` - Fetch user data
- `POST /api/user` - Create/update user
- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Add environment variables** in Vercel dashboard
3. **Update webhook URLs** in Stripe to use your production domain
4. **Deploy**

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact [your-email@example.com] or create an issue in the repository.

## Roadmap

- [ ] Advanced analytics dashboard
- [ ] Usage tracking and limits
- [ ] Team collaboration features
- [ ] API access management
- [ ] Advanced billing features
- [ ] Mobile app

---

Built with ❤️ for the CodeMap community
