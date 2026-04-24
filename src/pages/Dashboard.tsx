import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import {
  LogOut, Plus, Edit, Trash2, Save, X, FolderKanban, User, GraduationCap,
  MessageSquare, Eye, Globe, Smartphone, Menu, X as XIcon, Star
} from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  type: 'web' | 'mobile' | 'ui/ux';
  github: string;
  live: string;
  featured: boolean;
  order: number;
}

interface AboutImage {
  _id?: string;
  url: string;
  alt: string;
  order: number;
}

interface About {
  _id?: string;
  title: string;
  description: string;
  image: string;
  images?: AboutImage[];
  stats: Array<{ number: string; label: string; icon: string }>;
  personalInfo: {
    location: string;
    availability: string;
    github: string;
    linkedin: string;
    khamsat: string;
    mostaql: string;
  };
}

interface Education {
  _id: string;
  institution: string;
  degree: string;
  duration: string;
  description: string;
  tracks: Array<{
    title: string;
    duration: string;
    period: string;
    description: string;
    skills: Array<{ name: string; category: string }>;
  }>;
}

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

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'about' | 'education' | 'reviews'>('projects');
  
  // Projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectFormData, setProjectFormData] = useState({
    title: '', description: '', image: '', technologies: '', type: 'web' as 'web' | 'mobile' | 'ui/ux',
    github: '', live: '', featured: false, order: 0
  });
  const [selectedProjectImage, setSelectedProjectImage] = useState<File | null>(null);
  const [uploadingProjectImage, setUploadingProjectImage] = useState(false);

  // About
  const [about, setAbout] = useState<About | null>(null);
  const [showAboutForm, setShowAboutForm] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  const [newImageData, setNewImageData] = useState({ url: '', alt: '', order: 0 });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [aboutFormData, setAboutFormData] = useState({
    title: '', description: '', image: '',
    stats: [{ number: '', label: '', icon: '' }],
    personalInfo: { location: '', availability: '', github: '', linkedin: '', khamsat: '', mostaql: '' }
  });

  // Education
  const [education, setEducation] = useState<Education[]>([]);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [educationFormData, setEducationFormData] = useState({
    institution: '', degree: '', duration: '', description: '', tracks: [{
      title: '', duration: '', period: '', description: '', skills: [{ name: '', category: '' }]
    }]
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewFormData, setReviewFormData] = useState({
    name: '', role: '', company: '', content: '', rating: 5, avatar: '', featured: false, order: 0
  });

  // Resume
  const [resume, setResume] = useState<any>(null);
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
    if (activeTab === 'about') {
      fetchResume();
    }
  }, [activeTab]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'projects') await fetchProjects();
      if (activeTab === 'about') await fetchAbout();
      if (activeTab === 'education') await fetchEducation();
      if (activeTab === 'reviews') await fetchReviews();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Projects
  const fetchProjects = async () => {
    const response = await api.get('/projects');
    setProjects(response.data.data);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = projectFormData.image;
      
      // Upload image if a new file is selected
      if (selectedProjectImage) {
        setUploadingProjectImage(true);
        const formData = new FormData();
        formData.append('image', selectedProjectImage);
        const uploadResponse = await api.post('/upload/image', formData);
        imageUrl = `http://localhost:9999${uploadResponse.data.data.url}`;
        setUploadingProjectImage(false);
      }

      const data = {
        ...projectFormData,
        image: imageUrl,
        technologies: projectFormData.technologies ? projectFormData.technologies.split(',').map(t => t.trim()).filter(t => t) : []
      };
      
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, data);
      } else {
        await api.post('/projects', data);
      }
      setShowProjectForm(false);
      setSelectedProjectImage(null);
      setProjectFormData({
        title: '', description: '', image: '', technologies: '', type: 'web',
        github: '', live: '', featured: false, order: 0
      });
      fetchProjects();
    } catch (error: any) {
      setUploadingProjectImage(false);
      alert(error.response?.data?.message || 'Failed to save project');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  // About
  const fetchAbout = async () => {
    const response = await api.get('/sections/about');
    setAbout(response.data.data);
    if (response.data.data) {
      setAboutFormData({
        title: response.data.data.title || '',
        description: response.data.data.description || '',
        image: response.data.data.image || '',
        stats: response.data.data.stats || [{ number: '', label: '', icon: '' }],
        personalInfo: response.data.data.personalInfo || {
          location: '', availability: '', github: '', linkedin: '', khamsat: '', mostaql: ''
        }
      });
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/sections/about', aboutFormData);
      setShowAboutForm(false);
      fetchAbout();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save about section');
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      alert('Please select an image file');
      return;
    }

    setUploadingImage(true);
    try {
      // Upload image first
      const formData = new FormData();
      formData.append('image', selectedImage);

      const uploadResponse = await api.post('/upload/image', formData);

      // Get the uploaded image URL
      const imageUrl = `http://localhost:9999${uploadResponse.data.data.url}`;

      // Add image to about section
      await api.post('/sections/about/images', {
        url: imageUrl,
        alt: newImageData.alt,
        order: newImageData.order
      });

      setShowImageForm(false);
      setNewImageData({ url: '', alt: '', order: 0 });
      setSelectedImage(null);
      fetchAbout();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageId: string, imageUrl?: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      // Delete from about section
      await api.delete(`/sections/about/images/${imageId}`);
      
      // Delete file from server if it's an uploaded file
      if (imageUrl && imageUrl.includes('/uploads/')) {
        const filename = imageUrl.split('/uploads/')[1];
        try {
          await api.delete(`/upload/image/${filename}`);
        } catch (err) {
          console.error('Error deleting file from server:', err);
          // Continue even if file deletion fails
        }
      }
      
      fetchAbout();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete image');
    }
  };

  // Education
  const fetchEducation = async () => {
    const response = await api.get('/sections/education');
    setEducation(response.data.data);
  };

  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEducation) {
        await api.put(`/sections/education/${editingEducation._id}`, educationFormData);
      } else {
        await api.post('/sections/education', educationFormData);
      }
      setShowEducationForm(false);
      fetchEducation();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save education');
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    try {
      await api.delete(`/sections/education/${id}`);
      fetchEducation();
    } catch (error) {
      alert('Failed to delete education');
    }
  };

  // Reviews
  const fetchReviews = async () => {
    const response = await api.get('/sections/reviews');
    setReviews(response.data.data);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await api.put(`/sections/reviews/${editingReview._id}`, reviewFormData);
      } else {
        await api.post('/sections/reviews', reviewFormData);
      }
      setShowReviewForm(false);
      fetchReviews();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save review');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/sections/reviews/${id}`);
      fetchReviews();
    } catch (error) {
      alert('Failed to delete review');
    }
  };

  // Resume
  const fetchResume = async () => {
    try {
      const response = await api.get('/upload/resume');
      setResume(response.data.data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Error fetching resume:', error);
      }
      setResume(null);
    }
  };

  const handleUploadResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResume) {
      alert('Please select a resume file');
      return;
    }

    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append('resume', selectedResume);

      await api.post('/upload/resume', formData);
      setSelectedResume(null);
      fetchResume();
      alert('Resume uploaded successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!confirm('Are you sure you want to delete the resume?')) return;
    try {
      await api.delete('/upload/resume');
      setResume(null);
      alert('Resume deleted successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete resume');
    }
  };

  const tabs = [
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'about', label: 'About', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  ];

  return (
    <div className={`min-h-screen flex transition-all duration-1000 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-gray-900'
    }`}>
      {/* Sidebar */}
      <aside className={`fixed right-0 top-0 h-full z-50 transition-all duration-300 shadow-lg ${
        sidebarOpen ? 'w-64' : 'w-0'
      } ${isDark ? 'bg-slate-800 border-l border-slate-700' : 'bg-white/95 backdrop-blur-sm border-l border-gray-200/50 shadow-xl'}`}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Dashboard</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? isDark
                        ? 'bg-blue-600 text-white'
                        : 'bg-indigo-600 text-white'
                      : isDark
                      ? 'text-gray-300 hover:bg-slate-700'
                      : 'text-slate-700 hover:bg-indigo-50/50 hover:text-indigo-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className={`pt-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100'}`}>
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-indigo-900'}`}>{user?.username}</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-indigo-600'}`}>{user?.email}</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isDark
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-64' : 'mr-0'}`}>
        {/* Header */}
        <header className={`sticky top-0 z-40 border-b backdrop-blur-sm ${
          isDark ? 'bg-slate-800/95 border-slate-700' : 'bg-white/80 border-gray-200/50 shadow-sm'
        }`}>
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700' : 'hover:bg-indigo-50'}`}
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
              <h1 className="text-2xl font-bold">{tabs.find(t => t.id === activeTab)?.label}</h1>
            </div>
            <a
              href="/"
              target="_blank"
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm ${
                isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-indigo-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              View Site
            </a>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Projects Management</h2>
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectFormData({
                      title: '', description: '', image: '', technologies: '', type: 'web',
                      github: '', live: '', featured: false, order: projects.length
                    });
                    setSelectedProjectImage(null);
                    setShowProjectForm(true);
                  }}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    isDark
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  Add Project
                </button>
              </div>

              {showProjectForm && (
                <div className={`mb-6 p-6 rounded-xl border shadow-lg ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200/50 shadow-gray-200/50'
                }`}>
                  <form onSubmit={handleSaveProject} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          Title *
                        </label>
                        <input
                          type="text"
                          value={projectFormData.title}
                          onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                          required
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          Type *
                        </label>
                        <select
                          value={projectFormData.type}
                          onChange={(e) => setProjectFormData({ ...projectFormData, type: e.target.value as 'web' | 'mobile' | 'ui/ux' })}
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        >
                          <option value="web">Web</option>
                          <option value="mobile">Mobile</option>
                          <option value="ui/ux">UI/UX</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        Description *
                      </label>
                      <textarea
                        value={projectFormData.description}
                        onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                        required
                        rows={4}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                          isDark 
                            ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        Project Image *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedProjectImage(file);
                            // Preview image
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setProjectFormData({ ...projectFormData, image: event.target?.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        required={!projectFormData.image && !selectedProjectImage}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                          isDark 
                            ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                        }`}
                      />
                      {selectedProjectImage && (
                        <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Selected: {selectedProjectImage.name} ({(selectedProjectImage.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      )}
                      {projectFormData.image && !selectedProjectImage && (
                        <div className="mt-4">
                          <img
                            src={projectFormData.image}
                            alt="Current project image"
                            className="max-w-xs max-h-48 rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        Technologies (optional)
                      </label>
                      <div className="mb-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Quick Add:</span>
                          {/* Programming Technologies */}
                          <button
                            type="button"
                            onClick={() => {
                              const techs = projectFormData.technologies ? projectFormData.technologies.split(',').map(t => t.trim()) : [];
                              if (!techs.includes('React.js')) {
                                setProjectFormData({ ...projectFormData, technologies: [...techs, 'React.js'].join(', ') });
                              }
                            }}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              isDark 
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' 
                                : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                            }`}
                          >
                            React.js
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const techs = projectFormData.technologies ? projectFormData.technologies.split(',').map(t => t.trim()) : [];
                              if (!techs.includes('Node.js')) {
                                setProjectFormData({ ...projectFormData, technologies: [...techs, 'Node.js'].join(', ') });
                              }
                            }}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              isDark 
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' 
                                : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                            }`}
                          >
                            Node.js
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const techs = projectFormData.technologies ? projectFormData.technologies.split(',').map(t => t.trim()) : [];
                              if (!techs.includes('MongoDB')) {
                                setProjectFormData({ ...projectFormData, technologies: [...techs, 'MongoDB'].join(', ') });
                              }
                            }}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              isDark 
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' 
                                : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                            }`}
                          >
                            MongoDB
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const techs = projectFormData.technologies ? projectFormData.technologies.split(',').map(t => t.trim()) : [];
                              if (!techs.includes('TypeScript')) {
                                setProjectFormData({ ...projectFormData, technologies: [...techs, 'TypeScript'].join(', ') });
                              }
                            }}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              isDark 
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' 
                                : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                            }`}
                          >
                            TypeScript
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const techs = projectFormData.technologies ? projectFormData.technologies.split(',').map(t => t.trim()) : [];
                              if (!techs.includes('Tailwind CSS')) {
                                setProjectFormData({ ...projectFormData, technologies: [...techs, 'Tailwind CSS'].join(', ') });
                              }
                            }}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              isDark 
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' 
                                : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                            }`}
                          >
                            Tailwind CSS
                          </button>
                          {/* UI/UX Technologies */}
                          <button
                            type="button"
                            onClick={() => {
                              const techs = projectFormData.technologies ? projectFormData.technologies.split(',').map(t => t.trim()) : [];
                              if (!techs.includes('Figma')) {
                                setProjectFormData({ ...projectFormData, technologies: [...techs, 'Figma'].join(', ') });
                              }
                            }}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              isDark 
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' 
                                : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                            }`}
                          >
                            Figma
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const techs = projectFormData.technologies ? projectFormData.technologies.split(',').map(t => t.trim()) : [];
                              if (!techs.includes('Adobe XD')) {
                                setProjectFormData({ ...projectFormData, technologies: [...techs, 'Adobe XD'].join(', ') });
                              }
                            }}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              isDark 
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' 
                                : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                            }`}
                          >
                            Adobe XD
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const techs = projectFormData.technologies ? projectFormData.technologies.split(',').map(t => t.trim()) : [];
                              if (!techs.includes('Sketch')) {
                                setProjectFormData({ ...projectFormData, technologies: [...techs, 'Sketch'].join(', ') });
                              }
                            }}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              isDark 
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' 
                                : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                            }`}
                          >
                            Sketch
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const techs = projectFormData.technologies ? projectFormData.technologies.split(',').map(t => t.trim()) : [];
                              if (!techs.includes('Adobe Illustrator')) {
                                setProjectFormData({ ...projectFormData, technologies: [...techs, 'Adobe Illustrator'].join(', ') });
                              }
                            }}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              isDark 
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' 
                                : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                            }`}
                          >
                            Adobe Illustrator
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={projectFormData.technologies}
                        onChange={(e) => setProjectFormData({ ...projectFormData, technologies: e.target.value })}
                        placeholder="Or type custom technologies (comma-separated)"
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                          isDark 
                            ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                        }`}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          GitHub Link
                        </label>
                        <input
                          type="url"
                          value={projectFormData.github}
                          onChange={(e) => setProjectFormData({ ...projectFormData, github: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          Live Demo Link
                        </label>
                        <input
                          type="url"
                          value={projectFormData.live}
                          onChange={(e) => setProjectFormData({ ...projectFormData, live: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <input
                          type="checkbox"
                          checked={projectFormData.featured}
                          onChange={(e) => setProjectFormData({ ...projectFormData, featured: e.target.checked })}
                          className="w-4 h-4"
                        />
                        Featured
                      </label>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          Order
                        </label>
                        <input
                          type="number"
                          value={projectFormData.order}
                          onChange={(e) => setProjectFormData({ ...projectFormData, order: parseInt(e.target.value) || 0 })}
                          className={`w-24 px-4 py-2 rounded-lg border ${
                            isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={uploadingProjectImage}
                        className={`px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                          isDark 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200'
                        }`}
                      >
                        <Save className="w-5 h-5" />
                        {uploadingProjectImage ? 'Uploading...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProjectForm(false);
                          setSelectedProjectImage(null);
                        }}
                        className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm ${
                          isDark 
                            ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-slate-700 border border-gray-200'
                        }`}
                      >
                        <X className="w-5 h-5" />
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading projects...</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div
                      key={project._id}
                      className={`p-6 rounded-xl border transition-all shadow-sm hover:shadow-md ${
                        isDark 
                          ? 'bg-slate-800 border-slate-700 hover:border-blue-400' 
                          : 'bg-white border-gray-200/50 hover:border-indigo-300 hover:shadow-indigo-100/50'
                      }`}
                    >
                      <div className="mb-4">
                        <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-lg" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {project.description}
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        {project.type === 'web' ? (
                          <Globe className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-indigo-600'}`} />
                        ) : project.type === 'mobile' ? (
                          <Smartphone className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        ) : (
                          <User className={`w-4 h-4 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
                        )}
                        <span className={`text-xs capitalize ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {project.type}
                        </span>
                        {project.featured && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProject(project);
                            setProjectFormData({
                              title: project.title,
                              description: project.description,
                              image: project.image,
                              technologies: project.technologies.join(', '),
                              type: project.type,
                              github: project.github || '',
                              live: project.live || '',
                              featured: project.featured,
                              order: project.order
                            });
                            setSelectedProjectImage(null);
                            setShowProjectForm(true);
                          }}
                          className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                            isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project._id)}
                          className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md ${
                            isDark 
                              ? 'bg-red-600 hover:bg-red-700 text-white' 
                              : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-red-200'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* About Tab - سيتم إكماله في الرسالة التالية */}
          {activeTab === 'about' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">About Section Management</h2>
                <button
                  onClick={() => setShowAboutForm(true)}
                  className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg ${
                    isDark 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200'
                  }`}
                >
                  <Edit className="w-5 h-5" />
                  {about ? 'Edit About' : 'Create About'}
                </button>
              </div>

              {showAboutForm && (
                <div className={`mb-6 p-6 rounded-xl border shadow-lg ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200/50 shadow-gray-200/50'
                }`}>
                  <form onSubmit={handleSaveAbout} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        Title
                      </label>
                      <input
                        type="text"
                        value={aboutFormData.title}
                        onChange={(e) => setAboutFormData({ ...aboutFormData, title: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                          isDark 
                            ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        Description *
                      </label>
                      <textarea
                        value={aboutFormData.description}
                        onChange={(e) => setAboutFormData({ ...aboutFormData, description: e.target.value })}
                        required
                        rows={6}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                          isDark 
                            ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={aboutFormData.image}
                        onChange={(e) => setAboutFormData({ ...aboutFormData, image: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                          isDark 
                            ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        Personal Info
                      </label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Location"
                          value={aboutFormData.personalInfo.location}
                          onChange={(e) => setAboutFormData({
                            ...aboutFormData,
                            personalInfo: { ...aboutFormData.personalInfo, location: e.target.value }
                          })}
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="Availability"
                          value={aboutFormData.personalInfo.availability}
                          onChange={(e) => setAboutFormData({
                            ...aboutFormData,
                            personalInfo: { ...aboutFormData.personalInfo, availability: e.target.value }
                          })}
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        />
                        <input
                          type="url"
                          placeholder="GitHub URL"
                          value={aboutFormData.personalInfo.github}
                          onChange={(e) => setAboutFormData({
                            ...aboutFormData,
                            personalInfo: { ...aboutFormData.personalInfo, github: e.target.value }
                          })}
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        />
                        <input
                          type="url"
                          placeholder="LinkedIn URL"
                          value={aboutFormData.personalInfo.linkedin}
                          onChange={(e) => setAboutFormData({
                            ...aboutFormData,
                            personalInfo: { ...aboutFormData.personalInfo, linkedin: e.target.value }
                          })}
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        />
                        <input
                          type="url"
                          placeholder="Khamsat URL"
                          value={aboutFormData.personalInfo.khamsat}
                          onChange={(e) => setAboutFormData({
                            ...aboutFormData,
                            personalInfo: { ...aboutFormData.personalInfo, khamsat: e.target.value }
                          })}
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        />
                        <input
                          type="url"
                          placeholder="Mostaql URL"
                          value={aboutFormData.personalInfo.mostaql}
                          onChange={(e) => setAboutFormData({
                            ...aboutFormData,
                            personalInfo: { ...aboutFormData.personalInfo, mostaql: e.target.value }
                          })}
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className={`px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg ${
                          isDark 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200'
                        }`}
                      >
                        <Save className="w-5 h-5" />
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAboutForm(false)}
                        className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm ${
                          isDark 
                            ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-slate-700 border border-gray-200'
                        }`}
                      >
                        <X className="w-5 h-5" />
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Images Management */}
              <div className={`mb-6 p-6 rounded-xl border shadow-lg ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200/50 shadow-gray-200/50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Images Gallery</h3>
                  <button
                    onClick={() => {
                      setNewImageData({ url: '', alt: '', order: about?.images?.length || 0 });
                      setSelectedImage(null);
                      setShowImageForm(true);
                    }}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    Add Image
                  </button>
                </div>

                {showImageForm && (
                  <div className={`mb-4 p-4 rounded-lg border shadow-sm ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-indigo-100'}`}>
                    <form onSubmit={handleAddImage} className="space-y-4">
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          Select Image *
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedImage(file);
                              // Preview image
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setNewImageData({ ...newImageData, url: event.target?.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          required
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-600 border-slate-500 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        />
                        {selectedImage && (
                          <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Selected: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                        {newImageData.url && (
                          <div className="mt-4">
                            <img
                              src={newImageData.url}
                              alt="Preview"
                              className="max-w-xs max-h-48 rounded-lg border"
                            />
                          </div>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                            Alt Text
                          </label>
                          <input
                            type="text"
                            value={newImageData.alt}
                            onChange={(e) => setNewImageData({ ...newImageData, alt: e.target.value })}
                            placeholder="Image description"
                            className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                              isDark 
                                ? 'bg-slate-600 border-slate-500 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                                : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                            Order
                          </label>
                          <input
                            type="number"
                            value={newImageData.order}
                            onChange={(e) => setNewImageData({ ...newImageData, order: parseInt(e.target.value) || 0 })}
                            className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                              isDark 
                                ? 'bg-slate-600 border-slate-500 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                                : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                            }`}
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          disabled={uploadingImage || !selectedImage}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md ${
                            isDark 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-indigo-200'
                          }`}
                        >
                          <Save className="w-4 h-4" />
                          {uploadingImage ? 'Uploading...' : 'Add Image'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowImageForm(false);
                            setSelectedImage(null);
                            setNewImageData({ url: '', alt: '', order: 0 });
                          }}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm ${
                            isDark 
                              ? 'bg-slate-600 hover:bg-slate-500 text-white' 
                              : 'bg-gray-100 hover:bg-gray-200 text-slate-700 border border-gray-200'
                          }`}
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {about?.images && about.images.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {about.images.sort((a, b) => a.order - b.order).map((img) => (
                      <div
                        key={img._id}
                        className={`relative group rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all ${
                          isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200/50 hover:border-indigo-300'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.alt || 'About image'}
                          className="w-full h-48 object-cover"
                        />
                        <div className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 ${
                          isDark ? '' : ''
                        }`}>
                          <button
                            onClick={() => handleDeleteImage(img._id!, img.url)}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                              isDark ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                        {img.alt && (
                          <div className={`absolute bottom-0 left-0 right-0 p-2 ${
                            isDark ? 'bg-slate-900/80' : 'bg-white/80'
                          }`}>
                            <p className={`text-xs truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {img.alt}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    No images added yet. Click "Add Image" to add your first image.
                  </p>
                )}
              </div>

              {/* Resume Management */}
              <div className={`mb-6 p-6 rounded-xl border shadow-lg ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200/50 shadow-gray-200/50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Resume/CV Management</h3>
                  {resume && (
                    <button
                      onClick={handleDeleteResume}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                        isDark ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete Resume
                    </button>
                  )}
                </div>

                {resume ? (
                  <div className={`p-4 rounded-lg mb-4 ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {resume.originalName || resume.filename}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Size: {(resume.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {resume.uploadedAt && (
                          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <a
                        href={`http://localhost:9999${resume.url}`}
                        download
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        View/Download
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className={`text-center py-4 mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    No resume uploaded yet.
                  </p>
                )}

                <form onSubmit={handleUploadResume} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {resume ? 'Replace Resume' : 'Upload Resume'} (PDF, DOC, DOCX) *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedResume(file);
                        }
                      }}
                      required={!resume}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    {selectedResume && (
                      <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Selected: {selectedResume.name} ({(selectedResume.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                  {selectedResume && (
                    <button
                      type="submit"
                      disabled={uploadingResume}
                      className={`w-full px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${
                        isDark 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200'
                      }`}
                    >
                      <Save className="w-5 h-5" />
                      {uploadingResume ? 'Uploading...' : resume ? 'Replace Resume' : 'Upload Resume'}
                    </button>
                  )}
                </form>
              </div>

              {about && (
                <div className={`p-6 rounded-xl border shadow-lg ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200/50 shadow-gray-200/50'}`}>
                  <h3 className="text-xl font-bold mb-4">{about.title}</h3>
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{about.description}</p>
                  {about.image && (
                    <img src={about.image} alt="About" className="w-full max-w-md rounded-lg mb-4 shadow-md" />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Education Section Management</h2>
                <button
                  onClick={() => {
                    setEditingEducation(null);
                    setEducationFormData({
                      institution: '', degree: '', duration: '', description: '', tracks: [{
                        title: '', duration: '', period: '', description: '', skills: [{ name: '', category: '' }]
                      }]
                    });
                    setShowEducationForm(true);
                  }}
                  className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg ${
                    isDark 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  Add Education
                </button>
              </div>

              {showEducationForm && (
                <div className={`mb-6 p-6 rounded-xl border shadow-lg ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200/50 shadow-gray-200/50'
                }`}>
                  <form onSubmit={handleSaveEducation} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          Institution *
                        </label>
                        <input
                          type="text"
                          value={educationFormData.institution}
                          onChange={(e) => setEducationFormData({ ...educationFormData, institution: e.target.value })}
                          required
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          Degree *
                        </label>
                        <input
                          type="text"
                          value={educationFormData.degree}
                          onChange={(e) => setEducationFormData({ ...educationFormData, degree: e.target.value })}
                          required
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        Duration *
                      </label>
                      <input
                        type="text"
                        value={educationFormData.duration}
                        onChange={(e) => setEducationFormData({ ...educationFormData, duration: e.target.value })}
                        required
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                          isDark 
                            ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        Description
                      </label>
                      <textarea
                        value={educationFormData.description}
                        onChange={(e) => setEducationFormData({ ...educationFormData, description: e.target.value })}
                        rows={4}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                          isDark 
                            ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                        }`}
                      />
                    </div>

                    {/* Tracks Management */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Education Tracks
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setEducationFormData({
                              ...educationFormData,
                              tracks: [
                                ...educationFormData.tracks,
                                { title: '', duration: '', period: '', description: '', skills: [] }
                              ]
                            });
                          }}
                          className={`px-3 py-1 text-sm rounded-lg flex items-center gap-1 transition-all ${
                            isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          Add Track
                        </button>
                      </div>

                      <div className="space-y-4">
                        {educationFormData.tracks.map((track, trackIndex) => (
                          <div
                            key={trackIndex}
                            className={`p-4 rounded-lg border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-300'}`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h5 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Track {trackIndex + 1}
                              </h5>
                              <button
                                type="button"
                                onClick={() => {
                                  const newTracks = educationFormData.tracks.filter((_, i) => i !== trackIndex);
                                  setEducationFormData({ ...educationFormData, tracks: newTracks });
                                }}
                                className={`p-1 rounded transition-all ${
                                  isDark ? 'hover:bg-slate-600 text-red-400' : 'hover:bg-gray-200 text-red-600'
                                }`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-3">
                              <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Track Title *
                                  </label>
                                  <input
                                    type="text"
                                    value={track.title}
                                    onChange={(e) => {
                                      const newTracks = [...educationFormData.tracks];
                                      newTracks[trackIndex].title = e.target.value;
                                      setEducationFormData({ ...educationFormData, tracks: newTracks });
                                    }}
                                    required
                                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                                      isDark ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                  />
                                </div>
                                <div>
                                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Period
                                  </label>
                                  <input
                                    type="text"
                                    value={track.period}
                                    onChange={(e) => {
                                      const newTracks = [...educationFormData.tracks];
                                      newTracks[trackIndex].period = e.target.value;
                                      setEducationFormData({ ...educationFormData, tracks: newTracks });
                                    }}
                                    placeholder="First Track"
                                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                                      isDark ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                  />
                                </div>
                              </div>
                              <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Duration
                                  </label>
                                  <input
                                    type="text"
                                    value={track.duration}
                                    onChange={(e) => {
                                      const newTracks = [...educationFormData.tracks];
                                      newTracks[trackIndex].duration = e.target.value;
                                      setEducationFormData({ ...educationFormData, tracks: newTracks });
                                    }}
                                    placeholder="4 Months Scholarship"
                                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                                      isDark ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Description
                                </label>
                                <textarea
                                  value={track.description}
                                  onChange={(e) => {
                                    const newTracks = [...educationFormData.tracks];
                                    newTracks[trackIndex].description = e.target.value;
                                    setEducationFormData({ ...educationFormData, tracks: newTracks });
                                  }}
                                  rows={2}
                                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                                    isDark ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                                  }`}
                                />
                              </div>

                              {/* Skills Management */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className={`block text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Skills ({track.skills?.length || 0})
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newTracks = [...educationFormData.tracks];
                                      if (!newTracks[trackIndex].skills) {
                                        newTracks[trackIndex].skills = [];
                                      }
                                      newTracks[trackIndex].skills.push({ name: '', category: '' });
                                      setEducationFormData({ ...educationFormData, tracks: newTracks });
                                    }}
                                    className={`px-2 py-1 text-xs rounded flex items-center gap-1 transition-all ${
                                      isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    }`}
                                  >
                                    <Plus className="w-3 h-3" />
                                    Add Skill
                                  </button>
                                </div>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                  {track.skills?.map((skill: any, skillIndex: number) => (
                                    <div key={skillIndex} className="flex gap-2">
                                      <input
                                        type="text"
                                        value={skill.name}
                                        onChange={(e) => {
                                          const newTracks = [...educationFormData.tracks];
                                          newTracks[trackIndex].skills[skillIndex].name = e.target.value;
                                          setEducationFormData({ ...educationFormData, tracks: newTracks });
                                        }}
                                        placeholder="Skill name"
                                        className={`flex-1 px-3 py-2 text-sm rounded-lg border ${
                                          isDark ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                      />
                                      <input
                                        type="text"
                                        value={skill.category}
                                        onChange={(e) => {
                                          const newTracks = [...educationFormData.tracks];
                                          newTracks[trackIndex].skills[skillIndex].category = e.target.value;
                                          setEducationFormData({ ...educationFormData, tracks: newTracks });
                                        }}
                                        placeholder="Category"
                                        className={`w-32 px-3 py-2 text-sm rounded-lg border ${
                                          isDark ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newTracks = [...educationFormData.tracks];
                                          newTracks[trackIndex].skills = newTracks[trackIndex].skills.filter((_: any, i: number) => i !== skillIndex);
                                          setEducationFormData({ ...educationFormData, tracks: newTracks });
                                        }}
                                        className={`p-2 rounded transition-all ${
                                          isDark ? 'hover:bg-slate-600 text-red-400' : 'hover:bg-gray-200 text-red-600'
                                        }`}
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className={`px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg ${
                          isDark 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200'
                        }`}
                      >
                        <Save className="w-5 h-5" />
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEducationForm(false)}
                        className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm ${
                          isDark 
                            ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-slate-700 border border-gray-200'
                        }`}
                      >
                        <X className="w-5 h-5" />
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div
                      key={edu._id}
                      className={`p-6 rounded-xl border shadow-sm hover:shadow-md transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200/50 hover:border-indigo-300'}`}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{edu.institution}</h3>
                          <p className={`text-lg mb-2 ${isDark ? 'text-blue-400' : 'text-indigo-600'}`}>{edu.degree}</p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{edu.duration}</p>
                          {edu.description && (
                            <p className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{edu.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingEducation(edu);
                              setEducationFormData({
                                institution: edu.institution,
                                degree: edu.degree,
                                duration: edu.duration,
                                description: edu.description || '',
                                tracks: edu.tracks || []
                              });
                              setShowEducationForm(true);
                            }}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow-md ${
                              isDark 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-indigo-200'
                            }`}
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEducation(edu._id)}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow-md ${
                              isDark 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-red-200'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Tracks */}
                      {edu.tracks && edu.tracks.length > 0 && (
                        <div className="mt-6 space-y-4">
                          <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                            Education Tracks ({edu.tracks.length})
                          </h4>
                          {edu.tracks.map((track: any, trackIndex: number) => (
                            <div
                              key={trackIndex}
                              className={`p-4 rounded-lg border shadow-sm ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gradient-to-br from-indigo-50/30 to-purple-50/30 border-indigo-100'}`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h5 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{track.title}</h5>
                                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {track.period} • {track.duration}
                                  </p>
                                  {track.description && (
                                    <p className={`text-sm mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                      {track.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="mt-3">
                                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Skills ({track.skills?.length || 0}):
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {track.skills?.slice(0, 10).map((skill: any, skillIndex: number) => (
                                    <span
                                      key={skillIndex}
                                      className={`px-2 py-1 text-xs rounded shadow-sm ${
                                        isDark ? 'bg-slate-600 text-gray-300' : 'bg-white border border-indigo-200 text-indigo-700'
                                      }`}
                                    >
                                      {skill.name}
                                    </span>
                                  ))}
                                  {track.skills && track.skills.length > 10 && (
                                    <span className={`px-2 py-1 text-xs rounded ${
                                      isDark ? 'bg-slate-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                                    }`}>
                                      +{track.skills.length - 10} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Reviews Management</h2>
                <button
                  onClick={() => {
                    setEditingReview(null);
                    setReviewFormData({
                      name: '', role: '', company: '', content: '', rating: 5, avatar: '', featured: false, order: reviews.length
                    });
                    setShowReviewForm(true);
                  }}
                  className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg ${
                    isDark 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  Add Review
                </button>
              </div>

              {showReviewForm && (
                <div className={`mb-6 p-6 rounded-xl border shadow-lg ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200/50 shadow-gray-200/50'
                }`}>
                  <form onSubmit={handleSaveReview} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          Name *
                        </label>
                        <input
                          type="text"
                          value={reviewFormData.name}
                          onChange={(e) => setReviewFormData({ ...reviewFormData, name: e.target.value })}
                          required
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          Rating (1-5)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={reviewFormData.rating}
                          onChange={(e) => setReviewFormData({ ...reviewFormData, rating: parseInt(e.target.value) || 5 })}
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          Role
                        </label>
                        <input
                          type="text"
                          value={reviewFormData.role}
                          onChange={(e) => setReviewFormData({ ...reviewFormData, role: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          Company
                        </label>
                        <input
                          type="text"
                          value={reviewFormData.company}
                          onChange={(e) => setReviewFormData({ ...reviewFormData, company: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        Review Content *
                      </label>
                      <textarea
                        value={reviewFormData.content}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, content: e.target.value })}
                        required
                        rows={4}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                          isDark 
                            ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        Avatar URL
                      </label>
                      <input
                        type="url"
                        value={reviewFormData.avatar}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, avatar: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1 ${
                          isDark 
                            ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/20 shadow-sm'
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <input
                          type="checkbox"
                          checked={reviewFormData.featured}
                          onChange={(e) => setReviewFormData({ ...reviewFormData, featured: e.target.checked })}
                          className="w-4 h-4"
                        />
                        Featured
                      </label>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          Order
                        </label>
                        <input
                          type="number"
                          value={reviewFormData.order}
                          onChange={(e) => setReviewFormData({ ...reviewFormData, order: parseInt(e.target.value) || 0 })}
                          className={`w-24 px-4 py-2 rounded-lg border ${
                            isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className={`px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg ${
                          isDark 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200'
                        }`}
                      >
                        <Save className="w-5 h-5" />
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm ${
                          isDark 
                            ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-slate-700 border border-gray-200'
                        }`}
                      >
                        <X className="w-5 h-5" />
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className={`p-6 rounded-xl border shadow-sm hover:shadow-md transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200/50 hover:border-indigo-300'}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {review.avatar ? (
                            <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full" />
                          ) : (
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              isDark ? 'bg-slate-700' : 'bg-gray-200'
                            }`}>
                              <User className="w-6 h-6" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold">{review.name}</h3>
                            {review.role && <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{review.role}</p>}
                            {review.company && <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{review.company}</p>}
                          </div>
                        </div>
                        <div className="flex gap-1">
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
                      </div>
                      <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{review.content}</p>
                      {review.featured && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          Featured
                        </span>
                      )}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => {
                            setEditingReview(review);
                            setReviewFormData({
                              name: review.name,
                              role: review.role || '',
                              company: review.company || '',
                              content: review.content,
                              rating: review.rating,
                              avatar: review.avatar || '',
                              featured: review.featured,
                              order: review.order
                            });
                            setShowReviewForm(true);
                          }}
                          className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md ${
                            isDark 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-indigo-200'
                          }`}
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md ${
                            isDark 
                              ? 'bg-red-600 hover:bg-red-700 text-white' 
                              : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-red-200'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
