// --- DADOS ESTÁTICOS (NÃO TRADUZÍVEIS) ---
const staticData = {
  socials: [
    { name: "Twitch", user: "Reevbr", url: "https://www.twitch.tv/reevbr", icon: "fab fa-twitch" },
    { name: "Twitter/X", user: "MysticAleatorio", url: "https://x.com/MysticAleatorio", icon: "fab fa-x-twitter" },
    { name: "GitHub", user: "Revempt", url: "https://github.com/Revempt", icon: "fab fa-github" },
    { name: "Steam", user: "RevBr", url: "https://steamcommunity.com/id/RevBr/", icon: "fab fa-steam" },
    { name: "Spotify", user: "Rev", url: "https://open.spotify.com/user/irafasz", icon: "fab fa-spotify" },
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
      { name: "Game of Thrones", image: "imagens/series/game-of-thrones.jpg" }
    ]},

    { icon: "fas fa-film", items: [
      { name: "Interstellar", image: "imagens/movies/interstellar.jpg" },
      { name: "Oppenheimer", image: "imagens/movies/oppenheimer.jpg" },
      { name: "The Dark Knight", image: "imagens/movies/batman-dark-knight.jpg" },
      { name: "Django Livre", image: "imagens/movies/django.jpg" },
      { name: "Top Gun: Maverick", image: "imagens/movies/top-gun.jpg" },
      { name: "Homem Aranha Através do AranhaVerso", image: "imagens/movies/aranhaverso.jpg" }
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

    { icon: "fas fa-book", items: [
      { name: "Solo Leveling", image: "imagens/manhwa/solo-leveling.jpg" },
      { name: "The God of The High School", image: "imagens/manhwa/TGOHS.jpg" },
      { name: "The Beginning After The End", image: "imagens/manhwa/tbate.jpg" },
      { name: "Tower of God", image: "imagens/manhwa/tog.jpg" },
      { name: "Omniscient Reader", image: "imagens/manhwa/orv.jpg" }
    ]},

    { icon: "fas fa-user-ninja", items: [
      { name: "Flash", image: "imagens/characters/Flash.jpg" },
      { name: "Arthur Morgan", image: "imagens/characters/Arthur-Morgan.jpg" },
      { name: "Peter Parker", image: "imagens/characters/parker.jpg" },
      { name: "Izuku Midoriya", image: "imagens/characters/deku.jpg" },
      { name: "Geralt De Rivia", image: "imagens/characters/geralt.jpg" }
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
      { name: "Espresso", image: "imagens/albums/Espresso.jpg" }
    ]},

    { icon: "fas fa-headphones", items: [
      {
        name: "Até Surdo Endoida",
        embed: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/5of17wzqEZnwekVRgQyb8T?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        isEmbed: true
      },
      {
        name: "Pra ter uma crise existencial",
        embed: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/COLE_O_ID_CORRETO_AQUI?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
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
  ],

  menuIcons: { profile: "fas fa-user", affinities: "fas fa-heart", records: "fas fa-book-open", gallery: "fas fa-image" },
  languageLevels: [ "100%", "60%", "30%" ],
  featuredImage: "imagens/teste3.png",

  setup: [
    { value: "AMD Ryzen 5 5600G", icon: "fas fa-microchip" },
    { value: "SONHO", icon: "fas fa-gamepad" },
    { value: "2x8GB DDR4 3200MHz", icon: "fas fa-memory" },
    { value: "MACHENIKE K500 B61", icon: "fas fa-keyboard" },
    { value: "LOGITECH G403 HERO", icon: "fas fa-mouse" },
    { value: "REDRAGON ZEUS X", icon: "fas fa-headset" },
    { value: "SONHO", icon: "fas fa-microphone" },
    { value: "LG 22MP58VQ 75HZ", icon: "fas fa-desktop" },
    { value: "FORTREK SPEED LARGE", icon: "fas fa-mouse-pointer" },
  ]
};
