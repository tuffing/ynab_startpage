class YnabCategoriesManager {
	constructor(auth, budgetManager) {
		this.ynab_auth = auth;
		this.budgetManager = budgetManager;
	}

	fetch_and_render() {
		document.querySelectorAll('#Categories .category').forEach(child => child.remove());

		let dateString = localStorage.getItem('last_fetch');

		if (this.get_selected_categories() == null || !this.get_selected_categories().length) {
			document.querySelector('#Categories').textContent = 'No categories set';
			return;
		}

		//datestring will be in millseconds. so one minute is 60000
		if (!dateString || +dateString + (60000 * 60) < Date.now()) {
			this.fetch_category_data_api();
		}
		else {
			this.fetch_category_data_cached();
		}
	}


	fetch_category_data_api() {
		let data = [];
		let promises = [];
		this.get_selected_categories().forEach((category) => {
			let promise = new Promise((resolve, reject) => {
				var request = YnabRequest.request_from_endpoint(`budgets/${this.budgetManager.get_selected_budget()}/categories/${category}`, this.ynab_auth);
				request.then(json => {
					if (!'data' in json || !'category' in json.data) {
						return;
					}

					let data_obj = {'name': json.data.category.name, 'id': json.data.category.id, 'budgeted': json.data.category.budgeted, 'balance': json.data.category.balance, 'spent': Math.abs(json.data.category.activity)};
					data.push(data_obj);
					resolve(data_obj);
				}).catch((err) => {
					reject(err);
				});
			});
			promises.push(promise);
		});

		Promise.all(promises).then(() => {
			//@todo order data alphabetically
			localStorage.setItem('category_data', JSON.stringify(data));
			localStorage.setItem('last_fetch', Date.now());
			this.fetch_and_render();
		});
	}

	fetch_category_data_cached() {
		let data = JSON.parse(localStorage.getItem('category_data'));
		if (data == null)
			return;

		data.forEach(category => this.render_single(category.name, category.budgeted, category.balance, category.spent));
	}

	fetch_categories_api() {
		var promise = YnabRequest.request_from_endpoint(`budgets/${this.budgetManager.get_selected_budget()}/categories`, this.ynab_auth);

		return new Promise((resolve, reject) => {
			promise.then(json => {
				if (!'data' in json || !'category_groups' in json.data || !json.data.category_groups.length) {
					reject();
				}

				let groupNames = [];
				let categories = [];

				json.data.category_groups.forEach(category_group => {
					groupNames.push({'id': category_group.id,'name': category_group.name});

					let group_cats = this.process_category_group(category_group.categories);
					categories = categories.concat(group_cats);
				});

				let categoriesList = {'groups': groupNames,'categories': categories};
				localStorage.setItem('categories_list', JSON.stringify(categoriesList));
				resolve(categoriesList);
			}).catch((err) => {
				reject(err);
			});
		});
	}

	fetch_categories_cached() {
		let categories = JSON.parse(localStorage.getItem('categories_list'));
		if (categories == null)
			categories = [];

		return categories;
	}

	set_selected_categories(category_ids = []) {
		this.category_ids = category_ids;
		localStorage.setItem('category_ids', JSON.stringify(category_ids));
	}

	get_selected_categories() {
		if (!this.category_ids) {
			this.category_ids = JSON.parse(localStorage.getItem('category_ids'));

			if (!this.category_ids)
				return [];
		}

		return this.category_ids;
	}

	process_category_group(group_data) {
		let categories = [];

		group_data.forEach(category => {
			categories.push({'name': category.name, 'id': category.id, 'group': category.category_group_id, 'budgeted': category.budgeted, 'balance': category.balance, 'spent': Math.abs(category.activity)});
		});

		return categories;
	}

	render_single(name, budgeted, balance, spent) {
		var template = document.querySelector('#YnabBlock');
		var category_wrapper = document.querySelector("#Categories");

		var clone = document.importNode(template.content, true);

		clone.querySelector(".name").textContent = name;
		//math to work out dash offset for 'progress' is the stroke-dasharray - (stroke-dasharray * percentage / 100)
		//251.2-(251.2×(spent/budgeted))
		let percentage = spent/budgeted*100;
		clone.querySelector(".progress").setAttribute('stroke-dashoffset', 251.2-(251.2*percentage/100));

		if (percentage > 55)
			clone.querySelector(".progress").classList.add('nearing-complete');

		if (percentage > 75)
			clone.querySelector(".progress").classList.add('nearing-complete-alert');


		category_wrapper.appendChild(clone);
	}

}