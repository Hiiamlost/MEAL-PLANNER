/**
 * NutriZen Interactive UI Controller
 * Manages dynamic DOM updates, Charts, Modals, Timers, Grocery List, and Confetti.
 */

const UI = {
  macroChartInstance: null,
  activeTimerInterval: null,
  activeTimerSeconds: 0,
  activeRecipeInModal: null,
  modalServingMultiplier: 1,

  // Audio tone generator (Web Audio API) for gentle haptic-like sound feedback
  playSound: function(type = "click") {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "complete") {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.15); // G5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else if (type === "timer") {
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } else {
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      }
    } catch (e) {
      // AudioContext may be blocked before first user interaction
    }
  },

  // Trigger festive celebration confetti
  triggerConfetti: function() {
    if (typeof confetti === "function") {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10b981", "#3b82f6", "#f97316", "#8b5cf6"]
      });
    }
  },

  // Initialize UI on page load
  init: function() {
    this.renderHeader();
    this.renderDayTabs();
    this.renderDashboard();
    this.renderGroceryList();
    this.renderGroceryAisleOptions();
    this.renderBatchPrepGuide();
    this.setupEventListeners();
  },

  // Render Top Header with active profile pill, preset selector, and stats
  renderHeader: function() {
    const profile = AppState.state.profile;
    const targets = NutritionEngine.calculateTargetMacros(
      NutritionEngine.calculateTargetCalories(profile),
      profile.eatingApproach
    );

    const nameEl = document.getElementById("userProfileName");
    if (nameEl) nameEl.textContent = profile.name;

    const dietBadgeEl = document.getElementById("userDietBadge");
    if (dietBadgeEl) {
      dietBadgeEl.textContent = `${profile.foodPattern.toUpperCase()} • ${profile.goal.replace("_", " ").toUpperCase()}`;
    }

    const targetCalEl = document.getElementById("headerTargetCalories");
    if (targetCalEl) targetCalEl.textContent = `${targets.calories} kcal/day`;

    // Presets dropdown
    const presetSelect = document.getElementById("presetProfileSelect");
    if (presetSelect) {
      presetSelect.innerHTML = `
        <option value="">⚡ Switch Quick Preset Profile...</option>
        ${AppState.state.presets.map(p => `
          <option value="${p.id}" ${p.id === profile.id ? 'selected' : ''}>${p.name}</option>
        `).join("")}
      `;
    }
  },

  // Render 7-Day Calendar Tabs (Mon-Sun)
  renderDayTabs: function() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const currentDay = AppState.state.currentDay;
    const weeklyPlan = AppState.state.weeklyPlan;
    const container = document.getElementById("dayTabsContainer");
    if (!container) return;

    container.innerHTML = days.map(day => {
      const isSelected = day === currentDay;
      const dayData = weeklyPlan[day] || {};
      const completedCount = Object.values(dayData.completed || {}).filter(Boolean).length;
      const dailyCalories = NutritionEngine.calculateDayTotals(dayData).calories;

      return `
        <button onclick="UI.selectDay('${day}')" 
          class="flex-1 min-w-[110px] py-3 px-3 rounded-2xl flex flex-col items-center transition-all ${
            isSelected 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-semibold scale-105' 
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700/60 border border-gray-100 dark:border-gray-700'
          }">
          <span class="text-xs uppercase tracking-wider opacity-80">${day.slice(0, 3)}</span>
          <span class="text-base font-bold my-0.5">${dailyCalories} <span class="text-[10px] font-normal opacity-75">kcal</span></span>
          <div class="flex items-center gap-1 mt-1">
            ${[0, 1, 2, 3].map(i => `
              <span class="w-1.5 h-1.5 rounded-full ${
                i < completedCount 
                  ? (isSelected ? 'bg-white' : 'bg-emerald-500') 
                  : (isSelected ? 'bg-emerald-400/40' : 'bg-gray-300 dark:bg-gray-600')
              }"></span>
            `).join("")}
          </div>
        </button>
      `;
    }).join("");
  },

  selectDay: function(day) {
    this.playSound("click");
    AppState.setCurrentDay(day);
    this.renderDayTabs();
    this.renderDashboard();
  },

  // Main Dashboard Rendering (Day Plan, Macro Chart, Hydration, Micronutrients)
  renderDashboard: function() {
    const currentDay = AppState.state.currentDay;
    const dayPlan = AppState.state.weeklyPlan[currentDay] || {};
    const profile = AppState.state.profile;
    const targets = NutritionEngine.calculateTargetMacros(
      NutritionEngine.calculateTargetCalories(profile),
      profile.eatingApproach
    );
    const dayTotals = NutritionEngine.calculateDayTotals(dayPlan);
    const percentages = NutritionEngine.calculatePercentages(dayTotals, targets);

    // Update Day Title
    const dayTitle = document.getElementById("activeDayTitle");
    if (dayTitle) dayTitle.textContent = `${currentDay}'s Plan`;

    // Render 4 Meal Cards
    this.renderMealCard("breakfast", dayPlan.breakfast, dayPlan.completed?.breakfast);
    this.renderMealCard("lunch", dayPlan.lunch, dayPlan.completed?.lunch);
    this.renderMealCard("dinner", dayPlan.dinner, dayPlan.completed?.dinner);
    this.renderMealCard("snack", dayPlan.snack, dayPlan.completed?.snack);

    // Render Daily Nutrition Rings & Summary
    this.renderNutritionSummary(dayTotals, targets, percentages);

    // Render Hydration Tracker
    this.renderHydrationTracker(dayPlan.waterGlasses || 0);

    // Render Micronutrient Health Radar / Progress Cards
    this.renderMicronutrients(dayTotals, percentages);

    // Render persistent daily mood check-in
    this.renderMoodTracker(dayPlan.mood);
  },

  // Render individual meal card with high interactivity
  renderMealCard: function(slot, recipe, isCompleted) {
    const container = document.getElementById(`meal_slot_${slot}`);
    if (!container) return;

    if (!recipe) {
      container.innerHTML = `<div class="p-6 text-center text-gray-400">No recipe assigned.</div>`;
      return;
    }

    const currentDay = AppState.state.currentDay;
    const isFav = AppState.state.favorites.includes(recipe.id);
    const rating = AppState.state.ratings[recipe.id] || 0;

    container.innerHTML = `
      <div class="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border ${
        isCompleted 
          ? 'border-emerald-500/50 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10' 
          : 'border-gray-100 dark:border-gray-700/80 shadow-sm'
      } hover-lift transition-all flex flex-col justify-between group">
        
        <!-- Meal Image & Overlays -->
        <div class="relative h-44 w-full overflow-hidden">
          <img src="${recipe.image}" alt="${recipe.title}" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
          
          <!-- Category & Time Badges -->
          <div class="absolute top-3 left-3 flex items-center gap-1.5">
            <span class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md">
              ${slot}
            </span>
            <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500 text-white flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              ${recipe.prepTime + recipe.cookTime}m
            </span>
          </div>

          <!-- Favorite & Completed Button -->
          <div class="absolute top-3 right-3 flex items-center gap-2">
            <button onclick="UI.toggleFavorite('${recipe.id}')" 
              class="w-8 h-8 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex items-center justify-center text-rose-500 hover:scale-110 transition-transform">
              ${isFav ? '❤️' : '🤍'}
            </button>
            <button onclick="UI.toggleMealEaten('${currentDay}', '${slot}')" 
              title="${isCompleted ? 'Mark uncompleted' : 'Mark as eaten'}"
              class="px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5 ${
                isCompleted 
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/40' 
                  : 'bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 hover:bg-emerald-500 hover:text-white'
              }">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
              ${isCompleted ? 'Eaten' : 'Mark Eaten'}
            </button>
          </div>

          <!-- Bottom Title & Calories on Image -->
          <div class="absolute bottom-2.5 left-3 right-3 text-white">
            <h4 class="font-bold text-base leading-snug line-clamp-1 drop-shadow-sm">${recipe.title}</h4>
            <div class="flex items-center gap-2 text-xs font-medium text-emerald-300">
              <span>🔥 ${recipe.calories} kcal</span>
              <span>•</span>
              <span>🍽️ ${recipe.servings} serving${recipe.servings === 1 ? "" : "s"}</span>
              <span>•</span>
              <span>💰 ${recipe.cost}</span>
              <span>•</span>
              <span>${recipe.difficulty}</span>
            </div>
          </div>
        </div>

        <!-- Body & Macros Breakdown -->
        <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
          <!-- Macro Pills -->
          <div class="grid grid-cols-4 gap-1.5 text-center text-xs">
            <div class="bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/40 rounded-xl p-1.5">
              <span class="block text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400">Protein</span>
              <span class="font-bold text-gray-800 dark:text-gray-100">${recipe.macros.protein}g</span>
            </div>
            <div class="bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 rounded-xl p-1.5">
              <span class="block text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">Carbs</span>
              <span class="font-bold text-gray-800 dark:text-gray-100">${recipe.macros.carbs}g</span>
            </div>
            <div class="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-xl p-1.5">
              <span class="block text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Fat</span>
              <span class="font-bold text-gray-800 dark:text-gray-100">${recipe.macros.fat}g</span>
            </div>
            <div class="bg-purple-50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/40 rounded-xl p-1.5">
              <span class="block text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">Fiber</span>
              <span class="font-bold text-gray-800 dark:text-gray-100">${recipe.macros.fiber}g</span>
            </div>
          </div>

          <!-- Key Micronutrients Tagline -->
          <div class="flex items-center gap-1.5 flex-wrap text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/40 p-2 rounded-xl">
            <span class="font-semibold text-gray-700 dark:text-gray-300">Rich in:</span>
            <span class="bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">Vit C: ${recipe.micros.vitaminC}mg</span>
            <span class="bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">Iron: ${recipe.micros.iron}mg</span>
            <span class="bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">Potassium: ${recipe.micros.potassium}mg</span>
          </div>

          <!-- Action Buttons: View Recipe & Swap -->
          <div class="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between gap-2">
            <div class="flex items-center gap-0.5" aria-label="Recipe rating">
              ${[1, 2, 3, 4, 5].map(star => `
                <button onclick="UI.rateRecipe('${recipe.id}', ${star})"
                  class="${star <= rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'} text-sm leading-none"
                  title="Rate ${star} star${star === 1 ? '' : 's'}">${star <= rating ? '★' : '☆'}</button>
              `).join("")}
            </div>
            <button onclick="UI.openRecipeModal('${recipe.id}')" 
              class="flex-1 py-2 px-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-gray-700 dark:text-gray-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              Recipe & Timer
            </button>
            <button onclick="UI.openSwapModal('${currentDay}', '${slot}')" 
              class="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 hover:text-white text-gray-600 dark:text-gray-300 transition-colors"
              title="Swap for another meal">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>
          </div>

        </div>
      </div>
    `;
  },

  // Toggle meal completed
  toggleMealEaten: function(day, slot) {
    this.playSound("click");
    AppState.toggleMealCompleted(day, slot);
    
    // Check if all 4 completed for celebration!
    const dayData = AppState.state.weeklyPlan[day];
    const allDone = Object.values(dayData.completed).every(Boolean);
    if (allDone) {
      this.playSound("complete");
      this.triggerConfetti();
    }
    
    this.renderDayTabs();
    this.renderDashboard();
  },

  // Toggle favorite
  toggleFavorite: function(recipeId) {
    this.playSound("click");
    AppState.toggleFavorite(recipeId);
    this.renderDashboard();
  },

  rateRecipe: function(recipeId, rating) {
    this.playSound("click");
    AppState.rateRecipe(recipeId, rating);
    this.renderDashboard();
  },

  // Render Daily Nutrition Rings & Donut Chart
  renderNutritionSummary: function(totals, targets, percentages) {
    // Calorie Ring / Text
    const calCurrent = document.getElementById("summaryCurrentCalories");
    const calTarget = document.getElementById("summaryTargetCalories");
    const calPercent = document.getElementById("summaryCaloriePercent");
    if (calCurrent) calCurrent.textContent = totals.calories;
    if (calTarget) calTarget.textContent = targets.calories;
    if (calPercent) calPercent.textContent = `${percentages.calories}%`;

    // Progress Bars
    this.updateBar("protein", totals.protein, targets.protein, percentages.protein);
    this.updateBar("carbs", totals.carbs, targets.carbs, percentages.carbs);
    this.updateBar("fat", totals.fat, targets.fat, percentages.fat);
    this.updateBar("fiber", totals.fiber, targets.fiber, percentages.fiber);

    // Chart.js Macro Split
    this.renderMacroChart(totals);
  },

  updateBar: function(nutrient, current, target, percent) {
    const bar = document.getElementById(`bar_${nutrient}`);
    const text = document.getElementById(`text_${nutrient}`);
    if (bar) {
      bar.style.width = `${Math.min(100, percent)}%`;
      if (percent > 100) {
        bar.classList.add("opacity-90");
      }
    }
    if (text) {
      text.textContent = `${current}g / ${target}g (${percent}%)`;
    }
  },

  renderMacroChart: function(totals) {
    const canvas = document.getElementById("macroDoughnutChart");
    if (!canvas) return;

    const data = {
      labels: ["Protein (g)", "Carbs (g)", "Fat (g)"],
      datasets: [{
        data: [totals.protein * 4, totals.carbs * 4, totals.fat * 9], // in calories
        backgroundColor: ["#f97316", "#3b82f6", "#eab308"],
        borderWidth: 0,
        hoverOffset: 6
      }]
    };

    if (this.macroChartInstance) {
      this.macroChartInstance.data = data;
      this.macroChartInstance.update();
    } else if (typeof Chart !== "undefined") {
      this.macroChartInstance = new Chart(canvas, {
        type: "doughnut",
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  return `${ctx.label}: ${ctx.raw} kcal`;
                }
              }
            }
          }
        }
      });
    }
  },

  // Render Hydration Tracker (8 glasses of water)
  renderHydrationTracker: function(glasses) {
    const container = document.getElementById("waterGlassesContainer");
    const countEl = document.getElementById("waterCountText");
    if (!container) return;

    if (countEl) countEl.textContent = `${glasses} / 8 glasses (${(glasses * 250)} ml)`;

    const currentDay = AppState.state.currentDay;
    container.innerHTML = Array.from({ length: 8 }).map((_, i) => {
      const isFilled = i < glasses;
      return `
        <button onclick="UI.setWaterGlass(${i + 1})" 
          class="water-glass flex flex-col items-center gap-1 group focus:outline-none"
          title="Glass ${i + 1} (250ml)">
          <div class="w-9 h-11 rounded-b-xl rounded-t-md border-2 ${
            isFilled 
              ? 'border-sky-500 bg-sky-500 text-white shadow-md shadow-sky-500/40' 
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400'
          } flex items-center justify-center transition-all">
            <svg class="w-5 h-5 ${isFilled ? 'fill-white stroke-white' : 'stroke-current'}" viewBox="0 0 24 24" fill="none">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <span class="text-[10px] font-semibold ${isFilled ? 'text-sky-600 dark:text-sky-400' : 'text-gray-400'}">${i + 1}</span>
        </button>
      `;
    }).join("");
  },

  setWaterGlass: function(targetGlass) {
    this.playSound("click");
    const currentDay = AppState.state.currentDay;
    const current = AppState.state.weeklyPlan[currentDay]?.waterGlasses || 0;
    
    // Toggle: if clicking the current amount, reduce by 1
    if (targetGlass === current) {
      AppState.removeWaterGlass(currentDay);
    } else {
      AppState.state.weeklyPlan[currentDay].waterGlasses = targetGlass;
      AppState.save();
      if (targetGlass === 8) {
        this.playSound("complete");
        this.triggerConfetti();
      }
    }
    this.renderDashboard();
  },

  renderMoodTracker: function(selectedMood) {
    document.querySelectorAll("[data-mood]").forEach(button => {
      const isSelected = button.dataset.mood === selectedMood;
      button.classList.toggle("ring-2", isSelected);
      button.classList.toggle("ring-emerald-500", isSelected);
      button.classList.toggle("bg-emerald-100", isSelected);
      button.classList.toggle("dark:bg-emerald-950/60", isSelected);
    });
  },

  setDailyMood: function(mood) {
    this.playSound("click");
    const day = AppState.state.currentDay;
    AppState.setDailyMood(day, mood);
    this.renderMoodTracker(mood);
  },

  // Render Comprehensive Micronutrients Card (Vitamins & Minerals)
  renderMicronutrients: function(totals, percentages) {
    const container = document.getElementById("micronutrientsGrid");
    if (!container) return;

    const micros = [
      { key: "vitaminA", label: "Vitamin A", unit: "mcg", val: totals.vitaminA, target: 900, icon: "🥕" },
      { key: "vitaminC", label: "Vitamin C", unit: "mg", val: totals.vitaminC, target: 90, icon: "🍊" },
      { key: "vitaminD", label: "Vitamin D", unit: "mcg", val: totals.vitaminD, target: 20, icon: "☀️" },
      { key: "vitaminB12", label: "Vitamin B12", unit: "mcg", val: totals.vitaminB12, target: 2.4, icon: "🥩" },
      { key: "iron", label: "Iron", unit: "mg", val: totals.iron, target: 18, icon: "🥬" },
      { key: "calcium", label: "Calcium", unit: "mg", val: totals.calcium, target: 1000, icon: "🥛" },
      { key: "potassium", label: "Potassium", unit: "mg", val: totals.potassium, target: 3400, icon: "🍌" },
      { key: "magnesium", label: "Magnesium", unit: "mg", val: totals.magnesium, target: 400, icon: "🥑" },
      { key: "zinc", label: "Zinc", unit: "mg", val: totals.zinc, target: 11, icon: "🌰" }
    ];

    container.innerHTML = micros.map(m => {
      const pct = percentages[m.key] || 0;
      const isGood = pct >= 80;
      return `
        <div class="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 flex flex-col justify-between">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
              <span>${m.icon}</span> ${m.label}
            </span>
            <span class="font-bold ${isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}">
              ${pct}% DV
            </span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden my-1">
            <div class="h-1.5 rounded-full transition-all duration-700 ${
              isGood ? 'bg-emerald-500' : 'bg-amber-400'
            }" style="width: ${Math.min(100, pct)}%"></div>
          </div>
          <div class="text-[10px] text-gray-400 dark:text-gray-500 text-right">
            ${m.val} / ${m.target} ${m.unit}
          </div>
        </div>
      `;
    }).join("");

    const scoreBadge = document.getElementById("micronutrientScoreBadge");
    if (scoreBadge) {
      const average = Math.round(micros.reduce((sum, m) => sum + (percentages[m.key] || 0), 0) / micros.length);
      scoreBadge.textContent = average >= 80 ? "Optimal" : average >= 50 ? "Building" : "Needs attention";
    }
  },

  // Render Grocery Shopping List grouped by Aisle
  renderGroceryList: function() {
    const list = AppState.state.groceryList;
    const container = document.getElementById("groceryListAisles");
    const countBadge = document.getElementById("groceryRemainingCount");
    if (!container) return;

    let totalItems = 0;
    let checkedItems = 0;

    const aislesHtml = Object.entries(list).map(([aisle, items]) => {
      if (!items || items.length === 0) return "";
      
      const itemsHtml = items.map((item, idx) => {
        totalItems++;
        if (item.checked) checkedItems++;
        return `
          <li class="flex items-center justify-between py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-xl transition-colors group">
            <label class="flex items-center gap-3 cursor-pointer select-none flex-1">
              <input type="checkbox" ${item.checked ? 'checked' : ''} 
                onchange="UI.toggleGroceryItem('${aisle}', ${idx})"
                class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 cursor-pointer" />
              <span class="text-sm font-medium ${item.checked ? 'todo-checked text-gray-400' : 'text-gray-800 dark:text-gray-200'}">
                ${item.name}
              </span>
            </label>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              ${Number(Number(item.amount).toFixed(2))} ${item.unit}
            </span>
          </li>
        `;
      }).join("");

      return `
        <div class="border border-gray-200 dark:border-gray-700/80 rounded-2xl p-4 bg-white dark:bg-gray-800/80 shadow-sm">
          <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center justify-between mb-2">
            <span>🛒 ${aisle}</span>
            <span class="text-gray-400 text-[11px] font-normal">${items.length} items</span>
          </h4>
          <ul class="divide-y divide-gray-100 dark:divide-gray-700/50">
            ${itemsHtml}
          </ul>
        </div>
      `;
    }).join("");

    container.innerHTML = aislesHtml || `<div class="p-8 text-center text-gray-400">Grocery list is empty.</div>`;
    if (countBadge) countBadge.textContent = `${totalItems - checkedItems} remaining (${checkedItems}/${totalItems} checked)`;
    this.renderGroceryAisleOptions();
  },

  renderGroceryAisleOptions: function() {
    const select = document.getElementById("newGroceryAisleSelect");
    if (!select) return;

    const aisles = Array.from(new Set([
      ...Object.keys(AppState.state.groceryList),
      "Fresh Produce",
      "Dairy & Cheeses",
      "Dairy & Plant Milks",
      "Meat & Seafood",
      "Grains & Cereals",
      "Pantry & Nuts",
      "Other"
    ]));

    const current = select.value;
    select.innerHTML = aisles.map(aisle =>
      `<option value="${aisle}" ${aisle === current ? "selected" : ""}>${aisle}</option>`
    ).join("");
  },

  toggleGroceryItem: function(aisle, index) {
    this.playSound("click");
    AppState.toggleGroceryItem(aisle, index);
    this.renderGroceryList();
  },

  addCustomItem: function() {
    const input = document.getElementById("newGroceryItemInput");
    const aisleSelect = document.getElementById("newGroceryAisleSelect");
    if (!input || !input.value.trim()) return;

    const name = input.value.trim();
    const aisle = aisleSelect ? aisleSelect.value : "Other";
    AppState.addCustomGroceryItem(aisle, name, 1, "item");
    input.value = "";
    this.playSound("click");
    this.renderGroceryList();
  },

  clearCheckedGrocery: function() {
    this.playSound("click");
    AppState.clearCheckedGroceryItems();
    this.renderGroceryList();
  },

  // Render Batch Prep Guide
  renderBatchPrepGuide: function() {
    const container = document.getElementById("batchPrepContainer");
    if (!container) return;

    const weeklyPlan = AppState.state.weeklyPlan;
    const prepItems = [];

    // Aggregate unique prep notes from the week's recipes
    Object.values(weeklyPlan).forEach(day => {
      ["breakfast", "lunch", "dinner", "snack"].forEach(slot => {
        const recipe = day[slot];
        if (recipe && recipe.prepNotes && !prepItems.some(p => p.recipeTitle === recipe.title)) {
          prepItems.push({
            recipeTitle: recipe.title,
            slot: slot,
            notes: recipe.prepNotes
          });
        }
      });
    });

    container.innerHTML = prepItems.slice(0, 5).map(item => `
      <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/40">
        <span class="text-xl">👩‍🍳</span>
        <div>
          <h5 class="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
            ${item.recipeTitle} (${item.slot})
          </h5>
          <p class="text-xs text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">
            ${item.notes}
          </p>
        </div>
      </div>
    `).join("");
  },

  // --- MODALS ---

  // 1. Open Recipe Details Modal with Interactive Servings & Cooking Timer
  openRecipeModal: function(recipeId) {
    this.playSound("click");
    const recipe = RecipeService.getById(recipeId);
    if (!recipe) return;

    this.activeRecipeInModal = recipe;
    this.modalServingMultiplier = 1;

    const modal = document.getElementById("recipeDetailModal");
    if (!modal) return;

    this.renderRecipeModalContent(recipe);
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  },

  renderRecipeModalContent: function(recipe) {
    const mult = this.modalServingMultiplier;
    
    // Header Info
    document.getElementById("modalRecipeImage").src = recipe.image;
    document.getElementById("modalRecipeTitle").textContent = recipe.title;
    document.getElementById("modalRecipeCategory").textContent = recipe.category.toUpperCase();
    document.getElementById("modalRecipeTime").textContent = `${recipe.prepTime + recipe.cookTime} mins total`;
    document.getElementById("modalRecipeCalories").textContent = `${Math.round(recipe.calories * mult)} kcal`;

    // Servings Buttons
    [1, 2, 4].forEach(s => {
      const btn = document.getElementById(`servingBtn_${s}`);
      if (btn) {
        if (s === mult) {
          btn.className = "px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md";
        } else {
          btn.className = "px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-xs hover:bg-gray-200";
        }
      }
    });

    // Scaled Ingredients
    const ingredientsContainer = document.getElementById("modalIngredientsList");
    if (ingredientsContainer) {
      ingredientsContainer.innerHTML = recipe.ingredients.map(ing => `
        <li class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-750 text-sm">
          <span class="text-gray-800 dark:text-gray-200 font-medium">${ing.name}</span>
          <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg">
            ${Number((ing.amount * mult).toFixed(1))} ${ing.unit}
          </span>
        </li>
      `).join("");
    }

    // Interactive Instructions with Checkboxes
    const instructionsContainer = document.getElementById("modalInstructionsList");
    if (instructionsContainer) {
      instructionsContainer.innerHTML = recipe.instructions.map((step, idx) => `
        <li class="flex items-start gap-3 py-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <input type="checkbox" class="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
          <span><strong class="text-gray-900 dark:text-gray-100">Step ${idx + 1}:</strong> ${step}</span>
        </li>
      `).join("");
    }

    // Reset Cooking Timer
    this.resetTimer(recipe.cookTime || 10);

    // Micro breakdown in modal
    const microsContainer = document.getElementById("modalMicrosList");
    if (microsContainer) {
      microsContainer.innerHTML = `
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div class="p-2 rounded-xl bg-gray-50 dark:bg-gray-800">Vit C: <strong class="text-emerald-600">${recipe.micros.vitaminC} mg</strong></div>
          <div class="p-2 rounded-xl bg-gray-50 dark:bg-gray-800">Vit D: <strong class="text-emerald-600">${recipe.micros.vitaminD} mcg</strong></div>
          <div class="p-2 rounded-xl bg-gray-50 dark:bg-gray-800">Vit B12: <strong class="text-emerald-600">${recipe.micros.vitaminB12} mcg</strong></div>
          <div class="p-2 rounded-xl bg-gray-50 dark:bg-gray-800">Iron: <strong class="text-emerald-600">${recipe.micros.iron} mg</strong></div>
          <div class="p-2 rounded-xl bg-gray-50 dark:bg-gray-800">Calcium: <strong class="text-emerald-600">${recipe.micros.calcium} mg</strong></div>
          <div class="p-2 rounded-xl bg-gray-50 dark:bg-gray-800">Potassium: <strong class="text-emerald-600">${recipe.micros.potassium} mg</strong></div>
        </div>
      `;
    }
  },

  setModalServings: function(s) {
    this.playSound("click");
    this.modalServingMultiplier = s;
    if (this.activeRecipeInModal) {
      this.renderRecipeModalContent(this.activeRecipeInModal);
    }
  },

  closeRecipeModal: function() {
    const modal = document.getElementById("recipeDetailModal");
    if (modal) modal.classList.add("hidden");
    document.body.style.overflow = "auto";
    if (this.activeTimerInterval) {
      clearInterval(this.activeTimerInterval);
      this.activeTimerInterval = null;
    }
  },

  // Cooking Countdown Timer
  resetTimer: function(minutes) {
    if (this.activeTimerInterval) {
      clearInterval(this.activeTimerInterval);
      this.activeTimerInterval = null;
    }
    this.activeTimerSeconds = (minutes || 10) * 60;
    this.updateTimerDisplay();
    const btn = document.getElementById("timerToggleBtn");
    if (btn) btn.textContent = "Start Timer";
  },

  toggleTimer: function() {
    this.playSound("click");
    const btn = document.getElementById("timerToggleBtn");
    if (this.activeTimerInterval) {
      clearInterval(this.activeTimerInterval);
      this.activeTimerInterval = null;
      if (btn) btn.textContent = "Resume";
    } else {
      if (btn) btn.textContent = "Pause";
      this.activeTimerInterval = setInterval(() => {
        if (this.activeTimerSeconds > 0) {
          this.activeTimerSeconds--;
          this.updateTimerDisplay();
        } else {
          clearInterval(this.activeTimerInterval);
          this.activeTimerInterval = null;
          this.playSound("timer");
          this.triggerConfetti();
          alert("⏰ Ding! Cooking timer finished!");
          if (btn) btn.textContent = "Restart";
        }
      }, 1000);
    }
  },

  updateTimerDisplay: function() {
    const display = document.getElementById("timerCountdownDisplay");
    if (!display) return;
    const mins = Math.floor(this.activeTimerSeconds / 60);
    const secs = this.activeTimerSeconds % 60;
    display.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  },

  // 2. Open Meal Swap Modal
  openSwapModal: function(day, slot) {
    this.playSound("click");
    const modal = document.getElementById("swapModal");
    if (!modal) return;

    const currentMeal = AppState.state.weeklyPlan[day]?.[slot];
    const pool = RecipeService.filterRecipes({
      diet: AppState.state.profile.foodPattern,
      allergies: AppState.state.profile.allergies
    }).filter(r => r.category === slot);

    document.getElementById("swapModalTitle").textContent = `Swap ${slot.toUpperCase()} for ${day}`;
    
    const container = document.getElementById("swapOptionsContainer");
    if (container) {
      container.innerHTML = pool.map(recipe => {
        const isCurrent = currentMeal && currentMeal.id === recipe.id;
        const calDiff = currentMeal ? (recipe.calories - currentMeal.calories) : 0;
        const diffSign = calDiff > 0 ? `+${calDiff}` : `${calDiff}`;

        return `
          <div class="flex items-center justify-between p-3.5 rounded-2xl border ${
            isCurrent ? 'border-emerald-500 bg-emerald-50/40' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
          } transition-all">
            <div class="flex items-center gap-3">
              <img src="${recipe.image}" class="w-14 h-14 rounded-xl object-cover" />
              <div>
                <h5 class="font-bold text-sm text-gray-900 dark:text-gray-100">${recipe.title}</h5>
                <div class="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                  <span>🔥 ${recipe.calories} kcal (${diffSign} kcal)</span>
                  <span>•</span>
                  <span>🍗 ${recipe.macros.protein}g protein</span>
                </div>
              </div>
            </div>
            ${
              isCurrent 
                ? '<span class="text-xs font-bold text-emerald-600 px-3 py-1 bg-emerald-100 dark:bg-emerald-950 rounded-xl">Current</span>' 
                : `<button onclick="UI.applySwap('${day}', '${slot}', '${recipe.id}')" 
                    class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-transform active:scale-95">
                    Select
                  </button>`
            }
          </div>
        `;
      }).join("");
    }

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  },

  applySwap: function(day, slot, recipeId) {
    this.playSound("click");
    const recipe = RecipeService.getById(recipeId);
    if (recipe) {
      AppState.swapMeal(day, slot, recipe);
      this.closeSwapModal();
      this.renderDayTabs();
      this.renderDashboard();
      this.renderGroceryList();
      this.renderBatchPrepGuide();
    }
  },

  closeSwapModal: function() {
    const modal = document.getElementById("swapModal");
    if (modal) modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  },

  // 3. Open Profile / Personalization Modal
  openProfileModal: function() {
    this.playSound("click");
    const modal = document.getElementById("profileModal");
    if (!modal) return;

    const p = AppState.state.profile;
    document.getElementById("inputProfileName").value = p.name;
    document.getElementById("inputProfileAge").value = p.age;
    document.getElementById("inputProfileGender").value = p.gender;
    document.getElementById("inputProfileHeight").value = p.height;
    document.getElementById("inputProfileWeight").value = p.weight;
    document.getElementById("inputProfileGoalWeight").value = p.goalWeight;
    document.getElementById("selectProfileActivity").value = p.activityLevel;
    document.getElementById("selectProfileGoal").value = p.goal;
    document.getElementById("selectProfilePattern").value = p.foodPattern;
    document.getElementById("selectProfileApproach").value = p.eatingApproach;
    document.getElementById("inputProfileMaxTime").value = p.maxPrepTime;
    document.getElementById("maxTimeValueDisplay").textContent = `${p.maxPrepTime} mins`;

    // Check allergy boxes
    document.querySelectorAll(".allergy-checkbox").forEach(cb => {
      cb.checked = (p.allergies || []).includes(cb.value);
    });

    this.updateModalCalculations();
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  },

  updateModalCalculations: function() {
    const age = Number(document.getElementById("inputProfileAge").value) || 28;
    const gender = document.getElementById("inputProfileGender").value;
    const height = Number(document.getElementById("inputProfileHeight").value) || 170;
    const weight = Number(document.getElementById("inputProfileWeight").value) || 70;
    const activity = document.getElementById("selectProfileActivity").value;
    const goal = document.getElementById("selectProfileGoal").value;
    const approach = document.getElementById("selectProfileApproach").value;

    const tempProfile = { age, gender, height, weight, activityLevel: activity, goal, eatingApproach: approach };
    const bmr = NutritionEngine.calculateBMR(tempProfile);
    const tdee = NutritionEngine.calculateTDEE(tempProfile);
    const targetCal = NutritionEngine.calculateTargetCalories(tempProfile);
    const macros = NutritionEngine.calculateTargetMacros(targetCal, approach);

    document.getElementById("calcBmrDisplay").textContent = `${bmr} kcal`;
    document.getElementById("calcTdeeDisplay").textContent = `${tdee} kcal`;
    document.getElementById("calcTargetCalDisplay").textContent = `${targetCal} kcal`;
    document.getElementById("calcMacrosDisplay").textContent = `${macros.protein}g Protein • ${macros.carbs}g Carbs • ${macros.fat}g Fat`;
  },

  saveProfileModal: function() {
    this.playSound("complete");
    const allergies = Array.from(document.querySelectorAll(".allergy-checkbox:checked")).map(cb => cb.value);

    const updated = {
      name: document.getElementById("inputProfileName").value.trim() || "User",
      age: Number(document.getElementById("inputProfileAge").value) || 28,
      gender: document.getElementById("inputProfileGender").value,
      height: Number(document.getElementById("inputProfileHeight").value) || 170,
      weight: Number(document.getElementById("inputProfileWeight").value) || 70,
      goalWeight: Number(document.getElementById("inputProfileGoalWeight").value) || 65,
      activityLevel: document.getElementById("selectProfileActivity").value,
      goal: document.getElementById("selectProfileGoal").value,
      foodPattern: document.getElementById("selectProfilePattern").value,
      eatingApproach: document.getElementById("selectProfileApproach").value,
      maxPrepTime: Number(document.getElementById("inputProfileMaxTime").value) || 45,
      allergies: allergies
    };

    AppState.setProfile(updated);
    this.closeProfileModal();
    this.renderHeader();
    this.renderDayTabs();
    this.renderDashboard();
    this.renderGroceryList();
    this.renderBatchPrepGuide();
    this.triggerConfetti();
  },

  closeProfileModal: function() {
    const modal = document.getElementById("profileModal");
    if (modal) modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  },

  // 4. Open Pantry Matcher ("What's In My Fridge?") Modal
  openPantryModal: function() {
    this.playSound("click");
    const modal = document.getElementById("pantryModal");
    if (!modal) return;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    this.runPantryMatch();
  },

  runPantryMatch: function() {
    const input = document.getElementById("pantrySearchInput");
    const query = (input ? input.value : "").toLowerCase().trim();
    const container = document.getElementById("pantryResultsContainer");
    if (!container) return;

    const terms = query ? query.split(",").map(s => s.trim()).filter(Boolean) : ["chicken", "spinach", "egg", "avocado", "oats"];

    const profile = AppState.state.profile;
    const allRecipes = RecipeService.filterRecipes({
      diet: profile.foodPattern,
      allergies: profile.allergies,
      maxTime: profile.maxPrepTime
    });
    const scored = allRecipes.map(recipe => {
      let matchCount = 0;
      recipe.ingredients.forEach(ing => {
        if (terms.some(t => ing.name.toLowerCase().includes(t))) {
          matchCount++;
        }
      });
      return { recipe, matchCount };
    }).filter(item => item.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);

    if (scored.length === 0) {
      container.innerHTML = `<div class="p-6 text-center text-gray-400">No matching recipes found with those ingredients. Try oats, salmon, chicken, spinach, or avocado.</div>`;
      return;
    }

    container.innerHTML = scored.slice(0, 6).map(({ recipe, matchCount }) => `
      <div class="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover-lift transition-all">
        <div class="flex items-center gap-3">
          <img src="${recipe.image}" class="w-14 h-14 rounded-xl object-cover" />
          <div>
            <h5 class="font-bold text-sm text-gray-900 dark:text-gray-100">${recipe.title}</h5>
            <div class="text-xs text-emerald-600 font-semibold flex items-center gap-2 mt-0.5">
              <span>✅ ${matchCount} matching ingredients</span>
              <span>•</span>
              <span>🔥 ${recipe.calories} kcal</span>
            </div>
          </div>
        </div>
        <button onclick="UI.openRecipeModal('${recipe.id}'); UI.closePantryModal();" 
          class="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-sm hover:bg-emerald-700">
          View Recipe
        </button>
      </div>
    `).join("");
  },

  closePantryModal: function() {
    const modal = document.getElementById("pantryModal");
    if (modal) modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  },

  // Setup Event Listeners
  setupEventListeners: function() {
    // Quick preset switch
    const presetSelect = document.getElementById("presetProfileSelect");
    if (presetSelect) {
      presetSelect.addEventListener("change", (e) => {
        if (e.target.value) {
          this.playSound("complete");
          AppState.switchPresetProfile(e.target.value);
          this.renderHeader();
          this.renderDayTabs();
          this.renderDashboard();
          this.renderGroceryList();
          this.renderBatchPrepGuide();
          this.triggerConfetti();
        }
      });
    }

    // Regenerate buttons
    const regenWeekBtn = document.getElementById("regenWeekBtn");
    if (regenWeekBtn) {
      regenWeekBtn.addEventListener("click", () => {
        if (confirm("Regenerate your entire 7-day meal plan based on your current nutrition goals?")) {
          this.playSound("complete");
          AppState.regenerateFullPlan();
          this.renderDayTabs();
          this.renderDashboard();
          this.renderGroceryList();
          this.renderBatchPrepGuide();
          this.triggerConfetti();
        }
      });
    }

    const regenDayBtn = document.getElementById("regenDayBtn");
    if (regenDayBtn) {
      regenDayBtn.addEventListener("click", () => {
        this.playSound("click");
        AppState.regenerateSingleDay(AppState.state.currentDay);
        this.renderDayTabs();
        this.renderDashboard();
        this.renderGroceryList();
        this.renderBatchPrepGuide();
      });
    }

    // Dark Mode Toggle
    const darkToggle = document.getElementById("darkModeToggle");
    if (darkToggle) {
      darkToggle.addEventListener("click", () => {
        this.playSound("click");
        AppState.toggleDarkMode();
        document.documentElement.classList.toggle("dark", AppState.state.darkMode);
      });
      // Initial state
      document.documentElement.classList.toggle("dark", AppState.state.darkMode);
    }

    // Print Plan / PDF
    const printBtn = document.getElementById("printPlanBtn");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        window.print();
      });
    }
  }
};
