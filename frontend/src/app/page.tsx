'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import AuraNavbar from '@/components/layout/AuraNavbar';
import Link from 'next/link';

export default function AuraLandingPage() {
  useEffect(() => {
    // Show welcome toast when page loads
    toast.success('Welcome to Aura Task', {
      description: 'The ultimate workspace for high-performers',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <AuraNavbar />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Work at the Speed of Thought.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Aura Task combines minimalist design with AI-powered precision. The ultimate workspace for high-performers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative inline-block"
          >
            <Link href="/signup">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-lg px-8 py-6 rounded-lg shadow-[0_0_20px_rgba(79,70,229,0.4)]"
              >
                Join the Elite Workspace
              </motion.div>
            </Link>
          </motion.div>

          {/* Floating Dashboard Mockup */}
          <motion.div
            className="mt-16 mx-auto max-w-4xl h-96 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 backdrop-blur-2xl bg-white/5 flex items-center justify-center"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <div className="text-center p-8">
              <div className="inline-block p-4 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Aura Task Dashboard</h3>
              <p className="text-gray-400">AI-Powered Productivity Interface</p>
            </div>
          </motion.div>
        </section>

        {/* Features Bento Grid */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 h-full">
                <div className="text-indigo-400 text-3xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-2">AI Task Assistant</h3>
                <p className="text-gray-400">Intelligent task prioritization and scheduling</p>
              </Card>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 h-full">
                <div className="text-cyan-400 text-3xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">Analytics Dashboard</h3>
                <p className="text-gray-400">Detailed insights into your productivity</p>
              </Card>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 h-full">
                <div className="text-purple-400 text-3xl mb-4">👥</div>
                <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
                <p className="text-gray-400">Real-time collaboration with your team members</p>
              </Card>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 h-full">
                <div className="text-green-400 text-3xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2">Secure Cloud</h3>
                <p className="text-gray-400">Military-grade encryption for your data</p>
              </Card>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 h-full">
                <div className="text-yellow-400 text-3xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-gray-400">Optimized for speed and efficiency</p>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-24">
          <div className="flex justify-center items-center mb-8">
            <h2 className="text-3xl font-bold mr-4">Choose Your Plan</h2>
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">Monthly</span>
              <Switch id="pricing-toggle" />
              <span className="text-gray-400 ml-2">Yearly (Save 20%)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-8 bg-white/5 backdrop-blur-2xl border border-white/10 h-full">
                <h3 className="text-2xl font-bold mb-4">Free</h3>
                <div className="text-4xl font-bold mb-4">$0<span className="text-lg">/mo</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Essential task tracking</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>3 projects</span>
                  </li>
                  <li className="flex items-center text-gray-500">
                    <span className="mr-2">✗</span>
                    <span>AI Dashboard</span>
                  </li>
                  <li className="flex items-center text-gray-500">
                    <span className="mr-2">✗</span>
                    <span>Priority Support</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button variant="outline" className="w-full border-indigo-500 text-indigo-400 hover:bg-indigo-500/10">
                    Get Started
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* Pro Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mt-4"
            >
              <div className="absolute top-[-16px] left-1/2 transform -translate-x-1/2 z-20 bg-gradient-to-r from-indigo-500 to-cyan-500 text-xs font-bold px-4 py-1 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]">
                POPULAR
              </div>
              <Card className="p-8 bg-gradient-to-b from-indigo-900/30 to-cyan-900/30 backdrop-blur-2xl border border-indigo-500/30 h-full">
                <h3 className="text-2xl font-bold mb-4">Pro</h3>
                <div className="text-4xl font-bold mb-4">$19<span className="text-lg">/mo</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Unlimited tasks</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>AI Dashboard</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Priority Support</span>
                  </li>
                  <li className="flex items-center text-gray-500">
                    <span className="mr-2">✗</span>
                    <span>Nexus Chat Board</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
                    Get Started
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* Elite Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-8 bg-white/5 backdrop-blur-2xl border border-white/10 h-full">
                <h3 className="text-2xl font-bold mb-4">Elite (VIP)</h3>
                <div className="text-4xl font-bold mb-4">$49<span className="text-lg">/mo</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>All Pro features</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Nexus Chat Board</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Advanced Automation</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Dedicated Server</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button variant="outline" className="w-full border-cyan-500 text-cyan-400 hover:bg-cyan-500/10">
                    Become Elite
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="mb-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How Aura AI Works</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What makes Aura Task different?</AccordionTrigger>
              <AccordionContent>
                Aura Task combines minimalist design with AI-powered precision. Our intelligent algorithms learn your work patterns and suggest optimal task arrangements, deadlines, and focus periods.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How does the AI prioritize tasks?</AccordionTrigger>
              <AccordionContent>
                Our AI analyzes task urgency, importance, deadlines, and your historical completion patterns to suggest the most effective sequence for maximum productivity.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is my data secure?</AccordionTrigger>
              <AccordionContent>
                Absolutely. We use military-grade encryption for all data transmission and storage. Your data is never shared with third parties.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Trusted By */}
        <section className="py-12">
          <h3 className="text-xl font-bold text-center mb-8 text-gray-400">Trusted by industry leaders</h3>
          <div className="flex justify-center items-center flex-wrap gap-8 max-w-4xl mx-auto">
            {['Company A', 'Company B', 'Company C', 'Company D', 'Company E'].map((company, index) => (
              <div key={index} className="text-2xl opacity-60 hover:opacity-100 transition-opacity">
                {company}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}