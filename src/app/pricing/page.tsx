'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/navigation'
import { Check } from 'lucide-react'
import { PRICING_PLANS } from '@/lib/stripe'
import { toast } from 'sonner'

export default function PricingPage() {
  const { isSignedIn } = useUser()
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (priceId: string, planType: string) => {
    if (!isSignedIn) {
      window.location.href = '/sign-up'
      return
    }

    setLoading(planType)
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. Start free and upgrade when you're ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for trying out CodeMap</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>100 context requests/month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>Basic token optimization</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>Community support</span>
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => window.location.href = isSignedIn ? '/dashboard' : '/sign-up'}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Plan */}
            <Card className="relative border-blue-500 border-2">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-2xl">Monthly Pro</CardTitle>
                <CardDescription>For active developers</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${PRICING_PLANS.monthly.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {PRICING_PLANS.monthly.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => handleCheckout(PRICING_PLANS.monthly.priceId, 'monthly')}
                  disabled={loading === 'monthly'}
                >
                  {loading === 'monthly' ? 'Loading...' : 'Start Monthly Plan'}
                </Button>
              </CardContent>
            </Card>

            {/* Yearly Plan */}
            <Card className="relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500">
                Best Value
              </Badge>
              <CardHeader>
                <CardTitle className="text-2xl">Yearly Pro</CardTitle>
                <CardDescription>Save with annual billing</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${PRICING_PLANS.yearly.price}</span>
                  <span className="text-gray-600">/year</span>
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Save $20 per year
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {PRICING_PLANS.yearly.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => handleCheckout(PRICING_PLANS.yearly.priceId, 'yearly')}
                  disabled={loading === 'yearly'}
                >
                  {loading === 'yearly' ? 'Loading...' : 'Start Yearly Plan'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What happens to my data if I cancel?
                </h3>
                <p className="text-gray-600">
                  Your usage data and settings are preserved for 30 days after cancellation, allowing you to reactivate without losing your history.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do you offer refunds?
                </h3>
                <p className="text-gray-600">
                  We offer a 30-day money-back guarantee for all paid plans. Contact support if you're not satisfied.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 