import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

// Pricing configuration
export const PRICING_PLANS = {
  monthly: {
    name: 'Monthly Pro',
    price: 9.99,
    priceId: 'price_1RTD4GDFQ7LXtBN63jEAkRiI',
    features: [
      'Unlimited context requests',
      'Advanced token optimization',
      'Priority support',
      'Usage analytics',
    ],
  },
  yearly: {
    name: 'Yearly Pro',
    price: 99.99,
    priceId: 'price_1RTD4yDFQ7LXtBN68X71sAtI',
    features: [
      'Unlimited context requests',
      'Advanced token optimization',
      'Priority support',
      'Usage analytics',
      '2 months free',
    ],
  },
} as const 