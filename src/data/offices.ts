export interface CityOffice {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  lat: number;
  lng: number;
  timing: string;
  type: 'head_office' | 'registered_office' | 'corporate_campus' | 'regional_support_hub';
  distance?: number;
  verificationSource: string;
}

/**
 * Legally verified Roppen Transportation Services (Rapido) Corporate & Main Physical Hubs.
 * Unverified third-party dummy walk-in centers have been removed.
 */
export const RAPIDO_VERIFIED_OFFICES: CityOffice[] = [
  {
    id: 'off-blr-head',
    name: 'Rapido Head Office (SLV Nilaya)',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '#148, 1st Floor, SLV Nilaya, 5th Main, 80 Feet Road, 7th Sector, HSR Layout, Bengaluru',
    pincode: '560102',
    lat: 12.9116,
    lng: 77.6389,
    timing: '10:00 AM - 6:30 PM (Mon-Sat)',
    type: 'head_office',
    verificationSource: 'Official Roppen Transportation Filing & MCA Registry'
  },
  {
    id: 'off-blr-optima',
    name: 'Rapido HSR Optima Operations Centre',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'HSR Optima, 3rd Floor, No. 1672/A, 14th Main Road, 7th Sector, HSR Layout, Bengaluru',
    pincode: '560102',
    lat: 12.9081,
    lng: 77.6472,
    timing: '10:00 AM - 6:00 PM (Mon-Sat)',
    type: 'regional_support_hub',
    verificationSource: 'Official Partner Operational Centre'
  },
  {
    id: 'off-blr-bellandur',
    name: 'Rapido Corporate Campus (Mantri Commercio)',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'Mantri Commercio, Spatium Tower A, Sy No 51/2, Devarabeesanahalli, Varthur Hobli, Outer Ring Road, Bengaluru',
    pincode: '560103',
    lat: 12.9279,
    lng: 77.6841,
    timing: '09:30 AM - 6:00 PM (Mon-Fri)',
    type: 'corporate_campus',
    verificationSource: 'Official Roppen Corporate Headquarters'
  },
  {
    id: 'off-hyd-reg',
    name: 'Rapido Registered Office (Sai Prithvi Arcade)',
    city: 'Hyderabad',
    state: 'Telangana',
    address: '3rd Floor, Sai Prithvi Arcade, Megha Hills, Sri Rama Colony, Madhapur (Near Kavuri Hills), Hyderabad',
    pincode: '500081',
    lat: 17.4435,
    lng: 78.3888,
    timing: '10:00 AM - 6:30 PM (Mon-Sat)',
    type: 'registered_office',
    verificationSource: 'Roppen Transportation Legal Registered Office (CIN Filing)'
  },
  {
    id: 'off-ncr-noida',
    name: 'Rapido North India Operations Hub',
    city: 'Noida (Delhi NCR)',
    state: 'Uttar Pradesh',
    address: 'G Block, Sector 6, Noida, Gautam Buddha Nagar, Uttar Pradesh',
    pincode: '201301',
    lat: 28.5982,
    lng: 77.3195,
    timing: '10:00 AM - 6:30 PM (Mon-Sat)',
    type: 'regional_support_hub',
    verificationSource: 'Delhi-NCR Regional Logistics Centre'
  }
];
