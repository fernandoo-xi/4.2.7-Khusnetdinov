var searchApp = document.createElement('div');
searchApp.id = 'app';
document.body.append(searchApp);
document.body.style.backgroundColor = '#C4C4C4';

class View {
	constructor() {
		this.app = document.getElementById('app');

		this.searchInput = this.createElement('input', 'search-input');
		this.searchInput.style.width = '500px';
		this.searchInput.style.height = '44px';
		this.searchInput.style.fontSize = '48px';
		this.searchInput.style.marginTop = '62px';
		this.repositoriesList = this.createElement('ul');
		this.repositoriesList.style.margin = '0';
		this.repositoriesList.style.marginLeft = '2px';
		this.repositoriesList.style.padding = '0';
		this.repositoriesList.style.marginBottom = '45px';


		this.app.append(this.searchInput);
		this.app.append(this.repositoriesList);
	}

	createElement(elementTag, elementClass) {
		const element = document.createElement(elementTag);
		if(elementClass) {
			element.classList.add(elementClass);
		}
		return element;
	}

	createLi(repData) {
		const liElement = this.createElement('li');
		liElement.addEventListener('click', () => this.showRepData(repData.name, repData.owner.login, repData['stargazers_count']));
		liElement.innerHTML = repData.name;
		liElement.style.listStyle = 'none';
		liElement.style.border = '2px solid black';
		liElement.style.width = '500px';
		liElement.style.height = '44px';
		liElement.style.fontSize = '30px';
		liElement.style.backgroundColor = '#E3E3E3';

		this.repositoriesList.append(liElement);
	}

	showRepData(name, login, stars){
		const repData = this.createElement('div');
		repData.style.display = 'flex';
		repData.style.justifyContent = 'space-between';
		repData.style.border = '1px solid black';
		repData.style.background = '#E27BEB';
		repData.style.width = '503px';
		repData.style.height = '101px';
		repData.style.fontSize = '24px';

		const repInfo = this.createElement('div');
		repInfo.style.marginTop = '8px';
		repInfo.style.marginLeft = '16px';

		const closeInfo = this.createElement('div');
		closeInfo.style.position = 'relative';
		closeInfo.style.top = '45px';

		const close1 = this.createElement('div');
		const close2 = this.createElement('div');

		close1.style.position = 'absolute';
		close1.style.right = '40px';
		close1.style.border = '2px solid #FF0000';
		close1.style.backgroundColor = '#FF0000'
		close1.style.width = '44px';
		close1.style.transform = 'rotate(45deg)';
		
		close2.style.position = 'absolute';
		close2.style.right = '40px';
		close2.style.border = '2px solid #FF0000';
		close2.style.backgroundColor = '#FF0000'
		close2.style.width = '44px';
		close2.style.transform = 'rotate(-45deg)';

		closeInfo.addEventListener('click', () => this.clearRepData(repData));

		const repName = this.createElement('p');
		repName.style.margin = '0';
		const repLogin = this.createElement('p');
		repLogin.style.margin = '0';
		const repStars = this.createElement('p');
		repStars.style.margin = '0';

		repName.textContent = 'Name: ' + name;
		repLogin.textContent = 'Owner: ' + login;
		repStars.textContent = 'Stars: ' + stars;

		repInfo.append(repName);
		repInfo.append(repLogin);
		repInfo.append(repStars);
		closeInfo.append(close1);
		closeInfo.append(close2);

		repData.append(repInfo);
		repData.append(closeInfo);

		this.app.append(repData);
	}

	clearRepData(repData) {
		repData.remove();
	}
}

class Search {
	constructor(view) {
		this.view = view;

		this.view.searchInput.addEventListener('keyup', this.debounce(this.searchRepositories.bind(this), 400));

	}

	async searchRepositories() {
		const searchValue = this.view.searchInput.value;
		if(searchValue) {
			this.clearList();
			return await fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=5`)
			.then((res) => {
				if(res.ok) {

					res.json().then(res => {
						res.items.forEach(repositories => this.view.createLi(repositories))
					})
				} else {

				}
			})
		} else {
			this.clearList();
		}
	}
	clearList() {
		this.view.repositoriesList.innerHTML = '';
	}



	debounce = (fn, debounceTime) => {
    	let timeout;
    	return function() {
        	const fnCall = () => {
            	fn.apply(this, arguments)
        	}
        	clearTimeout(timeout);
        	timeout = setTimeout(fnCall, debounceTime);
    	}
	};

	
}

new Search(new View());