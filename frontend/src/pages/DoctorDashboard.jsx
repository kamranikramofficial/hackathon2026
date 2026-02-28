import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { Activity, Stethoscope, Clock, FileText, BrainCircuit } from 'lucide-react';

const DoctorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [symptomInput, setSymptomInput] = useState('');
    const [aiResult, setAiResult] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await api.get('/appointments');
                setAppointments(res.data);
            } catch (err) {
                console.error("Fetch error", err);
            }
        };
        fetchAppointments();
    }, []);

    const handleSymptomCheck = async (e) => {
        e.preventDefault();
        if (!symptomInput.trim()) return;

        setAiLoading(true);
        setAiResult(null);

        // Splitting comma separated symptoms
        const symptomsArr = symptomInput.split(',').map(s => s.trim()).filter(s => s);

        try {
            // Mocking patientId for demo purposes to the first available appt, or hardcoded generic
            const mockPatientId = appointments.length > 0 ? appointments[0].patientId._id : '65bbbbbbbbbbbbbbbbbbbbbb';

            const res = await api.post('/ai/diagnose', {
                patientId: mockPatientId,
                symptoms: symptomsArr
            });
            setAiResult(res.data);
        } catch (err) {
            console.error(err);
            setAiResult({ aiStatus: 'Error', log: { aiResponse: 'Failed to reach AI diagnostic server.', riskLevel: 'Unknown' } });
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">Doctor Portal</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* AI Symptom Checker Pane */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white text-center">
                        <BrainCircuit className="w-12 h-12 mx-auto mb-3 opacity-90" />
                        <h2 className="text-xl font-bold">Smart Symptom Checker</h2>
                        <p className="text-indigo-100 text-sm mt-1">Get AI-assisted differential diagnosis</p>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                        <form onSubmit={handleSymptomCheck} className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Enter Symptoms (comma separated)</label>
                            <textarea
                                rows="3"
                                value={symptomInput}
                                onChange={(e) => setSymptomInput(e.target.value)}
                                placeholder="e.g. fever, dry cough, shortness of breath, fatigue"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none bg-slate-50 focus:bg-white transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={aiLoading || !symptomInput.trim()}
                                className="mt-3 w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {aiLoading ? 'Analyzing...' : 'Generate AI Diagnostic'}
                            </button>
                        </form>

                        {aiResult && (
                            <div className="flex-1 bg-slate-50 rounded-xl p-5 border border-slate-100">
                                <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-3">
                                    <h3 className="font-bold text-slate-800 flex items-center">
                                        <Activity className="w-4 h-4 mr-2 text-indigo-500" />
                                        Diagnosis Results
                                    </h3>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase
                                        ${aiResult.log?.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                                            aiResult.log?.riskLevel === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                                                aiResult.log?.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-700' :
                                                    'bg-slate-200 text-slate-700'}`}
                                    >
                                        Risk: {aiResult.log?.riskLevel || 'Unknown'}
                                    </span>
                                </div>
                                <div className="prose prose-sm max-w-none text-slate-600 whitespace-pre-wrap">
                                    {aiResult.log?.aiResponse}
                                </div>
                                {aiResult.aiStatus !== 'Success' && (
                                    <p className="text-xs text-amber-600 mt-4 font-medium italic">Note: The AI service is running in fallback mode.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Patient Queue Pane */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center mt-2">
                        <Stethoscope className="w-5 h-5 mr-2 text-primary" />
                        My Schedule
                    </h2>

                    {appointments.length === 0 ? (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center text-slate-500">
                            Clear schedule. No appointments booked.
                        </div>
                    ) : (
                        appointments.map(apt => (
                            <div key={apt._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 mb-1">{apt.patientId?.name || 'Unknown'}</h3>
                                    <p className="text-xs text-slate-500 flex items-center">
                                        {new Date(apt.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                    </p>
                                </div>
                                <div>
                                    <button className="text-xs bg-slate-100 text-slate-700 px-3 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center">
                                        <FileText className="w-3 h-3 mr-1" />
                                        Prescribe
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default DoctorDashboard;
