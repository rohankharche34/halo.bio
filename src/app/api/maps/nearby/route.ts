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
    const mockRestaurants: Restaurant[] = [
      {
        id: "1",
        name: "Green Bowl Kitchen",
        address: "123 Health Ave",
        rating: 4.7,
        priceLevel: 2,
        healthScore: 95,
        cuisine: "Healthy • Vegan",
        distance: "0.3 mi",
        isOpen: true,
        hours: "8AM-9PM",
        menuItems: [
          { name: "Buddha Bowl", calories: 420, description: "Quinoa, roasted veggies, tahini", isHealthy: true },
          { name: "Acai Bowl", calories: 380, description: "Acai, granola, fresh berries", isHealthy: true },
          { name: "Green Smoothie", calories: 220, description: "Spinach, banana, almond milk", isHealthy: true },
        ],
      },
      {
        id: "2",
        name: "Freshly",
        address: "456 Wellness Blvd",
        rating: 4.5,
        priceLevel: 2,
        healthScore: 88,
        cuisine: "Salads • Wraps",
        distance: "0.5 mi",
        isOpen: true,
        hours: "10AM-8PM",
        menuItems: [
          { name: "Mediterranean Salad", calories: 350, description: "Feta, olives, cucumber", isHealthy: true },
          { name: "Turkey Wrap", calories: 320, description: "Lean turkey, veggies", isHealthy: true },
          { name: "Protein Bowl", calories: 480, description: "Chicken, brown rice, broccoli", isHealthy: true },
        ],
      },
      {
        id: "3",
        name: "Rooted",
        address: "789 Organic St",
        rating: 4.8,
        priceLevel: 3,
        healthScore: 92,
        cuisine: "Plant-Based",
        distance: "0.8 mi",
        isOpen: true,
        hours: "7AM-10PM",
        menuItems: [
          { name: "Tofu Scramble", calories: 280, description: "Tofu, spinach, tomatoes", isHealthy: true },
          { name: "Jackfruit Tacos", calories: 320, description: "Jackfruit, slaw, salsa", isHealthy: true },
          { name: "Smoothie Bowl", calories: 360, description: "Dragon fruit, coconut", isHealthy: true },
        ],
      },
    ];

    return NextResponse.json({ restaurants: mockRestaurants });
  }

  try {
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=restaurant&keyword=healthy,salad,vegan,organic&key=${apiKey}`;

    const placesResponse = await fetch(placesUrl);
    const placesData = await placesResponse.json();

    const restaurants: Restaurant[] = await Promise.all(
      (placesData.results || []).slice(0, 5).map(async (place: any) => {
        let healthScore = 75;
        const cuisine = place.types?.[0]?.replace(/_/g, " ") || "Restaurant";

        if (place.types?.some((t: string) => t.includes("vegan") || t.includes("salad") || t.includes("organic"))) {
          healthScore = 85 + Math.floor(Math.random() * 15);
        }

        const menuItems = [
          { name: "Healthy Option 1", calories: 350, description: "Fresh ingredients", isHealthy: true },
          { name: "Healthy Option 2", calories: 420, description: "Balanced meal", isHealthy: true },
          { name: "Healthy Option 3", calories: 280, description: "Light choice", isHealthy: true },
        ];

        return {
          place_id: place.place_id,
          name: place.name,
          address: place.vicinity || "",
          rating: place.rating || 4.0,
          priceLevel: place.price_level || 2,
          healthScore,
          cuisine: cuisine.charAt(0).toUpperCase() + cuisine.slice(1),
          distance: `${(Math.random() * 1 + 0.1).toFixed(1)} mi`,
          isOpen: place.opening_hours?.open_now !== false,
          hours: "9AM-9PM",
          menuItems,
        };
      })
    );

    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error("Maps API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants", restaurants: [] },
      { status: 500 }
    );
  }
}