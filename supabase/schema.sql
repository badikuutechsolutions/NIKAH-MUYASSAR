-- =====================================================
-- Nikah Muyassar - Complete Database Schema
-- All 9 tables with RLS policies and triggers
-- =====================================================

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'applicant' CHECK (role IN ('applicant', 'sponsor', 'admin', 'reviewer')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  whatsapp TEXT,
  country TEXT,
  city TEXT,
  profile_photo TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  date_of_birth DATE,
  nationality TEXT,
  languages TEXT[],
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "users_own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "admin_all_profiles" ON profiles
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'reviewer')
  );

-- 2. APPLICATIONS
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 80),
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  marital_status TEXT DEFAULT 'single' CHECK (marital_status IN ('single', 'widowed', 'divorced')),
  nationality TEXT NOT NULL,
  country_of_residence TEXT NOT NULL,
  city TEXT NOT NULL,
  occupation TEXT,
  phone TEXT,
  whatsapp TEXT,
  monthly_income DECIMAL(10, 2),
  income_currency TEXT DEFAULT 'USD',
  has_employment BOOLEAN DEFAULT FALSE,
  employment_type TEXT CHECK (employment_type IN ('employed', 'self-employed', 'unemployed', 'student')),
  financial_hardship_desc TEXT NOT NULL,
  has_existing_debt BOOLEAN DEFAULT FALSE,
  debt_description TEXT,
  estimated_wedding_cost DECIMAL(10, 2),
  amount_requested DECIMAL(10, 2) NOT NULL,
  amount_raised DECIMAL(10, 2) DEFAULT 0,
  religiosity_level TEXT CHECK (religiosity_level IN ('practicing', 'moderate', 'learning')),
  is_already_engaged BOOLEAN DEFAULT FALSE,
  partner_name TEXT,
  partner_nationality TEXT,
  how_they_met TEXT,
  local_mosque_name TEXT,
  local_mosque_city TEXT,
  imam_reference_name TEXT,
  imam_contact TEXT,
  reason_for_marriage TEXT,
  id_document_url TEXT,
  income_proof_url TEXT,
  imam_letter_url TEXT,
  additional_docs TEXT[],
  profile_photo_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'info_requested', 'approved', 'sponsored', 'partially_funded', 'fully_funded', 'completed', 'rejected', 'withdrawn')),
  urgency_level TEXT DEFAULT 'normal' CHECK (urgency_level IN ('low', 'normal', 'high', 'critical')),
  urgency_reason TEXT,
  reviewer_id UUID REFERENCES profiles(id),
  reviewer_notes TEXT,
  admin_notes TEXT,
  rejection_reason TEXT,
  sponsor_id UUID REFERENCES profiles(id),
  sponsor_notes TEXT,
  review_meeting_date TIMESTAMPTZ,
  review_meeting_link TEXT,
  review_meeting_notes TEXT,
  review_meeting_type TEXT CHECK (review_meeting_type IN ('video', 'phone', 'in_person')),
  is_anonymous BOOLEAN DEFAULT FALSE,
  display_alias TEXT,
  consent_to_share_story BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  sponsored_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "applicant_own_applications" ON applications
  FOR ALL USING (auth.uid() = applicant_id);

CREATE POLICY IF NOT EXISTS "sponsor_view_approved" ON applications
  FOR SELECT USING (
    status IN ('approved', 'sponsored', 'partially_funded') AND
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'sponsor'
  );

CREATE POLICY IF NOT EXISTS "admin_reviewer_all_applications" ON applications
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'reviewer')
  );

-- 3. SPONSORSHIPS
CREATE TABLE IF NOT EXISTS sponsorships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sponsor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  amount_pledged DECIMAL(10, 2) NOT NULL,
  amount_paid DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  exchange_rate DECIMAL(10, 4),
  payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'online', 'cash', 'cheque', 'crypto')),
  payment_ref TEXT,
  payment_proof_url TEXT,
  status TEXT DEFAULT 'pledged' CHECK (status IN ('pledged', 'partial', 'completed', 'refunded', 'cancelled')),
  sponsor_message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_zakat BOOLEAN DEFAULT FALSE,
  is_sadaqah BOOLEAN DEFAULT TRUE,
  pledged_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sponsorships ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "sponsor_own_sponsorships" ON sponsorships
  FOR ALL USING (auth.uid() = sponsor_id);

CREATE POLICY IF NOT EXISTS "applicant_view_own_sponsorships" ON sponsorships
  FOR SELECT USING (
    application_id IN (SELECT id FROM applications WHERE applicant_id = auth.uid())
  );

CREATE POLICY IF NOT EXISTS "admin_all_sponsorships" ON sponsorships
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- 4. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('application_submitted', 'application_under_review', 'info_requested', 'meeting_scheduled', 'meeting_reminder', 'application_approved', 'application_rejected', 'sponsor_matched', 'sponsorship_received', 'payment_confirmed', 'marriage_completed', 'new_application', 'new_sponsorship_pledge', 'document_request', 'system_announcement')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  metadata JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(user_id, is_read);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "own_notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- 5. MEETINGS
CREATE TABLE IF NOT EXISTS meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  scheduled_by UUID REFERENCES profiles(id) NOT NULL,
  applicant_id UUID REFERENCES profiles(id) NOT NULL,
  reviewer_id UUID REFERENCES profiles(id),
  meeting_type TEXT NOT NULL CHECK (meeting_type IN ('video', 'phone', 'in_person')),
  meeting_date TIMESTAMPTZ NOT NULL,
  duration_mins INTEGER DEFAULT 30,
  timezone TEXT DEFAULT 'UTC',
  meeting_link TEXT,
  meeting_password TEXT,
  location TEXT,
  phone_number TEXT,
  agenda TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled', 'no_show')),
  outcome TEXT,
  outcome_action TEXT CHECK (outcome_action IN ('approve', 'reject', 'request_more_info', 'reschedule', 'pending')),
  reminder_sent_1h BOOLEAN DEFAULT FALSE,
  reminder_sent_24h BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "applicant_own_meetings" ON meetings
  FOR SELECT USING (auth.uid() = applicant_id);

CREATE POLICY IF NOT EXISTS "reviewer_assigned_meetings" ON meetings
  FOR ALL USING (auth.uid() = reviewer_id);

CREATE POLICY IF NOT EXISTS "admin_all_meetings" ON meetings
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- 6. SUCCESS_STORIES
CREATE TABLE IF NOT EXISTS success_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id),
  couple_alias TEXT NOT NULL,
  story_text TEXT NOT NULL,
  story_excerpt TEXT,
  photo_url TEXT,
  wedding_date DATE,
  country TEXT,
  city TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "public_read_published_stories" ON success_stories
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY IF NOT EXISTS "admin_manage_stories" ON success_stories
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- 7. FAQS
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('applicant', 'sponsor', 'general', 'islamic', 'process')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "public_read_active_faqs" ON faqs
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY IF NOT EXISTS "admin_manage_faqs" ON faqs
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- 8. CONTACT_MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT CHECK (category IN ('general', 'application', 'sponsorship', 'technical', 'media', 'other')),
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "anyone_can_insert_contact" ON contact_messages
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY IF NOT EXISTS "admin_manage_contacts" ON contact_messages
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- 9. PLATFORM_STATS
CREATE TABLE IF NOT EXISTS platform_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_applications INTEGER DEFAULT 0,
  total_approved INTEGER DEFAULT 0,
  total_completed INTEGER DEFAULT 0,
  total_sponsors INTEGER DEFAULT 0,
  total_amount_raised DECIMAL(12, 2) DEFAULT 0,
  countries_reached INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO platform_stats (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE platform_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "public_read_platform_stats" ON platform_stats
  FOR SELECT USING (TRUE);

CREATE POLICY IF NOT EXISTS "admin_update_platform_stats" ON platform_stats
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER IF NOT EXISTS applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER IF NOT EXISTS sponsorships_updated_at
  BEFORE UPDATE ON sponsorships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER IF NOT EXISTS meetings_updated_at
  BEFORE UPDATE ON meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER IF NOT EXISTS faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
