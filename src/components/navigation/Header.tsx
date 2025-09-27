"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks";
import { useMobile } from "@/hooks";

interface NavItem {
  name: string;
  href: string;
  requiresAuth?: boolean;
  adminOnly?: boolean;
  publicOnly?: boolean;
}

const publicNavItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Events", href: "/events" },
  { name: "Sermons", href: "/sermons" },
  { name: "Contact", href: "/contact" },
];

const memberNavItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", requiresAuth: true },
  { name: "Prayer Requests", href: "/prayers", requiresAuth: true },
  { name: "Directory", href: "/directory", requiresAuth: true },
  { name: "My Groups", href: "/groups", requiresAuth: true },
];

const adminNavItems: NavItem[] = [
  { name: "Admin", href: "/admin", adminOnly: true },
  { name: "Manage Content", href: "/admin/content", adminOnly: true },
  { name: "Members", href: "/admin/members", adminOnly: true },
];

export function Header() {
  const { user, profile, loading, signOut, isAdmin } = useAuth();
  const isMobile = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const getVisibleNavItems = () => {
    let items = [...publicNavItems];

    if (user) {
      items = items.concat(memberNavItems);

      if (isAdmin()) {
        items = items.concat(adminNavItems);
      }
    }

    return items;
  };

  const visibleNavItems = getVisibleNavItems();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-spiritual-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">⛪</span>
            </div>
            <span className="text-xl font-bold text-primary-900">
              Church Connect
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-1">
              {visibleNavItems.slice(0, 6).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600
                           hover:bg-primary-50 rounded-lg transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}

              {/* More dropdown for additional items */}
              {visibleNavItems.length > 6 && (
                <div className="relative group">
                  <button
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600
                                   hover:bg-primary-50 rounded-lg transition-colors duration-200 flex items-center"
                  >
                    More
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {visibleNavItems.slice(6).map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Desktop Auth Actions */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-3">
              {loading ? (
                <div className="w-8 h-8 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-spiritual-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary-700">
                        {profile?.name?.charAt(0)?.toUpperCase() ||
                          user.email?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {profile?.name || user.email?.split("@")[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600
                             hover:bg-primary-50 rounded-lg transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600
                             hover:bg-primary-50 rounded-lg transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700
                             rounded-lg transition-colors duration-200"
                  >
                    Join Us
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3">
            <div className="space-y-1">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600
                           hover:bg-primary-50 rounded-lg transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth Actions */}
              <div className="pt-3 border-t border-gray-100 mt-3">
                {loading ? (
                  <div className="flex justify-center py-2">
                    <div className="w-6 h-6 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
                  </div>
                ) : user ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Signed in as {profile?.name || user.email?.split("@")[0]}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600
                               hover:bg-primary-50 rounded-lg transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600
                               hover:bg-primary-50 rounded-lg transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700
                               rounded-lg transition-colors duration-200 mx-3"
                    >
                      Join Us
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
