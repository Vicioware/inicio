document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '6e5005c8f10d4fef99e4fad701d856c5'; // <-- ¡REEMPLAZA ESTO!
    const BASE_URL = 'https://api.rawg.io/api';

    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const detailContent = document.getElementById('game-detail-content');

    // Selectores para los elementos de detalles
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
        detailContent.style.display = 'none'; // Ocultar contenido si hay error
    };

    // Función para formatear fecha (YYYY-MM-DD a DD/MM/YYYY)
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        } catch (e) {
            return dateString; // Devuelve original si falla el formato
        }
    };

    // Función para mostrar los detalles del juego
    const displayGameDetails = (game) => {
        detailContent.style.display = 'block'; // Mostrar contenedor principal

        document.title = `${game.name} - Detalles - Mi Biblioteca de Juegos`; // Actualizar título de la pestaña
        gameTitle.textContent = game.name || 'Título no disponible';
        gameMainImage.src = game.background_image || 'img/juego_placeholder_large.jpg';
        gameMainImage.alt = `Portada de ${game.name || 'juego'}`;

        // Mapear y unir arrays de objetos (géneros, plataformas, etc.)
        gameGenres.textContent = game.genres?.map(g => g.name).join(', ') || 'N/A';
        gamePlatforms.textContent = game.platforms?.map(p => p.platform.name).join(', ') || 'N/A';
        gameReleaseDate.textContent = formatDate(game.released);
        gameDevelopers.textContent = game.developers?.map(d => d.name).join(', ') || 'N/A';
        gamePublishers.textContent = game.publishers?.map(p => p.name).join(', ') || 'N/A';
        gameRating.textContent = `${game.rating || 'N/A'} / 5 (${game.ratings_count || 0} votos)`;
        gameMetacritic.textContent = game.metacritic || 'N/A';

        // Web oficial (si existe)
        if (game.website) {
             gameWebsite.innerHTML = `<a href="${game.website}" target="_blank" rel="noopener noreferrer">${game.website}</a>`;
        } else {
            gameWebsite.textContent = 'No disponible';
        }

        // Descripción (usar innerHTML con precaución, RAWG a veces incluye HTML básico)
        // Podrías sanitizar esto en una app real
        gameDescription.innerHTML = game.description || '<p>Descripción no disponible.</p>';

        // Tags
        if (game.tags && game.tags.length > 0) {
             gameTagsContainer.style.display = 'block';
             gameTags.innerHTML = game.tags.map(tag => `<span>${tag.name}</span>`).join(' ');
        } else {
             gameTagsContainer.style.display = 'none';
        }

        // Tiendas
        if (game.stores && game.stores.length > 0) {
            gameStoresContainer.innerHTML = '<h3>Disponible en:</h3>' + game.stores.map(s =>
                `<a href="https://${s.store.domain}" target="_blank" rel="noopener noreferrer" title="${s.store.name}">${s.store.name}</a>`
            ).join(' ');
        } else {
             gameStoresContainer.innerHTML = '';
        }

    };

    // Función para cargar y mostrar screenshots
    const loadAndDisplayScreenshots = async (gameId) => {
        screenshotsLoading.style.display = 'block';
        screenshotsError.style.display = 'none';
        screenshotsGrid.innerHTML = ''; // Limpiar grid

        try {
            const response = await fetch(`${BASE_URL}/games/${gameId}/screenshots?key=${API_KEY}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            screenshotsLoading.style.display = 'none';

            if (data.results && data.results.length > 0) {
                data.results.forEach(screenshot => {
                    const imgElement = document.createElement('img');
                    imgElement.src = screenshot.image;
                    imgElement.alt = `Screenshot del juego`;
                    imgElement.loading = 'lazy'; // Carga diferida para imágenes
                    screenshotsGrid.appendChild(imgElement);
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


    // --- Función Principal ---
    const loadGameDetails = async () => {
        showLoading();
        const params = new URLSearchParams(window.location.search);
        const gameId = params.get('id');

        if (!gameId) {
            hideLoading();
            showError('No se especificó un ID de juego en la URL.');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/games/${gameId}?key=${API_KEY}`);
            if (!response.ok) {
                 if (response.status === 404) {
                     throw new Error('Juego no encontrado (404).');
                 }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const gameData = await response.json();
            hideLoading();
            displayGameDetails(gameData);

            // Cargar screenshots después de obtener los detalles principales
            loadAndDisplayScreenshots(gameId);

        } catch (error) {
            console.error("Error fetching game details:", error);
            hideLoading();
            showError(`No se pudieron cargar los detalles del juego. ${error.message}. Verifica el ID y tu API Key.`);
        }
    };

    // --- Ejecutar al Cargar ---
    loadGameDetails();

});