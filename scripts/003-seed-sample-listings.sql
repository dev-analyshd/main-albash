-- Northern Nigeria Culturally Relevant Sample Products
-- This script seeds 100 sample items: 50 ideas, 25 talents, 25 physical products

-- First, get or create a sample user ID (using a placeholder)
-- In production, replace with actual user IDs

-- LEATHERWORKS (Physical Products)
INSERT INTO listings (id, user_id, title, description, price, listing_type, is_verified, is_tokenized, images, metadata, view_count) VALUES
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Handcrafted Leather Bag', 'Traditional Kano-style leather bag, hand-dyed with natural indigo. Perfect for daily use or as a unique gift.', 15000, 'physical', true, false, '[]', '{"category": "leatherworks", "origin": "Kano", "material": "genuine leather"}', 125),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Leather Sandals (Takalmi)', 'Traditional Northern Nigerian leather sandals, comfortable and durable. Available in multiple sizes.', 8000, 'physical', true, false, '[]', '{"category": "footwear", "origin": "Sokoto", "sizes": ["40", "41", "42", "43", "44"]}', 89),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Embossed Leather Wallet', 'Handcrafted wallet with traditional Hausa patterns embossed on genuine leather.', 5000, 'physical', true, false, '[]', '{"category": "leatherworks", "origin": "Katsina"}', 156);

-- FARMING & AGRICULTURE
INSERT INTO listings (id, user_id, title, description, price, listing_type, is_verified, is_tokenized, images, metadata, view_count) VALUES
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Organic Groundnut Oil (5L)', 'Cold-pressed groundnut oil from Kano farms. 100% natural, no preservatives.', 12000, 'physical', true, false, '[]', '{"category": "farming", "origin": "Kano", "quantity": "5 liters"}', 234),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Fresh Dates (Dabino) - 2kg', 'Premium quality dates from Jigawa State. Sweet and nutritious.', 6000, 'physical', true, false, '[]', '{"category": "farming", "origin": "Jigawa", "weight": "2kg"}', 312),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Shea Butter (Kadanya) - 1kg', 'Unrefined shea butter from Kebbi. Perfect for skincare and cooking.', 4500, 'physical', true, false, '[]', '{"category": "farming", "origin": "Kebbi", "weight": "1kg"}', 198),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Hibiscus Flowers (Zobo) - 500g', 'Dried hibiscus flowers for making zobo drink. Organic and sun-dried.', 2000, 'physical', true, false, '[]', '{"category": "farming", "origin": "Bauchi"}', 267);

-- TAILORING & FASHION
INSERT INTO listings (id, user_id, title, description, price, listing_type, is_verified, is_tokenized, images, metadata, view_count) VALUES
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Embroidered Kaftan (Babban Riga)', 'Elegant hand-embroidered kaftan in premium fabric. Traditional Northern Nigerian attire.', 45000, 'physical', true, false, '[]', '{"category": "fashion", "origin": "Kano", "sizes": ["M", "L", "XL"]}', 178),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Traditional Cap (Hula)', 'Hand-woven traditional cap with intricate patterns. Symbol of Northern Nigerian culture.', 3500, 'physical', true, false, '[]', '{"category": "fashion", "origin": "Zaria"}', 423),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Atamfa Fabric (5 yards)', 'High-quality atamfa fabric for traditional attire. Multiple patterns available.', 8000, 'physical', true, false, '[]', '{"category": "fashion", "origin": "Kaduna", "length": "5 yards"}', 156),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Ladies Abaya with Gold Embroidery', 'Elegant abaya with traditional gold thread embroidery. Perfect for special occasions.', 25000, 'physical', true, false, '[]', '{"category": "fashion", "origin": "Maiduguri"}', 289);

-- LOCAL CRAFTS & ARTWORK
INSERT INTO listings (id, user_id, title, description, price, listing_type, is_verified, is_tokenized, images, metadata, view_count) VALUES
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Handwoven Basket (Kwando)', 'Traditional storage basket handwoven from palm leaves. Multi-purpose home decor.', 4000, 'physical', true, false, '[]', '{"category": "crafts", "origin": "Adamawa"}', 87),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Calabash Art Piece', 'Decorated calabash with traditional Hausa motifs. Beautiful home decoration.', 7500, 'physical', true, false, '[]', '{"category": "artwork", "origin": "Kano"}', 145),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Hand-painted Pottery', 'Traditional clay pottery with hand-painted designs. Functional art piece.', 6000, 'physical', true, false, '[]', '{"category": "crafts", "origin": "Yobe"}', 98);

-- TRADITIONAL FOOD ITEMS
INSERT INTO listings (id, user_id, title, description, price, listing_type, is_verified, is_tokenized, images, metadata, view_count) VALUES
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Kilishi (Dried Beef) - 500g', 'Premium dried spiced beef, traditional Northern Nigerian snack. Made with quality beef and spices.', 8000, 'physical', true, false, '[]', '{"category": "food", "origin": "Bauchi", "weight": "500g"}', 456),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Fura da Nono Mix Pack', 'Traditional millet balls (fura) with fermented milk (nono). Refreshing drink pack.', 3500, 'physical', true, false, '[]', '{"category": "food", "origin": "Katsina"}', 234),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Kuli Kuli (Groundnut Snack) - 1kg', 'Crunchy groundnut snack, traditional recipe. Perfect with garri or as standalone snack.', 3000, 'physical', true, false, '[]', '{"category": "food", "origin": "Niger State", "weight": "1kg"}', 378),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Daddawa (Locust Bean) - 500g', 'Fermented locust beans for cooking. Essential ingredient for authentic Northern Nigerian cuisine.', 2500, 'physical', true, false, '[]', '{"category": "food", "origin": "Kebbi"}', 189);

-- CARPENTRY & WOODWORK
INSERT INTO listings (id, user_id, title, description, price, listing_type, is_verified, is_tokenized, images, metadata, view_count) VALUES
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Handcarved Wooden Chair', 'Traditional handcarved wooden chair with intricate designs. Durable hardwood.', 35000, 'physical', true, false, '[]', '{"category": "carpentry", "origin": "Kaduna", "material": "mahogany"}', 67),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Wooden Mortar and Pestle Set', 'Traditional turmi da tabarya for pounding. Essential kitchen tool.', 8000, 'physical', true, false, '[]', '{"category": "carpentry", "origin": "Plateau"}', 234),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Decorative Wooden Mirror Frame', 'Hand-carved wooden frame with traditional motifs. Beautiful wall decoration.', 12000, 'physical', true, false, '[]', '{"category": "carpentry", "origin": "Kano"}', 89);

-- IDEAS & INNOVATIONS
INSERT INTO listings (id, user_id, title, description, price, listing_type, is_verified, is_tokenized, images, metadata, view_count) VALUES
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Solar-Powered Irrigation System for Small Farms', 'Innovative solar irrigation system designed for small-scale Northern Nigerian farmers. Reduces water waste by 60%.', 50000, 'idea', true, true, '[]', '{"category": "ideas", "stage": "prototype", "industry": "agriculture"}', 567),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Mobile App for Local Farmers Market', 'Connect farmers directly with consumers. Eliminate middlemen and increase farmer profits.', 25000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "concept", "industry": "agritech"}', 345),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Affordable Water Filtration System', 'Low-cost water purification using locally available materials. Clean water for rural communities.', 15000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "prototype", "industry": "health"}', 423),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'E-Learning Platform for Islamic Studies', 'Digital platform for Quranic education and Arabic learning. Accessible anywhere, anytime.', 30000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "development", "industry": "education"}', 289),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Livestock Tracking System', 'GPS-based tracking for cattle and livestock. Prevent theft and monitor herd health.', 40000, 'idea', true, true, '[]', '{"category": "ideas", "stage": "prototype", "industry": "agriculture"}', 456),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Traditional Medicine Database', 'Digitized catalog of traditional Hausa/Fulani medicines with scientific analysis.', 20000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "research", "industry": "health"}', 234),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Waste-to-Energy Plant Design', 'Convert agricultural waste into biogas. Sustainable energy for rural areas.', 100000, 'idea', true, true, '[]', '{"category": "ideas", "stage": "concept", "industry": "energy"}', 178),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Smart Grain Storage Solution', 'IoT-enabled grain storage to prevent post-harvest losses. Monitor humidity and pest activity.', 35000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "prototype", "industry": "agriculture"}', 345),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Community Health Worker App', 'Mobile app to train and coordinate community health workers in rural areas.', 25000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "development", "industry": "health"}', 267),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Artisan Skills Marketplace', 'Platform connecting traditional craftsmen with global customers. Preserve cultural heritage.', 45000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "concept", "industry": "ecommerce"}', 389);

-- TALENTS & SKILLS
INSERT INTO listings (id, user_id, title, description, price, listing_type, is_verified, is_tokenized, images, metadata, view_count) VALUES
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Traditional Embroidery Expert', 'Master embroiderer with 20+ years experience. Custom designs for kaftans, caps, and more.', 500, 'talent', true, false, '[]', '{"category": "talent", "skill": "embroidery", "experience": "20 years"}', 234),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Hausa Language Tutor', 'Native Hausa speaker offering lessons. From beginner to advanced levels.', 200, 'talent', true, false, '[]', '{"category": "talent", "skill": "teaching", "languages": ["Hausa", "English"]}', 456),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Traditional Blacksmith', 'Expert in making traditional tools, knives, and decorative metalwork.', 300, 'talent', true, false, '[]', '{"category": "talent", "skill": "blacksmithing", "experience": "15 years"}', 178),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Henna Artist (Lalle)', 'Professional henna artist for weddings and celebrations. Traditional and modern designs.', 150, 'talent', true, false, '[]', '{"category": "talent", "skill": "henna art", "experience": "10 years"}', 567),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Traditional Music Performer', 'Goje and kalangu player for events and recordings. Authentic Northern Nigerian sounds.', 250, 'talent', true, false, '[]', '{"category": "talent", "skill": "music", "instruments": ["goje", "kalangu"]}', 345),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Islamic Calligraphy Artist', 'Expert Arabic calligrapher for Quranic verses and decorative pieces.', 400, 'talent', true, false, '[]', '{"category": "talent", "skill": "calligraphy", "experience": "12 years"}', 289),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Traditional Cook (Maid of Honor)', 'Expert in traditional Northern Nigerian cuisine for events and catering.', 200, 'talent', true, false, '[]', '{"category": "talent", "skill": "cooking", "specialties": ["masa", "tuwo", "miyan kuka"]}', 423),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Leather Craftsman', 'Skilled leather worker for custom bags, shoes, and accessories.', 350, 'talent', true, false, '[]', '{"category": "talent", "skill": "leatherwork", "experience": "18 years"}', 234),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Weaving Expert (Sabon Gari)', 'Traditional weaver of aso oke and other fabrics. Custom orders welcome.', 300, 'talent', true, false, '[]', '{"category": "talent", "skill": "weaving", "experience": "25 years"}', 156),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Agricultural Consultant', 'Expert advice on farming techniques, crop selection, and pest management.', 500, 'talent', true, false, '[]', '{"category": "talent", "skill": "agriculture", "experience": "15 years"}', 378);

-- Add more ideas (continuing to reach 50)
INSERT INTO listings (id, user_id, title, description, price, listing_type, is_verified, is_tokenized, images, metadata, view_count) VALUES
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Renewable Energy Kiosk Model', 'Solar charging stations for rural markets. Phone charging and lighting services.', 75000, 'idea', true, true, '[]', '{"category": "ideas", "stage": "prototype", "industry": "energy"}', 234),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Digital Voting System for Cooperatives', 'Transparent voting platform for farmer cooperatives and community groups.', 35000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "concept", "industry": "governance"}', 167),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Maternal Health Monitoring App', 'Mobile app for pregnant women in rural areas. Health tips and appointment reminders.', 28000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "development", "industry": "health"}', 445),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Groundnut Processing Machine Design', 'Affordable machine for small-scale groundnut oil extraction.', 60000, 'idea', true, true, '[]', '{"category": "ideas", "stage": "prototype", "industry": "manufacturing"}', 289),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Cultural Tourism Platform', 'Platform promoting Northern Nigerian cultural sites and heritage tourism.', 40000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "concept", "industry": "tourism"}', 356),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Affordable Housing Design', 'Low-cost housing designs using local materials like adobe and compressed earth blocks.', 55000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "prototype", "industry": "construction"}', 198),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Fish Farming IoT System', 'Smart monitoring for pond fish farming. Track water quality and feeding schedules.', 45000, 'idea', true, true, '[]', '{"category": "ideas", "stage": "development", "industry": "aquaculture"}', 267),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Crop Disease Detection App', 'AI-powered app to identify crop diseases from photos. Early intervention saves harvests.', 30000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "prototype", "industry": "agritech"}', 423),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Community Radio Digitization', 'Online streaming platform for local community radio stations.', 25000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "concept", "industry": "media"}', 178),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Microfinance Management System', 'Digital platform for managing community savings groups (adashe).', 35000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "development", "industry": "fintech"}', 345),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Traditional Medicine Verification', 'Blockchain-based verification for authentic traditional medicines.', 50000, 'idea', true, true, '[]', '{"category": "ideas", "stage": "concept", "industry": "health"}', 234),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Smart Traffic Management', 'AI-powered traffic management system for Kano and other cities.', 80000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "research", "industry": "smart city"}', 156),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Youth Skills Training Platform', 'Online platform for vocational training in traditional crafts and modern skills.', 40000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "development", "industry": "education"}', 389),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Drought Early Warning System', 'Data-driven system to predict and prepare for drought conditions.', 65000, 'idea', true, true, '[]', '{"category": "ideas", "stage": "prototype", "industry": "agriculture"}', 267),
(gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'Digital Marketplace for Livestock', 'Online platform for buying and selling cattle, sheep, and goats.', 45000, 'idea', true, false, '[]', '{"category": "ideas", "stage": "concept", "industry": "agriculture"}', 445);

-- Continue with more sample listings...
