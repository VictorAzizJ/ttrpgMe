'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

export default function GlobalNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/play', label: 'Play', highlight: true },
    { href: '/characters', label: 'Characters' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/library', label: 'Library' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user?.username) return '?';
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="text-3xl group-hover:scale-110 transition-transform">
                🎲
              </div>
              <span className="text-xl font-bold text-amber-100 hidden sm:block">
                TTRPGMe
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  link.highlight
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/50'
                    : isActive(link.href)
                    ? 'bg-gray-800 text-amber-400'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Auth */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/auth/login"
                  className="hidden sm:block text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-amber-400 rounded-lg border border-amber-500/50 transition-all"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative">
                {/* Avatar Button */}
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                    {getInitials()}
                  </div>
                  {/* Online indicator */}
                  <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 absolute bottom-0 right-0"></div>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    ></div>

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-20">
                      {/* User Info */}
                      {user && (
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="text-white font-medium">@{user.username}</p>
                          <p className="text-sm text-gray-400">
                            Level {user.level} Game Master
                          </p>
                        </div>
                      )}

                      {/* Menu Items */}
                      {user && (
                        <Link
                          href={`/profile/${user.username}`}
                          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <span className="mr-3">👤</span>
                          My Profile
                        </Link>
                      )}

                      <Link
                        href="/characters"
                        className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span className="mr-3">🎭</span>
                        My Characters
                      </Link>

                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span className="mr-3">🎮</span>
                        Dashboard
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span className="mr-3">⚙️</span>
                        Settings
                      </Link>

                      <div className="border-t border-gray-700 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                        >
                          <span className="mr-3">🚪</span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {showMobileMenu ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-lg font-medium transition-all ${
                  link.highlight
                    ? 'bg-amber-600 text-white'
                    : isActive(link.href)
                    ? 'bg-gray-800 text-amber-400'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                {link.label}
              </Link>
            ))}

            {!isLoggedIn && (
              <>
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-3 py-2 rounded-lg bg-gray-800 text-amber-400 border border-amber-500/50 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
