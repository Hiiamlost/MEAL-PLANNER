const { useEffect, useMemo, useState } = React;

function RecipeExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [maxTime, setMaxTime] = useState(60);
  const [stateVersion, setStateVersion] = useState(0);

  useEffect(() => AppState.subscribe(() => {
    setStateVersion(version => version + 1);
  }), []);

  const recipes = useMemo(() => {
    const profile = AppState.state.profile;
    const normalizedQuery = query.trim().toLowerCase();

    return RecipeService.filterRecipes({
      diet: profile.foodPattern,
      allergies: profile.allergies,
      maxTime
    })
      .filter(recipe => category === "all" || recipe.category === category)
      .filter(recipe => !normalizedQuery ||
        recipe.title.toLowerCase().includes(normalizedQuery) ||
        recipe.ingredients.some(ingredient => ingredient.name.toLowerCase().includes(normalizedQuery)))
      .sort((a, b) => a.prepTime + a.cookTime - b.prepTime - b.cookTime)
      .slice(0, 6);
  }, [category, maxTime, query, stateVersion]);

  return (
    <section className="glass-panel rounded-3xl p-6 space-y-5" aria-labelledby="recipe-explorer-title">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 id="recipe-explorer-title" className="text-xl font-extrabold font-display text-slate-900 dark:text-white">
            Explore recipes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search ingredients and find meals matched to your profile.
          </p>
        </div>
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Ready within <span className="text-emerald-600 dark:text-emerald-400">{maxTime} min</span>
          <input
            type="range"
            min="10"
            max="60"
            step="5"
            value={maxTime}
            onChange={event => setMaxTime(Number(event.target.value))}
            className="block w-48 accent-emerald-600 mt-1"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
        <input
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search recipe or ingredient..."
          aria-label="Search recipes or ingredients"
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <div className="flex gap-2" role="group" aria-label="Filter by meal type">
          {["all", "breakfast", "lunch", "dinner", "snack"].map(item => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
                category === item
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {recipes.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recipes.map(recipe => (
            <article key={recipe.id} className="flex gap-3 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <img src={recipe.image} alt="" className="w-20 h-20 rounded-xl object-cover" loading="lazy" />
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">{recipe.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {recipe.prepTime + recipe.cookTime} min · {recipe.calories} kcal · {recipe.macros.protein}g protein
                </p>
                <button
                  type="button"
                  onClick={() => UI.openRecipeModal(recipe.id)}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 hover:underline"
                >
                  View recipe
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
          No recipes match those filters. Try another search or increase the time limit.
        </p>
      )}
    </section>
  );
}

ReactDOM.createRoot(document.getElementById("recipeExplorerRoot")).render(<RecipeExplorer />);
