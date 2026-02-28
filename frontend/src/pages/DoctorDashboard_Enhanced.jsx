import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    Search, Plus, Settings, LogOut, BarChart3, Clock, CheckCircle,
    AlertCircle, Download, Send, User, Calendar, Pill, Zap, Heart,
    TrendingUp, MessageSquare, Phone, Eye, EyeOff, Save, X
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAIChecker, setShowAIChecker] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [symptoms, setSymptoms] = useState('');
    const [aiResponse, setAiResponse] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [prescriptionForm, setPrescriptionForm] = useState({ medicines: [{ name: '', dose: '' }] });
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '', phone: '', specialization: '' });
    const [editingProfile, setEditingProfile] = useState(false);

    // Mock data for analytics
    const analyticsData = [
        { month: 'Jan', consultations: 12, diagnoses: 8, prescriptions: 10 },
        { month: 'Feb', consultations: 15, diagnoses: 12, prescriptions: 14 },
        { month: 'Mar', consultations: 18, diagnoses: 14, prescriptions: 16 },
        { month: 'Apr', consultations: 20, diagnoses: 18, prescriptions: 19 },
        { month: 'May', consultations: 25, diagnoses: 22, prescriptions: 24 },
        { month: 'Jun', consultations: 28, diagnoses: 26, prescriptions: 27 }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const patientsRes = await axios.get('/api/patients');
            const appointmentsRes = await axios.get('/api/appointments');
            setPatients(patientsRes.data);
            setAppointments(appointmentsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.contact.includes(searchQuery)
    );

    const handleAICheck = async () => {
        if (!symptoms.trim()) return;
        setLoadingAI(true);
        try {
            const res = await axios.post('/api/ai/diagnose', { symptoms });
            setAiResponse(res.data);
        } catch (error) {
            setAiResponse({
                conditions: ['Unable to connect to AI'],
                riskLevel: 'unknown',
                message: error.response?.data?.message || 'AI service temporarily unavailable. Please try again.'
            });
        }
        setLoadingAI(false);
    };

    const handleAddMedicine = () => {
        setPrescriptionForm({
            medicines: [...prescriptionForm.medicines, { name: '', dose: '' }]
        });
    };

    const handleMedicineChange = (index, field, value) => {
        const newMedicines = [...prescriptionForm.medicines];
        newMedicines[index] = { ...newMedicines[index], [field]: value };
        setPrescriptionForm({ medicines: newMedicines });
    };

    const handleSaveMedicine = (index) => {
        const medicine = prescriptionForm.medicines[index];
        if (medicine.name && medicine.dose) {
            // Save logic here
            console.log('Medicine saved:', medicine);
        }
    };

    const handleRemoveMedicine = (index) => {
        const newMedicines = prescriptionForm.medicines.filter((_, i) => i !== index);
        setPrescriptionForm({ medicines: newMedicines });
    };

    const upcomingAppointments = appointments.filter(a => a.status === 'pending').slice(0, 3);
    const totalConsultations = appointments.length;
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
    const pendingAppointments = appointments.filter(a => a.status === 'pending').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            {/* Sticky Header */}
            <header className="sticky top-0 bg-white shadow-sm z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                            👨‍⚕️
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Doctor Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowProfile(!showProfile)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition"
                            title="Profile Settings"
                        >
                            <Settings className="w-5 h-5 text-slate-600" />
                        </button>
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold cursor-pointer">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Profile Modal */}
            {showProfile && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900">Profile Settings</h2>
                            <button onClick={() => setShowProfile(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {editingProfile ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                                    <input
                                        type="text"
                                        value={profileData.specialization}
                                        onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                                        placeholder="e.g., Cardiology, Orthopedics"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingProfile(false);
                                            // Save profile API call here
                                        }}
                                        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setEditingProfile(false)}
                                        className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-slate-600">Name</p>
                                        <p className="font-medium text-slate-900">{profileData.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-slate-600">Email</p>
                                        <p className="font-medium text-slate-900">{profileData.email}</p>
                                    </div>
                                </div>
                                <div className="border-t pt-3">
                                    <button
                                        onClick={() => setEditingProfile(true)}
                                        className="w-full bg-indigo-50 text-indigo-600 py-2 rounded-lg hover:bg-indigo-100 font-medium"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 mb-8 shadow-lg">
                    <h2 className="text-3xl font-bold mb-2">Welcome back, Dr. {user?.name?.split(' ')[0]}! 👋</h2>
                    <p className="text-indigo-100">Manage patients, check symptoms with AI, and stay ahead of your practice</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition border-l-4 border-blue-600">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Total Consultations</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{totalConsultations}</p>
                                <p className="text-xs text-green-600 mt-2">+12% from last month</p>
                            </div>
                            <Clock className="w-8 h-8 text-blue-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition border-l-4 border-emerald-600">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Completed Today</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{completedAppointments}</p>
                                <p className="text-xs text-green-600 mt-2">Great progress! 🎉</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-emerald-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition border-l-4 border-purple-600">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Pending Appointments</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{pendingAppointments}</p>
                                <p className="text-xs text-amber-600 mt-2">Need attention</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-purple-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition border-l-4 border-orange-600">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">AI Diagnoses</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">23</p>
                                <p className="text-xs text-emerald-600 mt-2">+5% accuracy rate</p>
                            </div>
                            <Zap className="w-8 h-8 text-orange-600 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-slate-200">
                    {['overview', 'patients', 'ai-checker', 'analytics'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 font-medium transition border-b-2 -mb-px ${
                                activeTab === tab
                                    ? 'text-indigo-600 border-indigo-600'
                                    : 'text-slate-600 border-transparent hover:text-slate-900'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Upcoming Appointments */}
                        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-indigo-600" />
                                Upcoming Appointments (Next 3)
                            </h3>
                            <div className="space-y-3">
                                {upcomingAppointments.length > 0 ? (
                                    upcomingAppointments.map((apt, idx) => (
                                        <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-medium text-slate-900">Patient ID: {apt.patientId}</p>
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        📅 {new Date(apt.date).toLocaleDateString()} at {new Date(apt.date).toLocaleTimeString()}
                                                    </p>
                                                    <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                                        {apt.status}
                                                    </span>
                                                </div>
                                                <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-medium text-sm">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 text-center py-8">No upcoming appointments</p>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowAIChecker(!showAIChecker)}
                                    className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg font-medium transition"
                                >
                                    <Zap className="w-5 h-5" />
                                    AI Symptom Checker
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:shadow-lg font-medium transition">
                                    <Plus className="w-5 h-5" />
                                    Create Prescription
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:shadow-lg font-medium transition">
                                    <MessageSquare className="w-5 h-5" />
                                    Message Patient
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Patients Tab */}
                {activeTab === 'patients' && (
                    <div>
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search patients by name or contact..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedPatient(patient)}
                                        className="bg-white rounded-lg p-5 shadow-sm hover:shadow-lg cursor-pointer transition border border-slate-200"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                                                {patient.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-900">{patient.name}</p>
                                                <p className="text-sm text-slate-600">{patient.contact}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                                        {patient.age} yrs
                                                    </span>
                                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                                                        {patient.gender}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="w-full mt-4 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-medium text-sm">
                                            View Timeline
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-center py-8 col-span-full">No patients found</p>
                            )}
                        </div>
                    </div>
                )}

                {/* AI Checker Tab */}
                {activeTab === 'ai-checker' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg p-8 shadow-sm">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">🤖 AI Symptom Checker</h3>
                            <p className="text-slate-600 mb-6">Describe patient symptoms to get AI-assisted diagnosis</p>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Patient Symptoms</label>
                                <textarea
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                    placeholder="e.g., Fever (38.5°C), persistent cough for 5 days, difficulty breathing..."
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-32"
                                />
                            </div>

                            <button
                                onClick={handleAICheck}
                                disabled={loadingAI || !symptoms.trim()}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loadingAI ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5" />
                                        Get AI Analysis
                                    </>
                                )}
                            </button>

                            {aiResponse && (
                                <div className="mt-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-indigo-600" />
                                        AI Analysis Result
                                    </h4>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-slate-600 font-medium">Possible Conditions:</p>
                                            <div className="mt-2 space-y-2">
                                                {aiResponse.conditions?.map((condition, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                                                        <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                                        <span className="text-slate-700">{condition}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm text-slate-600 font-medium">Risk Level:</p>
                                            <span className={`inline-block mt-1 px-4 py-2 rounded-full font-bold text-white ${
                                                aiResponse.riskLevel === 'High' ? 'bg-red-600' :
                                                aiResponse.riskLevel === 'Moderate' ? 'bg-amber-600' :
                                                'bg-green-600'
                                            }`}>
                                                {aiResponse.riskLevel || 'Unknown'}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-sm text-slate-600 font-medium">Recommendation:</p>
                                            <p className="mt-2 text-slate-700 p-3 bg-white rounded border border-slate-200">
                                                {aiResponse.message || 'Consult with specialist if symptoms persist.'}
                                            </p>
                                        </div>

                                        <button className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center gap-2">
                                            <Download className="w-4 h-4" />
                                            Generate Report
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-indigo-600" />
                                Consultation Trends
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={analyticsData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="consultations" stroke="#4f46e5" strokeWidth={2} />
                                    <Line type="monotone" dataKey="diagnoses" stroke="#9333ea" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                                Prescriptions Issued
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analyticsData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="prescriptions" fill="#4f46e5" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DoctorDashboard;
