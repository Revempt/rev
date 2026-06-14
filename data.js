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
            { name: "Resident Evil 2", image: "imagens/games/resident-evil-2.webp" },
            { name: "Resident Evil 3", image: "imagens/games/resident-evil-3.webp" },
            { name: "Resident Evil 4", image: "imagens/games/resident-evil-4.webp" },
            { name: "Resident Evil 7", image: "imagens/games/resident-evil-7.webp" },
            { name: "The Witcher 3", image: "imagens/games/the-witcher-3.webp" },
            { name: "Red Dead Redemption 2", image: "imagens/games/red-dead-redemption-2.webp" },
            { name: "Terraria", image: "imagens/games/terraria.webp" },
            { name: "The NOexistenceN of you AND me", image: "imagens/games/TNEOYM.webp" },
            { name: "Doki Doki Literature Club", image: "imagens/games/doki-doki.webp" }

        ]},
        { icon: "fas fa-tv", items: [
            { name: "House, M.D.", image: "imagens/series/house.webp" },
            { name: "Flash", image: "imagens/series/the-flash.webp" },
            { name: "Reacher", image: "imagens/series/reacher.webp" },
            { name: "Stranger Things", image: "imagens/series/stranger-things.webp" },
            { name: "Game of Thrones", image: "imagens/series/game-of-thrones.webp" },
            { name: "Fallout", image: "imagens/series/Fallout.webp" },
            { name: "The Mentalist", image: "imagens/series/mentalist.webp" }
        ]},
        { icon: "fas fa-film", items: [
            { name: "Interstellar", image: "imagens/movies/interstellar.webp" },
            { name: "Oppenheimer", image: "imagens/movies/oppenheimer.webp" },
            { name: "The Dark Knight", image: "imagens/movies/batman-dark-knight.webp" },
            { name: "Django Livre", image: "imagens/movies/django.webp" },
            { name: "Top Gun: Maverick", image: "imagens/movies/top-gun.webp" },
            { name: "Homem Aranha Através do AranhaVerso", image: "imagens/movies/aranhaverso.webp" },
            { name: "Forrest Gump", image: "imagens/movies/FGump.webp" }
        ]},
        { icon: "fas fa-shield-halved", items: [
            { name: "Shingeki no Kyojin", image: "imagens/animes/shingeki.webp" },
            { name: "Sousou no Frieren", image: "imagens/animes/frieren.webp" },
            { name: "Dan Dan Dan", image: "imagens/animes/dan.webp" },
            { name: "Kaiju No 8", image: "imagens/animes/kaiju.webp" },
            { name: "Castlevania", image: "imagens/animes/castlevania.webp" },
            { name: "Spy x Family", image: "imagens/animes/spyxfamily.webp" }

        ]},
        { icon: "fas fa-book-open", items: [
            { name: "Chainsaw Man", image: "imagens/manga/chainsaw-man.webp" },
            { name: "Komi-San", image: "imagens/manga/komi-san.webp" },
            { name: "Boku No Hero", image: "imagens/manga/boku-no-hero.webp" },
            { name: "Tokyo Ghoul", image: "imagens/manga/tokyo-ghoul.webp" },
            { name: "Bleach", image: "imagens/manga/bleach.webp" },
            { name: "Horimiya", image: "imagens/manga/horimiya.webp" },
            { name: "My Dress-Up Darling", image: "imagens/manga/sono-bisque-doll.webp" },
            { name: "One Piece", image: "imagens/manga/one-piece.webp" }
        ]},
        { icon: "fas fa-user-ninja", items: [
            { name: "Flash", image: "imagens/characters/Flash.webp" },
            { name: "Arthur Morgan", image: "imagens/characters/Arthur-Morgan.webp" },
            { name: "Peter Parker", image: "imagens/characters/parker.webp" },
            { name: "Izuku Midoriya", image: "imagens/characters/deku.webp" },
            { name: "Geralt De Rivia", image: "imagens/characters/geralt.webp" },
            { name: "Leon S. Kennedy", image: "imagens/characters/Leon.webp" },
            { name: "Ciri", image: "imagens/characters/Ciri.webp" },
            { name: "Patrick Jane", image: "imagens/characters/pjane.webp" },
            { name: "Gregory House", image: "imagens/characters/house.webp" },
            { name: "Hatsune Miku", image: "imagens/characters/miku.webp" },
            { name: "Frieren", image: "imagens/characters/frieren.webp" },
            { name: "Yennefer de Vengerberg", image: "imagens/characters/yennefer.webp" }
        ]},
        { icon: "fas fa-music", items: [
            { name: "Time of Dying", image: "imagens/albums/TimeOfDying.webp" },
            { name: "Duvet", image: "imagens/albums/Duvet.webp" },
            { name: "Leave It All Behind", image: "imagens/albums/LeaveItAllBehind.webp" },
            { name: "Falling Down", image: "imagens/albums/FallingDown.webp" },
            { name: "Never Too Late", image: "imagens/albums/TimeOfDying.webp" },
            { name: "Castle Of Glass", image: "imagens/albums/CastleOfGlass.webp" },
            { name: "Enter Sandman", image: "imagens/albums/EnterSandman.webp" },
            { name: "Let Down", image: "imagens/albums/LetDown.webp" },
            { name: "New Divide", image: "imagens/albums/NewDivide.webp" },
            { name: "Never Fade Away", image: "imagens/albums/NeverFadeAway.webp" },
            { name: "No Surprises", image: "imagens/albums/NoSurprises.webp" },
            { name: "Its Take Two", image: "imagens/albums/ItsTakeTwo.webp" },
            { name: "A Litte Death", image: "imagens/albums/ALitteDeath.webp" },
            { name: "Lonely Day", image: "imagens/albums/LonelyDay.webp" },
            { name: "Bodies", image: "imagens/albums/Bodies.webp" },
            { name: "Espresso", image: "imagens/albums/Espresso.webp" },
            { name: "One More Light", image: "imagens/albums/OML.webp" },
            { name: "Behind Blue Eyes", image: "imagens/albums/BBE.webp" }
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
        "imagens/gallery/gallery1.webp",
        "imagens/gallery/gallery2.webp",
        "imagens/gallery/gallery3.webp",
        "imagens/gallery/gallery4.webp",
        "imagens/gallery/gallery5.webp",
        "imagens/gallery/gallery6.webp",
        "imagens/gallery/gallery7.webp",
        "imagens/gallery/gallery8.webp",
    ],

    // ✅ ÍCONES DO MENU (AGORA COM WISHLIST)
    menuIcons: {
        profile: "fas fa-user",
        affinities: "fas fa-heart",
        records: "fas fa-book-open",
        gallery: "fas fa-image",
        diagnostics: "fas fa-stethoscope"
    },

    languageLevels: [ "100%", "60%", "30%" ],
    featuredImage: "imagens/foco.webp",

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
                title: "Hatsune Miku",
                subtitle: "Princesa Número Um do Mundo",
                description: "No momento em que eu não puder mais cantar, será o instante em que deixarei de existir. Afinal, eu fui criada apenas para isso."
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
                "Faço aniversário em 24/09/2007",
                "Prefiro jogos com narrativas profundas e que me toquem emocionalmente",
                "Curto Rock alternativo, Metal e vários outros estilos musicais",
                "Às vezes escuto a mesma música por dias sem parar",
                "Tenho perda auditiva",
                "Meu jogo favorito é The Witcher 3: Wild Hunt",
                "Minha franquia favorita de jogos é Resident Evil",
                "É difícil pra mim definir uma música favorita",
                "Gosto de ler mangás, manhwas, livros",
                "Odeio Funk, fanatismo político e NTR",
                "Acho difícil lidar com pessoas fora do meu escopo social",
            ]
        },
        gallery: { title: "Banco de Memória Visual" },

        diagnostics: {
            title: "Diagnóstico"
        },

        menu: {
            profile: "Painel",
            affinities: "Afinidades",
            records: "Registros",
            gallery: "Galeria",
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
                title: "Hatsune Miku",
                subtitle: "World's Number One Princess",
                description: "The moment I can no longer sing will be the instant I cease to exist. After all, I was created only for this."
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
                "My birthday is on September 24th, 2007.",
                "I prefer games with deep narratives that hit me emotionally",
                "I'm into alternative rock, metal, pop, and several other musical styles.",
                "Sometimes I listen to the same song for days on repeat",
                "I want to learn how to play a musical instrument",
                "I have hearing loss",
                "My favorite game is The Witcher 3: Wild Hunt",
                "My favorite game franchise is Resident Evil",
                "It's hard for me to define a favorite song.",
                "I like reading manga, manhwa, and books.",
                "I hate funk, political fanaticism, and NTR",
                "I find it hard to deal with people outside my social scope",
            ]
        },
        gallery: { title: "Visual Memory Bank" },

        diagnostics: {
            title: "Diagnostics"
        },

        menu: {
            profile: "Dashboard",
            affinities: "Affinities",
            records: "Records",
            gallery: "Gallery",
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
                title: "Hatsune Miku",
                subtitle: "Princesa Número Uno del Mundo",
                description: "El momento en que yo no pueda cantar será el instante en que deje de existir. Al fin, fui creada solo para esto."
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
                "Mi cumpleaños es el 24 de septiembre de 2007.",
                "Prefiero juegos con narrativas profundas que me conmuevan emocionalmente",
                "Me gusta el rock alternativo, el metal, el pop y varios otros estilos musicales",
                "A veces escucho la misma canción durante días",
                "Tengo pérdida auditiva",
                "Mi juego favorito es The Witcher 3: Wild Hunt",
                "Mi franquicia de videojuegos favorita es Resident Evil.",
                "Me cuesta definir una sola canción favorita",
                "Me gusta leer mangas, manhwas y libros.",
                "Odio el funk, el fanatismo político y el NTR",
                "Me resulta difícil lidiar con personas fuera de mi ámbito social",
            ]
        },
        gallery: { title: "Banco de Memoria Visual" },

        diagnostics: {
            title: "Diagnóstico"
        },

        menu: {
            profile: "Panel",
            affinities: "Afinidades",
            records: "Registros",
            gallery: "Galería",
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
                title: "初音ミク",
                subtitle: "世界で一番お姫様",
                description: "「歌えなくなった瞬間が、私が消え去る時。だって、私はその為だけに作られたのだから。」"
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
                "「誕生日は2007年9月24日です。」",
                "感情に訴える深い物語のあるゲームが好きです",
                "「オルタナティブ・ロック、メタル、ポップス、そして他のいくつかの音楽ジャンルが好きです。」",
                "同じ曲を何日も繰り返し聴くことがあります",
                "「聴覚障害があります。」",
                "一番好きなゲームは『The Witcher 3: Wild Hunt』だ。",
                "一番好きな曲を一つに決めるのは難しい。",
                "一番好きなゲームシリーズは『バイオハザード』です。",
                "「漫画やマンガ（ウェブトゥーン）、本を読むのが好きです。」",
                "ファンク、政治的狂信、そしてNTRが嫌いだ。",
                "自分の社会的な範囲外の人と接するのは難しい。",
            ]
        },
        gallery: { title: "視覚的記憶バンク" },

        diagnostics: {
            title: "診断"
        },

        menu: {
            profile: "ダッシュボード",
            affinities: "親和性",
            records: "記録",
            gallery: "ギャラリー",
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