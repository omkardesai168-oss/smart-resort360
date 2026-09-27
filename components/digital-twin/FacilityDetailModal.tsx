"use client";

import React from 'react';
import { 
  X, Waves, Sparkles, Dumbbell, Utensils, Building2, 
  Car, Compass, Coffee, ShieldCheck, Thermometer, Users, Activity
} from 'lucide-react';

export interface Facility {
  id: string;
  name: string;
  category: string;
  location: string;
  status: 'Open' | 'Busy' | 'Maintenance' | 'Closed';
  occupancy: number; // percentage
  temperature?: string;
  airQuality?: string;
  waterQuality?: string;
  image: string;
  description: string;
  highlights: string[];
  aiRecommendation: string;
}

export const RESORT_FACILITIES: Facility[] = [
  {
    id: 'fac-pool',
    name: 'Infinity Pool & Sun Deck',
    category: 'Aquatics & Leisure',
    location: 'Ground Level — Central Terrace',
    status: 'Open',
    occupancy: 68,
    waterQuality: '99.4% (pH 7.4 • Chlorine 1.8ppm)',
    temperature: '28°C / 82°F Heated',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    description: '100-meter heated infinity pool overlooking the gardens with sunken pool bar and 40 luxury lounge cabanas.',
    highlights: ['Poolside Beverage Service', 'Underwater Sound System', 'Children’s Shallow Lagoon', 'Towel Service Desk'],
    aiRecommendation: 'Demand peak expected at 4:30 PM. Dispatch 2 extra pool servers and trigger automatic shade canopy deployment.'
  },
  {
    id: 'fac-spa',
    name: 'Lotus Wellness Spa & Hydrotherapy',
    category: 'Wellness & Beauty',
    location: 'Floor 1 — West Wing',
    status: 'Open',
    occupancy: 45,
    temperature: '24°C / 75°F Ambient',
    airQuality: 'Aroma Infused • Essential Oils 99% Clean',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'World-class spa featuring 12 treatment suites, herbal steam room, Himalayan salt sauna, and cold plunge pools.',
    highlights: ['Aromatherapy Massages', 'Facial & Skin Rejuvenation', 'Private Couple Suites', 'Herbal Tea Lounge'],
    aiRecommendation: '3 afternoon slots available for cross-selling to high-value guests on Floor 9 & 10 suites.'
  },
  {
    id: 'fac-gym',
    name: 'Pulse Fitness Center & Yoga Studio',
    category: 'Health & Fitness',
    location: 'Floor 1 — East Wing',
    status: 'Open',
    occupancy: 32,
    temperature: '21°C / 70°F Climate Controlled',
    airQuality: 'HEPA Filtered • 100% Fresh Air Flow',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    description: 'State-of-the-art gym with Technogym smart cardio equipment, free weights, personal trainers, and panoramic garden views.',
    highlights: ['24/7 Keycard Access', 'Personal Training', 'Yoga & Pilates Pavilion', 'Fresh Protein Smoothie Bar'],
    aiRecommendation: 'Equipment health optimal (98%). Peak workout hours projected at 7:00 AM - 9:00 AM.'
  },
  {
    id: 'fac-restaurant',
    name: 'The Azure Grand Dining & Bar',
    category: 'Fine Dining & Culinary',
    location: 'Floor 1 — Main Courtyard',
    status: 'Open',
    occupancy: 82,
    temperature: '23°C / 73°F',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    description: 'Michelin-starred signature restaurant offering organic farm-to-table coastal cuisine, wine cellar, and live acoustic music.',
    highlights: ['Buffet & A la Carte', '500+ Vintage Wine Cellar', 'Private Chef Tables', 'Alfresco Terrace Dining'],
    aiRecommendation: 'Dinner reservations at 88% capacity. Recommend alerting arriving VIP guests for early table reservations.'
  },
  {
    id: 'fac-rooftop',
    name: 'SkyLine Sunset Lounge & Helipad',
    category: 'Entertainment & Nightlife',
    location: 'Floor 10 — Rooftop Terrace',
    status: 'Open',
    occupancy: 55,
    temperature: '22°C Evening Breeze',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    description: 'Rooftop cocktail bar featuring panoramic 360° sunset views, infinity edge fire pits, resident DJ, and VIP lounge pods.',
    highlights: ['Craft Mixology Cocktails', '360° Panoramic Views', 'VIP Fire Pit Cabanas', 'Private Helipad Access'],
    aiRecommendation: 'Sunset Golden Hour starts at 6:15 PM. Fire pits automatically scheduled to ignite at 6:00 PM.'
  },
  {
    id: 'fac-lobby',
    name: 'Grand Reception & Atrium Lobby',
    category: 'Guest Services',
    location: 'Floor 1 — Entrance',
    status: 'Open',
    occupancy: 40,
    temperature: '23°C / 73°F',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    description: 'Soaking in natural light with a 4-story glass atrium, marble reception desk, concierge lounge, and valet service.',
    highlights: ['Express AI Check-In Desks', '24/7 Concierge', 'Luggage Valet', 'Welcome Drink Bar'],
    aiRecommendation: 'Next check-in wave expected in 20 minutes (14 guest arrivals). All 3 reception agents on standby.'
  },
  {
    id: 'fac-conference',
    name: 'Grand Ballroom & Conference Hub',
    category: 'Events & Business',
    location: 'Floor 1 — Conference Wing',
    status: 'Busy',
    occupancy: 90,
    temperature: '22°C',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    description: 'Multi-functional event hall accommodating up to 600 guests for corporate summits, galas, and wedding receptions.',
    highlights: ['4K Video Walls', 'Translation Booths', 'High-Speed Mesh Wi-Fi', 'Executive Catering'],
    aiRecommendation: 'Global Tech Leadership Conference active. Coffee break scheduled at 3:30 PM (Kitchen alerted).'
  },
  {
    id: 'fac-parking',
    name: 'Underground Valet & EV Charging Station',
    category: 'Transportation & Logistics',
    location: 'Basement Levels B1-B2',
    status: 'Open',
    occupancy: 64,
    temperature: '20°C Mechanical Ventilation',
    image: 'https://images.unsplash.com/photo-1506521782020-18925f44c05b?auto=format&fit=crop&w=800&q=80',
    description: 'Secure multi-level parking garage equipped with 16 Tesla & Universal EV fast charging stations and 24/7 valet service.',
    highlights: ['16 Fast EV Chargers', 'Automated License Recognition', '24/7 Surveillance', 'Valet Retrieval in < 3 mins'],
    aiRecommendation: '4 EV charging bays currently available. 2 VIP guest vehicles currently charging.'
  }
];

export const FacilityDetailModal: React.FC<{
  facility: Facility | null;
  onClose: () => void;
}> = ({ facility, onClose }) => {
  if (!facility) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl glass-panel border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
              {facility.category}
            </span>
            <h3 className="text-xl font-black text-white glow-text">
              {facility.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {facility.location}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Facility Banner Image */}
        <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-800 my-4">
          <img 
            src={facility.image} 
            alt={facility.name}
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Status: {facility.status}
          </div>

          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-slate-200 border border-slate-700">
            Occupancy: <span className="text-amber-400 font-mono">{facility.occupancy}%</span>
          </div>
        </div>

        {/* Real-time Telemetry Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {facility.temperature && (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Environment Temp</span>
                <span className="text-xs font-bold text-slate-200">{facility.temperature}</span>
              </div>
            </div>
          )}

          {facility.waterQuality && (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <Waves className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Water Quality Index</span>
                <span className="text-xs font-bold text-cyan-300">{facility.waterQuality}</span>
              </div>
            </div>
          )}

          {facility.airQuality && (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <Activity className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Air Filtration</span>
                <span className="text-xs font-bold text-emerald-300">{facility.airQuality}</span>
              </div>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-400" />
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Current Activity</span>
              <span className="text-xs font-bold text-purple-300">{facility.occupancy > 70 ? 'High Footfall' : 'Normal Flow'}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {facility.description}
        </p>

        {/* Highlights */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Amenities & Services</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {facility.highlights.map((h, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span className="truncate">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Operational Recommendation Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-500/40 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0 animate-pulse" />
          <div>
            <span className="text-xs font-bold text-blue-300 block mb-0.5">AI Operations Recommendation</span>
            <p className="text-xs text-slate-300 leading-normal">{facility.aiRecommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
