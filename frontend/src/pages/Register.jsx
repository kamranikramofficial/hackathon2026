import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { Activity, User, Mail, Lock, Briefcase, ArrowRight, Check, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Patient');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/register', {
                name,
                email,
                password,
                role
            });
            const userData = response.data;

            login(userData);

            switch (userData.role) {
                case 'Admin': navigate('/admin'); break;
                case 'Doctor': navigate('/doctor'); break;
                case 'Receptionist': navigate('/receptionist'); break;
                case 'Patient': navigate('/patient'); break;
                default: navigate('/'); break;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { value: 'Patient', label: 'Patient', icon: '👤', color: 'blue' },
        { value: 'Doctor', label: 'Doctor', icon: '👨‍⚕️', color: 'emerald' },
        { value: 'Receptionist', label: 'Receptionist', icon: '👨‍💼', color: 'orange' },
        { value: 'Admin', label: 'Administrator', icon: '👑', color: 'purple' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 py-8">
            <div className="w-full max-w-2xl">
                {/* Back to home */}
                <Link to="/" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mb-8 inline-flex items-center gap-2">
                    ← Back to Home
                </Link>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center rounded-2xl mb-4 shadow-lg">
                            <Activity className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Start Your Journey</h1>
                        <p className="text-slate-500 mt-2 text-center">Create your account in minutes</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm font-medium border border-red-200 flex items-start gap-3">
                            <div className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5">⚠️</div>
                            <div>{error}</div>
                        </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleRegister} className="space-y-5 mb-6">
                        {/* Grid for Name and Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@clinic.com"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Min 6 characters</p>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">What's your role?</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {roles.map((r) => (
                                    <button
                                        key={r.value}
                                        type="button"
                                        onClick={() => setRole(r.value)}
                                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                                            role === r.value
                                                ? 'border-indigo-600 bg-indigo-50'
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <span className="text-2xl">{r.icon}</span>
                                        <span className="text-xs font-medium text-slate-700">{r.label}</span>
                                        {role === r.value && (
                                            <Check className="w-4 h-4 text-indigo-600" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-3">
                            <input type="checkbox" required className="mt-1 rounded" />
                            <span className="text-sm text-slate-600">
                                I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
                            </span>
                        </label>

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create My Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="border-t border-slate-200 my-6"></div>

                    {/* Login Link */}
                    <p className="text-center text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold">
                            Sign in here
                        </Link>
                    </p>
                </div>

                {/* Features Highlight */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    {[
                        { icon: '🔐', title: 'Secure', desc: 'JWT & bcrypt encryption' },
                        { icon: '⚡', title: 'Fast', desc: 'Instant access to dashboards' },
                        { icon: '🎯', title: 'AI-Powered', desc: 'Smart diagnosis tools' }
                    ].map((feature, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl mb-2">{feature.icon}</div>
                            <p className="text-sm font-semibold text-slate-900">{feature.title}</p>
                            <p className="text-xs text-slate-500">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-xs mt-8">
                    By registering, you agree to join AI Clinic Pro • No credit card required
                </p>
            </div>
        </div>
    );
};

export default Register;