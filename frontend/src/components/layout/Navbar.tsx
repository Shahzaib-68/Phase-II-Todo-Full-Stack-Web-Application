'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left Side - Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              VIP Todo
            </span>
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Features
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Pricing
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Enterprise
          </Link>
        </nav>

        {/* Right Side - Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}