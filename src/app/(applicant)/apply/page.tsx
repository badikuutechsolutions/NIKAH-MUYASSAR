'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Upload, Shield, Save, FileText, DollarSign, User, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArabicText } from '@/components/ui/arabic-text'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { COUNTRIES, CURRENCIES } from '@/lib/constants'

const STEPS = ['Personal Info', 'Financial Situation', 'Islamic Background', 'Documents', 'Review & Submit']

interface FormData {
  // Step 1
  fullName: string; age: string; gender: string; maritalStatus: string; nationality: string; countryOfResidence: string; city: string; occupation: string; phone: string; whatsapp: string;
  // Step 2
  hasEmployment: string; employmentType: string; monthlyIncome: string; incomeCurrency: string; financialHardshipDesc: string; hasExistingDebt: string; debtDescription: string; estimatedWeddingCost: string; amountRequested: string;
  // Step 3
  religiosityLevel: string; isAlreadyEngaged: string; partnerName: string; partnerNationality: string; howTheyMet: string; localMosqueName: string; localMosqueCity: string; imamReferenceName: string; imamContact: string; reasonForMarriage: string;
  // Step 4 (document URLs)
  idDocumentUrl: string; incomeProofUrl: string; imamLetterUrl: string; profilePhotoUrl: string; additionalDocs: string[];
  // Step 5 (privacy)
  isAnonymous: boolean; displayAlias: string; consentToShareStory: boolean;
}

const INITIAL_FORM: FormData = {
  fullName: '', age: '', gender: '', maritalStatus: 'single', nationality: '', countryOfResidence: '', city: '', occupation: '', phone: '', whatsapp: '',
  hasEmployment: 'false', employmentType: '', monthlyIncome: '', incomeCurrency: 'KES', financialHardshipDesc: '', hasExistingDebt: 'false', debtDescription: '', estimatedWeddingCost: '', amountRequested: '',
  religiosityLevel: '', isAlreadyEngaged: 'false', partnerName: '', partnerNationality: '', howTheyMet: '', localMosqueName: '', localMosqueCity: '', imamReferenceName: '', imamContact: '', reasonForMarriage: '',
  idDocumentUrl: '', incomeProofUrl: '', imamLetterUrl: '', profilePhotoUrl: '', additionalDocs: [],
  isAnonymous: false, displayAlias: '', consentToShareStory: false,
}

// Helper: file upload to Cloudinary
async function uploadFile(file: File, folder: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)
  const res = await fetch('/api/upload', { method: 'POST', body: formData })
  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.secure_url
}

function FileUpload({ label, required, value, onChange, folder }: { label: string; required?: boolean; value: string; onChange: (url: string) => void; folder: string }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = async (file: File) => {
    if (!file.type.match(/^(application\/pdf|image\/(jpeg|png|webp))$/)) {
      toast.error('Please upload a PDF, JPG, or PNG file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }
    setUploading(true)
    try {
      const url = await uploadFile(file, folder)
      onChange(url)
      toast.success(`${label} uploaded successfully`)
    } catch {
      toast.error(`Failed to upload ${label}`)
    }
    setUploading(false)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file) }}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${dragOver ? 'border-primary bg-light-teal' : value ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-primary'}`}
      >
        {value ? (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <Check className="h-5 w-5" />
            <span className="text-sm font-medium">Uploaded</span>
            <button onClick={() => onChange('')} className="text-xs text-red-500 hover:underline ml-2">Remove</button>
          </div>
        ) : uploading ? (
          <div className="flex items-center justify-center gap-2 text-primary">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
            <span className="text-sm">Uploading...</span>
          </div>
        ) : (
          <div>
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Drag & drop or <span className="text-primary">browse</span></p>
            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (max 5MB)</p>
          </div>
        )}
        <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file) }} />
      </div>
    </div>
  )
}

export default function ApplyPage() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(0)
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  // Load saved form data
  useEffect(() => {
    const saved = localStorage.getItem('nikah-application')
    if (saved) {
      try { setForm(JSON.parse(saved)) } catch {}
    }
  }, [])

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('nikah-application', JSON.stringify(form))
  }, [form])

  const update = useCallback((field: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const goNext = () => { setDirection(1); setStep((s) => Math.min(s + 1, STEPS.length - 1)); window.scrollTo(0, 0) }
  const goPrev = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 0)); window.scrollTo(0, 0) }

  const validateStep = (): boolean => {
    switch (step) {
      case 0:
        if (!form.fullName || !form.age || !form.gender || !form.nationality || !form.countryOfResidence || !form.city || !form.phone) {
          toast.error('Please fill in all required fields'); return false
        }
        if (parseInt(form.age) < 18) { toast.error('You must be at least 18 years old'); return false }
        return true
      case 1:
        if (!form.financialHardshipDesc || form.financialHardshipDesc.length < 100) { toast.error('Please provide at least 100 characters describing your financial situation'); return false }
        if (!form.amountRequested) { toast.error('Please enter the amount you are requesting'); return false }
        return true
      case 2:
        if (!form.religiosityLevel) { toast.error('Please select your level of practice'); return false }
        if (!form.localMosqueName || !form.localMosqueCity) { toast.error('Please enter your mosque details'); return false }
        if (!form.imamReferenceName || !form.imamContact) { toast.error('Please provide your Imam reference'); return false }
        if (!form.reasonForMarriage || form.reasonForMarriage.length < 50) { toast.error('Please write at least 50 characters about why you want to marry'); return false }
        return true
      case 3:
        if (!form.idDocumentUrl) { toast.error('Please upload your ID document'); return false }
        if (!form.incomeProofUrl) { toast.error('Please upload your income proof'); return false }
        if (!form.imamLetterUrl) { toast.error('Please upload your Imam letter'); return false }
        return true
      default: return true
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { toast.error('Please sign in first'); router.push('/login'); return }

      const payload = {
        applicant_id: user.id,
        full_name: form.fullName,
        age: parseInt(form.age),
        gender: form.gender,
        marital_status: form.maritalStatus,
        nationality: form.nationality,
        country_of_residence: form.countryOfResidence,
        city: form.city,
        occupation: form.occupation || null,
        phone: form.phone,
        whatsapp: form.whatsapp || null,
        monthly_income: form.monthlyIncome ? parseFloat(form.monthlyIncome) : null,
        income_currency: form.incomeCurrency,
        has_employment: form.hasEmployment === 'true',
        employment_type: form.employmentType || null,
        financial_hardship_desc: form.financialHardshipDesc,
        has_existing_debt: form.hasExistingDebt === 'true',
        debt_description: form.debtDescription || null,
        estimated_wedding_cost: form.estimatedWeddingCost ? parseFloat(form.estimatedWeddingCost) : null,
        amount_requested: parseFloat(form.amountRequested),
        amount_raised: 0,
        religiosity_level: form.religiosityLevel,
        is_already_engaged: form.isAlreadyEngaged === 'true',
        partner_name: form.partnerName || null,
        partner_nationality: form.partnerNationality || null,
        how_they_met: form.howTheyMet || null,
        local_mosque_name: form.localMosqueName,
        local_mosque_city: form.localMosqueCity,
        imam_reference_name: form.imamReferenceName,
        imam_contact: form.imamContact,
        reason_for_marriage: form.reasonForMarriage,
        id_document_url: form.idDocumentUrl,
        income_proof_url: form.incomeProofUrl,
        imam_letter_url: form.imamLetterUrl,
        profile_photo_url: form.profilePhotoUrl || null,
        is_anonymous: form.isAnonymous,
        display_alias: form.displayAlias || null,
        consent_to_share_story: form.consentToShareStory,
      }

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to submit application')
      }

      localStorage.removeItem('nikah-application')
      setSubmitted(true)
      toast.success('Application submitted successfully! Jazakallah Khair!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application')
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <ArabicText text="رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ" size="lg" className="text-primary mb-4" />
          <h1 className="text-3xl font-display font-bold text-charcoal mb-3">Jazakallah Khair!</h1>
          <p className="text-gray-500 mb-2">Your application has been received successfully.</p>
          <p className="text-gray-500 mb-6">Our team will review it and get back to you within 3-7 business days.</p>
          <p className="text-sm text-gray-400 italic mb-6 font-quote">"Our Lord, grant us from among our spouses and offspring comfort to our eyes." — Al-Furqan 25:74</p>
          <Button variant="primary" onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    )
  }

  const stepContent = (step: number) => {
    switch (step) {
      case 0: return (
        <div className="space-y-4">
          <Input label="Full Name *" type="text" placeholder="Your full name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Age *" type="number" min={18} max={80} placeholder="Your age" value={form.age} onChange={(e) => update('age', e.target.value)} />
            <Select label="Gender *" options={[{ value: 'male', label: 'Brother' }, { value: 'female', label: 'Sister' }]} placeholder="Select gender" value={form.gender} onChange={(e) => update('gender', e.target.value)} />
          </div>
          <Select label="Marital Status" options={[{ value: 'single', label: 'Single' }, { value: 'widowed', label: 'Widowed' }, { value: 'divorced', label: 'Divorced' }]} value={form.maritalStatus} onChange={(e) => update('maritalStatus', e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Nationality *" options={COUNTRIES.map(c => ({ value: c, label: c }))} placeholder="Select nationality" value={form.nationality} onChange={(e) => update('nationality', e.target.value)} />
            <Select label="Country of Residence *" options={COUNTRIES.map(c => ({ value: c, label: c }))} placeholder="Select country" value={form.countryOfResidence} onChange={(e) => update('countryOfResidence', e.target.value)} />
          </div>
          <Input label="City *" type="text" placeholder="Your city" value={form.city} onChange={(e) => update('city', e.target.value)} />
          <Input label="Occupation" type="text" placeholder="Your occupation (optional)" value={form.occupation} onChange={(e) => update('occupation', e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone Number *" type="tel" placeholder="+1234567890" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            <Input label="WhatsApp" type="tel" placeholder="+1234567890 (optional)" value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} />
          </div>
        </div>
      )
      case 1: return (
        <div className="space-y-4">
          <Select label="Employment Status" options={[{ value: '', label: 'Select...' }, { value: 'employed', label: 'Employed' }, { value: 'self-employed', label: 'Self-Employed' }, { value: 'unemployed', label: 'Unemployed' }, { value: 'student', label: 'Student' }]} value={form.employmentType} onChange={(e) => update('employmentType', e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Monthly Income" type="number" placeholder="Monthly income" value={form.monthlyIncome} onChange={(e) => update('monthlyIncome', e.target.value)} />
            <Select label="Currency" options={CURRENCIES.map(c => ({ value: c.code, label: `${c.code} (${c.symbol})` }))} value={form.incomeCurrency} onChange={(e) => update('incomeCurrency', e.target.value)} />
          </div>
          <Textarea label="Describe Your Financial Hardship *" placeholder="Please describe your financial situation in detail (minimum 100 characters)..." showCount maxLength={2000} value={form.financialHardshipDesc} onChange={(e: any) => update('financialHardshipDesc', e.target.value)} />
          <Select label="Do you have existing debt?" options={[{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes' }]} value={form.hasExistingDebt} onChange={(e) => update('hasExistingDebt', e.target.value)} />
          {form.hasExistingDebt === 'true' && <Textarea label="Describe your debt" placeholder="Briefly describe your debt situation..." value={form.debtDescription} onChange={(e: any) => update('debtDescription', e.target.value)} />}
          <Input label="Estimated Total Wedding Cost" type="number" placeholder="Total cost needed" value={form.estimatedWeddingCost} onChange={(e) => update('estimatedWeddingCost', e.target.value)} />
          <Input label="Amount You Are Requesting *" type="number" placeholder="Amount you need (e.g., 500)" value={form.amountRequested} onChange={(e) => update('amountRequested', e.target.value)} />
          <p className="text-xs text-gray-400">Typical requests: KSh 200 - KSh 2,000</p>
        </div>
      )
      case 2: return (
        <div className="space-y-4">
          <Select label="Level of Islamic Practice *" options={[{ value: '', label: 'Select...' }, { value: 'practicing', label: 'Practicing' }, { value: 'moderate', label: 'Moderate' }, { value: 'learning', label: 'Learning' }]} value={form.religiosityLevel} onChange={(e) => update('religiosityLevel', e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Local Mosque Name *" type="text" placeholder="Name of your local mosque" value={form.localMosqueName} onChange={(e) => update('localMosqueName', e.target.value)} />
            <Input label="Mosque City *" type="text" placeholder="City of your mosque" value={form.localMosqueCity} onChange={(e) => update('localMosqueCity', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Imam Reference Name *" type="text" placeholder="Full name of your Imam" value={form.imamReferenceName} onChange={(e) => update('imamReferenceName', e.target.value)} />
            <Input label="Imam Contact *" type="text" placeholder="Phone or email of Imam" value={form.imamContact} onChange={(e) => update('imamContact', e.target.value)} />
          </div>
          <hr className="border-gray-200" />
          <Select label="Are you already engaged?" options={[{ value: 'false', label: 'No, not yet' }, { value: 'true', label: 'Yes, I am engaged' }]} value={form.isAlreadyEngaged} onChange={(e) => update('isAlreadyEngaged', e.target.value)} />
          {form.isAlreadyEngaged === 'true' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Partner's Name" type="text" placeholder="Partner's name" value={form.partnerName} onChange={(e) => update('partnerName', e.target.value)} />
                <Input label="Partner's Nationality" type="text" placeholder="Partner's nationality" value={form.partnerNationality} onChange={(e) => update('partnerNationality', e.target.value)} />
              </div>
              <Textarea label="How did you meet (Islamically)?" placeholder="Briefly describe how you were introduced..." value={form.howTheyMet} onChange={(e: any) => update('howTheyMet', e.target.value)} />
            </>
          )}
          <Textarea label="Why do you want to marry now? *" placeholder="Write your personal statement (minimum 50 characters)..." showCount maxLength={2000} value={form.reasonForMarriage} onChange={(e: any) => update('reasonForMarriage', e.target.value)} />
        </div>
      )
      case 3: return (
        <div className="space-y-6">
          <p className="text-sm text-gray-500">Upload clear scans or photos of your documents. All documents are encrypted and only visible to reviewers.</p>
          <FileUpload label="National ID or Passport" required value={form.idDocumentUrl} onChange={(url) => update('idDocumentUrl', url)} folder={`applications/pending/id`} />
          <FileUpload label="Proof of Income / Financial Statement" required value={form.incomeProofUrl} onChange={(url) => update('incomeProofUrl', url)} folder={`applications/pending/income`} />
          <FileUpload label="Imam Reference Letter" required value={form.imamLetterUrl} onChange={(url) => update('imamLetterUrl', url)} folder={`applications/pending/imam`} />
          <FileUpload label="Profile Photo (Reviewer Use Only)" value={form.profilePhotoUrl} onChange={(url) => update('profilePhotoUrl', url)} folder={`applications/pending/photo`} />
          <p className="text-xs text-gray-400">Your photos are never shown publicly. They are for reviewer verification only.</p>
        </div>
      )
      case 4: return (
        <div className="space-y-6">
          <div className="bg-light-teal rounded-xl p-6">
            <h3 className="font-display font-bold text-lg text-charcoal mb-4">Review Your Application</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Name:</span> <span className="font-medium">{form.fullName}</span></div>
              <div><span className="text-gray-500">Age:</span> <span className="font-medium">{form.age}</span></div>
              <div><span className="text-gray-500">Gender:</span> <span className="font-medium capitalize">{form.gender}</span></div>
              <div><span className="text-gray-500">Country:</span> <span className="font-medium">{form.countryOfResidence}</span></div>
              <div><span className="text-gray-500">City:</span> <span className="font-medium">{form.city}</span></div>
              <div><span className="text-gray-500">Amount Requested:</span> <span className="font-medium">KSh ${form.amountRequested}</span></div>
              <div><span className="text-gray-500">Mosque:</span> <span className="font-medium">{form.localMosqueName}</span></div>
              <div><span className="text-gray-500">Imam:</span> <span className="font-medium">{form.imamReferenceName}</span></div>
            </div>
          </div>

          {/* Privacy options */}
          <div className="bg-soft rounded-xl p-6">
            <h3 className="font-display font-bold text-lg text-charcoal mb-4">Privacy & Consent</h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isAnonymous} onChange={(e) => update('isAnonymous', e.target.checked)} className="mt-1 rounded border-gray-300 text-primary focus:ring-primary" />
                <div><p className="text-sm font-medium text-charcoal">Make my name anonymous on the platform</p><p className="text-xs text-gray-500">Show an alias instead of your real name to sponsors</p></div>
              </label>
              {form.isAnonymous && <Input label="Preferred Alias" type="text" placeholder='e.g., "Brother Ali, Pakistan"' value={form.displayAlias} onChange={(e) => update('displayAlias', e.target.value)} />}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.consentToShareStory} onChange={(e) => update('consentToShareStory', e.target.checked)} className="mt-1 rounded border-gray-300 text-primary focus:ring-primary" />
                <div><p className="text-sm font-medium text-charcoal">I consent to publish my story as a success story</p><p className="text-xs text-gray-500">Your story may inspire others and encourage more sponsors</p></div>
              </label>
            </div>
          </div>

          {/* Agreements */}
          <div className="space-y-2 p-4 bg-gray-50 rounded-xl">
            {[
              'I confirm all information provided is truthful and accurate',
              'I understand that sponsorship is not guaranteed',
              'I consent to my application being reviewed by platform staff and scholars',
              'I am applying for Halal Nikah purposes only',
              'I agree to the Terms of Service and Privacy Policy',
            ].map((text, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 rounded border-gray-300 text-primary focus:ring-primary" required />
                <span className="text-sm text-gray-600">{text}</span>
              </label>
            ))}
          </div>
        </div>
      )
      default: return null
    }
  }

  return (
    <div className="py-8 px-4 max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((s, i) => (
            <div key={i} className={`text-xs font-medium transition-colors ${i <= step ? 'text-primary' : 'text-gray-400'}`}>
              {s}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      {/* Step title */}
      <div className="mb-6">
        <Badge variant="default" size="sm">Step {step + 1} of {STEPS.length}</Badge>
        <h2 className="text-2xl font-display font-bold text-charcoal mt-2">{STEPS[step]}</h2>
      </div>

      {/* Step content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction < 0 ? 20 : -20 }}
          transition={{ duration: 0.3 }}
        >
          {stepContent(step)}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={goPrev} disabled={step === 0} icon={<ArrowLeft className="h-4 w-4" />}>
          Previous
        </Button>
        {step < STEPS.length - 1 ? (
          <Button variant="primary" onClick={() => { if (validateStep()) goNext() }} icon={<ArrowRight className="h-4 w-4" />}>
            Next
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit} loading={submitting} icon={<Shield className="h-4 w-4" />}>
            Submit Application
          </Button>
        )}
      </div>
    </div>
  )
}
