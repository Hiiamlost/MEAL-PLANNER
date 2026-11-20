/**
 * NutriZen Recipe Database
 * Comprehensive catalog across Breakfast, Lunch, Dinner, and Snacks.
 * Includes detailed Macros, Micronutrients, Allergens, Dietary tags, and Scalable Ingredients.
 */

const RECIPES_DATA = [
  // --- BREAKFAST ---
  {
    id: "rec_b1",
    title: "Golden Turmeric Berry Oatmeal Bowl",
    category: "breakfast",
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80",
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    difficulty: "Easy",
    cost: "$",
    dietary: ["vegetarian", "vegan", "mediterranean", "jain", "omnivore"],
    allergens: ["gluten"], // can be GF if certified oats
    equipment: ["stovetop", "microwave"],
    calories: 380,
    macros: { protein: 14, carbs: 62, fat: 9, fiber: 11, sugar: 14, sodium: 85 },
    micros: {
      vitaminA: 420, // mcg
      vitaminC: 28,  // mg
      vitaminD: 2.1, // mcg
      vitaminB12: 1.2,
      iron: 4.2,     // mg
      calcium: 260,  // mg
      potassium: 540,// mg
      magnesium: 110,// mg
      zinc: 2.5
    },
    ingredients: [
      { name: "Rolled Oats", amount: 60, unit: "g", aisle: "Grains & Cereals" },
      { name: "Almond Milk (Unsweetened)", amount: 200, unit: "ml", aisle: "Dairy & Plant Milks" },
      { name: "Fresh Blueberries", amount: 60, unit: "g", aisle: "Fresh Produce" },
      { name: "Chia Seeds", amount: 12, unit: "g", aisle: "Pantry & Seeds" },
      { name: "Ground Turmeric & Cinnamon", amount: 2, unit: "g", aisle: "Spices & Seasonings" },
      { name: "Pure Maple Syrup", amount: 10, unit: "ml", aisle: "Pantry & Sweeteners" }
    ],
    instructions: [
      "Combine rolled oats, almond milk, turmeric, and cinnamon in a small saucepan over medium heat.",
      "Bring to a gentle simmer and cook for 5-7 minutes, stirring occasionally until creamy.",
      "Remove from heat and stir in chia seeds.",
      "Transfer to a bowl, top with fresh blueberries and drizzle with pure maple syrup."
    ],
    prepNotes: "Great for overnight oats! Combine dry ingredients and almond milk in a mason jar in the fridge overnight."
  },
  {
    id: "rec_b2",
    title: "Mediterranean Avocado & Poached Egg Sourdough",
    category: "breakfast",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    prepTime: 5,
    cookTime: 7,
    servings: 1,
    difficulty: "Easy",
    cost: "$$",
    dietary: ["vegetarian", "mediterranean", "high-protein", "pescatarian", "omnivore"],
    allergens: ["eggs", "gluten"],
    equipment: ["stovetop", "toaster"],
    calories: 440,
    macros: { protein: 22, carbs: 36, fat: 24, fiber: 8, sugar: 3, sodium: 420 },
    micros: {
      vitaminA: 650,
      vitaminC: 15,
      vitaminD: 3.5,
      vitaminB12: 1.8,
      iron: 3.8,
      calcium: 180,
      potassium: 680,
      magnesium: 95,
      zinc: 2.8
    },
    ingredients: [
      { name: "Artisan Sourdough Bread", amount: 2, unit: "slices", aisle: "Bakery" },
      { name: "Ripe Hass Avocado", amount: 0.5, unit: "whole", aisle: "Fresh Produce" },
      { name: "Pasture-Raised Eggs", amount: 2, unit: "large", aisle: "Dairy & Eggs" },
      { name: "Cherry Tomatoes", amount: 50, unit: "g", aisle: "Fresh Produce" },
      { name: "Feta Cheese Crumbles", amount: 20, unit: "g", aisle: "Dairy & Cheeses" },
      { name: "Red Pepper Flakes & Microgreens", amount: 1, unit: "pinch", aisle: "Fresh Produce" }
    ],
    instructions: [
      "Toast sourdough slices until crisp and golden brown.",
      "Mash avocado with a squeeze of lemon juice, sea salt, and black pepper; spread evenly over toast.",
      "Bring a shallow pan of water to a simmer, gently poach eggs for 3-4 minutes until whites are set but yolks runny.",
      "Place poached eggs on toast, scatter halved cherry tomatoes, crumbled feta, and microgreens."
    ],
    prepNotes: "Boil eggs ahead of time for a grab-and-go weekday version."
  },
  {
    id: "rec_b3",
    title: "Keto Smoked Salmon & Cream Cheese Omelette",
    category: "breakfast",
    image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80",
    prepTime: 5,
    cookTime: 6,
    servings: 1,
    difficulty: "Easy",
    cost: "$$$",
    dietary: ["keto", "low-carb", "pescatarian", "high-protein", "omnivore"],
    allergens: ["eggs", "fish", "dairy"],
    equipment: ["stovetop"],
    calories: 460,
    macros: { protein: 34, carbs: 4, fat: 34, fiber: 1, sugar: 2, sodium: 620 },
    micros: {
      vitaminA: 820,
      vitaminC: 4,
      vitaminD: 8.5,
      vitaminB12: 4.8,
      iron: 2.9,
      calcium: 210,
      potassium: 490,
      magnesium: 60,
      zinc: 3.1
    },
    ingredients: [
      { name: "Whole Eggs", amount: 3, unit: "large", aisle: "Dairy & Eggs" },
      { name: "Wild Alaskan Smoked Salmon", amount: 60, unit: "g", aisle: "Meat & Seafood" },
      { name: "Organic Cream Cheese", amount: 25, unit: "g", aisle: "Dairy & Cheeses" },
      { name: "Fresh Dill & Chives", amount: 10, unit: "g", aisle: "Fresh Produce" },
      { name: "Extra Virgin Olive Oil", amount: 1, unit: "tsp", aisle: "Pantry & Oils" }
    ],
    instructions: [
      "Whisk eggs with a splash of water, pinch of sea salt, and black pepper until frothy.",
      "Heat olive oil in a non-stick skillet over medium-low heat. Pour in eggs.",
      "Cook gently until bottom sets, then spoon dollops of cream cheese and smoked salmon over one half.",
      "Fold omelette, garnish with chopped fresh dill and chives, and serve immediately."
    ],
    prepNotes: "Smoked salmon and chopped herbs can be pre-portioned in small containers for 3 days."
  },
  {
    id: "rec_b4",
    title: "Protein Power Green Smoothie & Chia Parfait",
    category: "breakfast",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80",
    prepTime: 6,
    cookTime: 0,
    servings: 1,
    difficulty: "Easy",
    cost: "$$",
    dietary: ["vegan", "vegetarian", "high-protein", "gluten-free", "jain", "omnivore"],
    allergens: [],
    equipment: ["blender"],
    calories: 390,
    macros: { protein: 30, carbs: 45, fat: 10, fiber: 12, sugar: 18, sodium: 160 },
    micros: {
      vitaminA: 980,
      vitaminC: 65,
      vitaminD: 1.5,
      vitaminB12: 2.5,
      iron: 5.6,
      calcium: 380,
      potassium: 820,
      magnesium: 165,
      zinc: 3.4
    },
    ingredients: [
      { name: "Plant-based Vanilla Protein Powder", amount: 30, unit: "g", aisle: "Supplements & Nutrition" },
      { name: "Baby Spinach", amount: 60, unit: "g", aisle: "Fresh Produce" },
      { name: "Frozen Banana", amount: 1, unit: "medium", aisle: "Fresh Produce" },
      { name: "Oat Milk (Unsweetened)", amount: 250, unit: "ml", aisle: "Dairy & Plant Milks" },
      { name: "Hemp Hearts", amount: 15, unit: "g", aisle: "Pantry & Seeds" },
      { name: "Fresh Ginger", amount: 5, unit: "g", aisle: "Fresh Produce" }
    ],
    instructions: [
      "Place baby spinach, frozen banana, and oat milk into a high-speed blender.",
      "Add vanilla protein powder, peeled fresh ginger, and hemp hearts.",
      "Blend on high for 60-90 seconds until silky smooth and vibrant green.",
      "Pour into an insulated tumbler or bowl and top with extra hemp hearts."
    ],
    prepNotes: "Freeze spinach and banana slices in silicone freezer bags for instant 2-minute morning blending."
  },
  {
    id: "rec_b5",
    title: "Spiced Indian Poha with Roasted Peanuts (Jain Friendly)",
    category: "breakfast",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    prepTime: 10,
    cookTime: 10,
    servings: 1,
    difficulty: "Easy",
    cost: "$",
    dietary: ["vegetarian", "vegan", "gluten-free", "jain", "omnivore"],
    allergens: ["peanuts"],
    equipment: ["stovetop"],
    calories: 350,
    macros: { protein: 10, carbs: 54, fat: 11, fiber: 6, sugar: 4, sodium: 310 },
    micros: {
      vitaminA: 310,
      vitaminC: 38,
      vitaminD: 0,
      vitaminB12: 0,
      iron: 4.8,
      calcium: 75,
      potassium: 360,
      magnesium: 85,
      zinc: 1.9
    },
    ingredients: [
      { name: "Thick Flattened Rice (Poha)", amount: 80, unit: "g", aisle: "Grains & Cereals" },
      { name: "Raw Peanuts", amount: 20, unit: "g", aisle: "Pantry & Nuts" },
      { name: "Green Peas (Fresh or Frozen)", amount: 40, unit: "g", aisle: "Frozen Foods" },
      { name: "Mustard Seeds & Curry Leaves", amount: 5, unit: "g", aisle: "Spices & Seasonings" },
      { name: "Turmeric & Green Chili", amount: 3, unit: "g", aisle: "Spices & Seasonings" },
      { name: "Fresh Lemon Juice & Cilantro", amount: 10, unit: "ml", aisle: "Fresh Produce" }
    ],
    instructions: [
      "Rinse poha in a colander under running water for 30 seconds; drain well and set aside.",
      "Heat 1 tsp oil in a pan, roast peanuts until crunchy and lightly browned; remove.",
      "Add mustard seeds and curry leaves until they splutter, then stir in green peas and turmeric.",
      "Toss in the softened poha, lemon juice, and salt. Mix gently on low heat for 3 minutes.",
      "Garnish with roasted peanuts and fresh coriander leaves."
    ],
    prepNotes: "Poha can be rinsed and spices pre-measured ahead of time."
  },

  // --- LUNCH ---
  {
    id: "rec_l1",
    title: "Mediterranean Lemon Herb Grilled Chicken Quinoa Bowl",
    category: "lunch",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    prepTime: 12,
    cookTime: 15,
    servings: 1,
    difficulty: "Easy",
    cost: "$$",
    dietary: ["mediterranean", "high-protein", "gluten-free", "omnivore"],
    allergens: ["dairy"],
    equipment: ["stovetop", "air-fryer"],
    calories: 560,
    macros: { protein: 46, carbs: 48, fat: 20, fiber: 9, sugar: 6, sodium: 480 },
    micros: {
      vitaminA: 780,
      vitaminC: 54,
      vitaminD: 1.8,
      vitaminB12: 2.1,
      iron: 5.1,
      calcium: 190,
      potassium: 920,
      magnesium: 150,
      zinc: 4.2
    },
    ingredients: [
      { name: "Boneless Skinless Chicken Breast", amount: 160, unit: "g", aisle: "Meat & Seafood" },
      { name: "Cooked Tricolor Quinoa", amount: 120, unit: "g", aisle: "Grains & Cereals" },
      { name: "English Cucumber & Cherry Tomatoes", amount: 100, unit: "g", aisle: "Fresh Produce" },
      { name: "Kalamata Olives", amount: 25, unit: "g", aisle: "Canned Goods & Pickles" },
      { name: "Authentic Greek Feta", amount: 25, unit: "g", aisle: "Dairy & Cheeses" },
      { name: "Lemon Oregano Vinaigrette", amount: 15, unit: "ml", aisle: "Condiments & Dressings" }
    ],
    instructions: [
      "Season chicken breast with dried oregano, garlic powder, salt, pepper, and lemon juice.",
      "Grill in a pan or air fry at 200°C (390°F) for 12-14 minutes until juicy and cooked through; slice.",
      "Assemble bowl with fluffy cooked quinoa as the base.",
      "Arrange sliced chicken, diced cucumbers, tomatoes, olives, and crumbled feta cheese.",
      "Drizzle with lemon oregano vinaigrette and serve."
    ],
    prepNotes: "Cook a batch of quinoa and 4 chicken breasts on Sunday. Assemble bowls in 3 minutes all week."
  },
  {
    id: "rec_l2",
    title: "Crispy Sesame Tofu & Edamame Rainbow Nourish Bowl",
    category: "lunch",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    prepTime: 15,
    cookTime: 15,
    servings: 1,
    difficulty: "Medium",
    cost: "$$",
    dietary: ["vegan", "vegetarian", "gluten-free", "high-protein", "omnivore"],
    allergens: ["soy", "sesame"],
    equipment: ["oven", "air-fryer"],
    calories: 510,
    macros: { protein: 34, carbs: 52, fat: 18, fiber: 14, sugar: 8, sodium: 520 },
    micros: {
      vitaminA: 1120,
      vitaminC: 84,
      vitaminD: 0,
      vitaminB12: 1.5,
      iron: 7.4,
      calcium: 420,
      potassium: 880,
      magnesium: 190,
      zinc: 3.9
    },
    ingredients: [
      { name: "Extra Firm Organic Tofu", amount: 180, unit: "g", aisle: "Tofu & Plant Proteins" },
      { name: "Shelled Edamame Beans", amount: 70, unit: "g", aisle: "Frozen Foods" },
      { name: "Brown Jasmine Rice", amount: 100, unit: "g", aisle: "Grains & Cereals" },
      { name: "Shredded Purple Cabbage & Carrots", amount: 80, unit: "g", aisle: "Fresh Produce" },
      { name: "Toasted Sesame Oil & Tamari", amount: 15, unit: "ml", aisle: "Asian & International" },
      { name: "Tahini Ginger Dressing", amount: 20, unit: "g", aisle: "Condiments & Dressings" }
    ],
    instructions: [
      "Press tofu, cut into bite-sized cubes, toss with cornstarch and a splash of tamari.",
      "Air fry at 195°C (385°F) for 14 minutes until irresistibly crispy on all sides.",
      "Steam edamame for 3 minutes until tender bright green.",
      "In a wide bowl, layer brown rice, shredded cabbage, carrots, edamame, and crispy tofu.",
      "Drizzle with creamy tahini ginger dressing and sprinkle with toasted sesame seeds."
    ],
    prepNotes: "Tofu can be pre-cubed and stored in marinade. Air fry fresh for maximum crispiness."
  },
  {
    id: "rec_l3",
    title: "Zesty Chipotle Black Bean & Avocado Burrito Bowl",
    category: "lunch",
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80",
    prepTime: 10,
    cookTime: 10,
    servings: 1,
    difficulty: "Easy",
    cost: "$",
    dietary: ["vegetarian", "vegan", "gluten-free", "jain", "omnivore"],
    allergens: [],
    equipment: ["stovetop", "microwave"],
    calories: 480,
    macros: { protein: 20, carbs: 68, fat: 15, fiber: 18, sugar: 4, sodium: 490 },
    micros: {
      vitaminA: 640,
      vitaminC: 45,
      vitaminD: 0,
      vitaminB12: 0,
      iron: 5.8,
      calcium: 160,
      potassium: 940,
      magnesium: 175,
      zinc: 3.2
    },
    ingredients: [
      { name: "Organic Black Beans (Rinsed)", amount: 150, unit: "g", aisle: "Canned Goods & Beans" },
      { name: "Cilantro Lime Brown Rice", amount: 120, unit: "g", aisle: "Grains & Cereals" },
      { name: "Sweet Corn Kernels", amount: 50, unit: "g", aisle: "Frozen Foods" },
      { name: "Fresh Avocado", amount: 0.5, unit: "whole", aisle: "Fresh Produce" },
      { name: "Roasted Tomato Salsa", amount: 40, unit: "g", aisle: "Condiments & Dressings" },
      { name: "Fresh Cilantro & Lime Wedge", amount: 10, unit: "g", aisle: "Fresh Produce" }
    ],
    instructions: [
      "Warm black beans with ground cumin, oregano, and a pinch of chili powder.",
      "Spoon cilantro lime brown rice into meal prep container or bowl.",
      "Arrange warm spiced beans, sweet corn, roasted salsa, and diced avocado.",
      "Garnish with chopped cilantro and squeeze fresh lime juice over the top."
    ],
    prepNotes: "Black beans and rice keep fresh for 5 days in airtight glass containers."
  },
  {
    id: "rec_l4",
    title: "Keto Avocado Turkey Bacon Caesar Salad",
    category: "lunch",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    prepTime: 10,
    cookTime: 5,
    servings: 1,
    difficulty: "Easy",
    cost: "$$",
    dietary: ["keto", "low-carb", "high-protein", "gluten-free", "omnivore"],
    allergens: ["eggs", "dairy", "fish"],
    equipment: ["stovetop"],
    calories: 520,
    macros: { protein: 42, carbs: 6, fat: 36, fiber: 6, sugar: 2, sodium: 640 },
    micros: {
      vitaminA: 910,
      vitaminC: 22,
      vitaminD: 2.2,
      vitaminB12: 2.9,
      iron: 3.4,
      calcium: 310,
      potassium: 760,
      magnesium: 80,
      zinc: 3.5
    },
    ingredients: [
      { name: "Grilled Roast Turkey Breast", amount: 150, unit: "g", aisle: "Meat & Seafood" },
      { name: "Crispy Uncured Turkey Bacon", amount: 2, unit: "slices", aisle: "Meat & Seafood" },
      { name: "Crisp Romaine Hearts", amount: 120, unit: "g", aisle: "Fresh Produce" },
      { name: "Aged Shaved Parmesan", amount: 30, unit: "g", aisle: "Dairy & Cheeses" },
      { name: "Avocado", amount: 0.5, unit: "whole", aisle: "Fresh Produce" },
      { name: "Creamy Caesar Dressing", amount: 25, unit: "ml", aisle: "Condiments & Dressings" }
    ],
    instructions: [
      "Chop fresh romaine lettuce and place into a large wooden salad bowl.",
      "Pan-fry turkey bacon until crisp, drain and crumble.",
      "Top lettuce with sliced roasted turkey, diced avocado, bacon bits, and shaved parmesan.",
      "Toss with Caesar dressing just before eating."
    ],
    prepNotes: "Keep greens and dressing separated until ready to serve."
  },
  {
    id: "rec_l5",
    title: "Paneer & Spinach Palak Khichdi (Jain Friendly)",
    category: "lunch",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    prepTime: 10,
    cookTime: 20,
    servings: 1,
    difficulty: "Medium",
    cost: "$",
    dietary: ["vegetarian", "gluten-free", "jain", "high-protein", "omnivore"],
    allergens: ["dairy"],
    equipment: ["instant-pot", "stovetop"],
    calories: 490,
    macros: { protein: 24, carbs: 58, fat: 18, fiber: 8, sugar: 3, sodium: 410 },
    micros: {
      vitaminA: 1250,
      vitaminC: 32,
      vitaminD: 1.0,
      vitaminB12: 1.1,
      iron: 6.2,
      calcium: 390,
      potassium: 620,
      magnesium: 140,
      zinc: 3.0
    },
    ingredients: [
      { name: "Yellow Moong Dal & Rice Mix", amount: 90, unit: "g", aisle: "Grains & Cereals" },
      { name: "Fresh Paneer Cubes", amount: 80, unit: "g", aisle: "Dairy & Cheeses" },
      { name: "Blanched Spinach Puree", amount: 100, unit: "g", aisle: "Fresh Produce" },
      { name: "Pure Cow Ghee", amount: 10, unit: "g", aisle: "Pantry & Oils" },
      { name: "Cumin Seeds, Asafoetida & Turmeric", amount: 4, unit: "g", aisle: "Spices & Seasonings" },
      { name: "Rock Salt & Fresh Ginger", amount: 5, unit: "g", aisle: "Fresh Produce" }
    ],
    instructions: [
      "Wash moong dal and rice; pressure cook with 3 cups water, salt, and turmeric for 3 whistles.",
      "In a skillet, heat ghee, crackle cumin seeds and hing (asafoetida), and add fresh grated ginger.",
      "Pour in smooth spinach puree and simmer for 3 minutes.",
      "Stir in light pan-seared paneer cubes and cooked soft khichdi. Simmer until harmonized.",
      "Serve warm with a drizzle of warm ghee."
    ],
    prepNotes: "Extremely soothing on the digestive system; stays warm for hours in a thermal lunchbox."
  },

  // --- DINNER ---
  {
    id: "rec_d1",
    title: "Pan-Seared Wild Salmon with Asparagus & Sweet Potato Mash",
    category: "dinner",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    prepTime: 10,
    cookTime: 18,
    servings: 1,
    difficulty: "Medium",
    cost: "$$$",
    dietary: ["mediterranean", "pescatarian", "gluten-free", "high-protein", "omnivore"],
    allergens: ["fish"],
    equipment: ["stovetop", "oven"],
    calories: 590,
    macros: { protein: 44, carbs: 42, fat: 27, fiber: 7, sugar: 9, sodium: 410 },
    micros: {
      vitaminA: 1420,
      vitaminC: 38,
      vitaminD: 14.2,
      vitaminB12: 5.8,
      iron: 3.9,
      calcium: 120,
      potassium: 1100,
      magnesium: 130,
      zinc: 2.9
    },
    ingredients: [
      { name: "Wild Alaskan Salmon Fillet", amount: 180, unit: "g", aisle: "Meat & Seafood" },
      { name: "Sweet Potato", amount: 180, unit: "g", aisle: "Fresh Produce" },
      { name: "Fresh Asparagus Spears", amount: 100, unit: "g", aisle: "Fresh Produce" },
      { name: "Extra Virgin Olive Oil", amount: 15, unit: "ml", aisle: "Pantry & Oils" },
      { name: "Fresh Garlic & Rosemary", amount: 5, unit: "g", aisle: "Fresh Produce" },
      { name: "Fresh Lemon Wedge", amount: 1, unit: "piece", aisle: "Fresh Produce" }
    ],
    instructions: [
      "Steam or boil sweet potato chunks until tender (12 min); mash with a touch of olive oil, salt, and nutmeg.",
      "Snap woody ends off asparagus; toss with olive oil, minced garlic, salt, and pepper.",
      "Heat a skillet over medium-high. Sear salmon skin-side down for 5 minutes until crispy, flip and cook 3-4 minutes.",
      "In the same skillet, saute asparagus for 4-5 minutes until tender-crisp.",
      "Plate the salmon alongside garlic asparagus and sweet potato mash; garnish with fresh lemon juice."
    ],
    prepNotes: "Sweet potato mash can be made in large batches and reheated throughout the week."
  },
  {
    id: "rec_d2",
    title: "Rich Coconut Chickpea & Spinach Tikka Masala",
    category: "dinner",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    prepTime: 10,
    cookTime: 20,
    servings: 1,
    difficulty: "Easy",
    cost: "$",
    dietary: ["vegan", "vegetarian", "gluten-free", "mediterranean", "jain", "omnivore"],
    allergens: [],
    equipment: ["stovetop", "instant-pot"],
    calories: 520,
    macros: { protein: 21, carbs: 64, fat: 20, fiber: 16, sugar: 8, sodium: 540 },
    micros: {
      vitaminA: 890,
      vitaminC: 48,
      vitaminD: 0,
      vitaminB12: 0,
      iron: 6.8,
      calcium: 240,
      potassium: 910,
      magnesium: 160,
      zinc: 3.8
    },
    ingredients: [
      { name: "Cooked Garbanzo Chickpeas", amount: 180, unit: "g", aisle: "Canned Goods & Beans" },
      { name: "Light Coconut Milk", amount: 120, unit: "ml", aisle: "Canned Goods & Coconut" },
      { name: "Crushed Tomatoes Puree", amount: 120, unit: "g", aisle: "Canned Goods & Tomatoes" },
      { name: "Baby Spinach Leaves", amount: 80, unit: "g", aisle: "Fresh Produce" },
      { name: "Garam Masala & Ground Cumin", amount: 5, unit: "g", aisle: "Spices & Seasonings" },
      { name: "Basmati Brown Rice", amount: 90, unit: "g", aisle: "Grains & Cereals" }
    ],
    instructions: [
      "In a heavy pot, warm olive or coconut oil, toast cumin seeds and garam masala for 30 seconds.",
      "Add crushed tomato puree and simmer for 5 minutes until flavors concentrate.",
      "Pour in coconut milk and chickpeas; gently simmer on low for 10-12 minutes.",
      "Fold in fresh baby spinach in batches until wilted.",
      "Serve warm over fluffy basmati brown rice."
    ],
    prepNotes: "Curries taste even better the next day! Stores well for up to 5 days in the fridge."
  },
  {
    id: "rec_d3",
    title: "Grass-Fed Lean Beef & Broccoli Stir-Fry with Cauliflower Rice",
    category: "dinner",
    image: "https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=800&q=80",
    prepTime: 12,
    cookTime: 10,
    servings: 1,
    difficulty: "Medium",
    cost: "$$$",
    dietary: ["keto", "low-carb", "high-protein", "omnivore"],
    allergens: ["soy", "sesame"],
    equipment: ["stovetop", "wok"],
    calories: 490,
    macros: { protein: 48, carbs: 12, fat: 28, fiber: 5, sugar: 4, sodium: 590 },
    micros: {
      vitaminA: 620,
      vitaminC: 98,
      vitaminD: 1.2,
      vitaminB12: 4.4,
      iron: 5.9,
      calcium: 110,
      potassium: 890,
      magnesium: 115,
      zinc: 6.8
    },
    ingredients: [
      { name: "Grass-Fed Flank Steak (Thinly Sliced)", amount: 170, unit: "g", aisle: "Meat & Seafood" },
      { name: "Fresh Broccoli Florets", amount: 140, unit: "g", aisle: "Fresh Produce" },
      { name: "Riced Cauliflower", amount: 150, unit: "g", aisle: "Fresh Produce" },
      { name: "Low-Sodium Tamari & Ginger", amount: 15, unit: "ml", aisle: "Asian & International" },
      { name: "Sesame Oil", amount: 10, unit: "ml", aisle: "Pantry & Oils" }
    ],
    instructions: [
      "Slice flank steak thinly against the grain; marinate in tamari, garlic, and minced ginger for 10 min.",
      "Heat wok with sesame oil on high heat. Flash-sear beef for 2-3 minutes until browned; transfer to plate.",
      "Add broccoli florets with 2 tbsp water; cover and steam for 3 minutes until crisp-tender.",
      "Return beef to wok with broccoli, toss vigorously for 1 minute.",
      "In a separate skillet, saute cauliflower rice for 4 minutes with a pinch of sea salt.",
      "Serve hot stir-fry over the cauliflower rice bed."
    ],
    prepNotes: "Slice and freeze meat in individual portions for quick defrosting."
  },
  {
    id: "rec_d4",
    title: "Mediterranean Baked Cod with Kalamata Tapenade & Lentils",
    category: "dinner",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    prepTime: 10,
    cookTime: 15,
    servings: 1,
    difficulty: "Easy",
    cost: "$$",
    dietary: ["mediterranean", "pescatarian", "high-protein", "gluten-free", "omnivore"],
    allergens: ["fish"],
    equipment: ["oven"],
    calories: 460,
    macros: { protein: 42, carbs: 38, fat: 16, fiber: 11, sugar: 3, sodium: 510 },
    micros: {
      vitaminA: 420,
      vitaminC: 24,
      vitaminD: 6.2,
      vitaminB12: 3.5,
      iron: 4.8,
      calcium: 115,
      potassium: 820,
      magnesium: 125,
      zinc: 2.6
    },
    ingredients: [
      { name: "Fresh Atlantic Cod Loin", amount: 180, unit: "g", aisle: "Meat & Seafood" },
      { name: "Cooked Brown Puy Lentils", amount: 130, unit: "g", aisle: "Canned Goods & Beans" },
      { name: "Kalamata Olives & Capers Tapenade", amount: 25, unit: "g", aisle: "Canned Goods & Pickles" },
      { name: "Sundried Tomatoes", amount: 20, unit: "g", aisle: "Pantry & Canned" },
      { name: "Extra Virgin Olive Oil & Lemon", amount: 12, unit: "ml", aisle: "Pantry & Oils" }
    ],
    instructions: [
      "Preheat oven to 200°C (400°F). Line a baking dish with parchment paper.",
      "Place cod fillet in dish, brush with olive oil, top with spoonfuls of olive tapenade and sundried tomatoes.",
      "Bake for 12-14 minutes until fish flakes easily with a fork.",
      "Warm cooked brown lentils with a touch of lemon juice, fresh parsley, and cracked black pepper.",
      "Spoon lentils onto plate and rest baked cod gently on top."
    ],
    prepNotes: "Pre-cooked steamed lentils from the produce aisle save 25 minutes of cooking time."
  },
  {
    id: "rec_d5",
    title: "Crispy Paneer Makhani Bowl with Steamed Jasmine Rice (Jain)",
    category: "dinner",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    prepTime: 12,
    cookTime: 18,
    servings: 1,
    difficulty: "Medium",
    cost: "$$",
    dietary: ["vegetarian", "gluten-free", "jain", "high-protein", "omnivore"],
    allergens: ["dairy", "nuts"],
    equipment: ["stovetop", "blender"],
    calories: 550,
    macros: { protein: 26, carbs: 54, fat: 26, fiber: 7, sugar: 7, sodium: 460 },
    micros: {
      vitaminA: 980,
      vitaminC: 36,
      vitaminD: 1.2,
      vitaminB12: 1.4,
      iron: 4.5,
      calcium: 440,
      potassium: 580,
      magnesium: 130,
      zinc: 3.4
    },
    ingredients: [
      { name: "Fresh Malai Paneer Cubes", amount: 120, unit: "g", aisle: "Dairy & Cheeses" },
      { name: "Vine-Ripened Tomato Gravy (No Onion/Garlic)", amount: 150, unit: "g", aisle: "Canned Goods & Tomatoes" },
      { name: "Raw Cashews (Soaked)", amount: 20, unit: "g", aisle: "Pantry & Nuts" },
      { name: "Steamed Jasmine Rice", amount: 100, unit: "g", aisle: "Grains & Cereals" },
      { name: "Kasuri Methi (Dried Fenugreek) & Cardamom", amount: 3, unit: "g", aisle: "Spices & Seasonings" },
      { name: "Fresh Dairy Cream", amount: 15, unit: "ml", aisle: "Dairy & Cheeses" }
    ],
    instructions: [
      "Blend soaked cashews with tomatoes until satin smooth.",
      "In a pan, melt 1 tsp ghee, add cinnamon and green cardamom, pour in tomato-cashew puree.",
      "Simmer for 8-10 minutes until aromatic and rich; add garam masala and crushed kasuri methi.",
      "Lightly toast paneer cubes in another pan, then fold into simmering gravy with cream.",
      "Serve warm with fragrant steamed jasmine rice."
    ],
    prepNotes: "The tomato-cashew base can be prepared in double portions and frozen for future curries."
  },

  // --- SNACKS ---
  {
    id: "rec_s1",
    title: "Greek Yogurt Berry Parfait with Honey & Walnuts",
    category: "snack",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
    prepTime: 4,
    cookTime: 0,
    servings: 1,
    difficulty: "Easy",
    cost: "$$",
    dietary: ["vegetarian", "mediterranean", "high-protein", "gluten-free", "jain", "omnivore"],
    allergens: ["dairy", "nuts"],
    equipment: ["none"],
    calories: 260,
    macros: { protein: 18, carbs: 24, fat: 10, fiber: 4, sugar: 16, sodium: 70 },
    micros: {
      vitaminA: 280,
      vitaminC: 18,
      vitaminD: 1.5,
      vitaminB12: 1.0,
      iron: 1.2,
      calcium: 220,
      potassium: 380,
      magnesium: 45,
      zinc: 1.8
    },
    ingredients: [
      { name: "0% Greek Yogurt", amount: 170, unit: "g", aisle: "Dairy & Cheeses" },
      { name: "Fresh Blackberries & Raspberries", amount: 50, unit: "g", aisle: "Fresh Produce" },
      { name: "Chopped Raw Walnuts", amount: 15, unit: "g", aisle: "Pantry & Nuts" },
      { name: "Raw Wildflower Honey", amount: 10, unit: "g", aisle: "Pantry & Sweeteners" }
    ],
    instructions: [
      "Spoon Greek yogurt into a dessert glass or bowl.",
      "Top with fresh berries and crushed raw walnuts.",
      "Drizzle with wildflower honey and enjoy cold."
    ],
    prepNotes: "Pack yogurt and berries in a glass jar, keeping nuts in a separate baggie to maintain crunch."
  },
  {
    id: "rec_s2",
    title: "Dark Chocolate Almond Energy Protein Bites",
    category: "snack",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    difficulty: "Easy",
    cost: "$",
    dietary: ["vegan", "vegetarian", "gluten-free", "jain", "omnivore"],
    allergens: ["nuts"],
    equipment: ["blender"],
    calories: 220,
    macros: { protein: 8, carbs: 26, fat: 10, fiber: 5, sugar: 15, sodium: 40 },
    micros: {
      vitaminA: 50,
      vitaminC: 1,
      vitaminD: 0,
      vitaminB12: 0,
      iron: 2.1,
      calcium: 75,
      potassium: 290,
      magnesium: 85,
      zinc: 1.4
    },
    ingredients: [
      { name: "Medjool Dates (Pitted)", amount: 4, unit: "pieces", aisle: "Produce & Dried Fruits" },
      { name: "Raw Almond Butter", amount: 25, unit: "g", aisle: "Nut Butters & Spreads" },
      { name: "85% Dark Chocolate Chips", amount: 15, unit: "g", aisle: "Baking & Chocolates" },
      { name: "Rolled Oats", amount: 30, unit: "g", aisle: "Grains & Cereals" },
      { name: "Flaxseed Meal", amount: 10, unit: "g", aisle: "Pantry & Seeds" }
    ],
    instructions: [
      "Pulse dates, almond butter, and rolled oats in a food processor until a sticky dough forms.",
      "Fold in dark chocolate chips and flaxseed meal.",
      "Roll into 4 round balls with your hands.",
      "Chill in refrigerator for 20 minutes to firm up."
    ],
    prepNotes: "Makes 4-8 energy balls; keeps well in the fridge for 2 weeks or freezer for 2 months."
  },
  {
    id: "rec_s3",
    title: "Crispy Roasted Spiced Chickpeas",
    category: "snack",
    image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80",
    prepTime: 5,
    cookTime: 20,
    servings: 1,
    difficulty: "Easy",
    cost: "$",
    dietary: ["vegan", "vegetarian", "gluten-free", "mediterranean", "jain", "high-protein", "omnivore"],
    allergens: [],
    equipment: ["oven", "air-fryer"],
    calories: 190,
    macros: { protein: 9, carbs: 26, fat: 6, fiber: 7, sugar: 2, sodium: 220 },
    micros: {
      vitaminA: 180,
      vitaminC: 6,
      vitaminD: 0,
      vitaminB12: 0,
      iron: 2.9,
      calcium: 55,
      potassium: 310,
      magnesium: 60,
      zinc: 1.6
    },
    ingredients: [
      { name: "Canned Chickpeas (Thoroughly Dried)", amount: 120, unit: "g", aisle: "Canned Goods & Beans" },
      { name: "Smoked Paprika & Cumin", amount: 3, unit: "g", aisle: "Spices & Seasonings" },
      { name: "Extra Virgin Olive Oil", amount: 5, unit: "ml", aisle: "Pantry & Oils" },
      { name: "Sea Salt & Garlic Powder", amount: 2, unit: "g", aisle: "Spices & Seasonings" }
    ],
    instructions: [
      "Pat chickpeas completely dry using paper towels (dry chickpeas equal extra crunch).",
      "Toss with olive oil, smoked paprika, cumin, and sea salt.",
      "Air fry at 190°C (375°F) for 15-18 minutes, shaking every 5 minutes until crunchy.",
      "Cool completely to reach peak crispiness."
    ],
    prepNotes: "Keep in an unsealed container on the counter to retain crispness."
  },
  {
    id: "rec_s4",
    title: "Keto Guacamole with Cucumber & Bell Pepper Dippers",
    category: "snack",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    prepTime: 6,
    cookTime: 0,
    servings: 1,
    difficulty: "Easy",
    cost: "$",
    dietary: ["keto", "low-carb", "vegan", "vegetarian", "gluten-free", "mediterranean", "jain", "omnivore"],
    allergens: [],
    equipment: ["none"],
    calories: 210,
    macros: { protein: 4, carbs: 11, fat: 18, fiber: 8, sugar: 3, sodium: 180 },
    micros: {
      vitaminA: 720,
      vitaminC: 68,
      vitaminD: 0,
      vitaminB12: 0,
      iron: 1.6,
      calcium: 45,
      potassium: 540,
      magnesium: 48,
      zinc: 1.1
    },
    ingredients: [
      { name: "Hass Avocado", amount: 1, unit: "whole", aisle: "Fresh Produce" },
      { name: "Fresh Lime Juice & Cilantro", amount: 10, unit: "ml", aisle: "Fresh Produce" },
      { name: "Crisp Persian Cucumber", amount: 1, unit: "medium", aisle: "Fresh Produce" },
      { name: "Bell Pepper Slices", amount: 60, unit: "g", aisle: "Fresh Produce" }
    ],
    instructions: [
      "Mash avocado with lime juice, chopped cilantro, sea salt, and a pinch of chili.",
      "Slice cucumbers and bell peppers into sturdy dipping spears.",
      "Dip crunchy fresh vegetables into creamy guacamole."
    ],
    prepNotes: "Store guacamole with pit in an airtight container with plastic wrap pressed onto the surface."
  },
  {
    id: "rec_s5",
    title: "High-Protein Edamame with Flaky Sea Salt & Chili Flakes",
    category: "snack",
    image: "https://images.unsplash.com/photo-1550989460-0adc9f677290?auto=format&fit=crop&w=800&q=80",
    prepTime: 2,
    cookTime: 5,
    servings: 1,
    difficulty: "Easy",
    cost: "$",
    dietary: ["vegan", "vegetarian", "gluten-free", "high-protein", "jain", "mediterranean", "omnivore"],
    allergens: ["soy"],
    equipment: ["stovetop", "microwave"],
    calories: 160,
    macros: { protein: 14, carbs: 10, fat: 7, fiber: 6, sugar: 2, sodium: 320 },
    micros: {
      vitaminA: 260,
      vitaminC: 14,
      vitaminD: 0,
      vitaminB12: 0,
      iron: 3.2,
      calcium: 95,
      potassium: 420,
      magnesium: 75,
      zinc: 1.7
    },
    ingredients: [
      { name: "Whole Edamame in Pods", amount: 180, unit: "g", aisle: "Frozen Foods" },
      { name: "Maldon Flaky Sea Salt", amount: 2, unit: "g", aisle: "Spices & Seasonings" },
      { name: "Crushed Red Pepper Flakes", amount: 1, unit: "pinch", aisle: "Spices & Seasonings" },
      { name: "Toasted Sesame Oil (optional drop)", amount: 2, unit: "ml", aisle: "Asian & International" }
    ],
    instructions: [
      "Boil or steam frozen edamame pods for 4-5 minutes until bright green and tender.",
      "Drain thoroughly and transfer to a serving bowl.",
      "Toss with flaky sea salt, red chili flakes, and a touch of sesame oil.",
      "Pop beans directly from pods into your mouth."
    ],
    prepNotes: "Keep a bag in the freezer for a quick 4-minute hot protein snack anytime."
  // --- ADDITIONAL RECIPES FOR VARIETY ---
  },
  {
    id: "rec_b6",
    title: "Vanilla Almond Chia Seed Pudding",
    category: "breakfast",
    image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: "Easy",
    cost: "$",
    dietary: ["vegan", "vegetarian", "keto", "low-carb", "gluten-free", "jain", "omnivore"],
    allergens: ["nuts"],
    equipment: ["none"],
    calories: 320,
    macros: { protein: 11, carbs: 18, fat: 22, fiber: 14, sugar: 4, sodium: 90 },
    micros: {
      vitaminA: 180,
      vitaminC: 12,
      vitaminD: 2.0,
      vitaminB12: 1.0,
      iron: 3.5,
      calcium: 390,
      potassium: 420,
      magnesium: 140,
      zinc: 2.1
    },
    ingredients: [
      { name: "Black Chia Seeds", amount: 35, unit: "g", aisle: "Pantry & Seeds" },
      { name: "Unsweetened Vanilla Almond Milk", amount: 220, unit: "ml", aisle: "Dairy & Plant Milks" },
      { name: "Pure Vanilla Extract & Stevia", amount: 3, unit: "ml", aisle: "Baking & Spices" },
      { name: "Sliced Strawberries", amount: 40, unit: "g", aisle: "Fresh Produce" },
      { name: "Toasted Slivered Almonds", amount: 15, unit: "g", aisle: "Pantry & Nuts" }
    ],
    instructions: [
      "Whisk chia seeds, almond milk, and vanilla extract in a mason jar until combined.",
      "Let sit for 10 minutes, whisk again to break clumps, then refrigerate for at least 2 hours or overnight.",
      "Top with ripe sliced strawberries and toasted almonds before serving."
    ],
    prepNotes: "Preps 4 jars in under 10 minutes on Sunday night for effortless grab-and-go mornings."
  },
  {
    id: "rec_b7",
    title: "Classic Shakshuka with Feta & Crusty Bread",
    category: "breakfast",
    image: "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80",
    prepTime: 8,
    cookTime: 14,
    servings: 1,
    difficulty: "Medium",
    cost: "$$",
    dietary: ["vegetarian", "mediterranean", "high-protein", "pescatarian", "omnivore"],
    allergens: ["eggs", "dairy", "gluten"],
    equipment: ["stovetop"],
    calories: 420,
    macros: { protein: 21, carbs: 38, fat: 21, fiber: 6, sugar: 7, sodium: 540 },
    micros: {
      vitaminA: 920,
      vitaminC: 75,
      vitaminD: 2.8,
      vitaminB12: 1.6,
      iron: 4.1,
      calcium: 210,
      potassium: 640,
      magnesium: 75,
      zinc: 2.4
    },
    ingredients: [
      { name: "Farm Fresh Eggs", amount: 2, unit: "large", aisle: "Dairy & Eggs" },
      { name: "Crushed San Marzano Tomatoes", amount: 180, unit: "g", aisle: "Canned Goods & Tomatoes" },
      { name: "Bell Pepper & Sweet Onion", amount: 80, unit: "g", aisle: "Fresh Produce" },
      { name: "Smoked Paprika & Cumin", amount: 4, unit: "g", aisle: "Spices & Seasonings" },
      { name: "Crumbled Greek Feta", amount: 25, unit: "g", aisle: "Dairy & Cheeses" },
      { name: "Sourdough Toast", amount: 1, unit: "slice", aisle: "Bakery" }
    ],
    instructions: [
      "Saute diced onions and bell peppers in olive oil until soft and sweet.",
      "Add cumin, paprika, and crushed tomatoes; simmer for 8 minutes into a thick sauce.",
      "Create two wells in the sauce and crack eggs gently inside.",
      "Cover and simmer on low heat for 5-6 minutes until whites are set and yolks remain runny.",
      "Sprinkle with feta and fresh parsley; dip toasted sourdough right into the pan."
    ],
    prepNotes: "The tomato sauce can be pre-made and refrigerated; crack fresh eggs in the morning."
  },
  {
    id: "rec_l6",
    title: "Mediterranean Tuna Nicoise & Quinoa Salad",
    category: "lunch",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    difficulty: "Easy",
    cost: "$$",
    dietary: ["mediterranean", "pescatarian", "high-protein", "gluten-free", "omnivore"],
    allergens: ["fish", "eggs"],
    equipment: ["none"],
    calories: 470,
    macros: { protein: 44, carbs: 36, fat: 17, fiber: 7, sugar: 4, sodium: 590 },
    micros: {
      vitaminA: 680,
      vitaminC: 32,
      vitaminD: 5.4,
      vitaminB12: 4.1,
      iron: 4.6,
      calcium: 120,
      potassium: 870,
      magnesium: 110,
      zinc: 3.1
    },
    ingredients: [
      { name: "Wild Albacore Tuna in Olive Oil", amount: 140, unit: "g", aisle: "Meat & Seafood" },
      { name: "Hard Boiled Egg", amount: 1, unit: "large", aisle: "Dairy & Eggs" },
      { name: "Cooked Quinoa", amount: 100, unit: "g", aisle: "Grains & Cereals" },
      { name: "Steamed Haricots Verts (Green Beans)", amount: 80, unit: "g", aisle: "Fresh Produce" },
      { name: "Kalamata Olives & Cherry Tomatoes", amount: 40, unit: "g", aisle: "Fresh Produce" },
      { name: "Dijon Mustard Dressing", amount: 15, unit: "ml", aisle: "Condiments & Dressings" }
    ],
    instructions: [
      "Layer cooked quinoa and fresh mixed greens in a lunch bowl.",
      "Arrange flaked tuna, halved hard-boiled egg, steamed green beans, and olives.",
      "Whisk extra virgin olive oil, Dijon mustard, and lemon juice; drizzle over salad."
    ],
    prepNotes: "Perfect cold lunch box meal that requires zero reheating at the office."
  },
  {
    id: "rec_l7",
    title: "Spiced Lentil Dal Tadka with Steamed Rice (Jain)",
    category: "lunch",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    prepTime: 10,
    cookTime: 20,
    servings: 1,
    difficulty: "Easy",
    cost: "$",
    dietary: ["vegan", "vegetarian", "gluten-free", "jain", "omnivore"],
    allergens: [],
    equipment: ["stovetop", "instant-pot"],
    calories: 460,
    macros: { protein: 22, carbs: 74, fat: 8, fiber: 15, sugar: 4, sodium: 430 },
    micros: {
      vitaminA: 520,
      vitaminC: 28,
      vitaminD: 0,
      vitaminB12: 0,
      iron: 6.5,
      calcium: 95,
      potassium: 810,
      magnesium: 135,
      zinc: 3.4
    },
    ingredients: [
      { name: "Yellow Toor & Moong Dal", amount: 90, unit: "g", aisle: "Grains & Cereals" },
      { name: "Tomatoes & Green Chili (No Onion)", amount: 80, unit: "g", aisle: "Fresh Produce" },
      { name: "Steamed Basmati Rice", amount: 110, unit: "g", aisle: "Grains & Cereals" },
      { name: "Ghee or Mustard Oil", amount: 10, unit: "ml", aisle: "Pantry & Oils" },
      { name: "Cumin Seeds, Hing & Curry Leaves", amount: 5, unit: "g", aisle: "Spices & Seasonings" },
      { name: "Fresh Cilantro & Lemon", amount: 10, unit: "g", aisle: "Fresh Produce" }
    ],
    instructions: [
      "Pressure cook dal with turmeric, chopped tomatoes, and salt until soft and creamy.",
      "Heat ghee in a tadka ladle, add cumin, hing (asafoetida), and curry leaves until fragrant.",
      "Pour hot sizzling tadka into the dal and cover immediately to infuse aromas.",
      "Garnish with chopped cilantro and serve piping hot alongside steamed rice."
    ],
    prepNotes: "Freezes wonderfully in portions for quick weekday lunches."
  },
  {
    id: "rec_d6",
    title: "Lemon Herb Baked Chicken Thighs with Roasted Veggies",
    category: "dinner",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    prepTime: 12,
    cookTime: 28,
    servings: 1,
    difficulty: "Easy",
    cost: "$$",
    dietary: ["high-protein", "mediterranean", "gluten-free", "keto", "low-carb", "omnivore"],
    allergens: [],
    equipment: ["oven"],
    calories: 540,
    macros: { protein: 44, carbs: 16, fat: 34, fiber: 6, sugar: 5, sodium: 490 },
    micros: {
      vitaminA: 820,
      vitaminC: 62,
      vitaminD: 2.1,
      vitaminB12: 3.1,
      iron: 3.8,
      calcium: 90,
      potassium: 780,
      magnesium: 85,
      zinc: 4.8
    },
    ingredients: [
      { name: "Bone-in Skinless Chicken Thighs", amount: 200, unit: "g", aisle: "Meat & Seafood" },
      { name: "Zucchini & Red Bell Pepper", amount: 140, unit: "g", aisle: "Fresh Produce" },
      { name: "Extra Virgin Olive Oil", amount: 15, unit: "ml", aisle: "Pantry & Oils" },
      { name: "Dried Thyme, Rosemary & Garlic Powder", amount: 5, unit: "g", aisle: "Spices & Seasonings" },
      { name: "Fresh Lemon Juice", amount: 15, unit: "ml", aisle: "Fresh Produce" }
    ],
    instructions: [
      "Toss chicken thighs and chopped vegetables with olive oil, herbs, salt, and pepper.",
      "Spread onto a parchment-lined baking sheet in a single layer.",
      "Roast at 205°C (400°F) for 25-28 minutes until chicken juices run clear and edges are caramelized.",
      "Squeeze fresh lemon over the tray before serving."
    ],
    prepNotes: "One-pan dinner means cleanup takes under 2 minutes."
  },
  {
    id: "rec_d7",
    title: "Stuffed Bell Peppers with Spiced Lentils & Goat Cheese",
    category: "dinner",
    image: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?auto=format&fit=crop&w=800&q=80",
    prepTime: 15,
    cookTime: 25,
    servings: 1,
    difficulty: "Medium",
    cost: "$$",
    dietary: ["vegetarian", "mediterranean", "gluten-free", "high-protein", "jain", "omnivore"],
    allergens: ["dairy"],
    equipment: ["oven"],
    calories: 460,
    macros: { protein: 23, carbs: 54, fat: 17, fiber: 14, sugar: 9, sodium: 430 },
    micros: {
      vitaminA: 1340,
      vitaminC: 165,
      vitaminD: 0.8,
      vitaminB12: 0.9,
      iron: 5.4,
      calcium: 210,
      potassium: 960,
      magnesium: 120,
      zinc: 3.1
    },
    ingredients: [
      { name: "Large Bell Peppers", amount: 2, unit: "whole", aisle: "Fresh Produce" },
      { name: "Cooked Brown Lentils", amount: 130, unit: "g", aisle: "Canned Goods & Beans" },
      { name: "Sweet Corn & Chopped Zucchini", amount: 60, unit: "g", aisle: "Fresh Produce" },
      { name: "Crumbled Goat Cheese", amount: 30, unit: "g", aisle: "Dairy & Cheeses" },
      { name: "Cumin, Coriander & Smoked Paprika", amount: 4, unit: "g", aisle: "Spices & Seasonings" }
    ],
    instructions: [
      "Cut tops off bell peppers and remove seeds.",
      "Mix cooked lentils, zucchini, sweet corn, spices, and half of the goat cheese in a bowl.",
      "Stuff mixture firmly into the pepper cavities; top with remaining goat cheese.",
      "Bake at 190°C (375°F) for 25 minutes until pepper skin is blistered and tender."
    ],
    prepNotes: "Can be fully stuffed and kept unbaked in the fridge for up to 2 days."
  },
  {
    id: "rec_s6",
    title: "Crispy Kale Chips with Nutritional Yeast & Sea Salt",
    category: "snack",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
    prepTime: 5,
    cookTime: 12,
    servings: 1,
    difficulty: "Easy",
    cost: "$",
    dietary: ["vegan", "vegetarian", "keto", "low-carb", "gluten-free", "jain", "mediterranean", "omnivore"],
    allergens: [],
    equipment: ["oven", "air-fryer"],
    calories: 140,
    macros: { protein: 6, carbs: 12, fat: 8, fiber: 4, sugar: 1, sodium: 210 },
    micros: {
      vitaminA: 1100,
      vitaminC: 80,
      vitaminD: 0,
      vitaminB12: 2.4, // from nutritional yeast
      iron: 2.4,
      calcium: 150,
      potassium: 490,
      magnesium: 60,
      zinc: 1.8
    },
    ingredients: [
      { name: "Fresh Curly Kale (Stems Removed)", amount: 90, unit: "g", aisle: "Fresh Produce" },
      { name: "Cold-Pressed Olive Oil", amount: 8, unit: "ml", aisle: "Pantry & Oils" },
      { name: "Fortified Nutritional Yeast", amount: 10, unit: "g", aisle: "Supplements & Nutrition" },
      { name: "Pink Himalayan Salt", amount: 2, unit: "g", aisle: "Spices & Seasonings" }
    ],
    instructions: [
      "Wash and dry kale leaves thoroughly with a salad spinner.",
      "Tear into bite-sized chips, massage gently with olive oil, salt, and nutritional yeast.",
      "Spread evenly on a baking sheet and bake at 150°C (300°F) for 10-12 minutes until light and crispy."
    ],
    prepNotes: "Keep in an airtight jar with a dry paper towel to maintain crunch."
  }
];

// Helper functions for recipes
const RecipeService = {
  getAll: () => RECIPES_DATA,

  getById: (id) => RECIPES_DATA.find(r => r.id === id),

  getByCategory: (category) => RECIPES_DATA.filter(r => r.category === category),

  filterRecipes: (preferences) => {
    return RECIPES_DATA.filter(recipe => {
      // 1. Check Dietary Pattern
      if (preferences.diet) {
        const diet = preferences.diet.toLowerCase();
        if (diet !== "omnivore") {
          if (!recipe.dietary.includes(diet)) {
            return false;
          }
        }
      }

      // 2. Check Allergies (Hard filters)
      if (preferences.allergies && preferences.allergies.length > 0) {
        const hasAllergy = preferences.allergies.some(allergen => 
          recipe.allergens.includes(allergen.toLowerCase())
        );
        if (hasAllergy) return false;
      }

      // 3. Max Cook/Prep Time
      if (preferences.maxTime) {
        if ((recipe.prepTime + recipe.cookTime) > preferences.maxTime) {
          return false;
        }
      }

      return true;
    });
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { RECIPES_DATA, RecipeService };
}
