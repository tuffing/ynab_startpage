class YnabConfigManager {
	constructor(auth, budgetManager) {
		this.ynab_auth = auth;
		this.budgetManager = budgetManager;

		//set up events
		const config_button = document.querySelector('#Setup');
		const wrapper = document.querySelector('#ConfigWrapper');
		const close = document.querySelector('#ConfigWrapper .close');
		const pane = document.querySelector('.config-pane');

		config_button.addEventListener('click', event => this.toggle_config_screen());
		wrapper.addEventListener('click', event => this.toggle_config_screen());
		close.addEventListener('click', event => this.toggle_config_screen());
		pane.addEventListener('click', event => {event.stopPropagation()});

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
			document.querySelector('#NoBudgetAlert').classList.addClass('hide');
		}
	}

	add_available_budgets() {
		//AvailableBudgets
		document.querySelectorAll('#AvailableBudgets .label').forEach(child => child.remove());
		
	}
}