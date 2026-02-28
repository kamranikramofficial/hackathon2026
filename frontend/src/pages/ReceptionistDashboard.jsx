import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { Users, UserPlus, CheckCircle, Clock } from 'lucide-react';

const ReceptionistDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [apptsRes, patientsRes] = await Promise.all([
                    api.get('/appointments'),
                    api.get('/patients')
                ]);
                setAppointments(apptsRes.data);
                setPatients(patientsRes.data);
            } catch (err) {
                console.error("Fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/appointments/${id}`, { status });
            setAppointments(appointments.map(a => a._id === id ? { ...a, status } : a));
        } catch (err) {
            console.error("Status update failed", err);
        }
    };

    if (loading) return <div className="p-8">Loading data...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Front Desk Hub</h1>
                <button className="bg-primary text-white px-4 py-2 rounded-xl flex items-center font-medium shadow-sm hover:bg-blue-700 transition-colors">
                    <UserPlus className="w-4 h-4 mr-2" />
                    New Patient
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Appointments List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-primary" />
                        Today's Appointments
                    </h2>

                    {appointments.length === 0 ? (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center text-slate-500">
                            No appointments scheduled.
                        </div>
                    ) : (
                        appointments.map(apt => (
                            <div key={apt._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center items-start gap-4">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{apt.patientId?.name || 'Unknown Patient'}</h3>
                                    <p className="text-sm text-slate-500 flex items-center mt-1">
                                        Dr. {apt.doctorId?.name} • {new Date(apt.date).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                                        ${apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                            apt.status === 'completed' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                                                'bg-amber-50 text-amber-600 border border-amber-200'}`}
                                    >
                                        {apt.status}
                                    </span>

                                    {apt.status === 'pending' && (
                                        <button
                                            onClick={() => updateStatus(apt._id, 'confirmed')}
                                            className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                                            title="Confirm Appointment"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Patient Roster */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-primary" />
                        Quick Roster
                    </h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        {patients.slice(0, 5).map((patient, i) => (
                            <div key={patient._id} className={`p-4 flex items-center ${i !== 0 && 'border-t border-slate-50'}`}>
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold mr-3">
                                    {patient.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-slate-800">{patient.name}</h4>
                                    <p className="text-xs text-slate-400">{patient.contact}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReceptionistDashboard;
