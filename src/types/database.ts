export type UserRole = 'applicant' | 'sponsor' | 'admin' | 'reviewer'
export type ApplicationStatus = 'pending' | 'under_review' | 'info_requested' | 'approved' | 'sponsored' | 'partially_funded' | 'fully_funded' | 'completed' | 'rejected' | 'withdrawn'
export type UrgencyLevel = 'low' | 'normal' | 'high' | 'critical'
export type MeetingType = 'video' | 'phone' | 'in_person'
export type MeetingStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show'
export type SponsorshipStatus = 'pledged' | 'partial' | 'completed' | 'refunded' | 'cancelled'
export type NotificationType = 'application_submitted' | 'application_under_review' | 'info_requested' | 'meeting_scheduled' | 'meeting_reminder' | 'application_approved' | 'application_rejected' | 'sponsor_matched' | 'sponsorship_received' | 'payment_confirmed' | 'marriage_completed' | 'new_application' | 'new_sponsorship_pledge' | 'document_request' | 'system_announcement'

export interface Profile {
  id: string
  role: UserRole
  full_name: string
  email: string
  phone?: string
  whatsapp?: string
  country?: string
  city?: string
  profile_photo?: string
  gender?: 'male' | 'female'
  date_of_birth?: string
  nationality?: string
  languages?: string[]
  bio?: string
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  applicant_id: string
  full_name: string
  age: number
  gender: 'male' | 'female'
  marital_status: 'single' | 'widowed' | 'divorced'
  nationality: string
  country_of_residence: string
  city: string
  occupation?: string
  phone: string
  whatsapp?: string
  monthly_income?: number
  income_currency: string
  has_employment: boolean
  employment_type?: 'employed' | 'self-employed' | 'unemployed' | 'student'
  financial_hardship_desc: string
  has_existing_debt: boolean
  debt_description?: string
  estimated_wedding_cost?: number
  amount_requested: number
  amount_raised: number
  religiosity_level: 'practicing' | 'moderate' | 'learning'
  is_already_engaged: boolean
  partner_name?: string
  partner_nationality?: string
  how_they_met?: string
  local_mosque_name: string
  local_mosque_city: string
  imam_reference_name: string
  imam_contact: string
  reason_for_marriage: string
  id_document_url?: string
  income_proof_url?: string
  imam_letter_url?: string
  additional_docs?: string[]
  profile_photo_url?: string
  status: ApplicationStatus
  urgency_level: UrgencyLevel
  urgency_reason?: string
  reviewer_id?: string
  reviewer_notes?: string
  admin_notes?: string
  rejection_reason?: string
  sponsor_id?: string
  sponsor_notes?: string
  review_meeting_date?: string
  review_meeting_link?: string
  review_meeting_notes?: string
  review_meeting_type?: MeetingType
  is_anonymous: boolean
  display_alias?: string
  consent_to_share_story: boolean
  submitted_at: string
  reviewed_at?: string
  approved_at?: string
  sponsored_at?: string
  completed_at?: string
  updated_at: string
}

export interface Sponsorship {
  id: string
  sponsor_id: string
  application_id: string
  amount_pledged: number
  amount_paid: number
  currency: string
  exchange_rate?: number
  payment_method?: 'bank_transfer' | 'online' | 'cash' | 'cheque' | 'crypto'
  payment_ref?: string
  payment_proof_url?: string
  status: SponsorshipStatus
  sponsor_message?: string
  is_anonymous: boolean
  is_zakat: boolean
  is_sadaqah: boolean
  pledged_at: string
  paid_at?: string
  confirmed_at?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  link?: string
  metadata?: Record<string, any>
  is_read: boolean
  created_at: string
}

export interface Meeting {
  id: string
  application_id: string
  scheduled_by: string
  applicant_id: string
  reviewer_id?: string
  meeting_type: MeetingType
  meeting_date: string
  duration_mins: number
  timezone: string
  meeting_link?: string
  meeting_password?: string
  location?: string
  phone_number?: string
  agenda?: string
  status: MeetingStatus
  outcome?: string
  outcome_action?: 'approve' | 'reject' | 'request_more_info' | 'reschedule' | 'pending'
  reminder_sent_1h: boolean
  reminder_sent_24h: boolean
  created_at: string
  updated_at: string
}

export interface SuccessStory {
  id: string
  application_id?: string
  couple_alias: string
  story_text: string
  story_excerpt?: string
  photo_url?: string
  wedding_date?: string
  country?: string
  city?: string
  is_featured: boolean
  is_published: boolean
  views_count: number
  likes_count: number
  tags?: string[]
  created_at: string
  published_at?: string
}

export interface FAQ {
  id: string
  category: 'applicant' | 'sponsor' | 'general' | 'islamic' | 'process'
  question: string
  answer: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  category?: 'general' | 'application' | 'sponsorship' | 'technical' | 'media' | 'other'
  is_resolved: boolean
  resolved_by?: string
  resolved_at?: string
  admin_notes?: string
  created_at: string
}

export interface PlatformStats {
  id: number
  total_applications: number
  total_approved: number
  total_completed: number
  total_sponsors: number
  total_amount_raised: number
  countries_reached: number
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, 'created_at' | 'updated_at'>; Update: Partial<Omit<Profile, 'id'>> }
      applications: { Row: Application; Insert: Omit<Application, 'id' | 'submitted_at' | 'updated_at'>; Update: Partial<Omit<Application, 'id'>> }
      sponsorships: { Row: Sponsorship; Insert: Omit<Sponsorship, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Sponsorship, 'id'>> }
      notifications: { Row: Notification; Insert: Omit<Notification, 'id' | 'created_at'>; Update: Partial<Omit<Notification, 'id'>> }
      meetings: { Row: Meeting; Insert: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Meeting, 'id'>> }
      success_stories: { Row: SuccessStory; Insert: Omit<SuccessStory, 'id' | 'created_at'>; Update: Partial<Omit<SuccessStory, 'id'>> }
      faqs: { Row: FAQ; Insert: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<FAQ, 'id'>> }
      contact_messages: { Row: ContactMessage; Insert: Omit<ContactMessage, 'id' | 'created_at'>; Update: Partial<Omit<ContactMessage, 'id'>> }
      platform_stats: { Row: PlatformStats; Insert: Omit<PlatformStats, 'updated_at'>; Update: Partial<Omit<PlatformStats, 'id'>> }
    }
  }
}
