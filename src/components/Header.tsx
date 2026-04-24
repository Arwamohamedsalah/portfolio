import React, { useState, useEffect } from 'react';
import { Menu, X, Linkedin, Github, Briefcase, Users, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark } = useTheme();

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Education', id: 'education' },
    { name: 'UI/UX', id: 'uiux' },
    { name: 'Projects', id: 'projects' },
    { name: 'Reviews', id: 'reviews' },
    { name: 'Contact', id: 'contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = navItems.map(item => item.id);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
      isScrolled 
        ? isDark 
          ? 'bg-slate-900/95 backdrop-blur-md shadow-2xl shadow-blue-500/10 border-b border-slate-700/50' 
          : 'bg-white/95 backdrop-blur-md shadow-2xl shadow-indigo-500/10 border-b border-indigo-200/30'
        : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex flex-col items-start">
            <div className={`text-2xl font-bold transition-all duration-300 ${
              isDark 
                ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'
            }`}>
              Arwa
            </div>
            <div className={`text-xs font-medium mt-1 transition-all duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              MohamedSalah
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  activeSection === item.id 
                    ? isDark 
                      ? 'text-blue-400' 
                      : 'text-indigo-600'
                    : isDark 
                      ? 'text-gray-300 hover:text-blue-400' 
                      : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                {item.name}
                {activeSection === item.id && (
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 ${
                    isDark 
                      ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                  }`}></span>
                )}
              </button>
            ))}
            <a
              href="https://github.com/Arwamohamedsalah"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-slate-800/50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/arwamsalah/"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                isDark 
                  ? 'text-gray-400 hover:text-blue-400 hover:bg-slate-800/50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://www.upwork.com/freelancers/~01c54a24ae01f8eb7e?mp_source=share"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                isDark 
                  ? 'text-gray-400 hover:text-green-400 hover:bg-slate-800/50' 
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
              aria-label="Upwork Profile"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-slate-800/50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden mt-4 py-4 rounded-lg transition-all duration-300 ${
            isDark 
              ? 'bg-slate-800/50 backdrop-blur-md border border-slate-700/50' 
              : 'bg-white/80 backdrop-blur-md border border-gray-200/50'
          }`}>
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${
                  activeSection === item.id 
                    ? isDark 
                      ? 'text-blue-400 bg-blue-500/10' 
                      : 'text-indigo-600 bg-indigo-100/50'
                    : isDark 
                      ? 'text-gray-300 hover:text-blue-400 hover:bg-slate-700/30' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100/50'
                }`}
              >
                {item.name}
              </button>
            ))}
            
            {/* Mobile Social Links */}
            <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-300/20">
              <a
                href="https://github.com/Arwamohamedsalah"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
                aria-label="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/arwamsalah/"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                  isDark 
                    ? 'text-gray-400 hover:text-blue-400 hover:bg-slate-700/50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://khamsat.com/user/arwa_mohamedsalah"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                  isDark 
                    ? 'text-gray-400 hover:text-orange-400 hover:bg-slate-700/50'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
                aria-label="Khamsat Profile"
              >
                <Briefcase className="w-5 h-5" />
              </a>
              <a
                href="https://mostaql.com/u/ArwaMsalah"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                  isDark 
                    ? 'text-gray-400 hover:text-teal-400 hover:bg-slate-700/50'
                    : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                }`}
                aria-label="Mostaql Profile"
              >
                <Users className="w-5 h-5" />
              </a>
              <a
                href="https://www.upwork.com/freelancers/~01c54a24ae01f8eb7e?mp_source=share"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                  isDark 
                    ? 'text-gray-400 hover:text-green-400 hover:bg-slate-700/50'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
                aria-label="Upwork Profile"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;