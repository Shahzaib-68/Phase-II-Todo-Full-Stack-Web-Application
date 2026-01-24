'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export default function CalendarPage() {
  const [tasks] = useState([]);

  return (
    <div>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-3xl font-bold text-white">12</div>
            <div className="text-gray-400 mt-1">Total Tasks</div>
          </Card>
        </motion.div>

        {/* Pending Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-3xl font-bold text-yellow-400">8</div>
            <div className="text-gray-400 mt-1">Pending</div>
          </Card>
        </motion.div>

        {/* Completed Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400">4</div>
            <div className="text-gray-400 mt-1">Completed</div>
          </Card>
        </motion.div>
      </div>

      {/* Calendar Content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Calendar View</h2>
        <div className="text-gray-400">
          Calendar view coming soon. This will show your tasks organized by date.
        </div>
      </motion.div>
    </div>
  );
}