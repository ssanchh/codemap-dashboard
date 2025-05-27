'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/navigation'
import { CreditCard, User as UserIcon, Settings, AlertTriangle, Calendar, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { User } from '@/lib/supabase'

export default function AccountPage() {
  const { user } = useUser()
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

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

    fetchUserData()
  }, [user])

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        console.error('Failed to create portal session')
      }
    } catch (error) {
      console.error('Error creating portal session:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your account...</p>
          </div>
        </div>
      </div>
    )
  }

  const planBadgeColor = userData?.plan === 'yearly' ? 'bg-green-500' : 
                        userData?.plan === 'monthly' ? 'bg-blue-500' : 'bg-gray-500'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your subscription, billing, and account preferences.
            </p>
          </div>

          <div className="space-y-6">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your basic account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">
                      {user?.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Member Since</label>
                    <p className="mt-1 text-gray-900">
                      {userData?.created_at 
                        ? new Date(userData.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">User ID</label>
                    <p className="mt-1 text-gray-900 font-mono text-sm">
                      {userData?.id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Subscription Details
                </CardTitle>
                <CardDescription>
                  Your current plan and billing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Current Plan</h3>
                      <p className="text-gray-600">
                        {userData?.plan === 'free' ? 'Free Plan' :
                         userData?.plan === 'monthly' ? 'Monthly Pro Plan' :
                         userData?.plan === 'yearly' ? 'Yearly Pro Plan' : 'Unknown Plan'}
                      </p>
                    </div>
                    <Badge className={`${planBadgeColor} text-white`}>
                      {userData?.plan?.toUpperCase() || 'FREE'}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <p className="mt-1 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${userData?.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {userData?.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Next Billing Date</label>
                      <p className="mt-1 text-gray-900">
                        {userData?.billing_end_date 
                          ? new Date(userData.billing_end_date).toLocaleDateString()
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Billing Amount</label>
                      <p className="mt-1 text-gray-900">
                        {userData?.plan === 'monthly' ? '$9.99/month' :
                         userData?.plan === 'yearly' ? '$99.99/year' : 'Free'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    {userData?.plan === 'free' ? (
                      <Link href="/pricing">
                        <Button>
                          <DollarSign className="w-4 h-4 mr-2" />
                          Upgrade Plan
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Button onClick={handleManageBilling}>
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Billing
                        </Button>
                        <Link href="/pricing">
                          <Button variant="outline">
                            Change Plan
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Usage Statistics
                </CardTitle>
                <CardDescription>
                  Your CodeMap usage and optimization metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {userData?.token_savings?.toLocaleString() || '0'}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Total Tokens Saved</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {userData?.context_requests?.toLocaleString() || '0'}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Context Requests</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {userData?.context_requests && userData?.context_requests > 0
                        ? Math.round((userData.token_savings / userData.context_requests) * 100) / 100
                        : '0'
                      }
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Avg Tokens/Request</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                      This will permanently delete your account, subscription, and all associated data.
                    </p>
                    <Button variant="destructive" disabled>
                      Delete Account
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Contact support to delete your account
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 