///
/// Handles talking to the ynab server to return data
///
class YnabRequest {
	static request_from_endpoint(endpoint, ynabAuth) {
		const apiPath = "https://api.youneedabudget.com/v1/";
		let url = `${apiPath}${endpoint}`; 

		return new Promise(function(resolve, reject) {
			var headers = new Headers();
			headers.append('Authorization', `bearer ${ynabAuth.get_access_token()}`);
			const request = new Request(url, {method: 'GET', headers: headers});

			fetch(request).then(response => {
				if (response.status === 200) {
					return response.json();
				} else {
					throw new Error('Ynab failed');
					reject(response);
				}
			}).then(response => {
				console.debug(response);
				resolve(response);
			}).catch(error => {
				console.error(error);
				reject(error);
			});
		});
	}

}