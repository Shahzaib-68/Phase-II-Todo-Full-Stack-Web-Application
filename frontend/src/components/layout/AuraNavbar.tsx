'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function AuraNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-2xl">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left Side - Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <motion.span 
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Aura Task
            </motion.span>
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#" className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors">
            Features
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors">
            Pricing
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors">
            Enterprise
          </Link>
        </nav>

        {/* Right Side - Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-sm font-medium text-gray-300 hover:text-indigo-400">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-sm font-medium">
              Get Aura Pro
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}