'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/navigation'
import Link from 'next/link'
import { CalendarDays, CreditCard, Settings, TrendingUp } from 'lucide-react'

interface UserData {
  id: string
  clerk_user_id: string
  email: string
  plan: 'free' | 'monthly' | 'yearly'
  is_active: boolean
  stripe_customer_id?: string
  billing_end_date?: string
  created_at: string
  updated_at: string
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData()
    }
  }, [isLoaded, user])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPlanBadgeVariant = (plan: string, isActive: boolean) => {
    if (!isActive) return 'secondary'
    switch (plan) {
      case 'yearly':
        return 'default'
      case 'monthly':
        return 'default'
      default:
        return 'outline'
    }
  }

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'yearly':
        return 'Yearly Pro'
      case 'monthly':
        return 'Monthly Pro'
      default:
        return 'Free'
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName || user.emailAddresses[0].emailAddress}!
          </h1>
          <p className="text-gray-600">
            Manage your CodeMap subscription and view your account details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Subscription Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge variant={getPlanBadgeVariant(userData?.plan || 'free', userData?.is_active || false)}>
                  {getPlanDisplayName(userData?.plan || 'free')}
                </Badge>
                {userData?.is_active && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Active
                  </Badge>
                )}
              </div>
              {userData?.plan !== 'free' && !userData?.is_active && (
                <p className="text-sm text-red-600 mt-2">Subscription inactive</p>
              )}
            </CardContent>
          </Card>

          {/* Billing Date */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {userData?.billing_end_date ? 'Next Billing' : 'Member Since'}
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userData?.billing_end_date 
                  ? formatDate(userData.billing_end_date)
                  : userData?.created_at 
                    ? formatDate(userData.created_at)
                    : 'N/A'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {userData?.billing_end_date ? 'Renewal date' : 'Account created'}
              </p>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usage</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userData?.plan === 'free' ? 'Limited' : 'Unlimited'}
              </div>
              <p className="text-xs text-muted-foreground">
                {userData?.plan === 'free' 
                  ? 'Upgrade for unlimited access' 
                  : 'Full access to all features'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Account Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your account details and subscription information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{user.emailAddresses[0].emailAddress}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">User ID</label>
                <p className="text-sm text-gray-500 font-mono">{user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Plan</label>
                <p className="text-sm text-gray-900">{getPlanDisplayName(userData?.plan || 'free')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your subscription and account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userData?.plan === 'free' ? (
                <Link href="/pricing">
                  <Button className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Subscription
                </Button>
              )}
              
              <Button variant="outline" className="w-full" asChild>
                <Link href="/pricing">
                  View All Plans
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full" disabled>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Overview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>CodeMap Features</CardTitle>
            <CardDescription>
              What you get with your current plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${userData?.plan !== 'free' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={userData?.plan !== 'free' ? 'text-gray-900' : 'text-gray-500'}>
                  Unlimited AI Assistance
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${userData?.plan !== 'free' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={userData?.plan !== 'free' ? 'text-gray-900' : 'text-gray-500'}>
                  Advanced Code Analysis
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${userData?.plan !== 'free' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={userData?.plan !== 'free' ? 'text-gray-900' : 'text-gray-500'}>
                  Priority Support
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-900">Basic Code Mapping</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-900">Community Support</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${userData?.plan === 'yearly' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={userData?.plan === 'yearly' ? 'text-gray-900' : 'text-gray-500'}>
                  20% Yearly Discount
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 