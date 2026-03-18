import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, CheckCircle, Stethoscope, BarChart3, Lock, Zap, Cloud, ArrowRight, Star, LogOut, MessageCircle, Phone, Mail, Clock, Send } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userQuestion, setUserQuestion] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [showAiResponse, setShowAiResponse] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const { user, logout } = useContext(AuthContext);

    // AI Response handler
    const handleAiQuestion = async (e) => {
        e.preventDefault();
        if (!userQuestion.trim()) return;

        // Add user question to chat
        const userMsg = { role: 'user', text: userQuestion };
        setChatHistory([...chatHistory, userMsg]);

        // Simulate AI responses for common questions
        const lowerQuestion = userQuestion.toLowerCase();
        let response = '';

        if (lowerQuestion.includes('price') || lowerQuestion.includes('cost')) {
            response = 'Our pricing starts at $99/month for the Starter plan, $299/month for Professional, and custom pricing for Enterprise. Each plan includes different features and patient limits.';
        } else if (lowerQuestion.includes('support') || lowerQuestion.includes('help')) {
            response = 'We offer 24/7 support via email and phone. Professional and Enterprise plans include priority support with response times under 2 hours.';
        } else if (lowerQuestion.includes('security') || lowerQuestion.includes('safe')) {
            response = 'AI Clinic Pro uses JWT authentication, role-based access control, encrypted data transmission, and is HIPAA-compliant for maximum security and data privacy.';
        } else if (lowerQuestion.includes('offline') || lowerQuestion.includes('connection')) {
            response = 'Yes! AI Clinic Pro works completely offline. All data syncs automatically when connection is restored, ensuring uninterrupted clinic operations.';
        } else if (lowerQuestion.includes('features')) {
            response = 'Our key features include patient management, appointment scheduling, AI-powered diagnosis assistance, real-time analytics, prescription generation, and offline-first architecture.';
        } else if (lowerQuestion.includes('trial') || lowerQuestion.includes('free')) {
            response = 'Yes! We offer a free 14-day trial for the Professional plan with full access to all features. No credit card required.';
        } else if (lowerQuestion.includes('integration')) {
            response = 'AI Clinic Pro integrates with major EHR systems, laboratory information systems, and billing platforms. Custom integrations are available on Enterprise plans.';
        } else {
            response = 'Great question! For more detailed information, please contact our support team at support@aiclinicpro.com or call +1-800-CLINIC-1. Our experts are available 24/7.';
        }

        setAiResponse(response);
        setShowAiResponse(true);
        setChatHistory([...chatHistory, userMsg, { role: 'ai', text: response }]);
        setUserQuestion('');
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <Stethoscope className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">AI Clinic Pro</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
                            <a href="#pricing" className="text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
                            <a href="#testimonials" className="text-slate-600 hover:text-indigo-600 transition-colors">Testimonials</a>
                            <a href="#support" className="text-slate-600 hover:text-indigo-600 transition-colors">Support</a>
                            {user ? (
                                <>
                                    <Link to={getDashboardRoute()} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all font-medium">
                                        Dashboard
                                    </Link>
                                    <button onClick={logout} className="text-slate-600 hover:text-red-600 transition-colors flex items-center gap-1">
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-slate-600 hover:text-indigo-600 transition-colors">Login</Link>
                                    <Link to="/register" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-slate-200 py-4 space-y-2">
                            <a href="#features" className="block px-4 py-2 text-slate-600 hover:text-indigo-600">Features</a>
                            <a href="#pricing" className="block px-4 py-2 text-slate-600 hover:text-indigo-600">Pricing</a>
                            <a href="#testimonials" className="block px-4 py-2 text-slate-600 hover:text-indigo-600">Testimonials</a>
                            <a href="#support" className="block px-4 py-2 text-slate-600 hover:text-indigo-600">Support</a>
                            {user ? (
                                <>
                                    <Link to={getDashboardRoute()} className="block px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-center font-medium">
                                        Dashboard
                                    </Link>
                                    <button onClick={logout} className="block w-full px-4 py-2 text-red-600 hover:text-red-700 text-left flex items-center gap-2">
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block px-4 py-2 text-slate-600 hover:text-indigo-600">Login</Link>
                                    <Link to="/register" className="block px-4 py-2 bg-indigo-600 text-white rounded-lg text-center font-medium">Get Started</Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                            Modernize Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Clinic Operations</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                            AI Clinic Pro digitizes patient care, automates workflows, and empowers doctors with intelligent diagnostics. Fully functional even offline.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
                                Start Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg font-bold hover:bg-indigo-50 transition-colors">
                                Watch Demo
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-3xl opacity-20"></div>
                        <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
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
            <section id="features" className="bg-white py-20 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
                        <p className="text-xl text-slate-600">Everything you need to run a modern clinic</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <div key={i} className="group p-8 rounded-xl border border-slate-200 hover:border-indigo-600 hover:shadow-lg transition-all">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors mb-4">
                                        <Icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                                    <p className="text-slate-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Loved by Clinics</h2>
                        <p className="text-xl text-slate-600">Join hundreds of clinics already using AI Clinic Pro</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, j) => (
                                        <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-700 mb-6 italic">"{testimonial.text}"</p>
                                <div className="border-t border-slate-200 pt-4">
                                    <p className="font-bold text-slate-900">{testimonial.name}</p>
                                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                                    <p className="text-sm text-indigo-600 font-medium">{testimonial.clinic}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="bg-gradient-to-b from-white to-slate-50 py-20 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-xl text-slate-600">Choose the plan that fits your clinic</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, i) => (
                            <div
                                key={i}
                                className={`rounded-xl transition-all ${
                                    plan.popular
                                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl scale-105'
                                        : 'bg-white border border-slate-200 hover:border-indigo-600'
                                }`}
                            >
                                <div className="p-8">
                                    {plan.popular && (
                                        <div className="mb-4 inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                                            Most Popular
                                        </div>
                                    )}
                                    <h3 className={`text-2xl font-bold mb-2 ${!plan.popular && 'text-slate-900'}`}>
                                        {plan.name}
                                    </h3>
                                    <div className="mb-6">
                                        <span className={`text-4xl font-bold ${!plan.popular && 'text-slate-900'}`}>
                                            {plan.price}
                                        </span>
                                        <span className={`text-sm ${plan.popular ? 'text-indigo-100' : 'text-slate-600'}`}>
                                            {plan.period}
                                        </span>
                                    </div>
                                    <p className={`mb-6 ${plan.popular ? 'text-indigo-100' : 'text-slate-600'}`}>
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
                                    <ul className={`space-y-4 ${plan.popular ? 'text-indigo-100' : 'text-slate-600'}`}>
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
            <section id="support" className="bg-gradient-to-b from-slate-50 to-white py-20 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Support & Assistance</h2>
                        <p className="text-xl text-slate-600">We're here to help you succeed</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {/* Support Cards */}
                        <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <Phone className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Phone Support</h3>
                            <p className="text-slate-600 mb-4">Call our support team anytime</p>
                            <p className="text-lg font-bold text-indigo-600">+1-800-CLINIC-1</p>
                            <p className="text-sm text-slate-500 mt-2">Available 24/7</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                                <Mail className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Email Support</h3>
                            <p className="text-slate-600 mb-4">Reach out via email</p>
                            <p className="text-lg font-bold text-emerald-600">support@aiclinicpro.com</p>
                            <p className="text-sm text-slate-500 mt-2">Response within 2 hours</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Support Hours</h3>
                            <p className="text-slate-600 mb-4">We're here when you need us</p>
                            <div className="text-sm text-slate-700">
                                <p><span className="font-semibold">Mon-Fri:</span> 7am - 10pm</p>
                                <p><span className="font-semibold">Weekends:</span> 9am - 6pm</p>
                                <p className="mt-2 text-indigo-600 font-semibold">24/7 Emergency Support</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Q&A Section */}
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                            <div className="flex items-center gap-3 mb-2">
                                <MessageCircle className="w-6 h-6" />
                                <h3 className="text-2xl font-bold">AI Assistant</h3>
                            </div>
                            <p className="opacity-90">Ask any question about AI Clinic Pro and get instant answers</p>
                        </div>

                        <div className="p-8">
                            {/* Chat Display */}
                            {chatHistory.length > 0 && (
                                <div className="mb-6 max-h-64 overflow-y-auto space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    {chatHistory.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-xs px-4 py-2 rounded-lg ${
                                                msg.role === 'user'
                                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                                    : 'bg-slate-200 text-slate-900 rounded-bl-none'
                                            }`}>
                                                <p className="text-sm">{msg.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {showAiResponse && (
                                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                                    <p className="text-sm text-emerald-900"><span className="font-semibold">AI Response:</span> {aiResponse}</p>
                                </div>
                            )}

                            {/* Input Form */}
                            <form onSubmit={handleAiQuestion} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Ask your question</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={userQuestion}
                                            onChange={(e) => setUserQuestion(e.target.value)}
                                            placeholder="e.g., What's included in the Professional plan? How is my data secured?"
                                            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                                        >
                                            <Send className="w-4 h-4" />
                                            Send
                                        </button>
                                    </div>
                                </div>

                                {/* Sample Questions */}
                                <div className="border-t border-slate-200 pt-4">
                                    <p className="text-sm font-medium text-slate-700 mb-3">Quick questions:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {[
                                            'What are your pricing plans?',
                                            'Is my data secure?',
                                            'Do you offer offline support?',
                                            'What is your support availability?'
                                        ].map((question, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                    setUserQuestion(question);
                                                }}
                                                className="text-left px-3 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg text-sm text-slate-700 hover:text-indigo-600 transition-colors"
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

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
