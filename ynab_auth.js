class YnabAuth {
	constructor(access_token = null) {
		//this version of the start page will just use Personal Access Tokens.
		//the intention is that this object will eventually fetch the access key via OAuth.

		if (access_token != null) {
			this.set_access_token(access_token);
		}
	}
	
	set_access_token(access_token) {
		this.access_token = access_token;
		localStorage.setItem('token', access_token);
	}

	get_access_token() {
		this.access_token = localStorage.getItem('token');
		return this.access_token;
	}

}