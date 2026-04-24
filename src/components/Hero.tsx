import { useState, useEffect } from 'react';
import { ChevronDown, Download, Github, Linkedin, Mail } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import arwaPic from '../arwapic.jpeg';
import api from '../services/api';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const { isDark } = useTheme();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await api.get('/upload/resume');
      if (response.data.success) {
        setResumeUrl(`http://localhost:9999${response.data.data.url}`);
      }
    } catch (error) {
      // Resume not found, that's okay
      setResumeUrl(null);
    }
  };

  const handleDownloadResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      alert('Resume not available yet. Please check back later.');
    }
  };

  const titles = ['MERN stack developer', 'UI/UX Developer', 'Fullstack Developer', 'React Developer'];

  useEffect(() => {
    const handleTyping = () => {
      const current = loopNum % titles.length;
      const fullText = titles[current];

      setDisplayText(prev => 
        isDeleting 
          ? fullText.substring(0, prev.length - 1)
          : fullText.substring(0, prev.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed, titles]);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Enhanced Space Animation Background */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        isDark 
          ? 'bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900'
          : 'bg-gradient-to-b from-sky-50 via-indigo-50/30 to-purple-50'
      }`}>
        {isDark ? (
          <>
            {/* Dark Mode Space Elements */}
            {/* Stars */}
            {[...Array(150)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`
                }}
              />
            ))}
            
            {/* Shooting Stars */}
            {[...Array(5)].map((_, i) => (
              <div
                key={`shooting-${i}`}
                className="absolute animate-shooting-star"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 50}%`,
                  animationDelay: `${i * 6}s`,
                  animationDuration: '4s'
                }}
              >
                <div className="w-1 h-1 bg-white rounded-full shadow-lg shadow-white/50">
                  <div className="absolute -left-8 -top-0.5 w-8 h-0.5 bg-gradient-to-r from-transparent to-white opacity-80"></div>
                </div>
              </div>
            ))}

            {/* Satellites */}
            {[...Array(3)].map((_, i) => (
              <div
                key={`satellite-${i}`}
                className="absolute animate-satellite"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${20 + i * 20}%`,
                  animationDelay: `${i * 2}s`,
                  animationDuration: `${15 + i * 5}s`
                }}
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50">
                  <div className="absolute -left-1 -top-1 w-4 h-4 border border-blue-400/30 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}

            {/* Planets */}
            <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-sm animate-float-slow">
              <div className="absolute inset-2 border border-blue-400/20 rounded-full animate-spin-slow"></div>
            </div>
            <div className="absolute bottom-32 left-16 w-20 h-20 bg-gradient-to-br from-pink-400/20 to-orange-500/20 rounded-full blur-sm animate-float-reverse">
              <div className="absolute inset-1 border border-pink-400/20 rounded-full animate-spin-reverse"></div>
            </div>
            
            {/* Asteroid Belt */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`asteroid-${i}`}
                className="absolute bg-gray-400/20 rounded-full animate-asteroid"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${Math.random() * 20 + 20}s`
                }}
              />
            ))}
          </>
        ) : (
          <>
            {/* Light Mode Space Elements */}
            {/* Floating Particles */}
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-indigo-300/40 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 6 + 3}px`,
                  height: `${Math.random() * 6 + 3}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 8 + 8}s`
                }}
              />
            ))}

            {/* Light Comets */}
            {[...Array(3)].map((_, i) => (
              <div
                key={`comet-${i}`}
                className="absolute animate-comet-light"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 50}%`,
                  animationDelay: `${i * 8}s`,
                  animationDuration: '6s'
                }}
              >
                <div className="w-2 h-2 bg-indigo-400 rounded-full shadow-lg shadow-indigo-400/50">
                  <div className="absolute -left-12 -top-0.5 w-12 h-1 bg-gradient-to-r from-transparent via-indigo-300/60 to-indigo-400 opacity-70"></div>
                </div>
              </div>
            ))}

            {/* Light Mode Decorative Elements */}
            <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-indigo-200/40 to-purple-300/40 rounded-full blur-sm animate-float-slow">
              <div className="absolute inset-4 border border-indigo-300/30 rounded-full animate-spin-slow"></div>
            </div>
            <div className="absolute bottom-32 left-16 w-20 h-20 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-sm animate-float-reverse">
              <div className="absolute inset-2 border border-pink-300/30 rounded-full animate-spin-reverse"></div>
            </div>

            {/* Light Satellites */}
            {[...Array(2)].map((_, i) => (
              <div
                key={`light-satellite-${i}`}
                className="absolute animate-satellite"
                style={{
                  left: `${30 + i * 40}%`,
                  top: `${30 + i * 30}%`,
                  animationDelay: `${i * 3}s`,
                  animationDuration: `${20 + i * 5}s`
                }}
              >
                <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50">
                  <div className="absolute -left-1 -top-1 w-4 h-4 border border-indigo-400/40 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </>
        )}
        
        {/* Enhanced Nebula Effect */}
        <div className={`absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl animate-pulse-slow ${
          isDark 
            ? 'bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10'
            : 'bg-gradient-to-r from-indigo-200/30 via-purple-200/30 to-pink-200/30'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse-slow delay-1000 ${
          isDark 
            ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10'
            : 'bg-gradient-to-r from-blue-200/30 via-purple-200/30 to-indigo-200/30'
        }`}></div>
      </div>

      <div className="container mx-auto text-center relative z-10 pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Name and Title */}
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 animate-fadeInUp transition-all duration-500 ${
            isDark 
              ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'
          }`}>
            Arwa MohamedSalah
          </h1>
          
          <div className={`text-2xl md:text-3xl mb-8 h-12 transition-all duration-500 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <span className={`border-r-2 animate-blink ${
              isDark ? 'border-blue-400' : 'border-indigo-500'
            }`}>
              {displayText}
            </span>
          </div>

          <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed animate-fadeInUp delay-300 transition-all duration-500 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Passionate about creating innovative web and mobile applications with modern technologies. 
            Building digital experiences that make a difference across the universe of code.
          </p>
          
          {/* Role Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fadeInUp delay-400">
            <div className={`px-6 py-3 rounded-full backdrop-blur-sm border transition-all duration-300 transform hover:scale-105 ${
              isDark
                ? 'bg-blue-600/20 border-blue-400/50 text-blue-300 hover:bg-blue-600/30'
                : 'bg-indigo-100/80 border-indigo-300/50 text-indigo-700 hover:bg-indigo-200/80'
            }`}>
              <span className="font-semibold">MERN stack developer</span>
            </div>
            <div className={`px-6 py-3 rounded-full backdrop-blur-sm border transition-all duration-300 transform hover:scale-105 ${
              isDark
                ? 'bg-purple-600/20 border-purple-400/50 text-purple-300 hover:bg-purple-600/30'
                : 'bg-purple-100/80 border-purple-300/50 text-purple-700 hover:bg-purple-200/80'
            }`}>
              <span className="font-semibold">UI/UX Developer</span>
            </div>
          </div>

          {/* Enhanced Profile Image */}
          <div className="mb-12 relative group animate-fadeInUp delay-500">
            <div className="w-72 h-72 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden relative">
              {/* Multiple Orbital Rings */}
              <div className={`absolute inset-0 rounded-full border-2 animate-spin-slow ${
                isDark ? 'border-blue-400/30' : 'border-indigo-500/40'
              }`}></div>
              <div className={`absolute inset-2 rounded-full border animate-spin-reverse ${
                isDark ? 'border-purple-400/20' : 'border-purple-500/30'
              }`}></div>
              <div className={`absolute inset-4 rounded-full border animate-spin-slow ${
                isDark ? 'border-pink-400/15' : 'border-pink-500/25'
              }`} style={{ animationDuration: '25s' }}></div>
              
              {/* Image Container */}
              <div className={`absolute inset-6 rounded-full overflow-hidden border-4 shadow-2xl transform group-hover:scale-105 transition-all duration-500 ${
                isDark 
                  ? 'border-blue-400/50 shadow-blue-500/30' 
                  : 'border-indigo-500/60 shadow-indigo-500/40'
              }`}>
                <img
                  src={arwaPic}
                  alt="Arwa MohamedSalah - MERN stack developer & UI/UX Developer"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 20%' }}
                />
                <div className={`absolute inset-0 transition-all duration-500 ${
                  isDark 
                    ? 'bg-gradient-to-t from-slate-900/10 to-transparent'
                    : 'bg-gradient-to-t from-white/5 to-transparent'
                }`}></div>
              </div>
              
              {/* Enhanced Floating Particles around image */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full animate-orbit ${
                    isDark ? 'bg-blue-400' : 'bg-indigo-500'
                  }`}
                  style={{
                    animationDelay: `${i * 0.4}s`,
                    animationDuration: '6s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fadeInUp delay-700">
            <button 
              onClick={handleDownloadResume}
              className={`group px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2 ${
                isDark
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-blue-500/25'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white hover:shadow-indigo-500/30'
              }`}
            >
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              Download Resume
            </button>
            <button 
              onClick={scrollToAbout}
              className={`group border-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                isDark
                  ? 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white hover:shadow-lg hover:shadow-blue-400/25'
                  : 'border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white hover:shadow-lg hover:shadow-indigo-500/25'
              }`}
            >
              Explore My Universe
            </button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-12 animate-fadeInUp delay-900">
            {[
              { icon: Github, href: '#', label: 'GitHub' },
              { icon: Linkedin, href: '#', label: 'LinkedIn' },
              { icon: Mail, href: '#contact', label: 'Email' }
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                className={`p-4 backdrop-blur-sm rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg border ${
                  isDark
                    ? 'bg-slate-800/30 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:shadow-blue-500/25 border-slate-700/50 hover:border-blue-400/50'
                    : 'bg-white/50 text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/25 border-gray-200/50 hover:border-indigo-500/50'
                }`}
                aria-label={label}
              >
                <Icon className="w-6 h-6" />
              </a>
            ))}
          </div>

          {/* Scroll Indicator */}
          <button 
            onClick={scrollToAbout}
            className={`animate-bounce transition-colors duration-300 ${
              isDark 
                ? 'text-gray-400 hover:text-blue-400' 
                : 'text-gray-600 hover:text-indigo-500'
            }`}
          >
            <ChevronDown className="w-8 h-8 mx-auto" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;