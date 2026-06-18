export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  image: string;
  description: string;
  vibes: string[];
  bestMonths: number[];
  budgetPerDay: { min: number; max: number; currency: string };
  weather: { winter: string; spring: string; summer: string; autumn: string };
  topAttractions: string[];
  suggestedDays: { min: number; max: number };
  travelTips: string[];
  languages: string[];
  timezone: string;
  rating: number;
  popularFor: string[];
}

export const destinations: Destination[] = [
  {
    id: 'dest-goa',
    name: 'Goa',
    country: 'India',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    description: 'Sun-kissed beaches, vibrant nightlife, Portuguese heritage, and incredible seafood — Goa is India\'s ultimate beach paradise.',
    vibes: ['beach', 'party', 'romantic', 'budget', 'backpacking', 'adventure', 'relaxation'],
    bestMonths: [11, 12, 1, 2, 3],
    budgetPerDay: { min: 1500, max: 8000, currency: '₹' },
    weather: { winter: '25°C, Sunny', spring: '32°C, Hot', summer: '30°C, Rainy', autumn: '28°C, Pleasant' },
    topAttractions: ['Baga Beach', 'Dudhsagar Falls', 'Fort Aguada', 'Anjuna Flea Market', 'Old Goa Churches'],
    suggestedDays: { min: 3, max: 7 },
    travelTips: ['Book beach shacks in advance during peak season', 'Rent a scooter for easy travel', 'Try fish thali at local restaurants'],
    languages: ['Konkani', 'English', 'Hindi'],
    timezone: 'IST (UTC+5:30)',
    rating: 4.5,
    popularFor: ['Beaches', 'Nightlife', 'Seafood', 'Water Sports'],
  },
  {
    id: 'dest-bali',
    name: 'Bali',
    country: 'Indonesia',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    description: 'A tropical paradise of rice terraces, ancient temples, world-class surfing, and spiritual retreats that captivates every type of traveler.',
    vibes: ['romantic', 'spiritual', 'adventure', 'luxury', 'solo', 'honeymoon', 'relaxation', 'backpacking'],
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    budgetPerDay: { min: 2000, max: 15000, currency: '₹' },
    weather: { winter: '27°C, Rainy', spring: '28°C, Pleasant', summer: '27°C, Dry', autumn: '28°C, Dry' },
    topAttractions: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Uluwatu Temple', 'Seminyak Beach', 'Mount Batur'],
    suggestedDays: { min: 5, max: 10 },
    travelTips: ['Visit temples early morning to avoid crowds', 'Learn basic Bahasa Indonesian phrases', 'Negotiate prices at local markets'],
    languages: ['Balinese', 'Indonesian', 'English'],
    timezone: 'WITA (UTC+8)',
    rating: 4.8,
    popularFor: ['Temples', 'Rice Terraces', 'Surfing', 'Yoga Retreats'],
  },
  {
    id: 'dest-paris',
    name: 'Paris',
    country: 'France',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    description: 'The City of Light — world-famous for art, cuisine, fashion, and romance. From the Eiffel Tower to hidden cafés, Paris is timeless.',
    vibes: ['romantic', 'luxury', 'cultural', 'honeymoon', 'solo', 'art', 'food'],
    bestMonths: [4, 5, 6, 9, 10],
    budgetPerDay: { min: 8000, max: 30000, currency: '₹' },
    weather: { winter: '5°C, Cold', spring: '15°C, Mild', summer: '25°C, Warm', autumn: '12°C, Cool' },
    topAttractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Montmartre', 'Champs-Élysées'],
    suggestedDays: { min: 4, max: 7 },
    travelTips: ['Get a museum pass for savings', 'Walk along the Seine at sunset', 'Try croissants from local boulangeries'],
    languages: ['French', 'English'],
    timezone: 'CET (UTC+1)',
    rating: 4.7,
    popularFor: ['Art', 'Romance', 'Cuisine', 'Architecture'],
  },
  {
    id: 'dest-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    description: 'A mesmerizing blend of ultramodern technology and ancient tradition. Neon-lit streets meet serene temples in the world\'s most fascinating city.',
    vibes: ['cultural', 'adventure', 'food', 'solo', 'tech', 'luxury', 'unique'],
    bestMonths: [3, 4, 10, 11],
    budgetPerDay: { min: 5000, max: 25000, currency: '₹' },
    weather: { winter: '7°C, Cold', spring: '18°C, Cherry Blossom', summer: '30°C, Humid', autumn: '20°C, Pleasant' },
    topAttractions: ['Shibuya Crossing', 'Senso-ji Temple', 'Meiji Shrine', 'Akihabara', 'Tsukiji Market'],
    suggestedDays: { min: 5, max: 10 },
    travelTips: ['Get a Japan Rail Pass', 'Visit during cherry blossom season (March-April)', 'Try conveyor belt sushi'],
    languages: ['Japanese', 'English (limited)'],
    timezone: 'JST (UTC+9)',
    rating: 4.9,
    popularFor: ['Technology', 'Temples', 'Food', 'Cherry Blossoms'],
  },
  {
    id: 'dest-maldives',
    name: 'Maldives',
    country: 'Maldives',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    description: 'Crystal-clear waters, overwater villas, and pristine white-sand beaches. The ultimate luxury island escape for romance and tranquility.',
    vibes: ['romantic', 'luxury', 'honeymoon', 'relaxation', 'beach', 'diving'],
    bestMonths: [1, 2, 3, 4, 11, 12],
    budgetPerDay: { min: 10000, max: 80000, currency: '₹' },
    weather: { winter: '28°C, Dry', spring: '30°C, Humid', summer: '29°C, Rainy', autumn: '28°C, Transitional' },
    topAttractions: ['Overwater Villas', 'Snorkeling', 'Bioluminescent Beach', 'Whale Shark Diving', 'Sunset Cruises'],
    suggestedDays: { min: 4, max: 7 },
    travelTips: ['Book all-inclusive resorts for best value', 'Visit during dry season (Nov-Apr)', 'Try a sunset dolphin cruise'],
    languages: ['Dhivehi', 'English'],
    timezone: 'MVT (UTC+5)',
    rating: 4.9,
    popularFor: ['Overwater Villas', 'Diving', 'Romance', 'Beaches'],
  },
  {
    id: 'dest-dubai',
    name: 'Dubai',
    country: 'UAE',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    description: 'A futuristic city of superlatives — tallest buildings, largest malls, and luxury experiences that push every boundary imaginable.',
    vibes: ['luxury', 'shopping', 'adventure', 'family', 'modern', 'party'],
    bestMonths: [11, 12, 1, 2, 3],
    budgetPerDay: { min: 5000, max: 40000, currency: '₹' },
    weather: { winter: '24°C, Pleasant', spring: '32°C, Warm', summer: '42°C, Very Hot', autumn: '35°C, Hot' },
    topAttractions: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Desert Safari', 'Dubai Marina'],
    suggestedDays: { min: 4, max: 7 },
    travelTips: ['Visit Oct-Mar to avoid extreme heat', 'Friday brunch is a must-do cultural experience', 'Use the Metro — it\'s modern and efficient'],
    languages: ['Arabic', 'English'],
    timezone: 'GST (UTC+4)',
    rating: 4.6,
    popularFor: ['Luxury', 'Shopping', 'Architecture', 'Desert'],
  },
  {
    id: 'dest-santorini',
    name: 'Santorini',
    country: 'Greece',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    description: 'Iconic white-washed buildings with blue domes perched on volcanic cliffs overlooking the Aegean Sea. Pure Mediterranean magic.',
    vibes: ['romantic', 'honeymoon', 'luxury', 'photography', 'relaxation', 'cultural'],
    bestMonths: [5, 6, 9, 10],
    budgetPerDay: { min: 8000, max: 35000, currency: '₹' },
    weather: { winter: '12°C, Mild', spring: '20°C, Pleasant', summer: '28°C, Hot', autumn: '22°C, Warm' },
    topAttractions: ['Oia Sunset', 'Red Beach', 'Akrotiri Ruins', 'Wine Tasting', 'Caldera Cruise'],
    suggestedDays: { min: 3, max: 5 },
    travelTips: ['Book Oia sunset spots early', 'Visit in shoulder season for fewer crowds', 'Try local Assyrtiko wine'],
    languages: ['Greek', 'English'],
    timezone: 'EET (UTC+2)',
    rating: 4.8,
    popularFor: ['Sunsets', 'Architecture', 'Wine', 'Romance'],
  },
  {
    id: 'dest-manali',
    name: 'Manali',
    country: 'India',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    description: 'A breathtaking Himalayan hill station with snow-capped peaks, lush valleys, and adventure sports. Perfect for both thrill-seekers and peace-seekers.',
    vibes: ['adventure', 'backpacking', 'budget', 'solo', 'romantic', 'nature', 'winter'],
    bestMonths: [3, 4, 5, 6, 10, 12, 1, 2],
    budgetPerDay: { min: 1000, max: 5000, currency: '₹' },
    weather: { winter: '0°C, Snowy', spring: '15°C, Pleasant', summer: '22°C, Cool', autumn: '10°C, Cool' },
    topAttractions: ['Rohtang Pass', 'Solang Valley', 'Old Manali', 'Hadimba Temple', 'Jogini Waterfall'],
    suggestedDays: { min: 3, max: 7 },
    travelTips: ['Carry warm clothes even in summer', 'Book Rohtang Pass permits in advance', 'Try sidu and dham local cuisine'],
    languages: ['Hindi', 'English', 'Pahari'],
    timezone: 'IST (UTC+5:30)',
    rating: 4.4,
    popularFor: ['Mountains', 'Snow', 'Adventure Sports', 'Trekking'],
  },
  {
    id: 'dest-newyork',
    name: 'New York City',
    country: 'United States',
    continent: 'North America',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    description: 'The city that never sleeps — Broadway shows, Central Park, world-class museums, and the most iconic skyline on Earth.',
    vibes: ['cultural', 'luxury', 'food', 'shopping', 'solo', 'adventure', 'art'],
    bestMonths: [4, 5, 9, 10, 12],
    budgetPerDay: { min: 10000, max: 50000, currency: '₹' },
    weather: { winter: '-2°C, Cold', spring: '16°C, Mild', summer: '30°C, Hot', autumn: '15°C, Cool' },
    topAttractions: ['Statue of Liberty', 'Central Park', 'Times Square', 'Brooklyn Bridge', 'MoMA'],
    suggestedDays: { min: 5, max: 10 },
    travelTips: ['Get a CityPASS for attractions', 'Walk across Brooklyn Bridge at sunset', 'Try pizza from Joe\'s Pizza'],
    languages: ['English', 'Spanish'],
    timezone: 'EST (UTC-5)',
    rating: 4.7,
    popularFor: ['Skyline', 'Broadway', 'Museums', 'Food'],
  },
  {
    id: 'dest-bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
    description: 'A sensory explosion of golden temples, floating markets, street food, and buzzing nightlife. Asia\'s most dynamic and affordable city.',
    vibes: ['budget', 'backpacking', 'food', 'party', 'cultural', 'solo', 'adventure'],
    bestMonths: [11, 12, 1, 2, 3],
    budgetPerDay: { min: 1500, max: 8000, currency: '₹' },
    weather: { winter: '28°C, Cool & Dry', spring: '35°C, Hot', summer: '32°C, Rainy', autumn: '30°C, Rainy' },
    topAttractions: ['Grand Palace', 'Wat Arun', 'Chatuchak Market', 'Khao San Road', 'Floating Markets'],
    suggestedDays: { min: 3, max: 6 },
    travelTips: ['Use BTS Skytrain to avoid traffic', 'Eat at street stalls — it\'s the best food', 'Visit temples in the morning'],
    languages: ['Thai', 'English (tourist areas)'],
    timezone: 'ICT (UTC+7)',
    rating: 4.5,
    popularFor: ['Street Food', 'Temples', 'Nightlife', 'Shopping'],
  },
  {
    id: 'dest-switzerland',
    name: 'Swiss Alps',
    country: 'Switzerland',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
    description: 'Majestic snow-capped mountains, pristine lakes, chocolate, cheese, and the most scenic train rides on the planet.',
    vibes: ['luxury', 'romantic', 'adventure', 'nature', 'winter', 'honeymoon', 'photography'],
    bestMonths: [6, 7, 8, 9, 12, 1, 2],
    budgetPerDay: { min: 12000, max: 50000, currency: '₹' },
    weather: { winter: '-5°C, Snowy', spring: '12°C, Cool', summer: '22°C, Pleasant', autumn: '8°C, Crisp' },
    topAttractions: ['Jungfraujoch', 'Lake Geneva', 'Matterhorn', 'Glacier Express', 'Interlaken'],
    suggestedDays: { min: 5, max: 10 },
    travelTips: ['Get a Swiss Travel Pass', 'Visit Jungfraujoch on a clear day', 'Try raclette and fondue'],
    languages: ['German', 'French', 'Italian', 'English'],
    timezone: 'CET (UTC+1)',
    rating: 4.9,
    popularFor: ['Mountains', 'Scenic Trains', 'Skiing', 'Lakes'],
  },
  {
    id: 'dest-london',
    name: 'London',
    country: 'United Kingdom',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
    description: 'Royal palaces, world-class theaters, historic pubs, and cutting-edge culture — London is a city where history meets the future.',
    vibes: ['cultural', 'luxury', 'solo', 'food', 'art', 'historical', 'shopping'],
    bestMonths: [5, 6, 7, 8, 9],
    budgetPerDay: { min: 8000, max: 35000, currency: '₹' },
    weather: { winter: '6°C, Drizzly', spring: '14°C, Mild', summer: '22°C, Warm', autumn: '12°C, Cool' },
    topAttractions: ['Big Ben', 'Tower of London', 'British Museum', 'Buckingham Palace', 'Camden Market'],
    suggestedDays: { min: 4, max: 7 },
    travelTips: ['Use the Oyster card for transport', 'Many museums are free!', 'Book West End shows in advance'],
    languages: ['English'],
    timezone: 'GMT (UTC+0)',
    rating: 4.6,
    popularFor: ['History', 'Theater', 'Royalty', 'Museums'],
  },
  {
    id: 'dest-kerala',
    name: 'Kerala',
    country: 'India',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    description: 'God\'s Own Country — serene backwaters, lush tea plantations, Ayurvedic retreats, and some of India\'s most stunning natural beauty.',
    vibes: ['relaxation', 'romantic', 'nature', 'spiritual', 'budget', 'honeymoon', 'cultural'],
    bestMonths: [10, 11, 12, 1, 2, 3],
    budgetPerDay: { min: 1500, max: 8000, currency: '₹' },
    weather: { winter: '26°C, Pleasant', spring: '30°C, Warm', summer: '28°C, Monsoon', autumn: '27°C, Humid' },
    topAttractions: ['Alleppey Backwaters', 'Munnar Tea Gardens', 'Fort Kochi', 'Kumarakom', 'Wayanad'],
    suggestedDays: { min: 5, max: 10 },
    travelTips: ['Book a houseboat overnight', 'Try Kerala sadya (traditional feast)', 'Visit during Onam festival'],
    languages: ['Malayalam', 'English'],
    timezone: 'IST (UTC+5:30)',
    rating: 4.7,
    popularFor: ['Backwaters', 'Ayurveda', 'Tea Plantations', 'Beaches'],
  },
  {
    id: 'dest-iceland',
    name: 'Iceland',
    country: 'Iceland',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80',
    description: 'Land of fire and ice — geysers, glaciers, northern lights, and landscapes that look like another planet. Nature at its most raw and beautiful.',
    vibes: ['adventure', 'nature', 'photography', 'unique', 'solo', 'luxury', 'winter'],
    bestMonths: [6, 7, 8, 9, 10, 11, 2, 3],
    budgetPerDay: { min: 12000, max: 40000, currency: '₹' },
    weather: { winter: '-2°C, Dark & Aurora', spring: '5°C, Cool', summer: '13°C, Midnight Sun', autumn: '4°C, Cool' },
    topAttractions: ['Northern Lights', 'Blue Lagoon', 'Golden Circle', 'Glacier Hiking', 'Whale Watching'],
    suggestedDays: { min: 5, max: 10 },
    travelTips: ['Rent a 4x4 for the Ring Road', 'Sept-March for Northern Lights', 'Layer up — weather changes fast'],
    languages: ['Icelandic', 'English'],
    timezone: 'GMT (UTC+0)',
    rating: 4.8,
    popularFor: ['Northern Lights', 'Geysers', 'Glaciers', 'Hot Springs'],
  },
  {
    id: 'dest-vietnam',
    name: 'Vietnam',
    country: 'Vietnam',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1557750255-c76072a7aee1?w=800&q=80',
    description: 'Ancient charm meets natural wonder — limestone karsts, bustling cities, incredible street food, and warm hospitality at unbeatable prices.',
    vibes: ['backpacking', 'budget', 'adventure', 'food', 'cultural', 'solo', 'nature'],
    bestMonths: [2, 3, 4, 10, 11],
    budgetPerDay: { min: 1200, max: 5000, currency: '₹' },
    weather: { winter: '18°C, Cool (North)', spring: '25°C, Warm', summer: '32°C, Hot', autumn: '24°C, Pleasant' },
    topAttractions: ['Ha Long Bay', 'Hoi An Ancient Town', 'Phong Nha Caves', 'Ho Chi Minh City', 'Sapa Rice Terraces'],
    suggestedDays: { min: 7, max: 14 },
    travelTips: ['Try pho for breakfast', 'Take the overnight train from Hanoi to Sapa', 'Haggle politely at markets'],
    languages: ['Vietnamese', 'English (tourist areas)'],
    timezone: 'ICT (UTC+7)',
    rating: 4.6,
    popularFor: ['Street Food', 'Caves', 'Ha Long Bay', 'History'],
  },
];

// Experiences data for the marketplace
export interface LocalExperience {
  id: string;
  title: string;
  category: 'guide' | 'food' | 'adventure' | 'cultural' | 'nightlife' | 'nature';
  destination: string;
  image: string;
  price: number;
  currency: string;
  duration: string;
  rating: number;
  reviewCount: number;
  description: string;
  highlights: string[];
  host: { name: string; avatar: string; verified: boolean };
}

export const localExperiences: LocalExperience[] = [
  {
    id: 'exp-1', title: 'Street Food Night Tour', category: 'food', destination: 'Bangkok',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    price: 1800, currency: '₹', duration: '3 hours', rating: 4.9, reviewCount: 342,
    description: 'Explore Bangkok\'s hidden street food gems with a local foodie. Taste 10+ authentic dishes across 5 neighborhoods.',
    highlights: ['10+ dishes included', 'Hidden local spots', 'Small group (max 8)', 'Vegetarian options'],
    host: { name: 'Somchai T.', avatar: '🧑‍🍳', verified: true },
  },
  {
    id: 'exp-2', title: 'Sunrise Himalayan Trek', category: 'adventure', destination: 'Manali',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    price: 2500, currency: '₹', duration: '6 hours', rating: 4.8, reviewCount: 189,
    description: 'Watch the sun rise over snow-capped Himalayan peaks on this guided trek through pristine alpine meadows.',
    highlights: ['Sunrise viewpoint', 'Expert guide', 'Hot chai included', 'All skill levels'],
    host: { name: 'Raju K.', avatar: '🏔️', verified: true },
  },
  {
    id: 'exp-3', title: 'Ancient Temple Walking Tour', category: 'cultural', destination: 'Tokyo',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    price: 4500, currency: '₹', duration: '4 hours', rating: 4.7, reviewCount: 256,
    description: 'Discover Tokyo\'s hidden temples and sacred gardens with a historian guide. Experience tea ceremony included.',
    highlights: ['Tea ceremony', 'Hidden gardens', 'History expert guide', 'Temple etiquette lesson'],
    host: { name: 'Yuki M.', avatar: '⛩️', verified: true },
  },
  {
    id: 'exp-4', title: 'Backwater Houseboat Experience', category: 'nature', destination: 'Kerala',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=80',
    price: 3500, currency: '₹', duration: 'Full day', rating: 4.9, reviewCount: 421,
    description: 'Cruise the serene backwaters of Alleppey on a traditional kettuvallam houseboat. Lunch cooked onboard with fresh local ingredients.',
    highlights: ['Traditional houseboat', 'Kerala lunch included', 'Village visits', 'Photography spots'],
    host: { name: 'Suresh N.', avatar: '🚢', verified: true },
  },
  {
    id: 'exp-5', title: 'Desert Safari & Bedouin Dinner', category: 'adventure', destination: 'Dubai',
    image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&q=80',
    price: 6000, currency: '₹', duration: '5 hours', rating: 4.6, reviewCount: 512,
    description: 'Dune bashing in a 4x4, camel rides, sandboarding, and a traditional Bedouin dinner under the stars.',
    highlights: ['Dune bashing', 'Camel riding', 'BBQ dinner', 'Belly dance show'],
    host: { name: 'Ahmed R.', avatar: '🏜️', verified: true },
  },
  {
    id: 'exp-6', title: 'Wine & Sunset Sailing', category: 'food', destination: 'Santorini',
    image: 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800&q=80',
    price: 9000, currency: '₹', duration: '4 hours', rating: 4.9, reviewCount: 178,
    description: 'Sail the caldera at sunset while tasting 5 local Santorini wines. Includes Greek mezze and swimming stops.',
    highlights: ['5 wine tastings', 'Caldera views', 'Swimming stops', 'Greek mezze'],
    host: { name: 'Nikos P.', avatar: '⛵', verified: true },
  },
  {
    id: 'exp-7', title: 'Northern Lights Photo Tour', category: 'nature', destination: 'Iceland',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    price: 12000, currency: '₹', duration: '5 hours', rating: 4.8, reviewCount: 145,
    description: 'Chase the aurora borealis with an expert photographer. Learn night photography techniques and capture stunning shots.',
    highlights: ['Aurora forecast tracking', 'Photography tips', 'Hot chocolate', 'Photos included'],
    host: { name: 'Björk S.', avatar: '🌌', verified: true },
  },
  {
    id: 'exp-8', title: 'Goa Spice Plantation & Cooking', category: 'food', destination: 'Goa',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
    price: 1200, currency: '₹', duration: '4 hours', rating: 4.5, reviewCount: 267,
    description: 'Tour a working spice plantation, learn about exotic spices, and cook an authentic Goan meal with a local family.',
    highlights: ['Spice garden tour', 'Cooking class', 'Lunch included', 'Spice gifts'],
    host: { name: 'Maria D.', avatar: '🌿', verified: true },
  },
  {
    id: 'exp-9', title: 'Montmartre Art Walk', category: 'cultural', destination: 'Paris',
    image: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800&q=80',
    price: 5500, currency: '₹', duration: '3 hours', rating: 4.7, reviewCount: 198,
    description: 'Follow in the footsteps of Picasso and Van Gogh through Montmartre\'s winding streets. Visit hidden studios and local galleries.',
    highlights: ['Art history', 'Hidden studios', 'Local gallery visits', 'Wine tasting'],
    host: { name: 'Claire B.', avatar: '🎨', verified: true },
  },
];

// AI matching function
export function matchDestinations(query: string): { destinations: Destination[]; insights: string } {
  const q = query.toLowerCase();

  // Parse budget
  let maxBudget = Infinity;
  const budgetMatch = q.match(/(?:₹|rs\.?|inr|rupees?)\s*([\d,]+)/i) || q.match(/([\d,]+)\s*(?:₹|rs|inr|rupees?)/i);
  if (budgetMatch) {
    maxBudget = parseInt(budgetMatch[1].replace(/,/g, ''));
  }
  const dollarMatch = q.match(/\$\s*([\d,]+)/i) || q.match(/([\d,]+)\s*(?:dollars?|usd)/i);
  if (dollarMatch) {
    maxBudget = parseInt(dollarMatch[1].replace(/,/g, '')) * 83; // Approximate USD to INR
  }

  // Parse days
  let days = 0;
  const dayMatch = q.match(/(\d+)\s*(?:days?|nights?)/i);
  if (dayMatch) days = parseInt(dayMatch[1]);

  // Parse month
  let targetMonth = 0;
  const months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  months.forEach((m, i) => { if (q.includes(m) || q.includes(m.slice(0, 3))) targetMonth = i + 1; });
  if (q.includes('winter')) targetMonth = 12;
  if (q.includes('summer')) targetMonth = 6;
  if (q.includes('spring')) targetMonth = 4;
  if (q.includes('autumn') || q.includes('fall')) targetMonth = 10;

  // Parse vibes
  const vibeKeywords = ['romantic','solo','backpacking','adventure','luxury','budget','party','beach','cultural','food',
    'honeymoon','nature','relaxation','spiritual','photography','winter','art','shopping','diving','unique','historical','tech'];
  const matchedVibes = vibeKeywords.filter(v => q.includes(v));

  // Score destinations
  let scored = destinations.map(d => {
    let score = 0;
    
    // Budget match
    if (maxBudget < Infinity && days > 0) {
      const totalMin = d.budgetPerDay.min * days;
      if (totalMin <= maxBudget) score += 30;
      else score -= 20;
    } else if (maxBudget < Infinity) {
      if (d.budgetPerDay.min * 3 <= maxBudget) score += 20;
    }

    // Days match
    if (days > 0) {
      if (days >= d.suggestedDays.min && days <= d.suggestedDays.max) score += 20;
      else if (days >= d.suggestedDays.min - 1) score += 10;
    }

    // Month match
    if (targetMonth > 0 && d.bestMonths.includes(targetMonth)) score += 25;

    // Vibe match
    matchedVibes.forEach(v => { if (d.vibes.includes(v)) score += 15; });

    // Country/name match
    if (q.includes(d.name.toLowerCase()) || q.includes(d.country.toLowerCase())) score += 50;

    return { ...d, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const results = scored.filter(d => d.score > 0).slice(0, 6);
  
  if (results.length === 0) {
    return { destinations: scored.slice(0, 6), insights: 'Showing top-rated destinations. Try specifying your budget, travel dates, or preferred vibe!' };
  }

  let insights = '';
  if (maxBudget < Infinity && days > 0) {
    insights += `Budget: ₹${maxBudget.toLocaleString()} for ${days} days. `;
  }
  if (matchedVibes.length > 0) {
    insights += `Vibes: ${matchedVibes.join(', ')}. `;
  }
  if (targetMonth > 0) {
    insights += `Best for: ${months[targetMonth - 1]}. `;
  }
  insights += `Found ${results.length} matching destinations!`;

  return { destinations: results, insights };
}
