'use client'

import { useMobile } from '@/hooks'

const features = [
  {
    title: 'Stay Connected',
    description: 'Never miss important church announcements, events, and community updates.',
    icon: '🤝',
    color: 'primary'
  },
  {
    title: 'Join Events',
    description: 'RSVP to services, bible studies, community gatherings, and special events.',
    icon: '📅',
    color: 'secondary'
  },
  {
    title: 'Prayer Support',
    description: 'Share prayer requests and support your church family in times of need.',
    icon: '🙏',
    color: 'spiritual'
  },
  {
    title: 'Community Directory',
    description: 'Connect with fellow members and build lasting relationships.',
    icon: '👥',
    color: 'accent'
  },
  {
    title: 'Sermons & Resources',
    description: 'Access past sermons, study materials, and spiritual growth resources.',
    icon: '📖',
    color: 'primary'
  },
  {
    title: 'Secure & Private',
    description: 'Your church community data is protected with enterprise-level security.',
    icon: '🔒',
    color: 'neutral'
  }
] as const

type ColorType = typeof features[0]['color']

const getColorClasses = (color: ColorType) => {
  const colorMap = {
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    secondary: 'bg-secondary-50 text-secondary-700 border-secondary-200',
    spiritual: 'bg-spiritual-50 text-spiritual-700 border-spiritual-200',
    accent: 'bg-accent-50 text-accent-700 border-accent-200',
    neutral: 'bg-neutral-50 text-neutral-700 border-neutral-200'
  }
  return colorMap[color]
}

export function Features() {
  const isMobile = useMobile()

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className={`font-display font-bold text-primary-900 ${
            isMobile ? 'text-3xl' : 'text-4xl lg:text-5xl'
          }`}>
            Everything Your Church Needs
          </h2>
          <p className={`mt-4 text-neutral-700 max-w-2xl mx-auto ${
            isMobile ? 'text-base px-4' : 'text-lg'
          }`}>
            Strengthen your church community with tools designed for connection, 
            growth, and spiritual fellowship.
          </p>
        </div>

        {/* Features grid */}
        <div className={`grid gap-8 ${
          isMobile 
            ? 'grid-cols-1 px-4' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 bg-white rounded-2xl border-2 border-gray-100 
                         hover:border-primary-200 hover:shadow-gentle transition-all duration-300
                         transform hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`
                inline-flex items-center justify-center w-12 h-12 rounded-xl border-2 mb-4
                ${getColorClasses(feature.color)}
                group-hover:scale-110 transition-transform duration-200
              `}>
                <span className="text-2xl" role="img" aria-label={feature.title}>
                  {feature.icon}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-primary-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-neutral-700 mb-6">
            Ready to strengthen your church community?
          </p>
          <button className={`
            bg-primary-600 hover:bg-primary-700 
            text-white font-semibold
            rounded-2xl shadow-soft hover:shadow-gentle
            transition-all duration-200 transform hover:scale-105
            ${isMobile ? 'w-full max-w-sm py-4 px-8' : 'py-3 px-8'}
          `}>
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  )
}