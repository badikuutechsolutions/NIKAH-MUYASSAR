-- =====================================================
-- Nikah Muyassar - Database Schema
-- All 9 tables with RLS policies and triggers
-- =====================================================

-- 1. PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('applicant', 'sponsor', 'admin', 'scholar')),
  avatar_url TEXT,
  phone TEXT,
  country TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  is_onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Sponsors can view applicant profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('sponsor', 'admin', 'scholar')
    )
  );

-- 2. APPLICATIONS
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  partner_name TEXT,
  country TEXT NOT NULL,
  city TEXT,
  amount_requested DECIMAL(12,2) NOT NULL,
  amount_raised DECIMAL(12,2) DEFAULT 0,
  financial_story TEXT NOT NULL,
  personal_story TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'under_review', 'approved', 'funded', 'completed', 'rejected')),
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
  gender TEXT CHECK (gender IN ('male', 'female')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicants can CRUD their own applications"
  ON applications FOR ALL
  USING (applicant_id = auth.uid())
  WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Sponsors can view approved applications"
  ON applications FOR SELECT
  USING (
    status IN ('approved', 'funded', 'completed')
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('sponsor', 'admin', 'scholar')
    )
  );

CREATE POLICY "Admins can manage all applications"
  ON applications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'scholar')
    )
  );

-- 3. SPONSORSHIPS
CREATE TABLE sponsorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE sponsorships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sponsors can manage their own sponsorships"
  ON sponsorships FOR ALL
  USING (sponsor_id = auth.uid())
  WITH CHECK (sponsor_id = auth.uid());

CREATE POLICY "Applicants can view sponsorships for their applications"
  ON sponsorships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_id AND a.applicant_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all sponsorships"
  ON sponsorships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 4. DOCUMENTS
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('id', 'proof_of_income', 'imam_letter', 'additional', 'other')),
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own documents"
  ON documents FOR ALL
  USING (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_id AND a.applicant_id = auth.uid()
    )
  );

CREATE POLICY "Admins and scholars can view documents"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'scholar')
    )
  );

-- 5. REVIEWS
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'needs_info')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviewers can manage their own reviews"
  ON reviews FOR ALL
  USING (reviewer_id = auth.uid())
  WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Admins can view all reviews"
  ON reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Applicants can view reviews on their applications"
  ON reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_id AND a.applicant_id = auth.uid()
    )
  );

-- 6. FAQS
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('general', 'applicant', 'sponsor', 'islamic', 'process')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published FAQs"
  ON faqs FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage FAQs"
  ON faqs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 7. PLATFORM_STATS
CREATE TABLE platform_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_applications INTEGER NOT NULL DEFAULT 0,
  total_approved INTEGER NOT NULL DEFAULT 0,
  total_completed INTEGER NOT NULL DEFAULT 0,
  total_sponsors INTEGER NOT NULL DEFAULT 0,
  total_amount_raised DECIMAL(14,2) NOT NULL DEFAULT 0,
  countries_reached INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE platform_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view platform stats"
  ON platform_stats FOR SELECT
  USING (true);

CREATE POLICY "Admins can update platform stats"
  ON platform_stats FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 8. SUCCESS_STORIES
CREATE TABLE success_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_alias TEXT NOT NULL,
  story_text TEXT NOT NULL,
  story_excerpt TEXT,
  country TEXT,
  photo_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published success stories"
  ON success_stories FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage success stories"
  ON success_stories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 9. TRANSACTIONS
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsorship_id UUID NOT NULL REFERENCES sponsorships(id) ON DELETE CASCADE,
  sponsor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sponsors can view their own transactions"
  ON transactions FOR SELECT
  USING (sponsor_id = auth.uid());

CREATE POLICY "Admins can manage all transactions"
  ON transactions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- TRIGGERS

-- Trigger: auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_sponsorships_updated_at
  BEFORE UPDATE ON sponsorships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_platform_stats_updated_at
  BEFORE UPDATE ON platform_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_success_stories_updated_at
  BEFORE UPDATE ON success_stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger: auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'applicant')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger: update amount_raised on applications when sponsorship is completed
CREATE OR REPLACE FUNCTION update_application_amount_raised()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE applications
    SET amount_raised = amount_raised + NEW.amount
    WHERE id = NEW.application_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_sponsorship_completed
  AFTER INSERT OR UPDATE OF status ON sponsorships
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION update_application_amount_raised();
