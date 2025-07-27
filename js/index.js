document.addEventListener('DOMContentLoaded', () => {
    const gameItems = document.querySelectorAll('.game-item');
    
    // Variable para almacenar el ID del juego actual
    let currentGameId = null;

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

    // Elementos de la mochila
    const backpackIconLink = document.getElementById('backpackIcon');
    const backpackCounter = document.getElementById('backpackCounter');
    const backpackModal = document.getElementById('backpackModal');
    const backpackCloseBtn = document.getElementById('backpackCloseButton');
    const backpackItems = document.getElementById('backpackItems');
    const emptyBackpackMessage = document.getElementById('emptyBackpackMessage');
    const backpackActions = document.getElementById('backpackActions');
    const downloadAllBtn = document.getElementById('downloadAllButton');
    const clearBackpackBtn = document.getElementById('clearBackpackButton');

    // Array para almacenar los juegos en la mochila
    let backpack = JSON.parse(localStorage.getItem('gameBackpack')) || [];

    // Funciones para el modal de partes
    function openPartsModal(gameTitle, parts, gameId) {
        partsModalTitle.textContent = `${gameTitle} - Seleccionar Parte`;
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
                // Marcar como descargada
                downloadedParts[partKey] = true;
                localStorage.setItem('downloadedParts', JSON.stringify(downloadedParts));
                partButton.classList.add('downloaded');
                
                // Abrir enlace de descarga
                window.open(part.url, '_blank');
                
                // Mostrar notificación si no se ha mostrado
                if (!sessionStorage.getItem('hangoutNotificationShown')) {
                    if (hangoutTimer) clearTimeout(hangoutTimer);
                    hangoutNotification.classList.remove('show');
                    hangoutTimer = setTimeout(showHangoutNotification, 10000);
                }
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
        'gta-sa': [ { text: 'Descargar GTA San Andreas', url: 'https://www.mediafire.com/file/cu77pvw068jlvxy/GTASA.iso/file' }],
        'cuphead': [ { text: 'Descargar Cuphead', url: 'https://www.mediafire.com/file/z6qrhatejixijzs/CDE.rar/file', readMoreText: '- Incluye DLC' }],
		'gta3': [{ text: 'Descargar GTA III', url: 'https://www.mediafire.com/file/zdvttk6hzyv1ola/GTA-III.rar/file', readMoreText: '- Archivos originales, juego completo\n- Si el juego no inicia, ejecutarlo en modo de compatibilidad con Windows Service Pack 2' }],
		'kf1': [{ text: 'Descargar Killing Floor', url: 'https://www.mediafire.com/file/zffmwemajvs09dq/KF1.rar/file' }],
		'blur': [{ text: 'Descargar Blur', url: 'https://www.mediafire.com/file/gg1jyyp0grgf8fk/BLR.iso/file' }],
        'gta-vc': [{ text: 'Descargar GTA Vice City', url: 'https://www.mediafire.com/file/negikbx0esjy4zb/GTAVC.iso/file', readMoreText: '- Archivos originales, juego completo.' }],
        'vampire-survivors': [{ text: 'Descargar Vampire Survivors', url: 'https://www.mediafire.com/file/w7r10dc1rb85n4r/Vampi6reSurv1ivors-1.13.109-elamigos.rar/file', readMoreText: '- Versión 1.113.109\n- Todos los DLC' }],
        'unmetal': [{ text: 'Descargar Unmetal', url: 'https://www.mediafire.com/file/7rw1oidswulksof/UCP.rar/file', readMoreText: '-Creator Pack incluído' }],
        'portal': [{ text: 'Descargar Portal', url: 'https://www.mediafire.com/file/keszhjrcvsx5jra/PPC.iso/file' }],
        'portal2': [
            { text: 'Descargar Portal 2', url: 'https://www.mediafire.com/file/srerms85g91g4zw/P2PC.iso/file' },
            { text: 'Descargar FIX ONLINE', url: 'https://mega.nz/file/IJcxgYTB#QSuKFAd5K0VyQqbQaKpgus8UBiDA_PeqXUK_2O_kJY4' }
        ],
        'hl-counter-strike16': [{ text: 'Descargar Counter Strike 1.6', url: 'https://www.mediafire.com/file/8g8eh2v1xja2pju/CS16.rar/file', readMoreText: '- Versión NO STEAM' }],
        'REPO': [
			{ text: 'Descargar R.E.P.O', url: 'https://www.mediafire.com/file/lcb75sjs3daatgv' },
			{ text: 'Descargar traducción al español', url: 'https://www.mediafire.com/file/cl385wv3mzw7def/TRADUCCi%25C3%2593N_R.E.P.O_SPA.rar/file', readMoreText: '- Fix online incluído' }],
        'dbfz': [
            { text: 'Descargar Dragon Ball FighterZ', url: 'https://www.mediafire.com/file/6b8kehvf141zxbm/678950.rar/file' },
            { text: 'Descargar Asistente DBFZ', url: 'https://www.mediafire.com/file/o2e5z2mewe4h8mr/DBFZ_Assistant.rar/file', readMoreText: '- Versión 1.31\n- Descargar el asistente solo si quieres:\n· actualizar a los personajes a la versión 1.38\n· optimización\n· solucionar errores de ejecución' }],
        'horizon-chase-turbo': [{ text: 'Descargar Horizon Chase Turbo', url: 'https://www.mediafire.com/file/b7g6sh0gj0biort/HCT2018.Www.GamezFull.com.rar/file' }],
        'brotato': [{ text: 'Descargar Brotato', url: 'https://www.mediafire.com/file/5okoinvbimse0h4' }],
        'assassinscreed': [{ text: 'Descargar Assassin\'s Creed', url: 'https://example.com/assassinscreed-download' }],
        'tomb-raider': [{ text: 'Descargar Tomb Raider (2013)', url: 'https://example.com/tomb-raider-download' }],
        'horizon-chase-turbo': [{ text: 'Descargar Horizon Chase Turbo', url: 'https://example.com/horizon-chase-turbo-download' }],
        'barony': [{ text: 'Descargar Barony', url: 'https://www.mediafire.com/file/zbdaq9intal95mf/BPC.rar/file', readMoreText: '- Versión 4.3.1' }],
        'dmc-devil-may-cry': [{ text: 'Descargar DmC: Devil May Cry', url: 'https://example.com/dmc-devil-may-cry-download' }],
        'call-of-duty': [{ text: 'Descargar Call of Duty', url: 'https://example.com/call-of-duty-download' }],
        'halo-ce': [{
            text: 'Descargar',
            url: 'https://www.mediafire.com/file/jftpybq93hfqy26/HCE_2001.rar/file',
            readMoreText: '- Versión 1.0.10\n- Multijugador funcional'
        }],
        'fnaf': [
            { text: 'Descargar FNAF (original)', url: 'https://www.mediafire.com/file/qa1jza71rr1uj9k/FNAF.exe/file' },
            { text: 'Descargar FNAF (español)', url: 'https://www.mediafire.com/file/k5pj0giyyfdwihe/Five_Nights_at_Freddys_Edicion_Ultra.exe/file' }],
        'fnaf2': [
            { text: 'Descargar FNAF 2 (original)', url: 'https://www.mediafire.com/file/o0523msi4t3q4yk/FNAF2.exe/file' },
            { text: 'Descargar FNAF 2 (español)', url: 'https://www.mediafire.com/file/6nigs93pugt11z2/Five+Nights+at+Freddy%27s+2.exe' }],
        'fnaf3': [
            { text: 'Descargar FNAF 3 (original)', url: 'https://www.mediafire.com/file/4wbu771d733e1f1/FNAF3.exe/file' },
            { text: 'Descargar FNAF 3 (español)', url: 'https://www.mediafire.com/file/1rxjwsgflvdmtq7/Five+Nights+at+Freddy%27s+3.exe' }],
        'fnaf4': [
            { text: 'Descargar FNAF 4 (original)', url: 'https://www.mediafire.com/file/ddd6icjvzwotp77/FNAF4.exe/file' },
            { text: 'Descargar FNAF 4 (español)', url: 'https://www.mediafire.com/file/c0fam74mtl87hft/Five_Nights_at_Freddy%25C2%25B4s_4.exe/file' }],
        'fnaf4-hw': [
            { text: 'Descargar FNAF 4: Halloween Edition (original)', url: 'https://www.mediafire.com/file/k9uy7if04x7hjhr/FNAF4-HWE.exe/file' },
            { text: 'Descargar FNAF 4: Halloween Edition (español)', url: 'https://www.mediafire.com/file/hmmszewyab5t7fb/Five_Nights_at_Freddy%25C2%25B4s_4_Halloween_Edition.exe/file' }],
        'fnaf5': [
            { text: 'Descargar FNAF 5: Sister Location', url: 'https://www.mediafire.com/file/ye20nk6wxgbk8ch/FNAF5.exe/file' }],
        'juego-ejemplo': [
            { 
                text: 'Descargar Juego Ejemplo', 
                hasParts: true,
                parts: [
                    { text: 'Parte 1', url: 'https://example.com/parte1' },
                    { text: 'Parte 2', url: 'https://example.com/parte2' },
                    { text: 'Parte 3', url: 'https://example.com/parte3' },
                    { text: 'Parte 4', url: 'https://example.com/parte4' }
                ]
            }
        ],
    };

    // Funciones de la mochila
    function updateBackpackCounter() {
        backpackCounter.textContent = backpack.length;
        if (backpack.length > 0) {
            backpackCounter.style.display = 'flex';
        } else {
            backpackCounter.style.display = 'none';
        }
    }

    function saveBackpack() {
        localStorage.setItem('gameBackpack', JSON.stringify(backpack));
    }

    function addToBackpack(gameId, gameName, gameImage) {
        const existingItem = backpack.find(item => item.id === gameId);
        if (!existingItem) {
            // Agregar a la mochila
            backpack.push({
                id: gameId,
                name: gameName,
                image: gameImage
            });
            saveBackpack();
            updateBackpackCounter();
            updateBackpackButtons();
            return true;
        } else {
            // Quitar de la mochila (toggle)
            removeFromBackpack(gameId);
            return false;
        }
    }

    function removeFromBackpack(gameId) {
        backpack = backpack.filter(item => item.id !== gameId);
        saveBackpack();
        updateBackpackCounter();
        updateBackpackButtons();
        renderBackpackItems();
    }

    function clearBackpack() {
        backpack = [];
        saveBackpack();
        updateBackpackCounter();
        updateBackpackButtons();
        renderBackpackItems();
    }

    function updateBackpackButtons() {
        document.querySelectorAll('.add-to-backpack-btn').forEach(btn => {
            const gameId = btn.dataset.gameId;
            const gameItem = btn.closest('.game-item');
            if (backpack.find(item => item.id === gameId)) {
                btn.textContent = '';
                btn.classList.add('added');
                btn.title = 'Quitar de la mochila';
                if (gameItem) gameItem.classList.add('in-backpack');
            } else {
                btn.textContent = '';
                btn.classList.remove('added');
                btn.title = 'Agregar a la mochila';
                if (gameItem) gameItem.classList.remove('in-backpack');
            }
        });
    }

    function renderBackpackItems() {
        if (backpack.length === 0) {
            emptyBackpackMessage.style.display = 'block';
            backpackActions.style.display = 'none';
            backpackItems.innerHTML = '<p id="emptyBackpackMessage">Tu mochila está vacía. Agrega algunos juegos desde la página principal.</p>';
        } else {
            emptyBackpackMessage.style.display = 'none';
            backpackActions.style.display = 'flex';
            backpackItems.innerHTML = backpack.map(item => `
                <div class="backpack-item">
                    <div class="backpack-item-info">
                        <img src="${item.image}" alt="${item.name}">
                        <span class="backpack-item-name">${item.name}</span>
                    </div>
                    <button class="remove-item-btn" data-game-id="${item.id}">Quitar</button>
                </div>
            `).join('');

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
        renderBackpackItems();
        backpackModal.classList.add('is-open');
        document.body.classList.add('modal-blur-active');
    }

    function closeBackpackModal() {
        backpackModal.classList.remove('is-open');
        document.body.classList.remove('modal-blur-active');
    }

    function downloadAllGames() {
        backpack.forEach(item => {
            const gameLinks = gameDownloadLinksData[item.id];
            if (gameLinks && gameLinks.length > 0) {
                // Abrir el primer enlace de descarga de cada juego
                window.open(gameLinks[0].url, '_blank');
            }
        });
        
        // Mostrar notificación de descarga múltiple
        alert(`Iniciando descarga de ${backpack.length} juegos. Revisa las pestañas de tu navegador.`);
    }

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
                if (linkInfo.hasParts && linkInfo.parts) {
                    // Crear botón especial para juegos con partes
                    const partsButton = document.createElement('button');
                    partsButton.textContent = linkInfo.text;
                    partsButton.className = 'download-with-parts';
                    partsButton.style.cssText = `
                        background: #5ac560;
                        color: white;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 1em;
                        font-family: 'Manrope', sans-serif;
                        width: 100%;
                        margin-bottom: 8px;
                        transition: all 0.3s ease;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    `;
                    
                    partsButton.addEventListener('click', () => {
                        openPartsModal(linkInfo.text, linkInfo.parts, gameId);
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
                    readMoreToggle.addEventListener('click', function() {
                        // Establecer el contenido del modal
                        detailsContent.textContent = detailsText;
                        
                        // Mostrar el modal
                        detailsModal.classList.add('is-open');
                    });

                    // Crear el botón "Agregar a la mochila" junto al botón de detalles
                    const backpackButton = document.createElement('span');
                    backpackButton.className = 'read-more-toggle';
                    backpackButton.textContent = 'Agregar a la mochila';
                    backpackButton.dataset.gameId = gameId;
                    
                    // Verificar si el juego ya está en la mochila para actualizar el texto del botón
                    if (backpack.find(item => item.id === gameId)) {
                        backpackButton.textContent = 'Eliminar de la mochila';
                    }
                    
                    // Agregar evento para añadir/quitar de la mochila
                    backpackButton.addEventListener('click', function() {
                        // Obtener el nombre del juego del título del modal
                        const gameName = modalGameTitle.textContent;
                        const gameImage = document.querySelector(`.game-item[data-game-id="${gameId}"] img`)?.src || '';
                        const isInBackpack = addToBackpack(gameId, gameName, gameImage);
                        
                        // Actualizar el texto del botón según la acción realizada
                        this.textContent = isInBackpack ? 'Eliminar de la mochila' : 'Agregar a la mochila';
                    });

                    buttonsContainer.appendChild(readMoreToggle);
                    buttonsContainer.appendChild(backpackButton);
                    readMoreContainer.appendChild(buttonsContainer);
                    listItem.appendChild(readMoreContainer);
                }
            });
            
            // Solo crear el botón "Agregar a la mochila" al final si ningún enlace tiene detalles
            if (!hasAnyDetails) {
                const backpackListItem = document.createElement('li');
                const readMoreContainer = document.createElement('div');
                readMoreContainer.className = 'read-more-container';
                
                const buttonsContainer = document.createElement('div');
                buttonsContainer.className = 'modal-buttons-container';
                
                const backpackButton = document.createElement('span');
                backpackButton.className = 'read-more-toggle';
                backpackButton.textContent = 'Agregar a la mochila';
                backpackButton.dataset.gameId = gameId;
                
                // Verificar si el juego ya está en la mochila para actualizar el texto del botón
                if (backpack.find(item => item.id === gameId)) {
                    backpackButton.textContent = 'Eliminar de la mochila';
                }
                
                // Agregar evento para añadir/quitar de la mochila
                backpackButton.addEventListener('click', function() {
                    // Obtener el nombre del juego del título del modal
                    const gameName = modalGameTitle.textContent;
                    const gameImage = document.querySelector(`.game-item[data-game-id="${gameId}"] img`)?.src || '';
                    const isInBackpack = addToBackpack(gameId, gameName, gameImage);
                    
                    // Actualizar el texto del botón según la acción realizada
                    this.textContent = isInBackpack ? 'Eliminar de la mochila' : 'Agregar a la mochila';
                });
                
                buttonsContainer.appendChild(backpackButton);
                readMoreContainer.appendChild(buttonsContainer);
                backpackListItem.appendChild(readMoreContainer);
                modalDownloadLinksList.appendChild(backpackListItem);
            }
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

            // Agregar botón de mochila si no existe
            if (!item.querySelector('.add-to-backpack-btn')) {
                const backpackBtn = document.createElement('button');
                backpackBtn.className = 'add-to-backpack-btn';
                backpackBtn.textContent = '+';
                backpackBtn.title = 'Agregar a la mochila';
                backpackBtn.dataset.gameId = item.dataset.gameId;
                
                backpackBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const gameId = item.dataset.gameId;
                    const gameName = item.querySelector('p').textContent;
                    const gameImage = img.getAttribute('src');
                    
                    addToBackpack(gameId, gameName, gameImage);
                });
                
                item.appendChild(backpackBtn);
            }

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
            const originalGameroomSrc = gameroomIconImage.src; // Captura la ruta del SVG actual
            const hoverGameroomSrc = 'resources/gameroom.svg'; // Ruta al SVG

            gameroomIconLink.addEventListener('mouseenter', () => {
                gameroomIconImage.src = hoverGameroomSrc;
            });

            gameroomIconLink.addEventListener('mouseleave', () => {
                gameroomIconImage.src = originalGameroomSrc;
            });
        }
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
            clearBackpack();
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
            // Actualizar botones de mochila después de cargar la galería
            updateBackpackButtons();
        });

});
