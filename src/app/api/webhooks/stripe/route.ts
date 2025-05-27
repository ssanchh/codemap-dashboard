import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const clerkUserId = session.metadata?.clerk_user_id

        if (!clerkUserId) {
          console.error('No clerk_user_id in session metadata')
          break
        }

        // Get the subscription
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        ) as Stripe.Subscription

        const plan = subscription.items.data[0].price.recurring?.interval === 'year' 
          ? 'yearly' 
          : 'monthly'

        // Get billing end date from the first subscription item
        const billingEndDate = subscription.items.data[0].current_period_end
          ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
          : null

        // Update user in Supabase
        await supabaseAdmin
          .from('users')
          .update({
            plan,
            is_active: true,
            billing_end_date: billingEndDate,
            updated_at: new Date().toISOString(),
          })
          .eq('clerk_user_id', clerkUserId)

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        
        if (customer.deleted) break

        const clerkUserId = customer.metadata?.clerk_user_id

        if (!clerkUserId) {
          console.error('No clerk_user_id in customer metadata')
          break
        }

        const plan = subscription.items.data[0].price.recurring?.interval === 'year' 
          ? 'yearly' 
          : 'monthly'

        // Get billing end date from the first subscription item
        const billingEndDate = subscription.items.data[0].current_period_end
          ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
          : null

        await supabaseAdmin
          .from('users')
          .update({
            plan,
            is_active: subscription.status === 'active',
            billing_end_date: billingEndDate,
            updated_at: new Date().toISOString(),
          })
          .eq('clerk_user_id', clerkUserId)

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        
        if (customer.deleted) break

        const clerkUserId = customer.metadata?.clerk_user_id

        if (!clerkUserId) {
          console.error('No clerk_user_id in customer metadata')
          break
        }

        await supabaseAdmin
          .from('users')
          .update({
            plan: 'free',
            is_active: false,
            billing_end_date: null,
            updated_at: new Date().toISOString(),
          })
          .eq('clerk_user_id', clerkUserId)

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
} 