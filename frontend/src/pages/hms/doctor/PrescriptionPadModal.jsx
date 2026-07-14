import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { hmsService } from '../../../services/api.js'

const BLANK_MED = { name: '', dosage: '', frequency: '', duration: '', route: '' }
const ROUTES = ['Oral', 'IV', 'IM', 'Topical', 'Sublingual', 'Inhaled', 'Rectal']
const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Every 6 hours', 'Every 8 hours', 'As needed', 'At bedtime']

export default function PrescriptionPadModal({ onClose, patient = null }) {
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState({
    patient_id: patient?.id ? String(patient.id) : '',
    diagnosis: '',
    chief_complaint: '',
    instructions: '',
    follow_up: '',
    medications: [{ ...BLANK_MED }],
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!patient) hmsService.getDoctorPatients().then(setPatients).catch(() => {})
  }, [patient])

  const addMed = () => setForm(f => ({ ...f, medications: [...f.medications, { ...BLANK_MED }] }))
  const removeMed = (i) => setForm(f => ({ ...f, medications: f.medications.filter((_, idx) => idx !== i) }))
  const updateMed = (i, field, val) => setForm(f => ({
    ...f, medications: f.medications.map((m, idx) => idx === i ? { ...m, [field]: val } : m)
  }))

  const handleSubmit = async () => {
    if (!form.patient_id) return toast.error('Select a patient')
    if (!form.diagnosis) return toast.error('Diagnosis is required')
    if (form.medications.some(m => !m.name)) return toast.error('All medications need a name')
    setSaving(true)
    try {
      await hmsService.createPrescription({
        patient_id: Number(form.patient_id),
        diagnosis: form.diagnosis,
        instructions: [form.chief_complaint && `CC: ${form.chief_complaint}`, form.instructions, form.follow_up && `Follow-up: ${form.follow_up}`].filter(Boolean).join('\n'),
        medications: JSON.stringify(form.medications),
        status: 'ACTIVE',
      })
      toast.success('Prescription created successfully')
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to create prescription')
    } finally {
      setSaving(false)
    }
  }

  const selectedPatientName = patient?.name || patients.find(p => p.id === Number(form.patient_id))?.name || ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0f4b80] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px]">history_edu</span>
            </div>
            <div>
              <h2 className="text-base font-black text-white">Prescription Pad</h2>
              {selectedPatientName && <p className="text-white/70 text-xs">{selectedPatientName}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Patient selector (only if not pre-filled) */}
          {!patient && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Patient</label>
              <select value={form.patient_id} onChange={e => setForm(f => ({ ...f, patient_id: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:border-[#0f4b80] focus:ring-2 focus:ring-[#0f4b80]/20 outline-none text-sm">
                <option value="">Select patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}

          {/* Clinical info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Chief Complaint</label>
              <input value={form.chief_complaint} onChange={e => setForm(f => ({ ...f, chief_complaint: e.target.value }))}
                placeholder="e.g. Fever, headache for 3 days"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:border-[#0f4b80] focus:ring-2 focus:ring-[#0f4b80]/20 outline-none text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Diagnosis <span className="text-red-500">*</span></label>
              <input value={form.diagnosis} onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))}
                placeholder="e.g. Viral fever, Hypertension"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:border-[#0f4b80] focus:ring-2 focus:ring-[#0f4b80]/20 outline-none text-sm" />
            </div>
          </div>

          {/* Medications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medications <span className="text-red-500">*</span></label>
              <button onClick={addMed}
                className="flex items-center gap-1 text-xs font-bold text-[#0f4b80] hover:underline">
                <span className="material-symbols-outlined text-sm">add_circle</span> Add Medication
              </button>
            </div>
            <div className="space-y-3">
              {form.medications.map((m, i) => (
                <div key={i} className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Rx {i + 1}</span>
                    {form.medications.length > 1 && (
                      <button onClick={() => removeMed(i)} className="text-red-400 hover:text-red-600 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <input value={m.name} onChange={e => updateMed(i, 'name', e.target.value)}
                      placeholder="Drug name *"
                      className="col-span-2 sm:col-span-2 px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-[#0f4b80] outline-none text-sm" />
                    <input value={m.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)}
                      placeholder="Dosage (e.g. 500mg)"
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-[#0f4b80] outline-none text-sm" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <select value={m.frequency} onChange={e => updateMed(i, 'frequency', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-[#0f4b80] outline-none text-sm">
                      <option value="">Frequency</option>
                      {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                    </select>
                    <input value={m.duration} onChange={e => updateMed(i, 'duration', e.target.value)}
                      placeholder="Duration (e.g. 5 days)"
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-[#0f4b80] outline-none text-sm" />
                    <select value={m.route} onChange={e => updateMed(i, 'route', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-[#0f4b80] outline-none text-sm">
                      <option value="">Route</option>
                      {ROUTES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions & Follow-up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Patient Instructions</label>
              <textarea value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
                rows={3} placeholder="Dietary advice, rest, precautions..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:border-[#0f4b80] outline-none text-sm resize-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Follow-up</label>
              <input value={form.follow_up} onChange={e => setForm(f => ({ ...f, follow_up: e.target.value }))}
                placeholder="e.g. After 7 days, or 2026-04-01"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:border-[#0f4b80] outline-none text-sm mb-2" />
              <p className="text-xs text-slate-400">Date or relative time for next visit</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 bg-[#0f4b80] text-white py-2.5 rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity">
            {saving
              ? <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Saving...</>
              : <><span className="material-symbols-outlined text-[18px]">history_edu</span> Issue Prescription</>
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
