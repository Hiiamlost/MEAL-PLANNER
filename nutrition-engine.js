/**
 * NutriZen Nutrition & Planning Engine
 * Implements Mifflin-St Jeor BMR, TDEE, Dynamic Macro Splits, Micronutrient RDA tracking,
 * and intelligent 7-Day Meal Plan generation with dietary/allergy guardrails.
 */

const NutritionEngine = {
  MEAL_CALORIE_SPLITS: {
    breakfast: 0.25,
    lunch: 0.30,
    dinner: 0.30,
    snack: 0.15
  },

  // Reference Daily Values (RDA / DV)
  DAILY_VALUES: {
    calories: 2000,
    protein: 50, // g (general base DV, overridden by user goal)
    carbs: 275,   // g
    fat: 78,      // g
    fiber: 28,    // g
    sodium: 2300, // mg max
    vitaminA: 900,   // mcg
    vitaminC: 90,    // mg
    vitaminD: 20,    // mcg
    vitaminB12: 2.4, // mcg
    iron: 18,        // mg
    calcium: 1000,   // mg
    potassium: 3400, // mg
    magnesium: 400,  // mg
    zinc: 11         // mg
  },

  // Calculate Basal Metabolic Rate (Mifflin-St Jeor)
  calculateBMR: function(profile) {
    const weight = Number(profile.weight) || 70; // kg
    const height = Number(profile.height) || 175; // cm
    const age = Number(profile.age) || 28;
    const gender = profile.gender || "male";

    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === "male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    return Math.round(bmr);
  },

  // Calculate Total Daily Energy Expenditure (TDEE)
  calculateTDEE: function(profile) {
    const bmr = this.calculateBMR(profile);
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extra: 1.9
    };
    const multiplier = activityMultipliers[profile.activityLevel] || 1.4;
    return Math.round(bmr * multiplier);
  },

  // Calculate Target Calories based on Goal
  calculateTargetCalories: function(profile) {
    const tdee = this.calculateTDEE(profile);
    const goal = profile.goal || "maintain";

    let target = tdee;
    if (goal === "weight_loss") {
      target = Math.round(tdee * 0.80); // 20% deficit
    } else if (goal === "build_muscle") {
      target = Math.round(tdee * 1.10); // 10% lean surplus
    } else if (goal === "gain_weight") {
      target = Math.round(tdee + 450);  // bulk surplus
    }
    // Floor target at healthy minimum
    return Math.max(1200, target);
  },

  // Calculate Target Macros (Grams & Percentages)
  calculateTargetMacros: function(targetCalories, approach) {
    // Splits: { carbs, protein, fat } percentages summing to 100
    let splits = { carbs: 45, protein: 25, fat: 30 }; // balanced

    if (approach === "high_protein") {
      splits = { carbs: 35, protein: 40, fat: 25 };
    } else if (approach === "keto" || approach === "low_carb") {
      splits = { carbs: 7, protein: 28, fat: 65 };
    } else if (approach === "mediterranean") {
      splits = { carbs: 50, protein: 20, fat: 30 };
    }

    const proteinGrams = Math.round((targetCalories * (splits.protein / 100)) / 4);
    const carbsGrams = Math.round((targetCalories * (splits.carbs / 100)) / 4);
    const fatGrams = Math.round((targetCalories * (splits.fat / 100)) / 9);
    const fiberGrams = Math.round((targetCalories / 1000) * 14); // 14g per 1000 kcal

    return {
      calories: targetCalories,
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams,
      fiber: fiberGrams,
      splits: splits
    };
  },

  scaleRecipeToCalories: function(recipe, targetCalories) {
    if (!recipe || !recipe.calories) return recipe;

    const multiplier = targetCalories / recipe.calories;
    const scaleValues = values => Object.fromEntries(
      Object.entries(values || {}).map(([key, value]) => [
        key,
        typeof value === "number" ? Number((value * multiplier).toFixed(2)) : value
      ])
    );

    return {
      ...recipe,
      calories: Math.round(targetCalories),
      servings: Number(((recipe.servings || 1) * multiplier).toFixed(2)),
      macros: scaleValues(recipe.macros),
      micros: scaleValues(recipe.micros),
      ingredients: (recipe.ingredients || []).map(ingredient => ({
        ...ingredient,
        amount: Number((ingredient.amount * multiplier).toFixed(2))
      }))
    };
  },

  getMealCalorieTargets: function(targetCalories) {
    const slots = Object.entries(this.MEAL_CALORIE_SPLITS);
    const targets = {};
    let remainingCalories = Math.round(targetCalories);

    slots.slice(0, -1).forEach(([slot, share]) => {
      targets[slot] = Math.round(targetCalories * share);
      remainingCalories -= targets[slot];
    });
    targets[slots[slots.length - 1][0]] = remainingCalories;

    return targets;
  },

  scaleDayToTarget: function(dayPlan, targetCalories) {
    const scaledPlan = { ...dayPlan };
    const mealTargets = this.getMealCalorieTargets(targetCalories);
    for (const [slot, calories] of Object.entries(mealTargets)) {
      scaledPlan[slot] = this.scaleRecipeToCalories(dayPlan[slot], calories);
    }
    return scaledPlan;
  },

  // Generate complete 7-Day Plan from profile & preferences
  generate7DayPlan: function(profile, options = {}) {
    const targetCalories = this.calculateTargetCalories(profile);
    const mealTargets = this.getMealCalorieTargets(targetCalories);
    const getSafeMeal = (pool, fallback, previousRecipe, targetCaloriesForMeal) => {
      const list = pool.length > 0 ? pool : fallback;
      if (list.length === 0) return null;

      const alternatives = previousRecipe
        ? list.filter(recipe => recipe.id !== previousRecipe.id)
        : list;
      const choices = alternatives.length > 0 ? alternatives : list;
      const closestChoices = choices
        .slice()
        .sort((a, b) => Math.abs(a.calories - targetCaloriesForMeal) - Math.abs(b.calories - targetCaloriesForMeal))
        .slice(0, Math.min(3, choices.length));
      const recipe = closestChoices[Math.floor(Math.random() * closestChoices.length)];

      return this.scaleRecipeToCalories(recipe, targetCaloriesForMeal);
    };

    // Filter recipes that meet hard guardrails (allergies & diet)
    const availableBreakfasts = RecipeService.filterRecipes({
      diet: profile.foodPattern,
      allergies: profile.allergies,
      maxTime: profile.maxPrepTime
    }).filter(r => r.category === "breakfast");

    const availableLunches = RecipeService.filterRecipes({
      diet: profile.foodPattern,
      allergies: profile.allergies,
      maxTime: profile.maxPrepTime
    }).filter(r => r.category === "lunch");

    const availableDinners = RecipeService.filterRecipes({
      diet: profile.foodPattern,
      allergies: profile.allergies,
      maxTime: profile.maxPrepTime
    }).filter(r => r.category === "dinner");

    const availableSnacks = RecipeService.filterRecipes({
      diet: profile.foodPattern,
      allergies: profile.allergies,
      maxTime: profile.maxPrepTime
    }).filter(r => r.category === "snack");

    // Fallbacks if user filters are overly restrictive
    const fallbackB = RecipeService.getByCategory("breakfast");
    const fallbackL = RecipeService.getByCategory("lunch");
    const fallbackD = RecipeService.getByCategory("dinner");
    const fallbackS = RecipeService.getByCategory("snack");

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const plan = {};

    days.forEach(day => {
      const previousDay = day === options.excludeDay
        ? options.previousDay
        : null;

      plan[day] = {
        breakfast: getSafeMeal(availableBreakfasts, fallbackB, previousDay?.breakfast, mealTargets.breakfast),
        lunch: getSafeMeal(availableLunches, fallbackL, previousDay?.lunch, mealTargets.lunch),
        dinner: getSafeMeal(availableDinners, fallbackD, previousDay?.dinner, mealTargets.dinner),
        snack: getSafeMeal(availableSnacks, fallbackS, previousDay?.snack, mealTargets.snack),
        completed: {
          breakfast: false,
          lunch: false,
          dinner: false,
          snack: false
        },
        waterGlasses: 0,
        mood: null
      };
    });

    return plan;
  },

  // Calculate Total Daily Nutrition for a Day's Meal Plan
  calculateDayTotals: function(dayPlan) {
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminB12: 0,
      iron: 0,
      calcium: 0,
      potassium: 0,
      magnesium: 0,
      zinc: 0
    };

    const meals = ["breakfast", "lunch", "dinner", "snack"];
    meals.forEach(m => {
      const recipe = dayPlan[m];
      if (recipe) {
        totals.calories += recipe.calories || 0;
        totals.protein += recipe.macros?.protein || 0;
        totals.carbs += recipe.macros?.carbs || 0;
        totals.fat += recipe.macros?.fat || 0;
        totals.fiber += recipe.macros?.fiber || 0;
        totals.sugar += recipe.macros?.sugar || 0;
        totals.sodium += recipe.macros?.sodium || 0;

        if (recipe.micros) {
          totals.vitaminA += recipe.micros.vitaminA || 0;
          totals.vitaminC += recipe.micros.vitaminC || 0;
          totals.vitaminD += recipe.micros.vitaminD || 0;
          totals.vitaminB12 += recipe.micros.vitaminB12 || 0;
          totals.iron += recipe.micros.iron || 0;
          totals.calcium += recipe.micros.calcium || 0;
          totals.potassium += recipe.micros.potassium || 0;
          totals.magnesium += recipe.micros.magnesium || 0;
          totals.zinc += recipe.micros.zinc || 0;
        }
      }
    });

    // Format all to 1 decimal place or integer
    totals.calories = Math.round(totals.calories);
    totals.protein = Math.round(totals.protein);
    totals.carbs = Math.round(totals.carbs);
    totals.fat = Math.round(totals.fat);
    totals.fiber = Math.round(totals.fiber);
    totals.sugar = Math.round(totals.sugar);
    totals.sodium = Math.round(totals.sodium);
    totals.vitaminA = Math.round(totals.vitaminA);
    totals.vitaminC = Math.round(totals.vitaminC);
    totals.vitaminD = Number(totals.vitaminD.toFixed(1));
    totals.vitaminB12 = Number(totals.vitaminB12.toFixed(1));
    totals.iron = Number(totals.iron.toFixed(1));
    totals.calcium = Math.round(totals.calcium);
    totals.potassium = Math.round(totals.potassium);
    totals.magnesium = Math.round(totals.magnesium);
    totals.zinc = Number(totals.zinc.toFixed(1));

    return totals;
  },

  // Calculate % of Daily Targets Achieved
  calculatePercentages: function(dayTotals, targetMacros) {
    const percentages = {
      calories: Math.min(150, Math.round((dayTotals.calories / (targetMacros.calories || 2000)) * 100)),
      protein: Math.min(150, Math.round((dayTotals.protein / (targetMacros.protein || 100)) * 100)),
      carbs: Math.min(150, Math.round((dayTotals.carbs / (targetMacros.carbs || 200)) * 100)),
      fat: Math.min(150, Math.round((dayTotals.fat / (targetMacros.fat || 65)) * 100)),
      fiber: Math.min(150, Math.round((dayTotals.fiber / (targetMacros.fiber || 28)) * 100)),
      // Micronutrients against Daily Values
      vitaminA: Math.min(150, Math.round((dayTotals.vitaminA / this.DAILY_VALUES.vitaminA) * 100)),
      vitaminC: Math.min(150, Math.round((dayTotals.vitaminC / this.DAILY_VALUES.vitaminC) * 100)),
      vitaminD: Math.min(150, Math.round((dayTotals.vitaminD / this.DAILY_VALUES.vitaminD) * 100)),
      vitaminB12: Math.min(150, Math.round((dayTotals.vitaminB12 / this.DAILY_VALUES.vitaminB12) * 100)),
      iron: Math.min(150, Math.round((dayTotals.iron / this.DAILY_VALUES.iron) * 100)),
      calcium: Math.min(150, Math.round((dayTotals.calcium / this.DAILY_VALUES.calcium) * 100)),
      potassium: Math.min(150, Math.round((dayTotals.potassium / this.DAILY_VALUES.potassium) * 100)),
      magnesium: Math.min(150, Math.round((dayTotals.magnesium / this.DAILY_VALUES.magnesium) * 100)),
      zinc: Math.min(150, Math.round((dayTotals.zinc / this.DAILY_VALUES.zinc) * 100))
    };
    return percentages;
  },

  // Aggregate Ingredients from 7-Day Plan into Aisle-Categorized Grocery List
  generateGroceryList: function(weeklyPlan) {
    const aisles = {
      "Fresh Produce": {},
      "Dairy & Cheeses": {},
      "Dairy & Plant Milks": {},
      "Dairy & Eggs": {},
      "Meat & Seafood": {},
      "Tofu & Plant Proteins": {},
      "Grains & Cereals": {},
      "Bakery": {},
      "Canned Goods & Beans": {},
      "Canned Goods & Tomatoes": {},
      "Canned Goods & Coconut": {},
      "Canned Goods & Pickles": {},
      "Pantry & Nuts": {},
      "Pantry & Seeds": {},
      "Pantry & Oils": {},
      "Pantry & Sweeteners": {},
      "Spices & Seasonings": {},
      "Condiments & Dressings": {},
      "Frozen Foods": {},
      "Asian & International": {},
      "Supplements & Nutrition": {},
      "Other": {}
    };

    const days = Object.keys(weeklyPlan);
    days.forEach(day => {
      const dayData = weeklyPlan[day];
      ["breakfast", "lunch", "dinner", "snack"].forEach(mealSlot => {
        const recipe = dayData[mealSlot];
        if (recipe && recipe.ingredients) {
          recipe.ingredients.forEach(item => {
            const aisleName = aisles[item.aisle] ? item.aisle : "Other";
            const key = item.name.toLowerCase().trim();

            if (!aisles[aisleName][key]) {
              aisles[aisleName][key] = {
                name: item.name,
                amount: item.amount,
                unit: item.unit,
                checked: false
              };
            } else {
              // Combine amounts if units match
              if (aisles[aisleName][key].unit === item.unit) {
                aisles[aisleName][key].amount += item.amount;
              }
            }
          });
        }
      });
    });

    // Clean up empty aisles
    const result = {};
    for (const [aisle, itemsObj] of Object.entries(aisles)) {
      const itemsList = Object.values(itemsObj);
      if (itemsList.length > 0) {
        result[aisle] = itemsList;
      }
    }
    return result;
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { NutritionEngine };
}
