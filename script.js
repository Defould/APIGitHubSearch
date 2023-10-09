const searchInput = document.querySelector('.form__input');
const autoComplete = document.querySelector('.autocomplete-list');
const repoList = document.querySelector('.repo-list');

let debounceTimeout;

searchInput.addEventListener('input', function () {
	clearTimeout(debounceTimeout);

	const inputValue = this.value.trim();

	if (inputValue === '') {
		autoComplete.innerHTML = '';
		return;
	}

	debounceTimeout = setTimeout(() => {
		fetch(`https://api.github.com/search/repositories?q=${inputValue}&per_page=5`)
			.then(response => response.json())
			.then(data => {
				const repos = data.items;
				autoComplete.innerHTML = '';
				let fragment = new DocumentFragment();

				repos.forEach(repo => {
					const li = document.createElement('li');
					li.classList.add('autocomplete-item');
					li.textContent = repo.full_name;
					li.addEventListener('click', () => {
						addRepository(repo);
						searchInput.value = '';
						autoComplete.innerHTML = '';
					});
					fragment.append(li);
				});

				autoComplete.append(fragment);
			})
			.catch(error => console.error(error));
	}, 300);
});

function addRepository(repo) {
	const li = document.createElement('li');

	li.classList.add('repo-list__item');

	li.insertAdjacentHTML(
		'beforeend',
		`<div class="repo-list__info">
            <div class="item-name">Name: ${repo.name}</div>
            <div class="item-owner">Owner: ${repo.owner.login}</div>
            <div class="item-stars">Stars: ${repo.stargazers_count}</div>
        </div>
        <button class="item-delete" onclick="removeRepository(this)"></button>`
	);

	repoList.append(li);
}

function removeRepository(button) {
	const li = button.parentElement;
	li.remove();
}
