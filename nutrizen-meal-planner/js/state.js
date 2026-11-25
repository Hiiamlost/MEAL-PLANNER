/**
 * NutriZen State Management
 * Persistent reactive store for profiles, active weekly plan, tracking, and grocery list.
 */

const DEFAULT_PROFILE = {
  id: "profile_default",
  name: "Alex Morgan",
  age: 28,
  gender: "female",
  height: 168, // cm
  weight: 65,  // kg
  goalWeight: 60, // kg
  activityLevel: "moderate", // sedentary, light, moderate, active, extra
  goal: "build_muscle", // weight_loss, maintain, build_muscle, gain_weight
  foodPattern: "mediterranean", // omnivore, vegetarian, vegan, pescatarian, jain, keto
  eatingApproach: "high_protein", // balanced, high_protein, keto, mediterranean
  allergies: [],
  dislikedFoods: "cilantro",
  cookingSkill: "intermediate",
  equipment: ["stovetop", "oven", "air-fryer", "blender"],
  budget: "$$",
  maxPrepTime: 40
};

const PRESET_PROFILES = [
  {
    id: "profile_alex",
    name: "Alex Morgan (High-Protein Mediterranean)",
    age: 28,
    gender: "female",
    height: 168,
    weight: 65,
    goalWeight: 60,
    activityLevel: "moderate",
    goal: "build_muscle",
    foodPattern: "mediterranean",
    eatingApproach: "high_protein",
    allergies: [],
    dislikedFoods: "",
    cookingSkill: "intermediate",
    equipment: ["stovetop", "oven", "air-fryer", "blender"],
    budget: "$$",
    maxPrepTime: 35
  },
  {
    id: "profile_maya",
    name: "Maya Patel (Plant-Based Vegan Athlete)",
    age: 26,
    gender: "female",
    height: 172,
    weight: 62,
    goalWeight: 62,
    activityLevel: "active",
    goal: "build_muscle",
    foodPattern: "vegan",
    eatingApproach: "high_protein",
    allergies: ["peanuts"],
    dislikedFoods: "mushrooms",
    cookingSkill: "advanced",
    equipment: ["stovetop", "oven", "blender", "instant-pot"],
    budget: "$$",
    maxPrepTime: 45
  },
  {
    id: "profile_rohit",
    name: "Rohit Jain (Mindful Sattvic Diet)",
    age: 32,
    gender: "male",
    height: 175,
    weight: 78,
    goalWeight: 72,
    activityLevel: "light",
    goal: "weight_loss",
    foodPattern: "jain",
    eatingApproach: "balanced",
    allergies: [],
    dislikedFoods: "",
    cookingSkill: "intermediate",
    equipment: ["stovetop", "instant-pot", "microwave"],
    budget: "$",
    maxPrepTime: 30
  },
  {
    id: "profile_david",
    name: "David Vance (Keto Fat-Burn & Strength)",
    age: 35,
    gender: "male",
    height: 182,
    weight: 88,
    goalWeight: 82,
    activityLevel: "active",
    goal: "weight_loss",
    foodPattern: "keto",
    eatingApproach: "keto",
    allergies: ["gluten"],
    dislikedFoods: "",
    cookingSkill: "intermediate",
    equipment: ["stovetop", "oven", "air-fryer"],
    budget: "$$$",
    maxPrepTime: 30
  }
];

class AppStateManager {
  constructor() {
    this.storageKey = "nutrizen_app_state_v1";
    this.listeners = [];
    this.state = this.loadInitialState();
  }

  loadInitialState() {
    const savedDefaults = {
      profile: { ...DEFAULT_PROFILE },
      presets: PRESET_PROFILES,
      currentDay: "Monday",
      groceryList: {},
      favorites: [],
      ratings: {},
      darkMode: false,
      soundEnabled: true,
      planCalorieVersion: 2,
      lastUpdated: new Date().toISOString()
    };

    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const profile = { ...savedDefaults.profile, ...(parsed.profile || {}) };
        const needsCalorieMigration = parsed.planCalorieVersion !== 2;
        const merged = {
          ...savedDefaults,
          ...parsed,
          profile,
          presets: Array.isArray(parsed.presets) ? parsed.presets : PRESET_PROFILES,
          favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
          ratings: parsed.ratings && typeof parsed.ratings === "object" ? parsed.ratings : {}
        };

        if (!parsed.weeklyPlan) {
          merged.weeklyPlan = NutritionEngine.generate7DayPlan(profile);
          merged.groceryList = NutritionEngine.generateGroceryList(merged.weeklyPlan);
        } else {
          merged.weeklyPlan = parsed.weeklyPlan;
          if (!parsed.groceryList) {
            merged.groceryList = NutritionEngine.generateGroceryList(merged.weeklyPlan);
          }
        }

        if (needsCalorieMigration) {
          merged.weeklyPlan = Object.fromEntries(
            Object.entries(merged.weeklyPlan).map(([day, dayPlan]) => [
              day,
              NutritionEngine.scaleDayToTarget(
                dayPlan,
                NutritionEngine.calculateTargetCalories(profile)
              )
            ])
          );
          const previousGroceryList = merged.groceryList;
          merged.groceryList = NutritionEngine.generateGroceryList(merged.weeklyPlan);
          Object.entries(previousGroceryList).forEach(([aisle, items]) => {
            items.forEach(item => {
              const generatedItem = merged.groceryList[aisle]?.find(
                candidate => candidate.name.toLowerCase() === item.name.toLowerCase()
              );
              if (generatedItem) {
                generatedItem.checked = item.checked;
              } else {
                merged.groceryList[aisle] = merged.groceryList[aisle] || [];
                merged.groceryList[aisle].push(item);
              }
            });
          });
          merged.planCalorieVersion = 2;
        }
        return merged;
      }
    } catch (e) {
      console.warn("Could not parse saved state, starting fresh.", e);
    }

    const initialProfile = { ...DEFAULT_PROFILE };
    const initialPlan = NutritionEngine.generate7DayPlan(initialProfile);
    const initialGrocery = NutritionEngine.generateGroceryList(initialPlan);

    return {
      profile: initialProfile,
      presets: PRESET_PROFILES,
      currentDay: "Monday",
      weeklyPlan: initialPlan,
      groceryList: initialGrocery,
      favorites: ["rec_b2", "rec_d1", "rec_l1"],
      ratings: {
        rec_b2: 5,
        rec_d1: 5
      },
      darkMode: false,
      soundEnabled: true,
      planCalorieVersion: 2,
      lastUpdated: new Date().toISOString()
    };
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      this.notify();
    } catch (e) {
      console.error("Error saving state to localStorage", e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // --- ACTIONS ---

  setProfile(newProfile) {
    this.state.profile = { ...this.state.profile, ...newProfile };
    // Automatically re-estimate targets and regenerate plan
    this.regenerateFullPlan();
  }

  switchPresetProfile(presetId) {
    const found = this.state.presets.find(p => p.id === presetId);
    if (found) {
      this.state.profile = { ...found };
      this.regenerateFullPlan();
    }
  }

  setCurrentDay(day) {
    this.state.currentDay = day;
    this.save();
  }

  regenerateFullPlan() {
    this.state.weeklyPlan = NutritionEngine.generate7DayPlan(this.state.profile);
    this.state.groceryList = NutritionEngine.generateGroceryList(this.state.weeklyPlan);
    this.save();
  }

  regenerateSingleDay(day) {
  const previousDay = this.state.weeklyPlan[day];
  if (!previousDay) return;

  const tempPlan = NutritionEngine.generate7DayPlan(this.state.profile, {
    excludeDay: day,
    previousDay
  });

  this.state.weeklyPlan[day] = tempPlan[day];
  this.state.groceryList = NutritionEngine.generateGroceryList(this.state.weeklyPlan);
  this.save();
}

  swapMeal(day, mealSlot, newRecipe) {
    if (this.state.weeklyPlan[day]) {
      const targetCalories = NutritionEngine.calculateTargetCalories(this.state.profile);
      const mealCalories = NutritionEngine.getMealCalorieTargets(targetCalories)[mealSlot];
      if (mealCalories === undefined) {
        throw new Error(`Unsupported meal slot: ${mealSlot}`);
      }
      this.state.weeklyPlan[day][mealSlot] = NutritionEngine.scaleRecipeToCalories(
        newRecipe,
        mealCalories
      );
      this.state.groceryList = NutritionEngine.generateGroceryList(this.state.weeklyPlan);
      this.save();
    }
  }

  toggleMealCompleted(day, mealSlot) {
    if (this.state.weeklyPlan[day]) {
      const current = this.state.weeklyPlan[day].completed[mealSlot];
      this.state.weeklyPlan[day].completed[mealSlot] = !current;
      this.save();
    }
  }

  addWaterGlass(day) {
    if (this.state.weeklyPlan[day]) {
      this.state.weeklyPlan[day].waterGlasses = (this.state.weeklyPlan[day].waterGlasses || 0) + 1;
      this.save();
    }
  }

  removeWaterGlass(day) {
    if (this.state.weeklyPlan[day]) {
      const current = this.state.weeklyPlan[day].waterGlasses || 0;
      this.state.weeklyPlan[day].waterGlasses = Math.max(0, current - 1);
      this.save();
    }
  }

  setDailyMood(day, mood) {
    if (this.state.weeklyPlan[day]) {
      this.state.weeklyPlan[day].mood = mood;
      this.save();
    }
  }

  toggleGroceryItem(aisle, itemIndex) {
    if (this.state.groceryList[aisle] && this.state.groceryList[aisle][itemIndex]) {
      const item = this.state.groceryList[aisle][itemIndex];
      item.checked = !item.checked;
      this.save();
    }
  }

  addCustomGroceryItem(aisle, name, amount, unit) {
    const aisleKey = this.state.groceryList[aisle] ? aisle : "Other";
    if (!this.state.groceryList[aisleKey]) {
      this.state.groceryList[aisleKey] = [];
    }
    this.state.groceryList[aisleKey].push({
      name,
      amount: Number(amount) || 1,
      unit: unit || "item",
      checked: false
    });
    this.save();
  }

  clearCheckedGroceryItems() {
    for (const aisle in this.state.groceryList) {
      this.state.groceryList[aisle] = this.state.groceryList[aisle].filter(item => !item.checked);
    }
    this.save();
  }

  toggleFavorite(recipeId) {
    const index = this.state.favorites.indexOf(recipeId);
    if (index > -1) {
      this.state.favorites.splice(index, 1);
    } else {
      this.state.favorites.push(recipeId);
    }
    this.save();
  }

  rateRecipe(recipeId, rating) {
    this.state.ratings[recipeId] = rating;
    this.save();
  }

  toggleDarkMode() {
    this.state.darkMode = !this.state.darkMode;
    this.save();
  }
}

const AppState = new AppStateManager();
