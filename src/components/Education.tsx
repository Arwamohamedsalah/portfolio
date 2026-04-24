import { useEffect, useRef, useState } from 'react';
import { GraduationCap, Code, Smartphone, Book, Award, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

interface EducationTrack {
  title: string;
  duration: string;
  period: string;
  description: string;
  skills: Array<{ name: string; category: string }>;
}

interface EducationData {
  _id: string;
  institution: string;
  degree: string;
  duration: string;
  description: string;
  tracks: EducationTrack[];
}

const Education = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentSkillPage, setCurrentSkillPage] = useState<{[key: number]: number}>({});
  const { isDark } = useTheme();
  const [education, setEducation] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);

  const SKILLS_PER_PAGE = 8;

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await api.get('/sections/education');
      setEducation(response.data.data || []);
    } catch (error) {
      console.error('Error fetching education:', error);
      setEducation([]);
    } finally {
      setLoading(false);
    }
  };

  // Default tracks if no data from API
  const defaultEducationTracks: EducationTrack[] = [
    {
      title: 'Software Fundamentals Track',
      duration: '4 Months Scholarship',
      period: 'First Track',
      description: 'Comprehensive foundation in software development principles and core programming concepts.',
      skills: [
        { name: 'Programming Fundamentals', category: 'Core' },
        { name: 'Object-Oriented Programming', category: 'Core' },
        { name: 'Data Structures & Algorithms', category: 'Core' },
        { name: 'HTML', category: 'Web' },
        { name: 'CSS', category: 'Web' },
        { name: 'JavaScript', category: 'Programming' },
        { name: 'Database Fundamentals', category: 'Database' },
        { name: 'Software Engineering Principles', category: 'Core' },
        { name: 'Problem Solving & Logic', category: 'Core' },
        { name: 'Version Control (Git)', category: 'Tools' },
        { name: 'Testing Fundamentals', category: 'Quality' },
        { name: 'WordPress', category: 'CMS' },
        { name: 'PHP', category: 'Backend' }
      ]
    },
    {
      title: 'Frontend & Cross-Platform Mobile Application Track',
      duration: '4 Months Scholarship',
      period: 'Advanced Track',
      description: 'Specialized training in modern frontend frameworks, mobile application development, and cross-platform technologies.',
      skills: [
        { name: 'HTML5', category: 'Web' },
        { name: 'CSS3', category: 'Web' },
        { name: 'SASS', category: 'Web' },
        { name: 'Tailwind CSS', category: 'Styling' },
        { name: 'Responsive Web Design (RWD)', category: 'Web' },
        { name: 'UI/UX Design', category: 'Design' },
        { name: 'JavaScript (ECMAScript)', category: 'Programming' },
        { name: 'TypeScript', category: 'Programming' },
        { name: 'OOP using JavaScript', category: 'Programming' },
        { name: 'React.js', category: 'Frontend' },
        { name: 'Next.js', category: 'Frontend' },
        { name: 'Material UI', category: 'UI Library' },
        { name: 'React Native', category: 'Mobile' },
        { name: 'Flutter', category: 'Mobile' },
        { name: 'Node.js', category: 'Backend' },
        { name: 'Express.js', category: 'Backend' },
        { name: 'MongoDB', category: 'Database' },
        { name: 'Progressive Web Apps (PWA)', category: 'Web' },
        { name: 'Web Development Tools & Management', category: 'Tools' },
        { name: 'JavaScript Unit Testing Frameworks', category: 'Quality' },
        { name: 'JavaScript Packaging & Building Tools', category: 'Tools' },
        { name: 'Version Control', category: 'Tools' },
        { name: 'JS Design Patterns', category: 'Architecture' },
        { name: 'Secure Coding', category: 'Security' },
        { name: 'OS Fundamentals Workshop', category: 'Core' },
        { name: 'Network Fundamentals Workshop', category: 'Core' },
        { name: 'JavaScript Fundamentals', category: 'Programming' },
        { name: 'Advanced JavaScript', category: 'Programming' },
        { name: 'Modern JavaScript (ES6+)', category: 'Programming' },
        { name: 'Database Fundamentals', category: 'Database' }
      ]
    }
  ];

  const skillCategories = {
    'Core': { color: 'bg-blue-500', textColor: 'text-blue-600' },
    'Programming': { color: 'bg-yellow-500', textColor: 'text-yellow-600' },
    'Web': { color: 'bg-green-500', textColor: 'text-green-600' },
    'Frontend': { color: 'bg-purple-500', textColor: 'text-purple-600' },
    'Mobile': { color: 'bg-pink-500', textColor: 'text-pink-600' },
    'Database': { color: 'bg-orange-500', textColor: 'text-orange-600' },
    'Design': { color: 'bg-teal-500', textColor: 'text-teal-600' },
    'Tools': { color: 'bg-gray-500', textColor: 'text-gray-600' },
    'Quality': { color: 'bg-red-500', textColor: 'text-red-600' },
    'Backend': { color: 'bg-indigo-500', textColor: 'text-indigo-600' },
    'Architecture': { color: 'bg-cyan-500', textColor: 'text-cyan-600' },
    'Security': { color: 'bg-rose-500', textColor: 'text-rose-600' },
    'Performance': { color: 'bg-emerald-500', textColor: 'text-emerald-600' },
    'CMS': { color: 'bg-violet-500', textColor: 'text-violet-600' },
    'Styling': { color: 'bg-lime-500', textColor: 'text-lime-600' },
    'UI Library': { color: 'bg-sky-500', textColor: 'text-sky-600' }
  };

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

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: isDark ? 'from-blue-500/20 to-blue-600/20' : 'from-blue-100/60 to-blue-200/60',
        border: isDark ? 'border-blue-400/50' : 'border-blue-300/50',
        text: isDark ? 'text-blue-400' : 'text-blue-600',
        accent: isDark ? 'bg-blue-500/20' : 'bg-blue-100'
      },
      purple: {
        bg: isDark ? 'from-purple-500/20 to-purple-600/20' : 'from-purple-100/60 to-purple-200/60',
        border: isDark ? 'border-purple-400/50' : 'border-purple-300/50',
        text: isDark ? 'text-purple-400' : 'text-purple-600',
        accent: isDark ? 'bg-purple-500/20' : 'bg-purple-100'
      }
    };
    return colors[color as keyof typeof colors];
  };

  const handleSkillPageChange = (trackIndex: number, direction: 'next' | 'prev') => {
    setCurrentSkillPage(prev => {
      const currentPage = prev[trackIndex] || 0;
      const maxPage = Math.ceil((educationTracks[trackIndex]?.skills?.length || 0) / SKILLS_PER_PAGE) - 1;
      
      if (direction === 'next' && currentPage < maxPage) {
        return { ...prev, [trackIndex]: currentPage + 1 };
      } else if (direction === 'prev' && currentPage > 0) {
        return { ...prev, [trackIndex]: currentPage - 1 };
      }
      return prev;
    });
  };

  // Get education tracks from API or use default
  const getEducationTracks = (): EducationTrack[] => {
    if (education.length > 0 && education[0].tracks) {
      return education[0].tracks;
    }
    return defaultEducationTracks;
  };

  const educationTracks = getEducationTracks();
  const currentEducation = education.length > 0 ? education[0] : null;

  const getCurrentSkills = (trackIndex: number) => {
    const currentPage = currentSkillPage[trackIndex] || 0;
    const startIndex = currentPage * SKILLS_PER_PAGE;
    const endIndex = startIndex + SKILLS_PER_PAGE;
    return educationTracks[trackIndex]?.skills?.slice(startIndex, endIndex) || [];
  };

  const getTotalPages = (trackIndex: number) => {
    return Math.ceil((educationTracks[trackIndex]?.skills?.length || 0) / SKILLS_PER_PAGE);
  };

  return (
    <section id="education" ref={sectionRef} className="py-20 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float ${
              isDark ? 'bg-white/5' : 'bg-indigo-200/20'
            }`}
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
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16 animate-on-scroll">
          <div className={`inline-flex items-center gap-3 mb-6 p-3 rounded-full ${
            isDark ? 'bg-slate-800/50' : 'bg-white/70'
          } backdrop-blur-sm border ${
            isDark ? 'border-slate-700/50' : 'border-gray-200/50'
          }`}>
            <GraduationCap className={`w-8 h-8 ${
              isDark ? 'text-blue-400' : 'text-indigo-600'
            }`} />
            <span className={`text-lg font-semibold ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>ITI Graduate</span>
          </div>
          
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDark 
              ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
          }`}>
            Education & Training
          </h2>
          <div className={`w-24 h-1 mx-auto rounded-full ${
            isDark 
              ? 'bg-gradient-to-r from-blue-400 to-purple-400'
              : 'bg-gradient-to-r from-indigo-500 to-purple-500'
          }`}></div>
          <p className={`mt-6 text-lg max-w-3xl mx-auto ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Proud graduate of the Information Technology Institute (ITI) with comprehensive training 
            in software development and modern frontend & cross-platform technologies.
          </p>
        </div>

        {/* ITI Institution Card */}
        {currentEducation && (
          <div className="mb-12 animate-on-scroll">
            <div className={`relative p-8 rounded-2xl backdrop-blur-sm border transition-all duration-500 transform hover:scale-[1.02] ${
              isDark 
                ? 'bg-gradient-to-r from-slate-800/60 to-slate-700/60 border-slate-600/50 hover:border-blue-400/50'
                : 'bg-gradient-to-r from-white/80 to-gray-50/80 border-gray-200/50 hover:border-indigo-400/50'
            }`}>
              <div className="flex items-center gap-6 mb-6">
                <div className={`p-4 rounded-xl ${
                  isDark ? 'bg-blue-500/20' : 'bg-indigo-100'
                }`}>
                  <Award className={`w-12 h-12 ${
                    isDark ? 'text-blue-400' : 'text-indigo-600'
                  }`} />
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {currentEducation.institution}
                  </h3>
                  <p className={`text-xl ${
                    isDark ? 'text-blue-400' : 'text-indigo-600'
                  }`}>
                    {currentEducation.degree}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className={`w-5 h-5 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={`${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {currentEducation.duration}
                    </span>
                  </div>
                </div>
              </div>
              {currentEducation.description && (
                <p className={`text-lg leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {currentEducation.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Education Tracks */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading education...</p>
          </div>
        ) : educationTracks.length === 0 ? (
          <div className="text-center py-12">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No education data available yet.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {educationTracks.map((track, index) => {
              const colorClasses = getColorClasses(index === 0 ? 'blue' : 'purple');
              const Icon = index === 0 ? Code : Smartphone;

            return (
              <div
                key={index}
                className={`animate-on-scroll p-8 bg-gradient-to-br ${colorClasses.bg} backdrop-blur-sm rounded-xl border ${colorClasses.border} hover:border-opacity-100 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 rounded-xl ${colorClasses.accent}`}>
                    <Icon className={`w-8 h-8 ${colorClasses.text}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {track.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isDark ? 'bg-slate-700/50 text-gray-300' : 'bg-white/70 text-gray-600'
                      }`}>
                        {track.period}
                      </span>
                    </div>
                    <p className={`font-semibold mb-2 ${colorClasses.text}`}>
                      {track.duration}
                    </p>
                    <p className={`text-sm leading-relaxed ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {track.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      Skills & Technologies Learned:
                    </h4>
                    {track.skills.length > SKILLS_PER_PAGE && (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {(currentSkillPage[index] || 0) + 1} / {getTotalPages(index)}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleSkillPageChange(index, 'prev')}
                            disabled={(currentSkillPage[index] || 0) === 0}
                            className={`p-1 rounded transition-all duration-200 ${
                              (currentSkillPage[index] || 0) === 0
                                ? isDark ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
                                : isDark ? 'text-gray-400 hover:text-white hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
                            }`}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSkillPageChange(index, 'next')}
                            disabled={(currentSkillPage[index] || 0) >= getTotalPages(index) - 1}
                            className={`p-1 rounded transition-all duration-200 ${
                              (currentSkillPage[index] || 0) >= getTotalPages(index) - 1
                                ? isDark ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
                                : isDark ? 'text-gray-400 hover:text-white hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
                            }`}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid gap-3 min-h-[320px]">
                    {getCurrentSkills(index).map((skill, skillIndex) => {
                      const categoryInfo = skillCategories[skill.category as keyof typeof skillCategories];
                      
                      return (
                        <div
                          key={skillIndex}
                          className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                            isDark ? 'bg-slate-800/40 hover:bg-slate-700/50' : 'bg-white/60 hover:bg-white/80'
                          }`}
                          style={{
                            animationDelay: `${index * 200 + skillIndex * 50}ms`
                          }}
                        >
                          <span className={`font-medium ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {skill.name}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            isDark 
                              ? `bg-${skill.category.toLowerCase()}-500/20 ${categoryInfo?.textColor?.replace('600', '400')}`
                              : `bg-${skill.category.toLowerCase()}-100 ${categoryInfo?.textColor}`
                          }`}>
                            {skill.category}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Track Stats */}
                <div className={`mt-6 pt-4 border-t ${
                  isDark ? 'border-slate-700/50' : 'border-gray-200/50'
                }`}>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className={`text-2xl font-bold ${colorClasses.text}`}>
                        {track.skills.length}
                      </div>
                      <div className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Skills Mastered
                      </div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${colorClasses.text}`}>
                        4
                      </div>
                      <div className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Months Training
                      </div>
                    </div>
                  </div>
                  {track.skills.length > SKILLS_PER_PAGE && (
                    <div className={`mt-3 text-center text-xs ${
                      isDark ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      Use arrows above to view all skills
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        )}

        {/* Achievement Summary */}
        <div className="mt-16 animate-on-scroll">
          <div className={`text-center p-8 rounded-2xl backdrop-blur-sm border ${
            isDark 
              ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-slate-600/50'
              : 'bg-gradient-to-r from-indigo-100/60 to-purple-100/60 border-gray-200/50'
          }`}>
            <Book className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? 'text-blue-400' : 'text-indigo-600'
            }`} />
            <h3 className={`text-2xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Comprehensive Technical Foundation
            </h3>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Through ITI's rigorous dual-track program, I gained a solid foundation in software 
              development principles and specialized expertise in modern frontend and cross-platform 
              technologies. This comprehensive education prepared me to tackle complex development 
              challenges and deliver high-quality digital solutions.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-slate-800/30' : 'bg-white/50'
              }`}>
                <div className={`text-3xl font-bold mb-2 ${
                  isDark ? 'text-blue-400' : 'text-indigo-600'
                }`}>
                  8
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Months Intensive Training
                </div>
              </div>
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-slate-800/30' : 'bg-white/50'
              }`}>
                <div className={`text-3xl font-bold mb-2 ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  32+
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Technologies Mastered
                </div>
              </div>
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-slate-800/30' : 'bg-white/50'
              }`}>
                <div className={`text-3xl font-bold mb-2 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>
                  2
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Specialized Tracks
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;