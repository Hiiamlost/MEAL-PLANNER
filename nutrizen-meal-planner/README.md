# 🥗 NutriZen — Dynamic AI Meal Planner & Nutrition Engine

> **A Personalized Journey from Profile to Plate**
> Built strictly according to the full-stack meal planner product blueprint: Set a Goal ➔ Personalize ➔ Plan the Week ➔ Adapt.

---

## 🌟 Key Features & Blueprint Mapping

### 1. Step 01 & 02: Profile & Identity Builder
- **Body & Metrics**: Age, biological gender, height (cm), current weight (kg), goal weight (kg).
- **Routine & Context**: Physical activity levels (Sedentary, Light, Moderate, Active, Extra Active), cooking skill, available equipment (stovetop, oven, air-fryer, blender, instant-pot), and prep time limit slider.
- **Preset Quick-Profiles**: Switch instantly between pre-configured personas:
  - *Alex Morgan*: High-Protein Mediterranean (Muscle building)
  - *Maya Patel*: Plant-Based Vegan Athlete (High protein, peanut allergy)
  - *Rohit Jain*: Mindful Sattvic Jain Diet (No onion, garlic, or root vegetables)
  - *David Vance*: Keto Fat-Burn & Strength (Low-carb, gluten-free)

### 2. Step 03: Goals, Food Style & Guardrails
- **Nutritional Goals**: Weight Loss / Cut (-20% caloric deficit), Maintain Weight, Build Muscle / Lean Gain (+10% lean surplus), Gain Weight / Bulk (+450 kcal).
- **Food Patterns**: Omnivore, Mediterranean, Vegetarian, Vegan, Pescatarian, Jain, Keto.
- **Eating Approaches (Macro Splits)**:
  - High Protein (40% Protein / 35% Carbs / 25% Fat)
  - Balanced (25% Protein / 45% Carbs / 30% Fat)
  - Mediterranean (20% Protein / 50% Carbs / 30% Fat)
  - Keto / Low-Carb (28% Protein / 7% Carbs / 65% Fat)
- **Hard Guardrails & Allergies**: Strict automatic filtering for Peanuts, Dairy/Lactose, Gluten, Soy, Eggs, Fish, Shellfish, and Sesame.

### 3. Step 04: Personalization & Nutrition Engine
- Real-time **Mifflin-St Jeor Basal Metabolic Rate (BMR)** and **Total Daily Energy Expenditure (TDEE)** estimation.
- Automatic target caloric calculations and macro distribution in grams ($P, C, F$) and fiber ($14\text{g} / 1000\text{ kcal}$).
- Daily values (DV) benchmarked against clinical RDA reference standards.

### 4. Step 05: Dynamic 7-Day Flexible Meal Plan
- 7 individual days (Monday through Sunday) with daily calorie badges and completion indicator dots.
- 4 meal slots per day: **Breakfast**, **Lunch**, **Dinner**, and **Snack**.
- **Interactive Recipe Card**:
  - High-res dish imagery, preparation & cook times, cost indicator, and difficulty.
  - Visual macro pills (Protein, Carbs, Fat, Fiber).
  - Micro-nutrient callout badge (Vitamin C, Iron, Potassium, etc.).
  - **Meal Swap Engine**: 1-click swap with any alternative recipe matching your exact dietary preferences and allergies, displaying real-time caloric delta ($\pm\text{kcal}$).

### 5. Step 06: Day-to-Day Companion Dashboard
- **Calorie & Macro Distribution Chart**: Interactive doughnut chart powered by Chart.js showing exact caloric contribution from Protein vs Carbs vs Healthy Fats.
- **Hydration Tracker**: 8 interactive 250ml water glasses with one-click logging, fluid totals, and celebration confetti at 2,000ml (8 glasses).
- **Micronutrient Health Scorecard**: Tracks 9 critical vitamins and minerals with color-coded % Daily Value progress meters:
  - Vitamin A, Vitamin C, Vitamin D, Vitamin B12, Iron, Calcium, Potassium, Magnesium, and Zinc.
- **Smart Grocery Shopping List**:
  - Automatically aggregated from all ingredients across the 7-day meal plan.
  - Categorized by supermarket aisles (*Fresh Produce, Dairy & Cheeses, Meat & Seafood, Grains & Cereals, Pantry & Nuts, etc.*).
  - Check-off items with strike-through, remaining counter, and custom item adder.
- **Sunday Batch Cooking Guide**: Aggregates batch prep recommendations from recipes to save over 3 hours of weekday prep time.

### 6. Step 07: Learn & Adapt
- **Interactive Recipe Detail Modal**:
  - Serving Multiplier (1x, 2x, 4x Family) dynamically recalibrating ingredient quantities.
  - Checkable step-by-step instructions.
  - **Built-in Kitchen Countdown Timer**: Start, pause, reset, and Web Audio API tone alert with confetti celebration upon timer completion.
- **"What's In My Fridge?" (Pantry Matcher)**: Enter ingredients you have on hand to find matching recipes from your database instantly.
- **Print & PDF Export**: Clean, high-contrast, print-formatted weekly plan and shopping list ready for the fridge door.

---

## 🚀 Quick Launch

### Option 1: Double-Click
Double click `launch.bat` inside this folder.

### Option 2: Open in any Web Browser
Open `index.html` directly in Google Chrome, Microsoft Edge, Firefox, or Safari. Zero installation or npm build steps required!
