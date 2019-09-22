class YnabBudgetsManager {
	constructor(auth, budgetManager) {
		this.ynab_auth = auth;
		this.budgetManager = budgetManager;
	}

	fetch_budgets_api() {
		var promise = YnabRequest.request_from_endpoint(`budgets`, this.ynab_auth);

		return new Promise((resolve, reject) => {
			promise.then(json => {
				let budgets = [];
				if (!('data' in json) || !('budgets' in json.data) || !(json.data.budgets.length)) {
					resolve(budgets);
				}

				json.data.budgets.forEach(budget => {
					budgets.push({'id': budget.id, 'name': budget.name});
				});

				this.save_budgets(budgets);
				resolve(budgets);
			}).catch((err) => {
				reject(err);
			});
		});
	}

	///@returns array of budget {id,name}
	fetch_budgets_cached() {
		let budgets = JSON.parse(localStorage.getItem('budgets'));
		if (budgets == null)
			budgets = [];

		return budgets;
	}

	save_budgets(budgets) {
		localStorage.setItem('budgets', JSON.stringify(budgets));
	}

	set_selected_budget(budget_id) {
		this.budget_id = budget_id;
		localStorage.setItem('budget_id', budget_id);
	}

	get_selected_budget() {
		if (!this.budget_id) {
			this.budget_id = localStorage.getItem('budget_id');
		}

		return this.budget_id;
	}
}