document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '6e5005c8f10d4fef99e4fad701d856c5'; // <-- ¡REEMPLAZA ESTO!
    const BASE_URL = 'https://api.rawg.io/api';

    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const gameGrid = document.getElementById('game-grid');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const resultsTitle = document.getElementById('results-title');
    const paginationControls = document.getElementById('pagination-controls');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');

    let currentPage = 1;
    let currentSearchQuery = '';
    let nextPageUrl = null;
    let prevPageUrl = null;

    // --- Funciones Auxiliares ---
    const showLoading = () => {
        loadingIndicator.style.display = 'block';
        gameGrid.innerHTML = ''; // Limpiar grid mientras carga
        errorMessage.style.display = 'none';
         paginationControls.style.display = 'none';
    };

    const hideLoading = () => {
        loadingIndicator.style.display = 'none';
    };

    const showError = (message) => {
        errorMessage.textContent = `Error: ${message}`;
        errorMessage.style.display = 'block';
        gameGrid.innerHTML = ''; // Limpiar grid en caso de error
         paginationControls.style.display = 'none';
    };

    // Función para mostrar juegos en el grid
    const displayGames = (games) => {
        gameGrid.innerHTML = ''; // Limpiar resultados anteriores
        if (games.length === 0) {
            gameGrid.innerHTML = '<p>No se encontraron juegos.</p>';
            return;
        }

        games.forEach(game => {
            const gameElement = document.createElement('article');
            gameElement.classList.add('game-item');

            // Extraer nombres de plataformas y géneros
            const platformNames = game.platforms ? game.platforms.map(p => p.platform.name).join(', ') : 'N/A';
            const genreNames = game.genres ? game.genres.map(g => g.name).join(', ') : 'N/A';

            gameElement.innerHTML = `
                <a href="gamecard.html?id=${game.id}">
                    <img src="${game.background_image || 'img/juego_placeholder_1.jpg'}" alt="${game.name}">
                    <h3>${game.name}</h3>
                </a>
                <div class="details">
                    <p class="rating">⭐ ${game.rating || 'N/A'} / 5</p>
                    <p class="platforms-list"><strong>Plataformas:</strong> <span>${platformNames || 'No disponible'}</span></p>
                    <p class="genres-list"><strong>Géneros:</strong> <span>${genreNames || 'No disponible'}</span></p>
                </div>
            `;
            gameGrid.appendChild(gameElement);
        });
    };

     // Función para actualizar controles de paginación
    const updatePagination = (data) => {
        nextPageUrl = data.next;
        prevPageUrl = data.previous;

        if (nextPageUrl || prevPageUrl) {
            paginationControls.style.display = 'block'; // Mostrar controles
            nextButton.disabled = !nextPageUrl;
            prevButton.disabled = !prevPageUrl;

            // Extraer número de página actual (aproximado)
            let pageNum = 1;
             try {
                 if (nextPageUrl) {
                    const urlParams = new URLSearchParams(new URL(nextPageUrl).search);
                    pageNum = parseInt(urlParams.get('page')) - 1;
                 } else if (prevPageUrl) {
                     const urlParams = new URLSearchParams(new URL(prevPageUrl).search);
                     pageNum = parseInt(urlParams.get('page')) + 1;
                 } else if (data.results.length > 0) {
                    // Si no hay next ni prev, pero hay resultados, es la única página
                    pageNum = 1;
                 }
             } catch (e) { /* Ignorar errores de parsing URL si son null */ }

             currentPage = pageNum || 1; // Asegura que sea al menos 1
             pageInfo.textContent = `Página ${currentPage}`;

        } else {
            paginationControls.style.display = 'none'; // Ocultar si no hay paginación
        }
    };


    // --- Función Principal para Fetch API ---
    const fetchGames = async (url) => {
        showLoading();
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            hideLoading();
            displayGames(data.results);
            updatePagination(data); // Actualizar paginación con los datos recibidos

        } catch (error) {
            console.error("Error fetching games:", error);
            hideLoading();
            showError(`No se pudieron cargar los juegos. ${error.message}. Asegúrate de que tu API Key es válida.`);
        }
    };

    // --- Event Listeners ---
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        currentSearchQuery = searchInput.value.trim();
        currentPage = 1; // Resetear página al buscar
        if (currentSearchQuery) {
            resultsTitle.textContent = `Resultados para: "${currentSearchQuery}"`;
            const searchUrl = `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(currentSearchQuery)}&page_size=12`; // page_size controla cuántos por página
            fetchGames(searchUrl);
        } else {
            // Si la búsqueda está vacía, cargar populares de nuevo
            resultsTitle.textContent = 'Juegos Populares';
            loadInitialGames();
        }
    });

    prevButton.addEventListener('click', () => {
        if (prevPageUrl) {
            fetchGames(prevPageUrl);
        }
    });

    nextButton.addEventListener('click', () => {
        if (nextPageUrl) {
            fetchGames(nextPageUrl);
        }
    });


    // --- Carga Inicial ---
    const loadInitialGames = () => {
         resultsTitle.textContent = 'Juegos Populares';
         currentSearchQuery = ''; // Asegura que no haya búsqueda activa
         currentPage = 1;
         // Ejemplo: Cargar juegos populares ordenados por rating descendente
         const initialUrl = `${BASE_URL}/games?key=${API_KEY}&ordering=-rating&page_size=12`;
         fetchGames(initialUrl);
    };

    // Cargar juegos populares al iniciar
    loadInitialGames();

});