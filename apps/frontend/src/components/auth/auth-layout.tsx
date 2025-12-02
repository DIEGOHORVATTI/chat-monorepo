'use client'

import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  leftContent?: {
    title: string
    description: string
    steps?: Array<{
      number: number
      title: string
      isActive?: boolean
    }>
  }
}

export default function AuthLayout({ children, title, subtitle, leftContent }: AuthLayoutProps) {
  const defaultLeftContent = {
    title: 'Get Started with Us',
    description: 'Complete these easy steps to register your account.',
    steps: [
      { number: 1, title: 'Sign up your account', isActive: true },
      { number: 2, title: 'Set up your workspace', isActive: false },
      { number: 3, title: 'Set up your profile', isActive: false },
    ],
  }

  const content = leftContent || defaultLeftContent

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl flex bg-slate-900/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-emerald-500/20">
        {/* Left Side - Visual Content */}
        <div className="w-1/2 bg-gradient-to-br from-emerald-600 via-green-500 to-teal-400 flex items-center justify-center relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute w-96 h-96 bg-gradient-to-br from-emerald-300/30 to-green-400/30 rounded-full blur-3xl -right-20 -top-20 animate-pulse" />
            <div
              className="absolute w-64 h-64 bg-gradient-to-br from-teal-300/20 to-emerald-400/20 rounded-full blur-3xl -left-10 -bottom-10 animate-bounce"
              style={{ animationDuration: '3s' }}
            />
            <div
              className="absolute w-80 h-80 bg-gradient-to-br from-green-400/10 to-teal-500/10 rounded-full blur-3xl right-1/3 top-1/2 animate-ping"
              style={{ animationDuration: '4s' }}
            />
          </div>

          <div className="relative z-10 text-center px-12 text-white">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
              {content.title}
            </h1>

            <p className="text-emerald-50 mb-8 text-lg max-w-md mx-auto">{content.description}</p>

            {/* Steps */}
            {content.steps && (
              <div className="space-y-4 max-w-sm mx-auto">
                {content.steps.map((step) => (
                  <div
                    key={step.number}
                    className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
                      step.isActive
                        ? 'bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg'
                        : 'bg-white/5 backdrop-blur-sm border border-white/10'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                        step.isActive
                          ? 'bg-white text-emerald-600'
                          : 'bg-white/20 text-white border border-white/20'
                      }`}
                    >
                      {step.number}
                    </div>
                    <span
                      className={`font-medium ${step.isActive ? 'text-white' : 'text-emerald-100'}`}
                    >
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Form Content */}
        <div className="w-1/2 bg-slate-900 flex flex-col">
          <div className="flex-1 flex flex-col justify-center p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
              <p className="text-slate-400">{subtitle}</p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button className="w-full flex items-center justify-center space-x-3 bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-lg transition-colors border border-slate-700 hover:border-slate-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-400">Or</span>
              </div>
            </div>

            {/* Form Content */}
            <div className="space-y-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
