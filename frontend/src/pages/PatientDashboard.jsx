import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { Clock, FileText, FileHeart } from 'lucide-react';

const PatientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [timeline, setTimeline] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                // Fetch the current patient's own timeline directly
                const res = await api.get('/patients/me/timeline');
                setTimeline(res.data.timeline);
            } catch (err) {
                console.error("Failed to fetch timeline", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTimeline();
    }, []);

    if (loading) return <div className="p-8">Loading history...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Welcome, {user?.name}</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    Medical History Timeline
                </h2>

                {!timeline ? (
                    <p className="text-slate-500">No medical history found.</p>
                ) : (
                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">

                        {/* Render Appointments */}
                        {timeline.appointments?.map((apt, i) => (
                            <div key={`apt-${i}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-bold text-slate-800">Appointment</h3>
                                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">{apt.status}</span>
                                    </div>
                                    <p className="text-sm text-slate-500">Dr. {apt.doctorId?.name}</p>
                                    <p className="text-xs text-slate-400 mt-2">{new Date(apt.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}

                        {/* Render Prescriptions */}
                        {timeline.prescriptions?.map((rx, i) => (
                            <div key={`rx-${i}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 text-emerald-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                    <h3 className="font-bold text-slate-800 mb-1">Prescription ISSUED</h3>
                                    <p className="text-sm text-slate-500 mb-3">{rx.medicines.length} Item(s) prescribed</p>
                                    {rx.pdfUrl && (
                                        <a href={`http://localhost:5000${rx.pdfUrl}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors inline-block">
                                            Download PDF
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
