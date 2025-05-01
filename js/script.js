document.addEventListener('DOMContentLoaded', () => {
    // Clave API (REEMPLAZAR CON LA TUYA PROPIA)
    const API_KEY = '6e5005c8f10d4fef99e4fad701d856c5'; // <-- ¡REEMPLAZA ESTO!
    const BASE_URL = 'https://api.rawg.io/api';

    // Selectores del DOM
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

    // Estado de paginación
    let currentPage = 1;
    let currentSearchQuery = '';
    let nextPageUrl = null;
    let prevPageUrl = null;

    // --- Funciones Auxiliares ---

    // Muestra el indicador de carga y limpia errores/resultados
    const showLoading = () => {
        loadingIndicator.style.display = 'block';
        gameGrid.innerHTML = '';
        errorMessage.style.display = 'none';
        paginationControls.style.display = 'none';
    };

    // Oculta el indicador de carga
    const hideLoading = () => {
        loadingIndicator.style.display = 'none';
    };

    // Muestra un mensaje de error
    const showError = (message) => {
        errorMessage.textContent = `Error: ${message}`;
        errorMessage.style.display = 'block';
        gameGrid.innerHTML = '';
        paginationControls.style.display = 'none';
    };

    // Función para mostrar juegos en el grid
    const displayGames = (games) => {
        gameGrid.innerHTML = '';
        if (!games || games.length === 0) {
            gameGrid.innerHTML = '<p style="text-align: center;">No se encontraron juegos que coincidan con tu búsqueda.</p>';
            return;
        }

        games.forEach(game => {
            const gameElement = document.createElement('article');
            gameElement.classList.add('game-item');

            // Extraer y formatear plataformas y géneros de forma segura
            const platformNames = game.platforms?.map(p => p.platform.name).filter(Boolean).join('</span><span>') || 'N/A';
            const genreNames = game.genres?.map(g => g.name).filter(Boolean).join('</span><span>') || 'N/A';

            // Crear el HTML del item del juego
            // *** OPTIMIZACIÓN: Añadido loading="lazy" a la imagen ***
            gameElement.innerHTML = `
                <a href="gamecard.html?id=${game.id}" aria-label="Ver detalles de ${game.name}">
                    <img src="${game.background_image || 'img/juego_placeholder_1.jpg'}" alt="Portada de ${game.name}" loading="lazy">
                    <h3>${game.name || 'Título no disponible'}</h3>
                </a>
                <div class="details">
                    <p class="rating">⭐ ${game.rating?.toFixed(1) || 'N/A'} / 5</p>
                    <p class="platforms-list">
                        <strong>Plataformas:</strong>
                        <span>${platformNames}</span>
                    </p>
                    <p class="genres-list">
                        <strong>Géneros:</strong>
                        <span>${genreNames}</span>
                    </p>
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
            paginationControls.style.display = 'flex'; // Usar flex para centrar si se desea
            nextButton.disabled = !nextPageUrl;
            prevButton.disabled = !prevPageUrl;

            // Calcular número de página actual (más robusto)
            let pageNum = 1;
            const url = nextPageUrl || prevPageUrl; // Usar cualquier URL válida para extraer la página
            if (url) {
                 try {
                    const urlParams = new URLSearchParams(new URL(url).search);
                    const pageParam = urlParams.get('page');
                     if (pageParam) {
                         // Si viene de next, es la página anterior + 1
                         // Si viene de prev, es la página siguiente - 1
                         pageNum = parseInt(pageParam);
                         if (prevPageUrl && !nextPageUrl) { // Última página
                             pageNum +=1;
                         } else if (nextPageUrl && prevPageUrl) { // Página intermedia
                             // Si next es page=3, estamos en la 2. Si prev es page=1, estamos en la 2.
                             pageNum = nextPageUrl ? pageNum -1 : pageNum + 1;
                         }
                         // Si solo hay next (estamos en pág 1), pageNum será 2, necesitamos 1
                         else if (nextPageUrl && !prevPageUrl){
                            pageNum = 1;
                         }
                     }
                 } catch (e) {
                    console.warn("Error parsing page number from URL", e);
                    pageNum = currentPage; // Mantener página actual si hay error
                 }
            } else if (data.results?.length > 0) {
                pageNum = 1; // Única página
            }

             currentPage = pageNum > 0 ? pageNum : 1; // Asegurar que sea al menos 1
             pageInfo.textContent = `Página ${currentPage}`;

        } else {
            paginationControls.style.display = 'none';
        }
    };

    // --- Función Principal para Fetch API ---
    const fetchGames = async (url) => {
        showLoading();
        // Validar API Key básica
        if (!API_KEY || API_KEY === 'TU_API_KEY_AQUI') {
             hideLoading();
             showError("API Key no configurada. Reemplaza 'TU_API_KEY_AQUI' en js/script.js.");
             return;
        }

        try {
            // Añadir timestamp para intentar evitar caché agresiva si es necesario (opcional)
            // const urlWithCacheBust = `${url}&_=${new Date().getTime()}`;
            const response = await fetch(url);

            if (!response.ok) {
                // Manejar errores específicos como 401 (Unauthorized) o 403 (Forbidden)
                 if (response.status === 401 || response.status === 403) {
                     throw new Error(`Error de autenticación (${response.status}). Verifica tu API Key.`);
                 }
                throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            hideLoading();
            displayGames(data.results);
            updatePagination(data);

        } catch (error) {
            console.error("Error fetching games:", error);
            hideLoading();
            showError(`No se pudieron cargar los juegos. ${error.message}`);
        }
    };

    // --- Event Listeners ---
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        currentSearchQuery = searchInput.value.trim();
        currentPage = 1;
        if (currentSearchQuery) {
            resultsTitle.textContent = `Resultados para: "${currentSearchQuery}"`;
            // page_size controla cuántos por página, 18 es un buen número para grids
            const searchUrl = `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(currentSearchQuery)}&page_size=18&page=${currentPage}`;
            fetchGames(searchUrl);
        } else {
            resultsTitle.textContent = 'Juegos Populares';
            loadInitialGames(); // Cargar populares si la búsqueda está vacía
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
         currentSearchQuery = '';
         currentPage = 1;
         const initialUrl = `${BASE_URL}/games?key=${API_KEY}&ordering=-added&page_size=18&page=${currentPage}`; // Ordenar por añadidos recientemente
         fetchGames(initialUrl);
    };

    // Cargar juegos al iniciar
    loadInitialGames();
});