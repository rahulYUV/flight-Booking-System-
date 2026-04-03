import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import heroBg from './assets/flights_5.svg';

const API = 'http://localhost:5000/api';

// ─── ICONS (inline SVG, no emojis) ───────────────────────────────────────────
const PlaneTakeoffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22h20"/><path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1 3.4 3.07 6.57-1.94L14 8l1.91.57a2 2 0 0 1 .93 3.04l-6.49 8.37"/>
  </svg>
);
const PlaneLandIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22h20"/><path d="M3.77 10.77 2 9l2-4.5 1.1.55a2 2 0 0 1 1 1.63l.01.8 3.4 3.4 6.56-1.94.2.4a2 2 0 0 1-.63 2.59l-7.23 4.47L8 12l-4.23-1.23z"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const ArrowRightLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const ChevronIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const HeadphonesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);
const TagIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/>
  </svg>
);
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const PlaneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2 3.5 6.5l7 3-2 3-4-1-1.3 1.3 4 2 2 4 1.3-1.3-1-4 3-2 3 7z"/>
  </svg>
);
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const BaggageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="6" width="18" height="14" rx="2"/><path d="M7 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>
  </svg>
);
const BriefcaseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
const HelpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const AlertCircleIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/>
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

// ─── TYPES ─────────────────────────────────────────────────────────────────────
type View = 'home' | 'booking' | 'routes' | 'login' | 'signup';
interface Flight {
  _id: string;
  flightNumber: string;
  airline: string;
  airlineLogo: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  price: number;
  availableSeats: number;
  stops: number;
  cabinClass: string;
  amenities: string[];
  isRefundable: boolean;
  status: 'Scheduled' | 'Delayed' | 'Cancelled';
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const formatTime = (dt: string) => {
  const d = new Date(dt);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
};
const formatDuration = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`;
const formatPrice = (n: number) => `INR ${Math.round(n).toLocaleString('en-IN')}`;

// ─── TOAST ─────────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'info';
interface ToastItem { id: number; msg: string; type: ToastType; }

let _toastId = 0;
let _showToast: ((msg: string, type?: ToastType) => void) | null = null;

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    _showToast = (msg, type = 'info') => {
      const id = ++_toastId;
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    };
    return () => { _showToast = null; };
  }, []);

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            className={`toast ${t.type === 'success' ? 'toast-success' : t.type === 'error' ? 'toast-error' : ''}`}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
          >
            {t.type === 'success' && <CheckIcon />}
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const showToast = (msg: string, type: ToastType = 'info') => _showToast?.(msg, type);

// ─── NAVBAR ────────────────────────────────────────────────────────────────────
interface NavbarProps { view: View; setView: (v: View) => void; user: any; onLogout: () => void; }
const Navbar: React.FC<NavbarProps> = ({ view, setView, user, onLogout }) => (
  <nav className="navbar">
    <div className="container navbar-inner">
      <div className="logo" onClick={() => setView('home')} style={{ cursor: 'pointer' }}>
        <div className="logo-icon">
          <PlaneIcon />
        </div>
        SkyGlide
      </div>
      <ul className="nav-links">
        <li><button className={`nav-link-btn ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>Search</button></li>
        <li><button className={`nav-link-btn ${view === 'routes' ? 'active' : ''}`} onClick={() => setView('routes')}>Routes</button></li>
        <li><a href="#tracker" className="nav-link" onClick={() => { setView('home'); setTimeout(() => document.getElementById('tracker')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>Tracker</a></li>
      </ul>
      <div className="nav-actions">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Hi, {user.name.split(' ')[0]}</span>
            <button className="btn btn-outline btn-sm" onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <>
            <button className="btn btn-outline" onClick={() => setView('login')}>Log In</button>
            <button className="btn btn-primary" onClick={() => setView('signup')}>Sign Up</button>
          </>
        )}
      </div>
    </div>
  </nav>
);

// ─── HERO ──────────────────────────────────────────────────────────────────────
const Hero: React.FC<{ onScrollSearch: () => void; setView: (v: View) => void }> = ({ onScrollSearch, setView }) => (
  <section className="hero">
    <div className="container">
      <div className="hero-inner">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-badge">
            <PlaneIcon />
            Best fares guaranteed
          </div>
          <h1>Find Your Perfect <span>Flight</span></h1>
          <p>Search hundreds of airlines and book with confidence. Competitive prices, no hidden fees, and 24/7 support.</p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={onScrollSearch}>
              <SearchIcon /> Search Flights
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => setView('routes')}>View Popular Routes</button>
          </div>
        </motion.div>
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <img src={heroBg} alt="Flight illustration" className="hero-illustration" />
        </motion.div>
      </div>
    </div>
  </section>
);

// ─── AIRPORT CONSTANTS ──────────────────────────────────────────────────────────
const MAJOR_AIRPORTS: Airport[] = [
  { city: 'Delhi', code: 'DEL', name: 'Indira Gandhi International Airport' },
  { city: 'Mumbai', code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport' },
  { city: 'Bangalore', code: 'BLR', name: 'Kempegowda International Airport' },
  { city: 'Kolkata', code: 'CCU', name: 'Netaji Subhash Chandra Bose International Airport' },
  { city: 'Chennai', code: 'MAA', name: 'Chennai International Airport' },
  { city: 'Hyderabad', code: 'HYD', name: 'Rajiv Gandhi International Airport' },
  { city: 'Ahmedabad', code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport' },
  { city: 'Pune', code: 'PNQ', name: 'Pune International Airport' },
  { city: 'Kochi', code: 'COK', name: 'Cochin International Airport' },
  { city: 'Goa', code: 'GOI', name: 'Dabolim Airport' },
  { city: 'Guwahati', code: 'GAU', name: 'Lokpriya Gopinath Bordoloi International Airport' },
  { city: 'Lucknow', code: 'LKO', name: 'Chaudhary Charan Singh International Airport' },
  { city: 'Jaipur', code: 'JAI', name: 'Jaipur International Airport' },
  { city: 'Trivandrum', code: 'TRV', name: 'Trivandrum International Airport' },
  { city: 'Bhubaneswar', code: 'BBI', name: 'Biju Patnaik International Airport' },
  { city: 'Chandigarh', code: 'IXC', name: 'Chandigarh Airport' },
  { city: 'Dehradun', code: 'DED', name: 'Jolly Grant Airport' },
  { city: 'Srinagar', code: 'SXR', name: 'Sheikh ul-Alam International Airport' },
  { city: 'Amritsar', code: 'ATQ', name: 'Sri Guru Ram Dass Jee International Airport' },
  { city: 'Ranchi', code: 'IXR', name: 'Birsa Munda Airport' },
];

// ─── SEARCH CARD ───────────────────────────────────────────────────────────────
interface SearchParams { from: string; to: string; departure: string; returnDate: string; passengers: number; cabinClass: string; tripType: string; }
interface Airport { city: string; code: string; name: string; }
interface Stats { airlines: number; travellers: string; countries: number; support: string; }
const SearchCard: React.FC<{ 
  airports: Airport[]; 
  onSearch: () => void; 
  searchRef: React.RefObject<HTMLElement | null>;
  // States passed down
  from: string; setFrom: (v: string) => void;
  to: string; setTo: (v: string) => void;
  departure: string; setDeparture: (v: string) => void;
  returnDate: string; setReturnDate: (v: string) => void;
  passengers: number; setPassengers: (v: number) => void;
  cabinClass: string; setCabinClass: (v: string) => void;
  tripType: string; setTripType: (v: string) => void;
}> = ({ 
  airports, onSearch, searchRef, 
  from, setFrom, to, setTo, departure, setDeparture, 
  returnDate, setReturnDate, passengers, setPassengers, 
  cabinClass, setCabinClass, tripType, setTripType 
}) => {

  // Suggestion states
  const [fromSuggestions, setFromSuggestions] = useState<Airport[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Airport[]>([]);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const swap = () => { const temp = from; setFrom(to); setTo(temp); };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const allAirports = [...MAJOR_AIRPORTS, ...airports.filter(a => !MAJOR_AIRPORTS.some(m => m.code === a.code))];

  const onFromChange = (val: string) => {
    setFrom(val);
    if (val.length >= 1) {
      setFromSuggestions(allAirports.filter(a => 
        a.city.toLowerCase().includes(val.toLowerCase()) || 
        a.code.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 8));
      setShowFrom(true);
    } else {
      setShowFrom(false);
    }
  };

  const onToChange = (val: string) => {
    setTo(val);
    if (val.length >= 1) {
      setToSuggestions(allAirports.filter(a => 
        a.city.toLowerCase().includes(val.toLowerCase()) || 
        a.code.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 8));
      setShowTo(true);
    } else {
      setShowTo(false);
    }
  };

  return (
    <section className="search-section" id="search" ref={searchRef as React.RefObject<HTMLElement>}>
      <div className="container" onClick={() => { setShowFrom(false); setShowTo(false); }}>
        <motion.div
          className="search-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="search-tabs">
            {['One-way', 'Round trip', 'Multi-city'].map(t => (
              <button key={t} className={`tab-btn ${tripType === t ? 'active' : ''}`} onClick={() => setTripType(t)}>
                {t}
              </button>
            ))}
          </div>

          <div className="search-options">
            <div className="option-select">
              <UserIcon />
              <select value={passengers} onChange={e => setPassengers(+e.target.value)}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>)}
              </select>
              <ChevronIcon />
            </div>
            <div className="option-select">
              <select value={cabinClass} onChange={e => setCabinClass(e.target.value)}>
                {['Economy', 'Premium Economy', 'Business', 'First'].map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronIcon />
            </div>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="search-inputs">
              
              <div className="suggestions-wrap">
                <div className="input-field">
                  <div className="input-icon"><PlaneTakeoffIcon /></div>
                  <div style={{ flex: 1 }}>
                    <label>From</label>
                    <input type="text" value={from} onChange={e => onFromChange(e.target.value)} placeholder="City or airport" onFocus={() => from.length >= 2 && setShowFrom(true)} />
                  </div>
                </div>
                {showFrom && fromSuggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {fromSuggestions.map(a => (
                      <li key={a.code} className="suggestion-item" onClick={() => { setFrom(`${a.city} (${a.code})`); setShowFrom(false); }}>
                        <span className="suggestion-place">{a.city} ({a.code})</span>
                        <span className="suggestion-name">{a.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button type="button" className="swap-btn" onClick={swap} title="Swap cities">
                <ArrowRightLeft />
              </button>

              <div className="suggestions-wrap">
                <div className="input-field">
                  <div className="input-icon"><PlaneLandIcon /></div>
                  <div style={{ flex: 1 }}>
                    <label>To</label>
                    <input type="text" value={to} onChange={e => onToChange(e.target.value)} placeholder="City or airport" onFocus={() => to.length >= 2 && setShowTo(true)} />
                  </div>
                </div>
                {showTo && toSuggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {toSuggestions.map(a => (
                      <li key={a.code} className="suggestion-item" onClick={() => { setTo(`${a.city} (${a.code})`); setShowTo(false); }}>
                        <span className="suggestion-place">{a.city} ({a.code})</span>
                        <span className="suggestion-name">{a.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="input-field date-dep">
                <div className="input-icon"><CalendarIcon /></div>
                <div style={{ flex: 1 }}>
                  <label>Departure</label>
                  <input type="date" value={departure} onChange={e => setDeparture(e.target.value)} />
                </div>
              </div>

              {tripType === 'Round trip' && (
                <div className="input-field date-ret">
                  <div className="input-icon"><CalendarIcon /></div>
                  <div style={{ flex: 1 }}>
                    <label>Return</label>
                    <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
                  </div>
                </div>
              )}
            </div>

            <div className="search-submit">
              <motion.button
                type="submit"
                className="btn btn-primary btn-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SearchIcon />
                Search Flights
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

// ─── STATS BAND ─────────────────────────────────────────────────────────────────
const StatsBand: React.FC<{ stats: Stats | null }> = ({ stats }) => (
  <div className="stats-band">
    <div className="container">
      <div className="stats-grid">
        {[
          { val: stats?.airlines || '12', unit: '+', label: 'Airlines worldwide' },
          { val: stats?.travellers || '1M', unit: '+', label: 'Happy travellers' },
          { val: stats?.countries || '195', unit: '', label: 'Countries covered' },
          { val: stats?.support || '24', unit: '/7', label: 'Customer support' },
        ].map(({ val, unit, label }) => (
          <div key={label} className="stat-item">
            <div className="stat-value">{val}<span>{unit}</span></div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── FLIGHTS TABLE ─────────────────────────────────────────────────────────────
const statusBadge = (status: Flight['status']) => {
  const map = { Scheduled: 'badge-success', Delayed: 'badge-warning', Cancelled: 'badge-danger' };
  return <span className={`badge ${map[status]}`}>{status}</span>;
};

const FlightsTable: React.FC<{ flights: Flight[]; loading: boolean; onBook: (f: Flight) => void }> = ({ flights, loading, onBook }) => (
  <section className="flights-section section" id="flights">
    <div className="container">
      <div className="section-header">
        <div className="section-label"><PlaneIcon /> Available Flights</div>
        <h2>Live Flight Schedule</h2>
        <p>Real-time availability from our database. Search above to filter results.</p>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="flights-table-wrap">
          <table className="flights-table">
            <thead>
              <tr>
                <th>Airline</th>
                <th>Route</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Duration</th>
                <th>Seats</th>
                <th>Status</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {flights.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="empty-state">
                      <AlertCircleIcon />
                      <p>No flights found. Try adjusting your search filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                flights.map(f => (
                  <motion.tr
                    key={f._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td>
                      <div className="airline-cell">
                        <img 
                          src={f.airlineLogo} 
                          alt={f.airline} 
                          className="airline-logo" 
                          onError={(e) => { e.currentTarget.src = 'https://img.icons8.com/color/48/airplane-mode-on.png'; }} 
                        />
                        <div>
                          <div className="airline-name">{f.airline}</div>
                          <div className="flight-num">{f.flightNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="route-cell">{f.source} &rarr; {f.destination}</td>
                    <td className="time-cell">{formatTime(f.departureTime)}</td>
                    <td className="time-cell">{formatTime(f.arrivalTime)}</td>
                    <td>{formatDuration(f.duration)}</td>
                    <td>{f.availableSeats}</td>
                    <td>{statusBadge(f.status)}</td>
                    <td className="price-cell">{formatPrice(f.price)}</td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => onBook(f)}>Book</button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </section>
);

// ─── BOOKING SELECTION PAGE ────────────────────────────────────────────────────
const BookingSelection: React.FC<{ flight: Flight; onBack: () => void }> = ({ flight, onBack }) => {
  const getCode = (str: string) => str.match(/\((.*?)\)/)?.[1] || str.substring(0,3).toUpperCase();
  
  const handleContinue = (partner: string) => {
    const depCode = getCode(flight.source);
    const arrCode = getCode(flight.destination);
    const dateStr = flight.departureTime.split('T')[0]; // YYYY-MM-DD
    
    let url = '';
    if (partner.toLowerCase().includes('indigo')) {
      // IndiGo expects YYYY-MM-DD
      url = `https://www.goindigo.in/book/flight-select.html?cid=metasearch|googleflights&fareType=regular&source=${depCode}&destination=${arrCode}&departureDate=${dateStr}`;
    } else if (partner.toLowerCase().includes('goibibo')) {
      // Goibibo expects YYYYMMDD (no dashes)
      const dateGo = dateStr.replace(/-/g, '');
      url = `https://www.goibibo.com/flights/${depCode.toLowerCase()}-to-${arrCode.toLowerCase()}-on-${dateGo}/`;
    } else if (partner.toLowerCase().includes('expedia')) {
      // Expedia format: departure:DD/MM/YYYY
      const [y, m, d] = dateStr.split('-');
      url = `https://www.expedia.co.in/Flights-Search?leg1=from:${depCode},to:${arrCode},departure:${d}/${m}/${y}&mode=search`;
    } else {
      url = `https://www.google.com/search?q=book+flight+${flight.airline}+from+${depCode}+to+${arrCode}+on+${dateStr}`;
    }
    
    window.open(url, '_blank');
  };

  const partners = [
    { name: `Book with ${flight.airline}`, logo: flight.airlineLogo, price: flight.price, label: 'Airline' },
    { name: 'Book with Goibibo', logo: 'https://cdn.worldvectorlogo.com/logos/goibibo-com.svg', price: flight.price + 105 },
    { name: 'Book with Expedia', logo: 'https://cdn.worldvectorlogo.com/logos/expedia-1.svg', price: flight.price + 180 },
    { name: 'Book with Booking.com', logo: 'https://cdn.worldvectorlogo.com/logos/bookingcom-1.svg', price: flight.price + 550 },
    { name: 'Book with Cleartrip', logo: 'https://cdn.worldvectorlogo.com/logos/cleartrip.svg', price: flight.price + 105 },
    { name: 'Book with Paytm Travel', logo: 'https://cdn.worldvectorlogo.com/logos/paytm-1.svg', price: flight.price + 105 },
    { name: 'Book with Trip.com', logo: 'https://cdn.worldvectorlogo.com/logos/tripcom.svg', price: flight.price + 337 },
    { name: 'Book with EaseMyTrip', logo: 'https://www.easemytrip.com/favicon.ico', price: flight.price + 105 },
  ];

  return (
    <div className="booking-page">
      <div className="container">
        <div className="btn-back" onClick={onBack}><ArrowLeftIcon /> Back to search</div>
        
        <div className="booking-header">
          <div className="flight-summary">
            <img src={flight.airlineLogo} alt="" style={{ height: 32 }} />
            <div>
              <div className="flight-times">{formatTime(flight.departureTime)} – {formatTime(flight.arrivalTime)}</div>
              <div className="flight-num">{flight.airline} • {flight.flightNumber}</div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#64748b' }}>{formatDuration(flight.duration)}</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{getCode(flight.source)}–{getCode(flight.destination)}</div>
          </div>
          <div style={{ fontWeight: 600 }}>Nonstop</div>
        </div>

        <div className="baggage-section">
          <div className="baggage-item">
            <BriefcaseIcon /> 1 free carry-on
          </div>
          <div className="baggage-item">
            <BaggageIcon /> 1st checked bag free
          </div>
        </div>

        <div className="booking-options-list">
          <h3 style={{ marginBottom: 12, fontSize: 18 }}>Booking options</h3>
          <div className="booking-card">
            {partners.map(p => (
              <div key={p.name} className="booking-partner">
                <div className="partner-info">
                  <img src={p.logo} alt="" className="partner-logo" onError={(e) => { e.currentTarget.src = flight.airlineLogo; }} />
                  <div>
                    <span className="partner-name">{p.name}</span>
                    {p.label && <span className="badge badge-info" style={{ marginLeft: 8 }}>{p.label}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <div className="partner-price">{formatPrice(Math.round(p.price))}</div>
                  <button className="btn btn-outline btn-sm" onClick={() => handleContinue(p.name)}>Continue</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── LIVE TRACKER ─────────────────────────────────────────────────────────────
const LiveTracker: React.FC = () => {
  const [fnum, setFnum] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const track = async () => {
    const cleanFnum = fnum.trim().toUpperCase();
    if (!cleanFnum) {
      showToast('Please enter a flight number', 'info');
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await axios.get(`${API}/flights/live/${cleanFnum}`);
      if (res.data) {
        setStatus(res.data);
        showToast(`Tracking ${cleanFnum} successfully!`, 'success');
      } else {
        showToast('No information found for this flight.', 'error');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Flight not found or API limits reached.';
      showToast(msg, 'error');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const getFlightDisplay = () => {
    if (!status) return '';
    return status.flight?.iata || status.flight?.icao || status.flight?.number || fnum;
  };

  return (
    <section className="tracker-section section" id="tracker">
      <div className="container">
        <div className="tracker-card">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: 24 }}>
            <div className="section-label"><GlobeIcon /> Real-time Global Tracking</div>
            <h2>Live Flight status</h2>
            <p>Enter any domestic or international flight number to see its current satellite position.</p>
          </div>
          
          <div className="tracker-input-wrap">
            <div className="input-field" style={{ flex: 1, padding: '14px 20px' }}>
              <PlaneIcon />
              <input 
                type="text" 
                placeholder="Ex: 6E2134, AI302, EK507..." 
                value={fnum} 
                onChange={e => setFnum(e.target.value.toUpperCase())}
                onKeyPress={e => e.key === 'Enter' && track()}
                style={{ textTransform: 'uppercase', border: 'none', outline: 'none', background: 'transparent' }}
              />
            </div>
            <button className="btn btn-primary btn-lg" onClick={track} disabled={loading} style={{ height: 50 }}>
              {loading ? <div className="spinner-sm" /> : 'Track Fleet Status'}
            </button>
          </div>

          {status && (
            <motion.div 
              className="tracker-results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 40 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <img src="https://cdn.worldvectorlogo.com/logos/indigo-airlines.svg" alt="" style={{ height: 28 }} onError={(e) => { e.currentTarget.src = 'https://img.icons8.com/color/48/airplane-mode-on.png'; }} />
                  <div>
                    <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.5px' }}>{getFlightDisplay()}</span>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{status.airline?.name || 'Commercial Flight'} {status.aircraft && `• ${status.aircraft.registration || status.aircraft.iata}`}</div>
                  </div>
                </div>
                <div className={`status-indicator ${status.flight_status === 'active' ? 'live' : ''}`} style={{ padding: '8px 16px', fontSize: 13 }}>
                  {status.flight_status === 'active' ? 'Live tracked' : (status.flight_status || 'Unknown').toUpperCase()}
                </div>
              </div>

              {status.aircraft && (
                 <div style={{ margin: '-8px 0 24px', padding: '12px 16px', background: '#f1f5f9', borderRadius: '12px', fontSize: 13, fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ padding: '4px 8px', background: 'white', borderRadius: '4px', fontSize: 10, color: 'var(--primary)' }}>AIRCRAFT</div>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{status.aircraft.iata || 'Standard'} ({status.aircraft.registration || 'Tail ID Unknown'})</span>
                 </div>
              )}

              <div className="status-main-info" style={{ marginTop: 24, padding: '24px', background: '#f8fafc', borderRadius: 20 }}>
                {/* Visual Progress Path */}
                <div style={{ position: 'relative', height: 40, display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                   <div style={{ flex: 1, height: 2, background: '#e2e8f0', borderRadius: 4 }}></div>
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: status.live ? '65%' : '0%' }} 
                     style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', height: 4, background: 'var(--primary)', borderRadius: 4 }}
                   />
                   <motion.div 
                     animate={{ left: status.live ? '65%' : '0%' }}
                     style={{ position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', rotate: 90, color: 'var(--primary)' }}
                   >
                     <PlaneIcon />
                   </motion.div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 40 }}>
                   {/* Departure Pillar */}
                   <div>
                      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>Departure</div>
                      <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--gray-900)' }}>{status.departure?.iata || 'Origin'}</div>
                      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>{status.departure?.airport || 'Starting Terminal'}</div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                           <span style={{ color: '#94a3b8' }}>Scheduled:</span>
                           <span style={{ fontWeight: 600 }}>{status.departure?.scheduled ? formatTime(status.departure.scheduled) : '--:--'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                           <span style={{ color: '#94a3b8' }}>Estimated:</span>
                           <span style={{ fontWeight: 600, color: '#10b981' }}>{status.departure?.estimated ? formatTime(status.departure.estimated) : '--:--'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                           <span style={{ color: '#94a3b8' }}>Terminal / Gate:</span>
                           <span style={{ fontWeight: 600 }}>{status.departure?.terminal || '–'} / {status.departure?.gate || '–'}</span>
                        </div>
                      </div>
                   </div>

                   {/* Arrival Pillar */}
                   <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>Arrival</div>
                      <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--gray-900)' }}>{status.arrival?.iata || 'Dest'}</div>
                      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>{status.arrival?.airport || 'Destination Terminal'}</div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                           <span style={{ fontWeight: 600 }}>{status.arrival?.scheduled ? formatTime(status.arrival.scheduled) : '--:--'}</span>
                           <span style={{ color: '#94a3b8', marginLeft: 12 }}>Scheduled:</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                           <span style={{ fontWeight: 600, color: '#10b981' }}>{status.arrival?.estimated ? formatTime(status.arrival.estimated) : '--:--'}</span>
                           <span style={{ color: '#94a3b8', marginLeft: 12 }}>Estimated:</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                           <span style={{ fontWeight: 600 }}>{status.arrival?.terminal || '–'} / {status.arrival?.gate || '–'}</span>
                           <span style={{ color: '#94a3b8', marginLeft: 12 }}>Terminal / Gate:</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              {status.live ? (
                <>
                <div style={{ marginTop: 24, padding: '16px 20px', background: '#3b82f61a', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #3b82f633' }}>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', animation: 'pulse 2s infinite' }}></div>
                   <span style={{ fontSize: 14, fontWeight: 600, color: '#1d4ed8' }}>
                      Currently Over: <span style={{ color: 'var(--gray-900)' }}>Near {status.arrival?.city || 'Jaipur Terminal'} (Alt: {Math.round(status.live.altitude || 0)}ft)</span>
                   </span>
                </div>

                <div style={{ marginTop: 24, padding: 24, background: '#f1f5f9', borderRadius: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                   <div style={{ padding: 16, background: 'white', borderRadius: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Altitude</div>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>{status.live.altitude?.toLocaleString() || 'N/A'} <span style={{ fontSize: 12, color: '#94a3b8' }}>ft</span></div>
                   </div>
                   <div style={{ padding: 16, background: 'white', borderRadius: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Velocity</div>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>{Math.round(status.live.speed_horizontal || 0).toLocaleString()} <span style={{ fontSize: 12, color: '#94a3b8' }}>km/h</span></div>
                   </div>
                   <div style={{ padding: 16, background: 'white', borderRadius: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Telemetry Update</div>
                      <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>{status.live.updated ? new Date(status.live.updated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Active'}</div>
                   </div>
                </div>
                </>
              ) : (
                <div style={{ marginTop: '24px', textAlign: 'center', padding: '24px', background: '#fff1f2', borderRadius: '20px', fontSize: 14, color: '#e11d48', fontWeight: 600 }}>
                   <p>Flight is currently not in active transit or out of radar range.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── ROUTES PAGE ─────────────────────────────────────────────────────────────
const routesData = [
  { from: 'Delhi', to: 'Mumbai', code: 'DEL-BOM', price: 3499, duration: '2h 15m', img: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80', tag: 'High Frequency' },
  { from: 'Mumbai', to: 'Bangalore', code: 'BOM-BLR', price: 4200, duration: '1h 45m', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80', tag: 'Fastest' },
  { from: 'Bangalore', to: 'Hyderabad', code: 'BLR-HYD', price: 2900, duration: '1h 10m', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80', tag: 'Quick Hop' },
  { from: 'Kolkata', to: 'Delhi', code: 'CCU-DEL', price: 5400, duration: '2h 30m', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80', tag: 'Best Seller' },
  { from: 'Chennai', to: 'Delhi', code: 'MAA-DEL', price: 6200, duration: '2h 55m', img: 'https://images.unsplash.com/photo-1582510003544-2d095665039b?w=600&q=80', tag: 'Value' },
  { from: 'Delhi', to: 'Pune', code: 'DEL-PNQ', price: 4700, duration: '2h 05m', img: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=80', tag: 'Tech Route' },
];

const RoutesPage: React.FC<{ setView: (v: View) => void; onSearch: (from: string, to: string) => void }> = ({ setView, onSearch }) => {
  return (
    <div className="section" style={{ minHeight: '80vh', paddingTop: '120px' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label"><TagIcon /> Route Explorer</div>
          <h2>Popular Domestic Routes</h2>
          <p>Real-time estimated prices and flight durations based on current traffic.</p>
        </div>
        
        <div className="routes-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {routesData.map(r => (
            <motion.div 
              key={r.code}
              className="route-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -8 }}
              style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--gray-100)', boxShadow: 'var(--shadow-md)' }}
            >
              <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                <img src={r.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', background: 'var(--primary)', color: 'white', borderRadius: '4px', fontSize: 10, fontWeight: 700 }}>
                  {r.tag}
                </div>
              </div>
              <div style={{ padding: 24 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 18, fontWeight: 700 }}>{r.from}</span>
                    <ArrowRightLeft />
                    <span style={{ fontSize: 18, fontWeight: 700 }}>{r.to}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray-500)', fontSize: 13, marginBottom: 20 }}>
                    <span>{r.code} • {r.duration}</span>
                    <span style={{ color: '#059669', fontWeight: 600 }}>Avg. {r.price} INR</span>
                 </div>
                 <button 
                  className="btn btn-primary btn-lg" 
                  style={{ width: '100%', height: 48 }}
                  onClick={() => {
                    onSearch(r.from, r.to);
                  }}
                 >
                   Find Flights
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── FEATURES ─────────────────────────────────────────────────────────────────
const features = [
  { icon: <ZapIcon />, title: 'Instant Booking', desc: 'Confirm your flight in seconds. Real-time seat availability with instant confirmation emails.' },
  { icon: <ShieldIcon />, title: 'Secure Payments', desc: 'Your payment data is protected with bank-grade encryption. Book with complete peace of mind.' },
  { icon: <HeadphonesIcon />, title: '24/7 Support', desc: 'Our dedicated team is available around the clock for any assistance before, during, or after your trip.' },
  { icon: <TagIcon />, title: 'Best Price Guarantee', desc: 'Found a cheaper price? We will match it. No questions asked, guaranteed lowest fares.' },
  { icon: <PlaneIcon />, title: 'Live Flight Tracking', desc: 'Track any flight status in real-time with live updates directly from aviation data sources.' },
  { icon: <ShieldIcon />, title: 'Flexible Cancellation', desc: 'Plans change. Book refundable tickets and cancel anytime with a full refund.' },
];

const Features: React.FC = () => (
  <section className="features-section section" id="features">
    <div className="container">
      <div className="section-header">
        <div className="section-label">Why SkyGlide</div>
        <h2>Everything you need to fly smarter</h2>
        <p>We have built the tools and features that make booking flights simple, safe, and affordable.</p>
      </div>
      <div className="features-grid">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer: React.FC = () => (
  <footer>
    <div className="container">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="logo"><div className="logo-icon"><PlaneIcon /></div>SkyGlide</div>
          <p>Your trusted partner for affordable and hassle-free flight bookings across India and the world.</p>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Product</h4>
          <ul>
            <li><a href="#">Search Flights</a></li>
            <li><a href="#">Live Tracking</a></li>
            <li><a href="#">Booking</a></li>
            <li><a href="#">API Docs</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Refund Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SkyGlide. All rights reserved.</p>
        <p>Built with precision for travellers worldwide.</p>
      </div>
    </div>
  </footer>
);

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { q: 'What are some good flight destinations from India?', a: 'Popular choices include Dubai, Singapore, Thailand, and the Maldives for international travel. Domestically, Goa, Ladakh, and Kerala are top-rated.' },
    { q: 'How can I find last-minute flight deals?', a: 'Use our real-time tracker and enable notifications. Prices usually drop 24-48 hours before departure if seats are still available.' },
    { q: 'How can I find cheap flights for a weekend getaway?', a: 'Try searching for departures on Thursday night or Friday morning and returns on Monday morning to get the best weekend rates.' },
    { q: 'How can I find flight deals if my travel plans are flexible?', a: 'Check our "Popular Routes" page for price trends and use our search filters to compare different dates across the week.' },
    { q: 'How can I find cheap flights from India to anywhere?', a: 'Our "Route Explorer" tool shows you all active routes from major Indian hubs like Delhi and Mumbai with their estimated prices.' },
    { q: 'How can I get flight alerts for my trip?', a: 'Log in to your SkyGlide account and save your search. We will notify you via email or browser notification if the price drops.' },
  ];

  return (
    <section className="section" style={{ background: 'white' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="section-header" style={{ textAlign: 'left', marginBottom: 40 }}>
           <div className="section-label"><HelpIcon /> Assistance</div>
           <h2>Frequently asked questions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {items.map((it, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--gray-100)' }}>
              <button 
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', outline: 'none' }}
              >
                <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--gray-900)' }}>{it.q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                   <ChevronIcon size={20} />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ paddingBottom: 24, fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.6 }}>
                      {it.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── AUTH PAGES ───────────────────────────────────────────────────────────────
const AuthPage: React.FC<{ type: 'login' | 'signup'; onAuth: (user: any) => void; setView: (v: View) => void }> = ({ type, onAuth, setView }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = type === 'login' ? '/users/login' : '/users/signup';
      const { data } = await axios.post(`${API}${endpoint}`, formData);
      onAuth(data);
      showToast(`${type === 'login' ? 'Logged In' : 'Account Created'} successfully!`, 'success');
      setView('home');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: '100px 20px' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', maxWidth: 420, background: 'white', padding: 40, borderRadius: 24, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--gray-100)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <UserIcon />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>{type === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 4 }}>Access your bookings and flight alerts anytime.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {type === 'signup' && (
            <div className="input-group">
              <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, display: 'block' }}>Full Name</label>
              <div className="input-field" style={{ padding: '12px 16px' }}>
                <UserIcon />
                <input type="text" placeholder="Rahul Kumar" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
          )}
          <div className="input-group">
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, display: 'block' }}>Email Address</label>
            <div className="input-field" style={{ padding: '12px 16px' }}>
              <MailIcon />
              <input type="email" placeholder="name@example.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>
          <div className="input-group">
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, display: 'block' }}>Password</label>
            <div className="input-field" style={{ padding: '12px 16px' }}>
              <LockIcon />
              <input type="password" placeholder="••••••••" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>

          <button className="btn btn-primary btn-lg" style={{ height: 50, marginTop: 12 }} disabled={loading}>
            {loading ? <div className="spinner-sm" /> : type === 'login' ? 'Log In' : 'Get Started'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--gray-500)' }}>
            {type === 'login' ? (
              <>Don't have an account? <span onClick={() => setView('signup')} style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Sign up</span></>
            ) : (
              <>Already have an account? <span onClick={() => setView('login')} style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Log in</span></>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const searchRef = React.useRef<HTMLElement | null>(null);

  // Lifted Search States
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departure, setDeparture] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('Economy');
  const [tripType, setTripType] = useState('One-way');

  const fetchInitialData = useCallback(async () => {
    try {
      const [appRes, statsRes] = await Promise.all([
        axios.get(`${API}/flights/airports`),
        axios.get(`${API}/flights/stats`)
      ]);
      setAirports(appRes.data.airports || []);
      setStats(statsRes.data || null);
    } catch (err) {
      console.error('Initial data fetch error:', err);
    }
  }, []);

  const fetchFlights = useCallback(async (params?: Partial<SearchParams>) => {
    setLoading(true);
    try {
      const query: Record<string, string> = {};
      if (params?.from) query.source = params.from;
      if (params?.to) query.destination = params.to;
      if (params?.departure) query.date = params.departure;
      if (params?.cabinClass && params.cabinClass !== 'Economy') query.cabinClass = params.cabinClass;

      const res = await axios.get(`${API}/flights`, { params: query });
      setFlights(res.data.flights || []);
      if (params) showToast(`Found ${(res.data.flights || []).length} flight(s)`, 'success');
    } catch (err) {
      showToast('Could not connect to backend. Is the server running?', 'error');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchInitialData();
    fetchFlights(); 
  }, [fetchInitialData, fetchFlights]);

  const handleAppSearch = () => {
    fetchFlights({ from, to, departure, returnDate, passengers, cabinClass, tripType });
    setSelectedFlight(null);
    setView('home');
    setTimeout(() => {
      document.getElementById('flights')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const scrollToSearch = () => {
    setSelectedFlight(null);
    setView('home');
    setTimeout(() => {
      searchRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const onBook = (f: Flight) => {
    setSelectedFlight(f);
    setView('booking');
  };

  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const onLogout = () => {
    setUser(null);
    showToast('Signed out successfully', 'info');
    setView('home');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <Navbar view={view} setView={setView} user={user} onLogout={onLogout} />
      
      {view === 'home' && (
        <>
          <Hero onScrollSearch={scrollToSearch} setView={setView} />
          <SearchCard 
            airports={airports} 
            onSearch={handleAppSearch} 
            searchRef={searchRef}
            from={from} setFrom={setFrom}
            to={to} setTo={setTo}
            departure={departure} setDeparture={setDeparture}
            returnDate={returnDate} setReturnDate={setReturnDate}
            passengers={passengers} setPassengers={setPassengers}
            cabinClass={cabinClass} setCabinClass={setCabinClass}
            tripType={tripType} setTripType={setTripType}
          />
          <StatsBand stats={stats} />
          <FlightsTable flights={flights} loading={loading} onBook={onBook} />
          <LiveTracker />
          <FAQ />
          <Features />
        </>
      )}

      {view === 'routes' && <RoutesPage setView={setView} onSearch={(f, t) => {
        setFrom(f); 
        setTo(t);
        handleAppSearch();
      }} />}

      {view === 'login' && <AuthPage type="login" onAuth={setUser} setView={setView} />}
      {view === 'signup' && <AuthPage type="signup" onAuth={setUser} setView={setView} />}

      {view === 'booking' && selectedFlight && (
        <BookingSelection flight={selectedFlight} onBack={() => setView('home')} />
      )}

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default App;
