import React, { useState, useEffect } from 'react';
import { 
    Users, UserCheck, UserX, Shield, Activity, Search, 
    Trash2, Ban, CheckCircle, Eye, RefreshCw, 
    BarChart3, Calendar, Stethoscope, FileText, 
    TrendingUp, AlertCircle, Clock, Download, Filter,
    ChevronDown, MoreVertical, Edit, XCircle, Play
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const AdminDashboard  = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [doctorActivities, setDoctorActivities] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    
    // Modals
    const [selectedUser, setSelectedUser] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [usersRes, doctorsRes, analyticsRes, logsRes] = await Promise.all([
                axiosInstance.get('/admin/users').catch(() => ({ data: [] })),
                axiosInstance.get('/admin/doctor-activities').catch(() => ({ data: [] })),
                axiosInstance.get('/admin/analytics').catch(() => ({ data: null })),
                axiosInstance.get('/admin/activity-logs').catch(() => ({ data: [] }))
            ]);

            setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
            setDoctorActivities(Array.isArray(doctorsRes.data) ? doctorsRes.data : []);
            setAnalytics(analyticsRes.data);
            setActivityLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
        } catch (err) {
            console.error('Error fetching admin data:', err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // Update user status
    const handleUpdateStatus = async (userId, newStatus) => {
        setActionLoading(true);
        try {
            await axiosInstance.put(`/admin/users/${userId}/status`, { status: newStatus });
            await fetchData();
            setShowStatusModal(false);
            setSelectedUser(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    // Update user role
    const handleUpdateRole = async (userId, newRole) => {
        setActionLoading(true);
        try {
            await axiosInstance.put(`/admin/users/${userId}/role`, { role: newRole });
            await fetchData();
            setShowRoleModal(false);
            setSelectedUser(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update role');
        } finally {
            setActionLoading(false);
        }
    };

    // Delete user
    const handleDeleteUser = async (userId) => {
        setActionLoading(true);
        try {
            await axiosInstance.delete(`/admin/users/${userId}`);
            await fetchData();
            setShowDeleteModal(false);
            setSelectedUser(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setActionLoading(false);
        }
    };

    // Filter users
    const filteredUsers = (Array.isArray(users) ? users : []).filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Stats
    const activeUsers = users.filter(u => u.status === 'active').length;
    const blockedUsers = users.filter(u => u.status === 'blocked').length;
    const totalDoctors = users.filter(u => u.role === 'Doctor').length;
    const totalPatients = users.filter(u => u.role === 'Patient').length;

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    
    // Chart data
    const roleChartData = [
        { name: 'Doctors', value: analytics?.usersByRole?.Doctor || 0 },
        { name: 'Patients', value: analytics?.usersByRole?.Patient || 0 },
        { name: 'Receptionists', value: analytics?.usersByRole?.Receptionist || 0 },
        { name: 'Admins', value: analytics?.usersByRole?.Admin || 0 }
    ];

    const appointmentStatusData = [
        { name: 'Scheduled', value: analytics?.appointmentsByStatus?.scheduled || 0 },
        { name: 'Completed', value: analytics?.appointmentsByStatus?.completed || 0 },
        { name: 'Cancelled', value: analytics?.appointmentsByStatus?.cancelled || 0 }
    ];

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'doctors', label: 'Doctor Activity', icon: Stethoscope },
        { id: 'logs', label: 'Activity Logs', icon: Activity }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'blocked': return 'bg-red-100 text-red-800';
            case 'suspended': return 'bg-yellow-100 text-yellow-800';
            case 'deleted': return 'bg-gray-100 text-gray-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Admin': return 'bg-purple-100 text-purple-800';
            case 'Doctor': return 'bg-blue-100 text-blue-800';
            case 'Receptionist': return 'bg-green-100 text-green-800';
            case 'Patient': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage users, monitor activities, and system analytics</p>
                    </div>
                    <button 
                        onClick={fetchData}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700">{error}</span>
                        <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
                            <XCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Users</p>
                            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm">
                        <span className="text-green-600 font-medium">{activeUsers} active</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-red-600 font-medium">{blockedUsers} blocked</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Doctors</p>
                            <p className="text-3xl font-bold text-gray-900">{totalDoctors}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                        {doctorActivities.filter(d => d.stats?.todayAppointments > 0).length} active today
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Patients</p>
                            <p className="text-3xl font-bold text-gray-900">{analytics?.totals?.patients || totalPatients}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <UserCheck className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                        {analytics?.totals?.appointments || 0} total appointments
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">AI Diagnoses</p>
                            <p className="text-3xl font-bold text-gray-900">{analytics?.totals?.diagnoses || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <Activity className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                        {analytics?.totals?.prescriptions || 0} prescriptions issued
                    </div>
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
                                    ? 'text-blue-600 border-blue-600'
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
                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            ) : (
                <>
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Users by Role Chart */}
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={roleChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {roleChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Appointment Status */}
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointments by Status</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={appointmentStatusData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Recent Activities */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
                                <div className="space-y-4">
                                    {activityLogs.slice(0, 10).map((log, index) => (
                                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                log.type === 'appointment' ? 'bg-blue-100' :
                                                log.type === 'prescription' ? 'bg-green-100' : 'bg-purple-100'
                                            }`}>
                                                {log.type === 'appointment' && <Calendar className="w-5 h-5 text-blue-600" />}
                                                {log.type === 'prescription' && <FileText className="w-5 h-5 text-green-600" />}
                                                {log.type === 'diagnosis' && <Activity className="w-5 h-5 text-purple-600" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{log.action}</p>
                                                <p className="text-sm text-gray-500">
                                                    Patient: {log.patient} | Doctor: {log.doctor}
                                                </p>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(log.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                    {activityLogs.length === 0 && (
                                        <p className="text-center text-gray-500 py-8">No recent activities</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* User Management Tab */}
                    {activeTab === 'users' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            {/* Filters */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search users by name or email..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <select
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Doctor">Doctor</option>
                                        <option value="Receptionist">Receptionist</option>
                                        <option value="Patient">Patient</option>
                                    </select>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="blocked">Blocked</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredUsers.map(user => (
                                            <tr key={user._id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                                            {user.name?.charAt(0)?.toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{user.name}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status || 'active')}`}>
                                                        {user.status || 'active'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {/* Change Status */}
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setShowStatusModal(true);
                                                            }}
                                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                            title="Change Status"
                                                        >
                                                            {user.status === 'blocked' ? <Play className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                        </button>
                                                        {/* Change Role - Hide for Admin users */}
                                                        {user.role !== 'Admin' && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedUser(user);
                                                                    setShowRoleModal(true);
                                                                }}
                                                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                                                                title="Change Role"
                                                            >
                                                                <Shield className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {/* Delete */}
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setShowDeleteModal(true);
                                                            }}
                                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredUsers.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        No users found matching your criteria
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
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                                                    {doctor.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                                                    <p className="text-sm text-gray-500">{doctor.specialization || 'General'}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doctor.status)}`}>
                                                {doctor.status}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                <p className="text-2xl font-bold text-blue-600">{doctor.stats?.totalAppointments || 0}</p>
                                                <p className="text-xs text-gray-600">Total Appointments</p>
                                            </div>
                                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                                <div className="text-2xl font-bold text-green-600">{doctor.stats?.todayAppointments || 0}</div>
                                                <p className="text-xs text-gray-600">Today's Appointments</p>
                                            </div>
                                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                                <div className="text-2xl font-bold text-purple-600">{doctor.stats?.totalPrescriptions || 0}</div>
                                                <p className="text-xs text-gray-600">Prescriptions</p>
                                            </div>
                                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                                                <div className="text-2xl font-bold text-orange-600">{doctor.stats?.totalDiagnoses || 0}</div>
                                                <p className="text-xs text-gray-600">AI Diagnoses</p>
                                            </div>
                                        </div>

                                        {doctor.recentActivity?.length > 0 && (
                                            <div>
                                                <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h5>
                                                <div className="space-y-2">
                                                    {doctor.recentActivity.slice(0, 3).map((activity, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <span>{activity.patientName}</span>
                                                            <span className={`ml-auto text-xs px-2 py-0.5 rounded ${
                                                                activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                                activity.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-gray-100 text-gray-700'
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
                                    No doctor activities found
                                </div>
                            )}
                        </div>
                    )}

                    {/* Activity Logs Tab */}
                    {activeTab === 'logs' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900">System Activity Logs</h3>
                                <p className="text-gray-500 text-sm">Complete history of appointments, prescriptions, and diagnoses</p>
                            </div>
                            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                                {activityLogs.map((log, index) => (
                                    <div key={index} className="p-4 hover:bg-gray-50 transition">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                log.type === 'appointment' ? 'bg-blue-100' :
                                                log.type === 'prescription' ? 'bg-green-100' : 'bg-purple-100'
                                            }`}>
                                                {log.type === 'appointment' && <Calendar className="w-5 h-5 text-blue-600" />}
                                                {log.type === 'prescription' && <FileText className="w-5 h-5 text-green-600" />}
                                                {log.type === 'diagnosis' && <Activity className="w-5 h-5 text-purple-600" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">{log.action}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                        log.type === 'appointment' ? 'bg-blue-100 text-blue-700' :
                                                        log.type === 'prescription' ? 'bg-green-100 text-green-700' : 
                                                        'bg-purple-100 text-purple-700'
                                                    }`}>
                                                        {log.type}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    <span className="font-medium">Patient:</span> {log.patient} 
                                                    <span className="mx-2">•</span>
                                                    <span className="font-medium">Doctor:</span> {log.doctor}
                                                </p>
                                            </div>
                                            <div className="text-right text-sm text-gray-500">
                                                <div>{new Date(log.date).toLocaleDateString()}</div>
                                                <div className="text-xs">{new Date(log.date).toLocaleTimeString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {activityLogs.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        No activity logs available
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Status Change Modal */}
            {showStatusModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Change User Status</h3>
                        <p className="text-gray-600 mb-6">
                            Change status for <span className="font-medium">{selectedUser.name}</span>
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleUpdateStatus(selectedUser._id, 'active')}
                                disabled={actionLoading || selectedUser.status === 'active'}
                                className="w-full flex items-center gap-3 p-4 border-2 border-green-200 rounded-xl hover:bg-green-50 transition disabled:opacity-50"
                            >
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">Active</div>
                                    <div className="text-sm text-gray-500">User can access all features</div>
                                </div>
                            </button>
                            <button
                                onClick={() => handleUpdateStatus(selectedUser._id, 'suspended')}
                                disabled={actionLoading || selectedUser.status === 'suspended'}
                                className="w-full flex items-center gap-3 p-4 border-2 border-yellow-200 rounded-xl hover:bg-yellow-50 transition disabled:opacity-50"
                            >
                                <AlertCircle className="w-6 h-6 text-yellow-600" />
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">Suspended</div>
                                    <div className="text-sm text-gray-500">Temporary restriction</div>
                                </div>
                            </button>
                            <button
                                onClick={() => handleUpdateStatus(selectedUser._id, 'blocked')}
                                disabled={actionLoading || selectedUser.status === 'blocked'}
                                className="w-full flex items-center gap-3 p-4 border-2 border-red-200 rounded-xl hover:bg-red-50 transition disabled:opacity-50"
                            >
                                <Ban className="w-6 h-6 text-red-600" />
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">Blocked</div>
                                    <div className="text-sm text-gray-500">User cannot login</div>
                                </div>
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                setShowStatusModal(false);
                                setSelectedUser(null);
                            }}
                            className="w-full mt-6 py-3 text-gray-600 hover:text-gray-900 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Role Change Modal */}
            {showRoleModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Change User Role</h3>
                        <p className="text-gray-600 mb-6">
                            Change role for <span className="font-medium">{selectedUser.name}</span>
                        </p>
                        <div className="space-y-3">
                            {['Doctor', 'Receptionist', 'Patient'].map(role => (
                                <button
                                    key={role}
                                    onClick={() => handleUpdateRole(selectedUser._id, role)}
                                    disabled={actionLoading || selectedUser.role === role}
                                    className={`w-full flex items-center gap-3 p-4 border-2 rounded-xl transition disabled:opacity-50 ${
                                        selectedUser.role === role ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    <Shield className={`w-6 h-6 ${
                                        role === 'Doctor' ? 'text-blue-600' :
                                        role === 'Receptionist' ? 'text-green-600' : 'text-orange-600'
                                    }`} />
                                    <div className="text-left">
                                        <div className="font-medium text-gray-900">{role}</div>
                                    </div>
                                    {selectedUser.role === role && (
                                        <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-1 rounded">Current</span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                setShowRoleModal(false);
                                setSelectedUser(null);
                            }}
                            className="w-full mt-6 py-3 text-gray-600 hover:text-gray-900 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Delete User?</h3>
                            <p className="text-gray-600 mt-2">
                                Are you sure you want to delete <span className="font-medium">{selectedUser.name}</span>? 
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedUser(null);
                                }}
                                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteUser(selectedUser._id)}
                                disabled={actionLoading}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {actionLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard ;
