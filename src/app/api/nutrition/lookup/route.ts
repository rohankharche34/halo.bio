import { NextRequest, NextResponse } from "next/server";

interface NutritionInfo {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  serving: string;
}

const foodDatabase: Record<string, NutritionInfo> = {
  banana: { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14, serving: "1 medium (118g)" },
  apple: { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, serving: "1 medium (182g)" },
  orange: { name: "Orange", calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, sugar: 12, serving: "1 medium (131g)" },
  chicken_breast: { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, serving: "100g cooked" },
  salmon: { name: "Salmon", calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0, serving: "100g cooked" },
  egg: { name: "Egg", calories: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0, sugar: 0.4, serving: "1 large (50g)" },
  rice: { name: "White Rice", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0, serving: "100g cooked" },
  brown_rice: { name: "Brown Rice", calories: 112, protein: 2.6, carbs: 24, fat: 0.9, fiber: 1.8, sugar: 0.4, serving: "100g cooked" },
  oatmeal: { name: "Oatmeal", calories: 68, protein: 2.4, carbs: 12, fat: 1.4, fiber: 1.7, sugar: 0.5, serving: "100g cooked" },
  broccoli: { name: "Broccoli", calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, sugar: 2.2, serving: "100g cooked" },
  spinach: { name: "Spinach", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, serving: "100g raw" },
  avocado: { name: "Avocado", calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, sugar: 0.7, serving: "100g" },
  almonds: { name: "Almonds", calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, sugar: 4.4, serving: "100g" },
  peanut_butter: { name: "Peanut Butter", calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, sugar: 9, serving: "100g" },
  greek_yogurt: { name: "Greek Yogurt", calories: 59, protein: 10, carbs: 3.6, fat: 0.7, fiber: 0, sugar: 3.2, serving: "100g" },
  sweet_potato: { name: "Sweet Potato", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, sugar: 4.2, serving: "100g cooked" },
  potato: { name: "Potato", calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, sugar: 0.8, serving: "100g cooked" },
  bread: { name: "Whole Wheat Bread", calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7, sugar: 6, serving: "100g (2 slices)" },
  pasta: { name: "Pasta", calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sugar: 0.6, serving: "100g cooked" },
  quinoa: { name: "Quinoa", calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, sugar: 0.9, serving: "100g cooked" },
  tofu: { name: "Tofu", calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, sugar: 0.6, serving: "100g" },
  beef: { name: "Beef (lean)", calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, sugar: 0, serving: "100g cooked" },
  pork: { name: "Pork Tenderloin", calories: 143, protein: 26, carbs: 0, fat: 3.5, fiber: 0, sugar: 0, serving: "100g cooked" },
  tuna: { name: "Tuna", calories: 132, protein: 28, carbs: 0, fat: 1.3, fiber: 0, sugar: 0, serving: "100g cooked" },
  shrimp: { name: "Shrimp", calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, sugar: 0, serving: "100g cooked" },
  milk: { name: "Whole Milk", calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sugar: 5, serving: "100ml" },
  cheese: { name: "Cheddar Cheese", calories: 403, protein: 25, carbs: 1.3, fat: 33, fiber: 0, sugar: 0.5, serving: "100g" },
  olive_oil: { name: "Olive Oil", calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, serving: "100ml" },
  honey: { name: "Honey", calories: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2, sugar: 82, serving: "100g" },
  blueberries: { name: "Blueberries", calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, sugar: 10, serving: "100g" },
  strawberries: { name: "Strawberries", calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, sugar: 4.9, serving: "100g" },
  grapes: { name: "Grapes", calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, sugar: 16, serving: "100g" },
  tomato: { name: "Tomato", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6, serving: "100g" },
  cucumber: { name: "Cucumber", calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, sugar: 1.7, serving: "100g" },
  carrot: { name: "Carrot", calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, sugar: 4.7, serving: "100g" },
  onion: { name: "Onion", calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, sugar: 4.2, serving: "100g" },
  garlic: { name: "Garlic", calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1, sugar: 1, serving: "100g" },
  bell_pepper: { name: "Bell Pepper", calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, sugar: 4.2, serving: "100g" },
  corn: { name: "Corn", calories: 86, protein: 3.3, carbs: 19, fat: 1.4, fiber: 2.7, sugar: 6.3, serving: "100g" },
  lentils: { name: "Lentils", calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, sugar: 1.8, serving: "100g cooked" },
  chickpeas: { name: "Chickpeas", calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, sugar: 4.8, serving: "100g cooked" },
  black_beans: { name: "Black Beans", calories: 132, protein: 8.9, carbs: 24, fat: 0.5, fiber: 8.7, sugar: 0.3, serving: "100g cooked" },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase().trim();

  if (!q) {
    return NextResponse.json({ error: "Please enter a food name" }, { status: 400 });
  }

  if (foodDatabase[q]) {
    return NextResponse.json({ nutrition: foodDatabase[q] });
  }

  const keys = Object.keys(foodDatabase);
  const matched = keys.find(key => key.includes(q) || q.includes(key));
  
  if (matched) {
    return NextResponse.json({ nutrition: foodDatabase[matched] });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const prompt = `You are a nutrition database. Provide nutritional information for "${q}".
      
Return ONLY a JSON object with this exact structure (no other text):
{"name": "Food Name", "calories": number, "protein": number, "carbs": number, "fat": number, "fiber": number, "sugar": number, "serving": "typical serving size"}

Use values for 100g serving or typical single serving. Include only numbers, no units in the numbers.`;

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 300,
            },
          }),
        }
      );

      if (geminiResponse.ok) {
        const geminiData = await geminiResponse.json();
        const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (responseText) {
          const match = responseText.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            if (parsed.calories && parsed.protein) {
              return NextResponse.json({ nutrition: parsed });
            }
          }
        }
      }
    } catch (e) {
      console.error("Gemini nutrition error:", e);
    }
  }

  return NextResponse.json({ error: `No nutrition data found for "${q}". Try a common food like banana, chicken, rice, etc.` }, { status: 404 });
}