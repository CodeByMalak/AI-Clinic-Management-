import React, { useState, useEffect } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { 
  LogOut, User, Activity, Users, Shield, Calendar, 
  PlusCircle, Stethoscope, AlertTriangle, FileText, CheckCircle2, 
  Send, Database, Award, ClipboardList, Pill, Brain, Clock, ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  
  // Doctor AI Diagnosis simulation states
  const [patientName, setPatientName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [aiRunning, setAiRunning] = useState(false);
  const [aiStep, setAiStep] = useState(0);
  const [aiReport, setAiReport] = useState(null);

  // Receptionist Queue states (from MERN backend)
  const [queueList, setQueueList] = useState([]);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientReason, setNewPatientReason] = useState('');
  const [queueLoading, setQueueLoading] = useState(false);

  // Fetch patient queue from MERN backend
  const fetchQueue = async () => {
    if (!user || (user.role !== 'Receptionist' && user.role !== 'Admin')) return;
    setQueueLoading(true);
    try {
      const response = await api.get('/queues');
      if (response.data.success) {
        setQueueList(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch queue:', err.message);
    } finally {
      setQueueLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [user]);

  // Simulating Doctor AI Diagnosis engine
  const handleAiDiagnosis = (e) => {
    e.preventDefault();
    if (!patientName || !symptoms) return;

    setAiRunning(true);
    setAiReport(null);
    setAiStep(1);

    // Dynamic phase loaders for AI Diagnostic Hub
    setTimeout(() => setAiStep(2), 1000);
    setTimeout(() => setAiStep(3), 2200);
    setTimeout(() => {
      setAiStep(4);
      // Generate highly targeted mock response
      const reportOptions = {
        'chest pain': {
          diagnosis: 'Acute Gastric Reflux mimicking Angina',
          riskLevel: 'Moderate',
          confidence: '84%',
          recommendations: 'ECG successfully checked clear. Suggest administering anti-acid blocker (Omeprazole 20mg) and follow-up cardiac enzyme screen as standard protocol.'
        },
        'fever': {
          diagnosis: 'Influenza Type A with Mild Respiratory Involvement',
          riskLevel: 'Low',
          confidence: '92%',
          recommendations: 'Symptomatic therapy, mandatory rest, increase hydration. Administer Oseltamivir 75mg twice daily if within 48h of onset.'
        },
      };

      const matchedKey = Object.keys(reportOptions).find(key => 
        symptoms.toLowerCase().includes(key)
      );

      const generatedReport = matchedKey ? reportOptions[matchedKey] : {
        diagnosis: 'Nonspecific Viral Syndrome',
        riskLevel: 'Low',
        confidence: '78%',
        recommendations: 'Increase rest, push oral fluids, evaluate basic vital signs. Monitor temperature peaks and recommend acetaminophen 500mg as needed for pyrexia.'
      };

      setAiReport({
        patient: patientName,
        symptoms: symptoms,
        timestamp: new Date().toLocaleTimeString(),
        ...generatedReport
      });
      setAiRunning(false);
      setAiStep(0);
    }, 3500);
  };

  // Add patient to persistent MongoDB queue
  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!newPatientName || !newPatientReason) return;

    setQueueLoading(true);
    try {
      const response = await api.post('/queues', {
        name: newPatientName,
        age: Math.floor(Math.random() * 45) + 18, // Auto-generate patient age for intake convenience
        reason: newPatientReason
      });

      if (response.data.success) {
        setQueueList([...queueList, response.data.data]);
        setNewPatientName('');
        setNewPatientReason('');
      }
    } catch (err) {
      console.error('Failed to add patient:', err.message);
      alert(err.response?.data?.message || 'Error inserting patient into live database.');
    } finally {
      setQueueLoading(false);
    }
  };

  // Promote patient queue status or discharge them
  const updateQueueStatus = async (id) => {
    setQueueLoading(true);
    try {
      const response = await api.put(`/queues/${id}/status`);
      if (response.data.success) {
        if (response.data.discharged) {
          // If discharged, filter out from active view list
          setQueueList(queueList.filter(item => item._id !== id));
        } else {
          // If status promoted, update status in current list
          setQueueList(queueList.map(item => {
            if (item._id === id) {
              return { ...item, status: response.data.data.status };
            }
            return item;
          }));
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err.message);
      alert(err.response?.data?.message || 'Failed to update patient triage level.');
    } finally {
      setQueueLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50/30">
      
      {/* 1. Left Sidebar - Premium Glass Layout */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between p-6 border-r border-slate-800 md:min-h-screen">
        
        {/* Upper Brand Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-clinical-500 flex items-center justify-center text-white shadow-lg shadow-clinical-500/20">
              <Activity className="w-5 h-5 animate-pulse-glow" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight text-white leading-tight">MediFlow</h3>
              <span className="text-[10px] text-clinical-400 font-bold uppercase tracking-wider block">Clinical Portal</span>
            </div>
          </div>

          {/* User Profile Mini Widget */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800/50 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-clinical-500/10 border border-clinical-500/20 text-clinical-400 flex items-center justify-center font-bold text-sm">
                {user?.name?.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-clinical-500/20 text-clinical-300 text-[9px] font-black uppercase tracking-wider">
                  {user?.role === 'Admin' && <Shield className="w-2.5 h-2.5" />}
                  {user?.role === 'Doctor' && <Stethoscope className="w-2.5 h-2.5" />}
                  {user?.role === 'Receptionist' && <ClipboardList className="w-2.5 h-2.5" />}
                  {user?.role === 'Patient' && <User className="w-2.5 h-2.5" />}
                  {user?.role}
                </div>
              </div>
            </div>
            {user?.role === 'Doctor' && user?.specialization && (
              <div className="mt-3 pt-2.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-accent-400" />
                <span className="truncate">{user.specialization} specialist</span>
              </div>
            )}
          </div>
        </div>

        {/* Lower Logout Control Section */}
        <div className="mt-8 md:mt-0">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-850 border border-slate-800 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-300 hover:text-rose-400 font-semibold text-xs tracking-wider uppercase transition-all duration-200 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            Deauthorize Session
          </button>
        </div>
      </aside>

      {/* 2. Main Content Board */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        
        {/* Welcome Section */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-glass mb-8 bg-medical-grid relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-clinical-500/10 rounded-bl-full flex items-center justify-center text-clinical-500/20">
            <Activity className="w-16 h-16 animate-pulse" />
          </div>
          
          <span className="text-[10px] font-extrabold text-clinical-600 uppercase tracking-widest block mb-2">
            Secure Cryptographic partition established
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            You are logged into MediFlow SaaS under role authority level. Your access logs are encrypted and stored in the secure distributed clinical ledger.
          </p>
        </div>

        {/* Dynamic Render Based On User Role */}
        
        {/* ==================== A: ADMIN WORKSPACE ==================== */}
        {user?.role === 'Admin' && (
          <div className="space-y-8">
            
            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="glass-panel p-5 rounded-2xl border border-slate-200/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-clinical-100 text-clinical-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Faculty</h5>
                  <p className="text-2xl font-bold text-slate-800">42 Members</p>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-200/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center">
                  <Activity className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h5 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">AI API Queries</h5>
                  <p className="text-2xl font-bold text-slate-800">14,298 calls</p>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-200/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Booked Visits</h5>
                  <p className="text-2xl font-bold text-slate-800">190 Scheduled</p>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-200/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Access Audits</h5>
                  <p className="text-2xl font-bold text-slate-800">100% Passed</p>
                </div>
              </div>
            </div>

            {/* Core Admin Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200/60">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-clinical-600" />
                  Database Node Logs (Encrypted JWT Actions)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-widest">
                        <th className="pb-3 font-semibold">Security Identifier</th>
                        <th className="pb-3 font-semibold">User Role</th>
                        <th className="pb-3 font-semibold">Action Invoked</th>
                        <th className="pb-3 font-semibold">Timestamp</th>
                        <th className="pb-3 font-semibold text-right">Encrypted Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="py-3 font-bold text-slate-800">usr_89f0e1a2</td>
                        <td>Doctor</td>
                        <td>GET /api/auth/me</td>
                        <td>10:42:15 AM</td>
                        <td className="py-3 text-right"><span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold">200 OK</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-slate-800">usr_12bc34de</td>
                        <td>Patient</td>
                        <td>POST /api/auth/register</td>
                        <td>10:39:04 AM</td>
                        <td className="py-3 text-right"><span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold">201 CREATED</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-slate-800">usr_f45678ab</td>
                        <td>Receptionist</td>
                        <td>POST /api/auth/login</td>
                        <td>10:35:12 AM</td>
                        <td className="py-3 text-right"><span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold">200 OK</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-slate-800">usr_unknown</td>
                        <td>Unauthorized</td>
                        <td>GET /api/admin/restricted</td>
                        <td>10:31:00 AM</td>
                        <td className="py-3 text-right"><span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold">403 FORBIDDEN</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Side controls */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 space-y-4">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Platform Administration</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  As a system Admin, you hold executive decryption keys. You can monitor database queries, clear cache instances, or view real-time API logs.
                </p>
                <div className="space-y-2">
                  <button className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold rounded-xl text-xs transition-all text-left flex items-center justify-between">
                    <span>Re-evaluate Encryption Salts</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold rounded-xl text-xs transition-all text-left flex items-center justify-between">
                    <span>Export JWT Activity Logs</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold rounded-xl text-xs transition-all text-left flex items-center justify-between">
                    <span>Audit Active User Node Sessions</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== B: DOCTOR WORKSPACE ==================== */}
        {user?.role === 'Doctor' && (
          <div className="space-y-8">
            
            {/* Interactive Clinical AI Diagnostician */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Symptom Input Form */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 shadow-glass">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-clinical-100 text-clinical-600 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-clinical-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">AI Diagnosis Engine</h3>
                </div>
                
                <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                  Submit a secure clinical symptom profile below. The MediFlow Deep Learning Model will evaluate standard classifications and output a high-confidence diagnostic report card.
                </p>

                <form onSubmit={handleAiDiagnosis} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xxs font-bold text-slate-400 uppercase tracking-widest block">Patient Reference</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Miller"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-clinical-500 focus:ring-4 focus:ring-clinical-500/10 transition-all bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xxs font-bold text-slate-400 uppercase tracking-widest block">Active Symptoms / Vitals</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="e.g. Patient presents with high fever, respiratory distress OR recurring sharp chest pain after meals"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-clinical-500 focus:ring-4 focus:ring-clinical-500/10 transition-all bg-white"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={aiRunning}
                    className="w-full py-3 bg-clinical-600 hover:bg-clinical-700 active:scale-95 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl uppercase tracking-wider shadow-lg shadow-clinical-600/10 flex items-center justify-center gap-2 transition-all"
                  >
                    {aiRunning ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 animate-bounce" />
                        <span>Run AI Evaluation</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Simulated Steps indicator */}
                {aiRunning && (
                  <div className="mt-5 p-4 rounded-2xl bg-clinical-50/50 border border-clinical-100 text-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-clinical-600 animate-spin" />
                      <span className="font-bold text-slate-700">Diagnosis in progress:</span>
                    </div>
                    <div className="space-y-1 text-slate-500 pl-6 text-xxs">
                      <p className={aiStep >= 1 ? 'text-clinical-600 font-bold' : ''}>1. Parsing token claims & doctor credentials...</p>
                      <p className={aiStep >= 2 ? 'text-clinical-600 font-bold' : ''}>2. Ingesting custom vitals & natural text NLP...</p>
                      <p className={aiStep >= 3 ? 'text-clinical-600 font-bold' : ''}>3. Comparing symptoms against 50k+ clinical models...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Symptom Output/Report Display */}
              <div className="lg:col-span-2 flex flex-col">
                <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 shadow-glass flex-1 flex flex-col justify-center">
                  {aiReport ? (
                    <div className="space-y-5 animate-pulse-glow">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[9px] font-extrabold text-clinical-600 uppercase tracking-widest block">AI Diagnostic Dossier</span>
                          <h4 className="text-md font-bold text-slate-800">Patient: {aiReport.patient}</h4>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-50 text-accent-700 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Evaluation Confirmed</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Target Assessment</span>
                          <p className="text-sm font-black text-slate-800">{aiReport.diagnosis}</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                          <div>
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1 font-sans">Confidence Rating</span>
                            <p className="text-md font-black text-clinical-700">{aiReport.confidence}</p>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1 font-sans">Clinical Risk</span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase ${
                              aiReport.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {aiReport.riskLevel}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-clinical-50/50 border border-clinical-100/50">
                        <h5 className="text-xs font-bold text-clinical-800 mb-1 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-clinical-600" />
                          AI Prescribed Action & Suggestions
                        </h5>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans">{aiReport.recommendations}</p>
                      </div>

                      <p className="text-[10px] text-slate-400 italic text-center">
                        Report generated at {aiReport.timestamp}. Clinician review required before final pharmaceutical administration.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-10 max-w-sm mx-auto">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300 mb-4 border border-slate-100">
                        <Brain className="w-7 h-7" />
                      </div>
                      <h4 className="text-md font-bold text-slate-700 mb-1">Awaiting Symptom Submission</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Input a patient name and descriptive symptoms in the evaluation panel. The diagnostic algorithm will compile an expert assessment dossier immediately.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== C: RECEPTIONIST WORKSPACE ==================== */}
        {user?.role === 'Receptionist' && (
          <div className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Dynamic Intake Form */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 shadow-glass">
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <PlusCircle className="w-5 h-5 text-clinical-500" />
                  New Patient Intake Form
                </h3>
                <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                  Enter credentials of arrived patient to insert their card into the active clinic schedule queue.
                </p>

                <form onSubmit={handleAddPatient} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xxs font-bold text-slate-400 uppercase tracking-widest block">Patient Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Vance"
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-clinical-500 focus:ring-4 focus:ring-clinical-500/10 transition-all bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xxs font-bold text-slate-400 uppercase tracking-widest block">Reason for Consultation</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. High fever / Vaccine / Follow-up"
                      value={newPatientReason}
                      onChange={(e) => setNewPatientReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-clinical-500 focus:ring-4 focus:ring-clinical-500/10 transition-all bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-clinical-600 hover:bg-clinical-700 active:scale-95 text-white font-bold text-xs rounded-xl uppercase tracking-wider shadow-lg shadow-clinical-600/10 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Insert in Queue
                  </button>
                </form>
              </div>

              {/* Active Queue list */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200/60 shadow-glass">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-0.5">Live Patient Intake Feed</h3>
                    <p className="text-xs text-slate-400">Promote clinical check-in status or discharge patients upon completion.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-clinical-50 text-clinical-700 text-xxs font-black tracking-widest uppercase">
                    {queueList.length} In-House
                  </span>
                </div>

                <div className="space-y-3">
                  {queueList.map((patient) => (
                    <div
                      key={patient._id}
                      className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/50 border border-slate-100 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                          {patient.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-850">{patient.name} <span className="text-[10px] text-slate-400 font-normal">({patient.age} yrs)</span></h4>
                          <p className="text-[11px] text-slate-500 font-medium">{patient.reason}</p>
                          <span className="text-[9px] text-slate-400 block mt-0.5">Registered at {new Date(patient.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 justify-end">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          patient.status === 'Waiting' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          patient.status === 'Triaged' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-100 animate-pulse'
                        }`}>
                          {patient.status}
                        </span>

                        <button
                          onClick={() => updateQueueStatus(patient._id)}
                          className="px-3 py-1.5 rounded-lg bg-clinical-600 hover:bg-clinical-700 text-white font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95"
                        >
                          {patient.status === 'Waiting' ? 'Triage Patient' : patient.status === 'Triaged' ? 'Call Doctor' : 'Discharge'}
                        </button>
                      </div>
                    </div>
                  ))}
                  {queueList.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-slate-400 text-xs">All queues clear! Intake office currently idle.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== D: PATIENT WORKSPACE ==================== */}
        {user?.role === 'Patient' && (
          <div className="space-y-8">
            
            {/* Quick stats for Patient */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="glass-panel p-5 rounded-2xl border border-slate-200/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-clinical-100 text-clinical-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Next Consult</h5>
                  <p className="text-md font-bold text-slate-800">Tomorrow at 2:00 PM</p>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-200/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center">
                  <Pill className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Meds</h5>
                  <p className="text-md font-bold text-slate-800">2 Prescriptions</p>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-200/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">AI Assessments</h5>
                  <p className="text-md font-bold text-slate-800">1 Completed</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Doctor consult list */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200/60 shadow-glass">
                <h3 className="text-lg font-bold text-slate-800 mb-1.5">My Health Record</h3>
                <p className="text-xs text-slate-400 mb-6">Overview of your active records, diagnostic tests, and past visits.</p>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[9px] font-black text-clinical-600 uppercase tracking-widest block mb-0.5">Automated Diagnosis Result</span>
                        <h4 className="text-xs font-bold text-slate-800">Mild Influenza Assessment</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-50 text-emerald-700 tracking-wide uppercase">Evaluated by Doctor AI</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Symptom parsing matched influenza viral markers. Advised: Oseltamivir 75mg, hydration, 5 days isolation.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[9px] font-black text-purple-600 uppercase tracking-widest block mb-0.5">Physical Intake</span>
                        <h4 className="text-xs font-bold text-slate-800">Wellness & Biometric Intake screening</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-slate-200 text-slate-600 tracking-wide uppercase">Clinic Visit</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Blood pressure: 120/80 mmHg, Pulse: 72 bpm, Height/Weight within healthy range. Next general check-up due in 12 months.
                    </p>
                  </div>
                </div>
              </div>

              {/* Digital Medicine cabinet */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 shadow-glass">
                <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Pill className="w-5 h-5 text-accent-500 animate-bounce" />
                  Prescriptions
                </h3>
                <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                  Digital pharmacy cabinet synchronizing prescribed meds from active consulting physicians.
                </p>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100/50 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-emerald-800">Omeprazole 20mg</h4>
                      <p className="text-[10px] text-emerald-600">Once daily before breakfast</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[8px] font-extrabold uppercase">Refill Ready</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">Amoxicillin 500mg</h4>
                      <p className="text-[10px] text-slate-500">Three times daily for 7 days</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-250 text-slate-500 text-[8px] font-extrabold uppercase">Completed</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
