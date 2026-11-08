export interface CityOffice {
  id: string;
  name: string;
  legalEntity: string;
  cin: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  lat: number;
  lng: number;
  timing: string;
  type: 'registered_office' | 'corporate_office';
  distance?: number;
  statutorySource: string;
}

/**
 * Legally verified Roppen Transportation Services Private Limited (Rapido) offices
 * strictly adhering to statutory MCA and CIN filings.
 */
export const ROPPEN_STATUTORY_OFFICES: CityOffice[] = [
  {
    id: 'roppen-registered-hyd',
    name: 'Roppen Transportation Services - Registered Office',
    legalEntity: 'Roppen Transportation Services Private Limited',
    cin: 'U52210TG2015PTC097115',
    city: 'Hyderabad',
    state: 'Telangana',
    address: '3rd Floor, Sai Prithvi Arcade, Megha Hills, Sri Rama Colony, Madhapur (Near Kavuri Hills), Hyderabad',
    pincode: '500081',
    lat: 17.4435,
    lng: 78.3888,
    timing: '10:00 AM - 6:30 PM (Mon-Sat)',
    type: 'registered_office',
    statutorySource: 'Ministry of Corporate Affairs (MCA) Registered Office'
  },
  {
    id: 'roppen-corporate-blr',
    name: 'Roppen Transportation Services - Corporate Headquarters',
    legalEntity: 'Roppen Transportation Services Private Limited',
    cin: 'U52210TG2015PTC097115',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'Mantri Commercio, Spatium Tower A, Sy No 51/2, 51/3, 51/4, Devarabeesanahalli Village, Outer Ring Road, Bengaluru',
    pincode: '560103',
    lat: 12.9279,
    lng: 77.6841,
    timing: '09:30 AM - 6:00 PM (Mon-Fri)',
    type: 'corporate_office',
    statutorySource: 'Roppen Transportation Principal Corporate Office'
  }
];
