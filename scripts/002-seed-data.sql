-- BICFLOW CAPITAL Seed Data
-- Seeds: roles, permissions, plans, legal docs, notification templates, settings, partners

-- Insert default roles
INSERT INTO roles (name, description, is_system) VALUES
('super_admin', 'Full system access with all permissions', true),
('admin', 'Administrative access to manage users and content', true),
('manager', 'Can manage investments and approve transactions', true),
('client', 'Standard client access to dashboard and investments', true),
('viewer', 'Read-only access to reports and statements', true)
ON CONFLICT (name) DO NOTHING;

-- Insert permissions (using 'module' column as per schema)
INSERT INTO permissions (name, description, module) VALUES
('users.view', 'View user list and details', 'users'),
('users.create', 'Create new users', 'users'),
('users.edit', 'Edit user information', 'users'),
('users.delete', 'Delete users', 'users'),
('users.manage_roles', 'Assign roles to users', 'users'),
('investments.view', 'View investments', 'investments'),
('investments.create', 'Create new investments', 'investments'),
('investments.edit', 'Edit investments', 'investments'),
('investments.delete', 'Delete investments', 'investments'),
('investments.approve', 'Approve investment requests', 'investments'),
('transactions.view', 'View transactions', 'transactions'),
('transactions.create', 'Create transactions', 'transactions'),
('transactions.approve', 'Approve transactions', 'transactions'),
('transactions.reverse', 'Reverse transactions', 'transactions'),
('wallets.view', 'View wallet balances', 'wallets'),
('wallets.credit', 'Credit wallet funds', 'wallets'),
('wallets.debit', 'Debit wallet funds', 'wallets'),
('wallets.freeze', 'Freeze/unfreeze wallets', 'wallets'),
('funding.view', 'View funding requests', 'funding'),
('funding.approve', 'Approve funding requests', 'funding'),
('funding.reject', 'Reject funding requests', 'funding'),
('reports.view', 'View reports', 'reports'),
('reports.export', 'Export reports', 'reports'),
('reports.financial', 'View financial reports', 'reports'),
('settings.view', 'View system settings', 'settings'),
('settings.edit', 'Edit system settings', 'settings'),
('support.view', 'View support tickets', 'support'),
('support.respond', 'Respond to support tickets', 'support'),
('support.close', 'Close support tickets', 'support'),
('audit.view', 'View audit logs', 'audit')
ON CONFLICT (name) DO NOTHING;

-- Assign all permissions to super_admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;

-- Assign admin permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'admin' AND p.name NOT IN ('audit.view', 'settings.edit')
ON CONFLICT DO NOTHING;

-- Assign manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'manager' AND p.module IN ('investments', 'transactions', 'funding', 'reports')
ON CONFLICT DO NOTHING;

-- Assign client permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'client' AND p.name IN ('investments.view', 'transactions.view', 'wallets.view', 'reports.view')
ON CONFLICT DO NOTHING;

-- Insert investment plans
INSERT INTO investment_plans (name, slug, description, min_amount, max_amount, roi_percentage, duration_days, payout_frequency, features, is_active, sort_order) VALUES
('Starter Growth', 'starter-growth', 'Perfect for new investors looking to begin their wealth journey with conservative returns.', 1000.00, 25000.00, 8.5, 90, 'monthly', '["Quarterly dividends", "Capital preservation focus", "Monthly statements", "Email support"]', true, 1),
('Balanced Portfolio', 'balanced-portfolio', 'A diversified approach combining growth and stability for medium-term investors.', 25000.00, 100000.00, 12.0, 180, 'monthly', '["Monthly dividends", "Diversified holdings", "Weekly reports", "Priority support", "Portfolio rebalancing"]', true, 2),
('Growth Accelerator', 'growth-accelerator', 'Aggressive growth strategy for experienced investors seeking higher returns.', 100000.00, 500000.00, 18.5, 365, 'monthly', '["Bi-weekly dividends", "Growth-focused allocation", "Real-time dashboard", "Dedicated advisor", "Tax optimization"]', true, 3),
('Elite Wealth', 'elite-wealth', 'Premium wealth management for high-net-worth individuals with personalized strategies.', 500000.00, 5000000.00, 24.0, 365, 'weekly', '["Weekly dividends", "Custom portfolio", "24/7 dedicated support", "Family office services", "Estate planning", "Private events"]', true, 4),
('Institutional Fund', 'institutional-fund', 'Tailored solutions for institutional investors and family offices.', 5000000.00, 100000000.00, 28.0, 730, 'daily', '["Daily liquidity options", "Custom mandate", "Board-level reporting", "Co-investment opportunities", "Global diversification"]', true, 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert legal documents
INSERT INTO legal_documents (title, slug, content, type, version, is_active, requires_acceptance, published_at) VALUES
('Terms of Service', 'terms-of-service', 'BICFLOW CAPITAL Terms of Service. By accessing and using BICFLOW CAPITAL services, you agree to be bound by these Terms of Service. All investments carry risk. Past performance does not guarantee future results.', 'terms', '1.0', true, true, NOW()),
('Privacy Policy', 'privacy-policy', 'BICFLOW CAPITAL Privacy Policy. We collect information necessary to provide our investment services. Your information is used solely for account management and regulatory compliance.', 'privacy', '1.0', true, true, NOW()),
('Investment Agreement', 'investment-agreement', 'Investment Agreement between BICFLOW CAPITAL and the Investor. The terms of each investment are specified in the investment confirmation.', 'agreement', '1.0', true, true, NOW()),
('Risk Disclosure', 'risk-disclosure', 'Risk Disclosure Statement. Investment values may fluctuate due to market conditions. Past performance is not indicative of future results.', 'disclaimer', '1.0', true, true, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Insert notification templates
INSERT INTO notification_templates (name, subject, body, type, variables, is_active) VALUES
('welcome', 'Welcome to BICFLOW CAPITAL', 'Dear {{name}}, Welcome to BICFLOW CAPITAL! Your account has been successfully created.', 'email', '["name", "email"]', true),
('investment_confirmed', 'Investment Confirmation', 'Dear {{name}}, Your investment of {{amount}} has been confirmed.', 'email', '["name", "amount", "plan_name"]', true),
('deposit_received', 'Deposit Confirmed', 'Dear {{name}}, We have received your deposit of {{amount}}.', 'email', '["name", "amount", "transaction_id"]', true),
('withdrawal_processed', 'Withdrawal Processed', 'Dear {{name}}, Your withdrawal of {{amount}} has been processed.', 'email', '["name", "amount", "transaction_id"]', true),
('kyc_approved', 'Identity Verification Approved', 'Dear {{name}}, Your identity verification has been approved.', 'email', '["name"]', true),
('kyc_rejected', 'Identity Verification Required', 'Dear {{name}}, Please resubmit your identity documents.', 'email', '["name", "reason"]', true)
ON CONFLICT (name) DO NOTHING;

-- Insert system settings
INSERT INTO settings (key, value, type, category, description, is_public) VALUES
('site_name', 'BICFLOW CAPITAL', 'string', 'general', 'Platform name', true),
('site_description', 'Investment Excellence', 'string', 'general', 'Platform description', true),
('support_email', 'support@bicflowcapital.com', 'string', 'contact', 'Support email', true),
('support_phone', '+1 (800) 555-0199', 'string', 'contact', 'Support phone', true),
('whatsapp_number', '+1 (800) 555-0199', 'string', 'contact', 'WhatsApp number', true),
('min_deposit', '1000', 'number', 'transactions', 'Minimum deposit', false),
('max_deposit', '10000000', 'number', 'transactions', 'Maximum deposit', false),
('min_withdrawal', '100', 'number', 'transactions', 'Minimum withdrawal', false),
('default_currency', 'USD', 'string', 'general', 'Default currency', true),
('default_language', 'en', 'string', 'general', 'Default language', true),
('supported_languages', '["en","es","fr","de","zh","ar"]', 'json', 'general', 'Supported languages', true)
ON CONFLICT (key) DO NOTHING;

-- Insert partner companies
INSERT INTO partners (name, logo_url, website_url, description, is_active, sort_order) VALUES
('Goldman Sachs', '/partners/goldman-sachs.svg', 'https://www.goldmansachs.com', 'Global investment banking', true, 1),
('JPMorgan Chase', '/partners/jpmorgan.svg', 'https://www.jpmorganchase.com', 'Prime brokerage', true, 2),
('BlackRock', '/partners/blackrock.svg', 'https://www.blackrock.com', 'Asset management', true, 3),
('Morgan Stanley', '/partners/morgan-stanley.svg', 'https://www.morganstanley.com', 'Wealth management', true, 4),
('Fidelity', '/partners/fidelity.svg', 'https://www.fidelity.com', 'Custody services', true, 5),
('Bloomberg', '/partners/bloomberg.svg', 'https://www.bloomberg.com', 'Market data', true, 6),
('Deloitte', '/partners/deloitte.svg', 'https://www.deloitte.com', 'Audit partner', true, 7),
('PwC', '/partners/pwc.svg', 'https://www.pwc.com', 'Advisory services', true, 8)
ON CONFLICT DO NOTHING;

-- Insert funding methods
INSERT INTO funding_methods (name, type, details, instructions, is_active, min_amount, max_amount, fee_percentage, processing_time, sort_order) VALUES
('Bank Wire Transfer', 'wire', '{"bank_name": "JPMorgan Chase", "account_name": "BICFLOW CAPITAL LLC"}', 'Wire transfer to our account with your ID in reference.', true, 1000, 10000000, 0, '1-3 business days', 1),
('ACH Transfer', 'bank_transfer', '{"bank_name": "JPMorgan Chase"}', 'Link your bank for ACH transfers.', true, 100, 250000, 0, '3-5 business days', 2),
('Bitcoin (BTC)', 'crypto', '{"network": "Bitcoin"}', 'Send BTC to provided address.', true, 500, 5000000, 0, '30-60 minutes', 3),
('Ethereum (ETH)', 'crypto', '{"network": "Ethereum"}', 'Send ETH to provided address.', true, 500, 5000000, 0, '15-30 minutes', 4),
('USDT (TRC20)', 'crypto', '{"network": "TRON"}', 'Send USDT via TRC20 only.', true, 100, 5000000, 0, '5-10 minutes', 5)
ON CONFLICT DO NOTHING;

-- Create default admin user (password: Admin@123456)
INSERT INTO users (email, password_hash, first_name, last_name, role_id, status, email_verified, kyc_status) 
SELECT 'admin@bicflowcapital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System', 'Administrator', r.id, 'active', true, 'approved'
FROM roles r WHERE r.name = 'super_admin'
ON CONFLICT (email) DO NOTHING;

-- Create admin wallet
INSERT INTO wallets (user_id, currency, balance, locked_balance, total_deposited, total_withdrawn)
SELECT u.id, 'USD', 0, 0, 0, 0 FROM users u WHERE u.email = 'admin@bicflowcapital.com'
ON CONFLICT (user_id, currency) DO NOTHING;
