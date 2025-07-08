document.addEventListener('DOMContentLoaded', () => {
    const gameItems = document.querySelectorAll('.game-item');
    // Eliminar la instancia de ColorThief
    // const colorThief = new ColorThief();

    const gameModal = document.getElementById('gameModal');
    const gameModalCloseButton = gameModal.querySelector('.game-modal-close-button');
    const gameModalIframe = document.getElementById('gameModalIframe');
    const modalGameTitleTextElement = document.getElementById('modalGameTitleText');
    let gameOpenStartTime = null; // Para rastrear cuándo se abrió el modal del juego
    const searchBar = document.getElementById('searchBar');

    // Custom Confirm Modal elements
    const customConfirmModal = document.getElementById('customConfirmModal');
    const customConfirmOkButton = document.getElementById('customConfirmOkButton');
    const customConfirmCancelButton = document.getElementById('customConfirmCancelButton');
    const dontShowAgainCheckbox = document.getElementById('dontShowAgainCheckbox');

    function updateImageLoadingPriority() {
        const visibleGameItems = [];
        gameItems.forEach(item => {
            const style = window.getComputedStyle(item);
            if (style.display !== 'none') {
                visibleGameItems.push(item);
            }
        });

        gameItems.forEach(item => {
            const img = item.querySelector('img');
            if (img && img.getAttribute('loading') !== 'lazy') {
                img.setAttribute('loading', 'lazy');
            }
        });

        const limit = 30; // Cargar con prioridad las primeras 30 visibles
        for (let i = 0; i < visibleGameItems.length && i < limit; i++) {
            const item = visibleGameItems[i];
            const img = item.querySelector('img');
            if (img) {
                img.removeAttribute('loading');
            }
        }
    }

    gameItems.forEach(item => {
        const img = item.querySelector('img');
        const originalSrc = img.getAttribute('src');
        const hoverSrc = item.dataset.hoverSrc;
        let hoverTimer = null;
        let isHoverImageDisplayed = false;

        function processLoadedImage() {
            img.style.opacity = '1';
            // Eliminar toda la lógica de ColorThief
        }

        if (img.complete && img.naturalWidth > 0) {
            processLoadedImage();
        }
        img.addEventListener('load', processLoadedImage);
        img.addEventListener('error', () => {
            console.error('Error al cargar la imagen:', img.src);
            img.style.opacity = '1';
        });

        item.addEventListener('mouseenter', () => {
            // Eliminar lógica de resplandor
            if (hoverSrc) {
                if (hoverTimer) clearTimeout(hoverTimer);
                hoverTimer = setTimeout(() => {
                    if (item.matches(':hover')) {
                        img.src = hoverSrc;
                        isHoverImageDisplayed = true;
                    }
                }, 1000);
            }
        });

        item.addEventListener('mouseleave', () => {
            if (hoverTimer) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
            if (isHoverImageDisplayed) {
                img.src = originalSrc;
                isHoverImageDisplayed = false;
            }
        });

        item.addEventListener('click', (event) => {
            event.preventDefault();
            const gameId = item.dataset.gameId;
            const gameSrc = item.dataset.gameSrc;
            const gameName = item.querySelector('p').textContent;

            if (gameSrc) {
                openGameModal(gameName, gameSrc);
            } else {
                console.warn(`No se encontró 'data-game-src' para el juego: ${gameId}`);
            }
        });
    });

    // Llamada inicial para la carga de imágenes
    updateImageLoadingPriority();

    // Función para limpiar cadenas para la búsqueda (ignorar mayúsculas/minúsculas y caracteres especiales)
    function sanitizeSearchTerm(term) {
        return term.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    // Event listener para la barra de búsqueda
    searchBar.addEventListener('input', (event) => {
        const rawSearchTerm = event.target.value.trim();
        const sanitizedSearchTerm = sanitizeSearchTerm(rawSearchTerm);

        gameItems.forEach(item => {
            const rawGameTitle = item.querySelector('p').textContent;
            const sanitizedGameTitle = sanitizeSearchTerm(rawGameTitle);
            if (sanitizedGameTitle.includes(sanitizedSearchTerm)) {
                item.style.display = ''; // Muestra el item si coincide
            } else {
                item.style.display = 'none'; // Oculta el item si no coincide
            }
        });
        updateImageLoadingPriority(); // Actualizar prioridad después de filtrar
    });

    function openGameModal(gameName, gameSrc) {
        modalGameTitleTextElement.textContent = gameName;
        gameModalIframe.src = gameSrc;
        document.body.classList.add('modal-blur-active');
        gameModal.classList.add('is-open');
        gameOpenStartTime = Date.now(); // Registrar el tiempo de apertura
    }

    function closeGameModal() {
        document.body.classList.remove('modal-blur-active');
        gameModal.classList.remove('is-open');
        gameModalIframe.src = 'about:blank'; 
        modalGameTitleTextElement.textContent = '';
        gameOpenStartTime = null;
    }

    function showCustomConfirm() {
        let warningShownCount = parseInt(sessionStorage.getItem('gameroomWarningShownCount') || '0');
        warningShownCount++;
        sessionStorage.setItem('gameroomWarningShownCount', warningShownCount.toString());

        const checkboxContainer = document.querySelector('.dont-show-again-container');
        if (warningShownCount > 2) {
            checkboxContainer.style.display = 'flex';
        } else {
            checkboxContainer.style.display = 'none';
        }

        customConfirmModal.classList.add('is-visible');
        dontShowAgainCheckbox.checked = false; // Desmarcar por defecto al mostrar
    }

    function hideCustomConfirm() {
        customConfirmModal.classList.remove('is-visible');
    }

    gameModalCloseButton.addEventListener('click', () => {
        if (gameOpenStartTime) {
            if (sessionStorage.getItem('hideGameroomCloseWarning') === 'true') {
                closeGameModal(); // No mostrar advertencia si el usuario lo pidió
            } else {
                const timeOpenInSeconds = (Date.now() - gameOpenStartTime) / 1000;
                if (timeOpenInSeconds > 60) { // Más de 1 minuto (60 segundos)
                    showCustomConfirm();
                } else {
                    closeGameModal(); // Cerrar directamente si es menos de 1 minuto
                }
            }
        } else {
            closeGameModal(); // Si gameOpenStartTime no está definido, cerrar por seguridad
        }
    });

    customConfirmOkButton.addEventListener('click', () => {
        if (dontShowAgainCheckbox.checked) {
            sessionStorage.setItem('hideGameroomCloseWarning', 'true');
        }
        closeGameModal();
        hideCustomConfirm();
    });

    customConfirmCancelButton.addEventListener('click', hideCustomConfirm);

    window.addEventListener('click', (event) => {
        if (event.target === gameModal) {
            closeGameModal();
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && gameModal.classList.contains('is-open')) {
            closeGameModal();
        }
    });

    // Cargar la galería de forma dinámica desde gallery-gameroom.html
    fetch('gallery-gameroom.html')
        .then(response => response.text())
        .then(html => {
            // Extraer solo el contenido de .gallery-container
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const gallery = tempDiv.querySelector('.gallery-container');
            if (gallery) {
                document.querySelector('.gallery-container').innerHTML = gallery.innerHTML;
            }
            // Re-ejecutar la lógica de inicialización de la galería si es necesario
            if (typeof window.initGallery === 'function') {
                window.initGallery();
            }
        });
});
