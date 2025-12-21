-- Seed categories for the marketplace
INSERT INTO categories (id, name, slug, description, icon) VALUES
  (gen_random_uuid(), 'Leatherworks', 'leatherworks', 'Handcrafted leather goods and accessories', 'briefcase'),
  (gen_random_uuid(), 'Farming & Agriculture', 'farming', 'Agricultural products, tools, and farming assets', 'leaf'),
  (gen_random_uuid(), 'Local Crafts', 'crafts', 'Traditional and handmade craft items', 'palette'),
  (gen_random_uuid(), 'Tailoring & Fashion', 'fashion', 'Clothing, textiles, and fashion items', 'scissors'),
  (gen_random_uuid(), 'Carpentry', 'carpentry', 'Wooden furniture and carpentry work', 'hammer'),
  (gen_random_uuid(), 'Footwear', 'footwear', 'Shoes, sandals, and handmade footwear', 'footprints'),
  (gen_random_uuid(), 'Food & Produce', 'food', 'Traditional food items and local produce', 'utensils'),
  (gen_random_uuid(), 'Artwork', 'artwork', 'Paintings, sculptures, and artistic creations', 'frame'),
  (gen_random_uuid(), 'Technology', 'technology', 'Tech products, software, and digital tools', 'cpu'),
  (gen_random_uuid(), 'Services', 'services', 'Professional and freelance services', 'briefcase'),
  (gen_random_uuid(), 'Ideas & Innovation', 'ideas', 'Business ideas, patents, and innovations', 'lightbulb'),
  (gen_random_uuid(), 'Talent & Skills', 'talent', 'Professional skills and expertise offerings', 'user'),
  (gen_random_uuid(), 'Education', 'education', 'Educational content, courses, and training', 'graduation-cap'),
  (gen_random_uuid(), 'Health & Wellness', 'health', 'Health products and wellness services', 'heart')
ON CONFLICT DO NOTHING;
