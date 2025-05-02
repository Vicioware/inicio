document.addEventListener('DOMContentLoaded', () => {
    // *** API Key ACTUALIZADA ***
    const API_KEY = '6e5005c8f10d4fef99e4fad701d856c5';
    const BASE_URL = 'https://api.rawg.io/api';

    // --- Selectores del DOM (cacheados) ---
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

    // --- Estado ---
    let currentPage = 1;
    let currentSearchQuery = '';
    let nextPageUrl = null;
    let prevPageUrl = null;
    let currentAbortController = null; // Para cancelar fetches anteriores

    // --- Funciones Auxiliares ---
    const showLoading = () => {
        loadingIndicator.style.display = 'block';
        gameGrid.innerHTML = '';
        errorMessage.style.display = 'none';
        paginationControls.style.display = 'none';
    };

    const hideLoading = () => {
        loadingIndicator.style.display = 'none';
    };

    const showError = (message) => {
        errorMessage.textContent = `Error: ${message}`;
        errorMessage.style.display = 'block';
        gameGrid.innerHTML = '';
        paginationControls.style.display = 'none';
    };

    // *** MODIFICACIÓN: displayGames usa DocumentFragment ***
    const displayGames = (games) => {
        // Crear un DocumentFragment para añadir elementos eficientemente
        const fragment = document.createDocumentFragment();

        if (!games || games.length === 0) {
            const noResults = document.createElement('p');
            noResults.textContent = 'No se encontraron juegos que coincidan con tu búsqueda.';
            noResults.style.textAlign = 'center';
            fragment.appendChild(noResults);
        } else {
            games.forEach(game => {
                const gameElement = document.createElement('article');
                gameElement.classList.add('game-item');

                const platformNames = game.platforms?.map(p => p.platform.name).filter(Boolean).join('</span><span>') || 'N/A';
                const genreNames = game.genres?.map(g => g.name).filter(Boolean).join('</span><span>') || 'N/A';
                const gameName = game.name || 'Título no disponible';
                const imageUrl = game.background_image; // Usar una URL por defecto más robusta si es necesario

                // Usar plantillas literales para legibilidad, pero crear elementos puede ser marginalmente más rápido
                gameElement.innerHTML = `
                    <a href="gamecard.html?id=${game.id}" aria-label="Ver detalles de ${gameName}">
                        <img src="${imageUrl || 'img/placeholder_cover.png'}" alt="Portada de ${gameName}" loading="lazy" onerror="this.onerror=null; this.src='img/placeholder_cover.png';">
                        <h3>${gameName}</h3>
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
                fragment.appendChild(gameElement); // Añadir al fragmento, no al DOM directamente
            });
        }
        // Limpiar el grid y añadir el fragmento una sola vez
        gameGrid.innerHTML = '';
        gameGrid.appendChild(fragment);
    };

    // Actualiza la paginación (sin cambios mayores)
    const updatePagination = (data) => {
        nextPageUrl = data.next;
        prevPageUrl = data.previous;

        if (nextPageUrl || prevPageUrl) {
            paginationControls.style.display = 'flex';
            nextButton.disabled = !nextPageUrl;
            prevButton.disabled = !prevPageUrl;

            let pageNum = 1;
            const url = nextPageUrl || prevPageUrl;
            if (url) {
                 try {
                    const urlParams = new URLSearchParams(new URL(url).search);
                    const pageParam = urlParams.get('page');
                     if (pageParam) {
                         pageNum = parseInt(pageParam);
                         if (prevPageUrl && !nextPageUrl) {
                             pageNum +=1;
                         } else if (nextPageUrl && prevPageUrl) {
                             pageNum = nextPageUrl ? pageNum -1 : pageNum + 1;
                         }
                         else if (nextPageUrl && !prevPageUrl){
                            pageNum = 1;
                         }
                     }
                 } catch (e) {
                    console.warn("Error parsing page number from URL", e);
                    pageNum = currentPage;
                 }
            } else if (data.results?.length > 0) {
                pageNum = 1;
            }
             currentPage = pageNum > 0 ? pageNum : 1;
             pageInfo.textContent = `Página ${currentPage}`;
        } else {
            paginationControls.style.display = 'none';
        }
    };

    // --- Función Principal para Fetch API ---
    const fetchGames = async (url) => {
        showLoading();

        // *** OPTIMIZACIÓN: Cancelar fetch anterior si existe ***
        if (currentAbortController) {
            currentAbortController.abort();
        }
        // Crear un nuevo AbortController para esta petición
        currentAbortController = new AbortController();
        const signal = currentAbortController.signal;

        // Validar API Key
        if (!API_KEY || API_KEY === 'TU_API_KEY_AQUI') { // Verifica si aún es el placeholder
             hideLoading();
             showError("API Key no configurada correctamente.");
             console.error("API Key inválida o no reemplazada.");
             return;
        }

        try {
            const response = await fetch(url, { signal }); // Pasar la señal al fetch

            // Resetear controlador después de que la petición finalice (éxito o error manejado)
            currentAbortController = null;

            if (!response.ok) {
                 if (response.status === 401 || response.status === 403) {
                     throw new Error(`Error de autenticación (${response.status}). Verifica tu API Key.`);
                 } else if (response.status === 404) {
                     // No es necesariamente un error si la búsqueda no devuelve nada
                     hideLoading();
                     displayGames([]); // Mostrar mensaje "No se encontraron"
                     updatePagination({ next: null, previous: null, results: [] }); // Limpiar paginación
                     return; // Salir sin mostrar error
                 }
                throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            hideLoading();
            displayGames(data.results);
            updatePagination(data);

        } catch (error) {
             // Resetear controlador si el fetch falló
             currentAbortController = null;
             // Ignorar errores de aborto intencional
             if (error.name === 'AbortError') {
                console.log('Fetch abortado');
                return;
             }
            console.error("Error fetching games:", error);
            hideLoading();
            showError(`No se pudieron cargar los juegos. ${error.message}`);
        }
    };

    // --- Event Listeners ---
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm === currentSearchQuery) return; // Evitar búsqueda idéntica

        currentSearchQuery = searchTerm;
        currentPage = 1;
        if (currentSearchQuery) {
            resultsTitle.textContent = `Resultados para: "${currentSearchQuery}"`;
            const searchUrl = `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(currentSearchQuery)}&page_size=18&page=${currentPage}`;
            fetchGames(searchUrl);
        } else {
            resultsTitle.textContent = 'Juegos Populares';
            loadInitialGames();
        }
    });

    prevButton.addEventListener('click', () => {
        if (prevPageUrl) fetchGames(prevPageUrl);
    });

    nextButton.addEventListener('click', () => {
        if (nextPageUrl) fetchGames(nextPageUrl);
    });

    // --- Carga Inicial ---
    const loadInitialGames = () => {
         resultsTitle.textContent = 'Juegos Populares';
         currentSearchQuery = '';
         currentPage = 1;
         const initialUrl = `${BASE_URL}/games?key=${API_KEY}&ordering=-added&page_size=18&page=${currentPage}`;
         fetchGames(initialUrl);
    };

    loadInitialGames();
});