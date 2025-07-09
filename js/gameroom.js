document.addEventListener('DOMContentLoaded', () => {
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
            item.addEventListener('click', (event) => {
                event.preventDefault(); // Prevenir la navegación del enlace

                const gameSrc = item.dataset.gameSrc;
                const gameTitle = item.querySelector('p').textContent;
                const modal = document.getElementById('gameModal');
                const iframe = document.getElementById('gameModalIframe');
                const modalTitle = document.getElementById('modalGameTitleText');

                if (modal && iframe && modalTitle) {
                    modalTitle.textContent = gameTitle;
                    iframe.src = gameSrc;
                    modal.style.display = 'block';
                }
            });
        });
    }
    window.initGallery = initGallery;

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
