import { Sparkles, BookOpen, TrendingUp, Heart } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export default function App() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-coral-500" />
          <h1 className="text-2xl font-semibold text-gray-800">Quirkie</h1>
        </div>
        <div className="text-sm text-gray-600">
          mintharuck@gmail.com
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back! Ready to learn something new?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Your learning journey continues. Stay consistent, stay curious! 🌟
          </p>

          <Button 
            size="lg" 
            className="bg-gradient-to-r from-orange-400 via-pink-400 to-rose-400 hover:from-orange-500 hover:via-pink-500 hover:to-rose-500 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Go to Dashboard →
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Interactive Flashcards</h3>
            <p className="text-sm text-gray-600">Master concepts with smart flashcards</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow border border-pink-100">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-sm text-gray-600">Stay motivated with visual insights</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow border border-purple-100">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Personalized Learning</h3>
            <p className="text-sm text-gray-600">Study tools adapted to your pace</p>
          </div>
        </div>

        {/* Quick Start Cards */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-orange-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Quick Start
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <motion.button
              animate={{ y: [0, -8, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                repeatDelay: 0.5
              }}
              onClick={() => toggleCard(0)}
              className="bg-white rounded-2xl p-6 text-center hover:scale-105 transition-transform shadow-sm hover:shadow-md border border-gray-100"
            >
              <div className="text-3xl mb-2">⚛️</div>
              <p className="font-medium text-gray-900 mb-2">What is React?</p>
              <AnimatePresence>
                {expandedCard === 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                      React is a JavaScript library for building user interfaces, particularly single-page applications with reusable components.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            
            <motion.button
              animate={{ y: [0, -8, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                repeatDelay: 0.5,
                delay: 0.2
              }}
              onClick={() => toggleCard(1)}
              className="bg-white rounded-2xl p-6 text-center hover:scale-105 transition-transform shadow-sm hover:shadow-md border border-gray-100"
            >
              <div className="text-3xl mb-2">🧩</div>
              <p className="font-medium text-gray-900 mb-2">What is a component?</p>
              <AnimatePresence>
                {expandedCard === 1 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                      A component is a reusable, self-contained piece of code that returns HTML elements. It's the building block of React apps.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            
            <motion.button
              animate={{ y: [0, -8, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                repeatDelay: 0.5,
                delay: 0.4
              }}
              onClick={() => toggleCard(2)}
              className="bg-white rounded-2xl p-6 text-center hover:scale-105 transition-transform shadow-sm hover:shadow-md border border-gray-100"
            >
              <div className="text-3xl mb-2">📦</div>
              <p className="font-medium text-gray-900 mb-2">What is JSX?</p>
              <AnimatePresence>
                {expandedCard === 2 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                      JSX is a syntax extension for JavaScript that lets you write HTML-like code in your JavaScript files. React transforms it to regular JavaScript.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-500">
        <p>Consistency is key. Let's make today count! 💪</p>
      </footer>
    </div>
  );
}