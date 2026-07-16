-- Seed FAQs
INSERT INTO faqs (category, question, answer, order_index) VALUES
('general', 'What is Nikah Muyassar?', 'Nikah Muyassar (نكاح ميسر — "The Facilitated Marriage") is a faith-driven digital platform that connects financially struggling Muslims who wish to marry with generous sponsors who fund their weddings.', 1),
('applicant', 'Who can apply for sponsorship?', 'Any Muslim who genuinely intends Nikah (Islamic marriage contract) and can demonstrate financial hardship. You must provide a reference from a local Imam or trusted Islamic scholar. Both parties must be of legal marriage age in their country.', 2),
('sponsor', 'How do I become a sponsor?', 'Simply create an account and select "Sponsor" as your role. You can then browse approved applications, read anonymized stories, and make a sponsorship pledge toward a couple''s wedding costs.', 3),
('general', 'Is there any fee for applicants?', 'No, absolutely zero fees. 100% of all sponsorships go directly to supporting the couples'' weddings.', 4),
('applicant', 'What documents do I need to apply?', 'You need: (1) National ID or Passport, (2) Proof of income or financial situation, (3) A letter or reference from your local Imam. Additional supporting documents are optional.', 5),
('sponsor', 'Can I sponsor anonymously?', 'Yes! You can choose to hide your identity from the applicant. Your generosity will be known only to Allah.', 6),
('general', 'Is my data secure?', 'Absolutely. We use industry-standard encryption and strict access controls. Your personal data is never shared without your consent.', 7),
('islamic', 'Is this platform Islamically sound?', 'Yes. All applications are reviewed by qualified Islamic scholars. The platform ensures all marriages are Halal Nikah contracts, and we respect Islamic privacy principles throughout.', 8),
('process', 'How long does the application process take?', 'From submission to approval typically takes 5-10 business days, including a review meeting. Sponsorship matching varies depending on available sponsors.', 9),
('sponsor', 'Can I specify which type of applicant I want to support?', 'Yes, you can filter applications by country, gender, urgency level, and amount needed. You can also search for specific causes that resonate with you.', 10);

-- Seed platform stats (set to 0 — real data will populate as the platform launches)
INSERT INTO platform_stats (id, total_applications, total_approved, total_completed, total_sponsors, total_amount_raised, countries_reached)
VALUES (1, 0, 0, 0, 0, 0, 0)
ON CONFLICT (id) DO UPDATE SET
  total_applications = EXCLUDED.total_applications,
  total_approved = EXCLUDED.total_approved,
  total_completed = EXCLUDED.total_completed,
  total_sponsors = EXCLUDED.total_sponsors,
  total_amount_raised = EXCLUDED.total_amount_raised,
  countries_reached = EXCLUDED.countries_reached;
