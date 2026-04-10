"use server";

import { getSleepLogs, getCircadianHistory, getCurrentUser } from "@/app/actions/auth";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type DietPreference = "keto" | "vegan" | "paleo" | "balanced" | "mediterranean" | "none";

export interface MealRecommendation {
  name: string;
  type: MealType;
  calories: number;
  prepTime: number;
  glycemicIndex: number;
  ingredients: string[];
  reason: string;
  image?: string;
}

export interface ContextScore {
  sleepScore: number;
  circadianScore: number;
  activityScore: number;
  mealConsistency: number;
  overallStability: number;
}

export interface UserPreferences {
  dietPreference: DietPreference;
  allergies: string[];
  caloricTarget: number;
}

const lowGlycemicMeals: MealRecommendation[] = [
  {
    name: "Avocado Salmon Bowl",
    type: "lunch",
    calories: 450,
    prepTime: 15,
    glycemicIndex: 15,
    ingredients: ["Salmon", "Avocado", "Spinach", "Cucumber", "Olive Oil"],
    reason: "Low-glycemic fats + protein for sustained energy"
  },
  {
    name: "Greek Chicken Salad",
    type: "dinner",
    calories: 380,
    prepTime: 20,
    glycemicIndex: 20,
    ingredients: ["Chicken Breast", "Feta", "Olives", "Tomatoes", "Red Onion"],
    reason: "High protein, moderate fats, minimal carbs"
  },
  {
    name: "Chia Seed Porridge",
    type: "breakfast",
    calories: 280,
    prepTime: 10,
    glycemicIndex: 10,
    ingredients: ["Chia Seeds", "Almond Milk", "Blueberries", "Cinnamon"],
    reason: "Omega-3 rich, slow-digesting breakfast"
  },
  {
    name: "Steak with Asparagus",
    type: "dinner",
    calories: 520,
    prepTime: 25,
    glycemicIndex: 10,
    ingredients: ["Ribeye Steak", "Asparagus", "Garlic", "Rosemary"],
    reason: "Zero-carb protein feast"
  },
  {
    name: "Eggs Benedict with Spinach",
    type: "breakfast",
    calories: 320,
    prepTime: 20,
    glycemicIndex: 25,
    ingredients: ["Eggs", "Spinach", "Hollandaise", "Lemon"],
    reason: "Protein-forward morning meal"
  },
  {
    name: "Tuna Poke Bowl",
    type: "lunch",
    calories: 380,
    prepTime: 15,
    glycemicIndex: 20,
    ingredients: ["Ahi Tuna", "Seaweed", "Cucumber", "Sesame Seeds"],
    reason: "Omega-3 rich, light lunch"
  },
];

const balancedMeals: MealRecommendation[] = [
  {
    name: "Mediterranean Quinoa Bowl",
    type: "lunch",
    calories: 420,
    prepTime: 20,
    glycemicIndex: 35,
    ingredients: ["Quinoa", "Chickpeas", "Feta", "Cucumber", "Tomatoes"],
    reason: "Complete protein with complex carbs"
  },
  {
    name: "Turkey Wrap",
    type: "lunch",
    calories: 340,
    prepTime: 10,
    glycemicIndex: 40,
    ingredients: ["Turkey Breast", "Whole Wheat Wrap", "Lettuce", "Tomato"],
    reason: "Lean protein with fiber"
  },
  {
    name: "Oatmeal with Berries",
    type: "breakfast",
    calories: 300,
    prepTime: 10,
    glycemicIndex: 45,
    ingredients: ["Oats", "Berries", "Honey", "Almonds"],
    reason: "Complex carbs for sustained energy"
  },
  {
    name: "Grilled Salmon with Vegetables",
    type: "dinner",
    calories: 480,
    prepTime: 25,
    glycemicIndex: 20,
    ingredients: ["Salmon", "Broccoli", "Carrots", "Olive Oil"],
    reason: "Omega-3 rich with fiber"
  },
];

const ketoMeals: MealRecommendation[] = [
  {
    name: "Bunless Burger",
    type: "lunch",
    calories: 550,
    prepTime: 15,
    glycemicIndex: 5,
    ingredients: ["Ground Beef", "Cheddar", "Bacon", "Lettuce", "Avocado"],
    reason: "Zero-carb keto classic"
  },
  {
    name: "Cauliflower Mac & Cheese",
    type: "dinner",
    calories: 420,
    prepTime: 30,
    glycemicIndex: 10,
    ingredients: ["Cauliflower", "Cheddar", "Cream Cheese", "Bacon"],
    reason: "Low-carb comfort food"
  },
  {
    name: "Bulletproof Coffee",
    type: "breakfast",
    calories: 230,
    prepTime: 5,
    glycemicIndex: 0,
    ingredients: ["Coffee", "Butter", "MCT Oil", "Collagen"],
    reason: "Keto morning fuel"
  },
  {
    name: "Ribeye with Garlic Butter",
    type: "dinner",
    calories: 580,
    prepTime: 20,
    glycemicIndex: 5,
    ingredients: ["Ribeye", "Butter", "Garlic", "Rosemary"],
    reason: "Pure protein & fat"
  },
];

const veganMeals: MealRecommendation[] = [
  {
    name: "Tofu Scramble",
    type: "breakfast",
    calories: 280,
    prepTime: 15,
    glycemicIndex: 30,
    ingredients: ["Firm Tofu", "Turmeric", "Spinach", "Tomatoes"],
    reason: "Plant-based protein"
  },
  {
    name: "Buddha Bowl",
    type: "lunch",
    calories: 380,
    prepTime: 20,
    glycemicIndex: 35,
    ingredients: ["Sweet Potato", "Kale", "Chickpeas", "Tahini"],
    reason: "Complete plant nutrition"
  },
  {
    name: "Lentil Curry",
    type: "dinner",
    calories: 340,
    prepTime: 35,
    glycemicIndex: 25,
    ingredients: ["Red Lentils", "Coconut Milk", "Curry Spices", "Spinach"],
    reason: "High protein legumes"
  },
  {
    name: "Avocado Toast",
    type: "breakfast",
    calories: 320,
    prepTime: 10,
    glycemicIndex: 40,
    ingredients: ["Sourdough Bread", "Avocado", "Chickpeas", "Chili Flakes"],
    reason: "Quick plant energy"
  },
];

export async function calculateStabilityScore(): Promise<ContextScore> {
  const user = await getCurrentUser();
  if (!user) {
    return { sleepScore: 0, circadianScore: 0, activityScore: 0, mealConsistency: 0, overallStability: 50 };
  }

  const sleepLogs = await getSleepLogs(7);
  const circadianLogs = await getCircadianHistory(7);

  let sleepScore = 50;
  if (sleepLogs.length > 0) {
    const avgQuality = sleepLogs.reduce((sum, l) => sum + l.quality, 0) / sleepLogs.length;
    sleepScore = Math.min(100, avgQuality * 10);
  }

  let circadianScore = 50;
  if (circadianLogs.length > 0) {
    const avgScore = circadianLogs.reduce((sum, l) => sum + (l.score || 0), 0) / circadianLogs.length;
    circadianScore = Math.min(100, avgScore);
  }

  let activityScore = 50;
  if (circadianLogs.length > 0) {
    const avgActivity = circadianLogs.reduce((sum, l) => sum + (l.activityLevel || 0), 0) / circadianLogs.length;
    activityScore = Math.min(100, (avgActivity / 100) * 100);
  }

  let mealConsistency = 50;
  const mealCount = sleepLogs.length;
  if (mealCount >= 5) mealConsistency = 80;
  else if (mealCount >= 3) mealConsistency = 60;
  else mealConsistency = 40;

  const overallStability = Math.round(
    (sleepScore * 0.3) + (circadianScore * 0.25) + (activityScore * 0.25) + (mealConsistency * 0.2)
  );

  return { sleepScore, circadianScore, activityScore, mealConsistency, overallStability };
}

export async function getMealRecommendations(
  sleepQualityThreshold: number = 60,
  dietPreference: DietPreference = "none"
): Promise<MealRecommendation[]> {
  const scores = await calculateStabilityScore();
  const preference = dietPreference.toLowerCase() as DietPreference;
  
  let meals: MealRecommendation[];

  if (scores.sleepScore < sleepQualityThreshold) {
    meals = [...lowGlycemicMeals];
  } else {
    switch (preference) {
      case "keto":
        meals = [...ketoMeals, ...lowGlycemicMeals.slice(0, 2)];
        break;
      case "vegan":
        meals = [...veganMeals, ...balancedMeals.slice(0, 2)];
        break;
      case "paleo":
        meals = [...lowGlycemicMeals.slice(0, 4), ...balancedMeals.slice(0, 2)];
        break;
      case "mediterranean":
        meals = [...balancedMeals];
        break;
      default:
        meals = [...balancedMeals, ...lowGlycemicMeals.slice(0, 2)];
    }
  }

  return meals.sort(() => Math.random() - 0.5).slice(0, 3);
}

export async function getPersonalizedAdvice(): Promise<string> {
  const scores = await calculateStabilityScore();
  
  const advice: string[] = [];

  if (scores.sleepScore < 60) {
    advice.push("Your sleep quality is low. Focus on low-glycemic foods today to maintain stable energy.");
    advice.push("Avoid caffeine after 2PM to improve tonight's rest.");
  }

  if (scores.circadianScore < 50) {
    advice.push("Get 15+ minutes of bright light exposure this morning.");
  }

  if (scores.activityScore < 40) {
    advice.push("A 20-minute walk would boost your stability score.");
  }

  if (scores.mealConsistency < 50) {
    advice.push("Try to eat at consistent times today.");
  }

  if (advice.length === 0) {
    advice.push("You're operating at optimal capacity! Keep up the great work.");
  }

  return advice.join(" ");
}