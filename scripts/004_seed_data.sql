-- Seed initial data for AlbashSolution

-- Insert departments
INSERT INTO departments (name, type, description, icon) VALUES
  ('Verification Department', 'verification', 'Central verification hub for all applications', 'shield-check'),
  ('Institution Department', 'institution', 'Handles educational and institutional applications', 'graduation-cap'),
  ('Business Department', 'business', 'Processes business and company applications', 'briefcase'),
  ('Blockchain Department', 'blockchain', 'Manages tokenization and NFT verifications', 'link'),
  ('Reputation Department', 'reputation', 'Oversees reputation scoring and badges', 'award'),
  ('Tech Department', 'tech', 'Technical support and platform tools', 'cpu');

-- Insert categories
INSERT INTO categories (name, slug, description, icon) VALUES
  ('Ideas & Innovations', 'ideas', 'Creative ideas and innovative concepts', 'lightbulb'),
  ('Talents & Skills', 'talents', 'Individual talents and professional skills', 'star'),
  ('Digital Products', 'digital', 'Software, apps, and digital assets', 'monitor'),
  ('Physical Products', 'physical', 'Tangible goods and merchandise', 'package'),
  ('Services', 'services', 'Professional and personal services', 'briefcase'),
  ('Educational', 'educational', 'Courses, tutorials, and learning materials', 'book-open'),
  ('Art & Design', 'art', 'Artwork, designs, and creative assets', 'palette'),
  ('Technology', 'technology', 'Tech products and solutions', 'cpu'),
  ('Business Solutions', 'business', 'B2B products and enterprise tools', 'building'),
  ('NFTs & Tokenized', 'nft', 'Blockchain-based digital assets', 'hexagon');

-- Insert tools (100 tools across categories)
INSERT INTO tools (name, description, category, icon, is_premium) VALUES
  -- Business Tools (1-15)
  ('Business Plan Generator', 'AI-powered business plan creation tool', 'Business', 'file-text', false),
  ('Invoice Creator', 'Professional invoice generation system', 'Business', 'receipt', false),
  ('CRM Lite', 'Simple customer relationship management', 'Business', 'users', false),
  ('Financial Calculator', 'Business financial planning calculator', 'Business', 'calculator', false),
  ('Contract Templates', 'Legal contract templates library', 'Business', 'file-contract', true),
  ('Pitch Deck Builder', 'Create stunning pitch presentations', 'Business', 'presentation', true),
  ('Market Research Tool', 'Industry analysis and research', 'Business', 'search', true),
  ('Expense Tracker', 'Track business expenses easily', 'Business', 'wallet', false),
  ('Project Timeline', 'Project planning and timeline tool', 'Business', 'calendar', false),
  ('Meeting Scheduler', 'Smart meeting scheduling system', 'Business', 'clock', false),
  ('Email Templates', 'Professional email template library', 'Business', 'mail', false),
  ('Goal Tracker', 'Business goal tracking dashboard', 'Business', 'target', false),
  ('Competitor Analysis', 'Analyze your competition', 'Business', 'bar-chart', true),
  ('SWOT Generator', 'SWOT analysis creation tool', 'Business', 'grid', false),
  ('Business Canvas', 'Business model canvas builder', 'Business', 'layout', false),
  
  -- Design Tools (16-30)
  ('Logo Maker', 'Create professional logos instantly', 'Design', 'pen-tool', false),
  ('Color Palette Generator', 'Generate beautiful color schemes', 'Design', 'palette', false),
  ('Banner Creator', 'Social media banner design tool', 'Design', 'image', false),
  ('Mockup Generator', 'Product mockup creation tool', 'Design', 'smartphone', true),
  ('Icon Library', 'Comprehensive icon collection', 'Design', 'grid', false),
  ('Font Pairing Tool', 'Find perfect font combinations', 'Design', 'type', false),
  ('Image Resizer', 'Batch image resizing utility', 'Design', 'maximize', false),
  ('Background Remover', 'AI background removal tool', 'Design', 'scissors', true),
  ('Poster Designer', 'Event poster creation tool', 'Design', 'layout', false),
  ('Brand Kit Builder', 'Complete brand identity creator', 'Design', 'briefcase', true),
  ('Infographic Maker', 'Data visualization tool', 'Design', 'pie-chart', false),
  ('Photo Editor', 'Basic photo editing capabilities', 'Design', 'edit', false),
  ('Video Thumbnail', 'YouTube thumbnail creator', 'Design', 'youtube', false),
  ('QR Code Generator', 'Custom QR code creation', 'Design', 'qr-code', false),
  ('Watermark Tool', 'Add watermarks to images', 'Design', 'droplet', false),
  
  -- Builder/Idea Tools (31-45)
  ('Idea Validator', 'Validate your business ideas', 'Builder', 'check-circle', false),
  ('MVP Planner', 'Plan your minimum viable product', 'Builder', 'rocket', false),
  ('User Story Generator', 'Create user stories easily', 'Builder', 'book', false),
  ('Wireframe Tool', 'Quick wireframing solution', 'Builder', 'layout', false),
  ('Feature Prioritizer', 'Prioritize product features', 'Builder', 'list', false),
  ('Roadmap Builder', 'Product roadmap creation', 'Builder', 'map', true),
  ('Feedback Collector', 'Gather user feedback', 'Builder', 'message-circle', false),
  ('A/B Test Planner', 'Plan A/B testing experiments', 'Builder', 'git-branch', true),
  ('Launch Checklist', 'Product launch preparation', 'Builder', 'check-square', false),
  ('Growth Calculator', 'Calculate growth metrics', 'Builder', 'trending-up', false),
  ('Pricing Strategy', 'Optimize your pricing', 'Builder', 'dollar-sign', true),
  ('Persona Builder', 'Create user personas', 'Builder', 'user', false),
  ('Journey Mapper', 'Map customer journeys', 'Builder', 'navigation', true),
  ('Onboarding Flow', 'Design onboarding experiences', 'Builder', 'log-in', false),
  ('Retention Analyzer', 'Analyze user retention', 'Builder', 'activity', true),
  
  -- Academic/Institution Tools (46-60)
  ('Syllabus Builder', 'Create course syllabi', 'Academic', 'book-open', false),
  ('Grade Calculator', 'Student grade management', 'Academic', 'calculator', false),
  ('Citation Generator', 'Academic citation tool', 'Academic', 'link', false),
  ('Research Organizer', 'Organize research papers', 'Academic', 'folder', false),
  ('Presentation Maker', 'Academic presentation tool', 'Academic', 'monitor', false),
  ('Study Planner', 'Student study scheduling', 'Academic', 'calendar', false),
  ('Note Taker', 'Smart note-taking app', 'Academic', 'edit-3', false),
  ('Flashcard Creator', 'Create study flashcards', 'Academic', 'layers', false),
  ('Bibliography Tool', 'Bibliography management', 'Academic', 'file-text', false),
  ('Plagiarism Checker', 'Check for plagiarism', 'Academic', 'shield', true),
  ('Essay Outliner', 'Structure essays effectively', 'Academic', 'align-left', false),
  ('Lab Report Template', 'Scientific report templates', 'Academic', 'clipboard', false),
  ('Thesis Organizer', 'Thesis writing management', 'Academic', 'book', true),
  ('Peer Review System', 'Academic peer review', 'Academic', 'users', true),
  ('Certificate Maker', 'Create academic certificates', 'Academic', 'award', false),
  
  -- Verification Tools (61-70)
  ('Document Verifier', 'Verify document authenticity', 'Verification', 'file-check', true),
  ('Identity Checker', 'Identity verification system', 'Verification', 'user-check', true),
  ('Credential Validator', 'Validate credentials', 'Verification', 'shield-check', true),
  ('Signature Verifier', 'Digital signature verification', 'Verification', 'edit-2', true),
  ('Certificate Validator', 'Validate certificates', 'Verification', 'award', true),
  ('Background Check', 'Background verification tool', 'Verification', 'search', true),
  ('License Verifier', 'Business license verification', 'Verification', 'file', true),
  ('KYC Tool', 'Know your customer tool', 'Verification', 'user', true),
  ('Compliance Checker', 'Regulatory compliance check', 'Verification', 'check-square', true),
  ('Audit Trail', 'Track verification history', 'Verification', 'list', true),
  
  -- Tokenization Tools (71-80)
  ('NFT Minter', 'Create and mint NFTs', 'Tokenization', 'hexagon', true),
  ('Token Creator', 'Create custom tokens', 'Tokenization', 'circle', true),
  ('Smart Contract Builder', 'No-code smart contracts', 'Tokenization', 'code', true),
  ('Wallet Connector', 'Connect crypto wallets', 'Tokenization', 'link', false),
  ('Token Transfer', 'Transfer tokens easily', 'Tokenization', 'send', false),
  ('NFT Gallery', 'Showcase your NFTs', 'Tokenization', 'grid', false),
  ('Royalty Calculator', 'Calculate NFT royalties', 'Tokenization', 'percent', false),
  ('Metadata Editor', 'Edit NFT metadata', 'Tokenization', 'edit', true),
  ('Collection Manager', 'Manage NFT collections', 'Tokenization', 'folder', true),
  ('Market Analytics', 'NFT market analysis', 'Tokenization', 'trending-up', true),
  
  -- Marketplace Tools (81-90)
  ('Product Lister', 'List products quickly', 'Marketplace', 'plus-square', false),
  ('Inventory Manager', 'Track inventory levels', 'Marketplace', 'package', false),
  ('Order Tracker', 'Track order status', 'Marketplace', 'truck', false),
  ('Review Manager', 'Manage customer reviews', 'Marketplace', 'message-square', false),
  ('Shipping Calculator', 'Calculate shipping costs', 'Marketplace', 'box', false),
  ('Return Handler', 'Process returns easily', 'Marketplace', 'refresh-cw', false),
  ('Discount Generator', 'Create discount codes', 'Marketplace', 'tag', false),
  ('Sales Dashboard', 'View sales analytics', 'Marketplace', 'bar-chart-2', true),
  ('Customer Support', 'Support ticket system', 'Marketplace', 'headphones', false),
  ('Wishlist Manager', 'Customer wishlist tool', 'Marketplace', 'heart', false),
  
  -- Data Tools (91-100)
  ('CSV Converter', 'Convert data formats', 'Data', 'file-text', false),
  ('Data Visualizer', 'Create data charts', 'Data', 'pie-chart', false),
  ('Form Builder', 'Build custom forms', 'Data', 'edit-3', false),
  ('Survey Creator', 'Create surveys easily', 'Data', 'clipboard', false),
  ('Report Generator', 'Generate data reports', 'Data', 'file', true),
  ('Analytics Dashboard', 'View key metrics', 'Data', 'activity', true),
  ('Data Exporter', 'Export data in formats', 'Data', 'download', false),
  ('API Tester', 'Test API endpoints', 'Data', 'terminal', true),
  ('Database Viewer', 'View database contents', 'Data', 'database', true),
  ('Log Analyzer', 'Analyze system logs', 'Data', 'file-text', true);

-- Insert sample programs
INSERT INTO programs (title, description, program_type, is_active) VALUES
  ('Builder Bootcamp', 'Intensive 8-week program for aspiring builders to validate and launch their ideas', 'bootcamp', true),
  ('Institution Partnership', 'Connect educational institutions with industry opportunities', 'partnership', true),
  ('Student Accelerator', 'Fast-track program for student entrepreneurs', 'student', true),
  ('Grant Program', 'Funding opportunities for verified builders and businesses', 'grant', true),
  ('Mentorship Network', 'Connect with experienced mentors in your field', 'mentorship', true);
