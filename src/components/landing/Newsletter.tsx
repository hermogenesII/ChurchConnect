"use client";

import { useState } from "react";
import { useMobile } from "@/hooks";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSignedUp(true);
    setIsLoading(false);
    setEmail("");
  };

  if (isSignedUp) {
    return (
      <section className="py-16 sm:py-24 bg-gradient-to-r from-primary-600 to-spiritual-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Welcome to the Community!
            </h3>
            <p className="text-white/90">
              Thank you for signing up! You&apos;ll receive updates about new
              features, church success stories, and tips for building stronger
              communities.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-r from-primary-600 to-spiritual-600 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="mb-8">
            <h2
              className={`font-display font-bold text-white mb-4 ${
                isMobile ? "text-2xl" : "text-3xl lg:text-4xl"
              }`}
            >
              Stay Updated with Church Connect
            </h2>
            <p
              className={`text-white/90 max-w-2xl mx-auto ${
                isMobile ? "text-base" : "text-lg"
              }`}
            >
              Get the latest updates about new features, church success stories, and tips for
              building stronger communities. Join 5,000+ church leaders who stay informed.
            </p>
          </div>

          {/* Newsletter benefits */}
          <div
            className={`grid gap-4 mb-8 ${
              isMobile ? "grid-cols-1" : "grid-cols-3"
            }`}
          >
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <span className="text-xl">📬</span>
              <span className="text-sm">Weekly Updates</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <span className="text-xl">💡</span>
              <span className="text-sm">Ministry Tips</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <span className="text-xl">🎯</span>
              <span className="text-sm">Growth Strategies</span>
            </div>
          </div>

          {/* Newsletter form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div
              className={`flex ${
                isMobile ? "flex-col space-y-3" : "space-x-3"
              }`}
            >
              <div className="flex-1">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-xl border-0
                           bg-white/90 text-gray-900 placeholder-gray-500
                           focus:bg-white focus:ring-2 focus:ring-secondary-400
                           focus:outline-none transition-all duration-200"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  bg-secondary-500 hover:bg-secondary-600
                  disabled:bg-secondary-400 disabled:cursor-not-allowed
                  text-black font-semibold rounded-xl
                  transition-all duration-200 transform hover:scale-105
                  disabled:transform-none disabled:hover:scale-100
                  ${
                    isMobile
                      ? "w-full py-3 px-6"
                      : "py-3 px-6 whitespace-nowrap"
                  }
                  ${isLoading ? "opacity-70" : ""}
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Signing up...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>

          {/* Trust indicators */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-4 text-xs text-white/70">
              <div className="flex items-center space-x-1">
                <span>🔒</span>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>📧</span>
                <span>Opt out Anytime</span>
              </div>
            </div>
            <p className="text-xs text-white/60 mt-2">
              We respect your privacy. No spam, ever.
            </p>
          </div>

          {/* Social proof */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="flex items-center justify-center space-x-6 text-white/80">
              <div className="text-center">
                <div className="font-bold text-lg">5,000+</div>
                <div className="text-xs">Users</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">4.9/5</div>
                <div className="text-xs">Rating</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">Weekly</div>
                <div className="text-xs">Updates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
