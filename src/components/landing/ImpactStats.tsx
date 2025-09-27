"use client";

import { useMobile } from "@/hooks";

const stats = [
  {
    number: "2.5M+",
    label: "Prayer Requests Shared",
    description: "Connecting hearts in times of need",
    icon: "🙏",
    color: "spiritual",
  },
  {
    number: "180k+",
    label: "Events Organized",
    description: "Building stronger communities together",
    icon: "📅",
    color: "primary",
  },
  {
    number: "95%",
    label: "Member Engagement",
    description: "Active participation in church life",
    icon: "🤝",
    color: "accent",
  },
  {
    number: "500+",
    label: "Churches Served",
    description: "Denominations across all 50 states",
    icon: "⛪",
    color: "secondary",
  },
];

const achievements = [
  {
    title: "Faith-First Design",
    description:
      "Built specifically for Christian communities with respect for traditional values and modern needs",
  },
  {
    title: "Secure & Private",
    description:
      "Enterprise-level security protecting your congregation's personal information and prayer requests",
  },
  {
    title: "Mobile-Optimized",
    description:
      "Designed for how people actually connect - on their phones, wherever they are",
  },
  {
    title: "Proven Results",
    description:
      "Churches report 40% increase in member engagement within the first 3 months",
  },
];

type ColorType = (typeof stats)[0]["color"];

const getGradientClasses = (color: ColorType) => {
  const gradientMap: Record<ColorType, string> = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-500 to-secondary-600",
    spiritual: "from-spiritual-500 to-spiritual-600",
    accent: "from-accent-500 to-accent-600",
  };
  return gradientMap[color];
};

export function ImpactStats() {
  const isMobile = useMobile();

  return (
    <section className="py-16 sm:py-24 bg-neutral-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            className={`font-display font-bold text-white ${
              isMobile ? "text-3xl" : "text-4xl lg:text-5xl"
            }`}
          >
            Making a Real Impact
          </h2>
          <p
            className={`mt-4 text-gray-300 max-w-2xl mx-auto ${
              isMobile ? "text-base px-4" : "text-lg"
            }`}
          >
            Every day, Church Connect helps strengthen faith communities across
            America
          </p>
        </div>

        {/* Stats grid */}
        <div
          className={`grid gap-8 mb-20 ${
            isMobile ? "grid-cols-1 px-4" : "grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              {/* Icon with gradient background */}
              <div
                className={`
                inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4
                bg-gradient-to-br ${getGradientClasses(stat.color)}
                transform group-hover:scale-110 transition-transform duration-200
              `}
              >
                <span className="text-3xl" role="img" aria-label={stat.label}>
                  {stat.icon}
                </span>
              </div>

              {/* Number */}
              <div
                className={`font-bold text-white mb-2 ${
                  isMobile ? "text-3xl" : "text-4xl lg:text-5xl"
                }`}
              >
                {stat.number}
              </div>

              {/* Label */}
              <div className="text-gray-200 font-semibold mb-1">
                {stat.label}
              </div>

              {/* Description */}
              <div className="text-sm text-gray-400">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Achievements section */}
        <div className="border-t border-gray-700 pt-16">
          <div className="text-center mb-12">
            <h3
              className={`font-display font-bold text-white ${
                isMobile ? "text-2xl" : "text-3xl lg:text-4xl"
              }`}
            >
              Why Churches Choose Us
            </h3>
          </div>

          <div
            className={`grid gap-8 ${
              isMobile ? "grid-cols-1 px-4" : "grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-white/5 border border-white/10
                           hover:bg-white/10 transition-all duration-300"
              >
                <h4 className="text-lg font-semibold text-white mb-3">
                  {achievement.title}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center space-y-4">
            <p className="text-gray-300">
              Join thousands of church leaders who trust Church Connect
            </p>
            <button
              className={`
              bg-gradient-to-r from-secondary-500 to-secondary-600
              hover:from-secondary-600 hover:to-secondary-700
              text-black font-bold rounded-2xl shadow-lg hover:shadow-xl
              transition-all duration-200 transform hover:scale-105
              ${isMobile ? "w-full max-w-sm py-4 px-8" : "py-3 px-8"}
            `}
            >
              Get Started for Free
            </button>
            <p className="text-xs text-gray-400">
              No setup fees • Always free for churches
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
