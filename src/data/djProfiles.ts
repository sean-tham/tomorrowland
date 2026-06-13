export interface DjProfile {
  bio: string;
  spotifySearch: string;
  wikipediaPage?: string;
}

// Wikipedia page slug (for REST API) — only set when disambiguation is needed
// Image fetched at runtime via: https://en.wikipedia.org/api/rest_v1/page/summary/{slug}
export const DJ_PROFILES: Record<string, DjProfile> = {
  "Hardwell": {
    bio: "Robbert van de Corput, known as Hardwell, is a Dutch DJ and producer who held the #1 DJ Mag ranking in 2013 and 2014. A pioneer of big-room house, his 2012 anthem 'Spaceman' defined a generation of festival EDM. After a surprise hiatus, he returned with even harder-hitting productions fusing electro and psytrance.",
    spotifySearch: "Hardwell",
    wikipediaPage: "Hardwell",
  },
  "Armin Van Buuren": {
    bio: "Armin van Buuren is the Dutch trance legend behind 'A State of Trance', the world's most listened-to dance radio show with over 20 million weekly listeners. Five-time #1 DJ in the world, he has been the beating heart of Tomorrowland for over two decades — his closing sets are the stuff of festival legend.",
    spotifySearch: "Armin van Buuren",
    wikipediaPage: "Armin_van_Buuren",
  },
  "Calvin Harris": {
    bio: "Calvin Harris is the Scottish producer and DJ who became the world's highest-paid DJ for four consecutive years. With a string of massive collaborations — Rihanna, Dua Lipa, Sam Smith — he blurs the line between dance and pop, delivering euphoric house sets that transcend genre.",
    spotifySearch: "Calvin Harris",
    wikipediaPage: "Calvin_Harris",
  },
  "Martin Garrix": {
    bio: "Martin Garrix became the youngest DJ ever to hold the #1 position in DJ Mag when 'Animals' exploded in 2013. The Dutch prodigy crafts cinematic progressive house that has headlined the Olympics, UEFA Champions League, and now closes Tomorrowland. He founded the STMPD RCRDS label.",
    spotifySearch: "Martin Garrix",
    wikipediaPage: "Martin_Garrix",
  },
  "Steve Angello": {
    bio: "Steve Angello is a founding member of Swedish House Mafia alongside Sebastian Ingrosso and Axwell. His progressive and tribal house sound is enormous and primal. Since the trio's reunion he has continued as a solo force, bringing raw energy and huge drops to every mainstage he touches.",
    spotifySearch: "Steve Angello",
    wikipediaPage: "Steve_Angello",
  },
  "Sebastian Ingrosso": {
    bio: "Sebastian Ingrosso — one third of Swedish House Mafia — is known for euphoric progressive house anthems like 'Reload' and 'Calling'. A master of melodies that lodge in your brain for weeks, his solo work has pushed deeper into underground house while retaining that irresistible Swedish House Mafia DNA.",
    spotifySearch: "Sebastian Ingrosso",
    wikipediaPage: "Sebastian_Ingrosso",
  },
  "Alok": {
    bio: "Alok Achkar Peres Petrillo is Brazil's biggest DJ export and one of the most-streamed electronic artists on Spotify. His signature 'Brazilian Bass' blends tribal rhythms, afrobeat and progressive house into infectious, globally resonant anthems. He's held a top-5 DJ Mag ranking since 2019.",
    spotifySearch: "Alok",
    wikipediaPage: "Alok_(musician)",
  },
  "Kölsch": {
    bio: "Rune Reelt, performing as Kölsch, is a Danish artist who produces deeply emotional melodic house and techno with a cinematic quality. Named after the famous Cologne beer, his releases on Kompakt Records evoke wide-open Nordic landscapes and introspective late-night feelings.",
    spotifySearch: "Kölsch",
    wikipediaPage: "Kölsch_(musician)",
  },
  "Fisher": {
    bio: "Paul Nicholas Fisher is an Australian DJ and producer whose sweaty, relentless tech house took the world by storm with 'Losing It' in 2018. Known for his irreverent humour and ferocious energy behind the decks, FISHER packs dancefloors with raw, driving bass lines and hypnotic loops.",
    spotifySearch: "FISHER music",
    wikipediaPage: "Fisher_(musician)",
  },
  "Alesso": {
    bio: "Alessandro Lindblad, known as Alesso, is a Swedish progressive house producer who rose to fame through collaborations with Calvin Harris and One Direction. His euphoric, emotionally charged builds and trademark synth melodies make him one of the most recognisable voices in festival EDM.",
    spotifySearch: "Alesso",
    wikipediaPage: "Alesso",
  },
  "Illenium": {
    bio: "Nick Miller, known as Illenium, is a Denver-based artist who pioneered the genre of 'melodic bass' — lush, emotional productions blending future bass, dubstep and indie vocals. Known for deeply personal music about recovery, his live shows are celebrated as some of the most emotionally powerful in dance music.",
    spotifySearch: "Illenium",
    wikipediaPage: "Illenium",
  },
  "Kaskade": {
    bio: "Ryan Raddon, known as Kaskade, is an American DJ and producer from Chicago who helped define the progressive house movement of the 2000s. With a warmly melodic style and a deeply loyal fanbase, Kaskade has headlined every major festival and is renowned for marathon live sets that feel like shared spiritual experiences.",
    spotifySearch: "Kaskade",
    wikipediaPage: "Kaskade",
  },
  "Alan Walker": {
    bio: "Alan Walker is a Norwegian DJ and producer who became a global superstar at age 18 with 'Faded' — one of the most-streamed songs in Spotify history. His signature masked aesthetic and euphoric future bass productions have made him one of the most recognised names in electronic music worldwide.",
    spotifySearch: "Alan Walker",
    wikipediaPage: "Alan_Walker_(music_producer)",
  },
  "Lost Frequencies": {
    bio: "Felix De Laet, known as Lost Frequencies, is a Belgian DJ and producer whose 2014 deep house cover of 'Are You With Me' became a massive European hit. His warm, sun-drenched sound sits between tropical house and nu-disco, earning him a loyal European following and recognition as one of Belgium's biggest musical exports.",
    spotifySearch: "Lost Frequencies",
    wikipediaPage: "Lost_Frequencies",
  },
  "ZHU": {
    bio: "ZHU is the deliberately anonymous American producer whose 2014 debut 'Faded' captivated the world with its smoky, sensual blend of indie electronic, R&B and deep house. Shunning publicity and refusing interviews, he lets his enigmatic, film-noir-tinged productions do the talking.",
    spotifySearch: "ZHU music",
    wikipediaPage: "Zhu_(musician)",
  },
  "Chase & Status": {
    bio: "Chase & Status — Saul Milton and Will Kennard — are the British duo who brought drum & bass to mainstream consciousness. Fusing breakbeat energy with grime, dubstep and hip-hop, their anthems like 'No Problem' and 'Blind Faith' have defined British urban music. Their live shows are high-octane and brutally loud.",
    spotifySearch: "Chase and Status",
    wikipediaPage: "Chase_&_Status",
  },
  "Netsky": {
    bio: "Boris Daenen, known as Netsky, is a Belgian drum & bass artist whose infectious, melodic take on the genre brought it to festival main stages. His lush productions blend jazz, soul and classic British DnB, and his energetic live shows featuring live drums and brass have made him one of the genre's most beloved ambassadors.",
    spotifySearch: "Netsky",
    wikipediaPage: "Netsky_(musician)",
  },
  "Wilkinson": {
    bio: "Oli Wilkinson is a British drum & bass and electronic producer known for soulful, song-driven productions that bridge the gap between club music and pop. His 2013 album 'Lazers Not Included' went gold in the UK, and he continues to push DnB's boundaries with rich arrangements and powerful live performances.",
    spotifySearch: "Wilkinson music",
    wikipediaPage: "Wilkinson_(musician)",
  },
  "Sonny Fodera": {
    bio: "Sonny Fodera is an Australian tech house and house producer who has become a fixture on the world's biggest dance music labels including Defected and Dirtybird. Known for his warm, swinging grooves and infectious vocal hooks, he brings an infectious Aussie positivity to underground dancefloors worldwide.",
    spotifySearch: "Sonny Fodera",
  },
  "John Summit": {
    bio: "John Summit is an American DJ and producer who took the tech house world by storm with 'La Danza' in 2021. A former engineer turned full-time DJ, his sweaty, working-class tech house aesthetic and relentless touring schedule have made him one of the fastest-rising stars in electronic music.",
    spotifySearch: "John Summit",
    wikipediaPage: "John_Summit",
  },
  "Gorgon City": {
    bio: "Gorgon City are a British duo — Kye Gibbon and Matt Robson-Scott — who brought soulful, deep house to festival audiences with anthems like 'Ready For Your Love'. Their sound bridges commercial pop songwriting with proper underground club sensibilities, earning them fans from Ibiza to the Mainstage.",
    spotifySearch: "Gorgon City",
    wikipediaPage: "Gorgon_City",
  },
  "Amelie Lens presents Aura": {
    bio: "Amélie Lens is Belgium's defining techno artist — a relentless force who has conquered Berghain, fabric and every major techno festival. 'Aura' is her deeper, more hypnotic alias, channelling atmospheric, late-night techno that disorients and moves in equal measure. One of the most sought-after DJs in the world.",
    spotifySearch: "Amelie Lens",
    wikipediaPage: "Amélie_Lens",
  },
  "Artbat": {
    bio: "ARTBAT are Ukrainian duo Artur Pryima and Batish — the most exciting force in melodic techno. Their music builds with cinematic tension, layering rolling basslines with euphoric synth arpeggios that feel like an emotional journey across the steppe. Based between Kyiv and Berlin, they signed to Tale Of Us's Afterlife imprint.",
    spotifySearch: "Artbat",
    wikipediaPage: "Artbat",
  },
  "Fideles": {
    bio: "Fideles are an Italian duo who create hauntingly beautiful melodic techno with a distinctly emotional quality. Signed to Tale Of Us's Afterlife label, their slow-burning, hypnotic productions blend organic textures with machine rhythms, creating music that is simultaneously euphoric and melancholic.",
    spotifySearch: "Fideles music",
  },
  "Rezz": {
    bio: "Isabelle Rezazadeh, known as Rezz, is a Canadian DJ and producer who creates a uniquely hypnotic brand of dark techno and electro. With her signature thick-rimmed LED glasses and trance-inducing BPMs that sit unusually low, she has built a cult following who call themselves her 'space mom'.",
    spotifySearch: "Rezz",
    wikipediaPage: "Rezz",
  },
  "Korolova": {
    bio: "Korolova is a Ukrainian melodic house producer and DJ whose evocative, emotional productions have found a home on Paradise (Jamie Jones's label) and Afterlife. Her music blends Eastern European melancholy with warm organic house textures, creating deeply soulful journeys that have made her a rising star.",
    spotifySearch: "Korolova music",
  },
  "Miss Monique": {
    bio: "Monika Jedrzejczak, known as Miss Monique, is a Ukrainian DJ whose blend of progressive trance and melodic techno has made her a festival favourite. Known for marathon live sets and meticulous track selection, her 'Mind Set' radio show reaches millions of listeners and showcases the finest melodic underground sounds.",
    spotifySearch: "Miss Monique",
    wikipediaPage: "Miss_Monique",
  },
  "Indira Paganotto": {
    bio: "Indira Paganotto is a Spanish DJ and producer who has become one of the defining voices of the hard techno movement. Her sets are relentlessly energetic — layers of industrial percussion, distorted basslines and hypnotic synths played at punishing BPMs. Carl Cox, Richie Hawtin and Adam Beyer have all championed her work.",
    spotifySearch: "Indira Paganotto",
  },
  "Sara Landry": {
    bio: "Sara Landry is an American techno DJ who emerged from Austin's underground scene to become one of the genre's most powerful voices. Her sets are aggressive, industrial and deeply physical — a relentless wall of sound that has impressed dance music veterans and converted new techno fans alike across Europe and the US.",
    spotifySearch: "Sara Landry techno",
  },
  "I Hate Models": {
    bio: "I Hate Models is a French industrial techno DJ and producer known for uncompromising, brutalist sets built from acid, EBM and dark electro. A resident of Paris's Rex Club, his techno is confrontational and physically overwhelming — exactly the kind of sound that has made French techno internationally feared and respected.",
    spotifySearch: "I Hate Models",
    wikipediaPage: "I_Hate_Models",
  },
  "Kobosil": {
    bio: "Kobosil is a German industrial techno DJ based in Berlin, known for his association with Ostgut Ton and Berghain. His productions fuse relentless machine rhythms with EBM influences, creating brutal, claustrophobic dancefloor tools that only work at 4am in a dark room with 1000 like-minded people.",
    spotifySearch: "Kobosil",
  },
  "Trym": {
    bio: "Trym is a Norwegian hard techno producer and DJ who has become one of the most in-demand names in the scene. His precisely engineered, high-BPM productions are built for maximum physical impact — punishing kick drums layered with industrial noise and unexpected harmonic details that reward careful listening.",
    spotifySearch: "Trym techno",
  },
  "Massano": {
    bio: "Massano is an Italian melodic techno producer signed to Tale Of Us's Afterlife label. His introspective, emotionally charged productions build with patience and restraint — creating peak moments that feel earned rather than manufactured. He has rapidly become one of the most exciting new voices in European techno.",
    spotifySearch: "Massano music",
  },
  "Agents of Time": {
    bio: "Agents of Time are an Italian duo whose cinematic, narrative-driven melodic techno has made them central figures in Afterlife's universe. Their music tells stories — movements unfold over many minutes, from quiet tension to overwhelming release, with a compositional sophistication rare in club music.",
    spotifySearch: "Agents of Time",
    wikipediaPage: "Agents_of_Time",
  },
  "Nicky Romero": {
    bio: "Nicky Romero is a Dutch DJ and producer best known for his 2012 collaboration with Avicii, 'I Could Be The One'. The founder of Protocol Recordings, he has been a key architect of progressive house and continues to push the genre forward while nurturing emerging talent through his label.",
    spotifySearch: "Nicky Romero",
    wikipediaPage: "Nicky_Romero",
  },
  "Dimitri Vegas & Like Mike": {
    bio: "Belgian brothers Dimitri Vegas and Like Mike have held the #1 position in the DJ Mag Top 100 three times. Their massive electro-house and big-room sound — built for mainstages and stadiums — is undeniably euphoric. As Tomorrowland regulars, they have a special connection with the Belgian crowd.",
    spotifySearch: "Dimitri Vegas Like Mike",
    wikipediaPage: "Dimitri_Vegas_&_Like_Mike",
  },
  "Afrojack b2b R3hab": {
    bio: "Afrojack (Nick van de Wall) is a Dutch DJ who has produced for Beyoncé and David Guetta, while earning his own Grammy. R3hab (Fadil El Ghoul) is a Dutch-Moroccan progressive house specialist. Together in a b2b, this Dutch duo bring enormous production experience and complementary styles to an explosive set.",
    spotifySearch: "Afrojack",
  },
  "Laidback Luke": {
    bio: "Laidback Luke is a Dutch-Filipino DJ and producer who is widely regarded as one of the pioneers of electro house. A mentor figure in the scene, he co-founded Mixmash Records and has collaborated with Steve Aoki, Tiësto and Martin Garrix, while consistently championing up-and-coming talent.",
    spotifySearch: "Laidback Luke",
    wikipediaPage: "Laidback_Luke",
  },
  "Steve Aoki": {
    bio: "Steve Aoki is an American DJ, record producer and entrepreneur who has become one of the most globally recognisable DJs. Known for his high-energy performances (and cake-throwing), his Dim Mak Records label has launched hundreds of artists. He's also a prominent figure in NFTs, gaming and tech ventures.",
    spotifySearch: "Steve Aoki",
    wikipediaPage: "Steve_Aoki",
  },
  "Timmy Trumpet": {
    bio: "Timmy Trumpet is an Australian DJ, producer and classically trained jazz trumpeter who uniquely blends live trumpet performances with big-room EDM. His viral hit 'Freaks' introduced the world to his genre-defying approach. His shows are part electronic concert, part jazz spectacle.",
    spotifySearch: "Timmy Trumpet",
    wikipediaPage: "Timmy_Trumpet",
  },
  "Paris Hilton": {
    bio: "Paris Hilton — socialite, businesswoman and pioneer of personal branding — has been a surprise success as a DJ, with a residency at Amnesia Ibiza and sets at major festivals. Her signature style blends pop-tinged house with accessibility, and she brings genuine enthusiasm and a unique star quality to the decks.",
    spotifySearch: "Paris Hilton",
    wikipediaPage: "Paris_Hilton",
  },
  "James Hype": {
    bio: "James Hype is a British tech house DJ and producer whose UK-influenced grooves have made him one of the most in-demand DJs in the world. Resident at Ibiza's Hi club, his anthemic tracks blend catchy vocal hooks with driving bass — bringing underground credibility to festival-size crowds.",
    spotifySearch: "James Hype",
    wikipediaPage: "James_Hype",
  },
  "HI-LO b2b Layton Giordani": {
    bio: "HI-LO is the alter ego of Oliver Heldens — one of the world's biggest DJs pivoting to hard-edged tech house. Layton Giordani is a New York techno and tech house DJ associated with Drumcode. Together they deliver a raw, relentless b2b that bridges their respective underground and festival worlds.",
    spotifySearch: "HI-LO Oliver Heldens",
  },
  "Sub Zero Project": {
    bio: "Sub Zero Project are a Dutch hardstyle duo known for bringing cinematic scope and emotional depth to the genre. Their productions balance hard-hitting kicks with melodic elements and powerful vocals, making them one of the most respected acts in the hardstyle scene and crowd favourites at every Q-dance and Tomorrowland stage.",
    spotifySearch: "Sub Zero Project",
  },
  "Da Tweekaz": {
    bio: "Da Tweekaz are a Norwegian hardstyle duo — Wiet and Kristian — who are known for infectious, uplifting hardstyle with a playful twist. Mixing ear-worm melodies with hard kicks, their energetic shows and distinctive style have built them a devoted following throughout Europe's hardstyle community.",
    spotifySearch: "Da Tweekaz",
    wikipediaPage: "Da_Tweekaz",
  },
  "Mind Against": {
    bio: "Mind Against are an Italian duo — Federico and Alessandro Fognini — whose profound, emotionally devastating melodic techno has made them one of the defining acts of the Afterlife era. Their slowly evolving, hypnotic sets are masterclasses in tension and release, regularly cited as some of the greatest of their generation.",
    spotifySearch: "Mind Against",
    wikipediaPage: "Mind_Against",
  },
  "LP Giobbi": {
    bio: "LP Giobbi is an American DJ and producer who champions women in electronic music through her FEMME HOUSE initiative. A classically trained pianist, her live shows incorporate keyboard performance with soulful, percussive house music. Her Coachella debut and headline slots have cemented her as one of house music's most exciting new voices.",
    spotifySearch: "LP Giobbi",
  },
  "Chris Lorenzo": {
    bio: "Chris Lorenzo is a British bass house and tech house producer who emerged from Bristol's underground scene. Known for his cheeky, skippy rhythms and distinctly British sense of humour in his music, he co-created the 'house of dad' aesthetic that has made bass house one of the UK's most vital dance music exports.",
    spotifySearch: "Chris Lorenzo",
  },
  "Morten": {
    bio: "MORTEN is a Danish DJ and producer who was mentored by David Guetta and went on to develop the 'Future Rave' sound together with him. Hard-edged, driving and euphoric, Future Rave blends festival EDM energy with elements of French house and techno — a sound built for massive outdoor stages.",
    spotifySearch: "Morten DJ",
    wikipediaPage: "Morten_(DJ)",
  },
};

export function getProfile(artist: string): DjProfile | null {
  return DJ_PROFILES[artist] ?? null;
}

export function getSpotifyUrl(artist: string): string {
  const profile = DJ_PROFILES[artist];
  const searchTerm = profile?.spotifySearch ?? artist;
  return `https://open.spotify.com/search/${encodeURIComponent(searchTerm)}`;
}
