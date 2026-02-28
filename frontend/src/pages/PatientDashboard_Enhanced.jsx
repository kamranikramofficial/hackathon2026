import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    Clock, FileText, Heart, Download, MessageSquare, Calendar, Pill, AlertCircle,
    Settings, LogOut, User, Phone, TrendingUp, Zap, Shield, Eye, EyeOff, X, Save
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('timeline');
    const [timeline, setTimeline] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [showProfile, setShowProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        age: '',
        gender: '',
        bloodType: '',
        allergies: ''
    });

    // Mock health metrics
    const healthMetrics = [
        { month: 'Jan', bp: 120, heartRate: 72, weight: 75 },
        { month: 'Feb', bp: 118, heartRate: 70, weight: 74.5 },
        { month: 'Mar', bp: 122, heartRate: 73, weight: 75.5 },
        { month: 'Apr', bp: 119, heartRate: 71, weight: 74 },
        { month: 'May', bp: 120, heartRate: 72, weight: 74.2 },
        { month: 'Jun', bp: 118, heartRate: 70, weight: 73.8 }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const timelineRes = await axios.get('/api/patients/me/timeline');
            const appointmentsRes = await axios.get('/api/appointments');
            const prescriptionsRes = await axios.get('/api/prescriptions');
            
            setTimeline(timelineRes.data || []);
            setAppointments(appointmentsRes.data || []);
            setPrescriptions(prescriptionsRes.data || []);
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

    const upcomingAppointments = appointments
        .filter(a => a.status === 'pending' || a.status === 'confirmed')
        .slice(0, 3);

    const recentPrescriptions = prescriptions.slice(0, 3);

    // Calculate health score
    const healthScore = 78; // Mock value

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-teal-50 to-green-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading your health dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50">
            {/* Sticky Header */}
            <header className="sticky top-0 bg-white shadow-sm z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                            ❤️
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Patient Portal</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowProfile(!showProfile)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition"
                            title="Profile Settings"
                        >
                            <Settings className="w-5 h-5 text-slate-600" />
                        </button>
                        <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold cursor-pointer">
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
                            <h2 className="text-xl font-bold text-slate-900">Health Profile</h2>
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
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                                        <input
                                            type="number"
                                            value={profileData.age}
                                            onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                                        <select
                                            value={profileData.gender}
                                            onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            <option>Select</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Blood Type</label>
                                    <select
                                        value={profileData.bloodType}
                                        onChange={(e) => setProfileData({ ...profileData, bloodType: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option>Select Blood Type</option>
                                        <option>O+</option>
                                        <option>O-</option>
                                        <option>A+</option>
                                        <option>A-</option>
                                        <option>B+</option>
                                        <option>B-</option>
                                        <option>AB+</option>
                                        <option>AB-</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Allergies (if any)</label>
                                    <input
                                        type="text"
                                        value={profileData.allergies}
                                        onChange={(e) => setProfileData({ ...profileData, allergies: e.target.value })}
                                        placeholder="e.g., Penicillin, Peanuts"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingProfile(false)}
                                        className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save
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
                                <div>
                                    <p className="text-sm text-slate-600">Name</p>
                                    <p className="font-medium text-slate-900">{profileData.name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-600">Age</p>
                                        <p className="font-medium text-slate-900">{profileData.age || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600">Blood Type</p>
                                        <p className="font-medium text-slate-900">{profileData.bloodType || 'Not set'}</p>
                                    </div>
                                </div>
                                {profileData.allergies && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-xs text-red-600 font-bold">⚠️ ALLERGIES</p>
                                        <p className="text-sm text-red-700">{profileData.allergies}</p>
                                    </div>
                                )}
                                <div className="border-t pt-3">
                                    <button
                                        onClick={() => setEditingProfile(true)}
                                        className="w-full bg-teal-50 text-teal-600 py-2 rounded-lg hover:bg-teal-100 font-medium"
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
                <div className="bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-xl p-6 mb-8 shadow-lg">
                    <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
                    <p className="text-teal-100">Your health is our priority. Keep track of your medical records and appointments</p>
                </div>

                {/* Health Score & Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition border-l-4 border-teal-600">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Health Score</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{healthScore}%</p>
                                <p className="text-xs text-green-600 mt-2">Great! Keep it up 💪</p>
                            </div>
                            <Heart className="w-8 h-8 text-teal-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition border-l-4 border-emerald-600">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Upcoming Appointments</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{upcomingAppointments.length}</p>
                                <p className="text-xs text-blue-600 mt-2">Next scheduled visit</p>
                            </div>
                            <Calendar className="w-8 h-8 text-emerald-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition border-l-4 border-purple-600">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Active Prescriptions</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{recentPrescriptions.length}</p>
                                <p className="text-xs text-purple-600 mt-2">Current medications</p>
                            </div>
                            <Pill className="w-8 h-8 text-purple-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition border-l-4 border-orange-600">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Medical Records</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{timeline.length}</p>
                                <p className="text-xs text-orange-600 mt-2">Timeline entries</p>
                            </div>
                            <FileText className="w-8 h-8 text-orange-600 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-slate-200">
                    {['timeline', 'appointments', 'prescriptions', 'health-metrics'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 font-medium transition border-b-2 -mb-px ${
                                activeTab === tab
                                    ? 'text-teal-600 border-teal-600'
                                    : 'text-slate-600 border-transparent hover:text-slate-900'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                        </button>
                    ))}
                </div>

                {/* Timeline Tab */}
                {activeTab === 'timeline' && (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-teal-600" />
                            Medical History Timeline
                        </h3>

                        {timeline.length > 0 ? (
                            <div className="space-y-4">
                                {timeline.map((entry, idx) => (
                                    <div key={idx} className="border-l-4 border-teal-600 pl-4 pb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                {entry.type === 'prescription' ? <Pill className="w-5 h-5 text-teal-600" /> : <FileText className="w-5 h-5 text-teal-600" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-900">{entry.type?.charAt(0).toUpperCase() + entry.type?.slice(1)}</p>
                                                <p className="text-sm text-slate-600 mt-1">{entry.notes || entry.description || 'Medical record'}</p>
                                                <p className="text-xs text-slate-500 mt-2">
                                                    📅 {new Date(entry.date || entry.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {entry.pdfUrl && (
                                                <a
                                                    href={entry.pdfUrl}
                                                    download
                                                    className="flex items-center gap-1 px-3 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 text-sm font-medium"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-8">No medical records yet</p>
                        )}
                    </div>
                )}

                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                    <div>
                        <div className="mb-6">
                            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Book Appointment
                            </button>
                        </div>

                        <div className="space-y-4">
                            {upcomingAppointments.length > 0 ? (
                                upcomingAppointments.map((apt, idx) => (
                                    <div key={idx} className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition border-l-4 border-teal-600">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-bold text-slate-900">Appointment</p>
                                                <p className="text-sm text-slate-600 mt-1">
                                                    📅 {new Date(apt.date).toLocaleDateString()} at {new Date(apt.date).toLocaleTimeString()}
                                                </p>
                                                <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                                                    apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                    apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {apt.status}
                                                </span>
                                            </div>
                                            <button className="px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 font-medium text-sm">
                                                Message Doctor
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 bg-white rounded-lg">
                                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                                    <p className="text-slate-600">No upcoming appointments</p>
                                    <button className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium">
                                        Schedule First Appointment
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Prescriptions Tab */}
                {activeTab === 'prescriptions' && (
                    <div className="grid gap-4">
                        {recentPrescriptions.length > 0 ? (
                            recentPrescriptions.map((rx, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 flex items-center gap-2">
                                                <Pill className="w-5 h-5 text-purple-600" />
                                                Prescription #{rx._id?.slice(-4)}
                                            </p>
                                            <p className="text-sm text-slate-600 mt-2">
                                                <span className="font-medium">Doctor:</span> Dr. {rx.doctorId}
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                <span className="font-medium">Date:</span> {new Date(rx.createdAt).toLocaleDateString()}
                                            </p>
                                            {rx.instructions && (
                                                <p className="text-sm text-slate-600 mt-2">
                                                    <span className="font-medium">Instructions:</span> {rx.instructions}
                                                </p>
                                            )}
                                        </div>
                                        {rx.pdfUrl && (
                                            <a
                                                href={rx.pdfUrl}
                                                download
                                                className="flex items-center gap-1 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium text-sm whitespace-nowrap"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download PDF
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg">
                                <Pill className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-600">No prescriptions yet</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Health Metrics Tab */}
                {activeTab === 'health-metrics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-teal-600" />
                                Blood Pressure Trend
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={healthMetrics}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="bp" name="BP (mmHg)" stroke="#14b8a6" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-red-600" />
                                Heart Rate & Weight
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={healthMetrics}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="heartRate" name="Heart Rate (bpm)" fill="#14b8a6" />
                                    <Bar dataKey="weight" name="Weight (kg)" fill="#06b6d4" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PatientDashboard;
