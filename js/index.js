document.addEventListener('DOMContentLoaded', () => {
    const gameItems = document.querySelectorAll('.game-item');


    let currentGameId = null;


    const modal = document.getElementById('downloadModal');
    const modalGameTitle = document.getElementById('modalGameTitle');
    const modalDownloadLinksList = document.getElementById('modalDownloadLinks');
    const closeButton = modal.querySelector('.close-button');

    const searchBar = document.getElementById('searchBar');



    const detailsModal = document.getElementById('detailsModal');
    const detailsContent = document.getElementById('detailsContent');
    const detailsCloseButton = detailsModal.querySelector('.details-close-button');


    const partsModal = document.getElementById('partsModal');
    const partsModalTitle = document.getElementById('partsModalTitle');
    const partsContainer = document.getElementById('partsContainer');
    const partsCloseButton = partsModal.querySelector('.parts-close-button');


    let downloadedParts = JSON.parse(localStorage.getItem('downloadedParts')) || {};


    const TWENTY_DAYS_MS = 20 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    let partsUpdated = false;

    Object.keys(downloadedParts).forEach(key => {
        const value = downloadedParts[key];
        if (value === true) {

            downloadedParts[key] = now;
            partsUpdated = true;
        } else if (typeof value === 'number') {

            if (now - value > TWENTY_DAYS_MS) {
                delete downloadedParts[key];
                partsUpdated = true;
            }
        }
    });

    if (partsUpdated) {
        localStorage.setItem('downloadedParts', JSON.stringify(downloadedParts));
    }




    function openPartsModal(parts, gameId) {

        const gameName = modalGameTitle.textContent;
        partsModalTitle.textContent = `Seleccionar parte`;
        partsContainer.innerHTML = '';

        parts.forEach((part, index) => {
            const partButton = document.createElement('button');
            partButton.className = 'part-button';
            partButton.textContent = part.text;


            const partKey = `${gameId}-${index}`;
            if (downloadedParts[partKey]) {
                partButton.classList.add('downloaded');
            }

            partButton.addEventListener('click', () => {

                downloadedParts[partKey] = Date.now();
                localStorage.setItem('downloadedParts', JSON.stringify(downloadedParts));
                partButton.classList.add('downloaded');


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
        'cod': [{ text: 'Descargar Call of Duty', url: 'https://www.mediafire.com/file/kfvfuduqbzlhor2/COD.rar/file' }],
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

    const imageCache = new Map();
    const imageCacheAccess = new Map();
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


        if (imageCache.has(src)) {
            imageCacheAccess.set(src, Date.now());
            img.src = imageCache.get(src);
            img.style.opacity = '1';
            img.style.willChange = 'auto';
            return;
        }


        img.setAttribute('decoding', 'async');
        img.setAttribute('loading', 'lazy');


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


    function manageCacheSize() {
        if (imageCache.size >= MAX_CACHE_SIZE) {

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


        gameItems.forEach((item, index) => {
            const img = item.querySelector('img');
            if (!img) return;

            const isVisible = visibleGameItems.includes(item);
            const isInViewport = index < 12;

            if (isVisible && isInViewport) {

                img.removeAttribute('loading');
                if (img.dataset.src) {
                    loadImageOptimized(img);
                }
            } else if (isVisible) {

                img.setAttribute('loading', 'lazy');
                if (!img.dataset.observed) {
                    intersectionObserver.observe(img);
                    img.dataset.observed = 'true';
                }
            } else {

                img.setAttribute('loading', 'lazy');
                intersectionObserver.unobserve(img);
                img.dataset.observed = 'false';
            }
        });


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

        currentGameId = gameId;
        modalGameTitle.textContent = gameName;
        modalDownloadLinksList.innerHTML = '';

        if (gameId && gameDownloadLinksData[gameId]) {
            const links = gameDownloadLinksData[gameId];
            let hasAnyDetails = links.some(linkInfo => linkInfo.readMoreText);

            links.forEach((linkInfo, index) => {

                const listItem = document.createElement('li');


                if (linkInfo.parts && linkInfo.parts.length > 0) {

                    const partsButton = document.createElement('button');
                    partsButton.textContent = linkInfo.text;
                    partsButton.className = 'download-with-parts';


                    partsButton.addEventListener('click', () => {
                        openPartsModal(linkInfo.parts, gameId);
                    });

                    listItem.appendChild(partsButton);
                } else {

                    const anchor = document.createElement('a');
                    anchor.href = linkInfo.url;
                    anchor.textContent = linkInfo.text;
                    anchor.target = '_blank';

                    listItem.appendChild(anchor);
                }


                const anchor = listItem.querySelector('a');
                if (anchor) {

                }

                modalDownloadLinksList.appendChild(listItem);


                if (linkInfo.readMoreText) {
                    const readMoreContainer = document.createElement('div');
                    readMoreContainer.className = 'read-more-container';

                    const buttonsContainer = document.createElement('div');
                    buttonsContainer.className = 'modal-buttons-container';

                    const readMoreToggle = document.createElement('span');
                    readMoreToggle.className = 'read-more-toggle';
                    readMoreToggle.textContent = 'Detalles';


                    const detailsText = linkInfo.readMoreText;


                    readMoreToggle.addEventListener('click', function () {

                        detailsContent.textContent = detailsText;


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
        document.body.classList.add('modal-blur-active');
        modal.classList.add('is-open');
    }


    updateImageLoadingPriority();

    function closeModal() {
        document.body.classList.remove('modal-blur-active');
        modal.classList.remove('is-open');
    }


    closeButton.addEventListener('click', closeModal);


    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });


    detailsCloseButton.addEventListener('click', () => {
        detailsModal.classList.remove('is-open');
    });


    detailsModal.addEventListener('click', (e) => {
        if (e.target === detailsModal) {
            detailsModal.classList.remove('is-open');
        }
    });


    partsCloseButton.addEventListener('click', closePartsModal);


    partsModal.addEventListener('click', (e) => {
        if (e.target === partsModal) {
            closePartsModal();
        }
    });


    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {

            if (partsModal.classList.contains('is-open')) {
                closePartsModal();
                event.stopPropagation();
                return;
            }

            if (detailsModal.classList.contains('is-open')) {
                detailsModal.classList.remove('is-open');

                event.stopPropagation();
                return;
            }

            if (modal.classList.contains('is-open')) {
                closeModal();
            }
        }
    });


    function sanitizeSearchTerm(term) {
        return term.toLowerCase().replace(/[^a-z0-9]/g, '');
    }


    searchBar.addEventListener('input', (event) => {
        const rawSearchTerm = event.target.value.trim();
        const sanitizedSearchTerm = sanitizeSearchTerm(rawSearchTerm);

        gameItems.forEach(item => {
            const rawGameTitle = item.querySelector('p').textContent;
            const sanitizedGameTitle = sanitizeSearchTerm(rawGameTitle);

            item.classList.toggle('hidden', !sanitizedGameTitle.includes(sanitizedSearchTerm));
        });

        updateImageLoadingPriority();

    });


    function initGallery() {
        const gameItems = document.querySelectorAll('.game-item');
        const hoverImageCache = new Map();


        gameItems.forEach(item => {

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


            img.setAttribute('decoding', 'async');
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }



            function processLoadedImage() {
                img.style.opacity = '1';

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


            item.addEventListener('mouseenter', () => {
                isMouseOverContainer = true;


                preloadController.abort();
                preloadController = new AbortController();


                if (hoverSrc && !hoverImageCache.has(hoverSrc)) {
                    const timeoutId = setTimeout(() => {
                        if (isMouseOverContainer && !preloadController.signal.aborted) {
                            const hoverImg = new Image();
                            hoverImg.onload = () => hoverImageCache.set(hoverSrc, true);
                            hoverImg.src = hoverSrc;
                        }
                    }, 300);


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


    function optimizeViewport() {

        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
        }

    }



    const galleryFile = 'gallery-index.html';

    fetch(galleryFile)
        .then(response => response.text())
        .then(html => {

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const gallery = doc.querySelector('.gallery-container');
            if (gallery) {
                document.querySelector('.gallery-container').innerHTML = gallery.innerHTML;
            }


            optimizeViewport();
            window.initGallery();


            const searchBar = document.getElementById('searchBar');
            if (searchBar) {
                let searchTimeout;
                searchBar.addEventListener('input', (event) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        const rawSearchTerm = event.target.value.trim();
                        const sanitizedSearchTerm = sanitizeSearchTerm(rawSearchTerm);


                        requestAnimationFrame(() => {
                            document.querySelectorAll('.game-item').forEach(item => {
                                const rawGameTitle = item.querySelector('p').textContent;
                                const sanitizedGameTitle = sanitizeSearchTerm(rawGameTitle);
                                item.classList.toggle('hidden', !sanitizedGameTitle.includes(sanitizedSearchTerm));
                            });
                            updateImageLoadingPriority();
                        });
                    }, 150);
                });
            }
        })
        .catch(error => {
            console.error('Error cargando la galería:', error);
        });

});
