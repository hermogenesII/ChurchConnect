"use client";

import { useMobile } from "@/hooks";

const testimonials = [
  {
    quote:
      "Church Connect has transformed how our congregation stays connected. Prayer requests are shared instantly, and our community feels closer than ever.",
    author: "Pastor Sarah Johnson",
    church: "Grace Community Church",
    location: "Austin, TX",
    avatar: "👩‍💼",
  },
  {
    quote:
      "As a busy parent, I love getting event notifications and being able to RSVP quickly. Our family hasn't missed a church event since we started using this platform.",
    author: "Mark Rodriguez",
    church: "New Life Fellowship",
    location: "Denver, CO",
    avatar: "👨‍👩‍👧‍👦",
  },
  {
    quote:
      "The prayer support feature has been a blessing during difficult times. Our church family can now support each other 24/7, not just on Sundays.",
    author: "Elder Margaret Thompson",
    church: "First Baptist Church",
    location: "Birmingham, AL",
    avatar: "👵",
  },
  {
    quote:
      "Managing our church communications used to take hours. Now everything is automated and our members are more engaged than ever before.",
    author: "Administrator Janet Kim",
    church: "Hillside Methodist Church",
    location: "Portland, OR",
    avatar: "👩‍💻",
  },
  {
    quote:
      "Our youth group loves the mobile app! They can access sermons, join events, and stay connected with their faith community throughout the week.",
    author: "Youth Pastor David Chen",
    church: "Crossroads Assembly",
    location: "Phoenix, AZ",
    avatar: "👨‍🏫",
  },
  {
    quote:
      "Church Connect helped us maintain our strong community bonds even when we couldn't meet in person. It's been absolutely essential for our ministry.",
    author: "Pastor Michael Brown",
    church: "Trinity Episcopal Church",
    location: "Nashville, TN",
    avatar: "⛪",
  },
];

export function Testimonials() {
  const isMobile = useMobile();

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-primary-50 to-spiritual-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            className={`font-display font-bold text-primary-900 ${
              isMobile ? "text-3xl" : "text-4xl lg:text-5xl"
            }`}
          >
            Loved by Church Communities
          </h2>
          <p
            className={`mt-4 text-neutral-700 max-w-2xl mx-auto ${
              isMobile ? "text-base px-4" : "text-lg"
            }`}
          >
            See how Church Connect is strengthening faith communities across the
            country
          </p>
        </div>

        {/* Testimonials grid */}
        <div
          className={`grid gap-8 ${
            isMobile
              ? "grid-cols-1 px-4"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-gentle
                         transition-all duration-300 transform hover:-translate-y-1
                         border border-gray-100"
            >
              {/* Quote */}
              <div className="mb-6">
                <span className="text-4xl text-secondary-400 font-serif leading-none">
                  &quot;
                </span>
                <p className="text-neutral-700 leading-relaxed mt-2">
                  {testimonial.quote}
                </p>
                <span className="text-4xl text-secondary-400 font-serif leading-none float-right">
                  &quot;
                </span>
              </div>

              {/* Author info */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                <div
                  className="w-12 h-12 bg-gradient-to-br from-primary-100 to-spiritual-100
                              rounded-full flex items-center justify-center text-2xl"
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-primary-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {testimonial.church}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="mt-16 text-center">
          <div
            className={`grid gap-8 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}
          >
            <div>
              <div className="text-3xl font-bold text-primary-600">500+</div>
              <div className="text-sm text-neutral-600">Churches</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-600">50k+</div>
              <div className="text-sm text-neutral-600">Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-spiritual-600">98%</div>
              <div className="text-sm text-neutral-600">Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-600">24/7</div>
              <div className="text-sm text-neutral-600">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
