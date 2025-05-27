'use client'

import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, ExternalLink, CheckCircle, Code, Zap, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Download CodeMap
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Optimize your AI coding workflow with intelligent context mapping and token savings
            </p>
          </div>

          {/* Download Options */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* VS Code Extension */}
            <Card className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-6 h-6 text-blue-600" />
                    VS Code Extension
                  </CardTitle>
                  <Badge className="bg-green-500 text-white">Recommended</Badge>
                </div>
                <CardDescription>
                  Integrate CodeMap directly into Visual Studio Code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Real-time context optimization
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Automatic token savings tracking
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Seamless AI assistant integration
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full" disabled>
                      <Download className="w-4 h-4 mr-2" />
                      Coming Soon
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Extension in development
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CLI Tool */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-purple-600" />
                  CLI Tool
                </CardTitle>
                <CardDescription>
                  Command-line interface for advanced users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Batch processing capabilities
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    CI/CD integration support
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Custom workflow automation
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="outline" className="w-full" disabled>
                      <Download className="w-4 h-4 mr-2" />
                      Coming Soon
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      CLI tool in development
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Installation Instructions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Installation Instructions</CardTitle>
              <CardDescription>
                Get started with CodeMap in just a few steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Create Your Account</h3>
                    <p className="text-gray-600 text-sm">
                      Sign up for a CodeMap account to track your usage and access premium features.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Install the Extension</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Download and install the CodeMap extension for your preferred development environment.
                    </p>
                    <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                      # Coming soon: npm install -g codemap-cli
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Configure Your API Key</h3>
                    <p className="text-gray-600 text-sm">
                      Connect your CodeMap account by adding your API key to the extension settings.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Start Optimizing</h3>
                    <p className="text-gray-600 text-sm">
                      Begin using your AI coding assistant with CodeMap's intelligent context optimization.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                What You'll Get
              </CardTitle>
              <CardDescription>
                Powerful features to enhance your AI coding experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Token Optimization</h3>
                  <p className="text-sm text-gray-600">
                    Reduce AI API costs by up to 70% with intelligent context compression
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Usage Analytics</h3>
                  <p className="text-sm text-gray-600">
                    Track your optimization performance and savings over time
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Code className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Smart Context</h3>
                  <p className="text-sm text-gray-600">
                    Automatically provide relevant code context to AI assistants
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Ready to optimize your AI coding workflow?
            </p>
            <Link href="/dashboard">
              <Button size="lg">
                Go to Dashboard
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 