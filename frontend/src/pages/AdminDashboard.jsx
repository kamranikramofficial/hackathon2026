import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { Users, Calendar, DollarSign, Activity, AlertCircle, TrendingUp, LogOut, Settings, Download, Filter } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('monthly');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/analytics');
                setAnalytics(res.data);
            } catch (err) {
                console.error("Failed to load analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-slate-600 font-medium">Loading analytics...</p>
            </div>
        </div>
    );
    if (!analytics) return <div className="p-8 text-red-600 font-bold">No data available</div>;

    // Prepare Chart Data
    const riskData = {
        labels: analytics.diagnosisStats.map(stat => stat._id || 'Unknown'),
        datasets: [{
            data: analytics.diagnosisStats.map(stat => stat.count),
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#94a3b8'],
            borderWidth: 0,
        }]
    };

    const StatusData = {
        labels: ['Completed', 'Pending'],
        datasets: [{
            label: 'Appointments',
            data: [analytics.appointments.completed, analytics.appointments.pending],
            backgroundColor: ['#2563eb', '#64748b'],
            borderRadius: 8,
        }]
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Clinic Overview</h1>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                        <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Patients</p>
                        <h3 className="text-2xl font-bold text-slate-800">{analytics.patients}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mr-4">
                        <Calendar className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Appointments</p>
                        <h3 className="text-2xl font-bold text-slate-800">{analytics.appointments.total}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mr-4">
                        <Activity className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">AI Diagnoses</p>
                        <h3 className="text-2xl font-bold text-slate-800">{analytics.diagnosisStats.reduce((a, b) => a + b.count, 0)}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mr-4">
                        <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Simulated Revenue</p>
                        <h3 className="text-2xl font-bold text-slate-800">${analytics.simulatedRevenue}</h3>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-slate-400" />
                        AI Detected Risk Levels
                    </h3>
                    <div className="h-64 flex justify-center">
                        {analytics.diagnosisStats.length > 0 ? (
                            <Doughnut data={riskData} options={{ maintainAspectRatio: false, cutout: '70%' }} />
                        ) : (
                            <p className="text-slate-400 self-center">No AI diagnoses logged yet.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-slate-400" />
                        Appointment Status
                    </h3>
                    <div className="h-64">
                        <Bar
                            data={StatusData}
                            options={{
                                maintainAspectRatio: false,
                                scales: { y: { beginAtZero: true } },
                                plugins: { legend: { display: false } }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
