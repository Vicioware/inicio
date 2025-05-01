document.addEventListener('DOMContentLoaded', () => {
    // Clave API (REEMPLAZAR CON LA TUYA PROPIA)
    const API_KEY = '6e5005c8f10d4fef99e4fad701d856c5'; // <-- ¡REEMPLAZA ESTO!
    const BASE_URL = 'https://api.rawg.io/api';

    // Selectores del DOM
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const detailContent = document.getElementById('game-detail-content');

    // Selectores específicos de detalles
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

    // Formatea fecha YYYY-MM-DD a DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            // Asegurarse que es una fecha válida antes de formatear
            if (isNaN(date.getTime())) return dateString; // Devuelve original si no es válida
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses son 0-indexados
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (e) {
            return dateString; // Devuelve original si falla
        }
    };

     // Formatea listas de objetos (géneros, plataformas, etc.) en spans
     const formatList = (list) => {
         if (!list || list.length === 0) return 'N/A';
         // Acceder al nombre dentro de cada objeto (ej. platform.name, genre.name)
         return list.map(item => item.name || item.platform?.name || item.store?.name || item.developer?.name || item.publisher?.name || item.tag?.name || '??').filter(Boolean).join(', ');
     };

    // Formatea lista de tiendas como enlaces
    const formatStoresList = (stores) => {
        if (!stores || stores.length === 0) return '';
        return stores.map(s =>
            `<a href="https://${s.store.domain}" target="_blank" rel="noopener noreferrer" title="Ver en ${s.store.name}">${s.store.name}</a>`
        ).join(' ');
    };

     // Formatea lista de tags como spans
    const formatTagsList = (tags) => {
         if (!tags || tags.length === 0) return '';
         return tags.map(tag => `<span>${tag.name}</span>`).join(' ');
    };


    // --- Funciones Principales ---

    // Muestra los detalles principales del juego (se llama primero)
    const displayGameDetails = (game) => {
        detailContent.style.display = 'block'; // Mostrar contenedor principal ahora

        document.title = `${game.name || 'Juego'} - Detalles - Mi Biblioteca de Juegos`;
        gameTitle.textContent = game.name || 'Título no disponible';

        // *** OPTIMIZACIÓN: Añadido loading="lazy" a la imagen principal ***
        gameMainImage.src = game.background_image || 'img/juego_placeholder_large.jpg';
        gameMainImage.alt = `Portada de ${game.name || 'juego'}`;
        gameMainImage.loading = 'lazy';

        // Usar funciones de formateo
        gameGenres.textContent = formatList(game.genres);
        gamePlatforms.textContent = formatList(game.platforms?.map(p => p.platform)); // Mapear para obtener el objeto platforma
        gameReleaseDate.textContent = formatDate(game.released);
        gameDevelopers.textContent = formatList(game.developers);
        gamePublishers.textContent = formatList(game.publishers);
        gameRating.textContent = `${game.rating?.toFixed(1) || 'N/A'} / 5 (${game.ratings_count || 0} votos)`;
        gameMetacritic.textContent = game.metacritic || 'N/A';

        // Web oficial
        if (game.website) {
             gameWebsite.innerHTML = `<a href="${game.website}" target="_blank" rel="noopener noreferrer" title="Visitar sitio web oficial">${game.website}</a>`;
        } else {
            gameWebsite.textContent = 'No disponible';
        }

        // Descripción (Sanitizar sería ideal en producción)
        gameDescription.innerHTML = game.description || '<p>Descripción no disponible.</p>';

        // Tags
        const tagsHTML = formatTagsList(game.tags);
        if (tagsHTML) {
             gameTagsContainer.style.display = 'block';
             gameTags.innerHTML = tagsHTML;
        } else {
             gameTagsContainer.style.display = 'none';
        }

        // Tiendas
        const storesHTML = formatStoresList(game.stores);
         if (storesHTML) {
            gameStoresContainer.style.display = 'block'; // Asegurar visibilidad
            gameStoresContainer.innerHTML = `<h3>Disponible en:</h3>${storesHTML}`;
        } else {
             gameStoresContainer.style.display = 'none';
        }
    };

    // Carga y muestra screenshots (se llama después de displayGameDetails)
    const loadAndDisplayScreenshots = async (gameId) => {
        screenshotsLoading.style.display = 'block';
        screenshotsError.style.display = 'none';
        screenshotsGrid.innerHTML = '';

        try {
            // Validar API Key
             if (!API_KEY || API_KEY === 'TU_API_KEY_AQUI') {
                 throw new Error("API Key no configurada.");
             }

            const response = await fetch(`${BASE_URL}/games/${gameId}/screenshots?key=${API_KEY}&page_size=8`); // Limitar a 8 screenshots
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            screenshotsLoading.style.display = 'none';

            if (data.results && data.results.length > 0) {
                data.results.forEach(screenshot => {
                    const imgElement = document.createElement('img');
                    // *** OPTIMIZACIÓN: Añadido loading="lazy" a screenshots ***
                    imgElement.src = screenshot.image;
                    imgElement.alt = `Screenshot del juego`;
                    imgElement.loading = 'lazy';
                    // Opcional: añadir enlace para ver en grande (requiere lightbox)
                    // const linkElement = document.createElement('a');
                    // linkElement.href = screenshot.image;
                    // linkElement.target = '_blank'; // Abrir en nueva pestaña simple
                    // linkElement.appendChild(imgElement);
                    // screenshotsGrid.appendChild(linkElement);
                    screenshotsGrid.appendChild(imgElement); // Sin enlace por ahora
                });
            } else {
                screenshotsGrid.innerHTML = '<p>No hay screenshots disponibles.</p>';
            }

        } catch (error) {
            console.error("Error fetching screenshots:", error);
            screenshotsLoading.style.display = 'none';
            screenshotsError.textContent = `Error al cargar screenshots: ${error.message}`;
            screenshotsError.style.display = 'block';
        }
    };

    // --- Función Principal de Carga ---
    const loadGameDetails = async () => {
        showLoading();
        const params = new URLSearchParams(window.location.search);
        const gameId = params.get('id');

        if (!gameId) {
            hideLoading();
            showError('No se especificó un ID de juego en la URL.');
            return;
        }

         // Validar API Key básica
         if (!API_KEY || API_KEY === 'TU_API_KEY_AQUI') {
              hideLoading();
              showError("API Key no configurada. Reemplaza 'TU_API_KEY_AQUI' en js/gamecard.js.");
              return;
         }


        try {
            // 1. Fetch de los detalles principales
            const response = await fetch(`${BASE_URL}/games/${gameId}?key=${API_KEY}`);
            if (!response.ok) {
                 if (response.status === 404) throw new Error('Juego no encontrado (404).');
                 if (response.status === 401 || response.status === 403) throw new Error(`Error de autenticación (${response.status}). Verifica tu API Key.`);
                 throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
            }
            const gameData = await response.json();

            // 2. Ocultar carga principal y mostrar detalles básicos INMEDIATAMENTE
            hideLoading();
            displayGameDetails(gameData);

            // 3. Cargar screenshots de forma asíncrona (mostrará su propio loading)
            // *** OPTIMIZACIÓN: Carga diferida de screenshots ***
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