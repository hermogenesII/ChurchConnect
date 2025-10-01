'use client'

import { useMobile } from '@/hooks'

const footerLinks = {
  product: {
    title: 'Product',
    links: [
      { name: 'Features', href: '#features' },
      { name: 'Demo', href: '/demo' },
      { name: 'Security', href: '/security' },
      { name: 'Mobile App', href: '/mobile' },
      { name: 'API', href: '/api' }
    ]
  },
  resources: {
    title: 'Resources',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Church Setup Guide', href: '/setup' },
      { name: 'Best Practices', href: '/best-practices' },
      { name: 'Webinars', href: '/webinars' },
      { name: 'Blog', href: '/blog' }
    ]
  },
  company: {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Register Your Church', href: '/apply-church', highlight: true },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Partners', href: '/partners' },
      { name: 'Contact', href: '/contact' }
    ]
  },
  support: {
    title: 'Support',
    links: [
      { name: 'Customer Support', href: '/support' },
      { name: 'Community Forum', href: '/community' },
      { name: 'System Status', href: '/status' },
      { name: 'Report Issue', href: '/report' },
      { name: 'Feature Requests', href: '/requests' }
    ]
  }
}

const socialLinks = [
  { name: 'Facebook', href: '#', icon: '📘' },
  { name: 'Twitter', href: '#', icon: '🐦' },
  { name: 'LinkedIn', href: '#', icon: '💼' },
  { name: 'YouTube', href: '#', icon: '📺' },
  { name: 'Instagram', href: '#', icon: '📷' }
]

const certifications = [
  { name: 'SOC 2 Compliant', icon: '🔒' },
  { name: 'GDPR Ready', icon: '🇪🇺' },
  { name: '99.9% Uptime', icon: '⚡' },
  { name: 'SSL Secured', icon: '🛡️' }
]

export function Footer() {
  const isMobile = useMobile()

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`grid gap-8 ${
          isMobile
            ? 'grid-cols-1'
            : 'grid-cols-2 lg:grid-cols-6'
        }`}>

          {/* Brand section */}
          <div className={isMobile ? 'col-span-1' : 'col-span-2'}>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-spiritual-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">⛪</span>
              </div>
              <span className="text-xl font-bold text-white">Church Connect</span>
            </div>

            <p className="text-gray-300 mb-6 max-w-md">
              Strengthening church communities through technology. Connect, grow, and
              thrive together in faith with tools designed specifically for churches.
            </p>

            {/* Contact info */}
            <div className="space-y-2 text-sm text-gray-400 mb-6">
              <div className="flex items-center space-x-2">
                <span>📧</span>
                <span>support@churchconnect.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span>1-800-CHURCH-1</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🏢</span>
                <span>Austin, TX • Serving churches nationwide</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center
                           hover:bg-primary-600 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links sections */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link: { name: string; href: string; highlight?: boolean }) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`text-sm transition-colors duration-200 ${
                        link.highlight
                          ? 'text-primary-400 hover:text-primary-300 font-semibold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="text-center mb-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-4">
              Trusted & Secure
            </h4>
            <div className={`flex justify-center space-x-6 ${
              isMobile ? 'flex-wrap gap-4' : ''
            }`}>
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="flex items-center space-x-2 text-gray-400"
                >
                  <span className="text-lg">{cert.icon}</span>
                  <span className="text-xs">{cert.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`flex justify-between items-center ${
            isMobile ? 'flex-col space-y-4 text-center' : ''
          }`}>
            <div className="text-sm text-gray-400">
              © 2024 Church Connect. All rights reserved.
            </div>

            <div className={`flex space-x-6 text-sm ${
              isMobile ? 'flex-wrap justify-center gap-4' : ''
            }`}>
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-200">
                Cookie Policy
              </a>
              <a href="/accessibility" className="text-gray-400 hover:text-white transition-colors duration-200">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}