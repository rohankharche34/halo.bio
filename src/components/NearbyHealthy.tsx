"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapPin, Navigation, Star, Clock, ChefHat, Leaf, DollarSign, X, Loader2, RefreshCw, AlertCircle } from "lucide-react";
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

export const NearbyHealthy = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [locationStatus, setLocationStatus] = useState<"loading" | "success" | "error" | "none">("none");
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by browser");
      setLocationStatus("error");
      setLoading(false);
      setRestaurants([]);
      return;
    }

    setLoading(true);
    setLocationStatus("loading");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLocationStatus("success");
        
        await fetchNearbyRestaurants(latitude, longitude);
      },
      (err) => {
        console.error("Geolocation error:", err.code, err.message);
        setLocationStatus("error");
        setError("Location access denied");
        setLocation({ lat: 0, lng: 0 });
        setRestaurants([]);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  }, []);

  const fetchNearbyRestaurants = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/maps/nearby?lat=${lat}&lng=${lng}`);
      const data = await response.json();

      if (data.restaurants && data.restaurants.length > 0) {
        setRestaurants(data.restaurants);
      } else if (data.error?.includes("API key")) {
        setApiKeyMissing(true);
        setError("Google Maps API key not configured");
        setRestaurants([]);
      } else {
        setRestaurants([]);
        setError("No restaurants found nearby");
      }
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Failed to fetch restaurants");
      setRestaurants([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const refreshLocation = () => {
    requestLocation();
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-400 bg-green-400/20";
    if (score >= 75) return "text-yellow-400 bg-yellow-400/20";
    return "text-orange-400 bg-orange-400/20";
  };

  const getDirectionsLink = (lat: number, lng: number, name: string) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination=${encodeURIComponent(name)}`;
  };

  return (
    <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2">
          <MapPin size={18} className="text-green-400" />
          <h2 className="text-lg font-semibold text-white">Nearby Healthy</h2>
        </div>
        <button
          onClick={refreshLocation}
          disabled={loading}
          className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-50"
          title="Refresh location"
        >
          <RefreshCw size={14} className={`text-zinc-400 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center space-x-2 mb-4 text-sm">
          <Loader2 size={14} className="animate-spin text-green-400" />
          <span className="text-zinc-400">Getting your location...</span>
        </div>
      )}

      {location && !loading && (
        <div className="flex items-center space-x-2 mb-4 text-xs text-green-400">
          {locationStatus === "success" ? (
            <>
              <MapPin size={12} />
              <span>📍 {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°W</span>
            </>
          ) : locationStatus === "error" ? (
            <span className="text-yellow-400">Location access denied</span>
          ) : null}
        </div>
      )}

      {(error || apiKeyMissing) && !loading && (
        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-start space-x-2">
            <AlertCircle size={16} className="text-amber-400 mt-0.5" />
            <div>
              <p className="text-amber-400 text-sm font-medium">
                {apiKeyMissing ? "API Key Missing" : "Unable to Load Restaurants"}
              </p>
              <p className="text-amber-400/70 text-xs mt-1">
                {apiKeyMissing 
                  ? "Add GOOGLE_MAPS_API_KEY to .env.production to enable nearby restaurant search"
                  : error
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {!loading && restaurants.length === 0 && !error && (
        <div className="py-8 text-center text-zinc-500">
          <MapPin size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No restaurants found nearby</p>
          <p className="text-xs mt-1">Log some sleep data first to see recommendations</p>
        </div>
      )}

      {!loading && restaurants.length > 0 && (
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
                  <div key={i} className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-white text-sm">{item.name}</p>
                        <p className="text-xs text-zinc-500">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white">{item.calories} cal</p>
                        {item.isHealthy && <Leaf size={12} className="text-green-400 ml-auto" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={getDirectionsLink(selectedRestaurant.latitude, selectedRestaurant.longitude, selectedRestaurant.name)}
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