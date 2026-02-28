import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    Search, Plus, Settings, LogOut, Calendar, Clock, CheckCircle, AlertCircle,
    Phone, User, Mail, Users, TrendingUp, Eye, Edit2, Trash2, X, Save
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const ReceptionistDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('calendar');
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddPatient, setShowAddPatient] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '', phone: '' });

    const [newPatient, setNewPatient] = useState({
        name: '',
        age: '',
        gender: 'Male',
        contact: '',
        email: ''
    });

    const [newAppointment, setNewAppointment] = useState({
        patientId: '',
        doctorId: '',
        date: '',
        time: '',
        reason: ''
    });

    // Mock analytics data
    const appointmentStats = [
        { name: 'Completed', value: 24, color: '#10b981' },
        { name: 'Pending', value: 8, color: '#f59e0b' },
        { name: 'Cancelled', value: 3, color: '#ef4444' }
    ];

    const monthlyAppointments = [
        { month: 'Jan', appointments: 45, patients: 32 },
        { month: 'Feb', appointments: 52, patients: 38 },
        { month: 'Mar', appointments: 48, patients: 35 },
        { month: 'Apr', appointments: 61, patients: 44 },
        { month: 'May', appointments: 55, patients: 40 },
        { month: 'Jun', appointments: 67, patients: 48 }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const appointmentsRes = await axios.get('/api/appointments');
            const patientsRes = await axios.get('/api/patients');
            setAppointments(appointmentsRes.data);
            setPatients(patientsRes.data);
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

    const handleAddPatient = async () => {
        if (!newPatient.name || !newPatient.contact) {
            alert('Please fill required fields');
            return;
        }
        try {
            await axios.post('/api/patients', newPatient);
            setNewPatient({ name: '', age: '', gender: 'Male', contact: '', email: '' });
            setShowAddPatient(false);
            fetchData();
        } catch (error) {
            console.error('Error adding patient:', error);
        }
    };

    const handleAddAppointment = async () => {
        if (!newAppointment.patientId || !newAppointment.doctorId || !newAppointment.date) {
            alert('Please fill required fields');
            return;
        }
        try {
            await axios.post('/api/appointments', newAppointment);
            setNewAppointment({ patientId: '', doctorId: '', date: '', time: '', reason: '' });
            fetchData();
        } catch (error) {
            console.error('Error adding appointment:', error);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const calendarDays = generateCalendarDays();
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
    const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
    const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-50 to-red-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
            {/* Sticky Header */}
            <header className="sticky top-0 bg-white shadow-sm z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                            👨‍💼
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Receptionist Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowProfile(!showProfile)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition"
                            title="Profile Settings"
                        >
                            <Settings className="w-5 h-5 text-slate-600" />
                        </button>
                        <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold cursor-pointer">
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
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingProfile(false)}
                                        className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
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
                                <div className="flex items-center gap-3">
                                    <p className="text-sm text-slate-600">Name: <span className="font-medium">{profileData.name}</span></p>
                                </div>
                                <div className="border-t pt-3">
                                    <button
                                        onClick={() => setEditingProfile(true)}
                                        className="w-full bg-orange-50 text-orange-600 py-2 rounded-lg hover:bg-orange-100 font-medium"
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
                <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl p-6 mb-8 shadow-lg">
                    <h2 className="text-3xl font-bold mb-2">Welcome, {user?.name?.split(' ')[0]}! 👋</h2>
                    <p className="text-orange-100">Manage appointments, register patients, and keep the clinic running smoothly</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition border-l-4 border-blue-600">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Total Appointments</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{totalAppointments}</p>
                                <p className="text-xs text-green-600 mt-2">+18% this month</p>
                            </div>
                            <Calendar className="w-8 h-8 text-blue-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition border-l-4 border-emerald-600">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Completed</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{completedAppointments}</p>
                                <p className="text-xs text-green-600 mt-2">Successful ✓</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-emerald-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition border-l-4 border-amber-600">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Pending</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{pendingAppointments}</p>
                                <p className="text-xs text-amber-600 mt-2">Need confirmation</p>
                            </div>
                            <Clock className="w-8 h-8 text-amber-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition border-l-4 border-red-600">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Total Patients</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{patients.length}</p>
                                <p className="text-xs text-green-600 mt-2">+5 new patients</p>
                            </div>
                            <Users className="w-8 h-8 text-red-600 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-slate-200">
                    {['calendar', 'appointments', 'patients', 'analytics'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 font-medium transition border-b-2 -mb-px ${
                                activeTab === tab
                                    ? 'text-orange-600 border-orange-600'
                                    : 'text-slate-600 border-transparent hover:text-slate-900'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Calendar Tab */}
                {activeTab === 'calendar' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900">Calendar View</h3>
                                <div className="flex items-center gap-4">
                                    <button onClick={previousMonth} className="p-2 hover:bg-slate-100 rounded-lg">
                                        ←
                                    </button>
                                    <span className="font-bold text-slate-900 min-w-[150px] text-center">
                                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg">
                                        →
                                    </button>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <div key={day} className="text-center font-bold text-slate-600 py-2 text-sm">
                                        {day}
                                    </div>
                                ))}
                                {calendarDays.map((day, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => day && setSelectedDate(day)}
                                        className={`p-3 rounded-lg text-center cursor-pointer transition ${
                                            day
                                                ? selectedDate === day
                                                    ? 'bg-orange-600 text-white font-bold'
                                                    : 'bg-slate-100 hover:bg-slate-200'
                                                : 'bg-white'
                                        }`}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowAddPatient(true)}
                                    className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg font-medium transition"
                                >
                                    <Plus className="w-5 h-5" />
                                    Register Patient
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:shadow-lg font-medium transition">
                                    <Calendar className="w-5 h-5" />
                                    Add Appointment
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:shadow-lg font-medium transition">
                                    <Clock className="w-5 h-5" />
                                    View Schedule
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                    <div>
                        <div className="mb-6 flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search appointments..."
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <button className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                New Appointment
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {appointments.slice(0, 6).map((apt, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition border-l-4 border-orange-600">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-bold text-slate-900">Appointment #{apt._id?.slice(-4)}</p>
                                            <p className="text-sm text-slate-600 mt-1">
                                                📅 {new Date(apt.date).toLocaleDateString()}
                                            </p>
                                            <div className="flex gap-2 mt-2">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                    apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {apt.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg">
                                                <Edit2 className="w-4 h-4 text-blue-600" />
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 rounded-lg">
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Patients Tab */}
                {activeTab === 'patients' && (
                    <div>
                        <div className="mb-6 flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search patients..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <button
                                onClick={() => setShowAddPatient(true)}
                                className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                New Patient
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredPatients.map((patient, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-5 shadow-sm hover:shadow-lg transition border border-slate-200">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-600">
                                            {patient.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900">{patient.name}</p>
                                            <p className="text-xs text-slate-600">{patient.contact}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-slate-600">Age:</span> {patient.age}</p>
                                        <p><span className="text-slate-600">Gender:</span> {patient.gender}</p>
                                    </div>
                                    <button className="w-full mt-4 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 font-medium text-sm">
                                        View Profile
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Appointment Status</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={appointmentStats} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                                        {appointmentStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Monthly Trends</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyAppointments}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="appointments" fill="#f97316" />
                                    <Bar dataKey="patients" fill="#ea580c" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </main>

            {/* Add Patient Modal */}
            {showAddPatient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900">Register New Patient</h2>
                            <button onClick={() => setShowAddPatient(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    value={newPatient.name}
                                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                                    placeholder="Enter patient name"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                                    <input
                                        type="number"
                                        value={newPatient.age}
                                        onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                                        placeholder="Enter age"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                                    <select
                                        value={newPatient.gender}
                                        onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number *</label>
                                <input
                                    type="tel"
                                    value={newPatient.contact}
                                    onChange={(e) => setNewPatient({ ...newPatient, contact: e.target.value })}
                                    placeholder="Enter phone number"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={newPatient.email}
                                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                                    placeholder="Enter email"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div className="flex gap-2 mt-6">
                                <button
                                    onClick={handleAddPatient}
                                    className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 font-medium"
                                >
                                    Register Patient
                                </button>
                                <button
                                    onClick={() => setShowAddPatient(false)}
                                    className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceptionistDashboard;
