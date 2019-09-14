class YnabCategoriesManager {
	constructor(auth) {
		this.ynab_auth = auth;
	}

	fetch(group_to_display_id) {
		let dateString = localStorage.getItem('lastFetch');

		if (!dateString || +dateString + (60000 * 60) < Date.now()) {
			this.fetch_categories_api(group_to_display_id);
		}
		else {
			this.fetch_categories_cached();
		}
	}

	fetch_categories_api(group_to_display_id) {
		var promise = YnabRequest.request_from_endpoint(`budgets/${budget_id}/categories`, this.ynab_auth);

		promise.then(json => {
			if (!'data' in json || !'category_groups' in json.data || !json.data.category_groups.length) {
				return;
			}

			localStorage.setItem('lastFetch', Date.now());

			json.data.category_groups.forEach(category_group => {
				if (category_group.id != group_to_display_id)
					return;

				this.process_category_group(category_group.categories);
			});
		});
	}

	fetch_categories_cached() {
		let categories = JSON.parse(localStorage.getItem('categories'));
		if (categories == null)
			categories = [];

		this.render(categories);
	}

	process_category_group(group_data) {
		let categories = [];

		group_data.forEach(category => {
			if (category.hidden || category.budgeted === 0)
				return;

			categories.push({'name': category.name, 'budgeted': category.budgeted, 'balance': category.balance, 'spent': category.activity});
		});
		//console.table(JSON.stringify(categories));
		localStorage.setItem('categories', JSON.stringify(categories));

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