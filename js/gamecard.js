document.addEventListener('DOMContentLoaded', () => {
    // *** API Key ACTUALIZADA ***
    const API_KEY = '6e5005c8f10d4fef99e4fad701d856c5';
    const BASE_URL = 'https://api.rawg.io/api';

    // --- Selectores del DOM ---
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const detailContent = document.getElementById('game-detail-content');
    const gameTitle = document.getElementById('game-title');
    const gameMainImage = document.getElementById('game-main-image');
    const gameGenres = document.getElementById('game-genres');
    const gamePlatforms = document.getElementById('game-platforms');
    const gameReleaseDate = document.getElementById('game-release-date');
    const gameDevelopers = document.getElementById('game-developers');
    const gamePublishers = document.getElementById('game-publishers');
    const gameRating = document.getElementById('game-rating');
    const gameMetacritic = document.getElementById('game-metacritic');
    const gameWebsite = document.getElementById('game-website');
    const gameDescription = document.getElementById('game-description');
    const gameTagsContainer = document.getElementById('game-tags-container');
    const gameTags = document.getElementById('game-tags');
    const gameStoresContainer = document.getElementById('game-stores');
    const screenshotsGrid = document.getElementById('screenshots-grid');
    const screenshotsLoading = document.getElementById('screenshots-loading');
    const screenshotsError = document.getElementById('screenshots-error');

    // --- Funciones Auxiliares ---
    const showLoading = () => {
        loadingIndicator.style.display = 'block';
        detailContent.style.display = 'none';
        errorMessage.style.display = 'none';
    };

    const hideLoading = () => {
        loadingIndicator.style.display = 'none';
    };

     const showError = (message) => {
        errorMessage.textContent = `Error: ${message}`;
        errorMessage.style.display = 'block';
        detailContent.style.display = 'none';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (e) { return dateString; }
    };

     const formatList = (list) => {
         if (!list || list.length === 0) return 'N/A';
         return list.map(item => item.name || item.platform?.name || item.store?.name || item.developer?.name || item.publisher?.name || item.tag?.name || '??').filter(Boolean).join(', ');
     };

    const formatStoresList = (stores) => {
        if (!stores || stores.length === 0) return '';
        return stores.map(s =>
            `<a href="https://${s.store.domain}" target="_blank" rel="noopener noreferrer" title="Ver en ${s.store.name}">${s.store.name}</a>`
        ).join(' ');
    };

    const formatTagsList = (tags) => {
         if (!tags || tags.length === 0) return '';
         return tags.map(tag => `<span>${tag.name}</span>`).join(' ');
    };

    // *** NUEVO: Función para limpiar contenido previo (si se reusa la página) ***
    const clearDetails = () => {
        gameTitle.textContent = '';
        document.title = 'Detalles del Juego - Mi Biblioteca de Juegos'; // Resetear título
        gameMainImage.src = ''; // Usar un placeholder transparente o quitar src
        gameMainImage.alt = 'Cargando portada...';
        gameGenres.textContent = '';
        gamePlatforms.textContent = '';
        gameReleaseDate.textContent = '';
        gameDevelopers.textContent = '';
        gamePublishers.textContent = '';
        gameRating.textContent = '';
        gameMetacritic.textContent = '';
        gameWebsite.innerHTML = ''; // Limpiar posible enlace
        gameDescription.innerHTML = '';
        gameTags.innerHTML = '';
        gameTagsContainer.style.display = 'none';
        gameStoresContainer.innerHTML = '';
        gameStoresContainer.style.display = 'none';
        screenshotsGrid.innerHTML = '';
        screenshotsError.style.display = 'none';
        screenshotsLoading.style.display = 'none';
    };


    // --- Funciones Principales ---
    const displayGameDetails = (game) => {
        detailContent.style.display = 'block';
        document.title = `${game.name || 'Juego'} - Detalles - Mi Biblioteca de Juegos`;
        gameTitle.textContent = game.name || 'Título no disponible';
        gameMainImage.src = game.background_image || 'img/placeholder_cover.png'; // Placeholder por defecto
        gameMainImage.alt = `Portada de ${game.name || 'juego'}`;
        gameMainImage.loading = 'lazy'; // Ya estaba, es bueno
        // Añadir manejo de error para la imagen principal
        gameMainImage.onerror = function() {
            this.onerror=null; this.src='img/placeholder_cover.png'; this.alt = 'Portada no disponible';
        };

        gameGenres.textContent = formatList(game.genres);
        gamePlatforms.textContent = formatList(game.platforms?.map(p => p.platform));
        gameReleaseDate.textContent = formatDate(game.released);
        gameDevelopers.textContent = formatList(game.developers);
        gamePublishers.textContent = formatList(game.publishers);
        gameRating.textContent = `${game.rating?.toFixed(1) || 'N/A'} / 5 (${game.ratings_count || 0} votos)`;
        gameMetacritic.textContent = game.metacritic || 'N/A';

        if (game.website) {
             gameWebsite.innerHTML = `<a href="${game.website}" target="_blank" rel="noopener noreferrer" title="Visitar sitio web oficial">${game.website}</a>`;
        } else { gameWebsite.textContent = 'No disponible'; }

        // *** OPTIMIZACIÓN: Considerar sanitizar HTML de descripción ***
        // Usar una librería como DOMPurify si el contenido de RAWG pudiera ser inseguro
        // import DOMPurify from 'dompurify'; <-- Necesitaría importación/paquete
        // gameDescription.innerHTML = DOMPurify.sanitize(game.description || '<p>Descripción no disponible.</p>');
        gameDescription.innerHTML = game.description_raw || game.description || '<p>Descripción no disponible.</p>'; // description_raw suele ser texto plano

        const tagsHTML = formatTagsList(game.tags);
        if (tagsHTML) {
             gameTagsContainer.style.display = 'block';
             gameTags.innerHTML = tagsHTML;
        } else { gameTagsContainer.style.display = 'none'; }

        const storesHTML = formatStoresList(game.stores);
         if (storesHTML) {
            gameStoresContainer.style.display = 'block';
            gameStoresContainer.innerHTML = `<h3>Disponible en:</h3>${storesHTML}`;
        } else { gameStoresContainer.style.display = 'none'; }
    };

    const loadAndDisplayScreenshots = async (gameId) => {
        screenshotsLoading.style.display = 'block';
        screenshotsError.style.display = 'none';
        screenshotsGrid.innerHTML = '';

        // *** OPTIMIZACIÓN: Envolver fetch en try/catch individual ***
        try {
             // Validar API Key
             if (!API_KEY || API_KEY === 'TU_API_KEY_AQUI') { // Verifica placeholder
                 throw new Error("API Key no configurada.");
             }

            const response = await fetch(`${BASE_URL}/games/${gameId}/screenshots?key=${API_KEY}&page_size=8`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`); // Mensaje más simple
            }
            const data = await response.json();
            screenshotsLoading.style.display = 'none';

            if (data.results && data.results.length > 0) {
                // Usar fragment para screenshots también
                const fragment = document.createDocumentFragment();
                data.results.forEach(screenshot => {
                    const imgElement = document.createElement('img');
                    imgElement.src = screenshot.image;
                    imgElement.alt = `Screenshot del juego`;
                    imgElement.loading = 'lazy'; // Mantiene lazy loading
                    imgElement.onerror = function() {
                        this.onerror=null; this.style.display='none'; // Ocultar si falla la carga
                    };
                    fragment.appendChild(imgElement);
                });
                screenshotsGrid.appendChild(fragment);
            } else {
                screenshotsGrid.innerHTML = '<p>No hay screenshots disponibles.</p>';
            }

        } catch (error) {
            console.error("Error fetching screenshots:", error);
            screenshotsLoading.style.display = 'none';
            screenshotsError.textContent = `Error al cargar screenshots.`; // Mensaje más genérico
            screenshotsError.style.display = 'block';
        }
    };

    const loadGameDetails = async () => {
        clearDetails(); // Limpiar contenido previo
        showLoading();
        const params = new URLSearchParams(window.location.search);
        const gameId = params.get('id');

        if (!gameId) {
            hideLoading();
            showError('No se especificó un ID de juego en la URL.');
            return;
        }

         if (!API_KEY || API_KEY === 'TU_API_KEY_AQUI') {
              hideLoading();
              showError("API Key no configurada correctamente.");
              console.error("API Key inválida o no reemplazada.");
              return;
         }

        try {
            const response = await fetch(`${BASE_URL}/games/${gameId}?key=${API_KEY}`);
            if (!response.ok) {
                 if (response.status === 404) throw new Error('Juego no encontrado (404).');
                 if (response.status === 401 || response.status === 403) throw new Error(`Error de autenticación (${response.status}). Verifica tu API Key.`);
                 throw new Error(`Error HTTP: ${response.status}`);
            }
            const gameData = await response.json();

            hideLoading();
            displayGameDetails(gameData);
            // Iniciar carga de screenshots DESPUÉS de mostrar detalles principales
            // No necesita await aquí si queremos que se muestren detalles mientras cargan screenshots
            loadAndDisplayScreenshots(gameId);

        } catch (error) {
            console.error("Error fetching game details:", error);
            hideLoading();
            showError(`No se pudieron cargar los detalles del juego. ${error.message}`);
        }
    };

    // --- Ejecutar al Cargar ---
    loadGameDetails();
});