import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, CheckCircle, Stethoscope, BarChart3, Lock, Zap, Cloud, ArrowRight, Star } from 'lucide-react';

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                            <Link to="/login" className="text-slate-600 hover:text-indigo-600 transition-colors">Login</Link>
                            <Link to="/register" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                                Get Started
                            </Link>
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
                            <Link to="/login" className="block px-4 py-2 text-slate-600 hover:text-indigo-600">Login</Link>
                            <Link to="/register" className="block px-4 py-2 bg-indigo-600 text-white rounded-lg text-center font-medium">Get Started</Link>
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
                            <h4 className="font-bold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
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
