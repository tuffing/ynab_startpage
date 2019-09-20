class YnabConfigManager {
	constructor(auth, budgetManager, categoryManager) {
		this.ynab_auth = auth;
		this.budgetManager = budgetManager;
		this.categoryManager = categoryManager;

		//set up events
		document.querySelector('#Setup').addEventListener('click', event => this.toggle_config_screen());
		document.querySelector('#ConfigWrapper').addEventListener('click', event => this.toggle_config_screen());
		document.querySelector('#ConfigWrapper .close').addEventListener('click', event => this.toggle_config_screen());
		document.querySelector('.config-pane').addEventListener('click', event => {event.stopPropagation()});

		document.querySelector('#YnabFetchBudgets').addEventListener('click', event => this.fetch_budgets());
		document.querySelector('#YnabFetchCategories').addEventListener('click', event => this.fetch_categories());

		//set up forms
		this.fill_in_existing_fields();
	}

	toggle_config_screen() {
		const config_wrapper = document.querySelector('#ConfigWrapper');

		if (config_wrapper.classList.contains('show')) {
			config_wrapper.classList.remove('show');
			config_wrapper.classList.add('hide');
		}
		else {
			config_wrapper.classList.add('show');
			config_wrapper.classList.remove('hide');
		}
	}

	fill_in_existing_fields() {
		const auth = document.querySelector('#AuthKey');
		auth.value = this.ynab_auth.get_access_token();

		const budgets = this.budgetManager.fetch_budgets_cached();
		if (budgets.length) {
			document.querySelector('#NoBudgetAlert').classList.add('hide');
		}

		this.render_budget_list(budgets);
	}

	fetch_budgets() {
		var promise = this.budgetManager.fetch_budgets_api();

		promise.then((budgets) => {
			this.render_budget_list(budgets);
		}).catch((err) => this.render_budget_list([]));
	}


	fetch_categories() {
		var promise = this.categoryManager.fetch_categories_api();

		promise.then((categories) => {
			this.render_categories_list(categories);
		}).catch((err) => this.render_categories_list([]));
	}

	render_categories_list(categories) {
		if (!'categories' in categories || !categories.categories.length) {
			document.querySelector('#NoCategoriesAlert').classList.remove('hide');
			document.querySelector('#NoCategoriesAlert').classList.add('show');
			document.querySelector("#AvailableCategories").classList.add('hide');

			return;
		}
		else {
			document.querySelector('#NoCategoriesAlert').classList.remove('show');
			document.querySelector('#NoCategoriesAlert').classList.add('hide');
		}

		var groupTemplates = document.querySelector('#CategoryGroupHeaderTemplate');
		var categoryTemplates = document.querySelector('#CategorySelectTemplate');
		document.querySelectorAll('#AvailableCategories optgroup, #AvailableCategories option').forEach(child => child.remove());
		var category_wrapper = document.querySelector("#AvailableCategories");
		category_wrapper.classList.remove('hide');

		let groups = new Map();

		categories.groups.forEach((group) => {
			var clone = document.importNode(groupTemplates.content, true);
			let opt_group = clone.querySelector("optgroup");

			opt_group.setAttribute('label', group.name);
			opt_group.setAttribute('id', `group-${group.id}`);

			category_wrapper.appendChild(clone);

			//groups.set(group.id, clone);
		});

		categories.categories.forEach((category) => {
			var clone = document.importNode(categoryTemplates.content, true);
			let option = clone.querySelector("option");

			option.setAttribute('value', category.id);
			option.textContent = category.name;
			//@TODO
			//let test = groups.get(category.group);
			let test = document.querySelector(`#group-${category.group}`);
			document.querySelector(`#group-${category.group}`).appendChild(clone);
			//groups.get(category.group).querySelector("optgroup").appendChild(clone);
		});
	}

	select_budget(event) {
		this.budgetManager.set_selected_budget(event.currentTarget.value);
	}

	render_budget_list(budgets) {
		if (!budgets.length) {
			document.querySelector('#NoBudgetAlert').classList.add('show');
			return;
		}
		else {
			document.querySelector('#NoBudgetAlert').classList.add('hide');
		}

		let current_budget = this.budgetManager.get_selected_budget();

		var template = document.querySelector('#BudgetListTemplate');
		document.querySelectorAll('#AvailableBudgets input, #AvailableBudgets label').forEach(child => child.remove());
		var budget_wrapper = document.querySelector("#AvailableBudgets");

		budgets.forEach((budget) => {
			var clone = document.importNode(template.content, true);
			let label = clone.querySelector("label");
			label.textContent = budget.name;
			label.setAttribute('for', budget.id);

			let input = clone.querySelector("input");
			input.setAttribute('value', budget.id);
			input.setAttribute('id', budget.id);

			if (budget.id === current_budget) {
				input.setAttribute('checked', 'checked');
			}

			budget_wrapper.appendChild(clone);
		});

		document.querySelectorAll('#AvailableBudgets input').forEach(child => child.addEventListener('change', event => this.select_budget(event)));
	}
}