import React, { useState } from 'react';
import { Plane, Search, Calendar, User, MoveHorizontal, ChevronDown, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import heroBg from './assests/flights_5.svg';

const HeroSection: React.FC = () => {
  const [tripType, setTripType] = useState('Round trip');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('Economy');
  
  const [from, setFrom] = useState('Pune');
  const [to, setTo] = useState('');

  return (
    <section className="relative pt-10 pb-20 sky-gradient">
      <div className="container mx-auto px-4 text-center">
        {/* Hero Illustration */}
        <div className="flex justify-center mb-6">
          <img 
            src={heroBg} 
            alt="SkyGlide Travels" 
            className="h-32 md:h-48 object-contain opacity-90"
          />
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-800 mb-10 tracking-tight">
          Flights
        </h1>

        {/* Global Search Interface */}
        <div className="max-w-6xl mx-auto">
          <div className="search-card relative">
            
            {/* Top Toolbar: Trip Type, Passengers, Class */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-medium text-gray-600">
              <button className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 rounded-md transition-colors">
                <MoveHorizontal size={16} className="text-gray-400" />
                {tripType}
                <ChevronDown size={14} />
              </button>
              
              <button className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 rounded-md transition-colors">
                <User size={16} className="text-gray-400" />
                {passengers}
                <ChevronDown size={14} />
              </button>

              <button className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 rounded-md transition-colors">
                {cabinClass}
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Main Inputs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              
              {/* Origin & Destination */}
              <div className="grid grid-cols-2 gap-1 relative">
                <div className="input-outline flex items-center px-4 py-3 gap-3">
                  <Plane size={20} className="text-gray-400" />
                  <input 
                    type="text" 
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400" 
                    placeholder="Where from?"
                  />
                </div>

                <div className="input-outline flex items-center px-4 py-3 gap-3">
                  <MapPin size={20} className="text-gray-400" />
                  <input 
                    type="text" 
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400" 
                    placeholder="Where to?"
                  />
                </div>

                {/* Swap Icon */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                   <button className="p-2 bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg transition-all">
                      <MoveHorizontal size={14} className="text-primary" />
                   </button>
                </div>
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-2 gap-1">
                <div className="input-outline flex items-center px-4 py-3 gap-3">
                  <Calendar size={20} className="text-gray-400" />
                  <span className="text-gray-700 font-medium">Departure</span>
                </div>
                <div className="input-outline flex items-center px-4 py-3 gap-3">
                  <Calendar size={20} className="text-gray-400" />
                  <span className="text-gray-400">Return</span>
                </div>
              </div>

            </div>

            {/* Floating Explore Button */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full shadow-xl font-medium transition-all"
              >
                <Search size={20} />
                Explore
              </motion.button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Dummy for Header Spacing */}
      <nav className="h-16 border-b border-gray-100 flex items-center px-8">
        <div className="flex items-center gap-2 text-primary font-bold text-xl uppercase tracking-widest">
           <Plane className="rotate-45" />
           SkyGlide
        </div>
      </nav>

      <HeroSection />

      {/* Explore Deals Section */}
      <main className="container mx-auto px-4 mt-16 text-center">
         <h2 className="text-2xl font-medium text-gray-800 mb-8">
           Find the best flight deals for you
         </h2>
         <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 font-medium transition-all">
           Explore deals
         </button>
      </main>
    </div>
  );
};

export default App;
