import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    Search, Plus, Settings, LogOut, Calendar, Clock, CheckCircle, AlertCircle,
    Phone, User, Mail, Users, TrendingUp, Eye, Edit2, Trash2, X, Save,
    Stethoscope, Activity, FileText, RefreshCw, ChevronLeft, ChevronRight,
    Filter, Download, MoreVertical, Bell, UserPlus
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import axiosInstance from '../api/axiosInstance';

const ReceptionistDashboard_Enhanced = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    
    // State
    const [activeTab, setActiveTab] = useState('calendar');
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [doctorActivities, setDoctorActivities] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Calendar statef
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Search and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    
    // Modals
    const [showAddPatient, setShowAddPatient] = useState(false);
    const [showAddAppointment, setShowAddAppointment] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    
    // Form data
    const [newPatient, setNewPatient] = useState({
        name: '',
        age: '',
        gender: 'Male',
        contact: '',
        email: '',
        address: '',
        bloodGroup: ''
    });
    
    const [newAppointment, setNewAppointment] = useState({
        patientId: '',
        doctorId: '',
        date: '',
        time: '',
        reason: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [appointmentsRes, patientsRes, doctorActivitiesRes, analyticsRes] = await Promise.all([
                axiosInstance.get('/appointments').catch(() => ({ data: [] })),
                axiosInstance.get('/patients').catch(() => ({ data: [] })),
                axiosInstance.get('/admin/doctor-activities').catch(() => ({ data: [] })),
                axiosInstance.get('/admin/analytics').catch(() => ({ data: null }))
            ]);

            setAppointments(Array.isArray(appointmentsRes.data) ? appointmentsRes.data : []);
            setPatients(Array.isArray(patientsRes.data) ? patientsRes.data : []);
            setDoctorActivities(Array.isArray(doctorActivitiesRes.data) ? doctorActivitiesRes.data : []);
            setAnalytics(analyticsRes.data);
            
            // Extract doctors from activities
            setDoctors(Array.isArray(doctorActivitiesRes.data) ? doctorActivitiesRes.data : []);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // Calendar helpers
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        const days = [];
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const getAppointmentsForDate = (date) => {
        if (!date) return [];
        const dateStr = date.toISOString().split('T')[0];
        return (Array.isArray(appointments) ? appointments : []).filter(apt => {
            const aptDate = new Date(apt.date).toISOString().split('T')[0];
            return aptDate === dateStr;
        });
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    // Filter appointments for selected date
    const selectedDateAppointments = getAppointmentsForDate(new Date(selectedDate));
    
    // Filter patients
    const filteredPatients = (Array.isArray(patients) ? patients : []).filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.contact?.includes(searchQuery)
    );

    // Stats
    const todayAppointments = getAppointmentsForDate(new Date());
    const completedToday = todayAppointments.filter(a => a.status === 'completed').length;
    const pendingToday = todayAppointments.filter(a => a.status === 'scheduled').length;

    // Add patient
    const handleAddPatient = async () => {
        if (!newPatient.name || !newPatient.contact) {
            setError('Please fill required fields');
            return;
        }
        try {
            await axiosInstance.post('/patients', newPatient);
            setNewPatient({ name: '', age: '', gender: 'Male', contact: '', email: '', address: '', bloodGroup: '' });
            setShowAddPatient(false);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add patient');
        }
    };

    // Add appointment
    const handleAddAppointment = async () => {
        if (!newAppointment.patientId || !newAppointment.doctorId || !newAppointment.date) {
            setError('Please fill required fields');
            return;
        }
        try {
            await axiosInstance.post('/appointments', newAppointment);
            setNewAppointment({ patientId: '', doctorId: '', date: '', time: '', reason: '' });
            setShowAddAppointment(false);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add appointment');
        }
    };

    // Update appointment status
    const updateAppointmentStatus = async (id, status) => {
        try {
            await axiosInstance.put(`/appointments/${id}`, { status });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update appointment');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

    const appointmentStats = [
        { name: 'Completed', value: analytics?.appointmentsByStatus?.completed || 0 },
        { name: 'Scheduled', value: analytics?.appointmentsByStatus?.scheduled || 0 },
        { name: 'Cancelled', value: analytics?.appointmentsByStatus?.cancelled || 0 }
    ];

    const tabs = [
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'patients', label: 'Patients', icon: Users },
        { id: 'doctors', label: 'Doctor Activity', icon: Stethoscope },
        { id: 'analytics', label: 'Analytics', icon: Activity }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Receptionist Dashboard</h1>
                            <p className="text-sm text-gray-500">Manage appointments, patients and view doctor activities</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={fetchData}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="hidden md:block">
                                    <p className="font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500">Receptionist</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Error Alert */}
            {error && (
                <div className="max-w-7xl mx-auto px-6 pt-4">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700">{error}</span>
                        <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-6 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Today's Appointments</p>
                                <p className="text-3xl font-bold text-gray-900">{todayAppointments.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-sm">
                            <span className="text-green-600">{completedToday} completed</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-blue-600">{pendingToday} pending</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Patients</p>
                                <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowAddPatient(true)}
                            className="mt-3 text-sm text-green-600 font-medium hover:text-green-700 flex items-center gap-1"
                        >
                            <UserPlus className="w-4 h-4" /> Add New Patient
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Active Doctors</p>
                                <p className="text-3xl font-bold text-gray-900">{doctorActivities.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Stethoscope className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-3 text-sm text-gray-500">
                            {doctorActivities.filter(d => d.stats?.todayAppointments > 0).length} available today
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">All Appointments</p>
                                <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowAddAppointment(true)}
                            className="mt-3 text-sm text-orange-600 font-medium hover:text-orange-700 flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> Schedule Appointment
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="flex space-x-2 border-b border-gray-200">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 -mb-px ${
                                    activeTab === tab.id
                                        ? 'text-green-600 border-green-600'
                                        : 'text-gray-500 border-transparent hover:text-gray-700'
                                }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Calendar Tab */}
                        {activeTab === 'calendar' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Calendar */}
                                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </h3>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => navigateMonth(-1)}
                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => navigateMonth(1)}
                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Calendar Grid */}
                                    <div className="grid grid-cols-7 gap-1">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                                {day}
                                            </div>
                                        ))}
                                        {getDaysInMonth(currentDate).map((day, index) => {
                                            if (!day) return <div key={`empty-${index}`} className="p-2"></div>;
                                            
                                            const dateStr = day.toISOString().split('T')[0];
                                            const dayAppointments = getAppointmentsForDate(day);
                                            const isSelected = selectedDate === dateStr;
                                            const isToday = new Date().toISOString().split('T')[0] === dateStr;
                                            
                                            return (
                                                <button
                                                    key={dateStr}
                                                    onClick={() => setSelectedDate(dateStr)}
                                                    className={`p-2 text-center rounded-lg transition relative ${
                                                        isSelected ? 'bg-green-600 text-white' :
                                                        isToday ? 'bg-green-100 text-green-700' :
                                                        'hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <span className="text-sm font-medium">{day.getDate()}</span>
                                                    {dayAppointments.length > 0 && (
                                                        <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                                                            isSelected ? 'bg-white' : 'bg-green-500'
                                                        }`}></span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Selected Date Appointments */}
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-900">
                                            {new Date(selectedDate).toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </h3>
                                        <button
                                            onClick={() => setShowAddAppointment(true)}
                                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {selectedDateAppointments.length > 0 ? (
                                            selectedDateAppointments.map(apt => (
                                                <div key={apt._id} className="p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {apt.patientId?.name || 'Unknown'}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Dr. {apt.doctorId?.name || 'Unknown'}
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {apt.time || 'Time not set'} - {apt.reason || 'No reason'}
                                                            </p>
                                                        </div>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(apt.status)}`}>
                                                            {apt.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2 mt-3">
                                                        <button
                                                            onClick={() => updateAppointmentStatus(apt._id, 'completed')}
                                                            className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                                        >
                                                            Complete
                                                        </button>
                                                        <button
                                                            onClick={() => updateAppointmentStatus(apt._id, 'cancelled')}
                                                            className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <p>No appointments for this date</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Patients Tab */}
                        {activeTab === 'patients' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search patients..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        <button
                                            onClick={() => setShowAddPatient(true)}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            <UserPlus className="w-5 h-5" />
                                            Add Patient
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Age/Gender</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Blood Group</th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredPatients.map(patient => (
                                                <tr key={patient._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold">
                                                                {patient.name?.charAt(0)?.toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{patient.name}</div>
                                                                <div className="text-sm text-gray-500">{patient.email || 'No email'}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {patient.age || '-'} / {patient.gender || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {patient.contact}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                                                            {patient.bloodGroup || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => {
                                                                setNewAppointment({ ...newAppointment, patientId: patient._id });
                                                                setShowAddAppointment(true);
                                                            }}
                                                            className="text-green-600 hover:text-green-700 font-medium text-sm"
                                                        >
                                                            Schedule
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {filteredPatients.length === 0 && (
                                        <div className="text-center py-12 text-gray-500">
                                            No patients found
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Doctor Activity Tab */}
                        {activeTab === 'doctors' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {doctorActivities.map(doctor => (
                                        <div key={doctor._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                                    {doctor.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                                                    <p className="text-sm text-gray-500">{doctor.specialization || 'General Physician'}</p>
                                                    <span className={`inline-flex mt-1 px-2 py-0.5 text-xs rounded-full ${
                                                        doctor.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {doctor.status || 'active'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                    <p className="text-2xl font-bold text-blue-600">{doctor.stats?.todayAppointments || 0}</p>
                                                    <p className="text-xs text-gray-600">Today</p>
                                                </div>
                                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                                    <p className="text-2xl font-bold text-green-600">{doctor.stats?.completedToday || 0}</p>
                                                    <p className="text-xs text-gray-600">Completed</p>
                                                </div>
                                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                                    <p className="text-2xl font-bold text-purple-600">{doctor.stats?.totalAppointments || 0}</p>
                                                    <p className="text-xs text-gray-600">Total Appts</p>
                                                </div>
                                                <div className="text-center p-3 bg-orange-50 rounded-lg">
                                                    <p className="text-2xl font-bold text-orange-600">{doctor.stats?.totalPrescriptions || 0}</p>
                                                    <p className="text-xs text-gray-600">Prescriptions</p>
                                                </div>
                                            </div>

                                            {doctor.recentActivity?.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h5>
                                                    <div className="space-y-2">
                                                        {doctor.recentActivity.slice(0, 3).map((activity, i) => (
                                                            <div key={i} className="flex items-center gap-2 text-sm">
                                                                <User className="w-4 h-4 text-gray-400" />
                                                                <span className="text-gray-600">{activity.patientName}</span>
                                                                <span className={`ml-auto text-xs px-2 py-0.5 rounded ${
                                                                    activity.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                                }`}>
                                                                    {activity.status}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {doctorActivities.length === 0 && (
                                    <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
                                        <Stethoscope className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p>No doctor activities found</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Analytics Tab */}
                        {activeTab === 'analytics' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointments by Status</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={appointmentStats}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={100}
                                                dataKey="value"
                                            >
                                                {appointmentStats.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Summary</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Users className="w-8 h-8 text-blue-600" />
                                                <span className="font-medium text-gray-700">Total Patients</span>
                                            </div>
                                            <span className="text-2xl font-bold text-blue-600">{analytics?.totals?.patients || patients.length}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-8 h-8 text-green-600" />
                                                <span className="font-medium text-gray-700">Total Appointments</span>
                                            </div>
                                            <span className="text-2xl font-bold text-green-600">{analytics?.totals?.appointments || appointments.length}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-8 h-8 text-purple-600" />
                                                <span className="font-medium text-gray-700">Prescriptions Issued</span>
                                            </div>
                                            <span className="text-2xl font-bold text-purple-600">{analytics?.totals?.prescriptions || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Activity className="w-8 h-8 text-orange-600" />
                                                <span className="font-medium text-gray-700">AI Diagnoses</span>
                                            </div>
                                            <span className="text-2xl font-bold text-orange-600">{analytics?.totals?.diagnoses || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Add Patient Modal */}
            {showAddPatient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Add New Patient</h3>
                            <button onClick={() => setShowAddPatient(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    value={newPatient.name}
                                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter patient name"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                    <input
                                        type="number"
                                        value={newPatient.age}
                                        onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="Age"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        value={newPatient.gender}
                                        onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact *</label>
                                <input
                                    type="tel"
                                    value={newPatient.contact}
                                    onChange={(e) => setNewPatient({ ...newPatient, contact: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="Phone number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={newPatient.email}
                                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="patient@email.com"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                    <select
                                        value={newPatient.bloodGroup}
                                        onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">Select</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        value={newPatient.address}
                                        onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="Address"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddPatient(false)}
                                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddPatient}
                                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
                            >
                                Add Patient
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Appointment Modal */}
            {showAddAppointment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Schedule Appointment</h3>
                            <button onClick={() => setShowAddAppointment(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                                <select
                                    value={newAppointment.patientId}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, patientId: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Select Patient</option>
                                    {patients.map(p => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                                <select
                                    value={newAppointment.doctorId}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Select Doctor</option>
                                    {doctors.map(d => (
                                        <option key={d._id} value={d._id}>Dr. {d.name} - {d.specialization || 'General'}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                    <input
                                        type="date"
                                        value={newAppointment.date}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input
                                        type="time"
                                        value={newAppointment.time}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <textarea
                                    value={newAppointment.reason}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="Reason for visit"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddAppointment(false)}
                                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddAppointment}
                                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
                            >
                                Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceptionistDashboard_Enhanced;
