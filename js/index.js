document.addEventListener('DOMContentLoaded', () => {
    const gameItems = document.querySelectorAll('.game-item');

    // Variable para almacenar el ID del juego actual
    let currentGameId = null;

    // Modal elements
    const modal = document.getElementById('downloadModal');
    const modalGameTitle = document.getElementById('modalGameTitle');
    const modalDownloadLinksList = document.getElementById('modalDownloadLinks');
    const closeButton = modal.querySelector('.close-button');

    const searchBar = document.getElementById('searchBar'); // searchBar ya está aquí


    // Elementos del modal de detalles
    const detailsModal = document.getElementById('detailsModal');
    const detailsContent = document.getElementById('detailsContent');
    const detailsCloseButton = detailsModal.querySelector('.details-close-button');

    // Elementos del modal de partes
    const partsModal = document.getElementById('partsModal');
    const partsModalTitle = document.getElementById('partsModalTitle');
    const partsContainer = document.getElementById('partsContainer');
    const partsCloseButton = partsModal.querySelector('.parts-close-button');

    // Array para rastrear partes descargadas
    let downloadedParts = JSON.parse(localStorage.getItem('downloadedParts')) || {};

    // Limpieza de partes expiradas (1 minuto para pruebas)
    const THIRTY_DAYS_MS = 60 * 1000;
    const now = Date.now();
    let partsUpdated = false;

    Object.keys(downloadedParts).forEach(key => {
        const value = downloadedParts[key];
        if (value === true) {
            // Migrar datos legacy (antes solo guardaba true)
            downloadedParts[key] = now;
            partsUpdated = true;
        } else if (typeof value === 'number') {
            // Verificar expiración
            if (now - value > THIRTY_DAYS_MS) {
                delete downloadedParts[key];
                partsUpdated = true;
            }
        }
    });

    if (partsUpdated) {
        localStorage.setItem('downloadedParts', JSON.stringify(downloadedParts));
    }



    // Funciones para el modal de partes
    function openPartsModal(parts, gameId) {
        // Obtener el nombre del juego desde el título del modal principal
        const gameName = modalGameTitle.textContent;
        partsModalTitle.textContent = `Seleccionar parte`;
        partsContainer.innerHTML = '';

        parts.forEach((part, index) => {
            const partButton = document.createElement('button');
            partButton.className = 'part-button';
            partButton.textContent = part.text;

            // Verificar si esta parte ya fue descargada
            const partKey = `${gameId}-${index}`;
            if (downloadedParts[partKey]) {
                partButton.classList.add('downloaded');
            }

            partButton.addEventListener('click', () => {
                // Marcar como descargada con timestamp
                downloadedParts[partKey] = Date.now();
                localStorage.setItem('downloadedParts', JSON.stringify(downloadedParts));
                partButton.classList.add('downloaded');

                // Abrir enlace de descarga
                window.open(part.url, '_blank', 'noopener');


            });

            partsContainer.appendChild(partButton);
        });

        partsModal.classList.add('is-open');
        document.body.classList.add('modal-blur-active');
    }

    function closePartsModal() {
        partsModal.classList.remove('is-open');
        document.body.classList.remove('modal-blur-active');
    }

    // Data for download links
    const gameDownloadLinksData = {
        'ion-fury': [{ text: 'Descargar Ion Fury', url: 'https://drive.usercontent.google.com/download?id=1mHna_GXRcEDN6fr4zHoMCXF6Z7phlWOB&authuser=0' }],
        'gta-vc': [{ text: 'Descargar GTA Vice City', url: 'https://www.mediafire.com/file/negikbx0esjy4zb/GTAVC.iso/file' }],
        'gta-iii': [{ text: 'Descargar GTA III', url: 'https://www.mediafire.com/file/zdvttk6hzyv1ola/GTA-III.rar/file' }],
        'cuphead': [{ text: 'Descargar Cuphead', url: 'https://www.mediafire.com/file/z6qrhatejixijzs/CDE.rar/file' }],
        'blood-knights': [{ text: 'Descargar Blood Knights', url: 'https://www.mediafire.com/file/tz5n0miu2lqe0am/BKPC.7z/file' }],
        'unmetal': [{ text: 'Descargar Unmetal', url: 'https://www.mediafire.com/file/7rw1oidswulksof/UCP.rar/file' }],
        'halo-ce': [{ text: 'Descargar Halo: Combat Evolved', url: 'https://www.mediafire.com/file/jftpybq93hfqy26/HCE_2001.rar/file' }],
        'portal': [{ text: 'Descargar Portal', url: 'https://www.mediafire.com/file/keszhjrcvsx5jra/PPC.iso/file' }],
        'portal2': [{ text: 'Descargar Portal 2', url: 'https://www.mediafire.com/file/srerms85g91g4zw/P2PC.iso/file' }],
        'killing-floor': [{ text: 'Descargar Killing Floor', url: 'https://www.mediafire.com/file/zffmwemajvs09dq/KF1.rar/file' }],
        'brotato': [{ text: 'Descargar Brotato', url: 'https://www.mediafire.com/file/5okoinvbimse0h4' }],
        'vampire-survivors': [{ text: 'Descargar Vampire Survivors', url: 'https://www.mediafire.com/file/w7r10dc1rb85n4r/Vampi6reSurv1ivors-1.13.109-elamigos.rar/file' }],
        'hct': [{ text: 'Descargar Horizon Chase Turbo', url: 'https://www.mediafire.com/file/b7g6sh0gj0biort/HCT2018.Www.GamezFull.com.rar/file' }],
        'barony': [
            { text: 'Descargar Barony', url: 'https://www.mediafire.com/file/zbdaq9intal95mf/BPC.rar/file' },
            { text: 'Descargar traducción al español', url: 'https://www.mediafire.com/file/sjw4si78r9wy2ae/Barony_Spanish_Mod.rar/file' }
        ],
        'dmc': [{ text: 'Descargar DmC: Devil May Cry', url: 'https://rapidshare.co/en/d/QIkPCb4cBC3xXE' }],
        'Call of Duty': [{ text: 'Descargar Call of Duty', url: 'https://www.mediafire.com/file/kfvfuduqbzlhor2/COD.rar/file' }],
        'dead-space': [
            {
                text: 'Descargar Dead Space',
                parts: [
                    { text: 'Parte 1', url: 'https://rapidshare.co/en/d/yo8qFSaU3ICHXR' },
                    { text: 'Parte 2', url: 'https://rapidshare.co/en/d/BmwqHhDb1IGqDq' },
                    { text: 'Parte 3', url: 'https://rapidshare.co/en/d/mV6eSdjw1Li9qF' },
                    { text: 'Parte 4', url: 'https://rapidshare.co/en/d/pv7v3WHN74JHIu' }
                ]
            }
        ],
        'dead-space2': [
            {
                text: 'Descargar Dead Space 2',
                parts: [
                    { text: 'Parte 1', url: 'https://rapidshare.co/en/d/UeXMFiyuv1TmtQ' },
                    { text: 'Parte 2', url: 'https://rapidshare.co/en/d/d0sauQDTj60K7x' },
                    { text: 'Parte 3', url: 'https://rapidshare.co/en/d/I8Hn85I7H8QtFK' }
                ]
            }
        ],
        'dead-space3': [
            {
                text: 'Descargar Dead Space 3',
                parts: [
                    { text: 'Parte 1', url: 'https://rapidshare.co/en/d/rb85h9EyANiqSI' },
                    { text: 'Parte 2', url: 'https://rapidshare.co/en/d/fQjBweUPQS506q' },
                    { text: 'Parte 3', url: 'https://rapidshare.co/en/d/sRdLy4NKcTfQIP' },
                    { text: 'Parte 4', url: 'https://rapidshare.co/en/d/wcw67QeXI5gU5j' },
                    { text: 'Parte 5', url: 'https://rapidshare.co/en/d/x0JLK54NwTWNGg' },
                    { text: 'Parte 6', url: 'https://rapidshare.co/en/d/fO28odU9HPTiTv' },
                    { text: 'Parte 7', url: 'https://rapidshare.co/en/d/b2gxytlfBi2zEk' }
                ]
            }
        ]

    };

    // Optimizaciones avanzadas para carga de imágenes
    const imageCache = new Map();
    const imageCacheAccess = new Map(); // Para política LRU
    const MAX_CACHE_SIZE = 50;

    const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImageOptimized(img);
                intersectionObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px',
        threshold: 0.1
    });

    function loadImageOptimized(img) {
        const src = img.dataset.src || img.src;

        // Actualizar acceso para política LRU
        if (imageCache.has(src)) {
            imageCacheAccess.set(src, Date.now());
            img.src = imageCache.get(src);
            img.style.opacity = '1';
            img.style.willChange = 'auto';
            return;
        }

        // Agregar atributos nativos para mejor rendimiento
        img.setAttribute('decoding', 'async');
        img.setAttribute('loading', 'lazy');

        // Crear imagen WebP con fallback
        const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        const testImg = new Image();

        testImg.onload = () => {
            manageCacheSize();
            imageCache.set(src, webpSrc);
            imageCacheAccess.set(src, Date.now());
            img.src = webpSrc;
            img.style.opacity = '1';
            img.style.willChange = 'auto';
        };

        testImg.onerror = () => {
            manageCacheSize();
            imageCache.set(src, src);
            imageCacheAccess.set(src, Date.now());
            img.src = src;
            img.style.opacity = '1';
            img.style.willChange = 'auto';
        };

        testImg.src = webpSrc;
    }

    // Política LRU para el cache
    function manageCacheSize() {
        if (imageCache.size >= MAX_CACHE_SIZE) {
            // Encontrar la entrada menos recientemente usada
            let oldestKey = null;
            let oldestTime = Date.now();

            for (const [key, time] of imageCacheAccess) {
                if (time < oldestTime) {
                    oldestTime = time;
                    oldestKey = key;
                }
            }

            if (oldestKey) {
                imageCache.delete(oldestKey);
                imageCacheAccess.delete(oldestKey);
            }
        }
    }

    function updateImageLoadingPriority() {
        const visibleGameItems = [];
        gameItems.forEach(item => {
            const style = window.getComputedStyle(item);
            if (style.display !== 'none') {
                visibleGameItems.push(item);
            }
        });

        // Configurar lazy loading inteligente
        gameItems.forEach((item, index) => {
            const img = item.querySelector('img');
            if (!img) return;

            const isVisible = visibleGameItems.includes(item);
            const isInViewport = index < 12; // Primeras 12 imágenes (3 filas típicas)

            if (isVisible && isInViewport) {
                // Carga inmediata para imágenes críticas
                img.removeAttribute('loading');
                if (img.dataset.src) {
                    loadImageOptimized(img);
                }
            } else if (isVisible) {
                // Lazy loading para imágenes visibles pero no críticas
                img.setAttribute('loading', 'lazy');
                if (!img.dataset.observed) {
                    intersectionObserver.observe(img);
                    img.dataset.observed = 'true';
                }
            } else {
                // Lazy loading para imágenes ocultas
                img.setAttribute('loading', 'lazy');
                intersectionObserver.unobserve(img);
                img.dataset.observed = 'false';
            }
        });

        // Preload de las siguientes 6 imágenes críticas
        const criticalImages = visibleGameItems.slice(0, 18);
        criticalImages.forEach((item, index) => {
            if (index >= 12) {
                const img = item.querySelector('img');
                if (img && !imageCache.has(img.src)) {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = img.src;
                    document.head.appendChild(link);
                }
            }
        });
    }

    function openModal(gameId, gameName) {
        // Variable global para acceder al gameId desde otros contextos
        currentGameId = gameId;
        modalGameTitle.textContent = gameName; // Actualiza el título del modal
        modalDownloadLinksList.innerHTML = ''; // Limpia enlaces anteriores

        if (gameId && gameDownloadLinksData[gameId]) {
            const links = gameDownloadLinksData[gameId];
            let hasAnyDetails = links.some(linkInfo => linkInfo.readMoreText);

            links.forEach((linkInfo, index) => {

                const listItem = document.createElement('li');

                // Verificar si el enlace tiene partes
                if (linkInfo.parts && linkInfo.parts.length > 0) {
                    // Crear botón especial para juegos con partes
                    const partsButton = document.createElement('button');
                    partsButton.textContent = linkInfo.text;
                    partsButton.className = 'download-with-parts';
                    // Los estilos se aplican completamente desde CSS

                    partsButton.addEventListener('click', () => {
                        openPartsModal(linkInfo.parts, gameId);
                    });

                    listItem.appendChild(partsButton);
                } else {
                    // Crear enlace normal
                    const anchor = document.createElement('a');
                    anchor.href = linkInfo.url;
                    anchor.textContent = linkInfo.text;
                    anchor.target = '_blank'; // Abrir en nueva pestaña

                    listItem.appendChild(anchor);
                }

                // Solo agregar event listener para enlaces normales
                const anchor = listItem.querySelector('a');
                if (anchor) {

                }

                modalDownloadLinksList.appendChild(listItem);

                // Añadir "Leer más" si existe texto
                if (linkInfo.readMoreText) {
                    const readMoreContainer = document.createElement('div');
                    readMoreContainer.className = 'read-more-container';

                    const buttonsContainer = document.createElement('div');
                    buttonsContainer.className = 'modal-buttons-container';

                    const readMoreToggle = document.createElement('span');
                    readMoreToggle.className = 'read-more-toggle';
                    readMoreToggle.textContent = 'Detalles';

                    // Guardar el texto de detalles para usarlo en el modal
                    const detailsText = linkInfo.readMoreText;

                    // Evento para abrir el modal de detalles
                    readMoreToggle.addEventListener('click', function () {
                        // Establecer el contenido del modal
                        detailsContent.textContent = detailsText;

                        // Mostrar el modal
                        detailsModal.classList.add('is-open');
                    });

                    buttonsContainer.appendChild(readMoreToggle);
                    readMoreContainer.appendChild(buttonsContainer);
                    listItem.appendChild(readMoreContainer);
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
    }

    // Event listener para el botón de cierre del modal
    closeButton.addEventListener('click', closeModal);

    // Event listener para cerrar el modal haciendo clic fuera de su contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Cerrar el modal de detalles al hacer clic en la X
    detailsCloseButton.addEventListener('click', () => {
        detailsModal.classList.remove('is-open');
    });

    // Cerrar el modal de detalles al hacer clic fuera del contenido
    detailsModal.addEventListener('click', (e) => {
        if (e.target === detailsModal) {
            detailsModal.classList.remove('is-open');
        }
    });

    // Event listeners para el modal de partes
    partsCloseButton.addEventListener('click', closePartsModal);

    // Cerrar el modal de partes al hacer clic fuera del contenido
    partsModal.addEventListener('click', (e) => {
        if (e.target === partsModal) {
            closePartsModal();
        }
    });

    // Event listener para cerrar los modales con la tecla Escape
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            // Primero cerrar el modal de partes si está abierto
            if (partsModal.classList.contains('is-open')) {
                closePartsModal();
                event.stopPropagation();
                return;
            }
            // Luego cerrar el modal de detalles si está abierto
            if (detailsModal.classList.contains('is-open')) {
                detailsModal.classList.remove('is-open');
                // Prevenir que se cierre también el modal principal
                event.stopPropagation();
                return;
            }
            // Si ningún modal secundario está abierto, cerrar el modal principal
            if (modal.classList.contains('is-open')) {
                closeModal();
            }
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
            // Usar classList.toggle para evitar reflows
            item.classList.toggle('hidden', !sanitizedGameTitle.includes(sanitizedSearchTerm));
        });
        // Actualizar la prioridad de carga después de filtrar
        updateImageLoadingPriority();

    });

    // --- INICIALIZACIÓN DE GALERÍA DINÁMICA Y EVENTOS ---
    function initGallery() {
        const gameItems = document.querySelectorAll('.game-item');
        const hoverImageCache = new Map();

        // --- Eventos de tarjetas ---
        gameItems.forEach(item => {
            // Prevenir event listeners duplicados
            if (item.dataset.listenersAdded) {
                return;
            }
            item.dataset.listenersAdded = 'true';

            const img = item.querySelector('img');
            const originalSrc = img.getAttribute('src');
            const hoverSrc = item.dataset.hoverSrc;
            let hoverTimer = null;
            let preloadController = new AbortController();
            let isHoverImageDisplayed = false;
            let isMouseOverContainer = false;

            // Agregar atributos nativos para mejor rendimiento
            img.setAttribute('decoding', 'async');
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }


            // Optimización de carga de imágenes
            function processLoadedImage() {
                img.style.opacity = '1';
                // Mantener will-change mientras la imagen esté en viewport o en cache activo
                const rect = img.getBoundingClientRect();
                const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
                if (!isInViewport && !imageCache.has(img.src)) {
                    img.style.willChange = 'auto';
                }
            }

            if (img.complete && img.naturalWidth > 0) {
                processLoadedImage();
            } else {
                img.addEventListener('load', processLoadedImage, { once: true });
                img.addEventListener('error', () => {
                    img.style.opacity = '1';
                    img.style.willChange = 'auto';
                }, { once: true });
            }

            // Precarga hover mejorada con AbortController
            item.addEventListener('mouseenter', () => {
                isMouseOverContainer = true;

                // Cancelar precarga anterior
                preloadController.abort();
                preloadController = new AbortController();

                // Precargar imagen hover solo después de 300ms de hover
                if (hoverSrc && !hoverImageCache.has(hoverSrc)) {
                    const timeoutId = setTimeout(() => {
                        if (isMouseOverContainer && !preloadController.signal.aborted) {
                            const hoverImg = new Image();
                            hoverImg.onload = () => hoverImageCache.set(hoverSrc, true);
                            hoverImg.src = hoverSrc;
                        }
                    }, 300);

                    // Cancelar timeout si se aborta
                    preloadController.signal.addEventListener('abort', () => {
                        clearTimeout(timeoutId);
                    });
                }

                if (hoverSrc) {
                    if (hoverTimer) clearTimeout(hoverTimer);
                    hoverTimer = setTimeout(() => {
                        if (item.matches(':hover') && hoverImageCache.has(hoverSrc)) {
                            img.src = hoverSrc;
                            isHoverImageDisplayed = true;
                        }
                    }, 800);
                }
            });

            item.addEventListener('mouseleave', () => {
                isMouseOverContainer = false;

                // Cancelar precarga y hover
                preloadController.abort();

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

    // Optimización de viewport
    function optimizeViewport() {
        // Configurar viewport meta para mejor rendimiento
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
        }
        // DNS prefetch eliminado - no se usan dominios externos
    }

    // --- CARGA DINÁMICA DE LA GALERÍA Y FILTRO ---
    // Carga de la galería
    const galleryFile = 'gallery-index.html';

    fetch(galleryFile)
        .then(response => response.text())
        .then(html => {
            // Usar DOMParser para mayor seguridad
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const gallery = doc.querySelector('.gallery-container');
            if (gallery) {
                document.querySelector('.gallery-container').innerHTML = gallery.innerHTML;
            }

            // Optimizar viewport antes de inicializar
            optimizeViewport();
            window.initGallery();

            // Filtro de búsqueda optimizado con debounce
            const searchBar = document.getElementById('searchBar');
            if (searchBar) {
                let searchTimeout;
                searchBar.addEventListener('input', (event) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        const rawSearchTerm = event.target.value.trim();
                        const sanitizedSearchTerm = sanitizeSearchTerm(rawSearchTerm);

                        // Usar requestAnimationFrame para mejor rendimiento
                        requestAnimationFrame(() => {
                            document.querySelectorAll('.game-item').forEach(item => {
                                const rawGameTitle = item.querySelector('p').textContent;
                                const sanitizedGameTitle = sanitizeSearchTerm(rawGameTitle);
                                item.classList.toggle('hidden', !sanitizedGameTitle.includes(sanitizedSearchTerm));
                            });
                            updateImageLoadingPriority();
                        });
                    }, 150); // Debounce de 150ms
                });
            }
        })
        .catch(error => {
            console.error('Error cargando la galería:', error);
        });

});
