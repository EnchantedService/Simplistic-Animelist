// script.js
document.addEventListener('DOMContentLoaded', () => {
    const animeForm = document.getElementById('anime-form');
    const animeList = document.getElementById('anime-items');
    const searchInput = document.getElementById('search-anime');
    const filterStatus = document.getElementById('filter-status');
    let animes = JSON.parse(localStorage.getItem('animes')) || [];

    function saveAnimes() {
        localStorage.setItem('animes', JSON.stringify(animes));
    }

    function renderAnimes(filteredAnimes = animes) {
        animeList.innerHTML = '';
        filteredAnimes.forEach((anime, index) => {
            const li = document.createElement('li');
            li.className = 'anime-item';
            li.innerHTML = `
                <div>
                    <span class="anime-title">${anime.title}</span>
                    <span class="anime-status">${anime.status}</span>
                </div>
                <button class="remove-btn" data-index="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            animeList.appendChild(li);
        });
    }

    function addAnime(e) {
        e.preventDefault();
        const title = document.getElementById('anime-title').value.trim();
        const status = document.getElementById('anime-status').value;
        if (title && status) {
            animes.push({ title, status });
            saveAnimes();
            renderAnimes();
            animeForm.reset();

            anime({
                targets: animeList.lastElementChild,
                translateY: [50, 0],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutElastic(1, .8)'
            });
        }
    }

    function removeAnime(index) {
        const removedAnime = animeList.children[index];
        anime({
            targets: removedAnime,
            translateX: [0, -50],
            opacity: [1, 0],
            duration: 800,
            easing: 'easeInElastic(1, .8)',
            complete: () => {
                animes.splice(index, 1);
                saveAnimes();
                renderAnimes();
            }
        });
    }

    function searchAnimes() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredAnimes = animes.filter(anime => 
            anime.title.toLowerCase().includes(searchTerm)
        );
        renderAnimes(filteredAnimes);
    }

    function filterAnimes() {
        const status = filterStatus.value;
        const filteredAnimes = status === 'all' 
            ? animes 
            : animes.filter(anime => anime.status === status);
        renderAnimes(filteredAnimes);
    }

    animeForm.addEventListener('submit', addAnime);
    searchInput.addEventListener('input', searchAnimes);
    filterStatus.addEventListener('change', filterAnimes);
    animeList.addEventListener('click', (e) => {
        if (e.target.closest('.remove-btn')) {
            const index = e.target.closest('.remove-btn').dataset.index;
            removeAnime(index);
        }
    });

    renderAnimes();

    anime({
        targets: 'header h1, header p',
        translateY: [-50, 0],
        opacity: [0, 1],
        delay: anime.stagger(200),
        duration: 1000,
        easing: 'easeOutQuad'
    });
});