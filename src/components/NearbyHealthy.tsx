"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Navigation, Star, Clock, ChefHat, Leaf, DollarSign, X, Loader2, RefreshCw, Locate } from "lucide-react";
import { motion } from "framer-motion";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  priceLevel: number;
  healthScore: number;
  cuisine: string;
  distance: string;
  menuItems: MenuItem[];
  isOpen: boolean;
  hours: string;
  latitude: number;
  longitude: number;
}

interface MenuItem {
  name: string;
  calories: number;
  description: string;
  isHealthy: boolean;
}

const defaultRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "True Food Kitchen",
    address: "Disney Springs, Orlando FL",
    rating: 4.6,
    priceLevel: 2,
    healthScore: 96,
    cuisine: "Healthy • Organic",
    distance: "nearby",
    isOpen: true,
    hours: "10AM-9PM",
    latitude: 28.3717,
    longitude: -81.5192,
    menuItems: [
      { name: "Grilled Salmon", calories: 380, description: "Wild-caught salmon with asparagus", isHealthy: true },
      { name: "Buddha Bowl", calories: 450, description: "Quinoa, avocado, chickpeas", isHealthy: true },
      { name: "Kale Salad", calories: 280, description: "Massaged kale, parmesan", isHealthy: true },
    ],
  },
  {
    id: "2",
    name: "Caged Greens",
    address: "Downtown, Orlando FL",
    rating: 4.7,
    priceLevel: 2,
    healthScore: 94,
    cuisine: "Salads • Wraps",
    distance: "nearby",
    isOpen: true,
    hours: "11AM-8PM",
    latitude: 28.5383,
    longitude: -81.3792,
    menuItems: [
      { name: "Mediterranean Wrap", calories: 420, description: "Hummus, falafel, veggies", isHealthy: true },
      { name: "Power Salad", calories: 350, description: "Chicken, quinoa, greens", isHealthy: true },
      { name: "Acai Bowl", calories: 380, description: "Granola, berries, honey", isHealthy: true },
    ],
  },
  {
    id: "3",
    name: "The Veggie",
    address: "Winter Park, Orlando FL",
    rating: 4.8,
    priceLevel: 2,
    healthScore: 98,
    cuisine: "Vegan",
    distance: "nearby",
    isOpen: true,
    hours: "9AM-9PM",
    latitude: 28.5999,
    longitude: -81.3602,
    menuItems: [
      { name: "Impossible Burger", calories: 480, description: "Plant-based patty", isHealthy: true },
      { name: "Jackfruit Tacos", calories: 320, description: "Mango slaw, salsa", isHealthy: true },
      { name: "Smoothie Bowl", calories: 360, description: "Dragon fruit blend", isHealthy: true },
    ],
  },
  {
    id: "4",
    name: "Freshly Kitchen",
    address: "Mills 50, Orlando FL",
    rating: 4.5,
    priceLevel: 1,
    healthScore: 91,
    cuisine: "Fast Casual",
    distance: "nearby",
    isOpen: true,
    hours: "10AM-8PM",
    latitude: 28.5549,
    longitude: -81.3609,
    menuItems: [
      { name: "Protein Box", calories: 420, description: "Eggs, sweet potato", isHealthy: true },
      { name: "Mediterranean Plate", calories: 380, description: "Falafel, tabbouleh", isHealthy: true },
      { name: "Harvest Bowl", calories: 350, description: "Roasted veggies, grains", isHealthy: true },
    ],
  },
  {
    id: "5",
    name: "Organic Kitchen",
    address: "Lake Nona, Orlando FL",
    rating: 4.6,
    priceLevel: 2,
    healthScore: 95,
    cuisine: "Organic • Farm-to-Table",
    distance: "nearby",
    isOpen: true,
    hours: "7AM-7PM",
    latitude: 28.4336,
    longitude: -81.3153,
    menuItems: [
      { name: "Farm Breakfast", calories: 420, description: "Local eggs, greens", isHealthy: true },
      { name: "Grass-fed Bowl", calories: 480, description: "Beef, vegetables", isHealthy: true },
      { name: "Green Detox", calories: 220, description: "Celery, kale, apple", isHealthy: true },
    ],
  },
];

export const NearbyHealthy = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [manualLocation, setManualLocation] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    getInitialLocation();
  }, []);

  const getInitialLocation = () => {
    if (!navigator.geolocation) {
      setLoading(false);
      setRestaurants(defaultRestaurants);
      setUseMockData(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLoading(false);
        setRestaurants(defaultRestaurants);
      },
      (err) => {
        console.log("Using default location");
        setLocation({ lat: 28.5383, lng: -81.3792 });
        setLoading(false);
        setRestaurants(defaultRestaurants);
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  };

  const refreshLocation = () => {
    setLoading(true);
    getInitialLocation();
  };

  const handleManualLocation = async () => {
    if (!manualLocation.trim()) return;
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(manualLocation)}&key=AIzaSyDemo-placeholder`
      );
      const data = await response.json();
      
      if (data.results?.[0]?.geometry?.location) {
        const { lat, lng } = data.results[0].geometry.location;
        setLocation({ lat, lng });
        setRestaurants(defaultRestaurants);
        setShowManualInput(false);
      }
    } catch (e) {
      setLocation({ lat: 28.5383, lng: -81.3792 });
      setRestaurants(defaultRestaurants);
    }
    
    setLoading(false);
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-400 bg-green-400/20";
    if (score >= 75) return "text-yellow-400 bg-yellow-400/20";
    return "text-orange-400 bg-orange-400/20";
  };

  return (
    <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2">
          <MapPin size={18} className="text-green-400" />
          <h2 className="text-lg font-semibold text-white">Nearby Healthy</h2>
        </div>
        <div className="flex items-center space-x-2">
          {location && (
            <span className="text-xs text-zinc-500">
              {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
            </span>
          )}
          <button
            onClick={refreshLocation}
            className="p-1.5 rounded-lg hover:bg-white/10"
            title="Refresh location"
          >
            <RefreshCw size={14} className="text-zinc-400" />
          </button>
        </div>
      </div>

      {showManualInput && (
        <div className="mb-4 p-3 rounded-lg bg-black/40">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter city or address..."
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleManualLocation()}
              className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
            />
            <button
              onClick={handleManualLocation}
              className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm"
            >
              Search
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <p className="text-amber-400 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center">
          <Loader2 size={40} className="mx-auto animate-spin text-green-400 mb-4" />
          <p className="text-zinc-400">Finding healthy spots...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {restaurants.map((restaurant, i) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedRestaurant(restaurant)}
              className="p-4 rounded-xl bg-black/40 border border-white/5 cursor-pointer hover:border-green-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{restaurant.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${getHealthColor(restaurant.healthScore)}`}>
                      {restaurant.healthScore}%
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">{restaurant.cuisine}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star size={12} fill="currentColor" />
                    <span className="text-sm">{restaurant.rating}</span>
                  </div>
                  <p className="text-xs text-zinc-500">{restaurant.distance}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-xs text-zinc-500">
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{restaurant.isOpen ? "Open" : "Closed"}</span>
                </div>
                <span>•</span>
                <span>{restaurant.address}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full bg-zinc-950 border border-white/10 rounded-3xl p-6 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedRestaurant.name}</h3>
                <p className="text-sm text-zinc-500">{selectedRestaurant.address}</p>
              </div>
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                <X size={20} className="text-zinc-400" />
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star size={14} className="text-yellow-400" />
                <span className="text-white">{selectedRestaurant.rating}</span>
              </div>
              <div className={`px-2 py-0.5 rounded ${getHealthColor(selectedRestaurant.healthScore)}`}>
                Health: {selectedRestaurant.healthScore}%
              </div>
              <div className="flex items-center space-x-1 text-zinc-500">
                <Clock size={14} />
                <span>{selectedRestaurant.hours}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-white mb-3 flex items-center space-x-2">
                <ChefHat size={14} />
                <span>Healthy Menu Picks</span>
              </h4>
              <div className="space-y-2">
                {selectedRestaurant.menuItems.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-black/40 border border-white/5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-white text-sm">{item.name}</p>
                        <p className="text-xs text-zinc-500">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white">{item.calories} cal</p>
                        {item.isHealthy && (
                          <Leaf size={12} className="text-green-400 ml-auto" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedRestaurant.latitude},${selectedRestaurant.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full mt-4 py-3 rounded-xl font-medium text-black bg-green-400 hover:bg-green-500 transition-colors"
            >
              <Navigation size={18} />
              <span>Get Directions</span>
            </a>
          </motion.div>
        </div>
      )}
    </div>
  );
};