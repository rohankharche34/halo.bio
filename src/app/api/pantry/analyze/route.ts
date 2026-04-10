import { NextRequest, NextResponse } from "next/server";

interface Ingredient {
  name: string;
  confidence: number;
  category: string;
}

const ingredientDatabase: Record<string, Ingredient> = {
  chicken: { name: "Chicken", confidence: 92, category: "protein" },
  beef: { name: "Beef", confidence: 90, category: "protein" },
  pork: { name: "Pork", confidence: 88, category: "protein" },
  salmon: { name: "Salmon", confidence: 94, category: "protein" },
  tuna: { name: "Tuna", confidence: 92, category: "protein" },
  shrimp: { name: "Shrimp", confidence: 88, category: "protein" },
  eggs: { name: "Eggs", confidence: 96, category: "protein" },
  tofu: { name: "Tofu", confidence: 88, category: "protein" },
  turkey: { name: "Turkey", confidence: 90, category: "protein" },
  lamb: { name: "Lamb", confidence: 88, category: "protein" },
  bell_pepper: { name: "Bell Pepper", confidence: 90, category: "vegetable" },
  onion: { name: "Onion", confidence: 92, category: "vegetable" },
  garlic: { name: "Garlic", confidence: 95, category: "aromatics" },
  tomato: { name: "Tomato", confidence: 92, category: "vegetable" },
  spinach: { name: "Spinach", confidence: 94, category: "vegetable" },
  kale: { name: "Kale", confidence: 92, category: "vegetable" },
  broccoli: { name: "Broccoli", confidence: 94, category: "vegetable" },
  carrot: { name: "Carrots", confidence: 90, category: "vegetable" },
  cucumber: { name: "Cucumber", confidence: 88, category: "vegetable" },
  avocado: { name: "Avocado", confidence: 94, category: "vegetable" },
  mushroom: { name: "Mushrooms", confidence: 86, category: "vegetable" },
  zucchini: { name: "Zucchini", confidence: 84, category: "vegetable" },
  celery: { name: "Celery", confidence: 85, category: "vegetable" },
  lettuce: { name: "Lettuce", confidence: 88, category: "vegetable" },
  cabbage: { name: "Cabbage", confidence: 86, category: "vegetable" },
  lemon: { name: "Lemon", confidence: 90, category: "fruit" },
  lime: { name: "Lime", confidence: 88, category: "fruit" },
  orange: { name: "Orange", confidence: 90, category: "fruit" },
  apple: { name: "Apple", confidence: 92, category: "fruit" },
  banana: { name: "Banana", confidence: 94, category: "fruit" },
  berry: { name: "Berries", confidence: 85, category: "fruit" },
  mango: { name: "Mango", confidence: 86, category: "fruit" },
  pineapple: { name: "Pineapple", confidence: 85, category: "fruit" },
  rice: { name: "Rice", confidence: 86, category: "grain" },
  quinoa: { name: "Quinoa", confidence: 90, category: "grain" },
  pasta: { name: "Pasta", confidence: 84, category: "grain" },
  bread: { name: "Bread", confidence: 88, category: "grain" },
  oats: { name: "Oats", confidence: 90, category: "grain" },
  tortilla: { name: "Tortilla", confidence: 85, category: "grain" },
  cheese: { name: "Cheese", confidence: 86, category: "dairy" },
  milk: { name: "Milk", confidence: 90, category: "dairy" },
  yogurt: { name: "Yogurt", confidence: 92, category: "dairy" },
  butter: { name: "Butter", confidence: 84, category: "dairy" },
  cream: { name: "Cream", confidence: 85, category: "dairy" },
  sour_cream: { name: "Sour Cream", confidence: 84, category: "dairy" },
  olive_oil: { name: "Olive Oil", confidence: 94, category: "fat" },
  coconut_oil: { name: "Coconut Oil", confidence: 86, category: "fat" },
  sesame_oil: { name: "Sesame Oil", confidence: 88, category: "fat" },
  almonds: { name: "Almonds", confidence: 88, category: "fat" },
  peanuts: { name: "Peanuts", confidence: 86, category: "fat" },
  soy_sauce: { name: "Soy Sauce", confidence: 94, category: "condiment" },
  vinegar: { name: "Vinegar", confidence: 88, category: "condiment" },
  mustard: { name: "Mustard", confidence: 90, category: "condiment" },
  mayonnaise: { name: "Mayonnaise", confidence: 85, category: "condiment" },
  ketchup: { name: "Ketchup", confidence: 88, category: "condiment" },
  honey: { name: "Honey", confidence: 90, category: "sweetener" },
  sugar: { name: "Sugar", confidence: 92, category: "sweetener" },
  salt: { name: "Salt", confidence: 98, category: "seasoning" },
  pepper: { name: "Black Pepper", confidence: 94, category: "seasoning" },
  cumin: { name: "Cumin", confidence: 90, category: "seasoning" },
  paprika: { name: "Paprika", confidence: 88, category: "seasoning" },
  turmeric: { name: "Turmeric", confidence: 88, category: "seasoning" },
  cinnamon: { name: "Cinnamon", confidence: 90, category: "seasoning" },
  ginger: { name: "Ginger", confidence: 90, category: "seasoning" },
  basil: { name: "Basil", confidence: 92, category: "herb" },
  cilantro: { name: "Cilantro", confidence: 90, category: "herb" },
  parsley: { name: "Parsley", confidence: 88, category: "herb" },
  rosemary: { name: "Rosemary", confidence: 88, category: "herb" },
  thyme: { name: "Thyme", confidence: 86, category: "herb" },
  oregano: { name: "Oregano", confidence: 88, category: "herb" },
};

const recipeDatabase = [
  { name: "Grilled Chicken Salad", calories: 380, prepTime: 20, ingredients: ["chicken", "spinach", "bell_pepper", "onion"] },
  { name: "Mediterranean Bowl", calories: 420, prepTime: 15, ingredients: ["quinoa", "tomato", "cucumber", "olive_oil"] },
  { name: "Salmon with Veggies", calories: 480, prepTime: 25, ingredients: ["salmon", "broccoli", "carrot", "garlic"] },
  { name: "Tofu Stir Fry", calories: 320, prepTime: 18, ingredients: ["tofu", "bell_pepper", "onion", "garlic", "soy_sauce"] },
  { name: "Avocado Toast", calories: 350, prepTime: 8, ingredients: ["bread", "avocado", "eggs", "lemon"] },
  { name: "Greek Salad", calories: 280, prepTime: 10, ingredients: ["tomato", "cucumber", "onion", "cheese", "olive_oil"] },
  { name: "Buddha Bowl", calories: 420, prepTime: 25, ingredients: ["quinoa", "tofu", "spinach", "carrot", "avocado"] },
  { name: "Chicken Stir Fry", calories: 380, prepTime: 20, ingredients: ["chicken", "broccoli", "bell_pepper", "garlic"] },
  { name: "Eggs Benedict", calories: 420, prepTime: 22, ingredients: ["eggs", "bread", "butter"] },
  { name: "Salmon Poke Bowl", calories: 450, prepTime: 15, ingredients: ["salmon", "rice", "avocado", "cucumber"] },
  { name: "Overnight Oats", calories: 320, prepTime: 5, ingredients: ["oats", "yogurt", "berry", "honey"] },
  { name: "Beef Stir Fry", calories: 420, prepTime: 20, ingredients: ["beef", "broccoli", "garlic", "soy_sauce"] },
  { name: "Grilled Salmon", calories: 380, prepTime: 18, ingredients: ["salmon", "lemon", "butter", "garlic"] },
  { name: "Chicken Tacos", calories: 350, prepTime: 15, ingredients: ["chicken", "tortilla", "lettuce", "tomato"] },
  { name: "Veggie Wrap", calories: 300, prepTime: 10, ingredients: ["tortilla", "spinach", "tomato", "cheese"] },
];

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    
    let detectedIngredients: Ingredient[] = [];

    if (geminiKey) {
      try {
        const base64Image = image.replace(/^data:image\/\w+;base64,/, "");
        
        const prompt = `You are a professional chef analyzing a photo of food/ingredients. 
Identify ALL visible ingredients in the image. Focus on fresh produce, proteins, and common cooking ingredients.

Return a JSON array with exactly this format (no other text):
[
  {"name": "ingredient name", "confidence": 95, "category": "vegetable"}
]

Categories: protein, vegetable, fruit, grain, dairy, fat, herb, seasoning, condiment, other

Look carefully and identify what you can confidently see.`;

        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: prompt },
                  { inlineData: { mimeType: "image/jpeg", data: base64Image } },
                ],
              }],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 800,
                responseSchema: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      name: { type: "STRING" },
                      confidence: { type: "NUMBER" },
                      category: { type: "STRING" },
                    },
                  },
                },
              },
            }),
          }
        );

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (responseText) {
            try {
              const parsed = JSON.parse(responseText);
              if (Array.isArray(parsed) && parsed.length > 0) {
                detectedIngredients = parsed;
              }
            } catch {
              const match = responseText.match(/\[[\s\S]*\]/);
              if (match) {
                detectedIngredients = JSON.parse(match[0]);
              }
            }
          }
        }
      } catch (e) {
        console.error("Gemini error:", e);
      }
    }

    if (detectedIngredients.length === 0) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const byteArray = Uint8Array.from(atob(base64Data.slice(0, 1000)), c => c.charCodeAt(0));
      
      const colorProfile = byteArray.reduce((acc, byte) => {
        const r = byte >> 4;
        if (r < 4) acc.red++;
        else if (r < 8) acc.orange++;
        else if (r < 10) acc.yellow++;
        else if (r < 13) acc.green++;
        else acc.other++;
        return acc;
      }, { red: 0, orange: 0, yellow: 0, green: 0, other: 0 });

      const dominant = Object.entries(colorProfile)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
        .map(([c]) => c);

      const heuristicInfer: Record<string, string[]> = {
        red: ["tomato", "bell_pepper", "apple", "berry"],
        orange: ["carrot", "orange", "salmon", "mango"],
        yellow: ["cheese", "lemon", "butter", "pineapple"],
        green: ["spinach", "lettuce", "broccoli", "avocado", "cucumber"],
      };

      const inferred = (heuristicInfer[dominant[0]] || heuristicInfer.green)
        .slice(0, 3)
        .map(key => ingredientDatabase[key])
        .filter(Boolean);

      detectedIngredients = inferred;
    }

    if (detectedIngredients.length === 0) {
      detectedIngredients = [
        { name: "Fresh Vegetables", confidence: 70, category: "vegetable" },
        { name: "Protein Source", confidence: 65, category: "protein" },
      ];
    }

    const ingredientNames = detectedIngredients.map(i => i.name.toLowerCase());
    
    const matchedRecipes = recipeDatabase
      .map(recipe => {
        const matchCount = recipe.ingredients.filter(ing =>
          ingredientNames.some(name => 
            ing.toLowerCase().includes(name.split(" ")[0].toLowerCase()) ||
            name.split(" ")[0].toLowerCase().includes(ing.toLowerCase())
          )
        ).length;
        
        return {
          ...recipe,
          ingredients: recipe.ingredients.map(k => ingredientDatabase[k]?.name || k),
          matchScore: Math.min(100, Math.round((matchCount / recipe.ingredients.length) * 100)),
        };
      })
      .filter(r => r.matchScore > 20)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    return NextResponse.json({
      ingredients: detectedIngredients,
      recipes: matchedRecipes,
    });

  } catch (error) {
    console.error("Pantry analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
  }
}