import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { hmsService } from '../../../services/api.js'

const TEST_CATEGORIES = {
  'Hematology': ['Complete Blood Count (CBC)', 'ESR', 'Peripheral Smear', 'Coagulation Profile (PT/INR)', 'Reticulocyte Count'],
  'Biochemistry': ['Blood Glucose (Fasting)', 'Blood Glucose (PP)', 'HbA1c', 'Lipid Profile', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)', 'Serum Electrolytes', 'Thyroid Profile (T3/T4/TSH)', 'Uric Acid', 'CRP'],
  'Microbiology': ['Blood Culture', 'Urine Culture', 'Sputum Culture', 'Wound Swab Culture', 'Stool Culture'],
  'Urine': ['Urine Routine & Microscopy', 'Urine Pregnancy Test', '24hr Urine Protein'],
  'Radiology': ['X-Ray Chest', 'X-Ray Abdomen', 'Ultrasound Abdomen', 'Ultrasound Pelvis', 'CT Scan Head', 'CT Scan Chest', 'MRI Brain', 'MRI Spine', 'ECHO', 'ECG'],
  'Other': ['Biopsy', 'FNAC', 'Pap Smear', 'Semen Analysis'],
}

const URGENCY = ['Routine', 'Urgent', 'STAT']

export default function LabOrderModal({ onClose, patient = null }) {
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState({
    patient_id: patient?.id ? String(patient.id) : '',
    clinical_info: '',
    urgency: 'Routine',
    remarks: '',
  })
  const [selectedTests, setSelectedTests] = useState([])
  const [customTest, setCustomTest] = useState('')
  const [saving, setSaving] = useState(false)
  const [openCategory, setOpenCategory] = useState('Hematology')

  useEffect(() => {
    if (!patient) hmsService.getDoctorPatients().then(setPatients).catch(() => {})
  }, [patient])

  const toggleTest = (test) => {
    setSelectedTests(prev =>
      prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]
    )
  }

  const addCustom = () => {
    const t = customTest.trim()
    if (!t) return
    if (!selectedTests.includes(t)) setSelectedTests(prev => [...prev, t])
    setCustomTest('')
  }

  const handleSubmit = async () => {
    if (!form.patient_id) return toast.error('Select a patient')
    if (selectedTests.length === 0) return toast.error('Select at least one test')
    setSaving(true)
    try {
      // Create one lab report per test
      await Promise.all(selectedTests.map(test =>
        hmsService.createLabReport({
          patient_id: Number(form.patient_id),
          test_name: test,
          test_type: Object.entries(TEST_CATEGORIES).find(([, tests]) => tests.includes(test))?.[0] || 'Other',
          remarks: [form.clinical_info && `Clinical info: ${form.clinical_info}`, form.urgency !== 'Routine' && `Urgency: ${form.urgency}`, form.remarks].filter(Boolean).join(' | '),
          status: 'PENDING',
        })
      ))
      toast.success(`${selectedTests.length} lab test(s) ordered`)
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to order lab tests')
    } finally {
      setSaving(false)
    }
  }

  const selectedPatientName = patient?.name || patients.find(p => p.id === Number(form.patient_id))?.name || ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-blue-600 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px]">lab_profile</span>
            </div>
            <div>
              <h2 className="text-base font-black text-white">Lab Order Form</h2>
              {selectedPatientName && <p className="text-white/70 text-xs">{selectedPatientName}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Patient */}
          {!patient && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Patient</label>
              <select value={form.patient_id} onChange={e => setForm(f => ({ ...f, patient_id: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm">
                <option value="">Select patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}

          {/* Clinical info + urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Clinical Information</label>
              <input value={form.clinical_info} onChange={e => setForm(f => ({ ...f, clinical_info: e.target.value }))}
                placeholder="Brief clinical history / indication"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Urgency</label>
              <div className="flex gap-2">
                {URGENCY.map(u => (
                  <button key={u} onClick={() => setForm(f => ({ ...f, urgency: u }))}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold border transition-colors ${
                      form.urgency === u
                        ? u === 'STAT' ? 'bg-red-600 text-white border-red-600'
                          : u === 'Urgent' ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Tests <span className="text-red-500">*</span></label>
              {selectedTests.length > 0 && (
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {selectedTests.length} selected
                </span>
              )}
            </div>

            {/* Category tabs */}
            <div className="flex gap-1.5 flex-wrap mb-3">
              {Object.keys(TEST_CATEGORIES).map(cat => (
                <button key={cat} onClick={() => setOpenCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    openCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Tests grid */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TEST_CATEGORIES[openCategory].map(test => (
                <label key={test} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" checked={selectedTests.includes(test)} onChange={() => toggleTest(test)}
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer" />
                  <span className={`text-sm transition-colors ${selectedTests.includes(test) ? 'text-blue-700 font-semibold' : 'text-slate-700 group-hover:text-slate-900'}`}>
                    {test}
                  </span>
                </label>
              ))}
            </div>

            {/* Custom test */}
            <div className="flex gap-2 mt-3">
              <input value={customTest} onChange={e => setCustomTest(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom()}
                placeholder="Add custom test..."
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 bg-white focus:border-blue-500 outline-none text-sm" />
              <button onClick={addCustom}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors">
                Add
              </button>
            </div>
          </div>

          {/* Selected tests summary */}
          {selectedTests.length > 0 && (
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Order Summary</p>
              <div className="flex flex-wrap gap-2">
                {selectedTests.map(t => (
                  <span key={t} className="flex items-center gap-1 px-2.5 py-1 bg-white border border-blue-200 text-blue-700 text-xs font-semibold rounded-full">
                    {t}
                    <button onClick={() => toggleTest(t)} className="text-blue-400 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Remarks */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Additional Remarks</label>
            <textarea value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
              rows={2} placeholder="Special instructions for the lab technician..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:border-blue-500 outline-none text-sm resize-none" />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity">
            {saving
              ? <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Ordering...</>
              : <><span className="material-symbols-outlined text-[18px]">science</span> Order {selectedTests.length > 0 ? `${selectedTests.length} Test(s)` : 'Tests'}</>
            }
          </button>
          <button onClick={onClose}
            className="px-6 border border-slate-200 text-slate-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
