document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
  
      if (searchTerm) {
        try {
          const usersResponse = await fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          const usersData = await usersResponse.json();
  
          userList.innerHTML = ''; // Clear previous results
  
          usersData.items.forEach(user => {
            const userItem = document.createElement('li');
            userItem.innerHTML = `
              <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50">
              <a href="${user.html_url}" target="_blank">${user.login}</a>
            `;
            userItem.addEventListener('click', async () => {
              try {
                const reposResponse = await fetch(`https://api.github.com/users/${user.login}/repos`, {
                  headers: {
                    'Accept': 'application/vnd.github.v3+json'
                  }
                });
                const reposData = await reposResponse.json();
  
                reposList.innerHTML = ''; // Clear previous repos
  
                reposData.forEach(repo => {
                  const repoItem = document.createElement('li');
                  repoItem.textContent = repo.full_name;
                  reposList.appendChild(repoItem);
                });
              } catch (error) {
                console.error('Error fetching repositories:', error);
              }
            });
            userList.appendChild(userItem);
          });
  
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    });
  });