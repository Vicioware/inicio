document.addEventListener('DOMContentLoaded', () => {
    const gameItems = document.querySelectorAll('.game-item');

    // Modal elements
    const modal = document.getElementById('downloadModal');
    const modalGameTitle = document.getElementById('modalGameTitle');
    const modalDownloadLinksList = document.getElementById('modalDownloadLinks');
    const closeButton = modal.querySelector('.close-button');
    // const galleryContainer = document.querySelector('.gallery-container'); // No longer needed for icon alignment
    const searchBar = document.getElementById('searchBar'); // searchBar ya está aquí
    const hangoutNotification = document.getElementById('hangoutNotification');
    let hangoutTimer = null; // Para controlar el temporizador de la notificación
    let notificationAutoCloseTimer = null; // Para controlar el autocierre de la notificación

    // Data for download links
    const gameDownloadLinksData = {
        'gta-sa': [ { text: 'Descargar GTA: San Andreas', url: 'https://example.com/gta-sa-link' } ],
        'cuphead': [
            { text: 'Descargar Cuphead (Principal)', url: 'https://example.com/cuphead-main' },
            { text: 'Descargar Cuphead (Alternativo)', url: 'https://example.com/cuphead-alt' }
        ],
		'vampire-survivors': [{ text: 'Descargar Vampire Survivors', url: 'https://www.mediafire.com/file/w7r10dc1rb85n4r/Vampi6reSurv1ivors-1.13.109-elamigos.rar/file' }], readMoreText: '- Versión 1.113.109\n- Español\n- Todos los DLC' }],
        'unmetal': [{ text: 'Descargar Unmetal', url: 'https://example.com/unmetal-download' }],
        'portal': [{ text: 'Descargar Portal', url: 'https://example.com/portal-download' }],
        'portal2': [{ text: 'Descargar Portal 2', url: 'https://example.com/portal2-download' }],
        'REPO': [{ text: 'Descargar R.E.P.O', url: 'https://example.com/repo-download' }],
        'dbfz': [{ text: 'Descargar Dragon Ball FighterZ', url: 'https://example.com/dbfz-download' }],
        'brotato': [{ text: 'Descargar Brotato', url: 'https://example.com/brotato-download' }],
        'assassinscreed': [{ text: 'Descargar Assassin\'s Creed', url: 'https://example.com/assassinscreed-download' }],
        'tomb-raider': [{ text: 'Descargar Tomb Raider (2013)', url: 'https://example.com/tomb-raider-download' }],
        'vampire-survivors': [{ text: 'Descargar Vampire Survivors', url: 'https://example.com/vampire-survivors-download' }],
        'horizon-chase-turbo': [{ text: 'Descargar Horizon Chase Turbo', url: 'https://example.com/horizon-chase-turbo-download' }],
        'barony': [{ text: 'Descargar Barony', url: 'https://example.com/barony-download' }],
        'dmc-devil-may-cry': [{ text: 'Descargar DmC: Devil May Cry', url: 'https://example.com/dmc-devil-may-cry-download' }],
        'call-of-duty': [{ text: 'Descargar Call of Duty', url: 'https://example.com/call-of-duty-download' }],
        'halo-ce': [{
            text: 'Descargar',
            url: 'https://www.mediafire.com/file/jftpybq93hfqy26/HCE_2001.rar/file',
            readMoreText: '- Versión 1.0.10\n- Español\n- Multijugador funcional'
        }]
    };

    // const gameroomIconLink = document.querySelector('.gameroom-icon-link'); // No longer needed

    function updateImageLoadingPriority() {
        const visibleGameItems = [];
        // gameItems está disponible en este scope (definido en DOMContentLoaded)
        gameItems.forEach(item => {
            // Usamos getComputedStyle para obtener el estado de display real
            const style = window.getComputedStyle(item);
            if (style.display !== 'none') {
                visibleGameItems.push(item);
            }
        });

        // Paso 1: Asegurar que todas las imágenes tengan loading="lazy" por defecto.
        // Esto resetea el estado para los items que podrían dejar de ser prioritarios.
        gameItems.forEach(item => {
            const img = item.querySelector('img');
            if (img && img.getAttribute('loading') !== 'lazy') {
                img.setAttribute('loading', 'lazy');
            }
        });

        // Paso 2: Quitar loading="lazy" de las primeras 30 imágenes visibles.
        const limit = 30;
        for (let i = 0; i < visibleGameItems.length && i < limit; i++) {
            const item = visibleGameItems[i];
            const img = item.querySelector('img');
            if (img) {
                img.removeAttribute('loading');
            }
        }
    }

    function openModal(gameId, gameName) {
        modalGameTitle.textContent = gameName; // Actualiza el título del modal
        modalDownloadLinksList.innerHTML = ''; // Limpia enlaces anteriores

        if (gameId && gameDownloadLinksData[gameId]) {
            const links = gameDownloadLinksData[gameId];
            links.forEach((linkInfo, index) => { // <--- Añadido 'index' aquí
                
                const listItem = document.createElement('li');
                const isLastItemInList = (index === links.length - 1);
                const anchor = document.createElement('a');
                anchor.href = linkInfo.url;
                anchor.textContent = linkInfo.text;
                anchor.target = '_blank'; // Abrir en nueva pestaña

                // Event listener para el clic en el botón de descarga
                anchor.addEventListener('click', () => {
                    // Comprobar si la notificación ya se mostró en esta sesión
                    if (!sessionStorage.getItem('hangoutNotificationShown')) {
                        // Limpiar cualquier temporizador anterior si el usuario hace clic rápidamente en varios enlaces
                        if (hangoutTimer) clearTimeout(hangoutTimer);
                        // Ocultar notificación si ya está visible (por si acaso, aunque no debería si se muestra solo una vez)
                        hangoutNotification.classList.remove('show');

                        hangoutTimer = setTimeout(showHangoutNotification, 10000); // 10 segundos
                        // Marcar que la notificación está programada para mostrarse (o ya se mostró) en esta sesión
                    }
                });

                listItem.appendChild(anchor);
                modalDownloadLinksList.appendChild(listItem);

                // Añadir "Leer más" si existe texto
                if (linkInfo.readMoreText) {
                    const readMoreContainer = document.createElement('div');
                    readMoreContainer.className = 'read-more-container';

                    const readMoreToggle = document.createElement('span');
                    readMoreToggle.className = 'read-more-toggle';
                    readMoreToggle.textContent = 'Detalles';

                    const readMoreContent = document.createElement('div');
                    readMoreContent.className = 'read-more-content';
                    readMoreContent.textContent = linkInfo.readMoreText;

                    // Guardar el listItem padre para fácil acceso
                    const parentListItem = listItem;

                    readMoreToggle.addEventListener('click', function() {
                        const isVisible = readMoreContent.classList.toggle('visible');
                        this.textContent = isVisible ? 'Ocultar detalles' : 'Detalles';

                        // Solo ajustar el margen si es el último item de la lista.
                        // Si no es el último, el margen ya está fijado en 10px para el espaciado entre botones.
                        if (isVisible) {
                            parentListItem.style.marginBottom = '-10px';
                            parentListItem.style.marginBottom = '-18px';
                        }
                    });

                    readMoreContainer.appendChild(readMoreToggle);
                    readMoreContainer.appendChild(readMoreContent);
                    listItem.appendChild(readMoreContainer); // Añadir al final del listItem

                    // Establecer margen inicial para este li
                    if (isLastItemInList) {
                        listItem.style.marginBottom = '-43px'; // Es el último y tiene "Detalles" (ocultos por defecto)
                    } else {
                        listItem.style.marginBottom = '10px'; // No es el último, necesita 10px de espacio debajo
                    }
                } else { // No hay "Detalles"
                    if (isLastItemInList) {
                        listItem.style.marginBottom = '-15px'; // Es el último y no tiene "Detalles"
                    } else {
                        listItem.style.marginBottom = '10px'; // No es el último, necesita 10px de espacio debajo
                    }
                }
            });
        } else {
            const listItem = document.createElement('li');
            listItem.textContent = 'No hay enlaces de descarga disponibles para este juego.';
            modalDownloadLinksList.appendChild(listItem);
            console.warn('No se encontraron enlaces de descarga para el juego:', gameId);
        }
        document.body.classList.add('modal-blur-active'); // Aplicar desenfoque al fondo
        modal.classList.add('is-open'); // Mostrar y animar modal
    }

    // Llamada inicial para establecer la prioridad de carga al cargar la página
    updateImageLoadingPriority();

    function closeModal() {
        document.body.classList.remove('modal-blur-active'); // Quitar desenfoque
        modal.classList.remove('is-open'); // Ocultar y animar modal de descarga
        // No cerramos la notificación de "pasar el rato" aquí, se maneja por separado
    }

    // Event listener para el botón de cierre del modal
    closeButton.addEventListener('click', closeModal);

    // Event listener para cerrar el modal haciendo clic fuera de su contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Event listener para cerrar el modal con la tecla Escape
    window.addEventListener('keydown', (event) => {
        // Pequeña mejora: comprobar la clase en lugar del estilo display directamente
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

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
        // Actualizar la prioridad de carga después de filtrar
        updateImageLoadingPriority();
        // alignGameroomIcon(); // Ya no se necesita
    });

    // --- INICIALIZACIÓN DE GALERÍA DINÁMICA Y EVENTOS ---
    function initGallery() {
        const gameItems = document.querySelectorAll('.game-item');
        // --- Eventos de tarjetas ---
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
            // Modal al hacer clic
            item.addEventListener('click', (event) => {
                event.preventDefault();
                const gameId = item.dataset.gameId;
                const gameName = item.querySelector('p').textContent;
                if (gameId) {
                    openModal(gameId, gameName);
                }
            });
        });
        updateImageLoadingPriority();
    }
    window.initGallery = initGallery;

    // --- CARGA DINÁMICA DE LA GALERÍA Y FILTRO ---
    fetch('gallery-index.html')
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
                    const rawSearchTerm = event.target.value.trim();
                    const sanitizedSearchTerm = sanitizeSearchTerm(rawSearchTerm);
                    document.querySelectorAll('.game-item').forEach(item => {
                        const rawGameTitle = item.querySelector('p').textContent;
                        const sanitizedGameTitle = sanitizeSearchTerm(rawGameTitle);
                        if (sanitizedGameTitle.includes(sanitizedSearchTerm)) {
                            item.style.display = '';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                    updateImageLoadingPriority();
                });
            }
        });

    // Funciones para la notificación de "Pasar el rato"
    function showHangoutNotification() {
        // Si ya hay un temporizador de autocierre, limpiarlo (por si se llama a show múltiples veces rápidamente)
        if (notificationAutoCloseTimer) clearTimeout(notificationAutoCloseTimer);

        hangoutNotification.classList.add('show');
        // Marcar que la notificación se ha mostrado en esta sesión
        sessionStorage.setItem('hangoutNotificationShown', 'true');

        // Iniciar temporizador para ocultar automáticamente después de 10 segundos
        notificationAutoCloseTimer = setTimeout(() => {
            closeHangoutNotification(); // Reutilizar la función de cierre
        }, 10000); // 10 segundos para ocultar
    }

    // Estas funciones se declaran globalmente para ser accesibles desde el onclick en el HTML
    window.closeHangoutNotification = function() {
        hangoutNotification.classList.remove('show');
        if (hangoutTimer) clearTimeout(hangoutTimer); // Detener el temporizador si se cierra manualmente
        if (notificationAutoCloseTimer) clearTimeout(notificationAutoCloseTimer); // Detener el temporizador de autocierre
    }
    
    window.redirectToMinigames = function() {
        // Cambia 'minijuegos.html' por la URL real de tu sección de minijuegos
        window.open('gameroom.html', '_blank'); 
        closeHangoutNotification(); // Cierra la notificación después de redirigir
    }

    // window.addEventListener('load', alignGameroomIcon); // Ya no se necesita
    // window.addEventListener('resize', alignGameroomIcon); // Ya no se necesita

    // Funcionalidad para cambiar el icono de Gameroom a GIF en hover
    const gameroomIconLink = document.querySelector('.gameroom-icon-link');
    if (gameroomIconLink) {
        const gameroomIconImage = gameroomIconLink.querySelector('img');
        if (gameroomIconImage) {
            const originalGameroomSrc = gameroomIconImage.src; // Captura la ruta del PNG actual
            const hoverGameroomSrc = 'resources/gameroom.gif'; // Ruta al GIF

            gameroomIconLink.addEventListener('mouseenter', () => {
                gameroomIconImage.src = hoverGameroomSrc;
            });

            gameroomIconLink.addEventListener('mouseleave', () => {
                gameroomIconImage.src = originalGameroomSrc;
            });
        }
    }

    // Cargar la galería de forma dinámica desde gallery-index.html
    fetch('gallery-index.html')
        .then(response => response.text())
        .then(html => {
            // Extraer solo el contenido de .gallery-container
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const gallery = tempDiv.querySelector('.gallery-container');
            if (gallery) {
                document.querySelector('.gallery-container').innerHTML = gallery.innerHTML;
            }
            // Re-ejecutar la lógica de inicialización de la galería
            if (typeof window.initGallery === 'function') {
                window.initGallery();
            }
        });

});
