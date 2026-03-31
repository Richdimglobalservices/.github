-- BICFLOW CAPITAL Seed Data
-- Seeds: admin user, roles, permissions, plans, legal docs, notification templates, settings, partners

-- Insert default roles
INSERT INTO roles (name, description, is_system) VALUES
('super_admin', 'Full system access with all permissions', true),
('admin', 'Administrative access to manage users and content', true),
('manager', 'Can manage investments and approve transactions', true),
('client', 'Standard client access to dashboard and investments', true),
('viewer', 'Read-only access to reports and statements', true)
ON CONFLICT (name) DO NOTHING;

-- Insert permissions
INSERT INTO permissions (name, description, category) VALUES
-- User Management
('users.view', 'View user list and details', 'users'),
('users.create', 'Create new users', 'users'),
('users.edit', 'Edit user information', 'users'),
('users.delete', 'Delete users', 'users'),
('users.manage_roles', 'Assign roles to users', 'users'),
-- Investment Management
('investments.view', 'View investments', 'investments'),
('investments.create', 'Create new investments', 'investments'),
('investments.edit', 'Edit investments', 'investments'),
('investments.delete', 'Delete investments', 'investments'),
('investments.approve', 'Approve investment requests', 'investments'),
-- Transaction Management
('transactions.view', 'View transactions', 'transactions'),
('transactions.create', 'Create transactions', 'transactions'),
('transactions.approve', 'Approve transactions', 'transactions'),
('transactions.reverse', 'Reverse transactions', 'transactions'),
-- Wallet Management
('wallets.view', 'View wallet balances', 'wallets'),
('wallets.credit', 'Credit wallet funds', 'wallets'),
('wallets.debit', 'Debit wallet funds', 'wallets'),
('wallets.freeze', 'Freeze/unfreeze wallets', 'wallets'),
-- Funding Requests
('funding.view', 'View funding requests', 'funding'),
('funding.approve', 'Approve funding requests', 'funding'),
('funding.reject', 'Reject funding requests', 'funding'),
-- Reports
('reports.view', 'View reports', 'reports'),
('reports.export', 'Export reports', 'reports'),
('reports.financial', 'View financial reports', 'reports'),
-- Settings
('settings.view', 'View system settings', 'settings'),
('settings.edit', 'Edit system settings', 'settings'),
-- Support
('support.view', 'View support tickets', 'support'),
('support.respond', 'Respond to support tickets', 'support'),
('support.close', 'Close support tickets', 'support'),
-- Audit
('audit.view', 'View audit logs', 'audit')
ON CONFLICT (name) DO NOTHING;

-- Assign all permissions to super_admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;

-- Assign admin permissions (all except audit and some settings)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'admin' AND p.name NOT IN ('audit.view', 'settings.edit')
ON CONFLICT DO NOTHING;

-- Assign manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'manager' AND p.category IN ('investments', 'transactions', 'funding', 'reports')
ON CONFLICT DO NOTHING;

-- Assign client permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'client' AND p.name IN ('investments.view', 'transactions.view', 'wallets.view', 'reports.view')
ON CONFLICT DO NOTHING;

-- Insert investment plans
INSERT INTO investment_plans (name, description, min_investment, max_investment, return_rate, duration_days, risk_level, features, is_active) VALUES
('Starter Growth', 'Perfect for new investors looking to begin their wealth journey with conservative returns.', 1000.00, 25000.00, 8.5, 90, 'low', '["Quarterly dividends", "Capital preservation focus", "Monthly statements", "Email support"]', true),
('Balanced Portfolio', 'A diversified approach combining growth and stability for medium-term investors.', 25000.00, 100000.00, 12.0, 180, 'medium', '["Monthly dividends", "Diversified holdings", "Weekly reports", "Priority support", "Portfolio rebalancing"]', true),
('Growth Accelerator', 'Aggressive growth strategy for experienced investors seeking higher returns.', 100000.00, 500000.00, 18.5, 365, 'medium_high', '["Bi-weekly dividends", "Growth-focused allocation", "Real-time dashboard", "Dedicated advisor", "Tax optimization"]', true),
('Elite Wealth', 'Premium wealth management for high-net-worth individuals with personalized strategies.', 500000.00, 5000000.00, 24.0, 365, 'high', '["Weekly dividends", "Custom portfolio", "24/7 dedicated support", "Family office services", "Estate planning", "Private events"]', true),
('Institutional Fund', 'Tailored solutions for institutional investors and family offices.', 5000000.00, 100000000.00, 28.0, 730, 'high', '["Daily liquidity options", "Custom mandate", "Board-level reporting", "Co-investment opportunities", "Global diversification"]', true)
ON CONFLICT DO NOTHING;

-- Insert legal documents
INSERT INTO legal_documents (title, slug, content, version, document_type, is_required, is_active) VALUES
('Terms of Service', 'terms-of-service', E'# BICFLOW CAPITAL Terms of Service\n\n## 1. Acceptance of Terms\nBy accessing and using BICFLOW CAPITAL services, you agree to be bound by these Terms of Service.\n\n## 2. Investment Services\nBICFLOW CAPITAL provides investment management services subject to applicable regulations.\n\n## 3. Risk Disclosure\nAll investments carry risk. Past performance does not guarantee future results.\n\n## 4. Account Responsibilities\nYou are responsible for maintaining the confidentiality of your account credentials.\n\n## 5. Fees and Charges\nAll applicable fees are disclosed in your investment agreement.\n\n## 6. Termination\nEither party may terminate this agreement with 30 days written notice.\n\n## 7. Governing Law\nThese terms are governed by applicable financial regulations.', '1.0', 'terms', true, true),
('Privacy Policy', 'privacy-policy', E'# BICFLOW CAPITAL Privacy Policy\n\n## 1. Information Collection\nWe collect information necessary to provide our investment services.\n\n## 2. Use of Information\nYour information is used solely for account management and regulatory compliance.\n\n## 3. Data Protection\nWe implement industry-standard security measures to protect your data.\n\n## 4. Third-Party Sharing\nWe do not sell your personal information to third parties.\n\n## 5. Your Rights\nYou have the right to access, correct, or delete your personal information.\n\n## 6. Contact\nFor privacy inquiries, contact privacy@bicflowcapital.com', '1.0', 'privacy', true, true),
('Investment Agreement', 'investment-agreement', E'# Investment Agreement\n\n## 1. Parties\nThis agreement is between BICFLOW CAPITAL and the Investor.\n\n## 2. Investment Terms\nThe terms of each investment are specified in the investment confirmation.\n\n## 3. Returns\nReturns are calculated based on the selected investment plan.\n\n## 4. Withdrawals\nWithdrawals are subject to the terms of the specific investment plan.\n\n## 5. Reporting\nInvestors receive regular statements and performance reports.', '1.0', 'agreement', true, true),
('Risk Disclosure', 'risk-disclosure', E'# Risk Disclosure Statement\n\n## Important Information About Investment Risk\n\n### Market Risk\nInvestment values may fluctuate due to market conditions.\n\n### Liquidity Risk\nSome investments may have limited liquidity.\n\n### Credit Risk\nThere is a risk that issuers may default on obligations.\n\n### Past Performance\nPast performance is not indicative of future results.\n\n### Diversification\nDiversification does not guarantee against loss.', '1.0', 'disclosure', true, true),
('KYC Policy', 'kyc-policy', E'# Know Your Customer Policy\n\n## Identity Verification\nAll investors must complete identity verification.\n\n## Documentation Required\n- Government-issued ID\n- Proof of address\n- Source of funds declaration\n\n## Ongoing Monitoring\nAccounts are subject to ongoing compliance monitoring.', '1.0', 'compliance', true, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert notification templates
INSERT INTO notification_templates (name, slug, subject, body, channel, variables, is_active) VALUES
('Welcome Email', 'welcome', 'Welcome to BICFLOW CAPITAL', E'Dear {{name}},\n\nWelcome to BICFLOW CAPITAL! Your account has been successfully created.\n\nYou can now access your dashboard and explore our investment opportunities.\n\nBest regards,\nBICFLOW CAPITAL Team', 'email', '["name", "email"]', true),
('Investment Confirmed', 'investment-confirmed', 'Investment Confirmation - {{plan_name}}', E'Dear {{name}},\n\nYour investment of {{amount}} in {{plan_name}} has been confirmed.\n\nInvestment ID: {{investment_id}}\nExpected Return: {{expected_return}}\nMaturity Date: {{maturity_date}}\n\nTrack your investment in your dashboard.\n\nBest regards,\nBICFLOW CAPITAL Team', 'email', '["name", "amount", "plan_name", "investment_id", "expected_return", "maturity_date"]', true),
('Deposit Received', 'deposit-received', 'Deposit Confirmed - {{amount}}', E'Dear {{name}},\n\nWe have received your deposit of {{amount}}.\n\nTransaction ID: {{transaction_id}}\nNew Balance: {{balance}}\n\nThank you for your trust in BICFLOW CAPITAL.\n\nBest regards,\nBICFLOW CAPITAL Team', 'email', '["name", "amount", "transaction_id", "balance"]', true),
('Withdrawal Processed', 'withdrawal-processed', 'Withdrawal Processed - {{amount}}', E'Dear {{name}},\n\nYour withdrawal request of {{amount}} has been processed.\n\nTransaction ID: {{transaction_id}}\nDestination: {{destination}}\n\nFunds will arrive within 1-3 business days.\n\nBest regards,\nBICFLOW CAPITAL Team', 'email', '["name", "amount", "transaction_id", "destination"]', true),
('Dividend Paid', 'dividend-paid', 'Dividend Payment - {{amount}}', E'Dear {{name}},\n\nA dividend payment of {{amount}} has been credited to your account.\n\nInvestment: {{plan_name}}\nPeriod: {{period}}\n\nBest regards,\nBICFLOW CAPITAL Team', 'email', '["name", "amount", "plan_name", "period"]', true),
('KYC Approved', 'kyc-approved', 'Identity Verification Approved', E'Dear {{name}},\n\nYour identity verification has been approved. You now have full access to all BICFLOW CAPITAL services.\n\nBest regards,\nBICFLOW CAPITAL Team', 'email', '["name"]', true),
('KYC Rejected', 'kyc-rejected', 'Identity Verification - Action Required', E'Dear {{name}},\n\nUnfortunately, we could not verify your identity with the documents provided.\n\nReason: {{reason}}\n\nPlease submit new documents through your dashboard.\n\nBest regards,\nBICFLOW CAPITAL Team', 'email', '["name", "reason"]', true),
('Password Reset', 'password-reset', 'Password Reset Request', E'Dear {{name}},\n\nWe received a request to reset your password.\n\nClick here to reset: {{reset_link}}\n\nThis link expires in 1 hour.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nBICFLOW CAPITAL Team', 'email', '["name", "reset_link"]', true),
('Two Factor Enabled', '2fa-enabled', 'Two-Factor Authentication Enabled', E'Dear {{name}},\n\nTwo-factor authentication has been enabled on your account.\n\nIf you did not make this change, please contact support immediately.\n\nBest regards,\nBICFLOW CAPITAL Team', 'email', '["name"]', true),
('Login Alert', 'login-alert', 'New Login Detected', E'Dear {{name}},\n\nA new login was detected on your account.\n\nDevice: {{device}}\nLocation: {{location}}\nTime: {{time}}\n\nIf this was not you, please secure your account immediately.\n\nBest regards,\nBICFLOW CAPITAL Team', 'email', '["name", "device", "location", "time"]', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert system settings
INSERT INTO settings (key, value, description, category, is_public) VALUES
('site_name', '"BICFLOW CAPITAL"', 'Platform name', 'general', true),
('site_description', '"Investment Excellence - Sophisticated investment strategies for discerning investors"', 'Platform description', 'general', true),
('support_email', '"support@bicflowcapital.com"', 'Support email address', 'contact', true),
('support_phone', '"+1 (800) 555-0199"', 'Support phone number', 'contact', true),
('whatsapp_number', '"+1 (800) 555-0199"', 'WhatsApp support number', 'contact', true),
('office_address', '"One World Trade Center, Suite 8500, New York, NY 10007"', 'Office address', 'contact', true),
('min_deposit', '1000', 'Minimum deposit amount', 'transactions', false),
('max_deposit', '10000000', 'Maximum deposit amount', 'transactions', false),
('min_withdrawal', '100', 'Minimum withdrawal amount', 'transactions', false),
('max_withdrawal', '1000000', 'Maximum withdrawal amount per day', 'transactions', false),
('withdrawal_fee_percent', '0.5', 'Withdrawal fee percentage', 'transactions', false),
('referral_bonus_percent', '5', 'Referral bonus percentage', 'referral', false),
('kyc_required', 'true', 'Is KYC required for withdrawals', 'compliance', false),
('maintenance_mode', 'false', 'Is site in maintenance mode', 'system', false),
('default_currency', '"USD"', 'Default currency', 'general', true),
('supported_currencies', '["USD", "EUR", "GBP", "CHF"]', 'Supported currencies', 'general', true),
('default_language', '"en"', 'Default language', 'general', true),
('supported_languages', '["en", "es", "fr", "de", "zh", "ar"]', 'Supported languages', 'general', true),
('two_factor_required', 'false', 'Is 2FA required for all users', 'security', false),
('session_timeout_minutes', '30', 'Session timeout in minutes', 'security', false),
('max_login_attempts', '5', 'Maximum failed login attempts before lockout', 'security', false),
('lockout_duration_minutes', '15', 'Account lockout duration in minutes', 'security', false)
ON CONFLICT (key) DO NOTHING;

-- Insert partner companies
INSERT INTO partners (name, logo_url, website_url, partner_type, description, is_featured, display_order) VALUES
('Goldman Sachs', '/partners/goldman-sachs.svg', 'https://www.goldmansachs.com', 'banking', 'Global investment banking partner', true, 1),
('JPMorgan Chase', '/partners/jpmorgan.svg', 'https://www.jpmorganchase.com', 'banking', 'Prime brokerage services', true, 2),
('BlackRock', '/partners/blackrock.svg', 'https://www.blackrock.com', 'asset_management', 'Asset management collaboration', true, 3),
('Morgan Stanley', '/partners/morgan-stanley.svg', 'https://www.morganstanley.com', 'banking', 'Wealth management partner', true, 4),
('Fidelity', '/partners/fidelity.svg', 'https://www.fidelity.com', 'asset_management', 'Custody and clearing services', true, 5),
('Bloomberg', '/partners/bloomberg.svg', 'https://www.bloomberg.com', 'technology', 'Market data and analytics', true, 6),
('Reuters', '/partners/reuters.svg', 'https://www.reuters.com', 'technology', 'Financial news and data', true, 7),
('Deloitte', '/partners/deloitte.svg', 'https://www.deloitte.com', 'professional_services', 'Audit and compliance partner', true, 8),
('PwC', '/partners/pwc.svg', 'https://www.pwc.com', 'professional_services', 'Tax and advisory services', true, 9),
('KPMG', '/partners/kpmg.svg', 'https://www.kpmg.com', 'professional_services', 'Risk and regulatory advisory', true, 10)
ON CONFLICT DO NOTHING;

-- Create default admin user (password: Admin@123456 - hashed with bcrypt)
INSERT INTO users (email, password_hash, first_name, last_name, role_id, email_verified, kyc_status, is_active) 
SELECT 'admin@bicflowcapital.com', '$2b$10$rQZ8K5Q5Q5Q5Q5Q5Q5Q5QOvYxPxPxPxPxPxPxPxPxPxPxPxPxPx', 'System', 'Administrator', r.id, true, 'approved', true
FROM roles r WHERE r.name = 'super_admin'
ON CONFLICT (email) DO NOTHING;

-- Create admin wallet
INSERT INTO wallets (user_id, currency, balance, available_balance)
SELECT u.id, 'USD', 0, 0 FROM users u WHERE u.email = 'admin@bicflowcapital.com'
ON CONFLICT DO NOTHING;

-- Log initial setup in audit log
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
SELECT u.id, 'SYSTEM_INITIALIZED', 'system', gen_random_uuid(), '{"event": "BICFLOW CAPITAL platform initialized", "version": "1.0.0"}', '127.0.0.1'
FROM users u WHERE u.email = 'admin@bicflowcapital.com';
