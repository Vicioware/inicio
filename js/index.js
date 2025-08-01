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
                // Marcar como descargada
                downloadedParts[partKey] = true;
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
        'gta-sa': [ { text: 'Descargar GTA San Andreas', url: 'https://www.mediafire.com/file/cu77pvw068jlvxy/GTASA.iso/file' }],
        'cuphead': [ { text: 'Descargar Cuphead', url: 'https://www.mediafire.com/file/z6qrhatejixijzs/CDE.rar/file', readMoreText: '- Incluye DLC' }],
		'gta3': [{ text: 'Descargar GTA III', url: 'https://www.mediafire.com/file/zdvttk6hzyv1ola/GTA-III.rar/file', readMoreText: '- Archivos originales, juego completo\n- Si el juego no inicia, ejecutarlo en modo de compatibilidad con Windows Service Pack 2' }],
		'kf1': [
            { text: 'Descargar Killing Floor', url: 'https://www.mediafire.com/file/zffmwemajvs09dq/KF1.rar/file' },
            { text: 'Descargar doblaje latino (mod)', url: 'https://drive.usercontent.google.com/download?id=1gMla8WvRv-XT9OIjqMre9gPsihb2QqAk&export=download&authuser=0' }],
		'blur': [{ text: 'Descargar Blur', url: 'https://www.mediafire.com/file/gg1jyyp0grgf8fk/BLR.iso/file' }],
        'gta-vc': [{ text: 'Descargar GTA Vice City', url: 'https://www.mediafire.com/file/negikbx0esjy4zb/GTAVC.iso/file', readMoreText: '- Archivos originales, juego completo.' }],
        'vampire-survivors': [{ text: 'Descargar Vampire Survivors', url: 'https://www.mediafire.com/file/w7r10dc1rb85n4r/Vampi6reSurv1ivors-1.13.109-elamigos.rar/file', readMoreText: '- Versión 1.113.109\n- Todos los DLC' }],
        'unmetal': [{ text: 'Descargar Unmetal', url: 'https://www.mediafire.com/file/7rw1oidswulksof/UCP.rar/file', readMoreText: '-Creator Pack incluído' }],
        'portal': [{ text: 'Descargar Portal', url: 'https://www.mediafire.com/file/keszhjrcvsx5jra/PPC.iso/file' }],
        'portal-prelude': [{ text: 'Descargar Portal: Prelude', url: 'https://www.mediafire.com/file/baty7j3o8cwtj6j/PP08.rar/file', readMoreText: '- Última actualización de la versión original (2008)'}],
        'portal2': [
            { text: 'Descargar Portal 2', url: 'https://www.mediafire.com/file/srerms85g91g4zw/P2PC.iso/file' },
            { text: 'Descargar FIX ONLINE', url: 'https://mega.nz/file/IJcxgYTB#QSuKFAd5K0VyQqbQaKpgus8UBiDA_PeqXUK_2O_kJY4' }
        ],
        'cs16': [{ text: 'Descargar Counter Strike 1.6', url: 'https://www.mediafire.com/file/8g8eh2v1xja2pju/CS16.rar/file', readMoreText: '- Versión NO STEAM' }],
        'REPO': [
			{ text: 'Descargar R.E.P.O', url: 'https://www.mediafire.com/file/lcb75sjs3daatgv' },
			{ text: 'Descargar traducción al español', url: 'https://www.mediafire.com/file/cl385wv3mzw7def/TRADUCCi%25C3%2593N_R.E.P.O_SPA.rar/file', readMoreText: '- Fix online incluído' }],
        'dbfz': [
            { text: 'Descargar Dragon Ball FighterZ', url: 'https://www.mediafire.com/file/6b8kehvf141zxbm/678950.rar/file' },
            { text: 'Descargar Asistente DBFZ', url: 'https://www.mediafire.com/file/o2e5z2mewe4h8mr/DBFZ_Assistant.rar/file', readMoreText: '- Versión 1.31\n- Descargar el asistente solo si quieres:\n· actualizar a los personajes a la versión 1.38\n· optimización\n· solucionar errores de ejecución' }],
        'conan04': [
            { text: 'Descargar Conan (2004)', url: 'https://www.mediafire.com/file/xqlhnvi8pfggukf/C04.rar/file' }],
        'horizon-chase-turbo': [{ text: 'Descargar Horizon Chase Turbo', url: 'https://www.mediafire.com/file/b7g6sh0gj0biort/HCT2018.Www.GamezFull.com.rar/file' }],
        'brotato': [{ text: 'Descargar Brotato', url: 'https://www.mediafire.com/file/5okoinvbimse0h4' }],
        'assassinscreed': [{ text: 'Descargar Assassin\'s Creed', url: 'https://example.com/assassinscreed-download' }],
        'barony': [
            { text: 'Descargar Barony', url: 'https://www.mediafire.com/file/zbdaq9intal95mf/BPC.rar/file', readMoreText: '- Versión 4.3.1' },
            { text: 'Descargar traducción al español', url: 'https://www.mediafire.com/file/sjw4si78r9wy2ae/Barony_Spanish_Mod.rar/file' }],
        'dmc-devil-may-cry': [{ text: 'Descargar DmC: Devil May Cry', url: 'https://rapidshare.co/en/d/QIkPCb4cBC3xXE' }],
        'call-of-duty': [{ text: 'Descargar Call of Duty', url: 'https://www.mediafire.com/file/kfvfuduqbzlhor2/COD.rar/file', readMoreText: '- Inlcuye DLC' }],
        'slendytubbies': [{ text: 'Descargar Slendytubbies', url: 'https://www.mediafire.com/file/55vwtdwziv20gg3/STB.zip/file' }],
        'slendytubbies2': [{ text: 'Descargar Slendytubbies 2', url: 'https://www.mediafire.com/file/13z3i2116t00m0g/' }],
        'slendytubbies3': [
            { text: 'Descargar Slendytubbies 3 (Multijugador)', url: 'https://www.mediafire.com/file_premium/lqhyvva24iuinxc/Slendytubbies_3_Multiplayer_%2528x64%2529.zip/file' },
            { text: 'Descargar Slendytubbies 3 (Campaña)', url: 'https://www.mediafire.com/file/249yxzi56wn17r6/Slendytubbies_3_V1_295_%252864bit%2529.zip/file'}
        ],
        'colin-mcrae-rally': [{ text: 'Descargar Colin Mcrae Rally (1998)', url: 'https://www.mediafire.com/file/bzhwoocqvzm7epe/CMR.rar/file' }],
        'colin-mcrae-rally2': [{ text: 'Descargar Colin Mcrae Rally 2.0', url: 'https://www.mediafire.com/file/kd8zvf1wyr9srp6/CMR2.rar/file' }],
        'colin-mcrae-rally3': [{ text: 'Descargar Colin Mcrae Rally 3', url: 'https://www.mediafire.com/file/nof15apkyr44lql/CMR3.rar/file' }],
        'colin-mcrae-rally4': [{ text: 'Descargar Colin Mcrae Rally 04', url: 'https://www.mediafire.com/file/75l5fvnxof7xxbi/CMR4.rar/file' }],
        'conflict-desert-storm': [{ text: 'Descargar Conflict: Desert Storm', url: 'https://www.mediafire.com/file/5x7es3quv6kyk0n/CDS.rar/file' }],
        'cold-fear': [{ text: 'Descargar Cold Fear', url: 'https://www.mediafire.com/file/yftik1nkpzrvykv/CFPC.rar/file' }],
        'combat-chess': [{ text: 'Descargar Combat Chess', url: 'https://www.mediafire.com/file/8am66wi60bfouzz/CCPC.rar/file' }],
        'combat-task-force': [{ text: 'Descargar Combat: Task Force 121', url: 'https://www.mediafire.com/file/i4resaqoost37ev/CTF.rar/file' }],
        'commandos-sf': [{ text: 'Descargar Commandos: Strike Force', url: 'https://www.mediafire.com/file/h3o7n9boad1hr38/CSF.rar/file' }],
        'raft': [
            { text: 'Descargar Raft', url: 'https://www.mediafire.com/file/ps2j3etzmsl6zqb/Ra6f3t-1.09-elamigos.rar/file' },
            { text: 'Descargar FIX ONLINE', url: 'https://mega.nz/file/amo0yaTZ#rWwRrXVrfDZjiRMUP0DihkxlvzjPYP_SymbgEcmzAoc' }],
        'halo-ce': [{ text: 'Descargar Halo: Combat Evolved', url: 'https://www.mediafire.com/file/jftpybq93hfqy26/HCE_2001.rar/file', readMoreText: '- Versión 1.0.10\n- Multijugador funcional' }],
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
        'tomb-raider': [
            { 
                text: 'Descargar Tomb Raider', 
                parts: [
                    { text: 'Parte 1', url: 'https://www.mediafire.com/file/418clzp3v4p0d6n/TR2013DEPGv1.01.GamezFull.com.part1.rar/file' },
                    { text: 'Parte 2', url: 'https://www.mediafire.com/file/whytecgki5rbyfv/TR2013DEPGv1.01.GamezFull.com.part2.rar/file' },
                    { text: 'Parte 3', url: 'https://www.mediafire.com/file/fq9f3nvr5hc87hv/TR2013DEPGv1.01.GamezFull.com.part3.rar/file' },
                    { text: 'Parte 4', url: 'https://www.mediafire.com/file/btulng3xrnp5yen/TR2013DEPGv1.01.GamezFull.com.part4.rar/file' },
                    { text: 'Parte 5', url: 'https://www.mediafire.com/file/p27sw26lhfsi4ia/TR2013DEPGv1.01.GamezFull.com.part5.rar/file' },
                    { text: 'Parte 6', url: 'https://www.mediafire.com/file/rcuxhlm4mutj34e/TR2013DEPGv1.01.GamezFull.com.part6.rar/file' }
                ]
            }
        ],
        'a-way-out': [
            {
                text: 'Descargar A Way Out',
                parts: [
                    { text: 'Parte 1', url: 'https://drive.usercontent.google.com/download?id=1nmenx7r2xLLADHH5FApeALxOzdilx7ob&export=download&authuser=0' },
                    { text: 'Parte 2', url: 'https://drive.usercontent.google.com/download?id=13A_rsijBPnrA67en07g43XTTFuCZvXRr&export=download&authuser=0' },
                    { text: 'Parte 3', url: 'https://drive.usercontent.google.com/download?id=19HniO96v74pxp2KMGArqibBPMShh1HBx&export=download&authuser=0' },
                    { text: 'Parte 4', url: 'https://drive.usercontent.google.com/download?id=1F2dwf_41MBso52GozK4nqvE9QR5Ltr2G&export=download&authuser=0' },
                    { text: 'Parte 5', url: 'https://drive.usercontent.google.com/download?id=1IxMM28k4aI7fTMapXVsUYzbhB87USPib&export=download&authuser=0' }
                ]
            }
        ],
        'age-of-empires': [
            { text: 'Descargar Age of Empires', url: 'https://www.mediafire.com/file/07q3ddrnk95c436/AOEGE.iso/file', readMoreText: '- Gold Edition' }],
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
        ],
        'life-is-strange': [
            { text: 'Descargar Life is Strange', url: 'https://www.mediafire.com/file/0ccchy21bd51r51/L1f3_1s_Str4ng3.rar/file' }],
        'life-is-strange-before-the-storm': [
            { text: 'Descargar Life is Strange: Before the Storm', url: 'https://www.mediafire.com/file/skhjs6ailng2kya/L1f3_1s_Str4ng3_B3f8r3_th3_St8rm_%25281ncl._F4r3w3ll_3p1s8d3%2529.rar/file' }],
        'life-is-strange-before-the-storm-r': [
            { 
                text: 'Descargar Life is Strange: Before the Storm (REMASTER)', 
                parts: [
                    { text: 'Parte 1', url: 'https://www.mediafire.com/file/q08m7zqfrrj8xl0/LISR2022PG.GamezFull.com.part01.rar/file' },
                    { text: 'Parte 2', url: 'https://www.mediafire.com/file/6gwf56fvycwi7es/LISR2022PG.GamezFull.com.part02.rar/file' },
                    { text: 'Parte 3', url: 'https://www.mediafire.com/file/e6zl1n35re0fzvn/LISR2022PG.GamezFull.com.part03.rar/file' },
                    { text: 'Parte 4', url: 'https://www.mediafire.com/file/zzsigk13vzcheq7/LISR2022PG.GamezFull.com.part04.rar/file' },
                    { text: 'Parte 5', url: 'https://www.mediafire.com/file/3hp4m91r3bnjqxn/LISR2022PG.GamezFull.com.part05.rar/file' },
                    { text: 'Parte 6', url: 'https://www.mediafire.com/file/omxk66qeefqid46/LISR2022PG.GamezFull.com.part06.rar/file' },
                    { text: 'Parte 7', url: 'https://www.mediafire.com/file/ooc8tz325kic4n5/LISR2022PG.GamezFull.com.part07.rar/file' },
                    { text: 'Parte 8', url: 'https://www.mediafire.com/file/6idblgdr3xlhkfy/LISR2022PG.GamezFull.com.part08.rar/file' },
                    { text: 'Parte 9', url: 'https://www.mediafire.com/file/zf0xvja4m8587cy/LISR2022PG.GamezFull.com.part09.rar/file' },
                    { text: 'Parte 10', url: 'https://www.mediafire.com/file/ovfmgsqfwuwjp69/LISR2022PG.GamezFull.com.part10.rar/file' },
                    { text: 'Parte 11', url: 'https://www.mediafire.com/file/m7apb8qe6grcl5j/LISR2022PG.GamezFull.com.part11.rar/file' },
                    { text: 'Parte 12', url: 'https://www.mediafire.com/file/509o3n4mr0rw4cs/LISR2022PG.GamezFull.com.part12.rar/file' },
                    { text: 'Parte 13', url: 'https://www.mediafire.com/file/pic8i7asaaypp4j/LISR2022PG.GamezFull.com.part13.rar/file' },
                    { text: 'Parte 14', url: 'https://www.mediafire.com/file/ojvj03518eoqvfx/LISR2022PG.GamezFull.com.part14.rar/file' },
                    { text: 'Parte 15', url: 'https://www.mediafire.com/file/vrg2w89n6eka8vl/LISR2022PG.GamezFull.com.part15.rar/file' },
                    { text: 'Parte 16', url: 'https://www.mediafire.com/file/v6yyfnmaxe1s1ri/LISR2022PG.GamezFull.com.part16.rar/file' }
                ]
            },
            { text: 'Descargar actualización 07.02.2022', url: 'https://www.mediafire.com/file/3gthu6ukt6ztcqx/Update+07.02.2022.rar/file' }
        ],
        'garrys-mod': [
            { text: 'Descargar Garry\'s Mod', url: 'https://www.mediafire.com/file/53ubzb9a32lcu9u/Garrys_Mod_v1.5.80.0.rar/file', readMoreText: '- Actualizable\n- Página para descargar addons: https://kajar9.wixsite.com/cscheater2/downloads' }]
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
                    readMoreToggle.addEventListener('click', function() {
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
            
            // Código de botón de mochila eliminado
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

            // Código de botón de mochila eliminado

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
    fetch('gallery-index.html')
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



    // Optimización de memoria y limpieza de recursos (ya no necesaria con LRU)
    function cleanupResources() {
        // La política LRU ya maneja el tamaño del cache automáticamente
        // Solo limpiar entradas de acceso huérfanas si existen
        for (const key of imageCacheAccess.keys()) {
            if (!imageCache.has(key)) {
                imageCacheAccess.delete(key);
            }
        }
    }

    // Limpiar recursos ocasionalmente (menos frecuente con LRU) usando setTimeout recursivo
    function scheduleCleanup() {
        setTimeout(() => {
            cleanupResources();
            scheduleCleanup(); // Programar la siguiente limpieza
        }, 600000); // Cada 10 minutos
    }
    scheduleCleanup();

    // Intersection Observer ya es eficiente automáticamente en background
    // No es necesario pausarlo manualmente

    

    // Event listeners para la mochila eliminados

    // Fetch duplicado eliminado - ya se carga arriba

});
