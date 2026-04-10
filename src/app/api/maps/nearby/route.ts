import { NextRequest, NextResponse } from "next/server";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  priceLevel: number;
  healthScore: number;
  cuisine: string;
  distance: string;
  menuItems: { name: string; calories: number; description: string; isHealthy: boolean }[];
  isOpen: boolean;
  hours: string;
  latitude: number;
  longitude: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Missing coordinates" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Maps API key not configured. Add GOOGLE_MAPS_API_KEY to your environment.", restaurants: [] },
      { status: 200 }
    );
  }

  try {
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=3000&type=restaurant&keyword=healthy,salad,vegan,organic,juice,smoothie&key=${apiKey}`;

    const placesResponse = await fetch(placesUrl);
    const placesData = await placesResponse.json();

    if (placesData.status !== "OK") {
      return NextResponse.json(
        { error: `Google Maps API error: ${placesData.status}`, restaurants: [] },
        { status: 200 }
      );
    }

    const restaurants: Restaurant[] = (placesData.results || []).slice(0, 8).map((place: any) => {
      let healthScore = 75;
      const excludeTypes = ["point_of_interest", "establishment", "food"];
const cuisineTypes = (place.types || []).filter((t: string) => !excludeTypes.includes(t)).map((t: string) => t.replace(/_/g, " "));
      
      if (place.types?.some((t: string) => t.includes("vegan") || t.includes("salad") || t.includes("organic") || t.includes("juice"))) {
        healthScore = 85 + Math.floor(Math.random() * 15);
      }

      const menuItems = [
        { name: "Healthy Bowl", calories: 380, description: "Fresh ingredients", isHealthy: true },
        { name: "Protein Plate", calories: 450, description: "High protein option", isHealthy: true },
        { name: "Light Salad", calories: 280, description: "Low calorie choice", isHealthy: true },
      ];

      return {
        id: place.place_id,
        name: place.name,
        address: place.vicinity || "",
        rating: place.rating || 4.0,
        priceLevel: place.price_level || 2,
        healthScore,
        cuisine: cuisineTypes.slice(0, 2).join(" • ") || "Restaurant",
        distance: place.distance ? `${(place.distance / 1609.34).toFixed(1)} mi` : "nearby",
        isOpen: place.opening_hours?.open_now !== false,
        hours: place.opening_hours?.weekday_text?.[0] || "Call for hours",
        latitude: place.geometry?.location?.lat,
        longitude: place.geometry?.location?.lng,
        menuItems,
      };
    });

    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error("Maps API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants", restaurants: [] },
      { status: 200 }
    );
  }
}