// --- DADOS ESTÁTICOS (NÃO TRADUZÍVEIS) ---
const staticData = {
    socials: [
        { name: "Twitch", user: "Reevbr", url: "https://www.twitch.tv/reevbr", icon: "fab fa-twitch" },
        { name: "Twitter/X", user: "Rev", url: "https://x.com/MysticAleatorio", icon: "fab fa-x-twitter" },
        { name: "GitHub", user: "Revempt", url: "https://github.com/Revempt", icon: "fab fa-github" },
        { name: "Steam", user: "RevBr", url: "https://steamcommunity.com/id/RevBr/", icon: "fab fa-steam" },
        { name: "Spotify", user: "Rev", url: "https://open.spotify.com/user/irafasz", icon: "fab fa-spotify" },
        { name: "Letterboxd", user: "RevBr", url: "https://letterboxd.com/RevBr/", icon: "fas fa-ticket" },
    ],
    affinities: [
        { icon: "fas fa-gamepad", items: [
            { name: "Resident Evil 2", image: "imagens/games/resident-evil-2.jpg" },
            { name: "The Witcher 3", image: "imagens/games/the-witcher-3.jpg" },
            { name: "Red Dead Redemption 2", image: "imagens/games/red-dead-redemption-2.jpg" },
            { name: "Resident Evil 7", image: "imagens/games/resident-evil-7.jpg" },
            { name: "Terraria", image: "imagens/games/terraria.jpg" }
        ]},
        { icon: "fas fa-tv", items: [
            { name: "House, M.D.", image: "imagens/series/house.jpg" },
            { name: "Flash", image: "imagens/series/the-flash.jpg" },
            { name: "Reacher", image: "imagens/series/reacher.jpg" },
            { name: "Stranger Things", image: "imagens/series/stranger-things.jpg" },
            { name: "Game of Thrones", image: "imagens/series/game-of-thrones.jpg" },
            { name: "Fallout", image: "imagens/series/Fallout.jpg" }
        ]},
        { icon: "fas fa-film", items: [
            { name: "Interstellar", image: "imagens/movies/interstellar.jpg" },
            { name: "Oppenheimer", image: "imagens/movies/oppenheimer.jpg" },
            { name: "The Dark Knight", image: "imagens/movies/batman-dark-knight.jpg" },
            { name: "Django Livre", image: "imagens/movies/django.jpg" },
            { name: "Top Gun: Maverick", image: "imagens/movies/top-gun.jpg" },
            { name: "Homem Aranha Através do AranhaVerso", image: "imagens/movies/aranhaverso.jpg" },
            { name: "Forrest Gump", image: "imagens/movies/FGump.jpg" }
        ]},
        { icon: "fas fa-shield-halved", items: [
            { name: "Shingeki no Kyojin", image: "imagens/animes/shingeki.jpg" },
            { name: "Sousou no Frieren", image: "imagens/animes/frieren.jpg" },
            { name: "Dan Dan Dan", image: "imagens/animes/dan.jpg" },
            { name: "Kaiju No 8", image: "imagens/animes/kaiju.jpg" },
            { name: "Castlevania", image: "imagens/animes/castlevania.jpg" }
        ]},
        { icon: "fas fa-book-open", items: [
            { name: "Chainsaw Man", image: "imagens/manga/chainsaw-man.jpg" },
            { name: "Komi-San", image: "imagens/manga/komi-san.jpg" },
            { name: "Boku No Hero", image: "imagens/manga/boku-no-hero.jpg" },
            { name: "Tokyo Ghoul", image: "imagens/manga/tokyo-ghoul.jpg" },
            { name: "Bleach", image: "imagens/manga/bleach.jpg" }
        ]},
        { icon: "fas fa-user-ninja", items: [
            { name: "Flash", image: "imagens/characters/Flash.jpg" },
            { name: "Arthur Morgan", image: "imagens/characters/Arthur-Morgan.jpg" },
            { name: "Peter Parker", image: "imagens/characters/parker.png" },
            { name: "Izuku Midoriya", image: "imagens/characters/deku.jpg" },
            { name: "Geralt De Rivia", image: "imagens/characters/geralt.jpg" },
            { name: "Leon S. Kennedy", image: "imagens/characters/Leon.jpg" }
        ]},
        { icon: "fas fa-music", items: [
            { name: "Time of Dying", image: "imagens/albums/TimeOfDying.jpg" },
            { name: "Duvet", image: "imagens/albums/Duvet.jpg" },
            { name: "Leave It All Behind", image: "imagens/albums/LeaveItAllBehind.jpg" },
            { name: "Falling Down", image: "imagens/albums/FallingDown.jpg" },
            { name: "Never Too Late", image: "imagens/albums/TimeOfDying.jpg" },
            { name: "Castle Of Glass", image: "imagens/albums/CastleOfGlass.jpg" },
            { name: "Enter Sandman", image: "imagens/albums/EnterSandman.jpg" },
            { name: "Let Down", image: "imagens/albums/LetDown.jpg" },
            { name: "New Divide", image: "imagens/albums/NewDivide.jpg" },
            { name: "Never Fade Away", image: "imagens/albums/NeverFadeAway.jpg" },
            { name: "No Surprises", image: "imagens/albums/NoSurprises.jpg" },
            { name: "Its Take Two", image: "imagens/albums/ItsTakeTwo.jpg" },
            { name: "A Litte Death", image: "imagens/albums/ALitteDeath.jpg" },
            { name: "Lonely Day", image: "imagens/albums/LonelyDay.jpg" },
            { name: "Bodies", image: "imagens/albums/Bodies.jpg" },
            { name: "Espresso", image: "imagens/albums/Espresso.jpg" },
            { name: "One More Light", image: "imagens/albums/OML.jpg" },
            { name: "Behind Blue Eyes", image: "imagens/albums/BBE.jpg" }
        ]},
        { icon: "fas fa-headphones", items: [
            {
                name: "Até Surdo Endoida",
                embed: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/5of17wzqEZnwekVRgQyb8T?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
                isEmbed: true
            },
            {
                name: "Pra ter uma crise existencial",
                embed: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/2ipX5iPTfqwwi5qChm85RQ?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
                isEmbed: true
            }
        ]}
    ],
    gallery: [
        "imagens/gallery/gallery1.jpg",
        "imagens/gallery/gallery2.jpg",
        "imagens/gallery/gallery3.jpg",
        "imagens/gallery/gallery4.jpg",
        "imagens/gallery/gallery5.jpg",
        "imagens/gallery/gallery6.png",
        "imagens/gallery/gallery7.png",
        "imagens/gallery/gallery8.png",
    ],

    // ✅ ÍCONES DO MENU (AGORA COM WISHLIST)
    menuIcons: {
        profile: "fas fa-user",
        affinities: "fas fa-heart",
        records: "fas fa-book-open",
        gallery: "fas fa-image",
        wishlist: "fas fa-star",
        diagnostics: "fas fa-stethoscope"
    },

    languageLevels: [ "100%", "60%", "30%" ],
    featuredImage: "imagens/teste3.png",

    setup: [
        { key: "cpu", label: "CPU", value: "AMD Ryzen 5 5600G", icon: "cpu" },
        { key: "gpu", label: "GPU", value: "SONHO", icon: "gpu" },
        { key: "ram", label: "RAM", value: "2x8GB DDR4 3200MHz", icon: "ram" },
        { key: "teclado", label: "Teclado", value: "MACHENIKE K500 B61", icon: "keyboard" },
        { key: "mouse", label: "Mouse", value: "LOGITECH G403 HERO", icon: "mouse" },
        { key: "headset", label: "Headset", value: "REDRAGON ZEUS X", icon: "headset" },
        { key: "microfone", label: "Microfone", value: "SONHO", icon: "microphone" },
        { key: "monitor", label: "Monitor", value: "LG 22MP58VQ 75HZ", icon: "monitor" },
        { key: "mousepad", label: "Mousepad", value: "FORTREK SPEED LARGE", icon: "mousepad" }
    ],

    // ✅ WISHLIST (ESTÁTICO)
    // status: "pendente" | "conquistado"
    wishlistItems: [
        {
            id: "monitor",
            name: "Alienware 34”- AW3423DWF",
            category: "Monitor",
            model: "3440 x 1440 / 165 Hz / QD-OLED",
            price: 6500,
            image: "imagens/wishlist/monitor.png",
            status: "pendente",
            priority: 2,
            note: "Visão dos Deuses"
            
        },
        {
            id: "gpu",
            name: "RTX 5060 TI",
            category: "Placa de vídeo",
            model: "ASUS PRIME RTX 5060 TI 16GB",
            price: 4000,
            image: "imagens/wishlist/gpu.png",
            status: "pendente",
            priority: 1,
            note: "Roda Doom"
        },
        {
            id: "mouse",
            name: "G703",
            category: "Periféricos",
            model: "Logitech G703 Lightspeed",
            price: 400,
            image: "imagens/wishlist/mouse.png",
            status: "pendente",
            priority: 4,
            note: "Pra subir capa"
        },
        {
            id: "teclado",
            name: "Aula F75",
            category: "Periféricos",
            model: "Aula F75 Wireless",
            price: 400,
            image: "imagens/wishlist/teclado.png",
            status: "pendente",
            priority: 5,
            note: "Pra codar liso liso filho"
        },
        {
            id: "microfone",
            name: "A6V",
            category: "Áudio",
            model: "Fifine A6V Ampligame",
            price: 200,
            image: "imagens/wishlist/microfone.png",
            status: "pendente",
            priority: 3,
            note: "Fala baixo nengue"
        },
        {
            id: "headset",
            name: "Zeus X Pro",
            category: "Áudio",
            model: "Redragon H510-Pro Zeus",
            price: 400,
            image: "imagens/wishlist/headset.png",
            status: "pendente",
            priority: 3,
            note: "Pra ouvir rock no talo"
        }
    ]
};

// --- DADOS DE TRADUÇÃO ---
const languageData = {
    pt: {
        profile: {
            title: "Painel de Dados: Rev",
            fields: [
                { label: "Idade", value: "18 Anos", icon: "fa-birthday-cake" },
                { label: "Gênero", value: "Masculino", icon: "fa-venus-mars" },
                { label: "Sexualidade", value: "Hétero", icon: "fa-heart" },
                { label: "Localização", value: "Brasil", icon: "fa-map-marker-alt" }
            ],
            directive: {
                label: "Diretiva Principal",
                value: "Oi, sou o Rev, gosto de todas as áreas da ciência, principalmente astronomia. Também curto tecnologia e jogos. Atualmente estou estudando, mas sempre arrumo tempo pra jogar."
            },
            socialsTitle: "Canais de Comunicação",
            featuredTitle: "Foco Atual",
            featured: {
                title: "Makima",
                subtitle: "Demônio do Controle ",
                description: "Todos os demônios nascem com nomes, e quanto mais esses nomes são temidos, mais poderoso o diabo se torna."
            },
            setupTitle: "Arsenal / Setup",
            setup: [
                { label: "CPU" },
                { label: "GPU" },
                { label: "RAM" },
                { label: "Teclado" },
                { label: "Mouse" },
                { label: "Headset" },
                { label: "Microfone" },
                { label: "Monitor" },
                { label: "Mousepad" }
            ]
        },
        affinities: {
            title: "Logs de Dados: Afinidades",
            categories: [
                { name: "Jogos" },
                { name: "Séries" },
                { name: "Filmes" },
                { name: "Animes" },
                { name: "Mangás" },
                { name: "Personagens" },
                { name: "Músicas" },
                { name: "Playlists" }
            ]
        },
        records: {
            title: "Registros Pessoais",
            items: [
                "Eu tenho 3k+ de horas jogadas de Fortnite.",
                "Meu primeiro console foi um Xbox One",
                "Prefiro jogos com narrativas profundas e que me toquem emocionalmente",
                "Curto Rock alternativo, Metal e vários outros estilos que eu chamo de 'quebrar tudo'",
                "Às vezes escuto a mesma música por dias sem parar",
                "Tenho vontade de aprender a tocar algum instrumento musical",
                "Tenho perda auditiva grave, resumindo, quase surdo",
                "Meu jogo favorito é The Witcher 3: Wild Hunt",
                "É difícil pra mim definir uma música favorita",
                "Gosto de ler mangás e livros",
                "Odeio Funk, fanatismo político e NTR",
                "Pra mim, o tempo é um dos conceitos mais interessantes da física",
                "Acho difícil lidar com pessoas fora do meu escopo social",
                "Eu escolho o meu próprio caminho",
                "Às vezes, é preciso destruir para criar algo novo",
                "Às vezes, temos certeza de estar certos e falhamos mesmo assim",
                "O poder absoluto é um fardo."
            ]
        },
        gallery: { title: "Banco de Memória Visual" },

        // ✅ WISHLIST TRADUZIDA
        wishlist: {
            title: "Wishlist de Upgrade",
            progress: "Progresso",
            total: "Total",
            achieved: "Conquistado",
            pending: "Pendente",
            priority: "Prioridade",
            nextTarget: "Próximo alvo"
        },

        diagnostics: {
            title: "Diagnóstico"
        },

        menu: {
            profile: "Painel",
            affinities: "Afinidades",
            records: "Registros",
            gallery: "Galeria",
            wishlist: "Wishlist",
            diagnostics: "DIAGNÓSTICO"
        },
        status: {
            title: "Status do Sistema",
            chaos: "Entropia",
            connection: "Conexão",
            sync: "Última Sinc.",
            languagesTitle: "Protocolos de Idioma",
            languages: [
                { name: "Português", label: "Nativo" },
                { name: "Inglês", label: "Intermediário" },
                { name: "Espanhol", label: "Básico" }
            ]
        }
    },

    en: {
        profile: {
            title: "Data Dashboard: Rev",
            fields: [
                { label: "Age", value: "18 Years", icon: "fa-birthday-cake" },
                { label: "Gender", value: "Masculine", icon: "fa-venus-mars" },
                { label: "Sexuality", value: "Straight", icon: "fa-heart" },
                { label: "Location", value: "Brazil", icon: "fa-map-marker-alt" }
            ],
            directive: {
                label: "Main Directive",
                value: "Hi, I’m Rev. I like all fields of science, especially astronomy. I’m into technology and gaming too. I’m studying right now, but I always find time to play."
            },
            socialsTitle: "Communication Channels",
            featuredTitle: "Current Focus",
            featured: {
                title: "Makima",
                subtitle: "Control Devil",
                description: "Every demon is born with a name, and the more that name is feared, the stronger the devil grows."
            },
            setupTitle: "Arsenal / Setup",
            setup: [
                { label: "CPU" },
                { label: "GPU" },
                { label: "RAM" },
                { label: "Keyboard" },
                { label: "Mouse" },
                { label: "Headset" },
                { label: "Microphone" },
                { label: "Monitor" },
                { label: "Mousepad" }
            ]
        },
        affinities: {
            title: "Data Logs: Affinities",
            categories: [
                { name: "Games" },
                { name: "Series" },
                { name: "Movies" },
                { name: "Animes" },
                { name: "Mangas" },
                { name: "Characters" },
                { name: "Music" },
                { name: "Playlists" }
            ]
        },
        records: {
            title: "Personal Logs",
            items: [
                "I have over 3,000 hours played in Fortnite",
                "My first console was an Xbox One",
                "I prefer games with deep narratives that hit me emotionally",
                "I’m into alternative rock, metal, and other styles I’d call pure chaos.",
                "Sometimes I listen to the same song for days on repeat",
                "I want to learn how to play a musical instrument",
                "I have severe hearing loss. Basically, I’m almost deaf",
                "My favorite game is The Witcher 3: Wild Hunt",
                "It’s hard for me to choose a single favorite song",
                "I enjoy reading manga and books",
                "I hate funk, political fanaticism, and NTR",
                "To me, time is one of the most fascinating concepts in physics",
                "I find it hard to deal with people outside my social scope",
                "I decide my own path",
                "Sometimes, one must destroy to create something new",
                "Sometimes, we're sure we're right, and we still fail",
                "Ultimate power is a burden"
            ]
        },
        gallery: { title: "Visual Memory Bank" },

        wishlist: {
            title: "Upgrade Wishlist",
            progress: "Progress",
            total: "Total",
            achieved: "Achieved",
            pending: "Pending",
            priority: "Priority",
            nextTarget: "Next target"
        },

        diagnostics: {
            title: "Diagnostics"
        },

        menu: {
            profile: "Dashboard",
            affinities: "Affinities",
            records: "Records",
            gallery: "Gallery",
            wishlist: "Wishlist",
            diagnostics: "DIAGNÓSTICO"
        },
        status: {
            title: "System Status",
            chaos: "Entropy",
            connection: "Connection",
            sync: "Last Sync",
            languagesTitle: "Language Protocols",
            languages: [
                { name: "Portuguese", label: "Native" },
                { name: "English", label: "Intermediate" },
                { name: "Spanish", label: "Basic" }
            ]
        }
    },

    es: {
        profile: {
            title: "Panel de Datos: Rev",
            fields: [
                { label: "Edad", value: "18 Años", icon: "fa-birthday-cake" },
                { label: "Género", value: "Masculino", icon: "fa-venus-mars" },
                { label: "Sexualidad", value: "Hetero", icon: "fa-heart" },
                { label: "Ubicación", value: "Brasil", icon: "fa-map-marker-alt" }
            ],
            directive: {
                label: "Directiva Principal",
                value: "Hola, soy Rev. Me gustan todas las áreas de la ciencia, sobre todo la astronomía. También disfruto la tecnología y los juegos. Estoy estudiando actualmente, pero siempre me hago un tiempo para jugar."
            },
            socialsTitle: "Canales de Comunicación",
            featuredTitle: "Enfoque Actual",
            featured: {
                title: "Makima",
                subtitle: "El Demonio del Control",
                description: "Cada demonio nace con un nombre, y cuanto más se teme ese nombre, más fuerte se vuelve el diablo."
            },
            setupTitle: "Arsenal / Configuración",
            setup: [
                { label: "CPU" },
                { label: "GPU" },
                { label: "RAM" },
                { label: "Teclado" },
                { label: "Ratón" },
                { label: "Auriculares" },
                { label: "Micrófono" },
                { label: "Monitor" },
                { label: "Alfombrilla" }
            ]
        },
        affinities: {
            title: "Registros de Datos: Afinidades",
            categories: [
                { name: "Juegos" },
                { name: "Series" },
                { name: "Películas" },
                { name: "Animes" },
                { name: "Mangas" },
                { name: "Personajes" },
                { name: "Música" },
                { name: "Playlists" }
            ]
        },
        records: {
            title: "Registros Personales",
            items: [
                "Tengo más de 3.000 horas jugadas en Fortnite",
                "Mi primera consola fue una Xbox One",
                "Prefiero juegos con narrativas profundas que me conmuevan emocionalmente",
                "Me gusta el rock alternativo, el metal y otros estilos que yo llamo puro caos",
                "A veces escucho la misma canción durante días",
                "Tengo ganas de aprender a tocar algún instrumento musical",
                "Tengo una pérdida auditiva grave. Básicamente, soy casi sordo",
                "Mi juego favorito es The Witcher 3: Wild Hunt",
                "Me cuesta definir una sola canción favorita",
                "Me gusta leer mangas y libros",
                "Odio el funk, el fanatismo político y el NTR",
                "Para mí, el tiempo es uno de los conceptos más interesantes de la física",
                "Me resulta difícil lidiar con personas fuera de mi ámbito social",
                "Yo decido mi propio camino.",
                "A veces, es necesario destruir para crear algo nuevo.",
                "A veces estamos seguros de tener razón y aun así fallamos..",
                "El poder supremo es una carga."
            ]
        },
        gallery: { title: "Banco de Memoria Visual" },

        wishlist: {
            title: "Lista de Deseos (Upgrade)",
            progress: "Progreso",
            total: "Total",
            achieved: "Conseguido",
            pending: "Pendiente",
            priority: "Prioridad",
            nextTarget: "Próximo objetivo"
        },

        diagnostics: {
            title: "Diagnóstico"
        },

        menu: {
            profile: "Panel",
            affinities: "Afinidades",
            records: "Registros",
            gallery: "Galería",
            wishlist: "Wishlist",
            diagnostics: "DIAGNÓSTICO"
        },
        status: {
            title: "Estado del Sistema",
            chaos: "Entropía",
            connection: "Conexión",
            sync: "Última Sinc.",
            languagesTitle: "Protocolos de Idioma",
            languages: [
                { name: "Portugués", label: "Nativo" },
                { name: "Inglés", label: "Intermedio" },
                { name: "Español", label: "Básico" }
            ]
        }
    },

    ja: {
        profile: {
            title: "データダッシュボード: Rev",
            fields: [
                { label: "年齢", value: "18歳", icon: "fa-birthday-cake" },
                { label: "性別", value: "男性的", icon: "fa-venus-mars" },
                { label: "セクシュアリティ", value: "異性愛者", icon: "fa-heart" },
                { label: "場所", value: "ブラジル", icon: "fa-map-marker-alt" }
            ],
            directive: {
                label: "主な指令",
                value: "はじめまして、Revです。科学全般が好きで、特に天文学に興味があり、テクノロジーゲームも好きで、現在は勉強中ですが、いつもゲームをする時間は確保しています。"
            },
            socialsTitle: "通信チャネル",
            featuredTitle: "現在の焦点",
            featured: {
                title: "マキマ",
                subtitle: "支配の悪魔",
                description: "悪魔は皆、名を持って生まれ、その名への恐怖が増すほど、悪魔は力を増していく。"
            },
            setupTitle: "アーセナル / セットアップ",
            setup: [
                { label: "CPU" },
                { label: "GPU" },
                { label: "RAM" },
                { label: "キーボード" },
                { label: "マウス" },
                { label: "ヘッドセット" },
                { label: "マイク" },
                { label: "モニター" },
                { label: "マウスパッド" }
            ]
        },
        affinities: {
            title: "データログ：親和性",
            categories: [
                { name: "ゲーム" },
                { name: "シリーズ" },
                { name: "映画" },
                { name: "アニメ" },
                { name: "漫画" },
                { name: "キャラクター" },
                { name: "音楽" },
                { name: "プレイリスト" }
            ]
        },
        records: {
            title: "個人的な記録",
            items: [
                "Fortniteを3,000時間以上プレイしています。",
                "初めてのゲーム機はXbox Oneでした。",
                "感情に訴える深い物語のあるゲームが好きです",
                "オルタナティブロックやメタルなど、いわゆる“全部ぶち壊す系”の音楽が好きだ。",
                "同じ曲を何日も繰り返し聴くことがあります",
                "楽器を演奏できるようになりたいと思っています。",
                "重度の聴覚障害があり、ほとんど聞こえない。",
                "一番好きなゲームは『The Witcher 3: Wild Hunt』だ。",
                "一番好きな曲を一つに決めるのは難しい。",
                "漫画や本を読むのが好きだ。",
                "ファンク、政治的狂信、そしてNTRが嫌いだ。",
                "時間は物理学の中でも特に興味深い概念だと思っている。",
                "自分の社会的な範囲外の人と接するのは難しい。",
                "自分の道は自分で決める。",
                "時には、新しいものを創造するために破壊しなければならない。",
                "正しいと確信していても、失敗することはある。",
                "究極の力は負担だ。"
            ]
        },
        gallery: { title: "視覚的記憶バンク" },

        wishlist: {
            title: "アップグレード・ウィッシュリスト",
            progress: "進捗",
            total: "合計",
            achieved: "達成",
            pending: "保留",
            priority: "優先度",
            nextTarget: "次の目標"
        },

        diagnostics: {
            title: "診断"
        },

        menu: {
            profile: "ダッシュボード",
            affinities: "親和性",
            records: "記録",
            gallery: "ギャラリー",
            wishlist: "Wishlist",
            diagnostics: "DIAGNÓSTICO"
        },
        status: {
            title: "システムステータス",
            chaos: "無秩序",
            connection: "接続",
            sync: "最終同期",
            languagesTitle: "言語プロトコル",
            languages: [
                { name: "ポルトガル語", label: "ネイティブ" },
                { name: "英語", label: "中級" },
                { name: "スペイン語", label: "初級" }
            ]
        }
    }
};
