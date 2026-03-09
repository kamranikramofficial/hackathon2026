import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    Search, Plus, Settings, LogOut, BarChart3, Clock, CheckCircle,
    AlertCircle, Download, Send, User, Calendar, Pill, Zap, Heart,
    TrendingUp, MessageSquare, Phone, Eye, EyeOff, Save, X
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosInstance, { BACKEND_URL } from '../api/axiosInstance';

// Helper to get full PDF URL
const getPdfUrl = (pdfUrl) => {
    if (!pdfUrl) return null;
    if (pdfUrl.startsWith('http')) return pdfUrl;
    // If it's an absolute Windows path, extract just the filename
    if (pdfUrl.includes('\\') || pdfUrl.includes('C:')) {
        const fileName = pdfUrl.split(/[\\\/]/).pop();
        return `${BACKEND_URL}/uploads/prescriptions/${fileName}`;
    }
    return `${BACKEND_URL}${pdfUrl}`;
};

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
    const [prescriptionForm, setPrescriptionForm] = useState({ medicines: [{ name: '', dose: '' }], instructions: '' });
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '', phone: '', specialization: '' });
    const [editingProfile, setEditingProfile] = useState(false);
    
    // New state for modals
    const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showTimelineModal, setShowTimelineModal] = useState(false);
    const [patientTimeline, setPatientTimeline] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [savingPrescription, setSavingPrescription] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);

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
            const patientsRes = await axiosInstance.get('/patients');
            const appointmentsRes = await axiosInstance.get('/appointments');
            
            // Ensure data is always an array
            const patientsData = Array.isArray(patientsRes.data) ? patientsRes.data : [];
            const appointmentsData = Array.isArray(appointmentsRes.data) ? appointmentsRes.data : [];
            
            setPatients(patientsData);
            setAppointments(appointmentsData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Set to empty arrays on error
            setPatients([]);
            setAppointments([]);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredPatients = (Array.isArray(patients) ? patients : []).filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.contact.includes(searchQuery)
    );

    const handleAICheck = async () => {
        if (!symptoms.trim()) return;
        setLoadingAI(true);
        try {
            const res = await axiosInstance.post('/ai/diagnose', { symptoms });
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
        setPrescriptionForm({ ...prescriptionForm, medicines: newMedicines });
    };

    // View appointment details
    const handleViewAppointmentDetails = (apt) => {
        setSelectedAppointment(apt);
        setShowAppointmentDetails(true);
    };

    // Update appointment status
    const handleUpdateAppointmentStatus = async (aptId, newStatus) => {
        try {
            await axiosInstance.put(`/appointments/${aptId}`, { status: newStatus });
            setAppointments(appointments.map(apt => 
                apt._id === aptId ? { ...apt, status: newStatus } : apt
            ));
            setShowAppointmentDetails(false);
        } catch (error) {
            console.error('Error updating appointment:', error);
            alert('Failed to update appointment status');
        }
    };

    // Open prescription modal for patient
    const handleOpenPrescription = (patient = null) => {
        if (patient) setSelectedPatient(patient);
        setPrescriptionForm({ medicines: [{ name: '', dose: '' }], instructions: '' });
        setShowPrescriptionModal(true);
    };

    // Save prescription
    const handleSavePrescription = async () => {
        if (!selectedPatient) {
            alert('Please select a patient first');
            return;
        }
        if (prescriptionForm.medicines.some(m => !m.name || !m.dose)) {
            alert('Please fill in all medicine details');
            return;
        }
        
        setSavingPrescription(true);
        try {
            await axiosInstance.post('/prescriptions', {
                patientId: selectedPatient._id,
                medicines: prescriptionForm.medicines,
                instructions: prescriptionForm.instructions
            });
            alert('Prescription created successfully!');
            setShowPrescriptionModal(false);
            setPrescriptionForm({ medicines: [{ name: '', dose: '' }], instructions: '' });
            setSelectedPatient(null);
        } catch (error) {
            console.error('Error creating prescription:', error);
            alert(error.response?.data?.message || 'Failed to create prescription');
        }
        setSavingPrescription(false);
    };

    // Open message modal
    const handleOpenMessage = (patient = null) => {
        if (patient) setSelectedPatient(patient);
        setMessageText('');
        setShowMessageModal(true);
    };

    // Send message (simulated - you can integrate with real messaging service)
    const handleSendMessage = async () => {
        if (!selectedPatient || !messageText.trim()) {
            alert('Please select a patient and enter a message');
            return;
        }
        
        setSendingMessage(true);
        // Simulate sending message
        setTimeout(() => {
            alert(`Message sent to ${selectedPatient.name}!`);
            setShowMessageModal(false);
            setMessageText('');
            setSendingMessage(false);
        }, 1000);
    };

    // View patient timeline
    const handleViewTimeline = async (patient) => {
        setSelectedPatient(patient);
        try {
            const res = await axiosInstance.get(`/patients/${patient._id}/timeline`);
            setPatientTimeline(res.data);
            setShowTimelineModal(true);
        } catch (error) {
            console.error('Error fetching timeline:', error);
            // Show basic timeline modal anyway
            setPatientTimeline({ timeline: { appointments: [], prescriptions: [], diagnoses: [] } });
            setShowTimelineModal(true);
        }
    };

    const upcomingAppointments = appointments.filter(a => a.status === 'pending').slice(0, 3);
    const totalConsultations = appointments.length;
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
    const pendingAppointments = appointments.filter(a => a.status === 'pending').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-full">

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
                                                    <p className="font-medium text-slate-900">Patient: {apt.patientId?.name || 'Unknown'}</p>
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        📅 {new Date(apt.date).toLocaleDateString()} at {new Date(apt.date).toLocaleTimeString()}
                                                    </p>
                                                    <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                                        {apt.status}
                                                    </span>
                                                </div>
                                                <button 
                                                    onClick={() => handleViewAppointmentDetails(apt)}
                                                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-medium text-sm"
                                                >
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
                                    onClick={() => setActiveTab('ai-checker')}
                                    className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg font-medium transition"
                                >
                                    <Zap className="w-5 h-5" />
                                    AI Symptom Checker
                                </button>
                                <button 
                                    onClick={() => handleOpenPrescription()}
                                    className="w-full flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:shadow-lg font-medium transition"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create Prescription
                                </button>
                                <button 
                                    onClick={() => handleOpenMessage()}
                                    className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:shadow-lg font-medium transition"
                                >
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
                                        <div className="flex gap-2 mt-4">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleViewTimeline(patient); }}
                                                className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-medium text-sm"
                                            >
                                                View Timeline
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleOpenPrescription(patient); }}
                                                className="flex-1 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 font-medium text-sm"
                                            >
                                                Prescribe
                                            </button>
                                        </div>
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
                                            <p className="text-sm text-slate-600 font-medium mb-2">Risk Level:</p>
                                            <span className={`inline-block px-4 py-2 rounded-full font-bold text-white ${
                                                aiResponse.riskLevel === 'High' ? 'bg-red-600' :
                                                aiResponse.riskLevel === 'Moderate' ? 'bg-amber-600' :
                                                'bg-green-600'
                                            }`}>
                                                {aiResponse.riskLevel || 'Unknown'}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-sm text-slate-600 font-medium mb-2">Analysis:</p>
                                            <div className="p-4 bg-white rounded-lg border border-slate-200 whitespace-pre-line text-slate-700">
                                                {aiResponse.analysis || aiResponse.message || 'No analysis available'}
                                            </div>
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

            {/* Appointment Details Modal */}
            {showAppointmentDetails && selectedAppointment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900">Appointment Details</h2>
                            <button onClick={() => setShowAppointmentDetails(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-600">Patient</p>
                                <p className="font-bold text-slate-900">{selectedAppointment.patientId?.name || 'Unknown'}</p>
                                <p className="text-sm text-slate-600">{selectedAppointment.patientId?.contact || ''}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <p className="text-sm text-slate-600">Date</p>
                                    <p className="font-bold text-slate-900">{new Date(selectedAppointment.date).toLocaleDateString()}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <p className="text-sm text-slate-600">Time</p>
                                    <p className="font-bold text-slate-900">{new Date(selectedAppointment.date).toLocaleTimeString()}</p>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-600">Status</p>
                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                                    selectedAppointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    selectedAppointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-amber-100 text-amber-700'
                                }`}>
                                    {selectedAppointment.status}
                                </span>
                            </div>
                            
                            {selectedAppointment.reason && (
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <p className="text-sm text-slate-600">Reason</p>
                                    <p className="font-medium text-slate-900">{selectedAppointment.reason}</p>
                                </div>
                            )}
                            
                            <div className="flex gap-3 pt-4">
                                {selectedAppointment.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleUpdateAppointmentStatus(selectedAppointment._id, 'completed')}
                                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Mark Completed
                                        </button>
                                        <button
                                            onClick={() => handleUpdateAppointmentStatus(selectedAppointment._id, 'cancelled')}
                                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => {
                                        setShowAppointmentDetails(false);
                                        handleOpenPrescription(selectedAppointment.patientId);
                                    }}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center gap-2"
                                >
                                    <Pill className="w-4 h-4" />
                                    Create Prescription
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Prescription Modal */}
            {showPrescriptionModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900">Create Prescription</h2>
                            <button onClick={() => setShowPrescriptionModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {!selectedPatient ? (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Select Patient</label>
                                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
                                    {patients.map((patient, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedPatient(patient)}
                                            className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                                        >
                                            <p className="font-medium text-slate-900">{patient.name}</p>
                                            <p className="text-sm text-slate-600">{patient.contact}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4 p-3 bg-indigo-50 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-indigo-900">Patient: {selectedPatient.name}</p>
                                        <p className="text-sm text-indigo-700">{selectedPatient.contact}</p>
                                    </div>
                                    <button onClick={() => setSelectedPatient(null)} className="text-indigo-600 hover:text-indigo-800 text-sm">
                                        Change
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Medicines</label>
                                        {prescriptionForm.medicines.map((med, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    placeholder="Medicine name"
                                                    value={med.name}
                                                    onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Dosage (e.g., 1 tab x 3)"
                                                    value={med.dose}
                                                    onChange={(e) => handleMedicineChange(idx, 'dose', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                                {prescriptionForm.medicines.length > 1 && (
                                                    <button
                                                        onClick={() => handleRemoveMedicine(idx)}
                                                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            onClick={handleAddMedicine}
                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Medicine
                                        </button>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Instructions</label>
                                        <textarea
                                            value={prescriptionForm.instructions}
                                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })}
                                            placeholder="Additional instructions for the patient..."
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
                                        />
                                    </div>
                                    
                                    <button
                                        onClick={handleSavePrescription}
                                        disabled={savingPrescription}
                                        className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {savingPrescription ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Save Prescription
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Message Patient Modal */}
            {showMessageModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900">Message Patient</h2>
                            <button onClick={() => setShowMessageModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {!selectedPatient ? (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Select Patient</label>
                                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
                                    {patients.map((patient, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedPatient(patient)}
                                            className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                                        >
                                            <p className="font-medium text-slate-900">{patient.name}</p>
                                            <p className="text-sm text-slate-600">{patient.contact}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-blue-900">To: {selectedPatient.name}</p>
                                        <p className="text-sm text-blue-700">{selectedPatient.contact}</p>
                                    </div>
                                    <button onClick={() => setSelectedPatient(null)} className="text-blue-600 hover:text-blue-800 text-sm">
                                        Change
                                    </button>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                    <textarea
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        placeholder="Type your message here..."
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
                                    />
                                </div>
                                
                                <button
                                    onClick={handleSendMessage}
                                    disabled={sendingMessage || !messageText.trim()}
                                    className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {sendingMessage ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Patient Timeline Modal */}
            {showTimelineModal && selectedPatient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900">Patient Timeline</h2>
                            <button onClick={() => setShowTimelineModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
                            <p className="font-bold text-indigo-900">{selectedPatient.name}</p>
                            <p className="text-sm text-indigo-700">{selectedPatient.contact} • {selectedPatient.age} yrs • {selectedPatient.gender}</p>
                        </div>
                        
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {patientTimeline?.timeline?.appointments?.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-indigo-600" />
                                        Appointments
                                    </h4>
                                    {patientTimeline.timeline.appointments.map((apt, idx) => (
                                        <div key={idx} className="p-3 bg-slate-50 rounded-lg mb-2">
                                            <p className="font-medium text-slate-900">{new Date(apt.date).toLocaleDateString()}</p>
                                            <p className="text-sm text-slate-600">Status: {apt.status}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {patientTimeline?.timeline?.prescriptions?.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                        <Pill className="w-4 h-4 text-purple-600" />
                                        Prescriptions
                                    </h4>
                                    {patientTimeline.timeline.prescriptions.map((rx, idx) => (
                                        <div key={idx} className="p-3 bg-slate-50 rounded-lg mb-2 flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-slate-900">{new Date(rx.createdAt).toLocaleDateString()}</p>
                                                <p className="text-sm text-slate-600">{rx.medicines?.length || 0} medicines prescribed</p>
                                            </div>
                                            {rx.pdfUrl && (
                                                <a
                                                    href={getPdfUrl(rx.pdfUrl)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 text-sm font-medium"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {patientTimeline?.timeline?.diagnoses?.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-amber-600" />
                                        AI Diagnoses
                                    </h4>
                                    {patientTimeline.timeline.diagnoses.map((diag, idx) => (
                                        <div key={idx} className="p-3 bg-slate-50 rounded-lg mb-2">
                                            <p className="font-medium text-slate-900">{new Date(diag.createdAt).toLocaleDateString()}</p>
                                            <p className="text-sm text-slate-600">Risk: {diag.riskLevel}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {(!patientTimeline?.timeline?.appointments?.length && 
                              !patientTimeline?.timeline?.prescriptions?.length && 
                              !patientTimeline?.timeline?.diagnoses?.length) && (
                                <p className="text-center text-slate-500 py-8">No timeline data available</p>
                            )}
                        </div>
                        
                        <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200">
                            <button
                                onClick={() => {
                                    setShowTimelineModal(false);
                                    handleOpenPrescription(selectedPatient);
                                }}
                                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center justify-center gap-2"
                            >
                                <Pill className="w-4 h-4" />
                                New Prescription
                            </button>
                            <button
                                onClick={() => {
                                    setShowTimelineModal(false);
                                    handleOpenMessage(selectedPatient);
                                }}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
