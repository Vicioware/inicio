document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results-container');
    const apiKey = 'YOUR_API_KEY'; // <-- ¡IMPORTANTE! Reemplaza esto con tu API Key de RAWG

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que la página se recargue al enviar el formulario
        const query = searchInput.value.trim();

        if (!query) {
            resultsContainer.innerHTML = '<p>Por favor, introduce un término de búsqueda.</p>';
            return;
        }

        if (apiKey === 'YOUR_API_KEY') {
             resultsContainer.innerHTML = '<p style="color: red;">Error: Debes añadir tu API Key de RAWG en script.js.</p>';
             return;
        }

        resultsContainer.innerHTML = '<p>Buscando...</p>'; // Mensaje mientras carga

        try {
            // Construye la URL de la API de RAWG
            // Documentación: https://api.rawg.io/docs/#operation/games_list
            const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}&page_size=10`; // Busca y limita a 10 resultados

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            displayResults(data.results);

        } catch (error) {
            console.error('Error al buscar juegos:', error);
            resultsContainer.innerHTML = `<p>Hubo un error al realizar la búsqueda. Inténtalo de nuevo más tarde. (${error.message})</p>`;
        }
    });

    function displayResults(games) {
        resultsContainer.innerHTML = ''; // Limpia resultados anteriores o mensaje de "Buscando..."

        if (!games || games.length === 0) {
            resultsContainer.innerHTML = '<p>No se encontraron juegos para tu búsqueda.</p>';
            return;
        }

        games.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.classList.add('search-result-item');

            // Imagen de portada (si existe)
            const coverImage = game.background_image
                ? `<img src="${game.background_image}" alt="Portada de ${game.name}" class="result-cover">`
                : '<div class="result-cover">Sin imagen</div>'; // Placeholder si no hay imagen

            // Géneros
            const genres = game.genres.map(genre => genre.name).join(', ');

            // Plataformas
            const platforms = game.platforms ? game.platforms.map(p => p.platform.name).join(', ') : 'No especificado';

            gameElement.innerHTML = `
                ${coverImage}
                <div class="result-info">
                    <h3>${game.name}</h3>
                    <p><strong>Género:</strong> ${genres || 'No especificado'}</p>
                    <p><strong>Plataformas:</strong> ${platforms}</p>
                    <p><strong>Lanzamiento:</strong> ${game.released || 'No especificado'}</p>
                    <p><strong>Rating:</strong> ${game.rating || 'N/A'} / 5</p>
                    <a href="https://rawg.io/games/${game.slug}" target="_blank" rel="noopener noreferrer">Ver en RAWG</a>
                    <!-- Podrías crear tu propia página de detalles aquí -->
                </div>
            `;
            resultsContainer.appendChild(gameElement);
        });
    }
});