export interface CityOfficeLocation {
  name: string;
  address: string;
  landmarkNote?: string;
  pincode?: string;
  lat: number;
  lng: number;
}

export interface City {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  services: ('bike' | 'auto' | 'cab' | 'b2b' | 'e_rickshaw' | 'tuk_tuk')[];
  active: boolean;
  address?: string; // Physical or statutory city office address
  landmarkNote?: string; // Executive landmark or navigation cue
  pincode?: string;
  contactPhone?: string;
  notes?: string; // Operational notes (e.g., service zones, high demand hours)
  distance?: number;
  roadDistanceKm?: number;
  rapidoCityCode?: string; // Internal Rapido backend ObjectId (e.g., '5a5f6f431635168040c9a162' for Vijayawada)
  additionalOffices?: CityOfficeLocation[]; // Multiple office locations for major metropolitan zones
  clusterId?: string; // Multi-zone transit cluster ID (e.g., 'pan_vijayawada', 'delhi_ncr')
  clusterName?: string; // Human readable cluster label (e.g., 'Pan-Vijayawada (VGTM Transit Corridor)')
  parentHubId?: string; // Parent operational hub if this zone is a satellite/sub-district
  isSubDistrict?: boolean; // True if this zone is a peripheral/sub-district municipality
  connectedZoneIds?: string[]; // IDs of member zones eligible for cross-dispatch
  crossDispatchEnabled?: boolean;
}

export type ServiceType = 'bike' | 'auto' | 'cab' | 'b2b' | 'e_rickshaw' | 'tuk_tuk';

/**
 * Official Rapido Servicing Cities sourced directly from rapido.bike production sitemap.
 * Easily editable by adding or removing entries.
 */
export const RAPIDO_OFFICIAL_CITIES: City[] = [
  { id: 'agartala', name: 'Agartala', state: 'Tripura', lat: 23.8315, lng: 91.2868, services: ['bike', 'auto'], active: true },
  { 
    id: 'agra', 
    name: 'Agra', 
    state: 'Uttar Pradesh', 
    lat: 27.1767, 
    lng: 78.0081, 
    services: ['bike', 'auto', 'e_rickshaw'], 
    active: true,
    address: '4 SS/13-16, Sanjay Place, Agra, Uttar Pradesh',
    pincode: '282002',
    landmarkNote: 'Sanjay Place Commercial Complex'
  },
  { 
    id: 'ahmedabad', 
    name: 'Ahmedabad', 
    state: 'Gujarat', 
    lat: 23.0225, 
    lng: 72.5714, 
    services: ['bike', 'auto', 'cab', 'b2b'], 
    active: true,
    address: '301, B-Block, Dev Aurum Commercial Complex, Prahladnagar, Ahmedabad, Gujarat',
    pincode: '380015',
    landmarkNote: 'Near Anand Nagar Cross Road, Prahladnagar'
  },
  { id: 'ajmer', name: 'Ajmer', state: 'Rajasthan', lat: 26.4499, lng: 74.6399, services: ['bike', 'auto'], active: true },
  { 
    id: 'aligarh', 
    name: 'Aligarh', 
    state: 'Uttar Pradesh', 
    lat: 27.8974, 
    lng: 78.0880, 
    services: ['bike', 'auto', 'e_rickshaw'], 
    active: true,
    address: 'House No. 24, Rajyakarmachari Colony, Swarna Jayanti Nagar, Aligarh, Uttar Pradesh',
    pincode: '202001',
    landmarkNote: 'Swarna Jayanti Nagar Commercial Hub'
  },
  { id: 'alwar', name: 'Alwar', state: 'Rajasthan', lat: 27.5530, lng: 76.6346, services: ['bike', 'auto'], active: true },
  { 
    id: 'amritsar', 
    name: 'Amritsar', 
    state: 'Punjab', 
    lat: 31.6340, 
    lng: 74.8723, 
    services: ['bike', 'auto', 'e_rickshaw'], 
    active: true,
    address: 'Building No. 1026, 4th Floor, Dhab Khatikan, Amritsar, Punjab',
    pincode: '143006',
    landmarkNote: 'Near Hindu Sabha College'
  },
  { 
    id: 'anantapur', 
    name: 'Anantapur', 
    state: 'Andhra Pradesh', 
    lat: 14.6819, 
    lng: 77.6006, 
    services: ['bike', 'auto'], 
    active: true,
    address: '#1-29, 1st Road, Revenue Ward No. 1, Anantapur, Andhra Pradesh',
    pincode: '515004',
    landmarkNote: 'Revenue Ward No. 1'
  },
  { 
    id: 'asansol', 
    name: 'Asansol', 
    state: 'West Bengal', 
    lat: 23.6739, 
    lng: 86.9524, 
    services: ['bike', 'auto', 'tuk_tuk'], 
    active: true,
    address: 'Konark Tower, Burnpur Road, Asansol, West Bengal',
    pincode: '713304',
    landmarkNote: 'Opposite Police Line, Burnpur Road'
  },
  { 
    id: 'bangalore', 
    name: 'Bangalore (Bengaluru)', 
    state: 'Karnataka', 
    lat: 12.9716, 
    lng: 77.5946, 
    services: ['bike', 'auto', 'cab', 'b2b'], 
    active: true, 
    address: '613, 1st Main Road, Muneswara Nagar, Sector 6, HSR Layout, Bengaluru, Karnataka (Plus Code: WJ8F+FV3)',
    pincode: '560102',
    landmarkNote: 'Sector 6 HSR Layout Onboarding Hub',
    notes: 'Corporate HQ and regional onboarding centers in HSR Layout and Bellandur',
    additionalOffices: [
      {
        name: 'Roppen Transportation - Corporate Headquarters',
        address: 'Mantri Commercio, Spatium Tower A, Outer Ring Road, Devarabeesanahalli Village, Bengaluru, Karnataka',
        pincode: '560103',
        landmarkNote: 'Opposite Central Mall / Near Bellandur Flyover on Outer Ring Road',
        lat: 12.9279,
        lng: 77.6841
      }
    ]
  },
  { 
    id: 'bareilly', 
    name: 'Bareilly', 
    state: 'Uttar Pradesh', 
    lat: 28.3670, 
    lng: 79.4304, 
    services: ['bike', 'auto', 'e_rickshaw'], 
    active: true,
    address: 'House No. 8, 1st Floor, Janakpuri, Bareilly, Uttar Pradesh',
    pincode: '243001',
    landmarkNote: 'Opposite Gurudwara, Near Sheel Chauraha'
  },
  { id: 'bhagalpur', name: 'Bhagalpur', state: 'Bihar', lat: 25.2425, lng: 86.9842, services: ['bike', 'auto', 'e_rickshaw'], active: true },
  { id: 'bhilai', name: 'Bhilai', state: 'Chhattisgarh', lat: 21.2144, lng: 81.3805, services: ['bike', 'auto'], active: true },
  { 
    id: 'bhopal', 
    name: 'Bhopal', 
    state: 'Madhya Pradesh', 
    lat: 23.2599, 
    lng: 77.4126, 
    services: ['bike', 'auto', 'cab'], 
    active: true,
    address: 'Plot No. 44, FF-07, 2nd Floor, Zone-II, Maharana Pratap Nagar, Bhopal, Madhya Pradesh',
    pincode: '462011',
    landmarkNote: 'Behind Hotel G.K. Palace, MP Nagar Zone-II'
  },
  { 
    id: 'bhubaneswar', 
    name: 'Bhubaneswar', 
    state: 'Odisha', 
    lat: 20.2961, 
    lng: 85.8245, 
    services: ['bike', 'auto', 'cab'], 
    active: true,
    address: 'Plot No. 307/A, District Center, Chandrasekharpur, Bhubaneswar, Khordha, Odisha',
    pincode: '751016',
    landmarkNote: 'Behind Bharat Petrol Pump, Chandrasekharpur'
  },
  { id: 'bikaner', name: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119, services: ['bike', 'auto'], active: true },
  { 
    id: 'bilaspur', 
    name: 'Bilaspur (Chhattisgarh)', 
    state: 'Chhattisgarh', 
    lat: 22.0797, 
    lng: 82.1409, 
    services: ['bike', 'auto'], 
    active: true,
    address: 'R. G. Empire, 2nd Floor, Mannu Chowk, Tikrapara, Bilaspur, Chhattisgarh',
    pincode: '495001',
    landmarkNote: 'Near / Beside Body Line Fitness Gym, Mannu Chowk'
  },
  { id: 'bokaro', name: 'Bokaro Steel City', state: 'Jharkhand', lat: 23.6693, lng: 86.1511, services: ['bike', 'auto'], active: true },
  { 
    id: 'chandigarh', 
    name: 'Chandigarh Tri-City', 
    state: 'Chandigarh', 
    lat: 30.7333, 
    lng: 76.7794, 
    services: ['bike', 'auto', 'cab'], 
    active: true,
    address: 'SCO 272, 1st Floor, Sector 32 D, Chandigarh',
    pincode: '160030',
    landmarkNote: 'Above Punjab & Sind Bank, Sector 32 D Market'
  },
  { 
    id: 'chennai', 
    name: 'Chennai', 
    state: 'Tamil Nadu', 
    lat: 13.0827, 
    lng: 80.2707, 
    services: ['bike', 'auto', 'cab', 'b2b'], 
    active: true,
    address: 'New No. 78, Old No. 34/A, 2nd Floor, Mount Road, Guindy, Chennai, Tamil Nadu',
    pincode: '600032',
    landmarkNote: 'Near Kalse Hotel, Mount Road, Guindy'
  },
  { 
    id: 'coimbatore', 
    name: 'Coimbatore', 
    state: 'Tamil Nadu', 
    lat: 11.0168, 
    lng: 76.9558, 
    services: ['bike', 'auto', 'cab'], 
    active: true,
    address: 'No. 417, 3rd Floor, Senthil Raja Tower, Sathy Road, Ganapathy, Coimbatore, Tamil Nadu',
    pincode: '641006',
    landmarkNote: 'Opposite Hyundai Service Center, Airtel Store Upstairs'
  },
  { 
    id: 'dehradun', 
    name: 'Dehradun', 
    state: 'Uttarakhand', 
    lat: 30.3165, 
    lng: 78.0322, 
    services: ['bike', 'auto'], 
    active: true,
    address: '2nd Floor, Pundir Tower, Nathanpur, Ring Road, Dehradun, Uttarakhand',
    pincode: '248005',
    landmarkNote: 'Opposite Indian Overseas Bank, Nathanpur Ring Road',
    notes: 'Contact: +91 79061 00370'
  },
  { 
    id: 'delhi', 
    name: 'Delhi NCR (Delhi/Noida/Gurugram)', 
    state: 'Delhi NCR', 
    lat: 28.6139, 
    lng: 77.2090, 
    services: ['bike', 'auto', 'cab', 'e_rickshaw', 'b2b'], 
    active: true, 
    address: '61, 3rd Floor, B.P. Marg, Arjun Nagar, Kotla Mubarakpur, New Delhi',
    pincode: '110003',
    landmarkNote: 'South Delhi Hub • Opposite Defence Colony / Near South Extension',
    notes: 'National Capital Region apex hub • Cross-dispatch enabled across Delhi, Noida, and Gurugram',
    clusterId: 'delhi_ncr',
    clusterName: 'Delhi NCR Transit Cluster',
    connectedZoneIds: ['noida', 'gurugram'],
    crossDispatchEnabled: true,
    additionalOffices: [
      {
        name: 'Delhi NCR - Noida Sector 6 Hub',
        address: 'G-13, G Block, Ground Floor, Sector 6, Noida, Gautam Buddha Nagar, Uttar Pradesh',
        pincode: '201301',
        landmarkNote: 'Sector 6 Commercial Hub',
        lat: 28.5985,
        lng: 77.3195
      },
      {
        name: 'Delhi NCR - Gurugram Sector 30 Hub',
        address: 'Plot No. 108, 1st Floor, Vijay Vihar, Silokhra Road, Sector 30, Gurugram, Haryana',
        pincode: '122022',
        landmarkNote: 'Near Star Mall / NH-48 Corridor',
        lat: 28.4601,
        lng: 77.0504
      },
      {
        name: 'Delhi NCR - Gurugram Sector 32 Hub',
        address: 'Plot No. 19, Ground & 1st Floor, Institutional Area, Sector 32, Gurugram, Delhi NCR',
        pincode: '122001',
        landmarkNote: 'Near Rajiv Chowk & Medanta Hospital Corridor',
        lat: 28.4485,
        lng: 77.0425
      }
    ]
  },
  { id: 'dhanbad', name: 'Dhanbad', state: 'Jharkhand', lat: 23.7957, lng: 86.4304, services: ['bike', 'auto'], active: true },
  { id: 'dibrugarh', name: 'Dibrugarh', state: 'Assam', lat: 27.4728, lng: 94.9120, services: ['bike', 'auto'], active: true },
  { id: 'durgapur', name: 'Durgapur', state: 'West Bengal', lat: 23.5204, lng: 87.3119, services: ['bike', 'auto', 'tuk_tuk'], active: true },
  { id: 'eluru', name: 'Eluru', state: 'Andhra Pradesh', lat: 16.7107, lng: 81.0952, services: ['bike', 'auto'], active: true, notes: 'No physical branch office yet • Transit service active' },
  { id: 'erode', name: 'Erode', state: 'Tamil Nadu', lat: 11.3410, lng: 77.7172, services: ['bike', 'auto'], active: true, notes: 'No physical branch office yet • Transit service active' },
  { id: 'gaya', name: 'Gaya', state: 'Bihar', lat: 24.7914, lng: 85.0002, services: ['bike', 'auto', 'e_rickshaw'], active: true },
  { id: 'gorakhpur', name: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7606, lng: 83.3732, services: ['bike', 'auto', 'e_rickshaw'], active: true },
  {
    id: 'guntur',
    name: 'Guntur',
    state: 'Andhra Pradesh',
    lat: 16.3067,
    lng: 80.4365,
    services: ['bike', 'auto'],
    active: true,
    address: 'D.No : 5-50-62, Opp Sitara Apartment, 6/14 Brodipet, Guntur',
    pincode: '522002',
    landmarkNote: 'Opp Sitara Apartment, 6/14 Brodipet',
    clusterId: 'pan_vijayawada',
    clusterName: 'Pan-Vijayawada (VGTM Transit Corridor)',
    parentHubId: 'vijayawada',
    connectedZoneIds: ['vijayawada', 'tadepalli'],
    crossDispatchEnabled: true,
    notes: 'Pan-Vijayawada satellite hub • Direct transit corridor to Vijayawada via NH16'
  },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, services: ['bike', 'auto', 'cab'], active: true },
  { id: 'gwalior', name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828, services: ['bike', 'auto', 'e_rickshaw'], active: true },
  {
    id: 'gurugram',
    name: 'Gurugram / Gurgaon (Delhi NCR)',
    state: 'Haryana',
    lat: 28.4601,
    lng: 77.0504,
    services: ['bike', 'auto', 'cab', 'b2b'],
    active: true,
    address: 'Plot No. 108, 1st Floor, Vijay Vihar, Silokhra Road, Sector 30, Gurugram, Haryana',
    pincode: '122022',
    landmarkNote: 'Silokhra Road, Sector 30 (Near Star Mall / NH-48)',
    notes: 'Cyber City, Golf Course Road, and Sohna Road transit network • Active Serviceable Transit Hub',
    clusterId: 'delhi_ncr',
    clusterName: 'Delhi NCR Transit Cluster',
    parentHubId: 'delhi',
    connectedZoneIds: ['delhi', 'noida'],
    crossDispatchEnabled: true,
    additionalOffices: [
      {
        name: 'Roppen Transportation - Gurugram Sector 32 Hub',
        address: 'Plot No. 19, Ground & 1st Floor, Institutional Area, Sector 32, Gurugram, Delhi NCR',
        pincode: '122001',
        landmarkNote: 'Near Rajiv Chowk & Medanta Hospital Corridor',
        lat: 28.4485,
        lng: 77.0425
      }
    ]
  },
  { 
    id: 'hyderabad', 
    name: 'Hyderabad', 
    state: 'Telangana', 
    lat: 17.3850, 
    lng: 78.4867, 
    services: ['bike', 'auto', 'cab', 'b2b'], 
    active: true, 
    address: '3rd Floor, Sai Prithvi Arcade, Megha Hills, Sri Rama Colony, Madhapur, Hyderabad, Telangana',
    pincode: '500081',
    landmarkNote: 'Near Kavuri Hills junction / Above commercial center',
    notes: 'Registered Office hub in Madhapur • Extensive auto and bike density' 
  },
  {
    id: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    lat: 22.7196,
    lng: 75.8577,
    services: ['bike', 'auto', 'cab', 'b2b'],
    active: true,
    address: '2nd Floor, Northout Building, Plot No. 359, PU4, Scheme No 54, Near Country Inn Hotel, Behind Indian Oil Petrol Pump, Vijay Nagar, Indore, Madhya Pradesh',
    pincode: '452010',
    landmarkNote: 'Near Country Inn Hotel, Behind Indian Oil Petrol Pump, Scheme No 54, Vijay Nagar',
    notes: 'Active commercial hub • Dedicated ground support center in Vijay Nagar'
  },
  { id: 'jabalpur', name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864, services: ['bike', 'auto'], active: true },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    services: ['bike', 'auto', 'cab', 'e_rickshaw'],
    active: true,
    address: '1st Floor, B.L. Tower 2, Paliwal Garden, Mahaveer Nagar, Tonk Road, Jaipur, Rajasthan',
    pincode: '302015',
    landmarkNote: 'Paliwal Garden, Mahaveer Nagar, Tonk Road',
    notes: 'Active apex regional center • Tonk Road corridor hub'
  },
  { id: 'jalandhar', name: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762, services: ['bike', 'auto'], active: true },
  { id: 'jamshedpur', name: 'Jamshedpur', state: 'Jharkhand', lat: 22.8046, lng: 86.2029, services: ['bike', 'auto'], active: true },
  { id: 'jhansi', name: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4484, lng: 78.5685, services: ['bike', 'auto', 'e_rickshaw'], active: true },
  { id: 'jodhpur', name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243, services: ['bike', 'auto'], active: true },
  { id: 'jorhat', name: 'Jorhat', state: 'Assam', lat: 26.7509, lng: 94.2037, services: ['bike', 'auto'], active: true },
  { id: 'kadapa', name: 'Kadapa', state: 'Andhra Pradesh', lat: 14.4673, lng: 78.8242, services: ['bike', 'auto'], active: true },
  {
    id: 'kakinada',
    name: 'Kakinada',
    state: 'Andhra Pradesh',
    lat: 16.9891,
    lng: 82.2475,
    services: ['bike', 'auto'],
    active: true,
    parentHubId: 'rajahmundry',
    notes: 'Active serviceable city • Regional onboarding & support guided to Rajahmundry Hub (Opp Yamaha Service Center, Satyanarayanapuram)'
  },
  {
    id: 'kanpur',
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    lat: 26.4499,
    lng: 80.3319,
    services: ['bike', 'auto', 'e_rickshaw'],
    active: true,
    address: '127/92 Z1, Hemant Vihar, Near Joi Point, Sachan Chauraha, Barra, Kanpur, Uttar Pradesh',
    pincode: '208027',
    landmarkNote: 'Near Joi Point, Sachan Chauraha, Barra',
    notes: 'Active major industrial transit hub • Ground support center in Barra'
  },
  { id: 'karimnagar', name: 'Karimnagar', state: 'Telangana', lat: 18.4386, lng: 79.1288, services: ['bike', 'auto'], active: true },
  { id: 'karnal', name: 'Karnal', state: 'Haryana', lat: 29.6857, lng: 76.9905, services: ['bike', 'auto'], active: true },
  { id: 'khammam', name: 'Khammam', state: 'Telangana', lat: 17.2473, lng: 80.1514, services: ['bike', 'auto'], active: true },
  {
    id: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    lat: 9.9312,
    lng: 76.2673,
    services: ['bike', 'auto', 'cab', 'b2b'],
    active: true,
    address: '2nd Floor, Sastha Temple Rd, above Motoguard, Kaloor, Ernakulam, Kochi, Kerala',
    pincode: '682018',
    landmarkNote: 'Above Motoguard, Sastha Temple Rd, Kaloor',
    notes: 'Active metropolitan hub • Kaloor support center'
  },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, services: ['bike', 'auto', 'cab', 'b2b', 'tuk_tuk'], active: true },
  { id: 'kota', name: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648, services: ['bike', 'auto'], active: true },
  { id: 'kurnool', name: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lng: 78.0373, services: ['bike', 'auto'], active: true },
  { id: 'kurukshetra', name: 'Kurukshetra', state: 'Haryana', lat: 29.9695, lng: 76.8783, services: ['bike', 'auto'], active: true },
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.8467,
    lng: 80.9462,
    services: ['bike', 'auto', 'cab', 'e_rickshaw', 'b2b'],
    active: true,
    address: 'CP-162, 3rd Floor, Ashok Raj Tower, Sec D1, Near Power House Chauraha and back side of Emerald Mall, Ashiyana, Lucknow, Uttar Pradesh',
    pincode: '226012',
    landmarkNote: 'Near Power House Chauraha and back side of Emerald Mall, Ashiyana',
    notes: 'Active capital regional hub • Ashiyana support center'
  },
  { id: 'ludhiana', name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573, services: ['bike', 'auto'], active: true },
  {
    id: 'madurai',
    name: 'Madurai',
    state: 'Tamil Nadu',
    lat: 9.9252,
    lng: 78.1198,
    services: ['bike', 'auto'],
    active: true,
    address: '1st Floor, DK Plaza, Opp to Sai Opticals, Near Master Chef Hotel, North Gate Road, Mahaboopalayam, Madurai, Tamil Nadu',
    pincode: '625016',
    landmarkNote: 'Opp to Sai Opticals, Near Master Chef Hotel, North Gate Road, Mahaboopalayam',
    notes: 'Active southern Tamil Nadu hub • Mahaboopalayam support center'
  },
  { id: 'mangalore', name: 'Mangalore (Mangaluru)', state: 'Karnataka', lat: 12.9141, lng: 74.8560, services: ['bike', 'auto', 'cab'], active: true },
  { id: 'mathura', name: 'Mathura', state: 'Uttar Pradesh', lat: 27.4924, lng: 77.6737, services: ['bike', 'auto', 'e_rickshaw'], active: true },
  { id: 'meerut', name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064, services: ['bike', 'auto', 'e_rickshaw'], active: true },
  { id: 'moradabad', name: 'Moradabad', state: 'Uttar Pradesh', lat: 28.8386, lng: 78.7733, services: ['bike', 'auto', 'e_rickshaw'], active: true },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, services: ['auto', 'cab', 'b2b'], active: true },
  { id: 'muzaffarpur', name: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lng: 85.3647, services: ['bike', 'auto', 'e_rickshaw'], active: true },
  { id: 'mysore', name: 'Mysore (Mysuru)', state: 'Karnataka', lat: 12.2958, lng: 76.6394, services: ['bike', 'auto', 'b2b'], active: true },
  { id: 'nagpur', name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, services: ['bike', 'auto', 'cab'], active: true },
  { id: 'nandyala', name: 'Nandyala', state: 'Andhra Pradesh', lat: 15.4875, lng: 78.4836, services: ['bike', 'auto'], active: true },
  {
    id: 'nellore',
    name: 'Nellore',
    state: 'Andhra Pradesh',
    lat: 14.4426,
    lng: 79.9865,
    services: ['bike', 'auto'],
    active: true,
    address: '27-1-422, Balaji Nagar, Beside Swami Doss School, Nellore, Andhra Pradesh',
    pincode: '524002',
    landmarkNote: 'Beside Swami Doss School, Balaji Nagar',
    notes: 'Active serviceable city • Verified local onboarding & support center'
  },
  {
    id: 'noida',
    name: 'Noida (Delhi NCR)',
    state: 'Uttar Pradesh',
    lat: 28.5985,
    lng: 77.3195,
    services: ['bike', 'auto', 'cab', 'b2b'],
    active: true,
    address: 'G-13, G Block, Ground Floor, Sector 6, Noida, Gautam Buddha Nagar, Uttar Pradesh',
    pincode: '201301',
    landmarkNote: 'Sector 6 Commercial Hub • Active Serviceable Transit Hub',
    notes: 'Noida-Greater Noida Expressway, Sector 62, and DND transit network',
    clusterId: 'delhi_ncr',
    clusterName: 'Delhi NCR Transit Cluster',
    parentHubId: 'delhi',
    connectedZoneIds: ['delhi', 'gurugram'],
    crossDispatchEnabled: true
  },
  { id: 'ongole', name: 'Ongole', state: 'Andhra Pradesh', lat: 15.5057, lng: 80.0499, services: ['bike', 'auto'], active: true, notes: 'No physical branch office yet • Transit service active' },
  { id: 'patiala', name: 'Patiala', state: 'Punjab', lat: 30.3398, lng: 76.3869, services: ['bike', 'auto'], active: true },
  { id: 'patna', name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, services: ['bike', 'auto', 'e_rickshaw', 'tuk_tuk'], active: true },
  { id: 'prayagraj', name: 'Prayagraj (Allahabad)', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463, services: ['bike', 'auto', 'e_rickshaw'], active: true },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, services: ['bike', 'auto', 'cab', 'b2b'], active: true },
  { id: 'raipur', name: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, services: ['bike', 'auto'], active: true },
  {
    id: 'rajahmundry',
    name: 'Rajahmundry',
    state: 'Andhra Pradesh',
    lat: 17.0005,
    lng: 81.8040,
    services: ['bike', 'auto'],
    active: true,
    address: 'Flat No: 39, 1st Floor, Opp Yamaha Service Center, Satyanarayanapuram, near VL Puram, Rajahmundry, Andhra Pradesh',
    pincode: '533106',
    landmarkNote: 'Opp Yamaha Service Center, Satyanarayanapuram, near VL Puram',
    connectedZoneIds: ['kakinada'],
    notes: 'Regional operational hub servicing East Godavari corridor and Kakinada transit fleet'
  },
  {
    id: 'rajkot',
    name: 'Rajkot',
    state: 'Gujarat',
    lat: 22.3039,
    lng: 70.8022,
    services: ['bike', 'auto'],
    active: true,
    address: 'Office No 533, 5th Floor, The City Centre, Near Amrapali Under Bridge and Tata Westside, Raiya Road, Rajkot, Gujarat',
    pincode: '360007',
    landmarkNote: 'Near Amrapali Under Bridge and Tata Westside, Raiya Road',
    notes: 'Active Saurashtra commercial hub • Raiya Road support center'
  },
  {
    id: 'ramagundam',
    name: 'Ramagundam',
    state: 'Telangana',
    lat: 18.7551,
    lng: 79.4740,
    services: ['bike', 'auto'],
    active: true,
    notes: 'No physical branch office yet • Transit service active'
  },
  { id: 'ranchi', name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, services: ['bike', 'auto', 'cab'], active: true },
  { id: 'rohtak', name: 'Rohtak', state: 'Haryana', lat: 28.8955, lng: 76.6066, services: ['bike', 'auto'], active: true },
  { id: 'rourkela', name: 'Rourkela', state: 'Odisha', lat: 22.2604, lng: 84.8536, services: ['bike', 'auto'], active: true },
  { id: 'sagar', name: 'Sagar', state: 'Madhya Pradesh', lat: 23.8388, lng: 78.7378, services: ['bike', 'auto'], active: true },
  { id: 'saharanpur', name: 'Saharanpur', state: 'Uttar Pradesh', lat: 29.9678, lng: 77.5510, services: ['bike', 'auto'], active: true },
  { id: 'salem', name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460, services: ['bike', 'auto'], active: true },
  { id: 'sambalpur', name: 'Sambalpur', state: 'Odisha', lat: 21.4669, lng: 83.9812, services: ['bike', 'auto'], active: true },
  { id: 'shillong', name: 'Shillong', state: 'Meghalaya', lat: 25.5788, lng: 91.8933, services: ['bike', 'auto'], active: true },
  {
    id: 'siddipet',
    name: 'Siddipet',
    state: 'Telangana',
    lat: 18.1018,
    lng: 78.8520,
    services: ['bike', 'auto'],
    active: true,
    notes: 'No physical branch office yet • Transit service active'
  },
  { id: 'siliguri', name: 'Siliguri', state: 'West Bengal', lat: 26.7271, lng: 88.3953, services: ['bike', 'auto', 'tuk_tuk'], active: true },
  {
    id: 'surat',
    name: 'Surat',
    state: 'Gujarat',
    lat: 21.1702,
    lng: 72.8311,
    services: ['bike', 'auto', 'cab'],
    active: true,
    address: '1st Floor, Shree Kuberji Complex, Athugar Street, Nanpura Main Road, Plot 828/829, Surat, Gujarat',
    pincode: '395001',
    landmarkNote: 'Athugar Street, Nanpura Main Road, Plot 828/829',
    notes: 'Active South Gujarat apex hub • Nanpura support center'
  },
  {
    id: 'suryapet',
    name: 'Suryapet',
    state: 'Telangana',
    lat: 17.1439,
    lng: 79.6239,
    services: ['bike', 'auto'],
    active: true,
    notes: 'No physical branch office yet • Transit service active'
  },
  { id: 'tezpur', name: 'Tezpur', state: 'Assam', lat: 26.6528, lng: 92.7926, services: ['bike', 'auto'], active: true },
  {
    id: 'tirupati',
    name: 'Tirupati',
    state: 'Andhra Pradesh',
    lat: 13.6288,
    lng: 79.4192,
    services: ['bike', 'auto'],
    active: true,
    address: '18-1-25/2, Shanthi Nagar, NGO Colony, Opp SBI Bank, KT Road, Tirupati, Andhra Pradesh',
    pincode: '517501',
    landmarkNote: 'Opp SBI Bank, KT Road, NGO Colony',
    notes: 'Active serviceable city • Dedicated ground support center'
  },
  { id: 'trichy', name: 'Tiruchirappalli (Trichy)', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047, services: ['bike', 'auto'], active: true },
  {
    id: 'trivandrum',
    name: 'Thiruvananthapuram (Trivandrum)',
    state: 'Kerala',
    lat: 8.5241,
    lng: 76.9366,
    services: ['bike', 'auto', 'cab'],
    active: true,
    address: 'TC 28/633(2), 2nd Floor, Suganth Building, Gandhi Bhavan Rd, near Swathi Thirunal Music College, Thycaud, Thiruvananthapuram, Kerala',
    pincode: '695014',
    landmarkNote: 'Near Swathi Thirunal Music College, Gandhi Bhavan Rd, Thycaud',
    notes: 'Active capital regional hub • Thycaud support center'
  },
  { id: 'udaipur', name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, services: ['bike', 'auto'], active: true },
  { id: 'ujjain', name: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885, services: ['bike', 'auto'], active: true },
  { id: 'vadodara', name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812, services: ['bike', 'auto'], active: true },
  { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, services: ['bike', 'auto', 'e_rickshaw', 'tuk_tuk'], active: true },
  {
    id: 'vijayawada',
    name: 'Vijayawada',
    state: 'Andhra Pradesh',
    lat: 16.5062,
    lng: 80.6480,
    services: ['bike', 'auto', 'cab'],
    active: true,
    rapidoCityCode: '5a5f6f431635168040c9a162',
    address: 'D.No: 48-11/2-10A, Shakamuri Shivayya Starlet, 5th Left 2nd Building, Opposite KR Academy, Currency Nagar Main Road, Vijayawada, Andhra Pradesh',
    pincode: '520008',
    landmarkNote: 'Opposite KR Academy, Currency Nagar Main Road',
    clusterId: 'pan_vijayawada',
    clusterName: 'Pan-Vijayawada (VGTM Transit Corridor)',
    connectedZoneIds: ['guntur', 'tadepalli'],
    crossDispatchEnabled: true,
    notes: 'VGTM Metropolitan Corridor primary hub • Currency Nagar regional center'
  },
  { id: 'vishakapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, services: ['bike', 'auto', 'cab', 'b2b'], active: true },
  {
    id: 'warangal',
    name: 'Warangal',
    state: 'Telangana',
    lat: 17.9689,
    lng: 79.5941,
    services: ['bike', 'auto', 'b2b'],
    active: true,
    address: 'Shop No 10, 2nd Floor, Mothilal Shopping Plaza, Vijaya Theater Road, Chowrasta, Hanamkonda, Warangal, Telangana',
    pincode: '506015',
    landmarkNote: 'Vijaya Theater Road, Chowrasta, Mothilal Shopping Plaza, Hanamkonda',
    notes: 'Active regional hub serving Warangal & Hanamkonda twin city urban area'
  },
  {
    id: 'tadepalli',
    name: 'Tadepalli (Guntur)',
    state: 'Andhra Pradesh',
    lat: 16.4815,
    lng: 80.6050,
    services: ['bike', 'auto'],
    active: true,
    clusterId: 'pan_vijayawada',
    clusterName: 'Pan-Vijayawada (VGTM Transit Corridor)',
    parentHubId: 'vijayawada',
    isSubDistrict: true,
    connectedZoneIds: ['vijayawada', 'guntur'],
    crossDispatchEnabled: true,
    notes: 'Krishna river transit corridor municipality bridging Vijayawada & Guntur • Dual-hub dispatch eligibility'
  },
  {
    id: 'narayanpet',
    name: 'Narayanpet (Telangana)',
    state: 'Telangana',
    lat: 16.7324,
    lng: 77.4984,
    services: ['bike', 'auto'],
    active: true,
    clusterId: 'pan_hyderabad',
    clusterName: 'Hyderabad Southern Regional Transit Cluster',
    parentHubId: 'hyderabad',
    isSubDistrict: true,
    connectedZoneIds: ['hyderabad'],
    crossDispatchEnabled: true,
    notes: 'District headquarters linked to Mahbubnagar / Hyderabad regional corridor'
  },
  {
    id: 'parvathipuram',
    name: 'Parvathipuram (Andhra Pradesh)',
    state: 'Andhra Pradesh',
    lat: 18.7758,
    lng: 83.4278,
    services: ['bike', 'auto'],
    active: true,
    clusterId: 'north_coastal_ap',
    clusterName: 'North Coastal AP Transit Cluster',
    parentHubId: 'vishakapatnam',
    isSubDistrict: true,
    connectedZoneIds: ['vishakapatnam'],
    crossDispatchEnabled: true,
    notes: 'Manyam district headquarters connected via Vizianagaram / Visakhapatnam transit spine'
  }
];
