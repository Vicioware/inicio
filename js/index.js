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
        'ion-fury': [
            { text: 'Descargar Ion Fury', url: 'https://drive.usercontent.google.com/download?id=1mHna_GXRcEDN6fr4zHoMCXF6Z7phlWOB&authuser=0' }
        ],
        'gta-vc': [
            { text: 'Descargar GTA Vice City', url: 'https://www.mediafire.com/file/negikbx0esjy4zb/GTAVC.iso/file' }
        ],
        'gta-iii': [
            { text: 'Descargar GTA III', url: 'https://www.mediafire.com/file/zdvttk6hzyv1ola/GTA-III.rar/file' }
        ],
        'cuphead': [
            { text: 'Descargar Cuphead', url: 'https://www.mediafire.com/file/z6qrhatejixijzs/CDE.rar/file' }
        ],
        'blood-knights': [
            { text: 'Descargar Blood Knights', url: 'https://www.mediafire.com/file/tz5n0miu2lqe0am/BKPC.7z/file' }
        ],
        'unmetal': [
            { text: 'Descargar Unmetal', url: 'https://www.mediafire.com/file/7rw1oidswulksof/UCP.rar/file' }
        ],
        'halo-ce': [
            { text: 'Descargar Halo: Combat Evolved', url: 'https://www.mediafire.com/file/jftpybq93hfqy26/HCE_2001.rar/file' }
        ],
        'portal': [
            { text: 'Descargar Portal', url: 'https://www.mediafire.com/file/keszhjrcvsx5jra/PPC.iso/file' }
        ],
        'portal2': [
            { text: 'Descargar Portal 2', url: 'https://www.mediafire.com/file/srerms85g91g4zw/P2PC.iso/file' }
        ],
        'killing-floor': [
            { text: 'Descargar Killing Floor', url: 'https://www.mediafire.com/file/zffmwemajvs09dq/KF1.rar/file' }
        ],
        'brotato': [
            { text: 'Descargar Brotato', url: 'https://www.mediafire.com/file/5okoinvbimse0h4' }
        ],
        'vampire-survivors': [
            { text: 'Descargar Vampire Survivors', url: 'https://www.mediafire.com/file/w7r10dc1rb85n4r/Vampi6reSurv1ivors-1.13.109-elamigos.rar/file' }
        ],
        'hct': [
            { text: 'Descargar Horizon Chase Turbo', url: 'https://www.mediafire.com/file/b7g6sh0gj0biort/HCT2018.Www.GamezFull.com.rar/file' }
        ],
        'barony': [
            { text: 'Descargar Barony', url: 'https://www.mediafire.com/file/zbdaq9intal95mf/BPC.rar/file' },
            { text: 'Descargar traducción al español', url: 'https://www.mediafire.com/file/sjw4si78r9wy2ae/Barony_Spanish_Mod.rar/file' }
        ],
        'dmc': [
            { text: 'Descargar DmC: Devil May Cry', url: 'https://rapidshare.co/en/d/QIkPCb4cBC3xXE' }
        ],
        'cod': [
            { text: 'Descargar Call of Duty', url: 'https://www.mediafire.com/file/kfvfuduqbzlhor2/COD.rar/file' }
        ],
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
        'rcrdx': [
            { text: 'Descargar Retro City Rampage DX', url: 'https://mega.nz/file/vuwhTRQL#FdYuUSz8Nr1s7wuROhCb7nJ2Vt-p2qwxKC2QCl18drs' }
        ],
        'into-the-breach': [
            { text: 'Descargar Into the Breach', url: 'https://mega.nz/file/Nd0xlSIZ#28Tp9-1bQG2Wkjs80o-Q8CdBqoJGL2Dh3gmykAwpxtk' }
        ],
        'enter-the-gungeon': [
            { text: 'Descargar Enter the Gungeon', url: 'https://www.mediafire.com/file/rws1g4w546qauae/Enter.the.gun.v2.1.9.rar/file' }
        ],
        'postal2': [
            {
                text: 'Descargar Postal 2',
                parts: [
                    { text: 'Parte 1', url: 'https://www.mediafire.com/file/mrsm05ufxazkehu/P2CPG.GamezFull.com.part1.rar/file' },
                    { text: 'Parte 2', url: 'https://www.mediafire.com/file/2hc0bux8d192hs7/P2CPG.GamezFull.com.part2.rar/file' },
                    { text: 'Parte 3', url: 'https://www.mediafire.com/file/xyy6kp1e2efcikp/P2CPG.GamezFull.com.part3.rar/file' },
                    { text: 'Parte 4', url: 'https://www.mediafire.com/file/xc4xs641yb5f35w/P2CPG.GamezFull.com.part4.rar/file' },
                    { text: 'Parte 5', url: 'https://www.mediafire.com/file/o13xhha8pinivp6/P2CPG.GamezFull.com.part5.rar/file' }
                ]
            }
        ],
        'cod4': [
            {
                text: 'Descargar Call of Duty 4: Modern Warfare',
                parts: [
                    { text: 'Parte 1', url: 'https://drive.usercontent.google.com/download?id=1vR01prco1VXQ1YCEAVvFmTksLxyEvO7H&authuser=0' },
                    { text: 'Parte 2', url: 'https://drive.usercontent.google.com/download?id=1LrtO1-MAxXZu6pzgo6IFFEM5FWFvSjgu&authuser=0' },
                    { text: 'Parte 3', url: 'https://drive.usercontent.google.com/download?id=1du3nxQj5XTuolIm4CSNBWxjz9dQ7PKAx&authuser=0' },
                    { text: 'Parte 4', url: 'https://drive.usercontent.google.com/download?id=1Q96yRNbcfTMU7FlcmIj-LdCCBaX0voti&authuser=0' },
                    { text: 'Parte 5', url: 'https://drive.usercontent.google.com/download?id=1vfUhUkhT4zdYEKYQ_fxSLcAeF-kRuaHX&authuser=0' },
                    { text: 'Parte 6', url: 'https://drive.usercontent.google.com/download?id=1hr4Hx3hKCjdcsXUrEbdYCi5I30b5_5kX&authuser=0' },
                    { text: 'Parte 7', url: 'https://drive.usercontent.google.com/download?id=1Oh9-Csoiu6SBQg-wYhjWyn-JaO_Yzuof&authuser=0' },
                    { text: 'Parte 8', url: 'https://drive.usercontent.google.com/download?id=1UezTWvP5uiIgcj_f1oDJ20YgK16N6Fev&authuser=0' },
                    { text: 'Parte 9', url: 'https://drive.usercontent.google.com/download?id=1s02qBfEGUQPRPl05ipiMSpbSdYY4pgYr&authuser=0' }
                ]
            }
        ],
        'lis': [
            { text: 'Descargar Life is Strange', url: 'https://www.mediafire.com/file/0ccchy21bd51r51/L1f3_1s_Str4ng3.rar/file' }
        ],
        'slendyt': [
            { text: 'Descargar Slendytubbies', url: 'https://www.mediafire.com/file/55vwtdwziv20gg3/STB.zip/file' }
        ],
        'slendyt2': [
            { text: 'Descargar Slendytubbies 2', url: 'https://www.mediafire.com/file/13z3i2116t00m0g/' }
        ],
        'slendyt3': [
            { text: 'Descargar Slendytubbies 3 (Camapaña)', url: 'https://www.mediafire.com/file/249yxzi56wn17r6/Slendytubbies_3_V1_295_%252864bit%2529.zip/file' },
            { text: 'Descargar Slendytubbies 3 (Multijugador)', url: 'https://www.mediafire.com/file_premium/lqhyvva24iuinxc/Slendytubbies_3_Multiplayer_%2528x64%2529.zip/file' }
        ],
        'fnaf': [
            { text: 'Descargar FNAF (ORIGINAL)', url: 'https://www.mediafire.com/file/qa1jza71rr1uj9k/FNAF.exe/file' },
            { text: 'Descargar FNAF (FANDUB ESPAÑOL)', url: 'https://www.mediafire.com/file/k5pj0giyyfdwihe/Five_Nights_at_Freddys_Edicion_Ultra.exe/file' }
        ],
        'fnaf2': [
            { text: 'Descargar FNAF 2 (ORIGINAL)', url: 'https://www.mediafire.com/file/o0523msi4t3q4yk/FNAF2.exe/file' },
            { text: 'Descargar FNAF 2 (FANDUB ESPAÑOL)', url: 'https://www.mediafire.com/file/6nigs93pugt11z2/Five+Nights+at+Freddy%27s+2.exe' }
        ],
        'fnaf3': [
            { text: 'Descargar FNAF 3 (ORIGINAL)', url: 'https://www.mediafire.com/file/4wbu771d733e1f1/FNAF3.exe/file' },
            { text: 'Descargar FNAF 3 (FANDUB ESPAÑOL)', url: 'https://www.mediafire.com/file/1rxjwsgflvdmtq7/Five+Nights+at+Freddy%27s+3.exe' }
        ],
        'fnaf4': [
            { text: 'Descargar FNAF 4: Halloween Edition (ORIGINAL)', url: 'https://www.mediafire.com/file/k9uy7if04x7hjhr/FNAF4-HWE.exe/file' },
            { text: 'Descargar FNAF 4: Halloween Edition (FANDUB ESPAÑOL)', url: 'https://www.mediafire.com/file/hmmszewyab5t7fb/Five_Nights_at_Freddy%25C2%25B4s_4_Halloween_Edition.exe/file' }
        ],
        'fnaf5': [
            { text: 'Descargar FNAF: Sister Location', url: 'https://www.mediafire.com/file/ye20nk6wxgbk8ch/FNAF5.exe/file' }
        ],
        'aoe': [
            { text: 'Descargar Age of Empires', url: 'https://www.mediafire.com/file/07q3ddrnk95c436/AOEGE.iso/file' }
        ],
        'cs16': [
            { text: 'Descargar Counter Strike 1.6 (NO STEAM)', url: 'https://www.mediafire.com/file/8g8eh2v1xja2pju/CS16.rar/file' }
        ],
        'blur': [
            { text: 'Descargar Blur', url: 'https://www.mediafire.com/file/gg1jyyp0grgf8fk/BLR.iso/file' }
        ],
        'conan04': [
            { text: 'Descargar Conan (2004)', url: 'https://www.mediafire.com/file/xqlhnvi8pfggukf/C04.rar/file' }
        ],
        'assassinscreed': [
            {
                text: 'Descargar Assassin\'s Creed',
                parts: [
                    { text: 'Parte 1', url: 'https://rapidshare.co/en/d/vEj0YHJOFHMgF8' },
                    { text: 'Parte 2', url: 'https://rapidshare.co/en/d/trIeSL6rItGv1R' }
                ]
            }
        ],
        'cds': [
            { text: 'Descargar Conflict Desert Storm', url: 'https://www.mediafire.com/file/5x7es3quv6kyk0n/CDS.rar/file' }
        ],
        'cold-fear': [
            { text: 'Descargar Cold Fear', url: 'https://www.mediafire.com/file/yftik1nkpzrvykv/CFPC.rar/file' }
        ],
        'combat-chess': [
            { text: 'Descargar Combat Chess', url: 'https://www.mediafire.com/file/8am66wi60bfouzz/CCPC.rar/file' }
        ],
        'combat-tf121': [
            { text: 'Descargar Combat: Task Force 121', url: 'https://www.mediafire.com/file/i4resaqoost37ev/CTF.rar/file' }
        ],
        'commandos-sf': [
            { text: 'Descargar Commandos: Strike Force', url: 'https://www.mediafire.com/file/h3o7n9boad1hr38/CSF.rar/file' }
        ],
        'stick-fight': [
            { text: 'Descargar Stick Fight: The Game', url: 'https://www.mediafire.com/file/4ob4j8uxu6iauvo/SFtheGv05.06.2019.rar/file' }
        ],
        'lost-planet': [
            { text: 'Descargar Lost Planet', url: 'https://www.mediafire.com/file/br6xop7n9r3cicx/L8st_Pl9n3t_3xtr3m3_C8nd1t18n_C8l8n13s_3d1t18n.rar/file' }
        ],
        'battleblock-theater': [
            { text: 'Descargar BattleBlock Theater', url: 'https://drive.usercontent.google.com/download?id=16ZdlYUXGIYwPEzQHxt49jeuoYPMxKoH_&export=download&authuser=0' }
        ],
        'raft': [
            { text: 'Descargar Raft', url: 'https://www.mediafire.com/file/ps2j3etzmsl6zqb/Ra6f3t-1.09-elamigos.rar/file' }
        ],
        'garrys-mod': [
            { text: 'Descargar Garry\'s Mod', url: 'https://www.mediafire.com/file/53ubzb9a32lcu9u/Garrys_Mod_v1.5.80.0.rar/file' }
        ],
        'gta-sa': [
            { text: 'Descargar GTA: San Andreas', url: 'https://www.mediafire.com/file/mplrdftfwxmd0x0/GTA+San+Andreas+By+Sajord.zip/file' }
        ],
        'dusk': [
            { text: 'Descargar DUSK', url: 'https://www.mediafire.com/file/vch5x45tzoya7w4' }
        ],
        'hrot': [
            { text: 'Descargar HROT', url: 'https://www.mediafire.com/file/x7tg4a8fzsqca9r' }
        ],
        'devil-daggers': [
            { text: 'Descargar Devil Daggers', url: 'https://www.mediafire.com/file/pf2d92ev9ou9gm0/DDPC.rar/file' }
        ],
        'hedon-b': [
            { text: 'Descargar Hedon: Bloodrite', url: 'https://www.mediafire.com/file/vjcw4o3ixc8918r/Hedon.Bloodrite.v2.4.2.zip/file' }
        ],
        'maximum-action': [
            { text: 'Descargar Maximum Action', url: 'https://www.mediafire.com/file/7k89sf8zim6a1pt' }
        ],
        'ziggurat': [
            { text: 'Descargar Ziggurat', url: 'http://go4up.com/dl/431fc3e47f4c/ppt-zigg.iso' }
        ],
        'powerwash-sim': [
            {
                text: 'Descargar PowerWash Simulator',
                parts: [
                    { text: 'Parte 1', url: 'https://rapidshare.co/en/d/hpzZRgK2EhrCnf' },
                    { text: 'Parte 2', url: 'https://rapidshare.co/en/d/f4R4STgh5MjGnk' },
                    { text: 'Parte 3', url: 'https://rapidshare.co/en/d/Yw8ppRdHLPBZ9x' },
                    { text: 'Parte 4', url: 'https://rapidshare.co/en/d/gPfaS53XQ1Snkk' },
                    { text: 'Parte 5', url: 'https://rapidshare.co/en/d/bH8OirQIMAZpTW' }
                ]
            },
            { text: 'Descargar actualización v29.05.2025', url: 'https://www.mediafire.com/file/fnjsbc6ckom2g7a/Pow1erWa6shSi-Update29.05.2025-elamigos.rar/file' }
        ],
        'mafia-ii': [
            {
                text: 'Descargar Mafia II',
                parts: [
                    { text: 'Parte 1', url: 'https://www.mediafire.com/file/b5vlxh753wt68gj/MIIPG.Update5.GamezFull.com.part01.rar/file' },
                    { text: 'Parte 2', url: 'https://www.mediafire.com/file/gyngoc9ctowvvos/MIIPG.Update5.GamezFull.com.part02.rar/file' },
                    { text: 'Parte 3', url: 'https://www.mediafire.com/file/8iilv1kqfy1p79x/MIIPG.Update5.GamezFull.com.part03.rar/file' },
                    { text: 'Parte 4', url: 'https://www.mediafire.com/file/at9zhpebjfkrgmh/MIIPG.Update5.GamezFull.com.part04.rar/file' },
                    { text: 'Parte 5', url: 'https://www.mediafire.com/file/k78bbxldr2307tn/MIIPG.Update5.GamezFull.com.part05.rar/file' },
                    { text: 'Parte 6', url: 'https://www.mediafire.com/file/178yl2dv95cvwop/MIIPG.Update5.GamezFull.com.part06.rar/file' },
                    { text: 'Parte 7', url: 'https://www.mediafire.com/file/xgg8gv1ssymioz4/MIIPG.Update5.GamezFull.com.part07.rar/file' },
                    { text: 'Parte 8', url: 'https://www.mediafire.com/file/5jm37nxrjg5iyeb/MIIPG.Update5.GamezFull.com.part08.rar/file' },
                    { text: 'Parte 9', url: 'https://www.mediafire.com/file/6wi420szsk3pdwv/MIIPG.Update5.GamezFull.com.part09.rar/file' }
                ]
            }
        ],
        'hitman-bm': [
            {
                text: 'Descargar Hitman: Blood Money',
                parts: [
                    { text: 'Parte 1', url: 'https://www.mediafire.com/file/ry55hdmvtrjnte3/HBMPG.GamezFull.part1.rar' },
                    { text: 'Parte 2', url: 'https://www.mediafire.com/file/01fiaobbb3l9qyk/HBMPG.GamezFull.part2.rar' },
                    { text: 'Parte 3', url: 'https://www.mediafire.com/file/angujsh5kmw3br1/HBMPG.GamezFull.part3.rar' },
                    { text: 'Parte 4', url: 'https://www.mediafire.com/file/m1w7c880a26trt4/HBMPG.GamezFull.part4.rar' },
                    { text: 'Parte 5', url: 'https://www.mediafire.com/file/bi5newenlkuyyvj/HBMPG.GamezFull.part5.rar' },
                    { text: 'Parte 6', url: 'https://www.mediafire.com/file/86xkr37ykor433x/HBMPG.GamezFull.part6.rar' }
                ]
            }
        ],
        'hitman-contracts': [
            { text: 'Descargar Hitman: Contracts', url: 'https://drive.usercontent.google.com/download?id=1ZK3wvkBZF95yrIgYUsnHI2aVW4T1jtzY&authuser=0' }
        ],
        'batman-as': [
            { text: 'Descargar Batman: Arkham Asylum', url: 'https://www.mediafire.com/file/13hn1c1digxt061/BAA2011PG1.1.GamezFullCOM.rar/file' }
        ],
        'turok-08': [
            {
                text: 'Descargar Turok (2008)',
                parts: [
                    { text: 'Parte 1', url: 'https://www.mediafire.com/file/wenjq69q8btisr3/T2008PG.GamezFull.com.part01.rar/file' },
                    { text: 'Parte 2', url: 'https://www.mediafire.com/file/lws7djotsqqkeka/T2008PG.GamezFull.com.part02.rar/file' },
                    { text: 'Parte 3', url: 'https://www.mediafire.com/file/pzaz1z8qf46fhxs/T2008PG.GamezFull.com.part03.rar/file' },
                    { text: 'Parte 4', url: 'https://www.mediafire.com/file/xchiz7lwdhm0ymx/T2008PG.GamezFull.com.part04.rar/file' },
                    { text: 'Parte 5', url: 'https://www.mediafire.com/file/u60kdrrnq8vl6or/T2008PG.GamezFull.com.part05.rar/file' },
                    { text: 'Parte 6', url: 'https://www.mediafire.com/file/fs8a05y2277kbwz/T2008PG.GamezFull.com.part06.rar/file' },
                    { text: 'Parte 7', url: 'https://www.mediafire.com/file/a3knseipq5lhqng/T2008PG.GamezFull.com.part07.rar/file' },
                    { text: 'Parte 8', url: 'https://www.mediafire.com/file/stasdgkp4inon2f/T2008PG.GamezFull.com.part08.rar/file' },
                    { text: 'Parte 9', url: 'https://www.mediafire.com/file/3fjrhtx2rwcscig/T2008PG.GamezFull.com.part09.rar/file' },
                    { text: 'Parte 10', url: 'https://www.mediafire.com/file/8pxa4yinqoi0ql9/T2008PG.GamezFull.com.part10.rar/file' },
                    { text: 'Parte 11', url: 'https://www.mediafire.com/file/36ps24je5got4xt/T2008PG.GamezFull.com.part11.rar/file' },
                    { text: 'Parte 12', url: 'https://www.mediafire.com/file/n5fdeycfi5usuo2/T2008PG.GamezFull.com.part12.rar/file' }
                ]
            }
        ],
        'crysis': [
            {
                text: 'Descargar Crysis',
                parts: [
                    { text: 'Parte 1', url: 'https://www.mediafire.com/file/s2gw40w4qsz4hgy/C1PGGOG_GamezFull.part1.rar' },
                    { text: 'Parte 2', url: 'https://www.mediafire.com/file/d77x7ir4aed7mzy/C1PGGOG_GamezFull.part2.rar' },
                    { text: 'Parte 3', url: 'https://www.mediafire.com/file/uqour43opfi8rko/C1PGGOG_GamezFull.part3.rar' },
                    { text: 'Parte 4', url: 'https://www.mediafire.com/file/07lo82a19s524is/C1PGGOG_GamezFull.part4.rar' },
                    { text: 'Parte 5', url: 'https://www.mediafire.com/file/77jx88vw2ej92bp/C1PGGOG_GamezFull.part5.rar' },
                    { text: 'Parte 6', url: 'https://www.mediafire.com/file/45qk97e1x3dd595/C1PGGOG_GamezFull.part6.rar' },
                    { text: 'Parte 7', url: 'https://www.mediafire.com/file/gkywbm79k59d68m/C1PGGOG_GamezFull.part7.rar' },
                    { text: 'Parte 8', url: 'https://www.mediafire.com/file/ntdd9a1qlei28uq/C1PGGOG_GamezFull.part8.rar' }
                ]
            }
        ],
        'hollow-knight-s': [
            { text: 'Descargar Hollow Knight: Silksong', url: 'https://www.mediafire.com/file/f8z87nzyo33fcw6/HKSPG2025.GamezFullCOM.rar/file' },
            { text: 'Descargar actualizaciones', url: 'https://www.mediafire.com/file/33cx3t80r79magl/+Updates2025-HKS.GamezFullCOM.rar/file' }
        ],
        'hollow-knight': [
            { text: 'Descargar Hollow Knight', url: 'https://www.mediafire.com/file/lgpu2jts8wya393/HKPG2021.v1.5.78.GamezFullCOM.rar/file' }
        ],
        'human-fall-flat': [
            { text: 'Descargar Human Fall Flat', url: 'https://www.mediafire.com/file/3xjyx96kxmywdwg/HFFPG2025.24.04.2025.gamezfull.com.rar/file' }
        ],
        'super-bunny-man': [
            { text: 'Descargar Super Bunny Man', url: 'https://www.mediafire.com/file/etg6r2fwaprvsvw' }
        ],
        'alan-wake': [
            {
                text: 'Descargar Alan Wake',
                parts: [
                    { text: 'Parte 1', url: 'https://cdn2.steamgriddb.com/grid/eae7aadd02dfcc93a198d256ec0833ed.jpg' },
                    { text: 'Parte 2', url: 'https://www.mediafire.com/file/y11tgfl4c676v4w/AWCCPG.GFZDCOMORG.part2.rar/file' },
                    { text: 'Parte 3', url: 'https://www.mediafire.com/file/zy0u2koxiix358o/AWCCPG.GFZDCOMORG.part3.rar/file' },
                    { text: 'Parte 4', url: 'https://www.mediafire.com/file/thxyajmkk87epk1/AWCCPG.GFZDCOMORG.part4.rar/file' },
                    { text: 'Parte 5', url: 'https://www.mediafire.com/file/ednd1vn9r99bcf3/AWCCPG.GFZDCOMORG.part5.rar/file' }
                ]
            }
        ],
        'payday-th': [
            { text: 'Descargar PAYDAY: The Heist', url: 'https://www.mediafire.com/file/by5reo6kg1doimo/PD.TH.Wolfpack.v1.12.2..rar/file' }
        ],
        'bioshock': [
            { text: 'Descargar Bioshock', url: 'https://www.mediafire.com/file/h3246t5yl96chd9/B18Sh8ck_1.1.rar/file' }
        ],
        'shaun-white-skate': [
            { text: 'Descargar Shaun White Skateboarding', url: 'https://www.mediafire.com/file/2u0070h2dzd4mz1/Sh4un_Wh1t3_Sk4t3b84rd1ng.rar/file' }
        ],
        'minecraft-bedrock': [
            { text: 'Descargar Minecraft Bedrock Edition', url: 'https://www.mediafire.com/file/gpzlw9oleh6ccc0/M1necr4ft_Bedr8ck_Ed1t18n_v1.21.130.rar/file' }
        ],
        'rayman-rr': [
            { text: 'Descargar Rayman Raving Rabbids', url: 'https://www.mediafire.com/file/am36zltdx0ld5ay/R44ym44n.R44v1ng.R44bb1ds.G8G.rar/file' }
        ],
        'capcom-fc': [
            { text: 'Descargar Capcom Fighting Collection', url: 'https://www.mediafire.com/file/dot121cqf8atzvu/Ca4pc4om_F1ighti1ng_Co4lle3ct1i4n.rar/file' }
        ],
        'scott-pilgrim-vstw': [
            { text: 'Descargar Scott Pilgrim vs. The World', url: 'https://www.mediafire.com/file/4htg3fqykliscuk/v81ces38-sc8tt.p1lgr1m.vs.the.w8rld.rar/file' }
        ],
        'terminator2d': [
            { text: 'Descargar Terminator 2D: NO FATE', url: 'https://www.mediafire.com/file/1z23msazche4rgv/Term1n4t8r_2D_N8_F4te.rar/file' }
        ],
        'lord-of-rings-tq': [
            { text: 'Descargar El Señor de los Anillos: La Conquista', url: 'https://www.mediafire.com/file/igc2e2f1ozm7k8b/3l_S3%25C3%25B10r_d3_l0s_7n3ll0s_L7_C0nqu3st7.rar/file' }
        ],
        'dave-the-diver': [
            { text: 'Descargar Dave the Diver', url: 'https://www.mediafire.com/file/m7a0j89kgqff412/D4v3_th3_D1v3r_1.0.2.1214.rar/file' }
        ],
        'star-wars-bh': [
            { text: 'Descargar Star Wars: Bounty Hunter', url: 'https://www.mediafire.com/file/ihl4mijc3jvul61/St4r_W4rs_B8unty_Hunt3r_R3m4st3r.rar/file' }
        ],
        'freshly-frosted': [
            { text: 'Descargar Freshly Frosted', url: 'https://www.mediafire.com/file/1xk7yiucflhdv8m' }
        ],
        'dread-templar': [
            {
                text: 'Descargar Dread Templar',
                parts: [
                    { text: 'Parte 1', url: 'https://www.mediafire.com/file/7cnafp4jkxop2bb/DTPG.v1.02b.GamezFull.com.part1.rar/file' },
                    { text: 'Parte 2', url: 'https://www.mediafire.com/file/nthejlbv95vdprs/DTPG.v1.02b.GamezFull.com.part2.rar/file' },
                    { text: 'Parte 3', url: 'https://www.mediafire.com/file/2j0zxiwz34g4v4r/DTPG.v1.02b.GamezFull.com.part3.rar/file' }
                ]
            }
        ],
        'ultrakill': [
            { text: 'Descargar Ultrakill', url: 'https://www.mediafire.com/file/1wrw2cu37dgdh18' }
        ],
        'mk1992': [
            { text: 'Descargar Mortal Kombat (1992)', url: 'https://www.mediafire.com/file/ksnpjbs025t3sg4/M8rt4l_K8mb4t_1.rar/file' }
        ],
        'mafia': [
            { text: 'Descargar Mafia', url: 'https://download938.mediafire.com/a90rvcgo9zfgZGhE25SISEPQGbIpUjcay5RAFfYBKMo4pZwyCn7fUgFEnZGjuDR3Je3VVahfvaLq2HG7IjEZu5gb2S208IFT6h0rH0Klbrra93TD044HJKkCSMLNC6mCxUBjY2ZUIqD0oOCFvjczma-S6vaxlb9lO1dSSOYMD-4-gw/h2qiku2rbm1nwu3/M7f17+1.rar' }
        ],
        'mk-deception': [
            { text: 'Descargar Mortal Kombat: Deception', url: 'https://www.mediafire.com/file/aa4wphwzq2lzyal/M8rt4l_K8mb4t_D3c3pti8n.rar/file' }
        ],
        'mk-unchained': [
            { text: 'Descargar Mortal Kombat: Unchained', url: 'https://www.mediafire.com/file/3rb0vmoy7wq6aj6/M8rt4l_K8mb4t_Unch4in3d_3mul4d8.rar/file' }
        ],
        'pokemon-colleccion': [
            { text: 'Descargar Pokemón Colección', url: 'https://www.mediafire.com/file/v1b0s3cy3u6cjeu/P0ketVL1.Y2.rar/file', readMoreText: 'Contiene los siguientes títulos:\n\n- Pokemon Azul\n- Pokemon Rojo\n- Pokemon Verde (Inglés)\n- Pokemon Pinball\n- Pokemon Oro\n- Pokemon Plata\n- Pokemon Cristal\n- Pokemon Amarillo\n- Pokemon Puzzle Challenge\n- Pokemon Trading Card Game\n- Pokemon Rubi\n- Pokemon Zafiro\n- Pokemon Esmeralda\n- Pokemon Rojo Fuego\n- Pokemon Verde Hoja\n- Pokemon Mundo Misterioso\n- Pokemon Pinball RZ\n- Pokemon Stadium 1\n- Pokemon Stadium 2\n- Pokemon Snap\n- Pokemon – Edicion Perla\n- Pokemon – Edicion Diamante\n- Pokemon – Edicion Platino\n- Pokemon – Edicion Blanca\n- Pokemon – Edicion Negra\n- Pokemon – Edicion Blanca 2\n- Pokemon – Edicion Negra 2\n- Pokemon – Edicion Oro HeartGold\n- Pokemon – Edicion Plata SoulSilver\n- Pokemon Mundo Misterioso – Equipo de Rescate Azul\n- Pokemon Mundo Misterioso – Exploradores de la Oscuridad\n- Pokemon Mundo Misterioso – Exploradores del Tiempo\n- Pokemon Mundo Misterioso – Explotadores del Cielo\n- Pokemon Ranger – Sombras de Almia\n- Pokemon Ranger – Trazos de Luz\n- Pokemon Sol\n- Pokemon Luna\n- Pokemon Ultra Sol\n- Pokemon Ultra Luna\n- Pokemon X\n- Pokemon Y\n- Pokemon Rubi Omega\n- Pokemon Zafiro Alfa' }
        ],
        'mario-kart64': [
            { text: 'Descargar Mario Kart 64', url: 'https://www.mediafire.com/file/vgpp7iinb16cqlg/M4ari1o_K4rt_64.rar/file' }
        ],
        'pacman-af': [
            { text: 'Descargar Pac-Man y las Aventuras Fantasmales', url: 'https://www.mediafire.com/file/545l3zrqxwzasq9/Pa4c-M4n_a4nd_th3_Gh8stly_4dv4ntur4s.rar/file' }
        ],
        'real-bout-tn': [
            { text: 'Descargar Real Bout Fatal Fury 2: The Newcomers', url: 'https://www.mediafire.com/file/tp7trp0gcap0fc1/R34L.BOUT.F4T4L.FURY.2.TH3.N3WCOM3RS.Bu1ld.20035572.rar/file' }
        ],
        'beyond-tip2': [
            { text: 'Descargar Beyond the Ice Palace 2', url: 'https://www.mediafire.com/file/wnw3od2keqerakk/b3yond_th3_8c3_p4l4c3_2.rar/file' }
        ],
        'cs-source': [
            { text: 'Descargar Counter-Strike: Source', url: 'https://www.mediafire.com/file/048wx0szmr9w2c1/CSS_v3277112.rar/file' }
        ],
        'flatout-uc': [
            { text: 'Descargar FlatOut: Ultimate Carnage', url: 'https://www.mediafire.com/file/a93n8bpb8k75nl2/Fl4t8ut_Ult1m4t3_C4rn4g3._C8ll3ct8r%2527s_3d1t18n_%25282008%2529.rar/file' }
        ],
        'bridge-portal': [
            { text: 'Descargar Bridge Constructor Portal', url: 'https://www.mediafire.com/file/i4ly0urtgw752pw/Br1dg3_C8nstruct8r_P8rt4l_5.0.rar/file' }
        ],
        'balatro': [
            { text: 'Descargar Balatro', url: 'https://www.mediafire.com/file/3o0i9fqlu6y56q7/B4l4tr8_v1.0.18-FULL.rar/file' }
        ],
        'rayman-origins': [
            { text: 'Descargar Rayman Origins', url: 'https://www.mediafire.com/file/p1x6i26pwymk4vu/R4ym4n_Or8g8ns_1.0.32504.rar/file' }
        ],
        'toy-story2': [
            { text: 'Descargar Toy Story 2: Buzz Lightyear al Rescate!', url: 'https://www.mediafire.com/file/lnl4jgvsrsv4qjj/TOY2.rar/file' }
        ],
        'the-sims-medieval': [
            { text: 'Descargar The Sims Medieval', url: 'https://www.mediafire.com/file/utzej7l3qgqdtvw/Th3_S8ms_M3d83v4l_Ult8m4t3_3d8t8on.rar/file' }
        ],
        'silent-hill': [
            { text: 'Descargar Silent Hill', url: 'https://www.mediafire.com/file/ycl0tmeiggi2m85/S8l3nt_H8ll.rar/file' }
        ],
        'kung-fu-panda': [
            { text: 'Descargar Kung Fu Panda', url: 'https://www.mediafire.com/file/illz8sjyh3n5krn/P4ND4.rar/file' }
        ],
        'half-life-anthology': [
            { text: 'Descargar Half-Life Anthology', url: 'https://www.mediafire.com/file/w98hqba5o99vn1k/H4lf-L1fe_1_4nth8l8gy.rar/file' }
        ],
        'cs-cz': [
            { text: 'Descargar Counter-Strike: Condition Zero', url: 'https://www.mediafire.com/file/4i9wu83r2e6vqxa/C8unt3r_Str1k3_C8nd1t18n_Z3r8.rar/file' }
        ],
        'turok': [
            { text: 'Descargar Turok (1997)', url: 'https://www.mediafire.com/file/opdw4hhthzz58ax/Tur8k_D1n8s4ur_Hunt3r_%2528bu1ld_23.04.2025%2529.rar/file' }
        ],
        'turok2': [
            { text: 'Descargar Turok 2: Seeds of Evil', url: 'https://www.mediafire.com/file/dwds1gv193r439j/Tur8k_2_S33ds_8f_3v1l_R3m4st3r3d_%2528bu1ld_10.05.2023%2529.rar/file' }
        ],
        'turok3': [
            { text: 'Descargar Turok 3: Shadow of Oblivion', url: 'https://www.mediafire.com/file/ye0qix5yn2mzrcy/tur8k_3.rar/file' }
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
        initAlphabetFilter();
    }
    window.initGallery = initGallery;

    function initAlphabetFilter() {
        const sortToggleBtn = document.getElementById('sortToggleBtn');
        const filterToggleBtn = document.getElementById('filterToggleBtn');
        const sortMenu = document.getElementById('sortMenu');
        const filterMenu = document.getElementById('filterMenu');
        const alphabetGrid = document.getElementById('alphabetGrid');

        const sortAscBtn = document.getElementById('sortAscBtn');
        const sortDescBtn = document.getElementById('sortDescBtn');
        const sortRecentBtn = document.getElementById('sortRecentBtn');

        if (!sortToggleBtn || !filterToggleBtn || !sortMenu || !filterMenu || !alphabetGrid) return;

        let activeLetter = null;
        let currentSortOrder = 'recent'; // 'recent', 'asc', 'desc'

        // Helper to close all menus
        function closeAllMenus() {
            sortMenu.classList.remove('is-open');
            filterMenu.classList.remove('is-open');
            sortToggleBtn.classList.remove('active');
            filterToggleBtn.classList.remove('active');
        }

        // Toggle Sort Menu
        sortToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (sortMenu.classList.contains('is-open')) {
                closeAllMenus();
            } else {
                closeAllMenus();
                sortMenu.classList.add('is-open');
                sortMenu.classList.remove('hidden');
                sortToggleBtn.classList.add('active');
            }
        });

        // Toggle Filter Menu
        filterToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (filterMenu.classList.contains('is-open')) {
                closeAllMenus();
            } else {
                closeAllMenus();
                filterMenu.classList.add('is-open');
                filterMenu.classList.remove('hidden');
                filterToggleBtn.classList.add('active');
            }
        });

        // Close menu when clicking outside
        window.addEventListener('click', (e) => {
            if (!sortMenu.contains(e.target) && !filterMenu.contains(e.target) &&
                !sortToggleBtn.contains(e.target) && !filterToggleBtn.contains(e.target)) {
                closeAllMenus();
            }
        });

        // Sorting Logic
        const gameKeys = Object.keys(gameDownloadLinksData);
        // Map gameId -> index (higher index = more recent)
        const gameIndexMap = new Map(gameKeys.map((key, index) => [key, index]));

        function sortGames(order) {
            const galleryContainer = document.querySelector('.gallery-container');
            const items = Array.from(document.querySelectorAll('.game-item'));

            items.sort((a, b) => {
                const idA = a.dataset.gameId;
                const idB = b.dataset.gameId;
                const nameA = a.querySelector('p').textContent.trim().toLowerCase();
                const nameB = b.querySelector('p').textContent.trim().toLowerCase();

                if (order === 'recent') {
                    const indexA = gameIndexMap.has(idA) ? gameIndexMap.get(idA) : -1;
                    const indexB = gameIndexMap.has(idB) ? gameIndexMap.get(idB) : -1;
                    // Descending index
                    return indexB - indexA;
                } else if (order === 'asc') {
                    return nameA.localeCompare(nameB);
                } else if (order === 'desc') {
                    return nameB.localeCompare(nameA);
                }
            });

            // Re-append sorted items
            items.forEach(item => galleryContainer.appendChild(item));

            currentSortOrder = order;

            // Update UI buttons
            [sortAscBtn, sortDescBtn, sortRecentBtn].forEach(btn => btn.classList.remove('active'));
            if (order === 'asc') sortAscBtn.classList.add('active');
            if (order === 'desc') sortDescBtn.classList.add('active');
            if (order === 'recent') sortRecentBtn.classList.add('active');

            updateImageLoadingPriority();
        }

        sortAscBtn.addEventListener('click', () => sortGames('asc'));
        sortDescBtn.addEventListener('click', () => sortGames('desc'));
        sortRecentBtn.addEventListener('click', () => sortGames('recent'));


        // Alphabet Generation and Filtering
        const alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        alphabetGrid.innerHTML = '';

        alphabet.forEach(letter => {
            const btn = document.createElement('button');
            btn.textContent = letter;
            btn.className = 'alphabet-btn';
            btn.onclick = () => {
                const gameItems = document.querySelectorAll('.game-item');

                if (activeLetter === letter) {
                    activeLetter = null;
                    btn.classList.remove('active');
                    // Show all
                    gameItems.forEach(item => item.classList.remove('hidden'));
                } else {
                    document.querySelectorAll('.alphabet-btn').forEach(b => b.classList.remove('active'));
                    activeLetter = letter;
                    btn.classList.add('active');

                    gameItems.forEach(item => {
                        const name = item.querySelector('p').textContent.trim();
                        const firstChar = name.charAt(0).toUpperCase();

                        let match = false;
                        if (letter === '#') {
                            match = !/^[A-Z]/.test(firstChar);
                        } else {
                            match = firstChar === letter;
                        }

                        if (match) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    });
                }
                updateImageLoadingPriority();
            };
            alphabetGrid.appendChild(btn);
        });

        // Initial Sort
        sortGames('recent');
    }


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
