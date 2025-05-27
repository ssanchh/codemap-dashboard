'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, ExternalLink, CheckCircle, Code, Zap, BarChart3, FileText, Package, AlertCircle } from 'lucide-react'
import Link from 'next/link'

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

export default function DownloadPage() {
  const { user, isLoaded } = useUser()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)

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

  const handleDownload = async (fileType: 'extension' | 'agent') => {
    if (!user) return

    setDownloading(fileType)
    try {
      const response = await fetch(`/api/download?file=${fileType}`)
      
      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Download failed')
        return
      }

      // Create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileType === 'extension' ? 'codemap-extension.vsix' : 'codemap-agent.zip'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      alert('Download failed. Please try again.')
    } finally {
      setDownloading(null)
    }
  }

  const canDownload = userData && (userData.plan === 'free' || userData.is_active)

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading downloads...</p>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-6">Please sign in to access downloads.</p>
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
            Download CodeMap
          </h1>
          <p className="text-gray-600">
            Get the CodeMap extension and agent to supercharge your AI coding workflow.
          </p>
        </div>

        {/* User Status */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {canDownload ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                )}
                Download Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge variant={userData?.is_active ? 'default' : 'outline'}>
                  {userData?.plan === 'free' ? 'Free Plan' : 
                   userData?.plan === 'monthly' ? 'Monthly Pro' : 
                   userData?.plan === 'yearly' ? 'Yearly Pro' : 'Unknown'}
                </Badge>
                {userData?.is_active && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Active Subscription
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {canDownload 
                  ? 'You have access to download CodeMap files.'
                  : 'Upgrade your plan to access downloads.'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Downloads */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* VS Code Extension */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle>VS Code Extension</CardTitle>
                  <CardDescription>
                    CodeMap extension for Visual Studio Code
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Intelligent context mapping</li>
                    <li>• Token usage optimization</li>
                    <li>• Real-time AI assistance</li>
                    <li>• Project structure analysis</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => handleDownload('extension')}
                  disabled={!canDownload || downloading === 'extension'}
                  className="w-full"
                >
                  {downloading === 'extension' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Extension (.vsix)
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Agent Package */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-green-600" />
                <div>
                  <CardTitle>CodeMap Agent</CardTitle>
                  <CardDescription>
                    Standalone agent for other editors
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Cross-platform compatibility</li>
                    <li>• CLI integration</li>
                    <li>• Custom AI model support</li>
                    <li>• Advanced configuration</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => handleDownload('agent')}
                  disabled={!canDownload || downloading === 'agent'}
                  className="w-full"
                  variant="outline"
                >
                  {downloading === 'agent' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Agent (.zip)
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Installation Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Installation Instructions</CardTitle>
            <CardDescription>
              How to install and set up CodeMap
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">VS Code Extension</h4>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li>1. Download the .vsix file</li>
                  <li>2. Open VS Code</li>
                  <li>3. Go to Extensions (Ctrl+Shift+X)</li>
                  <li>4. Click "..." → "Install from VSIX"</li>
                  <li>5. Select the downloaded file</li>
                  <li>6. Restart VS Code</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">CodeMap Agent</h4>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li>1. Download and extract the .zip file</li>
                  <li>2. Run the installer for your OS</li>
                  <li>3. Configure your AI model settings</li>
                  <li>4. Set up project paths</li>
                  <li>5. Start the agent service</li>
                  <li>6. Connect your editor</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade CTA for free users */}
        {userData?.plan === 'free' && (
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Unlock Premium Features</CardTitle>
              <CardDescription className="text-blue-700">
                Upgrade to Pro for advanced features and priority support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/pricing">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  View Pro Plans
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 