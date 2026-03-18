import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, CheckCircle, Stethoscope, BarChart3, Lock, Zap, Cloud, ArrowRight, Star, LogOut, MessageCircle, Phone, Mail, Clock, Send, Moon, Sun } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axiosInstance';

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userQuestion, setUserQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [chatOpen, setChatOpen] = useState(false);
    const { isDark: darkMode, toggleTheme } = useTheme();
    const { user, logout } = useContext(AuthContext);

    // AI Response handler - calls backend API
    const handleAiQuestion = async (e) => {
        e.preventDefault();
        if (!userQuestion.trim()) return;

        // Add user question to chat
        const userMsg = { role: 'user', text: userQuestion };
        setChatHistory(prev => [...prev, userMsg]);
        setLoading(true);
        setError('');

        try {
            // Call backend AI endpoint using axios instance
            const response = await api.post('/ai/health-advice', {
                question: userQuestion
            });

            const data = response.data;
            const aiMsg = { 
                role: 'ai', 
                text: data.advice || data.message, 
                disclaimer: data.disclaimer 
            };
            setChatHistory(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error('AI Error:', err);
            let errorMessage = 'Failed to get AI response';
            
            if (err.response?.status === 401) {
                errorMessage = 'Please login to use the AI Assistant';
            } else if (err.response?.status === 403) {
                errorMessage = 'You do not have permission to use this feature';
            } else if (err.message === 'Network Error') {
                errorMessage = 'Network error - please check your connection or backend server';
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            const errorMsg = { 
                role: 'ai', 
                text: 'Oops! ' + errorMessage + ' 🤖\n\nFor support, contact us at support@aiclinicpro.com or call +1-800-CLINIC-1'
            };
            setChatHistory(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
            setUserQuestion('');
        }
    };

    // Get dashboard route based on user role
    const getDashboardRoute = () => {
        if (!user) return '/login';
        switch (user.role) {
            case 'Admin': return '/admin';
            case 'Doctor': return '/doctor';
            case 'Receptionist': return '/receptionist';
            case 'Patient': return '/patient';
            default: return '/';
        }
    };

    const features = [
        {
            icon: Stethoscope,
            title: 'AI-Powered Diagnosis',
            description: 'Smart symptom checker with AI-assisted diagnostics and risk stratification'
        },
        {
            icon: BarChart3,
            title: 'Real-Time Analytics',
            description: 'Comprehensive dashboards with actionable insights and KPIs'
        },
        {
            icon: Lock,
            title: 'Secure & Compliant',
            description: 'JWT authentication, role-based access, and HIPAA-ready architecture'
        },
        {
            icon: Cloud,
            title: 'Cloud-Based',
            description: 'Accessible anywhere, anytime with MongoDB cloud infrastructure'
        },
        {
            icon: Zap,
            title: 'Offline Ready',
            description: 'Full functionality even when AI services are temporarily unavailable'
        },
        {
            icon: CheckCircle,
            title: 'PDF Prescriptions',
            description: 'Auto-generated prescription documents with dosage and instructions'
        }
    ];

    const testimonials = [
        {
            name: 'Dr. Sarah Ahmed',
            role: 'Lead Physician',
            clinic: 'City Medical Clinic',
            text: 'This system transformed how we manage patient records. Everything is digital, organized, and the AI diagnostics save us hours every day.',
            rating: 5
        },
        {
            name: 'Fatima Khan',
            role: 'Clinic Receptionist',
            clinic: 'Healthcare Plus',
            text: 'Super easy to use! Appointments are now booked in seconds and patients can see their history anytime they want.',
            rating: 5
        },
        {
            name: 'Mr. Haroon',
            role: 'Clinic Administrator',
            clinic: 'Prime Health Services',
            text: 'The analytics dashboard gives us insights we never had before. Patient metrics, revenue tracking, and trend analysis all in one place.',
            rating: 5
        }
    ];

    const pricingPlans = [
        {
            name: 'Starter',
            price: '$99',
            period: '/month',
            patients: 'Up to 500 patients',
            features: [
                'Basic patient management',
                'Appointment scheduling',
                'Simple analytics',
                'Email support',
                'Mobile app access'
            ],
            cta: 'Get Started',
            popular: false
        },
        {
            name: 'Professional',
            price: '$299',
            period: '/month',
            patients: 'Up to 5,000 patients',
            features: [
                'Everything in Starter',
                'AI Symptom Checker',
                'Advanced analytics',
                'Prescription management',
                'Priority support',
                'Custom integratio'
            ],
            cta: 'Start Free Trial',
            popular: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: 'Custom pricing',
            patients: 'Unlimited patients',
            features: [
                'Everything in Professional',
                'Multi-location support',
                'Advanced security',
                'Dedicated support',
                'Custom features',
                'API access'
            ],
            cta: 'Contact Sales',
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 dark:text-white transition-colors">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white dark:bg-slate-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <Stethoscope className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">AI Clinic Pro</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
                            <a href="#pricing" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</a>
                            <a href="#testimonials" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Testimonials</a>
                            <a href="#support" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Support</a>
                            
                            {/* Theme Toggle Button */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
                            </button>

                            {user ? (
                                <>
                                    <Link to={getDashboardRoute()} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all font-medium">
                                        Dashboard
                                    </Link>
                                    <button onClick={logout} className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1">
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Login</Link>
                                    <Link to="/register" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button & Theme Toggle */}
                        <div className="md:hidden flex items-center gap-2">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
                            </button>
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                        {/* Mobile Menu */}
                        {mobileMenuOpen && (
                            <div className="md:hidden border-t border-slate-200 dark:border-slate-700 py-4 space-y-2 bg-white dark:bg-slate-800">
                                <a href="#features" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">Features</a>
                                <a href="#pricing" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">Pricing</a>
                                <a href="#testimonials" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">Testimonials</a>
                                <a href="#support" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">Support</a>
                                {user ? (
                                    <>
                                        <Link to={getDashboardRoute()} className="block px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-center font-medium">
                                            Dashboard
                                        </Link>
                                        <button onClick={logout} className="block w-full px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-left flex items-center gap-2">
                                            <LogOut className="w-4 h-4" /> Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">Login</Link>
                                        <Link to="/register" className="block px-4 py-2 bg-indigo-600 text-white rounded-lg text-center font-medium">Get Started</Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                            Modernize Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Clinic Operations</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                            AI Clinic Pro digitizes patient care, automates workflows, and empowers doctors with intelligent diagnostics. Fully functional even offline.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
                                Start Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 px-8 py-4 rounded-lg font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                                Watch Demo
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-3xl opacity-20"></div>
                        <div className="relative bg-white dark:bg-slate-700 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-600">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 bg-emerald-50 p-3 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    <span className="text-slate-700">Real-time patient tracking</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                    <span className="text-slate-700">AI-powered diagnostics</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-purple-50 p-3 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-purple-600" />
                                    <span className="text-slate-700">Secure JWT authentication</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-pink-50 p-3 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-pink-600" />
                                    <span className="text-slate-700">Automated prescriptions</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-white dark:bg-slate-800 py-20 border-t border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Powerful Features</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Everything you need to run a modern clinic</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <div key={i} className="group p-8 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-700 hover:border-indigo-600 dark:hover:border-indigo-500 hover:shadow-lg dark:hover:shadow-indigo-900/50 transition-all">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors mb-4">
                                        <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Loved by Clinics</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Join hundreds of clinics already using AI Clinic Pro</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-slate-900 p-8 border border-slate-200 dark:border-slate-700">
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, j) => (
                                        <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">"{testimonial.text}"</p>
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                    <p className="font-bold text-slate-900 dark:text-white">{testimonial.name}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{testimonial.clinic}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="bg-gradient-to-b from-white dark:from-slate-800 to-slate-50 dark:to-slate-900 py-20 border-t border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Choose the plan that fits your clinic</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, i) => (
                            <div
                                key={i}
                                className={`rounded-xl transition-all ${
                                    plan.popular
                                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl scale-105'
                                        : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-indigo-600 dark:hover:border-indigo-500'
                                }`}
                            >
                                <div className="p-8">
                                    {plan.popular && (
                                        <div className="mb-4 inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                                            Most Popular
                                        </div>
                                    )}
                                    <h3 className={`text-2xl font-bold mb-2 ${!plan.popular && 'text-slate-900 dark:text-white'}`}>
                                        {plan.name}
                                    </h3>
                                    <div className="mb-6">
                                        <span className={`text-4xl font-bold ${!plan.popular && 'text-slate-900 dark:text-white'}`}>
                                            {plan.price}
                                        </span>
                                        <span className={`text-sm ${plan.popular ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                            {plan.period}
                                        </span>
                                    </div>
                                    <p className={`mb-6 ${plan.popular ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                        {plan.patients}
                                    </p>
                                    <button
                                        className={`w-full font-bold py-3 rounded-lg transition-colors mb-8 ${
                                            plan.popular
                                                ? 'bg-white text-indigo-600 hover:bg-slate-100'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                    >
                                        {plan.cta}
                                    </button>
                                    <ul className={`space-y-4 ${plan.popular ? 'text-indigo-100' : 'text-slate-600 dark:text-white'}`}>
                                        {plan.features.map((feature, j) => (
                                            <li key={j} className="flex items-center space-x-3">
                                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Clinic?</h2>
                    <p className="text-lg mb-8 opacity-90">Join the revolution in healthcare management. Start your free trial today.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                            Get Started Now
                        </Link>
                        <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* Support & AI Q&A Section */}
            <section id="support" className="bg-gradient-to-b from-slate-50 dark:from-slate-900 to-white dark:to-slate-800 py-20 border-t border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Support & Assistance</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300">We're here to help you succeed</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {/* Support Cards */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <Phone className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Phone Support</h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">Call our support team anytime</p>
                            <p className="text-lg font-bold text-indigo-600">+1-800-CLINIC-1</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Available 24/7</p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                                <Mail className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Email Support</h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">Reach out via email</p>
                            <p className="text-lg font-bold text-emerald-600">support@aiclinicpro.com</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Response within 2 hours</p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Support Hours</h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">We're here when you need us</p>
                            <div className="text-sm text-slate-700 dark:text-slate-300">
                                <p><span className="font-semibold">Mon-Fri:</span> 7am - 10pm</p>
                                <p><span className="font-semibold">Weekends:</span> 9am - 6pm</p>
                                <p className="mt-2 text-indigo-600 font-semibold">24/7 Emergency Support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating Chat Widget */}
            {!chatOpen && (
                <button
                    onClick={() => setChatOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-white hover:scale-110 z-40"
                >
                    <MessageCircle className="w-7 h-7" />
                </button>
            )}

            {/* Chat Modal */}
            {chatOpen && (
                <div className="fixed bottom-6 right-6 w-96 max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 flex flex-col h-96">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MessageCircle className="w-6 h-6" />
                            <div>
                                <h3 className="font-bold text-lg">AI Medical Assistant</h3>
                                <p className="text-xs opacity-90">Ask any health or clinic questions</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setChatOpen(false)}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 space-y-3">
                        {chatHistory.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 space-y-4">
                                <p className="text-center text-sm font-medium">Start a conversation with the AI Assistant...</p>
                                
                                {/* Quick Questions */}
                                {user && chatHistory.length === 0 && (
                                    <div className="w-full space-y-2 px-2">
                                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center">Quick questions:</p>
                                        {[
                                            'What are patient symptoms?',
                                            'Is my data secure?',
                                            'How does diagnosis work?',
                                            'Tell me about features',
                                            'What is your support?'
                                        ].map((question, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setUserQuestion(question)}
                                                className="w-full text-left px-2 py-1.5 bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-400 rounded text-xs text-slate-700 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-medium"
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                                    msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-emerald-100 dark:bg-emerald-900 text-slate-900 dark:text-emerald-100 rounded-bl-none'
                                }`}>
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                    {msg.disclaimer && (
                                        <p className="text-xs mt-1 opacity-75 italic">{msg.disclaimer}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-emerald-100 dark:bg-emerald-900 text-slate-900 dark:text-emerald-100 px-4 py-2 rounded-lg rounded-bl-none">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-slate-900 dark:bg-emerald-300 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-slate-900 dark:bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-slate-900 dark:bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mx-4 mt-2 p-2 bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-200 text-xs rounded-lg">
                            {error} {error.includes('login') && <Link to="/login" className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold"> Login</Link>}
                        </div>
                    )}

                    {/* Auth Message */}
                    {!user && chatHistory.length === 0 && (
                        <div className="mx-4 mb-3 p-2 bg-blue-50 dark:bg-blue-950 border border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs rounded-lg">
                            Please <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline">login</Link> to use AI
                        </div>
                    )}

                    {/* Input Form */}
                    <form onSubmit={handleAiQuestion} className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={userQuestion}
                                onChange={(e) => setUserQuestion(e.target.value)}
                                disabled={loading || !user}
                                placeholder={user ? "Ask anything..." : "Login to ask"}
                                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-sm"
                            />
                            <button
                                type="submit"
                                disabled={loading || !user}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-1 disabled:bg-slate-400 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <Stethoscope className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white font-bold">AI Clinic Pro</span>
                            </div>
                            <p className="text-sm">Modern clinic management powered by AI</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#support" className="hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#support" className="hover:text-white transition-colors">AI Assistant</a></li>
                                <li><a href="mailto:support@aiclinicpro.com" className="hover:text-white transition-colors">Email Support</a></li>
                                <li><a href="tel:+1-800-CLINIC-1" className="hover:text-white transition-colors">Phone: +1-800-CLINIC-1</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 text-center text-sm">
                        <p>&copy; 2026 AI Clinic Pro. All rights reserved. Built for Hackathon 2026.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
