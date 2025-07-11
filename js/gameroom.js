document.addEventListener('DOMContentLoaded', () => {
    // Elementos de la mochila
    const backpackIconLink = document.getElementById('backpackIcon');
    const backpackCounter = document.getElementById('backpackCounter');
    const backpackModal = document.getElementById('backpackModal');
    const backpackCloseBtn = document.getElementById('backpackCloseBtn');
    const backpackItems = document.getElementById('backpackItems');
    const backpackActions = document.getElementById('backpackActions');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    const clearBackpackBtn = document.getElementById('clearBackpackBtn');

    // Array para almacenar los juegos en la mochila
    let backpack = JSON.parse(localStorage.getItem('gameBackpack')) || [];

    // Funciones de la mochila
    function updateBackpackCounter() {
        if (backpackCounter) {
            backpackCounter.textContent = backpack.length;
            if (backpack.length > 0) {
                backpackCounter.style.display = 'flex';
            } else {
                backpackCounter.style.display = 'none';
            }
        }
    }

    function saveBackpack() {
        localStorage.setItem('gameBackpack', JSON.stringify(backpack));
    }

    function removeFromBackpack(gameId) {
        backpack = backpack.filter(item => item.id !== gameId);
        saveBackpack();
        updateBackpackCounter();
        renderBackpackItems();
    }

    function clearBackpack() {
        backpack = [];
        saveBackpack();
        updateBackpackCounter();
        renderBackpackItems();
    }

    function renderBackpackItems() {
        if (!backpackItems) return;
        
        if (backpack.length === 0) {
            backpackItems.innerHTML = '<p style="text-align: center; color: #888; margin: 20px 0;">Tu mochila está vacía. Agrega algunos juegos desde la página principal.</p>';
            if (backpackActions) backpackActions.style.display = 'none';
        } else {
            backpackItems.innerHTML = backpack.map(item => `
                <div class="backpack-item">
                    <div class="backpack-item-info">
                        <img src="${item.image}" alt="${item.name}">
                        <span class="backpack-item-name">${item.name}</span>
                    </div>
                    <button class="remove-item-btn" data-game-id="${item.id}">Quitar</button>
                </div>
            `).join('');
            if (backpackActions) backpackActions.style.display = 'flex';

            // Agregar event listeners a los botones de quitar
            document.querySelectorAll('.remove-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const gameId = e.target.dataset.gameId;
                    removeFromBackpack(gameId);
                });
            });
        }
    }

    function openBackpackModal() {
        if (!backpackModal) return;
        renderBackpackItems();
        backpackModal.classList.add('is-open');
        document.body.classList.add('modal-blur-active');
    }

    function closeBackpackModal() {
        if (!backpackModal) return;
        backpackModal.classList.remove('is-open');
        document.body.classList.remove('modal-blur-active');
    }

    function downloadAllGames() {
        // Redirigir a la página principal para descargar
        alert('Serás redirigido a la página principal para descargar los juegos.');
        window.location.href = 'index.html';
    }

    // Event listeners para la mochila
    if (backpackIconLink) {
        backpackIconLink.addEventListener('click', (e) => {
            e.preventDefault();
            openBackpackModal();
        });
    }

    if (backpackCloseBtn) {
        backpackCloseBtn.addEventListener('click', closeBackpackModal);
    }

    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', () => {
            if (backpack.length > 0) {
                downloadAllGames();
            }
        });
    }

    if (clearBackpackBtn) {
        clearBackpackBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres vaciar tu mochila?')) {
                clearBackpack();
            }
        });
    }

    // Cerrar modal al hacer clic fuera de él
    if (backpackModal) {
        backpackModal.addEventListener('click', (e) => {
            if (e.target === backpackModal) {
                closeBackpackModal();
            }
        });
    }

    // Inicializar contador de la mochila
    updateBackpackCounter();

    // --- INICIALIZACIÓN DE GALERÍA DINÁMICA Y EVENTOS ---
    function initGallery() {
        const gameItems = document.querySelectorAll('.game-item');
        gameItems.forEach(item => {
            const img = item.querySelector('img');
            const originalSrc = img.getAttribute('src');
            const hoverSrc = item.dataset.hoverSrc;
            let hoverTimer = null;
            let isHoverImageDisplayed = false;

            function processLoadedImage() {
                img.style.opacity = '1';
            }
            if (img.complete && img.naturalWidth > 0) {
                processLoadedImage();
            }
            img.addEventListener('load', processLoadedImage);
            img.addEventListener('error', () => {
                img.style.opacity = '1';
            });

            item.addEventListener('mouseenter', () => {
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

        });
    }
    window.initGallery = initGallery;

    // --- DELEGACIÓN DE EVENTOS PARA CLICS EN JUEGOS ---
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        galleryContainer.addEventListener('click', (event) => {
            const gameItem = event.target.closest('.game-item');
            if (gameItem) {
                event.preventDefault();

                const gameSrc = gameItem.dataset.gameSrc;
                const gameTitle = gameItem.querySelector('p').textContent;
                const modal = document.getElementById('gameModal');
                const iframe = document.getElementById('gameModalIframe');
                const modalTitle = document.getElementById('modalGameTitleText');

                if (modal && iframe && modalTitle) {
                    modalTitle.textContent = gameTitle;
                    iframe.src = gameSrc;
                    modal.style.display = 'block';
                }
            }
        });
    }

    // --- CARGA DINÁMICA DE LA GALERÍA Y FILTRO ---
    fetch('gallery-gameroom.html')
        .then(response => response.text())
        .then(html => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const gallery = tempDiv.querySelector('.gallery-container');
            if (gallery) {
                document.querySelector('.gallery-container').innerHTML = gallery.innerHTML;
            }
            window.initGallery();

            // Filtro de búsqueda (debe ejecutarse después de cargar la galería)
            const searchBar = document.getElementById('searchBar');
            if (searchBar) {
                searchBar.addEventListener('input', (event) => {
                    const rawSearchTerm = event.target.value.trim().toLowerCase();
                    document.querySelectorAll('.game-item').forEach(item => {
                        const rawGameTitle = item.querySelector('p').textContent.toLowerCase();
                        if (rawGameTitle.includes(rawSearchTerm)) {
                            item.style.display = '';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            }
        });

    // --- LÓGICA DEL MODAL ---
    const modal = document.getElementById('gameModal');
    const closeButton = document.querySelector('.game-modal-close-button');
    const iframe = document.getElementById('gameModalIframe');

    if (closeButton && modal && iframe) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
            iframe.src = 'about:blank'; // Detener la ejecución del juego
        });
    }

    // Cierra el modal si se hace clic fuera de su contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            iframe.src = 'about:blank'; // Detener la ejecución del juego
        }
    });
});
