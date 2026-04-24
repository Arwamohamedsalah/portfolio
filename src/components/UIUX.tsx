import React, { useEffect, useRef, useState } from 'react';
import { Palette, Eye, MousePointer, Layout, Smartphone, Monitor, Users, Target, Zap, Heart, CheckCircle, Star, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface UIUXProject {
  title: string;
  description: string;
  image: string;
  tools: string[];
  category: string;
  link?: string;
}

interface UIUXSkill {
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

const UIUX = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentProjectPage, setCurrentProjectPage] = useState(0);
  const [currentSkillPage, setCurrentSkillPage] = useState(0);
  const { isDark } = useTheme();

  const PROJECTS_PER_PAGE = 3;
  const SKILLS_PER_PAGE = 6;

  const uiuxSkills: UIUXSkill[] = [
    {
      name: 'User Research',
      icon: Users,
      description: 'Conducting user interviews, surveys, and usability testing to understand user needs and behaviors.',
      level: 'Advanced'
    },
    {
      name: 'Wireframing',
      icon: Layout,
      description: 'Creating low-fidelity blueprints of user interfaces to plan layout and functionality.',
      level: 'Expert'
    },
    {
      name: 'Prototyping',
      icon: MousePointer,
      description: 'Building interactive mockups to test and validate design concepts before development.',
      level: 'Advanced'
    },
    {
      name: 'Visual Design',
      icon: Palette,
      description: 'Crafting beautiful and consistent visual elements including typography, colors, and icons.',
      level: 'Expert'
    },
    {
      name: 'Interaction Design',
      icon: Zap,
      description: 'Designing meaningful interactions and micro-interactions that enhance user experience.',
      level: 'Advanced'
    },
    {
      name: 'Usability Testing',
      icon: Target,
      description: 'Evaluating designs through user testing to identify and fix usability issues.',
      level: 'Advanced'
    },
    {
      name: 'Responsive Design',
      icon: Smartphone,
      description: 'Creating designs that work seamlessly across all device sizes and screen resolutions.',
      level: 'Expert'
    },
    {
      name: 'Design Systems',
      icon: Monitor,
      description: 'Building scalable design systems with reusable components and consistent guidelines.',
      level: 'Advanced'
    },
    {
      name: 'Accessibility',
      icon: Heart,
      description: 'Ensuring designs are inclusive and accessible to users with diverse abilities.',
      level: 'Intermediate'
    },
    {
      name: 'User Experience Strategy',
      icon: Eye,
      description: 'Developing comprehensive UX strategies that align business goals with user needs.',
      level: 'Advanced'
    }
  ];

  const uiuxProjects: UIUXProject[] = [
    {
      title: 'E-Commerce Mobile App',
      description: 'Complete UI/UX design for a modern e-commerce mobile application with focus on user journey optimization and conversion rate improvement.',
      image: '/api/placeholder/400/300',
      tools: ['Figma', 'Adobe XD', 'Sketch', 'InVision'],
      category: 'Mobile App'
    },
    {
      title: 'Healthcare Dashboard',
      description: 'Intuitive dashboard design for healthcare professionals with complex data visualization and patient management features.',
      image: '/api/placeholder/400/300',
      tools: ['Figma', 'Principle', 'Framer'],
      category: 'Web Dashboard'
    },
    {
      title: 'Social Media Platform',
      description: 'User-centered design for a social networking platform emphasizing community engagement and content discovery.',
      image: '/api/placeholder/400/300',
      tools: ['Sketch', 'InVision', 'Zeplin'],
      category: 'Web Application'
    },
    {
      title: 'Fitness Tracking App',
      description: 'Motivational fitness app design with gamification elements and personalized user experiences.',
      image: '/api/placeholder/400/300',
      tools: ['Figma', 'After Effects', 'Principle'],
      category: 'Mobile App'
    },
    {
      title: 'Banking Interface Redesign',
      description: 'Modern banking application redesign focusing on security, simplicity, and financial literacy.',
      image: '/api/placeholder/400/300',
      tools: ['Adobe XD', 'Sketch', 'InVision'],
      category: 'Mobile App'
    },
    {
      title: 'Learning Management System',
      description: 'Educational platform design optimized for online learning with interactive elements and progress tracking.',
      image: '/api/placeholder/400/300',
      tools: ['Figma', 'Miro', 'Framer'],
      category: 'Web Application'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const getCurrentProjects = () => {
    const startIndex = currentProjectPage * PROJECTS_PER_PAGE;
    return uiuxProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);
  };

  const getCurrentSkills = () => {
    const startIndex = currentSkillPage * SKILLS_PER_PAGE;
    return uiuxSkills.slice(startIndex, startIndex + SKILLS_PER_PAGE);
  };

  const getTotalProjectPages = () => Math.ceil(uiuxProjects.length / PROJECTS_PER_PAGE);
  const getTotalSkillPages = () => Math.ceil(uiuxSkills.length / SKILLS_PER_PAGE);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-blue-500';
      case 'Expert': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section id="uiux" ref={sectionRef} className={`py-16 md:py-20 px-4 md:px-6 relative ${
      isDark ? 'bg-slate-800/20' : 'bg-gray-50/50'
    }`}>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-on-scroll">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 ${
            isDark
              ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
          }`}>
            UI/UX Design Portfolio
          </h2>
          <div className={`w-20 md:w-24 h-1 mx-auto rounded-full mb-4 md:mb-6 ${
            isDark
              ? 'bg-gradient-to-r from-purple-400 to-pink-400'
              : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}></div>
          <p className={`text-base md:text-lg max-w-3xl mx-auto px-4 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Creating intuitive and beautiful user experiences through research-driven design,
            innovative solutions, and attention to every detail that matters to users.
          </p>
        </div>

        {/* Skills Section */}
        <div className="mb-16 md:mb-20 animate-on-scroll">
          <h3 className={`text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Core UI/UX Skills
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {getCurrentSkills().map((skill, index) => {
              const Icon = skill.icon;
              return (
                <div
                  key={index}
                  className={`p-4 md:p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
                    isDark
                      ? 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70'
                      : 'bg-white/80 border border-gray-200/50 hover:bg-white'
                  } shadow-lg hover:shadow-xl`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg mr-4 ${
                      isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        isDark ? 'text-purple-400' : 'text-purple-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-1 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {skill.name}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(skill.level)} text-white`}>
                        {skill.level}
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {skill.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Skills Pagination */}
          {getTotalSkillPages() > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentSkillPage(prev => Math.max(0, prev - 1))}
                disabled={currentSkillPage === 0}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  currentSkillPage === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-purple-500/20 hover:text-purple-400'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {currentSkillPage + 1} of {getTotalSkillPages()}
              </span>

              <button
                onClick={() => setCurrentSkillPage(prev => Math.min(getTotalSkillPages() - 1, prev + 1))}
                disabled={currentSkillPage === getTotalSkillPages() - 1}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  currentSkillPage === getTotalSkillPages() - 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-purple-500/20 hover:text-purple-400'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Projects Section */}
        <div className="animate-on-scroll">
          <h3 className={`text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Featured UI/UX Projects
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            {getCurrentProjects().map((project, index) => (
              <div
                key={index}
                className={`rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? 'bg-slate-800/50 border border-slate-700/50'
                    : 'bg-white/80 border border-gray-200/50'
                } shadow-lg hover:shadow-xl`}
              >
                <div className={`h-48 ${
                  isDark ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20' : 'bg-gradient-to-br from-purple-100 to-pink-100'
                } flex items-center justify-center`}>
                  <div className={`p-4 rounded-lg ${
                    isDark ? 'bg-slate-700/50' : 'bg-gray-100'
                  }`}>
                    <Layout className={`w-12 h-12 ${
                      isDark ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {project.category}
                    </span>
                  </div>

                  <h4 className={`text-xl font-semibold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {project.title}
                  </h4>

                  <p className={`text-sm mb-4 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tools.map((tool, toolIndex) => (
                      <span
                        key={toolIndex}
                        className={`text-xs px-2 py-1 rounded ${
                          isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Projects Pagination */}
          {getTotalProjectPages() > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentProjectPage(prev => Math.max(0, prev - 1))}
                disabled={currentProjectPage === 0}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  currentProjectPage === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-purple-500/20 hover:text-purple-400'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {currentProjectPage + 1} of {getTotalProjectPages()}
              </span>

              <button
                onClick={() => setCurrentProjectPage(prev => Math.min(getTotalProjectPages() - 1, prev + 1))}
                disabled={currentProjectPage === getTotalProjectPages() - 1}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  currentProjectPage === getTotalProjectPages() - 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-purple-500/20 hover:text-purple-400'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UIUX;