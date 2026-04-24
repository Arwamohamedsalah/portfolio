import React, { useEffect, useRef, useState } from 'react';
import { Quote, Briefcase, Users, Github, Star, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

interface Review {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: string;
  featured: boolean;
  order: number;
}

const Reviews = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { isDark } = useTheme();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

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

  const fetchReviews = async () => {
    try {
      const response = await api.get('/sections/reviews');
      setReviews(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reviews" ref={sectionRef} className="py-20 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float ${
              isDark ? 'bg-white/5' : 'bg-indigo-300/10'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 8 + 6}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDark 
              ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
          }`}>
            Client Reviews
          </h2>
          <div className={`w-24 h-1 mx-auto rounded-full ${
            isDark 
              ? 'bg-gradient-to-r from-blue-400 to-purple-400'
              : 'bg-gradient-to-r from-indigo-500 to-purple-500'
          }`}></div>
          <p className={`mt-6 text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            What my clients say about working with me across different platforms
          </p>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No reviews available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => {
              return (
                <div
                  key={review._id}
                  className={`animate-on-scroll backdrop-blur-sm rounded-xl border p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group ${
                    isDark 
                      ? 'bg-slate-800/30 border-slate-700/50 hover:border-blue-400/50 hover:shadow-blue-500/10'
                      : 'bg-white/70 border-gray-200/50 hover:border-indigo-400/50 hover:shadow-indigo-500/10'
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className={`w-8 h-8 ${
                      isDark ? 'text-blue-400' : 'text-indigo-500'
                    } opacity-50`} />
                  </div>

                  {/* Review Text */}
                  <p className={`mb-6 leading-relaxed text-right ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    "{review.content}"
                  </p>

                  {/* Client Info */}
                  <div className="flex items-center gap-3 mb-3">
                    {review.avatar ? (
                      <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full" />
                    ) : (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-slate-700' : 'bg-gray-200'
                      }`}>
                        <User className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{review.name}</h4>
                      {review.role && (
                        <p className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>{review.role}</p>
                      )}
                      {review.company && (
                        <p className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>{review.company}</p>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : isDark ? 'text-gray-600' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Featured Badge */}
                  {review.featured && (
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      Featured
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 animate-on-scroll">
          <p className={`mb-6 text-lg ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Ready to work together?
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('contact');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`group text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
              isDark 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
            }`}
          >
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;