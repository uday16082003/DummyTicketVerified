export type Airport = {
  city: string;
  country: string;
  airport: string;
  iata: string;
};

export const AIRPORTS: Airport[] = [
  { city: "New Delhi", country: "India", airport: "Indira Gandhi International", iata: "DEL" },
  { city: "Mumbai", country: "India", airport: "Chhatrapati Shivaji Maharaj International", iata: "BOM" },
  { city: "Bengaluru", country: "India", airport: "Kempegowda International", iata: "BLR" },
  { city: "Chennai", country: "India", airport: "Chennai International", iata: "MAA" },
  { city: "Hyderabad", country: "India", airport: "Rajiv Gandhi International", iata: "HYD" },
  { city: "Kolkata", country: "India", airport: "Netaji Subhas Chandra Bose International", iata: "CCU" },
  { city: "Ahmedabad", country: "India", airport: "Sardar Vallabhbhai Patel International", iata: "AMD" },
  { city: "Kochi", country: "India", airport: "Cochin International", iata: "COK" },
  { city: "Goa", country: "India", airport: "Manohar International", iata: "GOX" },
  { city: "Jaipur", country: "India", airport: "Jaipur International", iata: "JAI" },
  { city: "Lucknow", country: "India", airport: "Chaudhary Charan Singh International", iata: "LKO" },
  { city: "Dubai", country: "United Arab Emirates", airport: "Dubai International", iata: "DXB" },
  { city: "Abu Dhabi", country: "United Arab Emirates", airport: "Zayed International", iata: "AUH" },
  { city: "Sharjah", country: "United Arab Emirates", airport: "Sharjah International", iata: "SHJ" },
  { city: "Doha", country: "Qatar", airport: "Hamad International", iata: "DOH" },
  { city: "Riyadh", country: "Saudi Arabia", airport: "King Khalid International", iata: "RUH" },
  { city: "Jeddah", country: "Saudi Arabia", airport: "King Abdulaziz International", iata: "JED" },
  { city: "Kuwait City", country: "Kuwait", airport: "Kuwait International", iata: "KWI" },
  { city: "Muscat", country: "Oman", airport: "Muscat International", iata: "MCT" },
  { city: "Manama", country: "Bahrain", airport: "Bahrain International", iata: "BAH" },
  { city: "London", country: "United Kingdom", airport: "Heathrow", iata: "LHR" },
  { city: "London", country: "United Kingdom", airport: "Gatwick", iata: "LGW" },
  { city: "Manchester", country: "United Kingdom", airport: "Manchester Airport", iata: "MAN" },
  { city: "Paris", country: "France", airport: "Charles de Gaulle", iata: "CDG" },
  { city: "Frankfurt", country: "Germany", airport: "Frankfurt Airport", iata: "FRA" },
  { city: "Amsterdam", country: "Netherlands", airport: "Schiphol", iata: "AMS" },
  { city: "Rome", country: "Italy", airport: "Fiumicino", iata: "FCO" },
  { city: "Madrid", country: "Spain", airport: "Adolfo Suárez Madrid–Barajas", iata: "MAD" },
  { city: "Zurich", country: "Switzerland", airport: "Zurich Airport", iata: "ZRH" },
  { city: "Istanbul", country: "Turkey", airport: "Istanbul Airport", iata: "IST" },
  { city: "Singapore", country: "Singapore", airport: "Changi", iata: "SIN" },
  { city: "Bangkok", country: "Thailand", airport: "Suvarnabhumi", iata: "BKK" },
  { city: "Hong Kong", country: "Hong Kong", airport: "Hong Kong International", iata: "HKG" },
  { city: "Tokyo", country: "Japan", airport: "Haneda", iata: "HND" },
  { city: "Tokyo", country: "Japan", airport: "Narita International", iata: "NRT" },
  { city: "Seoul", country: "South Korea", airport: "Incheon International", iata: "ICN" },
  { city: "Beijing", country: "China", airport: "Capital International", iata: "PEK" },
  { city: "Shanghai", country: "China", airport: "Pudong International", iata: "PVG" },
  { city: "Sydney", country: "Australia", airport: "Kingsford Smith", iata: "SYD" },
  { city: "Melbourne", country: "Australia", airport: "Melbourne Airport", iata: "MEL" },
  { city: "Auckland", country: "New Zealand", airport: "Auckland Airport", iata: "AKL" },
  { city: "New York", country: "United States", airport: "John F. Kennedy International", iata: "JFK" },
  { city: "New York", country: "United States", airport: "Newark Liberty International", iata: "EWR" },
  { city: "Los Angeles", country: "United States", airport: "Los Angeles International", iata: "LAX" },
  { city: "San Francisco", country: "United States", airport: "San Francisco International", iata: "SFO" },
  { city: "Chicago", country: "United States", airport: "O'Hare International", iata: "ORD" },
  { city: "Miami", country: "United States", airport: "Miami International", iata: "MIA" },
  { city: "Toronto", country: "Canada", airport: "Pearson International", iata: "YYZ" },
  { city: "Vancouver", country: "Canada", airport: "Vancouver International", iata: "YVR" },
  { city: "Cairo", country: "Egypt", airport: "Cairo International", iata: "CAI" },
  { city: "Johannesburg", country: "South Africa", airport: "O. R. Tambo International", iata: "JNB" },
  { city: "Nairobi", country: "Kenya", airport: "Jomo Kenyatta International", iata: "NBO" },
  { city: "Colombo", country: "Sri Lanka", airport: "Bandaranaike International", iata: "CMB" },
  { city: "Kathmandu", country: "Nepal", airport: "Tribhuvan International", iata: "KTM" },
  { city: "Dhaka", country: "Bangladesh", airport: "Hazrat Shahjalal International", iata: "DAC" },
  { city: "Karachi", country: "Pakistan", airport: "Jinnah International", iata: "KHI" },
  { city: "Lahore", country: "Pakistan", airport: "Allama Iqbal International", iata: "LHE" },
  { city: "Adelaide", country: "Australia", airport: "Adelaide Airport", iata: "ADL" },
  { city: "Philadelphia", country: "United States", airport: "Philadelphia International", iata: "PHL" },
  { city: "Luxembourg", country: "Luxembourg", airport: "Luxembourg Airport", iata: "LUX" },
  { city: "Guadeloupe", country: "Guadeloupe", airport: "Pointe-à-Pitre International", iata: "PTP" },
];

export function formatAirportLabel(airport: Airport): string {
  return `${airport.city}, ${airport.country} (${airport.iata})`;
}

export function searchAirports(query: string, limit = 8): Airport[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return AIRPORTS.filter((airport) => {
    const haystack = [
      airport.city,
      airport.country,
      airport.airport,
      airport.iata,
      formatAirportLabel(airport),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  }).slice(0, limit);
}
