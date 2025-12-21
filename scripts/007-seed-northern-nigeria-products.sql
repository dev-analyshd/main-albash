-- Seed Northern Nigeria Culturally Relevant Sample Products
-- This script adds 100 sample items: 50 ideas, 25 talents, 25 physical products

-- First, let's ensure we have the necessary categories
INSERT INTO categories (id, name, slug, description, icon) VALUES
  (gen_random_uuid(), 'Leatherworks', 'leatherworks', 'Traditional and modern leather craftsmanship', 'briefcase'),
  (gen_random_uuid(), 'Farming & Agriculture', 'farming-agriculture', 'Agricultural products and farming solutions', 'wheat'),
  (gen_random_uuid(), 'Local Crafts', 'local-crafts', 'Handmade traditional crafts and artifacts', 'palette'),
  (gen_random_uuid(), 'Tailoring & Fashion', 'tailoring-fashion', 'Traditional and modern clothing designs', 'scissors'),
  (gen_random_uuid(), 'Carpentry', 'carpentry', 'Woodwork and furniture crafting', 'hammer'),
  (gen_random_uuid(), 'Shoe Making', 'shoe-making', 'Traditional and modern footwear', 'footprints'),
  (gen_random_uuid(), 'Traditional Food', 'traditional-food', 'Local cuisine and food products', 'utensils'),
  (gen_random_uuid(), 'Artwork', 'artwork', 'Traditional and contemporary art pieces', 'brush'),
  (gen_random_uuid(), 'Handmade Products', 'handmade-products', 'Artisanal handcrafted items', 'hand'),
  (gen_random_uuid(), 'Digital Services', 'digital-services', 'Technology and digital solutions', 'laptop'),
  (gen_random_uuid(), 'Education', 'education', 'Educational services and materials', 'graduation-cap'),
  (gen_random_uuid(), 'Textiles', 'textiles', 'Traditional fabrics and textile products', 'shirt')
ON CONFLICT (slug) DO NOTHING;

-- Create a sample verified user for the listings (if not exists)
DO $$
DECLARE
  sample_user_id UUID;
  cat_leatherworks UUID;
  cat_farming UUID;
  cat_crafts UUID;
  cat_tailoring UUID;
  cat_carpentry UUID;
  cat_shoes UUID;
  cat_food UUID;
  cat_artwork UUID;
  cat_handmade UUID;
  cat_digital UUID;
  cat_education UUID;
  cat_textiles UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO cat_leatherworks FROM categories WHERE slug = 'leatherworks' LIMIT 1;
  SELECT id INTO cat_farming FROM categories WHERE slug = 'farming-agriculture' LIMIT 1;
  SELECT id INTO cat_crafts FROM categories WHERE slug = 'local-crafts' LIMIT 1;
  SELECT id INTO cat_tailoring FROM categories WHERE slug = 'tailoring-fashion' LIMIT 1;
  SELECT id INTO cat_carpentry FROM categories WHERE slug = 'carpentry' LIMIT 1;
  SELECT id INTO cat_shoes FROM categories WHERE slug = 'shoe-making' LIMIT 1;
  SELECT id INTO cat_food FROM categories WHERE slug = 'traditional-food' LIMIT 1;
  SELECT id INTO cat_artwork FROM categories WHERE slug = 'artwork' LIMIT 1;
  SELECT id INTO cat_handmade FROM categories WHERE slug = 'handmade-products' LIMIT 1;
  SELECT id INTO cat_digital FROM categories WHERE slug = 'digital-services' LIMIT 1;
  SELECT id INTO cat_education FROM categories WHERE slug = 'education' LIMIT 1;
  SELECT id INTO cat_textiles FROM categories WHERE slug = 'textiles' LIMIT 1;

  -- Get or create a sample user
  SELECT id INTO sample_user_id FROM profiles WHERE email = 'marketplace@albashsolutionss.com' LIMIT 1;
  
  IF sample_user_id IS NULL THEN
    sample_user_id := gen_random_uuid();
  END IF;

  -- ==========================================
  -- IDEAS (50 items)
  -- ==========================================
  
  -- Leatherworks Ideas
  INSERT INTO listings (id, user_id, title, description, price, listing_type, category_id, images, is_verified, metadata, view_count) VALUES
  (gen_random_uuid(), sample_user_id, 'Smart Leather Inventory System', 'Digital tracking system for leather workshops to manage raw materials, work-in-progress, and finished goods inventory with QR code integration.', 150000, 'idea', cat_leatherworks, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "concept", "target_market": "leather workshops"}', 245),
  (gen_random_uuid(), sample_user_id, 'Eco-Friendly Leather Tanning Process', 'Revolutionary vegetable-based tanning method that reduces environmental impact while maintaining quality. Patented formula using local plant extracts.', 500000, 'idea', cat_leatherworks, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "prototype", "patent_status": "pending"}', 189),
  (gen_random_uuid(), sample_user_id, 'Leather Craft Training App', 'Mobile application teaching traditional Kano leather crafting techniques through AR-guided tutorials and video lessons.', 250000, 'idea', cat_leatherworks, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "development", "platform": "mobile"}', 312);

  -- Agriculture Ideas
  INSERT INTO listings (id, user_id, title, description, price, listing_type, category_id, images, is_verified, metadata, view_count) VALUES
  (gen_random_uuid(), sample_user_id, 'Solar-Powered Irrigation Controller', 'Automated irrigation system designed for Northern Nigeria farms. Uses soil sensors and weather data to optimize water usage.', 350000, 'idea', cat_farming, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "prototype", "power_source": "solar"}', 456),
  (gen_random_uuid(), sample_user_id, 'Grain Storage Monitoring System', 'IoT-based monitoring for traditional grain silos. Tracks temperature, humidity, and pest activity to prevent post-harvest losses.', 200000, 'idea', cat_farming, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "concept", "sensors": ["temperature", "humidity", "motion"]}', 278),
  (gen_random_uuid(), sample_user_id, 'Farmers Cooperative Platform', 'Digital marketplace connecting smallholder farmers directly to buyers, eliminating middlemen and ensuring fair prices.', 180000, 'idea', cat_farming, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "MVP", "users": 500}', 523),
  (gen_random_uuid(), sample_user_id, 'Drought-Resistant Millet Variety', 'Research project for developing drought-resistant millet strain specifically adapted to Sahel climate conditions.', 750000, 'idea', cat_farming, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "research", "duration_months": 24}', 167),
  (gen_random_uuid(), sample_user_id, 'Livestock Health Tracking App', 'Mobile app for tracking cattle health records, vaccination schedules, and breeding information for Fulani herders.', 120000, 'idea', cat_farming, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "development", "target_users": "herders"}', 234);

  -- Tailoring & Fashion Ideas
  INSERT INTO listings (id, user_id, title, description, price, listing_type, category_id, images, is_verified, metadata, view_count) VALUES
  (gen_random_uuid(), sample_user_id, 'AI-Powered Measurement System', 'Smartphone app that uses AI to take accurate body measurements for remote tailoring orders.', 300000, 'idea', cat_tailoring, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "prototype", "accuracy": "98%"}', 412),
  (gen_random_uuid(), sample_user_id, 'Traditional Pattern Digitization', 'Project to digitize and preserve traditional Northern Nigerian embroidery patterns for modern CAD systems.', 100000, 'idea', cat_tailoring, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "ongoing", "patterns_digitized": 150}', 289),
  (gen_random_uuid(), sample_user_id, 'Sustainable Fashion Brand', 'Eco-friendly fashion line using locally sourced materials and traditional techniques with modern designs.', 450000, 'idea', cat_tailoring, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "launch_ready", "products": 25}', 567),
  (gen_random_uuid(), sample_user_id, 'Virtual Try-On for Agbada', 'AR application allowing customers to virtually try traditional Agbada and Babariga designs before ordering.', 280000, 'idea', cat_tailoring, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "development", "platform": "mobile"}', 345);

  -- Carpentry Ideas
  INSERT INTO listings (id, user_id, title, description, price, listing_type, category_id, images, is_verified, metadata, view_count) VALUES
  (gen_random_uuid(), sample_user_id, 'Modular Furniture System', 'Flat-pack furniture designed for easy assembly without tools, inspired by traditional joinery techniques.', 200000, 'idea', cat_carpentry, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "prototype", "assembly_time": "15 minutes"}', 378),
  (gen_random_uuid(), sample_user_id, 'Reclaimed Wood Marketplace', 'Platform connecting demolition sites with carpenters, promoting sustainable wood sourcing and reducing waste.', 150000, 'idea', cat_carpentry, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "concept", "environmental_impact": "high"}', 234),
  (gen_random_uuid(), sample_user_id, 'Smart Workshop Management', 'Software for carpentry workshops to manage orders, inventory, and customer relationships.', 180000, 'idea', cat_carpentry, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "beta", "active_workshops": 12}', 189);

  -- Digital/Tech Ideas
  INSERT INTO listings (id, user_id, title, description, price, listing_type, category_id, images, is_verified, metadata, view_count) VALUES
  (gen_random_uuid(), sample_user_id, 'Hausa Language Learning App', 'Interactive app teaching Hausa language with gamification, voice recognition, and cultural context.', 350000, 'idea', cat_digital, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "development", "lessons": 50}', 678),
  (gen_random_uuid(), sample_user_id, 'Local Business Directory', 'Comprehensive digital directory of verified local businesses in Northern Nigeria with reviews and ratings.', 120000, 'idea', cat_digital, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "MVP", "businesses_listed": 2000}', 456),
  (gen_random_uuid(), sample_user_id, 'Digital Apprenticeship Platform', 'Connecting traditional craftsmen with young learners for virtual and in-person apprenticeship programs.', 200000, 'idea', cat_digital, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "concept", "target_trades": 15}', 345),
  (gen_random_uuid(), sample_user_id, 'Community Health Alert System', 'SMS-based health alert system for rural communities, providing disease outbreak warnings and health tips.', 180000, 'idea', cat_digital, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "pilot", "communities": 25}', 289),
  (gen_random_uuid(), sample_user_id, 'Agricultural Price Tracker', 'Real-time tracking of agricultural commodity prices across Northern Nigerian markets.', 100000, 'idea', cat_digital, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "live", "markets_tracked": 45}', 567);

  -- Food & Culinary Ideas
  INSERT INTO listings (id, user_id, title, description, price, listing_type, category_id, images, is_verified, metadata, view_count) VALUES
  (gen_random_uuid(), sample_user_id, 'Traditional Recipe Preservation', 'Digital archive of traditional Northern Nigerian recipes with video tutorials and ingredient sourcing.', 80000, 'idea', cat_food, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "ongoing", "recipes": 200}', 423),
  (gen_random_uuid(), sample_user_id, 'Spice Blend Subscription Box', 'Monthly subscription delivering authentic Northern Nigerian spice blends with recipe cards.', 150000, 'idea', cat_food, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "launch_ready", "subscribers": 150}', 312),
  (gen_random_uuid(), sample_user_id, 'Food Delivery for Traditional Cuisine', 'Platform connecting home cooks specializing in traditional dishes with customers seeking authentic meals.', 250000, 'idea', cat_food, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "MVP", "active_cooks": 50}', 489),
  (gen_random_uuid(), sample_user_id, 'Kilishi Quality Certification', 'Blockchain-based certification system ensuring authenticity and quality of Kilishi products.', 200000, 'idea', cat_food, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "concept", "certification_criteria": 12}', 234);

  -- Artwork Ideas
  INSERT INTO listings (id, user_id, title, description, price, listing_type, category_id, images, is_verified, metadata, view_count) VALUES
  (gen_random_uuid(), sample_user_id, 'Calligraphy NFT Collection', 'Series of Arabic calligraphy artworks converted to NFTs, preserving traditional art forms on blockchain.', 500000, 'idea', cat_artwork, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "minting", "pieces": 50}', 567),
  (gen_random_uuid(), sample_user_id, 'Art Supply Cooperative', 'Bulk purchasing cooperative for local artists to access quality supplies at affordable prices.', 100000, 'idea', cat_artwork, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "concept", "members": 30}', 189),
  (gen_random_uuid(), sample_user_id, 'Virtual Art Gallery', 'Online gallery showcasing Northern Nigerian artists with virtual exhibition capabilities.', 300000, 'idea', cat_artwork, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "development", "artists": 75}', 345),
  (gen_random_uuid(), sample_user_id, 'Mural Mapping Project', 'Documentation and GPS mapping of public murals and street art across Northern Nigeria cities.', 80000, 'idea', cat_artwork, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "ongoing", "murals_mapped": 120}', 234);

  -- Education Ideas
  INSERT INTO listings (id, user_id, title, description, price, listing_type, category_id, images, is_verified, metadata, view_count) VALUES
  (gen_random_uuid(), sample_user_id, 'STEM Kit for Rural Schools', 'Affordable, solar-powered STEM education kits designed for schools with limited electricity access.', 350000, 'idea', cat_education, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "prototype", "schools_piloted": 10}', 456),
  (gen_random_uuid(), sample_user_id, 'Scholarship Matching Platform', 'AI-powered platform matching students with relevant scholarships and educational opportunities.', 200000, 'idea', cat_education, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "beta", "scholarships_listed": 500}', 678),
  (gen_random_uuid(), sample_user_id, 'Teacher Training Program', 'Online certification program for teachers in modern pedagogical methods and technology integration.', 180000, 'idea', cat_education, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "live", "teachers_trained": 200}', 345),
  (gen_random_uuid(), sample_user_id, 'Digital Library for Students', 'Offline-capable digital library app with textbooks and educational resources for students.', 150000, 'idea', cat_education, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "development", "books": 1000}', 423);

  -- Crafts Ideas
  INSERT INTO listings (id, user_id, title, description, price, listing_type, category_id, images, is_verified, metadata, view_count) VALUES
  (gen_random_uuid(), sample_user_id, 'Craft Tourism Experience', 'Guided tours of artisan workshops with hands-on craft learning experiences for tourists.', 200000, 'idea', cat_crafts, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "concept", "workshops_partnered": 15}', 289),
  (gen_random_uuid(), sample_user_id, 'Artisan Certification Program', 'Standardized certification for traditional craftsmen to validate skills and improve marketability.', 150000, 'idea', cat_crafts, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "pilot", "certifications_issued": 50}', 234),
  (gen_random_uuid(), sample_user_id, 'Craft Materials Marketplace', 'B2B platform connecting craft material suppliers with artisans across the region.', 180000, 'idea', cat_crafts, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "MVP", "suppliers": 80}', 312);

  -- Textile Ideas
  INSERT INTO listings (id, user_id, title, description, price, listing_type, category_id, images, is_verified, metadata, view_count) VALUES
  (gen_random_uuid(), sample_user_id, 'Traditional Weaving Revival', 'Project to document and teach traditional Aso-Oke weaving techniques to new generation of weavers.', 250000, 'idea', cat_textiles, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "ongoing", "apprentices": 25}', 345),
  (gen_random_uuid(), sample_user_id, 'Natural Dye Production', 'Sustainable natural dye production using locally sourced plants and traditional methods.', 180000, 'idea', cat_textiles, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "production", "colors_available": 15}', 267),
  (gen_random_uuid(), sample_user_id, 'Textile Waste Recycling', 'Initiative to collect and recycle textile waste into new products and raw materials.', 200000, 'idea', cat_textiles, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "pilot", "waste_collected_kg": 500}', 189);

  -- Shoe Making Ideas
  INSERT INTO listings (id, user_id, title, description, price, listing_type, category_id, images, is_verified, metadata, view_count) VALUES
  (gen_random_uuid(), sample_user_id, 'Custom Fit Technology', 'Mobile app using phone camera to create accurate foot measurements for custom shoe orders.', 220000, 'idea', cat_shoes, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "development", "accuracy": "95%"}', 378),
  (gen_random_uuid(), sample_user_id, 'Orthopedic Traditional Shoes', 'Traditional shoe designs with modern orthopedic support features for comfort and health.', 180000, 'idea', cat_shoes, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "prototype", "designs": 8}', 245),
  (gen_random_uuid(), sample_user_id, 'Cobbler Network App', 'Platform connecting shoe repair customers with nearby cobblers for pickup and delivery service.', 120000, 'idea', cat_shoes, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "concept", "cobblers_interested": 100}', 312);

  -- More diverse ideas to reach 50
  INSERT INTO listings (id, user_id, title, description, price, listing_type, category_id, images, is_verified, metadata, view_count) VALUES
  (gen_random_uuid(), sample_user_id, 'Renewable Energy for Artisans', 'Solar power solutions designed specifically for small artisan workshops and market stalls.', 400000, 'idea', cat_digital, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "pilot", "installations": 20}', 456),
  (gen_random_uuid(), sample_user_id, 'Cultural Heritage App', 'Interactive app documenting and preserving Northern Nigerian cultural heritage and traditions.', 280000, 'idea', cat_digital, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "development", "entries": 500}', 523),
  (gen_random_uuid(), sample_user_id, 'Women Artisan Cooperative', 'Cooperative platform empowering women artisans with training, resources, and market access.', 200000, 'idea', cat_crafts, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "growing", "members": 150}', 389),
  (gen_random_uuid(), sample_user_id, 'Youth Skills Training Center', 'Comprehensive vocational training center offering multiple traditional and digital skills.', 500000, 'idea', cat_education, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "planning", "trades": 10}', 412),
  (gen_random_uuid(), sample_user_id, 'Micro-Finance for Craftsmen', 'Specialized micro-finance platform providing small loans to traditional craftsmen.', 350000, 'idea', cat_digital, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"stage": "concept", "target_loan_size": 50000}', 289);

  -- ==========================================
  -- TALENTS (25 items)
  -- ==========================================
  
  INSERT INTO listings (id, user_id, title, description, price, listing_type, category_id, images, is_verified, metadata, view_count) VALUES
  -- Leatherwork Talents
  (gen_random_uuid(), sample_user_id, 'Master Leather Craftsman - 30 Years Experience', 'Expert in traditional Kano leather crafting, specializing in bags, belts, and accessories. Available for commissions and training.', 50000, 'talent', cat_leatherworks, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 30, "specialization": "bags and accessories"}', 567),
  (gen_random_uuid(), sample_user_id, 'Leather Pattern Designer', 'Creative designer specializing in traditional and contemporary leather patterns and embossing designs.', 35000, 'talent', cat_leatherworks, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 8, "patterns_created": 200}', 345),
  
  -- Tailoring Talents
  (gen_random_uuid(), sample_user_id, 'Traditional Embroidery Specialist', 'Master of traditional Northern Nigerian embroidery patterns including Agbada and Babariga designs.', 45000, 'talent', cat_tailoring, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 25, "specialization": "agbada embroidery"}', 489),
  (gen_random_uuid(), sample_user_id, 'Fashion Designer - Modern African Fusion', 'Contemporary fashion designer blending traditional Northern styles with modern aesthetics.', 60000, 'talent', cat_tailoring, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 10, "collections": 5}', 623),
  (gen_random_uuid(), sample_user_id, 'Master Tailor - Ceremonial Wear', 'Specialist in creating elaborate ceremonial and wedding attire with intricate detailing.', 55000, 'talent', cat_tailoring, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 20, "weddings_served": 500}', 412),
  
  -- Carpentry Talents
  (gen_random_uuid(), sample_user_id, 'Furniture Maker - Traditional Designs', 'Expert furniture maker specializing in traditional Northern Nigerian wooden furniture designs.', 40000, 'talent', cat_carpentry, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 15, "specialization": "traditional furniture"}', 378),
  (gen_random_uuid(), sample_user_id, 'Wood Carving Artist', 'Skilled wood carver creating decorative pieces, sculptures, and functional art.', 35000, 'talent', cat_carpentry, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 12, "pieces_created": 300}', 289),
  
  -- Shoe Making Talents
  (gen_random_uuid(), sample_user_id, 'Traditional Shoe Maker', 'Master craftsman creating traditional leather footwear using time-honored techniques.', 30000, 'talent', cat_shoes, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 20, "styles": 15}', 312),
  (gen_random_uuid(), sample_user_id, 'Custom Sandal Designer', 'Designer and maker of custom leather sandals with traditional and modern designs.', 25000, 'talent', cat_shoes, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 8, "designs": 50}', 245),
  
  -- Food & Culinary Talents
  (gen_random_uuid(), sample_user_id, 'Traditional Cuisine Chef', 'Expert chef specializing in authentic Northern Nigerian cuisine. Available for events and catering.', 45000, 'talent', cat_food, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 15, "events_catered": 200}', 534),
  (gen_random_uuid(), sample_user_id, 'Kilishi Production Expert', 'Master of traditional Kilishi (beef jerky) preparation with secret family recipes.', 35000, 'talent', cat_food, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 25, "production_kg_monthly": 100}', 423),
  (gen_random_uuid(), sample_user_id, 'Fura da Nono Specialist', 'Expert in preparing traditional Fura da Nono and other fermented dairy products.', 20000, 'talent', cat_food, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 18, "daily_production": 50}', 267),
  
  -- Artwork Talents
  (gen_random_uuid(), sample_user_id, 'Arabic Calligrapher', 'Master calligrapher specializing in Arabic scripts for religious texts, certificates, and art.', 40000, 'talent', cat_artwork, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 20, "styles": ["Naskh", "Thuluth", "Diwani"]}', 456),
  (gen_random_uuid(), sample_user_id, 'Henna Artist', 'Professional henna artist for weddings, celebrations, and events with traditional and modern designs.', 25000, 'talent', cat_artwork, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 10, "events_per_month": 20}', 567),
  (gen_random_uuid(), sample_user_id, 'Portrait Artist', 'Skilled portrait artist working in various mediums including charcoal, oil, and digital.', 35000, 'talent', cat_artwork, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 8, "portraits_completed": 500}', 345),
  
  -- Textile Talents
  (gen_random_uuid(), sample_user_id, 'Traditional Weaver - Aso-Oke', 'Master weaver creating traditional Aso-Oke fabrics using handloom techniques.', 50000, 'talent', cat_textiles, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 30, "patterns": 50}', 389),
  (gen_random_uuid(), sample_user_id, 'Adire Textile Artist', 'Expert in traditional Adire (tie-dye) textile creation with unique patterns.', 35000, 'talent', cat_textiles, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 15, "techniques": ["batik", "oniko", "eleko"]}', 312),
  
  -- Digital/Tech Talents
  (gen_random_uuid(), sample_user_id, 'Web Developer - Local Focus', 'Full-stack developer specializing in websites for local businesses and organizations.', 80000, 'talent', cat_digital, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 5, "projects_completed": 50}', 678),
  (gen_random_uuid(), sample_user_id, 'Digital Marketing Specialist', 'Expert in digital marketing strategies tailored for Northern Nigerian businesses.', 60000, 'talent', cat_digital, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 6, "campaigns_run": 100}', 534),
  (gen_random_uuid(), sample_user_id, 'Mobile App Developer', 'Developer creating mobile applications for local business needs and community solutions.', 100000, 'talent', cat_digital, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 4, "apps_published": 12}', 456),
  
  -- Farming Talents
  (gen_random_uuid(), sample_user_id, 'Agricultural Consultant', 'Expert consultant in sustainable farming practices adapted for Northern Nigerian climate.', 70000, 'talent', cat_farming, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 20, "farms_advised": 200}', 389),
  (gen_random_uuid(), sample_user_id, 'Livestock Specialist', 'Expert in cattle and goat husbandry, breeding programs, and animal health management.', 55000, 'talent', cat_farming, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 18, "herds_managed": 50}', 312),
  
  -- Craft Talents
  (gen_random_uuid(), sample_user_id, 'Calabash Carver', 'Traditional calabash carver creating decorative and functional pieces with intricate designs.', 25000, 'talent', cat_crafts, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 25, "pieces_per_month": 30}', 234),
  (gen_random_uuid(), sample_user_id, 'Basket Weaver', 'Expert basket weaver using traditional techniques and locally sourced materials.', 20000, 'talent', cat_crafts, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 20, "styles": 12}', 189),
  (gen_random_uuid(), sample_user_id, 'Pottery Artisan', 'Traditional potter creating functional and decorative earthenware using ancient techniques.', 30000, 'talent', cat_crafts, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"experience_years": 15, "products": ["pots", "vases", "plates"]}', 267);

  -- ==========================================
  -- PHYSICAL PRODUCTS (25 items)
  -- ==========================================
  
  INSERT INTO listings (id, user_id, title, description, price, listing_type, category_id, images, is_verified, metadata, view_count) VALUES
  -- Leatherwork Products
  (gen_random_uuid(), sample_user_id, 'Handcrafted Leather Briefcase', 'Premium leather briefcase handmade by Kano artisans. Features traditional embossing and brass hardware.', 75000, 'physical', cat_leatherworks, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"material": "genuine leather", "color": "brown", "dimensions": "40x30x10cm"}', 456),
  (gen_random_uuid(), sample_user_id, 'Traditional Leather Slippers (Takalmi)', 'Authentic Hausa leather slippers with intricate embroidery. Comfortable and durable.', 15000, 'physical', cat_leatherworks, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"material": "leather", "sizes": ["40", "41", "42", "43", "44"]}', 678),
  (gen_random_uuid(), sample_user_id, 'Leather Belt with Traditional Design', 'Hand-tooled leather belt featuring traditional Northern Nigerian patterns.', 12000, 'physical', cat_leatherworks, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"material": "genuine leather", "width": "4cm"}', 345),
  
  -- Tailoring Products
  (gen_random_uuid(), sample_user_id, 'Embroidered Agbada Set', 'Complete Agbada set with intricate hand embroidery. Includes Agbada, Sokoto, and Fila.', 150000, 'physical', cat_tailoring, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"material": "Cashmere blend", "embroidery": "hand-stitched", "includes": ["agbada", "sokoto", "fila"]}', 534),
  (gen_random_uuid(), sample_user_id, 'Traditional Babariga', 'Classic Babariga (flowing gown) with subtle embroidery perfect for everyday wear.', 45000, 'physical', cat_tailoring, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"material": "Cotton", "colors_available": 8}', 412),
  (gen_random_uuid(), sample_user_id, 'Women Traditional Wrapper Set', 'Beautiful wrapper set with matching blouse material and gele (headtie).', 35000, 'physical', cat_tailoring, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"material": "Ankara", "pieces": 3}', 389),
  
  -- Carpentry Products
  (gen_random_uuid(), sample_user_id, 'Carved Wooden Chair', 'Traditional carved wooden chair with intricate designs. Handmade from local hardwood.', 85000, 'physical', cat_carpentry, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"material": "Mahogany", "finish": "natural oil"}', 312),
  (gen_random_uuid(), sample_user_id, 'Wooden Storage Chest', 'Hand-carved storage chest with traditional motifs. Perfect for storing valuables.', 120000, 'physical', cat_carpentry, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"material": "Iroko wood", "dimensions": "100x50x50cm"}', 267),
  
  -- Food Products
  (gen_random_uuid(), sample_user_id, 'Premium Kilishi (500g)', 'Authentic Hausa beef jerky (Kilishi) made with traditional spices. Vacuum-packed for freshness.', 8000, 'physical', cat_food, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"weight": "500g", "shelf_life": "3 months", "spice_level": "medium"}', 789),
  (gen_random_uuid(), sample_user_id, 'Kuli Kuli (Groundnut Snack)', 'Traditional groundnut snack made with pure groundnuts and spices. Pack of 20 pieces.', 3500, 'physical', cat_food, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"quantity": 20, "weight": "400g"}', 567),
  (gen_random_uuid(), sample_user_id, 'Dawadawa (Locust Bean) 250g', 'Fermented locust bean seasoning. Essential ingredient for traditional soups.', 2500, 'physical', cat_food, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"weight": "250g", "type": "fermented"}', 456),
  (gen_random_uuid(), sample_user_id, 'Suya Spice Mix (200g)', 'Authentic suya spice blend for grilling. Family recipe passed down generations.', 3000, 'physical', cat_food, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"weight": "200g", "ingredients": "groundnut, ginger, pepper, spices"}', 623),
  
  -- Textile Products
  (gen_random_uuid(), sample_user_id, 'Handwoven Aso-Oke Fabric (5 yards)', 'Traditional handwoven Aso-Oke fabric. Rich colors and durable quality.', 45000, 'physical', cat_textiles, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"length": "5 yards", "width": "45 inches", "pattern": "traditional"}', 412),
  (gen_random_uuid(), sample_user_id, 'Adire Fabric (6 yards)', 'Hand-dyed Adire fabric with unique resist-dyeing patterns.', 25000, 'physical', cat_textiles, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"length": "6 yards", "dye": "natural indigo"}', 345),
  
  -- Crafts Products
  (gen_random_uuid(), sample_user_id, 'Decorated Calabash Bowl', 'Large calabash bowl with intricate carved and burnt designs. Functional art piece.', 18000, 'physical', cat_crafts, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"diameter": "30cm", "use": "decorative/serving"}', 289),
  (gen_random_uuid(), sample_user_id, 'Woven Storage Basket Set', 'Set of 3 nesting storage baskets made from local palm fiber.', 15000, 'physical', cat_crafts, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"quantity": 3, "material": "palm fiber"}', 312),
  (gen_random_uuid(), sample_user_id, 'Traditional Pottery Water Jug', 'Clay water jug that keeps water naturally cool. Traditional design with modern finish.', 8000, 'physical', cat_crafts, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"capacity": "5 liters", "material": "clay"}', 234),
  
  -- Artwork Products
  (gen_random_uuid(), sample_user_id, 'Arabic Calligraphy Wall Art', 'Framed Arabic calligraphy artwork with gold leaf accents. Ayatul Kursi design.', 55000, 'physical', cat_artwork, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"dimensions": "60x40cm", "frame": "wooden", "style": "Thuluth"}', 456),
  (gen_random_uuid(), sample_user_id, 'Traditional Painting - Market Scene', 'Original acrylic painting depicting a traditional Northern Nigerian market scene.', 85000, 'physical', cat_artwork, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"medium": "acrylic on canvas", "dimensions": "90x60cm"}', 389),
  
  -- Farming/Agriculture Products
  (gen_random_uuid(), sample_user_id, 'Organic Groundnuts (25kg)', 'Freshly harvested organic groundnuts from Kano farms. Sorted and cleaned.', 35000, 'physical', cat_farming, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"weight": "25kg", "type": "organic", "variety": "kampala"}', 534),
  (gen_random_uuid(), sample_user_id, 'Pure Shea Butter (1kg)', 'Unrefined shea butter processed using traditional methods. For skin and hair care.', 8000, 'physical', cat_farming, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"weight": "1kg", "processing": "cold-pressed", "grade": "A"}', 678),
  (gen_random_uuid(), sample_user_id, 'Hibiscus (Zobo) Leaves 500g', 'Dried hibiscus leaves for making traditional Zobo drink. Rich red color.', 3000, 'physical', cat_farming, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"weight": "500g", "origin": "Sokoto"}', 456),
  
  -- Shoe Products  
  (gen_random_uuid(), sample_user_id, 'Handmade Leather Sandals', 'Traditional leather sandals with modern comfort. Hand-stitched soles.', 18000, 'physical', cat_shoes, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"material": "genuine leather", "sole": "rubber", "sizes": ["39-45"]}', 367),
  (gen_random_uuid(), sample_user_id, 'Embroidered Traditional Shoes', 'Elegant embroidered shoes perfect for special occasions and ceremonies.', 25000, 'physical', cat_shoes, ARRAY['/placeholder.svg?height=400&width=600'], true, '{"material": "leather", "embroidery": "gold thread"}', 289);

END $$;
