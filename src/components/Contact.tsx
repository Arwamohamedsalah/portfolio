import React, { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, Send, Github, Linkedin, Mail as MailIcon, Briefcase, Users, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { API_BASE_URL } from '../services/api';

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    
    try {
      const backendBase = API_BASE_URL.replace(/\/api$/, '');
      const response = await fetch(`${backendBase}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          phone: formData.phone || undefined,
          company: formData.company || undefined
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Thank you for your message! I\'ll get back to you soon.'
        });
        // Reset form
        setFormData({ 
          name: '', 
          email: '', 
          subject: '', 
          message: '', 
          phone: '', 
          company: '' 
        });
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again or contact me directly via email.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'arwamohamedsalah05@gmail.com',
      href: 'mailto:arwamohamedsalah05@gmail.com',
      color: 'blue'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Cairo, Egypt',
      href: '#',
      color: 'purple'
    }
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/Arwamohamedsalah', label: 'GitHub', color: 'gray' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/arwamsalah/', label: 'LinkedIn', color: 'blue' },
    { icon: MailIcon, href: 'mailto:arwamohamedsalah05@gmail.com', label: 'Email', color: 'red' },
    { icon: Briefcase, href: 'https://khamsat.com/user/arwa_mohamedsalah', label: 'Khamsat (خمسات)', color: 'orange' },
    { icon: Users, href: 'https://mostaql.com/u/ArwaMsalah', label: 'Mostaql (مستقل)', color: 'teal' },
    { icon: ExternalLink, href: 'https://www.upwork.com/freelancers/~01c54a24ae01f8eb7e?mp_source=share', label: 'Upwork', color: 'green' }
  ];

  return (
    <section id="contact" ref={sectionRef} className={`py-20 px-6 relative ${
      isDark ? 'bg-slate-800/20' : 'bg-gray-50/50'
    }`}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDark 
              ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
          }`}>
            Get In Touch
          </h2>
          <div className={`w-24 h-1 mx-auto rounded-full ${
            isDark 
              ? 'bg-gradient-to-r from-blue-400 to-purple-400'
              : 'bg-gradient-to-r from-indigo-500 to-purple-500'
          }`}></div>
          <p className={`mt-6 text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Ready to turn your ideas into reality? Let's discuss your next project and create something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 animate-on-scroll">
            <div>
              <h3 className={`text-2xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Let's Connect</h3>
              <p className={`mb-8 leading-relaxed ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                I'm always excited to hear about new opportunities and interesting projects. 
                Whether you have a question, want to collaborate, or just want to say hello, 
                feel free to reach out!
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <a
                    key={index}
                    href={info.href}
                    className={`flex items-center gap-4 p-4 backdrop-blur-sm rounded-lg border transition-all duration-300 transform hover:scale-105 group ${
                      isDark 
                        ? 'bg-slate-800/30 border-slate-700/50 hover:border-blue-400/50'
                        : 'bg-white/70 border-gray-200/50 hover:border-indigo-400/50'
                    }`}
                  >
                    <div className={`p-3 rounded-lg transition-colors duration-300 ${
                      info.color === 'blue' 
                        ? isDark 
                          ? 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30'
                          : 'bg-indigo-100/70 text-indigo-600 group-hover:bg-indigo-200/70'
                        : info.color === 'green'
                        ? 'bg-green-500/20 text-green-400 group-hover:bg-green-500/30'
                        : isDark 
                          ? 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30'
                          : 'bg-purple-100/70 text-purple-600 group-hover:bg-purple-200/70'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{info.title}</h4>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{info.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Social Links */}
            <div>
              <h4 className={`font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Follow Me</h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className={`p-3 backdrop-blur-sm rounded-lg transition-all duration-300 transform hover:scale-110 ${
                        isDark 
                          ? 'bg-slate-800/50 text-gray-400 hover:text-white'
                          : 'bg-white/70 text-gray-600 hover:text-gray-900'
                      } ${
                        social.color === 'blue' 
                          ? isDark 
                            ? 'hover:bg-blue-500/20'
                            : 'hover:bg-indigo-100/70'
                          : social.color === 'red'
                          ? 'hover:bg-red-500/20'
                          : social.color === 'orange'
                          ? 'hover:bg-orange-500/20'
                          : social.color === 'teal'
                          ? 'hover:bg-teal-500/20'
                          : social.color === 'green'
                          ? 'hover:bg-green-500/20'
                          : 'hover:bg-gray-500/20'
                      }`}
                      aria-label={social.label}
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-on-scroll">
            {/* Status Message */}
            {submitStatus.type && (
              <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
                submitStatus.type === 'success'
                  ? isDark
                    ? 'bg-green-500/20 border-green-400/50 text-green-400'
                    : 'bg-green-100/70 border-green-300/50 text-green-700'
                  : isDark
                    ? 'bg-red-500/20 border-red-400/50 text-red-400'
                    : 'bg-red-100/70 border-red-300/50 text-red-700'
              }`}>
                {submitStatus.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <p className="text-sm">{submitStatus.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className={`block font-medium mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 backdrop-blur-sm border rounded-lg transition-colors duration-300 ${
                      isDark 
                        ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-blue-400'
                        : 'bg-white/70 border-gray-200/50 text-gray-900 placeholder-gray-500 focus:border-indigo-400'
                    } focus:outline-none`}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className={`block font-medium mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 backdrop-blur-sm border rounded-lg transition-colors duration-300 ${
                      isDark 
                        ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-blue-400'
                        : 'bg-white/70 border-gray-200/50 text-gray-900 placeholder-gray-500 focus:border-indigo-400'
                    } focus:outline-none`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className={`block font-medium mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Phone Number <span className={`text-sm ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 backdrop-blur-sm border rounded-lg transition-colors duration-300 ${
                      isDark 
                        ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-blue-400'
                        : 'bg-white/70 border-gray-200/50 text-gray-900 placeholder-gray-500 focus:border-indigo-400'
                    } focus:outline-none`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="company" className={`block font-medium mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Company <span className={`text-sm ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 backdrop-blur-sm border rounded-lg transition-colors duration-300 ${
                      isDark 
                        ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-blue-400'
                        : 'bg-white/70 border-gray-200/50 text-gray-900 placeholder-gray-500 focus:border-indigo-400'
                    } focus:outline-none`}
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className={`block font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 backdrop-blur-sm border rounded-lg transition-colors duration-300 ${
                    isDark 
                      ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-blue-400'
                      : 'bg-white/70 border-gray-200/50 text-gray-900 placeholder-gray-500 focus:border-indigo-400'
                  } focus:outline-none`}
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className={`block font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className={`w-full px-4 py-3 backdrop-blur-sm border rounded-lg transition-colors duration-300 resize-none ${
                    isDark 
                      ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-blue-400'
                      : 'bg-white/70 border-gray-200/50 text-gray-900 placeholder-gray-500 focus:border-indigo-400'
                  } focus:outline-none`}
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full group text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 ${
                  isDark 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;