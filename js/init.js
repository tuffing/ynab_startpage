let auth = new YnabAuth();
let budgets = new YnabBudgetsManager(auth);
let categories = new YnabCategoriesManager(auth, budgets);
let config = new YnabConfigManager(auth, budgets, categories);

categories.fetch_and_render();