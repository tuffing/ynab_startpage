class YnabConfigManager {
	constructor(auth, budgetManager, categoryManager) {
		this.ynabAuth = auth;
		this.budgetManager = budgetManager;
		this.categoryManager = categoryManager;

		//set up events
		document.querySelector('#Setup').addEventListener('click', () => this.toggle_config_screen());
		document.querySelector('#ConfigWrapper').addEventListener('click', () => this.toggle_config_screen());
		document.querySelector('#ConfigWrapper .close').addEventListener('click', () => this.toggle_config_screen());
		document.querySelector('.config-pane').addEventListener('click', () => {
			event.stopPropagation();
		});

		document.querySelector('#YnabFetchBudgets').addEventListener('click', () => this.fetch_budgets());
		document.querySelector('#YnabFetchCategories').addEventListener('click', () => this.fetch_categories());
		document.querySelector('#AuthKey').addEventListener('change', event => this.set_auth_key(event));

		//set up forms
		this.fill_in_existing_fields();
	}

	toggle_config_screen() {
		const config_wrapper = document.querySelector('#ConfigWrapper');

		if (config_wrapper.classList.contains('show')) {
			config_wrapper.classList.remove('show');
			config_wrapper.classList.add('hide');

			if (this.categoryManager.get_selected_categories().length) {
				this.categoryManager.fetch_category_data_api();
			}
		}
		else {
			config_wrapper.classList.add('show');
			config_wrapper.classList.remove('hide');
		}
	}

	fill_in_existing_fields() {
		const auth = document.querySelector('#AuthKey');

		auth.value = '';
		if (this.ynabAuth.get_access_token()) {
			auth.value = this.ynabAuth.get_access_token();
		}

		const budgets = this.budgetManager.fetch_budgets_cached();
		if (budgets.length) {
			document.querySelector('#NoBudgetAlert').classList.add('hide');
			this.render_budget_list(budgets);
		}

		const categories = this.categoryManager.fetch_categories_cached();
		if ('categories' in categories && categories.categories.length) {
			document.querySelector('#NoCategoriesAlert').classList.add('hide');
			this.render_categories_list(categories);
		}
	}

	set_auth_key(event) {
		this.ynabAuth.set_access_token(event.currentTarget.value);
	}

	fetch_budgets() {
		var promise = this.budgetManager.fetch_budgets_api();

		promise.then((budgets) => {
			this.render_budget_list(budgets);
		}).catch(() => this.render_budget_list([]));
	}

	fetch_categories() {
		var promise = this.categoryManager.fetch_categories_api();

		promise.then((categories) => {
			this.render_categories_list(categories);
		}).catch(() => this.render_categories_list([]));
	}

	render_categories_list(categories) {
		if (!('categories' in categories) || !categories.categories.length) {
			document.querySelector('#NoCategoriesAlert').classList.remove('hide');
			document.querySelector('#NoCategoriesAlert').classList.add('show');
			document.querySelector("#AvailableCategories").classList.add('hide');

			return;
		}

		document.querySelector('#NoCategoriesAlert').classList.remove('show');
		document.querySelector('#NoCategoriesAlert').classList.add('hide');

		let groupTemplates = document.querySelector('#CategoryGroupHeaderTemplate');
		let categoryTemplates = document.querySelector('#CategorySelectTemplate');
		document.querySelectorAll('#AvailableCategories optgroup, #AvailableCategories option').forEach(child => child.remove());
		let category_wrapper = document.querySelector("#AvailableCategories");
		category_wrapper.classList.remove('hide');

		let selected_categories = this.categoryManager.get_selected_categories();

		categories.groups.forEach((group) => {
			let clone = document.importNode(groupTemplates.content, true);
			let opt_group = clone.querySelector("optgroup");

			opt_group.setAttribute('label', group.name);
			opt_group.setAttribute('id', `group-${group.id}`);

			category_wrapper.appendChild(clone);
		});

		categories.categories.forEach((category) => {
			let clone = document.importNode(categoryTemplates.content, true);
			let option = clone.querySelector("option");

			option.setAttribute('value', category.id);
			option.textContent = category.name;

			if (selected_categories.includes(category.id)) {
				option.setAttribute('selected', 'selected');
			}

			document.querySelector(`#group-${category.group}`).appendChild(clone);
		});

		//@todo make on click as well
		document.querySelector('#AvailableCategories').addEventListener('change', event => this.select_categories(event));
	}

	select_budget(event) {
		this.budgetManager.set_selected_budget(event.currentTarget.value);
	}

	select_categories(event) {
		let categories = [];

		for (let option of event.currentTarget.selectedOptions) {
			categories.push(option.value);
		}


		this.categoryManager.set_selected_categories(categories);
	}

	render_budget_list(budgets) {
		if (!(budgets.length)) {
			document.querySelector('#NoBudgetAlert').classList.add('show');
			return;
		}

		document.querySelector('#NoBudgetAlert').classList.add('hide');

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