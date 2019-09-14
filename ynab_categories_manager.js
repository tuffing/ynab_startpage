class YnabCategoriesManager {
	constructor(auth) {
		this.ynab_auth = auth;
	}

	fetch_categories(group_to_display_id) {
		var promise = YnabRequest.request_from_endpoint(`budgets/${budget_id}/categories`, this.ynab_auth);

		promise.then(json => {
			//json.data.category_groups[0].id
			if (!'data' in json || !'category_groups' in json.data || !json.data.category_groups.length) {
				return;
			}

			json.data.category_groups.forEach(category_group => {
				if (category_group.id != group_to_display_id)
					return;

				this.process_category_group(category_group.categories);

			});

		}).finally(() => {
			localStorage.clear();
		});	
	}

	process_category_group(group_data) {
		let categories = [];

		group_data.forEach(category => {
			if (category.hidden || category.budgeted === 0)
				return;

			categories.push({'name': category.name, 'budgeted': category.budgeted, 'balance': category.balance, 'spent': category.activity});
		});

		this.render(categories);
	}

	render(categories = []) {
		document.querySelectorAll('#Categories .category').forEach(child => child.remove());

		categories.forEach(category => this.render_single(category.name, category.budgeted, category.balance, category.spent));
	}

	render_single(name, budgeted, balance, spent) {
		var template = document.querySelector('#YnabBlock');
		var category_wrapper = document.querySelector("#Categories");

		var clone = document.importNode(template.content, true);

		clone.querySelector(".name").textContent = name;
		clone.querySelector(".budgeted").textContent = budgeted;
		clone.querySelector(".balance").textContent = balance;
		clone.querySelector(".spent").textContent = spent;

		category_wrapper.appendChild(clone);
	}

}