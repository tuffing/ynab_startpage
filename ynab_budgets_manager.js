class YnabBudgetsManager {
	constructor(auth) {
		this.ynab_auth = auth;
	}

	fetch_budgets_api() {
		var promise = YnabRequest.request_from_endpoint(`budgets`, this.ynab_auth);

		promise.then(json => {
			if (!'data' in json || !'category_groups' in json.data || !json.data.category_groups.length) {
				return;
			}

			json.data.category_groups.forEach(category_group => {
				if (category_group.id != group_to_display_id)
					return;

				this.process_category_group(category_group.categories);
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


}