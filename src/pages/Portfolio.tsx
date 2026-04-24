import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Education from '../components/Education';
import Projects from '../components/Projects';
import Reviews from '../components/Reviews';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Portfolio = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`relative min-h-screen transition-all duration-1000 overflow-x-hidden ${
      isDark 
        ? 'bg-slate-900 text-white' 
        : 'bg-gradient-to-br from-sky-50 via-white to-purple-50 text-gray-900'
    }`}>
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 z-0">
        {isDark ? (
          <>
            {/* Dark Mode Space Background */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-blue-900/5 to-purple-900/5"></div>
            
            {/* Enhanced stars for dark mode */}
            {[...Array(80)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white/30 rounded-full animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`
                }}
              />
            ))}

            {/* Constellation lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="constellation" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
              {[...Array(5)].map((_, i) => (
                <line
                  key={i}
                  x1={`${Math.random() * 100}%`}
                  y1={`${Math.random() * 100}%`}
                  x2={`${Math.random() * 100}%`}
                  y2={`${Math.random() * 100}%`}
                  stroke="url(#constellation)"
                  strokeWidth="1"
                  className="animate-pulse"
                />
              ))}
            </svg>
          </>
        ) : (
          <>
            {/* Light Mode Background */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-indigo-100/30 to-purple-100/30"></div>
            
            {/* Light particles for light mode */}
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-indigo-300/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 8 + 4}px`,
                  height: `${Math.random() * 8 + 4}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 10 + 10}s`
                }}
              />
            ))}

            {/* Light mode constellation */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="light-constellation" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2"/>
                </linearGradient>
              </defs>
              {[...Array(3)].map((_, i) => (
                <line
                  key={i}
                  x1={`${Math.random() * 100}%`}
                  y1={`${Math.random() * 100}%`}
                  x2={`${Math.random() * 100}%`}
                  y2={`${Math.random() * 100}%`}
                  stroke="url(#light-constellation)"
                  strokeWidth="1"
                  className="animate-pulse"
                />
              ))}
            </svg>
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <About />
        <Education />
        <Projects />
        <Reviews />
        <Contact />
        <Footer />
      </div>

      {/* Enhanced Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 ${
            isDark
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-blue-500/25'
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-indigo-500/25'
          }`}
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Portfolio;

