const SAMPLE_SONGS = [
  {
    id: 's1', title: 'Shape of You', artist: 'Ed Sheeran', emoji: '🟧',
    gradient: 'linear-gradient(135deg,#ff6b35,#ff2d78)',
    links: { youtube: 'https://www.youtube.com/watch?v=JGwWNGJdvx8', spotify: 'https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3' },
    lines: [
      { original: "The club isn't the best place to find a lover", korean: '더 클럽 이전 더 베스트 플레이스 투 파인다 러버' },
      { original: "So the bar is where I go", korean: '쏘 더 바 이즈 웨어 아이 고' },
      { original: "Me and my friends at the table doing shots", korean: '미 앤 마이 프렌즈 앳 더 테이블 두잉 샷츠' },
      { original: "Drinking fast and then we talk slow", korean: '드링킹 패스트 앤 덴 위 톡 슬로우' },
      { original: "I'm in love with the shape of you", korean: '아임 인 러브 윋 더 셰잎 오브 유' },
      { original: "We push and pull like a magnet do", korean: '위 푸쉬 앤 풀 라이카 마그넷 두' },
      { original: "Although my heart is falling too", korean: '올도 마이 하트 이즈 폴링 투' },
      { original: "I'm in love with your body", korean: '아임 인 러브 윋 유어 바디' },
    ]
  },
  {
    id: 's2', title: 'Blinding Lights', artist: 'The Weeknd', emoji: '🌃',
    gradient: 'linear-gradient(135deg,#e01f4f,#ff6b35)',
    links: { youtube: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ', spotify: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b' },
    lines: [
      { original: "I've been tryna call", korean: '아이브 빈 트라이나 콜' },
      { original: "I've been on my own for long enough", korean: '아이브 빈 온 마이 오운 포 롱 이너프' },
      { original: "Maybe you can show me how to love, maybe", korean: '메이비 유 캔 쇼 미 하우 투 러브 메이비' },
      { original: "I'm going through withdrawals", korean: '아임 고잉 쓰루 위드로얼즈' },
      { original: "I said ooh, I'm blinding lights", korean: '아이 세드 우~ 아임 블라인딩 라이츠' },
      { original: "No I can't sleep until I feel your touch", korean: '노 아이 캔 슬립 언틸 아이 필 유어 터치' },
    ]
  },
  {
    id: 's3', title: 'Someone Like You', artist: 'Adele', emoji: '💧',
    gradient: 'linear-gradient(135deg,#4a90d9,#1a1a3e)',
    links: { youtube: 'https://www.youtube.com/watch?v=hLQl3WQQoQ0', spotify: 'https://open.spotify.com/track/1zwMYTA5nlNjZxYrvBB2pV' },
    lines: [
      { original: "I heard that you're settled down", korean: '아이 허드 댓 유어 세틀드 다운' },
      { original: "That you found a girl and you're married now", korean: '댓 유 파운다 걸 앤 유어 매리드 나우' },
      { original: "Never mind, I'll find someone like you", korean: '네버마인드 아일 파인드 썸원 라이크 유~' },
      { original: "I wish nothing but the best for you, too", korean: '아이 위쉬 낫띵 벗 더 베스트 포 유 투' },
      { original: "Don't forget me, I beg", korean: '돈 포겟 미 아이 벡' },
      { original: "I remember you said", korean: '아이 리멤버 유 세드' },
      { original: "Sometimes it lasts in love but sometimes it hurts instead", korean: '썸타임즈 잇 래스츠 인 러브 벗 썸타임즈 잇 허츠 인스테드' },
    ]
  },
  {
    id: 's4', title: 'Bohemian Rhapsody', artist: 'Queen', emoji: '👑',
    gradient: 'linear-gradient(135deg,#ffd700,#8b0000)',
    links: { youtube: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', spotify: 'https://open.spotify.com/track/7tFiyTwD0nx5a1eklYtX2J' },
    lines: [
      { original: "Is this the real life? Is this just fantasy?", korean: '이즈 디스 더 리얼 라이프? 이즈 디스 저스트 판타지?' },
      { original: "Caught in a landslide, no escape from reality", korean: '콧 인 어 랜드슬라이드 노 이스케이프 프롬 리얼리티' },
      { original: "Open your eyes, look up to the skies and see", korean: '오픈 유어 아이즈 룩 업 투 더 스카이즈 앤 씨' },
      { original: "I'm just a poor boy, I need no sympathy", korean: '아임 저스트 어 푸어 보이 아이 니드 노 심퍼시' },
      { original: "Easy come, easy go, little high, little low", korean: '이지 컴 이지 고 리틀 하이 리틀 로우' },
      { original: "Mama, just killed a man", korean: '마마~ 저스트 킬드 어 맨' },
      { original: "Put a gun against his head, pulled my trigger now he's dead", korean: '풋 어 건 어겐스트 히즈 헤드 풀드 마이 트리거 나우 히즈 데드' },
    ]
  },
  {
    id: 's5', title: 'Yesterday', artist: 'The Beatles', emoji: '🎸',
    gradient: 'linear-gradient(135deg,#8b6914,#2d1810)',
    links: { youtube: 'https://www.youtube.com/watch?v=NrgmdOz227I', spotify: 'https://open.spotify.com/track/3BQHpFgAp4l80e1XslIjNI' },
    lines: [
      { original: "Yesterday, all my troubles seemed so far away", korean: '예스터데이 올 마이 트러블스 심드 쏘 파 어웨이' },
      { original: "Now it looks as though they're here to stay", korean: '나우 잇 룩스 애즈 도 데어 히어 투 스테이' },
      { original: "Oh, I believe in yesterday", korean: '오~ 아이 빌리브 인 예스터데이' },
      { original: "Suddenly, I'm not half the man I used to be", korean: '서든리 아임 낫 해프 더 맨 아이 유즈드 투 비' },
      { original: "There's a shadow hanging over me", korean: '데어즈 어 섀도우 행잉 오버 미' },
      { original: "Oh, yesterday came suddenly", korean: '오~ 예스터데이 케임 서든리' },
    ]
  },
  {
    id: 's6', title: 'Hotel California', artist: 'Eagles', emoji: '🏨',
    gradient: 'linear-gradient(135deg,#ff8c42,#1a0a2e)',
    links: { youtube: 'https://www.youtube.com/watch?v=09839DpTctU', spotify: 'https://open.spotify.com/track/40riOy7x9W7GXjyGp4pjAv' },
    lines: [
      { original: "On a dark desert highway, cool wind in my hair", korean: '온 어 다크 데저트 하이웨이 쿨 윈드 인 마이 헤어' },
      { original: "Warm smell of colitas rising up through the air", korean: '웜 스멜 오브 콜리타스 라이징 업 쓰루 디 에어' },
      { original: "Welcome to the Hotel California", korean: '웰컴 투 더 호텔 캘리포니아~' },
      { original: "Such a lovely place, such a lovely face", korean: '서치 어 러블리 플레이스 서치 어 러블리 페이스' },
      { original: "You can check out any time you like", korean: '유 캔 체크 아웃 애니 타임 유 라이크' },
      { original: "But you can never leave", korean: '벗 유 캔 네버 리브~' },
    ]
  },
  {
    id: 's7', title: "Don't Stop Believin'", artist: 'Journey', emoji: '🚂',
    gradient: 'linear-gradient(135deg,#4169e1,#ff6347)',
    links: { youtube: 'https://www.youtube.com/watch?v=1k8craCGpgs', spotify: 'https://open.spotify.com/track/4bHsxqR3GMrXTxEPLuK5ue' },
    lines: [
      { original: "Just a small town girl, livin' in a lonely world", korean: '저스트 어 스몰 타운 걸 리빈 인 어 론리 월드' },
      { original: "She took the midnight train goin' anywhere", korean: '쉬 툭 더 미드나잇 트레인 고잉 애니웨어' },
      { original: "Just a city boy, born and raised in South Detroit", korean: '저스트 어 시티 보이 본 앤 레이즈드 인 사우스 디트로잇' },
      { original: "Strangers waiting up and down the boulevard", korean: '스트레인저스 웨이팅 업 앤 다운 더 불러바드' },
      { original: "Don't stop believin', hold on to that feelin'", korean: '돈 스탑 빌리빈~ 홀드 온 투 댓 필링~' },
    ]
  },
  {
    id: 's8', title: 'Rolling in the Deep', artist: 'Adele', emoji: '🔥',
    gradient: 'linear-gradient(135deg,#c0392b,#2c3e50)',
    links: { youtube: 'https://www.youtube.com/watch?v=rYEDA3JcQqw', spotify: 'https://open.spotify.com/track/1c8gk2PeTE04A1pIDH9YMk' },
    lines: [
      { original: "There's a fire starting in my heart", korean: '데어즈 어 파이어 스타팅 인 마이 하트' },
      { original: "Reaching a fever pitch and it's bringing me out the dark", korean: '리칭 어 피버 피치 앤 잇츠 브링잉 미 아웃 더 다크' },
      { original: "We could have had it all", korean: '위 쿠드 해브 해드 잇 올~' },
      { original: "Rolling in the deep", korean: '롤링 인 더 딥~' },
      { original: "You had my heart inside of your hands", korean: '유 해드 마이 하트 인사이드 오브 유어 핸즈' },
      { original: "And you played it to the beat", korean: '앤 유 플레이드 잇 투 더 빗' },
    ]
  },
  {
    id: 's9', title: 'Uptown Funk', artist: 'Bruno Mars', emoji: '🕺',
    gradient: 'linear-gradient(135deg,#ff1744,#ffc107)',
    links: { youtube: 'https://www.youtube.com/watch?v=OPf0YbXqDm0', spotify: 'https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS' },
    lines: [
      { original: "This hit, that ice cold, Michelle Pfeiffer, that white gold", korean: '디스 힛 댓 아이스 콜드 미셸 파이퍼 댓 화이트 골드' },
      { original: "Don't believe me, just watch", korean: '돈 빌리브 미 저스트 워치!' },
      { original: "Uptown funk you up, uptown funk you up", korean: '업타운 펑크 유 업! 업타운 펑크 유 업!' },
      { original: "Saturday night and we in the spot", korean: '새터데이 나잇 앤 위 인 더 스팟' },
      { original: "Girls hit your hallelujah", korean: '걸스 힛 유어 할렐루야~' },
      { original: "Cause uptown funk gon' give it to you", korean: '커즈 업타운 펑크 곤 기빗 투 유' },
    ]
  },
  {
    id: 's10', title: 'Dynamite', artist: 'BTS', emoji: '🧨',
    gradient: 'linear-gradient(135deg,#7b1fa2,#ff6f00)',
    links: { youtube: 'https://www.youtube.com/watch?v=gdZLi9oWNZg', spotify: 'https://open.spotify.com/track/5QDLhrAOJJdNAmCTJ8xMyW' },
    lines: [
      { original: "Cause I, I, I'm in the stars tonight", korean: '커즈 아이 아이 아이 아임 인 더 스타즈 투나잇' },
      { original: "So watch me bring the fire and set the night alight", korean: '쏘 워치 미 브링 더 파이어 앤 셋 더 나잇 얼라잇' },
      { original: "Shining through the city with a little funk and soul", korean: '샤이닝 쓰루 더 시티 윋 어 리틀 펑크 앤 소울' },
      { original: "So I'ma light it up like dynamite", korean: '쏘 아이마 라잇 잇 업 라이크 다이너마이트!' },
      { original: "Dy-na-na-na-na-na-na-na-na-na, life is dynamite", korean: '다이 나나나나나나 나나나 라이프 이즈 다이너마이트!' },
      { original: "Bring a friend, join the crowd, whoever wanna come along", korean: '브링 어 프렌드 조인 더 크라우드 후에버 워나 컴 얼롱' },
    ]
  },
  {
    id: 's11', title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee', emoji: '🌴',
    gradient: 'linear-gradient(135deg,#ff6b35,#ffce00)',
    links: { youtube: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk', spotify: 'https://open.spotify.com/track/6habFhsOp2NvshLv26DqMb' },
    lines: [
      { original: 'Despacito, quiero respirar tu cuello despacito', korean: '데스파시또~ 끼에로 레스피라르 뚜 꾸에요 데스파시또' },
      { original: 'Deja que te diga cosas al oído', korean: '데하 게 떼 디가 꼬사스 알 오이도' },
      { original: 'Para que te acuerdes si no estás conmigo', korean: '빠라 게 떼 아꾸에르데스 시 노 에스따스 꼰미고' },
      { original: 'Despacito, quiero desnudarte a besos despacito', korean: '데스파시또~ 끼에로 데스누다르떼 아 베소스 데스파시또' },
      { original: 'Firmo en las paredes de tu laberinto', korean: '피르모 엔 라스 빠레데스 데 뚜 라베린또' },
      { original: 'Y hacer de tu cuerpo todo un manuscrito', korean: '이 아세르 데 뚜 꾸에르뽀 또도 운 마누스끄리또' },
      { original: 'Sube, sube, sube, sube, sube', korean: '수베 수베 수베 수베 수베~' },
      { original: 'Pasito a pasito, suave suavecito', korean: '빠시또 아 빠시또~ 수아베 수아베시또~' },
      { original: "Nos vamos pegando poquito a poquito", korean: '노스 바모스 뻬간도 뽀끼또 아 뽀끼또' },
    ]
  },
  {
    id: 's12', title: 'First Love (初恋)', artist: '宇多田ヒカル (Utada Hikaru)', emoji: '🌸',
    gradient: 'linear-gradient(135deg,#f8b4c8,#6a0dad)',
    links: { youtube: 'https://www.youtube.com/watch?v=o1sUaVJUeB0', spotify: 'https://open.spotify.com/track/7nYOFJyqFYMJ0xjBfEaJNz' },
    lines: [
      { original: '最後のキスはタバコの flavor がした', korean: '사이고노 키스와 타바코노 후레이바가 시타' },
      { original: 'ニガくて切ない香り', korean: '니가쿠테 세츠나이 카오리' },
      { original: '明日の今頃には', korean: '아시타노 이마고로니와' },
      { original: 'あなたはどこにいるんだろう', korean: '아나타와 도코니 이룬다로~' },
      { original: '誰を想ってるんだろう', korean: '다레오 오못테룬다로~' },
      { original: 'You are always gonna be my love', korean: '유 아 올웨이즈 고나 비 마이 러브' },
      { original: 'いつか誰かとまた恋に落ちても', korean: '이츠카 다레카토 마타 코이니 오치테모' },
      { original: "I'll remember to love, you taught me how", korean: '아일 리멤버 투 러브 유 톳 미 하우' },
      { original: 'You are always gonna be the one', korean: '유 아 올웨이즈 고나 비 더 원' },
      { original: '今はまだ悲しい love song', korean: '이마와 마다 카나시이 러브 쏭~' },
      { original: '新しい歌 歌えるまで', korean: '아타라시이 우타 우타에루 마데' },
    ]
  },
  {
    id: 's13', title: '她说 (Tā Shuō)', artist: 'JJ Lin (林俊杰)', emoji: '🏮',
    gradient: 'linear-gradient(135deg,#c0392b,#f1c40f)',
    links: { youtube: 'https://www.youtube.com/watch?v=vUv8coct8Yk', spotify: 'https://open.spotify.com/track/632VyMrvhsHIsO4zq9khts' },
    lines: [
      { original: '等不到天黑 烟火不会太完美', korean: '덩부따오 티엔헤이 옌훠 부후이 타이 완메이' },
      { original: '回忆烧成灰 还是等不到结尾', korean: '후이이 샤오청후이 하이스 덩부따오 지에웨이' },
      { original: '她曾说的无所谓', korean: '타 쩡슈오더 우쒀웨이' },
      { original: '我怕一天一天被摧毁', korean: '워 파 이티엔 이티엔 베이 추이후이' },
      { original: '等不到天黑 不敢凋谢的花蕾', korean: '덩부따오 티엔헤이 부간 디아오시에더 화레이' },
      { original: '绿叶在跟随 放开刺痛的滋味', korean: '뤼예 짜이 겐쒀이 팡카이 츠통더 쯔웨이' },
      { original: '今后不再怕天明', korean: '진호우 부짜이 파 티엔밍' },
      { original: '我想只是害怕清醒', korean: '워 시앙 즈스 하이파 칭싱' },
    ]
  },
  {
    id: 's14', title: '좋은 날 (Good Day)', artist: 'IU (아이유)', emoji: '☀️',
    gradient: 'linear-gradient(135deg,#ff9a9e,#fad0c4)',
    links: { youtube: 'https://www.youtube.com/watch?v=jeqdYqsrsA0', spotify: 'https://open.spotify.com/track/4TXytrRMEqMgIeMm7aBD3E' },
    lines: [
      { original: '좋은 날 좋은 날 좋은 날', korean: 'jo-eun nal jo-eun nal jo-eun nal' },
      { original: '어쩜 이렇게 하늘은 맑은 건지', korean: 'eo-jjeom i-reo-ke ha-neu-reun mal-geun geon-ji' },
      { original: '그냥 모든 게 좋은 날', korean: 'geu-nyang mo-deun ge jo-eun nal' },
      { original: '이런 날엔 그런 거야', korean: 'i-reon na-ren geu-reon geo-ya' },
      { original: '아무 이유 없이 기분이 좋은 날', korean: 'a-mu i-yu eop-si gi-bu-ni jo-eun nal' },
      { original: '나는 오늘따라 뭔가 좋은 일이 생길 것 같은', korean: 'na-neun o-neul-tta-ra mwon-ga jo-eun i-ri saeng-gil geot ga-teun' },
    ]
  },
  {
    id: 's15', title: '봄날 (Spring Day)', artist: 'BTS (방탄소년단)', emoji: '🌷',
    gradient: 'linear-gradient(135deg,#a8edea,#fed6e3)',
    links: { youtube: 'https://www.youtube.com/watch?v=xEeFrLSkMm8', spotify: 'https://open.spotify.com/track/0LsBaAdFzjSGKRime0wAAo' },
    lines: [
      { original: '보고 싶다 이렇게 말하니까 더 보고 싶다', korean: 'bo-go sip-da i-reo-ke mal-ha-ni-kka deo bo-go sip-da' },
      { original: '너희 집 앞 골목길에 접어들면', korean: 'neo-hui jip ap gol-mok-gi-re jeo-beo-deul-myeon' },
      { original: '허전한 네 방에 니 냄새가 살아', korean: 'heo-jeon-han ne bang-e ni naem-sae-ga sa-ra' },
      { original: '눈꽃이 떨어져요 또 조금씩 멀어져요', korean: 'nun-kko-chi tteo-reo-jyeo-yo tto jo-geum-ssik meo-reo-jyeo-yo' },
      { original: '보고 싶다 보고 싶다', korean: 'bo-go sip-da bo-go sip-da' },
      { original: '얼마나 기다려야 또 몇 밤을 더 새워야', korean: 'eol-ma-na gi-da-ryeo-ya tto myeot ba-meul deo sae-wo-ya' },
    ]
  },
  {
    id: 's16', title: '하루하루 (Day by Day)', artist: 'BIGBANG', emoji: '💔',
    gradient: 'linear-gradient(135deg,#434343,#000000)',
    links: { youtube: 'https://www.youtube.com/watch?v=MzCbEdtNbJ0', spotify: 'https://open.spotify.com/track/3LPFnUoVjJMRGbKFxnBq5C' },
    lines: [
      { original: '하루하루 무너져가 내 모습이 싫어', korean: 'ha-ru-ha-ru mu-neo-jyeo-ga nae mo-seu-bi si-reo' },
      { original: '이별이란 말 앞에 무너져 내려', korean: 'i-byeo-ri-ran mal a-pe mu-neo-jyeo nae-ryeo' },
      { original: '눈물조차 마른 나를 보고', korean: 'nun-mul-jo-cha ma-reun na-reul bo-go' },
      { original: '기억해줘 나의 마지막 모습을', korean: 'gi-eok-hae-jweo na-ui ma-ji-mak mo-seu-beul' },
      { original: '사랑했어 너를 사랑했어', korean: 'sa-rang-haess-eo neo-reul sa-rang-haess-eo' },
    ]
  },
  {
    id: 's17', title: 'Gee', artist: "Girls' Generation (소녀시대)", emoji: '💗',
    gradient: 'linear-gradient(135deg,#ff758c,#ff7eb3)',
    links: { youtube: 'https://www.youtube.com/watch?v=U7mPqycQ0tQ', spotify: 'https://open.spotify.com/track/3EZT0VaW7FLR1cNwBD2cXY' },
    lines: [
      { original: 'Gee gee gee gee baby baby baby', korean: 'ji ji ji ji bei-bi bei-bi bei-bi' },
      { original: '어쩜 좋아 너무나 좋아', korean: 'eo-jjeom jo-a neo-mu-na jo-a' },
      { original: '눈이 부셔 부셔 부셔', korean: 'nu-ni bu-syeo bu-syeo bu-syeo' },
      { original: '너무 반짝반짝 눈이 부셔', korean: 'neo-mu ban-jjak-ban-jjak nu-ni bu-syeo' },
      { original: '숨도 못 쉬겠어 떨리는 떨리는', korean: 'sum-do mot swi-gess-eo tteol-ri-neun tteol-ri-neun' },
      { original: '아직도 믿기지가 않아', korean: 'a-jik-do mit-gi-ji-ga an-a' },
    ]
  },
  {
    id: 's18', title: '강남스타일 (Gangnam Style)', artist: 'PSY (싸이)', emoji: '🕶️',
    gradient: 'linear-gradient(135deg,#f7971e,#ffd200)',
    links: { youtube: 'https://www.youtube.com/watch?v=9bZkp7q19f0', spotify: 'https://open.spotify.com/track/03UrZgBINjbmMagKeENGnf' },
    lines: [
      { original: '오빤 강남스타일', korean: 'op-pan gang-nam-seu-ta-il' },
      { original: '낮에는 따사로운 인간적인 여자', korean: 'na-je-neun tta-sa-ro-un in-gan-jeo-gin yeo-ja' },
      { original: '커피 한잔의 여유를 아는 품격 있는 여자', korean: 'keo-pi han-ja-nui yeo-yu-reul a-neun pum-gyeok in-neun yeo-ja' },
      { original: '아름다워 사랑스러워', korean: 'a-reum-da-wo sa-rang-seu-reo-wo' },
      { original: '그래 너 hey 그래 바로 너 hey', korean: 'geu-rae neo hey geu-rae ba-ro neo hey' },
      { original: '오빤 강남스타일 에 섹시레이디', korean: 'op-pan gang-nam-seu-ta-il e sek-si-re-i-di' },
    ]
  },
  {
    id: 's19', title: 'Blueming', artist: 'IU (아이유)', emoji: '💙',
    gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    links: { youtube: 'https://www.youtube.com/watch?v=D1PvIWdJ8xo', spotify: 'https://open.spotify.com/track/4Dr2hJ1lkGMi0oEFf5xyKo' },
    lines: [
      { original: '오늘 밤 너에게 가도 될까', korean: 'o-neul bam neo-e-ge ga-do dwel-kka' },
      { original: '우리 사이 거리를 알면서도', korean: 'u-ri sa-i geo-ri-reul al-myeon-seo-do' },
      { original: '내 맘은 blueming', korean: 'nae ma-meun blueming~' },
      { original: '혼자 피는 꽃은 없듯이', korean: 'hon-ja pi-neun kko-cheun eop-deu-si' },
      { original: 'I bloom just for you', korean: 'I bloom just for you~' },
    ]
  },
  {
    id: 's20', title: '뚜두뚜두 (DDU-DU DDU-DU)', artist: 'BLACKPINK', emoji: '🖤',
    gradient: 'linear-gradient(135deg,#ff0084,#33001b)',
    links: { youtube: 'https://www.youtube.com/watch?v=IHNzOHi8sJs', spotify: 'https://open.spotify.com/track/4fSIb4S200FBHBuCNMnFE8' },
    lines: [
      { original: '뚜두뚜두 뚜두뚜두', korean: 'ttu-du-ttu-du ttu-du-ttu-du' },
      { original: '이제 달려야 해 어딜 가든', korean: 'i-je dal-ryeo-ya hae eo-dil ga-deun' },
      { original: '넌 날 감당 못해', korean: 'neon nal gam-dang mot-hae' },
      { original: '내가 예뻐 예뻐 예뻐서', korean: 'nae-ga ye-ppeo ye-ppeo ye-ppeo-seo' },
      { original: '놀란 거지 거지 거지', korean: 'nol-lan geo-ji geo-ji geo-ji' },
      { original: '날 밟고 올라가', korean: 'nal balp-go ol-la-ga' },
    ]
  },
  {
    id: 's21', title: '으르렁 (Growl)', artist: 'EXO', emoji: '🐺',
    gradient: 'linear-gradient(135deg,#2c3e50,#e74c3c)',
    links: { youtube: 'https://www.youtube.com/watch?v=I3dezFzsNss', spotify: 'https://open.spotify.com/track/3EoMBwE3pqFPBFDNULJwEf' },
    lines: [
      { original: '나의 사냥감이 되어', korean: 'na-ui sa-nyang-ga-mi doe-eo' },
      { original: '네가 좋다고 으르렁 으르렁 으르렁 대', korean: 'ne-ga jo-ta-go eu-reu-reong eu-reu-reong eu-reu-reong dae' },
      { original: '네가 예쁘다고 으르렁 으르렁 으르렁 대', korean: 'ne-ga ye-ppeu-da-go eu-reu-reong eu-reu-reong eu-reu-reong dae' },
      { original: '자꾸만 눈이 가 네가 싫은데', korean: 'ja-kku-man nu-ni ga ne-ga si-reun-de' },
      { original: '이건 분명 위험해', korean: 'i-geon bun-myeong wi-heom-hae' },
    ]
  },
  {
    id: 's22', title: '서른 즈음에 (Around Thirty)', artist: '김광석 (Kim Kwang-seok)', emoji: '🍂',
    gradient: 'linear-gradient(135deg,#8b6914,#3e2723)',
    links: { youtube: 'https://www.youtube.com/watch?v=B0_-SquSqis', spotify: 'https://open.spotify.com/track/6yEi2VUlLH2BlXPaR5FZUQ' },
    lines: [
      { original: '서른 즈음에 나는 왜 이렇게', korean: 'seo-reun jeu-eum-e na-neun wae i-reo-ke' },
      { original: '작은 일에도 분개하고', korean: 'ja-geun i-re-do bun-gae-ha-go' },
      { original: '별것 아닌 일에 화를 내는가', korean: 'byeol-geot a-nin i-re hwa-reul nae-neun-ga' },
      { original: '두려운 마음으로 겨울을 보내고', korean: 'du-ryeo-un ma-eu-meu-ro gyeo-u-reul bo-nae-go' },
      { original: '또 허전한 봄을 맞이하네', korean: 'tto heo-jeon-han bo-meul ma-ji-ha-ne' },
    ]
  },
  {
    id: 's23', title: '200%', artist: 'AKMU (악동뮤지션)', emoji: '🎈',
    gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)',
    links: { youtube: 'https://www.youtube.com/watch?v=0Oi8jDMvd_o', spotify: 'https://open.spotify.com/track/4fSIb4S200FBHBuCNMnFE8' },
    lines: [
      { original: '지금 이 순간 매 초가 아까워', korean: 'ji-geum i sun-gan mae cho-ga ak-ka-wo' },
      { original: '시간이 너무 빨리 가', korean: 'si-ga-ni neo-mu ppal-li ga' },
      { original: '네가 너무 좋아 200%', korean: 'ne-ga neo-mu jo-a 200%' },
      { original: '하루가 다 가기 전에', korean: 'ha-ru-ga da ga-gi jeon-e' },
      { original: '너에게 달려갈 거야', korean: 'neo-e-ge dal-ryeo-gal geo-ya' },
    ]
  },

  // ===== 🇯🇵 JAPANESE =====
  {
    id: 's24', title: '夜に駆ける (Yoru ni Kakeru)', artist: 'YOASOBI', emoji: '🌙',
    gradient: 'linear-gradient(135deg,#1a1a2e,#e94560)',
    links: { youtube: 'https://www.youtube.com/watch?v=x8VYWazR5mE', spotify: 'https://open.spotify.com/track/5qMqWMKl4m7BZZR0R8XSCK' },
    lines: [
      { original: '沈むように 溶けていくように', korean: '시즈무요니 토케테이쿠요니' },
      { original: '二人だけの空が広がる', korean: '후타리다케노 소라가 히로가루' },
      { original: '今宵も夢の中で会いたいと', korean: '코요이모 유메노 나카데 아이타이토' },
      { original: '願いながら眠れない', korean: '네가이나가라 네무레나이' },
      { original: 'あなたに逢いたくて', korean: '아나타니 아이타쿠테' },
      { original: '夜に駆けていく', korean: '요루니 카케테이쿠' },
    ]
  },
  {
    id: 's25', title: 'Lemon', artist: '米津玄師 (Kenshi Yonezu)', emoji: '🍋',
    gradient: 'linear-gradient(135deg,#f7971e,#ffd200)',
    links: { youtube: 'https://www.youtube.com/watch?v=SX_ViT4Ra7k', spotify: 'https://open.spotify.com/track/3RauEVgRgj1IuWdJ9fDs70' },
    lines: [
      { original: '夢ならば どれほどよかったでしょう', korean: '유메나라바 도레호도 요캇타데쇼' },
      { original: '未だあなたのことを夢にみる', korean: '이마다 아나타노 코토오 유메니 미루' },
      { original: '忘れた物を取りにかえるように', korean: '와스레타 모노오 토리니 카에루요니' },
      { original: '古びた思い出の埃を払う', korean: '후루비타 오모이데노 호코리오 하라우' },
      { original: '恋しくて 恋しくて 恋しくて', korean: '코이시쿠테 코이시쿠테 코이시쿠테' },
      { original: '形のないものを求め続けた', korean: '카타치노 나이모노오 모토메 츠즈케타' },
    ]
  },
  {
    id: 's26', title: 'Pretender', artist: 'Official髭男dism', emoji: '🎭',
    gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    links: { youtube: 'https://www.youtube.com/watch?v=TQ8WlA2GXbk', spotify: 'https://open.spotify.com/track/3nAUOBmqcBWMs63sFIHJiA' },
    lines: [
      { original: 'Oh I just pretender', korean: '오 아이 저스트 프리텐더' },
      { original: '君とのロマンスは complete', korean: '키미토노 로만스와 컴플리트' },
      { original: 'Oh goodbye to wonderful', korean: '오 굿바이 투 원더풀' },
      { original: 'You are my pretender', korean: '유 아 마이 프리텐더' },
      { original: 'ただ離れていくよ', korean: '타다 하나레테 이쿠요' },
      { original: 'どうしようもなく好きだよ', korean: '도우시요우모나쿠 스키다요' },
    ]
  },
  {
    id: 's27', title: 'チェリー (Cherry)', artist: 'スピッツ (Spitz)', emoji: '🍒',
    gradient: 'linear-gradient(135deg,#ff9a9e,#fecfef)',
    links: { youtube: 'https://www.youtube.com/watch?v=v0NaGDHQ9RY', spotify: 'https://open.spotify.com/track/5sTtEdWimrk4SbR9DVJKNi' },
    lines: [
      { original: '愛してるの言葉では足りなくて', korean: '아이시테루노 코토바데와 타리나쿠테' },
      { original: '何もかもが君のためになれば', korean: '나니모카모가 키미노 타메니 나레바' },
      { original: 'どんな悲しみも どんな喜びも', korean: '돈나 카나시미모 돈나 요로코비모' },
      { original: 'ただひたすらに君だけを', korean: '타다 히타스라니 키미다케오' },
      { original: '想い続けるだろう', korean: '오모이 츠즈케루다로우' },
      { original: 'イエスタデイに似た夢', korean: '이에스타데이니 니타 유메' },
    ]
  },
  {
    id: 's28', title: '雪の華 (Yuki no Hana)', artist: '中島美嘉 (Mika Nakashima)', emoji: '❄️',
    gradient: 'linear-gradient(135deg,#e0e0e0,#74b9ff)',
    links: { youtube: 'https://www.youtube.com/watch?v=RYBKB1M5-6A', spotify: 'https://open.spotify.com/track/2HxQHRUQDuXEDMUxFPHJLr' },
    lines: [
      { original: '今日も一日終わりに近づき', korean: '쿄우모 이치니치 오와리니 치카즈키' },
      { original: '寒い部屋の中二人で', korean: '사무이 헤야노 나카 후타리데' },
      { original: '窓の外に降り出した', korean: '마도노 소토니 후리다시타' },
      { original: '白く白く落ちてくる雪', korean: '시로쿠 시로쿠 오치테쿠루 유키' },
      { original: '雪の華が降る頃', korean: '유키노 하나가 후루 코로' },
      { original: '二人よりそっていたいよ', korean: '후타리 요리솟테 이타이요' },
    ]
  },
  {
    id: 's29', title: 'Wherever You Are', artist: 'ONE OK ROCK', emoji: '🌏',
    gradient: 'linear-gradient(135deg,#2c3e50,#3498db)',
    links: { youtube: 'https://www.youtube.com/watch?v=qXNSMQ4_UaA', spotify: 'https://open.spotify.com/track/5C9SKnnKoJPaxYBnVJNBDV' },
    lines: [
      { original: 'I will always love you', korean: '아이 윌 올웨이즈 러브 유' },
      { original: 'wherever you are', korean: '웨어에버 유 아' },
      { original: 'My love, wherever you are', korean: '마이 러브 웨어에버 유 아' },
      { original: '君を想うこの気持ちは', korean: '키미오 오모우 코노 키모치와' },
      { original: 'どんな言葉でも伝えられない', korean: '돈나 코토바데모 츠타에라레나이' },
      { original: 'But I will always love you', korean: '벗 아이 윌 올웨이즈 러브 유' },
    ]
  },
  {
    id: 's30', title: '紅蓮華 (Gurenge)', artist: 'LiSA', emoji: '🔥',
    gradient: 'linear-gradient(135deg,#c0392b,#8e44ad)',
    links: { youtube: 'https://www.youtube.com/watch?v=CwkzK-F0Y4s', spotify: 'https://open.spotify.com/track/5pjd0cI2GkTGb0BxXLFNGe' },
    lines: [
      { original: '強くなれる理由を知った', korean: '츠요쿠 나레루 리유우오 싯타' },
      { original: '僕を連れて進め', korean: '보쿠오 츠레테 스스메' },
      { original: '泥だらけの走馬燈に', korean: '도로다라케노 소우마토우니' },
      { original: '酔いしれる様に', korean: '요이시레루 요우니' },
      { original: '人は傷ついてまた強くなれる', korean: '히토와 키즈츠이테 마타 츠요쿠 나레루' },
      { original: '紅蓮の華よ咲き誇れ', korean: '구레나이노 하나요 사키호코레' },
    ]
  },
  {
    id: 's31', title: '死ぬのがいいわ (Shinunoga E-Wa)', artist: '藤井風 (Fujii Kaze)', emoji: '🌊',
    gradient: 'linear-gradient(135deg,#2980b9,#6dd5fa)',
    links: { youtube: 'https://www.youtube.com/watch?v=Q9ATl6hFNNI', spotify: 'https://open.spotify.com/track/5jQ4o8WCNFnBEKGFVlFaST' },
    lines: [
      { original: 'あなたと死にたいわ', korean: '아나타토 시니타이와' },
      { original: 'あなたと堕ちたいわ', korean: '아나타토 오치타이와' },
      { original: 'あなたが好きすぎて', korean: '아나타가 스키스기테' },
      { original: '死んでもいいくらい', korean: '신데모 이이쿠라이' },
      { original: 'あなたと死ぬのがいいわ', korean: '아나타토 시누노가 이이와' },
      { original: 'あなたのそばで', korean: '아나타노 소바데' },
    ]
  },
  {
    id: 's32', title: 'ハッピーエンド (Happy End)', artist: 'back number', emoji: '🌸',
    gradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
    links: { youtube: 'https://www.youtube.com/watch?v=FdE3aCQXqeY', spotify: 'https://open.spotify.com/track/3h4H4SIRpfNhR9UEBLzm1Y' },
    lines: [
      { original: 'ハッピーエンドにしよう', korean: '합피엔도니 시요우' },
      { original: 'ずっと一緒にいよう', korean: '즛토 잇쇼니 이요우' },
      { original: '僕たちの世界で', korean: '보쿠타치노 세카이데' },
      { original: 'ずっとずっと笑って', korean: '즛토 즛토 와랏테' },
      { original: 'またつまらないことで喧嘩してもいいよ', korean: '마타 츠마라나이코토데 켄카 시테모 이이요' },
      { original: 'それでもずっと一緒にいよう', korean: '소레데모 즛토 잇쇼니 이요우' },
    ]
  },

  // ===== 🇪🇸 SPANISH =====
  {
    id: 's33', title: 'Hips Don\'t Lie', artist: 'Shakira ft. Wyclef Jean', emoji: '💃',
    gradient: 'linear-gradient(135deg,#f7971e,#e74c3c)',
    links: { youtube: 'https://www.youtube.com/watch?v=DUT5rEU6pqM', spotify: 'https://open.spotify.com/track/1jDJFeK9x5f8k0TtCDwhHI' },
    lines: [
      { original: 'I never really knew that she could dance like this', korean: '아이 네버 리얼리 뉴 댓 쉬 쿠드 댄스 라이크 디스' },
      { original: 'She makes a man wants to speak Spanish', korean: '쉬 메익스 어 맨 원츠 투 스픽 스패니쉬' },
      { original: 'Como se llama, bonita, mi casa, su cama', korean: '꼬모 세 야마 보니따 미 까사 수 까마' },
      { original: 'Shakira, Shakira', korean: '샤키라 샤키라' },
      { original: 'Oh baby when you talk like that', korean: '오 베이비 웬 유 톡 라이크 댓' },
      { original: 'You make a woman go mad', korean: '유 메이크 어 우먼 고 매드' },
    ]
  },
  {
    id: 's34', title: 'Hero', artist: 'Enrique Iglesias', emoji: '🦸',
    gradient: 'linear-gradient(135deg,#2c3e50,#4ca1af)',
    links: { youtube: 'https://www.youtube.com/watch?v=koJlIGDImiU', spotify: 'https://open.spotify.com/track/0n7CPi9T0oZm0RIb0nGQe8' },
    lines: [
      { original: 'Would you dance if I asked you to dance?', korean: '우쥬 댄스 이프 아이 애스크드 유 투 댄스' },
      { original: 'Would you run and never look back?', korean: '우쥬 런 앤 네버 룩 백' },
      { original: 'I can be your hero, baby', korean: '아이 캔 비 유어 히어로 베이비' },
      { original: 'I can kiss away the pain', korean: '아이 캔 키스 어웨이 더 페인' },
      { original: 'I will stand by you forever', korean: '아이 윌 스탠드 바이 유 포에버' },
      { original: 'You can take my breath away', korean: '유 캔 테이크 마이 브레스 어웨이' },
    ]
  },
  {
    id: 's35', title: 'Bailando', artist: 'Enrique Iglesias ft. Descemer Bueno', emoji: '🕺',
    gradient: 'linear-gradient(135deg,#f7971e,#ffd200)',
    links: { youtube: 'https://www.youtube.com/watch?v=NUsoVlDFqZg', spotify: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT' },
    lines: [
      { original: 'Yo quiero estar contigo', korean: '요 끼에로 에스따르 꼰띠고' },
      { original: 'Vivir contigo, bailar contigo', korean: '비비르 꼰띠고 바일라르 꼰띠고' },
      { original: 'Tengo que estar contigo', korean: '뗑고 께 에스따르 꼰띠고' },
      { original: 'Mi vida quiero compartir contigo', korean: '미 비다 끼에로 꼼빠르띠르 꼰띠고' },
      { original: 'Bailando, bailando', korean: '바일란도 바일란도' },
      { original: 'Tu cuerpo con el mio', korean: '뚜 꾸에르뽀 꼰 엘 미오' },
    ]
  },
  {
    id: 's36', title: 'Gasolina', artist: 'Daddy Yankee', emoji: '⛽',
    gradient: 'linear-gradient(135deg,#f7971e,#ff0844)',
    links: { youtube: 'https://www.youtube.com/watch?v=CCF-hgCfm1Q', spotify: 'https://open.spotify.com/track/21THa8j9TX1LfoJwm1G2Bn' },
    lines: [
      { original: 'Ella quiere gasolina', korean: '에야 끼에레 가솔리나' },
      { original: 'Dámelo que a ti te gusta la gasolina', korean: '다멜로 께 아 띠 떼 구스따 라 가솔리나' },
      { original: 'Dale don dale', korean: '달레 돈 달레' },
      { original: 'Yo le doy gasolina', korean: '요 레 도이 가솔리나' },
      { original: 'A ella le gusta la gasolina', korean: '아 에야 레 구스따 라 가솔리나' },
      { original: 'Gasolina, gasolina', korean: '가솔리나 가솔리나' },
    ]
  },
  {
    id: 's37', title: 'Livin\' La Vida Loca', artist: 'Ricky Martin', emoji: '🔥',
    gradient: 'linear-gradient(135deg,#e74c3c,#c0392b)',
    links: { youtube: 'https://www.youtube.com/watch?v=p47fEXGabaY', spotify: 'https://open.spotify.com/track/3JvrhDOgAt6p7K8mDyZwRd' },
    lines: [
      { original: 'She\'s into superstitions', korean: '쉬즈 인투 수퍼스티션스' },
      { original: 'Black cats and voodoo dolls', korean: '블랙 캣츠 앤 부두 돌스' },
      { original: 'She\'ll make you take your clothes off', korean: '쉴 메이크 유 테이크 유어 클로즈 오프' },
      { original: 'And go dancing in the rain', korean: '앤 고 댄싱 인 더 레인' },
      { original: 'Livin\' la vida loca', korean: '리빈 라 비다 로카' },
      { original: 'She will wear you out', korean: '쉬 윌 웨어 유 아웃' },
    ]
  },
  {
    id: 's38', title: 'Mi Gente', artist: 'J Balvin & Willy William', emoji: '🌎',
    gradient: 'linear-gradient(135deg,#11998e,#38ef7d)',
    links: { youtube: 'https://www.youtube.com/watch?v=wnJ6LuUFpMo', spotify: 'https://open.spotify.com/track/5fi9Ke4Py2nFJNPHs8vCbq' },
    lines: [
      { original: 'Para toda mi gente', korean: '빠라 또다 미 헨떼' },
      { original: 'Mi gente, mi gente', korean: '미 헨떼 미 헨떼' },
      { original: 'Si tú quieres, mi amor', korean: '시 뚜 끼에레스 미 아모르' },
      { original: 'Muévete pa\' acá', korean: '무에베떼 빠 아까' },
      { original: 'Que yo quiero verte', korean: '께 요 끼에로 베르떼' },
      { original: 'Bailando sola, sola', korean: '바일란도 솔라 솔라' },
    ]
  },
  {
    id: 's39', title: 'Tití Me Preguntó', artist: 'Bad Bunny', emoji: '🐰',
    gradient: 'linear-gradient(135deg,#7f00ff,#e100ff)',
    links: { youtube: 'https://www.youtube.com/watch?v=G9sRDFnSFtY', spotify: 'https://open.spotify.com/track/1yoMvmasuxZfqHEipJhRbp' },
    lines: [
      { original: 'Tití me preguntó', korean: '띠띠 메 쁘레군또' },
      { original: 'Que si tengo novia, que si tengo novia', korean: '께 시 뗑고 노비아 께 시 뗑고 노비아' },
      { original: 'Le dije que no', korean: '레 디헤 께 노' },
      { original: 'Yo no me enamoro, no, no', korean: '요 노 메 에나모로 노 노' },
      { original: 'Pero si me la encontrara', korean: '뻬로 시 메 라 엔꼰뜨라라' },
      { original: 'Me la llevaría a la discoteca', korean: '메 라 예바리아 아 라 디스꼬떼까' },
    ]
  },
  {
    id: 's40', title: 'Oye Mi Amor', artist: 'Maná', emoji: '🎸',
    gradient: 'linear-gradient(135deg,#1a1a2e,#e94560)',
    links: { youtube: 'https://www.youtube.com/watch?v=8SHncrfHjCE', spotify: 'https://open.spotify.com/track/1P5sRlCfFKxmtH1I0f7hCb' },
    lines: [
      { original: 'Oye mi amor', korean: '오예 미 아모르' },
      { original: 'Necesito de ti tu calor', korean: '네세시또 데 띠 뚜 깔로르' },
      { original: 'Oye mi amor', korean: '오예 미 아모르' },
      { original: 'No puedo estar sin tu amor', korean: '노 뿌에도 에스따르 신 뚜 아모르' },
      { original: 'Que me llena el corazón', korean: '께 메 예나 엘 꼬라손' },
      { original: 'Oye, oye, oye mi amor', korean: '오예 오예 오예 미 아모르' },
    ]
  },
  {
    id: 's41', title: 'La Camisa Negra', artist: 'Juanes', emoji: '🖤',
    gradient: 'linear-gradient(135deg,#1c1c1c,#8b0000)',
    links: { youtube: 'https://www.youtube.com/watch?v=HX4Dv9aZv1E', spotify: 'https://open.spotify.com/track/4q7mxEpUQXVeJBRcFGv5Jt' },
    lines: [
      { original: 'Tengo la camisa negra', korean: '뗑고 라 까미사 네그라' },
      { original: 'Porque negra tengo el alma', korean: '뽀르께 네그라 뗑고 엘 알마' },
      { original: 'Yo por ti perdí la calma', korean: '요 뽀르 띠 뻬르디 라 깔마' },
      { original: 'Y casi pierdo hasta mi cama', korean: '이 까시 삐에르도 아스따 미 까마' },
      { original: 'Camisa negra', korean: '까미사 네그라' },
      { original: 'Negro, negro, negro', korean: '네그로 네그로 네그로' },
    ]
  },

  // ===== 🇨🇳🇹🇼 CHINESE / TAIWANESE =====
  {
    id: 's42', title: '晴天 (Qīng Tiān)', artist: '周杰倫 Jay Chou', emoji: '☀️',
    gradient: 'linear-gradient(135deg,#fceabb,#f8b500)',
    links: { youtube: 'https://www.youtube.com/watch?v=3aDLzLpsgcA', spotify: 'https://open.spotify.com/track/1wZKNXQhH8FNRjUaxU6ZrI' },
    lines: [
      { original: '故事的小黄花 从出生那年就飘着', korean: '꾸스 더 샤오황화 총추셩나녠 지우퍄오져' },
      { original: '童年的荡秋千 随记忆一直晃到现在', korean: '통녠 더 당추첸 쉐이지이 이즈 황따오 시엔짜이' },
      { original: 'Re Re Re Re Re', korean: '러 러 러 러 러' },
      { original: '刮风这天 我试着握你手', korean: '꽈펑 쩌티엔 워 스져 워니 쇼우' },
      { original: '但偏偏雨渐渐 大到我看你不见', korean: '단 피엔피엔 위 지엔지엔 따따오 워 칸 니 뿌 지엔' },
      { original: '我找不到你了 都怪我', korean: '워 자오 뿌따오 니 러 도우 꽈이 워' },
    ]
  },
  {
    id: 's43', title: '简单爱 (Jiǎn Dān Ài)', artist: '周杰倫 Jay Chou', emoji: '💛',
    gradient: 'linear-gradient(135deg,#f9d423,#ff4e50)',
    links: { youtube: 'https://www.youtube.com/watch?v=1mJFt3FTlHI', spotify: 'https://open.spotify.com/track/5t1SzMM69QWPqimUcr1j0H' },
    lines: [
      { original: '你说把爱拿走', korean: '니 수오 바 아이 나저우' },
      { original: '我悄悄蒙着头', korean: '워 치아오치아오 멍져 터우' },
      { original: '假装睡着了', korean: '쟈쭈앙 쉐이쟈오 러' },
      { original: '我想就这样牵着你的手不放开', korean: '워 샹 지우 쩌양 치엔져 니 더 쇼우 뿌 팡카이' },
      { original: '爱可不可以简简单单没有伤害', korean: '아이 크어뿌크어이 지엔지엔단단 메이요우 상하이' },
      { original: '你 靠着我的肩膀', korean: '니 카오져 워 더 지엔방' },
    ]
  },
  {
    id: 's44', title: '稻香 (Dào Xiāng)', artist: '周杰倫 Jay Chou', emoji: '🌾',
    gradient: 'linear-gradient(135deg,#56ab2f,#a8e063)',
    links: { youtube: 'https://www.youtube.com/watch?v=0yMp5Q4h1ss', spotify: 'https://open.spotify.com/track/2Zb9lJGYO5t7bFjHJtaXDZ' },
    lines: [
      { original: '对这个世界如果你有太多的抱怨', korean: '뚜이 쩌거 스지에 루궈 니 여우 타이뚜어 더 바오위엔' },
      { original: '跌倒了 就不敢继续爱你', korean: '디에따오 러 지우 뿌간 지쉬 아이 니' },
      { original: '所谓的那快乐', korean: '수오웨이 더 나 콰일러' },
      { original: '赤脚在田里 追蜻蜓追到累了', korean: '츠쟈오 짜이 티엔리 쮜칭팅 쮜따오 레이러' },
      { original: '看稻田 看到天黑', korean: '칸 따오티엔 칸따오 티엔헤이' },
      { original: '感谢地心引力 让我碰到你', korean: '간시에 디신인리 랑 워 펑따오 니' },
    ]
  },
  {
    id: 's45', title: '突然好想你 (Tū Rán Hǎo Xiǎng Nǐ)', artist: '五月天 Mayday', emoji: '🌙',
    gradient: 'linear-gradient(135deg,#1a1a2e,#16213e)',
    links: { youtube: 'https://www.youtube.com/watch?v=c0_wFkEHSTA', spotify: 'https://open.spotify.com/track/0n7yEEiXr30qoJLVpMJqtN' },
    lines: [
      { original: '突然好想你', korean: '투란 하오 샹 니' },
      { original: '那些日子你一定要快乐', korean: '나시에 리즈 니 이띵 야오 콰일러' },
      { original: '你说把爱还给自由', korean: '니 수오 바 아이 환 게이 쯔여우' },
      { original: '我说把泪流给懂的人', korean: '워 수오 바 레이 리우 게이 동 더 런' },
      { original: '突然好想你 那些日子里的我', korean: '투란 하오 샹 니 나시에 리즈리 더 워' },
      { original: '欠了你一句 很高兴认识你', korean: '치엔러 니 이쥐 헨 까오싱 런스 니' },
    ]
  },
  {
    id: 's46', title: '知足 (Zhī Zú)', artist: '五月天 Mayday', emoji: '⭐',
    gradient: 'linear-gradient(135deg,#f7971e,#ffd200)',
    links: { youtube: 'https://www.youtube.com/watch?v=5UqLLfOqjnw', spotify: 'https://open.spotify.com/track/0iFpDxWyGCGJqDrJXq4L4g' },
    lines: [
      { original: '怎么去拥有 一道彩虹', korean: '전머 취 용여우 이따오 차이홍' },
      { original: '怎么去拥抱 一夏天的风', korean: '전머 취 용빠오 이 시아티엔 더 펑' },
      { original: '我不奢望 透明的你', korean: '워 뿌 서왕 터우밍 더 니' },
      { original: '我只要你 快乐着我的快乐', korean: '워 즈 야오 니 콰일러져 워 더 콰일러' },
      { original: '知足 就是拥有了你之后', korean: '쯔주 지우스 용여우러 니 쯔허우' },
      { original: '我的快乐', korean: '워 더 콰일러' },
    ]
  },
  {
    id: 's47', title: '泡沫 (Pào Mò)', artist: '邓紫棋 G.E.M.', emoji: '🫧',
    gradient: 'linear-gradient(135deg,#74b9ff,#0984e3)',
    links: { youtube: 'https://www.youtube.com/watch?v=y12mNVfgvbE', spotify: 'https://open.spotify.com/track/2v4m6dGl6bCGBpJX1gGSTk' },
    lines: [
      { original: '阳光下的泡沫', korean: '양광 샤 더 파오모' },
      { original: '是彩色的', korean: '스 차이서 더' },
      { original: '就像被骗的我', korean: '지우샹 베이 피엔 더 워' },
      { original: '是幸福的', korean: '스 싱푸 더' },
      { original: '在最美丽的时刻', korean: '짜이 쭈이메이리 더 스크어' },
      { original: '凋谢 是你给的伤', korean: '띠아오시에 스 니 게이 더 상' },
    ]
  },
  {
    id: 's48', title: '光年之外 (Guāng Nián Zhī Wài)', artist: '邓紫棋 G.E.M.', emoji: '🚀',
    gradient: 'linear-gradient(135deg,#0f0c29,#302b63)',
    links: { youtube: 'https://www.youtube.com/watch?v=M-j3Bc2FfRI', spotify: 'https://open.spotify.com/track/3eMQKbC0XdR0UVRqFZhHcS' },
    lines: [
      { original: '感受停在我发端', korean: '간서우 팅짜이 워 파뚜안' },
      { original: '无声告白', korean: '우성 까오바이' },
      { original: '你眼中的宇宙 那么深远那么美', korean: '니 옌중 더 위저우 나머 선위엔 나머 메이' },
      { original: '让我赤裸裸地愿意从此不设防', korean: '랑 워 츠루오루오 더 위엔이 총츠 부셔팡' },
      { original: '不管宇宙多宽广', korean: '부관 위저우 뚜오 콴광' },
      { original: '我在你身边', korean: '워 짜이 니 선비엔' },
    ]
  },
  {
    id: 's49', title: '十年 (Shí Nián)', artist: '陈奕迅 Eason Chan', emoji: '🕰️',
    gradient: 'linear-gradient(135deg,#4b6cb7,#182848)',
    links: { youtube: 'https://www.youtube.com/watch?v=d3v-HVhUKkA', spotify: 'https://open.spotify.com/track/2iKYaLrb0sVdFIL0pJ8Zd3' },
    lines: [
      { original: '如果那两个字没有颤抖', korean: '루궈 나 량거 쯔 메이여우 짠또우' },
      { original: '我不会发现 我难受', korean: '워 뿌후이 파시엔 워 난서우' },
      { original: '怎么说出口 也不过是分手', korean: '전머 수오추커우 예뿌궈스 펀쇼우' },
      { original: '十年之后 我们是朋友', korean: '스니엔 쯔허우 워먼 스 펑여우' },
      { original: '还可以问候 只是那种温柔', korean: '하이 크어이 원허우 즈스 나쫑 원러우' },
      { original: '再也找不到 牵手的理由', korean: '짜이예 자오 뿌따오 치엔쇼우 더 리여우' },
    ]
  },
  {
    id: 's50', title: '日不落 (Rì Bù Luò)', artist: '蔡依林 Jolin Tsai', emoji: '🌅',
    gradient: 'linear-gradient(135deg,#ff6b6b,#ffd93d)',
    links: { youtube: 'https://www.youtube.com/watch?v=CGQSP9oeHWg', spotify: 'https://open.spotify.com/track/7q9rVBxeU8hvwnKGy9OLoO' },
    lines: [
      { original: '你走了 我的世界下起了大雨', korean: '니 저우러 워 더 스지에 시아치러 따위' },
      { original: '我的眼泪越来越多', korean: '워 더 옌레이 위에라이위에 뚜오' },
      { original: '感觉日不落', korean: '간쥐에 르뿌뤄' },
      { original: '只要有你在 阳光不会落', korean: '즈야오 여우 니 짜이 양광 뿌후이 뤄' },
      { original: '没有你在 我的天黑了', korean: '메이여우 니 짜이 워 더 티엔 헤이러' },
      { original: '日不落 日不落', korean: '르뿌뤄 르뿌뤄' },
    ]
  },
  {
    id: 's51', title: 'La Vie en Rose', artist: 'Edith Piaf', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#ff6b6b,#4ecdc4)',
    links: { youtube: 'https://www.youtube.com/watch?v=qPU8mENUBXk', spotify: 'https://open.spotify.com/search/La%20Vie%20en%20Rose%20Edith%20Piaf' },
    lines: [
      { original: 'Quand il me prend dans ses bras', korean: '꽁 일 므 프헝 당 쎄 브라' },
      { original: 'Je vois la vie en rose', korean: '쥬 브와 라 비 앙 호즈' },
      { original: 'Il me dit des mots d\'amour', korean: '일 므 디 데 모 다무흐' },
      { original: 'Des mots de tous les jours', korean: '데 모 드 투 레 주흐' },
      { original: 'Et ça me fait quelque chose', korean: '에 싸 므 페 껠끄 쇼즈' },
    ]
  },
  {
    id: 's52', title: 'Alors on Danse', artist: 'Stromae', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
    links: { youtube: 'https://www.youtube.com/watch?v=VHoT4N43jK8', spotify: 'https://open.spotify.com/search/Alors%20on%20Danse%20Stromae' },
    lines: [
      { original: 'Qui dit études dit travail', korean: '키 디 에튀드 디 트라바이' },
      { original: 'Qui dit taf te dit les thunes', korean: '키 디 타프 트 디 레 튠' },
      { original: 'Qui dit argent dit dépenses', korean: '키 디 아르정 디 데팡스' },
      { original: 'Qui dit crédit dit créance', korean: '키 디 크레디 디 크레앙스' },
      { original: 'Alors on danse', korean: '알로 옹 당스' },
    ]
  },
  {
    id: 's53', title: 'Papaoutai', artist: 'Stromae', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#f6d365,#fda085)',
    links: { youtube: 'https://www.youtube.com/watch?v=oiKj0Z_Xnjc', spotify: 'https://open.spotify.com/search/Papaoutai%20Stromae' },
    lines: [
      { original: 'Dites-moi d\'où il vient', korean: '디트 무아 두 일 비앙' },
      { original: 'Enfin je saurai où je vais', korean: '앙팽 쥬 소헤 우 쥬 베' },
      { original: 'Maman dit que lorsqu\'on cherche bien', korean: '마망 디 크 르스콩 셰르슈 비앙' },
      { original: 'On finit toujours par trouver', korean: '옹 피니 투주흐 파 트루베' },
      { original: 'Papa où t\'es', korean: '파파 우 테' },
    ]
  },
  {
    id: 's54', title: 'Dernière Danse', artist: 'Indila', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#84fab0,#8fd3f4)',
    links: { youtube: 'https://www.youtube.com/watch?v=K5KAc5CoCuk', spotify: 'https://open.spotify.com/search/Derni%C3%A8re%20Danse%20Indila' },
    lines: [
      { original: 'Oh ma douce souffrance', korean: '오 마 두스 수프헝스' },
      { original: 'Pourquoi s\'acharner tu recommences', korean: '푸르쿠아 사샤르네 튀 흐코멍스' },
      { original: 'Je suis qu\'un être sans importance', korean: '쥬 쉬 캉 네트흐 상 앵포르탕스' },
      { original: 'Sans lui je suis un peu par terre', korean: '상 뤼 쥬 쉬 앙 푀 파 테흐' },
      { original: 'Je remue le ciel le jour la nuit', korean: '쥬 흐뮈 르 씨엘 르 주흐 라 뉘' },
    ]
  },
  {
    id: 's55', title: 'Je Veux', artist: 'Zaz', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#fccb90,#d57eeb)',
    links: { youtube: 'https://www.youtube.com/watch?v=0TFNGRYMz1U', spotify: 'https://open.spotify.com/search/Je%20Veux%20Zaz' },
    lines: [
      { original: 'Donnez-moi une suite au Ritz', korean: '도네 무아 윤 스위트 오 리츠' },
      { original: 'Je n\'en veux pas', korean: '쥬 낭 브 파' },
      { original: 'Des bijoux de chez Chanel', korean: '데 비주 드 쉐 샤넬' },
      { original: 'Je n\'en veux pas', korean: '쥬 낭 브 파' },
      { original: 'Moi je veux d\'l\'amour d\'la joie', korean: '무아 쥬 브 들라무흐 들라 주아' },
    ]
  },
  {
    id: 's56', title: 'Les Champs-Élysées', artist: 'Joe Dassin', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#30cfd0,#330867)',
    links: { youtube: 'https://www.youtube.com/watch?v=bb-DKKRN4o8', spotify: 'https://open.spotify.com/search/Les%20Champs-%C3%89lys%C3%A9es%20Joe%20Dassin' },
    lines: [
      { original: 'Je m\'baladais sur l\'avenue', korean: '쥬 음발라데 쉬흐 라브뉘' },
      { original: 'Le coeur ouvert à l\'inconnu', korean: '르 쾨흐 우베흐 알랭코뉴' },
      { original: 'J\'avais envie de dire bonjour', korean: '자베 앙비 드 디흐 봉주흐' },
      { original: 'Il m\'a dit viens aux Champs-Élysées', korean: '일 마 디 비앙조 샹젤리제' },
      { original: 'Aux Champs-Élysées', korean: '오 샹젤리제' },
    ]
  },
  {
    id: 's57', title: 'La Bohème', artist: 'Charles Aznavour', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
    links: { youtube: 'https://www.youtube.com/watch?v=fVfnEyLOkrM', spotify: 'https://open.spotify.com/search/La%20Boh%C3%A8me%20Charles%20Aznavour' },
    lines: [
      { original: 'Je vous parle d\'un temps', korean: '쥬 부 파흘 당 땅' },
      { original: 'Que les moins de vingt ans', korean: '크 레 무앙 드 방 탕' },
      { original: 'Ne peuvent pas connaître', korean: '느 푀브 파 코네트흐' },
      { original: 'La bohème la bohème', korean: '라 보엠 라 보엠' },
      { original: 'Ça voulait dire on est heureux', korean: '싸 불레 디흐 옹 네 흐흐' },
    ]
  },
  {
    id: 's58', title: 'Djadja', artist: 'Aya Nakamura', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#5ee7df,#b490ca)',
    links: { youtube: 'https://www.youtube.com/watch?v=iPGgnzc34tY', spotify: 'https://open.spotify.com/search/Djadja%20Aya%20Nakamura' },
    lines: [
      { original: 'Oh Djadja', korean: '오 자자' },
      { original: 'Y a pas moyen Djadja', korean: '야 파 무아양 자자' },
      { original: 'J\'suis pas ta catin Djadja', korean: '쥐 파 타 카탱 자자' },
      { original: 'Genre en catchana baby tu dead ça', korean: '장흐 앙 카차나 베이비 튀 데 싸' },
      { original: 'Pourquoi tu forces comme ça', korean: '푸르쿠아 튀 포흐스 꼼 싸' },
    ]
  },
  {
    id: 's59', title: 'Pour Que Tu M\'Aimes Encore', artist: 'Celine Dion', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#c3cfe2,#c3cfe2)',
    links: { youtube: 'https://www.youtube.com/watch?v=AzaTyxMduH4', spotify: 'https://open.spotify.com/search/Pour%20Que%20Tu%20M%27Aimes%20Encore%20Celine%20Dion' },
    lines: [
      { original: 'J\'ai compris tous les mots', korean: '제 콩프리 투 레 모' },
      { original: 'J\'ai bien compris merci', korean: '제 비앙 콩프리 메흑씨' },
      { original: 'Raisonnable et nouveau', korean: '헤조나블 에 누보' },
      { original: 'C\'est ainsi par ici', korean: '세 앙시 파 이씨' },
      { original: 'Que les choses ont changé', korean: '크 레 쇼즈 옹 샹제' },
    ]
  },
  {
    id: 's60', title: 'Ella, elle l\'a', artist: 'France Gall', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    links: { youtube: 'https://www.youtube.com/watch?v=lgHGU8gqz9U', spotify: 'https://open.spotify.com/search/Ella%2C%20elle%20l%27a%20France%20Gall' },
    lines: [
      { original: 'C\'est comme une gaieté', korean: '세 꼼 윤 게이테' },
      { original: 'Comme un sourire', korean: '꼼 앙 수히흐' },
      { original: 'Quelque chose dans la voix', korean: '껠끄 쇼즈 당 라 부아' },
      { original: 'Qui paraît nous dire', korean: '키 파헤 누 디흐' },
      { original: 'Viens', korean: '비앙' },
    ]
  },
  {
    id: 's61', title: 'Garota de Ipanema', artist: 'Tom Jobim', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#ff6b6b,#4ecdc4)',
    links: { youtube: 'https://www.youtube.com/watch?v=WuenyQ4NCQE', spotify: 'https://open.spotify.com/search/Garota%20de%20Ipanema%20Tom%20Jobim' },
    lines: [
      { original: 'Olha que coisa mais linda', korean: '올랴 키 코이자 마이스 린다' },
      { original: 'Mais cheia de graça', korean: '마이스 쉐이아 지 그라사' },
      { original: 'É ela menina', korean: '에 엘라 메니나' },
      { original: 'Que vem e que passa', korean: '키 벵 이 키 파사' },
      { original: 'Num doce balanço', korean: '눙 도시 발랑수' },
    ]
  },
  {
    id: 's62', title: 'Mas Que Nada', artist: 'Jorge Ben Jor', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
    links: { youtube: 'https://www.youtube.com/watch?v=rd3LEsKIjNI', spotify: 'https://open.spotify.com/search/Mas%20Que%20Nada%20Jorge%20Ben%20Jor' },
    lines: [
      { original: 'Oariá raio obá obá obá', korean: '오아리아 하이우 오바 오바 오바' },
      { original: 'Mas que nada', korean: '마스 키 나다' },
      { original: 'Sai da minha frente', korean: '사이 다 미냐 프렌치' },
      { original: 'Eu quero passar', korean: '에우 케루 파사' },
      { original: 'Pois o samba está animado', korean: '포이즈 우 삼바 이스타 아니마두' },
    ]
  },
  {
    id: 's63', title: 'Ai Se Eu Te Pego', artist: 'Michel Teló', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#f6d365,#fda085)',
    links: { youtube: 'https://www.youtube.com/watch?v=hcm55lU9knw', spotify: 'https://open.spotify.com/search/Ai%20Se%20Eu%20Te%20Pego%20Michel%20Tel%C3%B3' },
    lines: [
      { original: 'Nossa nossa', korean: '노싸 노싸' },
      { original: 'Assim você me mata', korean: '아씽 보세 미 마타' },
      { original: 'Ai se eu te pego', korean: '아이 씨 에우 치 페구' },
      { original: 'Delícia delícia', korean: '델리시아 델리시아' },
      { original: 'Ai se eu te pego', korean: '아이 씨 에우 치 페구' },
    ]
  },
  {
    id: 's64', title: 'Magalenha', artist: 'Sergio Mendes', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#84fab0,#8fd3f4)',
    links: { youtube: 'https://www.youtube.com/watch?v=ijnujobdJ4c', spotify: 'https://open.spotify.com/search/Magalenha%20Sergio%20Mendes' },
    lines: [
      { original: 'Vem Magalenha rogar', korean: '벵 마갈레냐 호가르' },
      { original: 'Traga a lenha pro fogão', korean: '트라가 아 렌야 프로 포강' },
      { original: 'Vem fazer armação', korean: '벵 파제르 아르마상' },
      { original: 'Hoje é um dia de sol', korean: '오제 에 웅 지아 지 솔' },
      { original: 'Alegria de coqueiro', korean: '알레그리아 지 코케이루' },
    ]
  },
  {
    id: 's65', title: 'Evidências', artist: 'Chitãozinho & Xororó', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#fccb90,#d57eeb)',
    links: { youtube: 'https://www.youtube.com/watch?v=ePjtnSPFWK8', spotify: 'https://open.spotify.com/search/Evid%C3%AAncias%20Chit%C3%A3ozinho%20%26%20Xoror%C3%B3' },
    lines: [
      { original: 'Quando eu digo que deixei de te amar', korean: '꽌두 에우 지구 키 데이셰이 지 치 아마르' },
      { original: 'É porque eu te amo', korean: '에 포르키 에우 치 아무' },
      { original: 'Quando eu digo que não quero mais você', korean: '꽌두 에우 지구 키 낭 케루 마이스 보세' },
      { original: 'É porque eu te quero', korean: '에 포르키 에우 치 케루' },
      { original: 'Eu tenho medo de te dar meu coração', korean: '에우 테뉴 메두 지 치 다르 메우 코라상' },
    ]
  },
  {
    id: 's66', title: 'Ainda Lembro', artist: 'Marisa Monte', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#30cfd0,#330867)',
    links: { youtube: 'https://www.youtube.com/watch?v=9LOBuHsqgCA', spotify: 'https://open.spotify.com/search/Ainda%20Lembro%20Marisa%20Monte' },
    lines: [
      { original: 'Ainda lembro o que passou', korean: '아인다 렝브루 우 키 파소우' },
      { original: 'Eu você em qualquer lugar', korean: '에우 보세 엥 깔케르 루가르' },
      { original: 'Dizendo que o tempo não ia passar', korean: '지젠두 키 우 템푸 낭 이아 파사르' },
      { original: 'Foi tudo tão rápido', korean: '포이 투두 탕 하피두' },
      { original: 'Eu ainda lembro', korean: '에우 아인다 렝브루' },
    ]
  },
  {
    id: 's67', title: 'Exagerado', artist: 'Cazuza', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
    links: { youtube: 'https://www.youtube.com/watch?v=47ZKNyqn2RU', spotify: 'https://open.spotify.com/search/Exagerado%20Cazuza' },
    lines: [
      { original: 'Amor da minha vida', korean: '아모르 다 미냐 비다' },
      { original: 'Daqui até a eternidade', korean: '다키 아테 아 에테르니다지' },
      { original: 'Nossos destinos foram traçados', korean: '노수스 데스치누스 포람 트라사두스' },
      { original: 'Na maternidade', korean: '나 마테르니다지' },
      { original: 'Paixão cruel desenfreada', korean: '파이상 크루엘 데젠프레아다' },
    ]
  },
  {
    id: 's68', title: 'Tempo Perdido', artist: 'Legião Urbana', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#5ee7df,#b490ca)',
    links: { youtube: 'https://www.youtube.com/watch?v=qHJ8CIM4jCw', spotify: 'https://open.spotify.com/search/Tempo%20Perdido%20Legi%C3%A3o%20Urbana' },
    lines: [
      { original: 'Todos os dias quando acordo', korean: '토두즈 오스 지아스 꽌두 아코르두' },
      { original: 'Não tenho mais', korean: '낭 테뉴 마이스' },
      { original: 'O tempo que passou', korean: '우 템푸 키 파소우' },
      { original: 'Mas tenho muito tempo', korean: '마스 테뉴 무이투 템푸' },
      { original: 'Temos todo o tempo do mundo', korean: '테무스 토두 우 템푸 두 문두' },
    ]
  },
  {
    id: 's69', title: 'Aquarela', artist: 'Toquinho', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#c3cfe2,#c3cfe2)',
    links: { youtube: 'https://www.youtube.com/watch?v=xT8HIiFQ8Y0', spotify: 'https://open.spotify.com/search/Aquarela%20Toquinho' },
    lines: [
      { original: 'Numa folha qualquer', korean: '누마 폴랴 깔케르' },
      { original: 'Eu desenho um sol amarelo', korean: '에우 데세뉴 웅 솔 아마렐루' },
      { original: 'E com cinco ou seis retas', korean: '이 콩 씬쿠 우 세이스 헤타스' },
      { original: 'É fácil fazer um castelo', korean: '에 파씨우 파제르 웅 카스텔루' },
      { original: 'E o menino caminha', korean: '이 우 메니누 카미냐' },
    ]
  },
  {
    id: 's70', title: 'País Tropical', artist: 'Jorge Ben Jor', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    links: { youtube: 'https://www.youtube.com/watch?v=JzByVhWju88', spotify: 'https://open.spotify.com/search/Pa%C3%ADs%20Tropical%20Jorge%20Ben%20Jor' },
    lines: [
      { original: 'Moro num país tropical', korean: '모루 눔 파이스 트로피칼' },
      { original: 'Abençoado por Deus', korean: '아벤소아두 포르 데우스' },
      { original: 'E bonito por natureza', korean: '이 보니투 포르 나투레자' },
      { original: 'Mas que beleza', korean: '마스 키 벨레자' },
      { original: 'Em fevereiro tem carnaval', korean: '엥 페베레이루 텡 카르나바우' },
    ]
  },
  {
    id: 's71', title: '99 Luftballons', artist: 'Nena', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#ff6b6b,#4ecdc4)',
    links: { youtube: 'https://www.youtube.com/watch?v=Fpu5a0Bl8eY', spotify: 'https://open.spotify.com/search/99%20Luftballons%20Nena' },
    lines: [
      { original: 'Hast du etwas Zeit für mich', korean: '하스트 두 에트바스 차이트 퓌어 미히' },
      { original: 'Dann singe ich ein Lied für dich', korean: '단 징에 이히 아인 리트 퓌어 디히' },
      { original: 'Von neunundneunzig Luftballons', korean: '폰 노인운트노인치히 루프트발론스' },
      { original: 'Auf ihrem Weg zum Horizont', korean: '아우프 이럼 벡 춤 호리촌트' },
      { original: 'Hielt man für UFOs aus dem All', korean: '힐트 만 퓌어 우포스 아우스 뎀 알' },
    ]
  },
  {
    id: 's72', title: 'Du Hast', artist: 'Rammstein', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
    links: { youtube: 'https://www.youtube.com/watch?v=W3q8Od5qJio', spotify: 'https://open.spotify.com/search/Du%20Hast%20Rammstein' },
    lines: [
      { original: 'Du', korean: '두' },
      { original: 'Du hast', korean: '두 하스트' },
      { original: 'Du hast mich', korean: '두 하스트 미히' },
      { original: 'Du hast mich gefragt', korean: '두 하스트 미히 게프락트' },
      { original: 'Und ich hab nichts gesagt', korean: '운트 이히 합 니흐츠 게작트' },
    ]
  },
  {
    id: 's73', title: 'Rock Me Amadeus', artist: 'Falco', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#f6d365,#fda085)',
    links: { youtube: 'https://www.youtube.com/watch?v=cVikZ8Oe_XA', spotify: 'https://open.spotify.com/search/Rock%20Me%20Amadeus%20Falco' },
    lines: [
      { original: 'Er war ein Punker', korean: '에어 바어 아인 푼커' },
      { original: 'Und er lebte in der großen Stadt', korean: '운트 에어 렙테 인 데어 그로센 슈타트' },
      { original: 'Es war in Wien', korean: '에스 바어 인 빈' },
      { original: 'War Vienna', korean: '바어 비엔나' },
      { original: 'Rock me Amadeus', korean: '록 미 아마데우스' },
    ]
  },
  {
    id: 's74', title: 'Haus am See', artist: 'Peter Fox', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#84fab0,#8fd3f4)',
    links: { youtube: 'https://www.youtube.com/watch?v=kJen73982SE', spotify: 'https://open.spotify.com/search/Haus%20am%20See%20Peter%20Fox' },
    lines: [
      { original: 'Hier bin ich geboren', korean: '히어 빈 이히 게보렌' },
      { original: 'Und laufe durch die Straßen', korean: '운트 라우페 두르히 디 슈트라센' },
      { original: 'Kenn die Gesichter', korean: '켄 디 게지히터' },
      { original: 'Jedes Haus und jeden Laden', korean: '예데스 하우스 운트 예덴 라덴' },
      { original: 'Ich kenn die Bäume', korean: '이히 켄 디 보이메' },
    ]
  },
  {
    id: 's75', title: 'Das Model', artist: 'Kraftwerk', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#fccb90,#d57eeb)',
    links: { youtube: 'https://www.youtube.com/watch?v=GEnx9xS79Lc', spotify: 'https://open.spotify.com/search/Das%20Model%20Kraftwerk' },
    lines: [
      { original: 'Sie ist ein Model', korean: '지 이스트 아인 모델' },
      { original: 'Und sie sieht gut aus', korean: '운트 지 지트 굿 아우스' },
      { original: 'Ich nehm sie heut gerne mit zu mir nach Haus', korean: '이히 넴 지 호이트 게른 미트 추 미어 나흐 하우스' },
      { original: 'Sie wirkt so kühl', korean: '지 비어크트 조 퀼' },
      { original: 'An sie kommt niemand ran', korean: '안 지 콤트 니만트 란' },
    ]
  },
  {
    id: 's76', title: 'Major Tom', artist: 'Peter Schilling', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#30cfd0,#330867)',
    links: { youtube: 'https://www.youtube.com/watch?v=wO0A0XcWy88', spotify: 'https://open.spotify.com/search/Major%20Tom%20Peter%20Schilling' },
    lines: [
      { original: 'Gründlich durchgecheckt', korean: '그륀틀리히 두르히게첵트' },
      { original: 'Steht sie da', korean: '슈테이트 지 다' },
      { original: 'Und wartet auf den Start', korean: '운트 바르텟 아우프 덴 슈타르트' },
      { original: 'Alles klar', korean: '알레스 클라' },
      { original: 'Major Tom', korean: '메이저 톰' },
    ]
  },
  {
    id: 's77', title: 'Ohne Dich', artist: 'Rammstein', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
    links: { youtube: 'https://www.youtube.com/watch?v=LIPc1cfS-oQ', spotify: 'https://open.spotify.com/search/Ohne%20Dich%20Rammstein' },
    lines: [
      { original: 'Ohne dich kann ich nicht sein', korean: '오네 디히 칸 이히 니히트 자인' },
      { original: 'Ohne dich', korean: '오네 디히' },
      { original: 'Mit dir bin ich auch allein', korean: '미트 디어 빈 이히 아우흐 알라인' },
      { original: 'Ohne dich', korean: '오네 디히' },
      { original: 'Ohne dich zähl ich die Stunden', korean: '오네 디히 첼 이히 디 슈툰덴' },
    ]
  },
  {
    id: 's78', title: 'Atemlos durch die Nacht', artist: 'Helene Fischer', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#5ee7df,#b490ca)',
    links: { youtube: 'https://www.youtube.com/watch?v=haECT-SerHk', spotify: 'https://open.spotify.com/search/Atemlos%20durch%20die%20Nacht%20Helene%20Fischer' },
    lines: [
      { original: 'Atemlos durch die Nacht', korean: '아템로스 두르히 디 나흐트' },
      { original: 'Spür was Liebe mit uns macht', korean: '슈퓨어 바스 리베 미트 운스 마흐트' },
      { original: 'Atemlos schwindelfrei', korean: '아템로스 슈빈델프라이' },
      { original: 'Großes Kino für uns zwei', korean: '그로세스 키노 퓌어 운스 츠바이' },
      { original: 'Wir sind heute ewig', korean: '비어 진트 호이테 에비히' },
    ]
  },
  {
    id: 's79', title: 'Männer', artist: 'Herbert Grönemeyer', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#c3cfe2,#c3cfe2)',
    links: { youtube: 'https://www.youtube.com/watch?v=UEJNMkEr1Ls', spotify: 'https://open.spotify.com/search/M%C3%A4nner%20Herbert%20Gr%C3%B6nemeyer' },
    lines: [
      { original: 'Männer nehmen in den Arm', korean: '멘너 네멘 인 덴 암' },
      { original: 'Männer geben Geborgenheit', korean: '멘너 게벤 게보르겐하이트' },
      { original: 'Männer weinen heimlich', korean: '멘너 바이넨 하임리히' },
      { original: 'Männer brauchen viel Zärtlichkeit', korean: '멘너 브라우헨 필 체어틀리히카이트' },
      { original: 'Oh Männer sind so verletzlich', korean: '오 멘너 진트 조 페를레츨리히' },
    ]
  },
  {
    id: 's80', title: 'Irgendwie Irgendwo Irgendwann', artist: 'Nena', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    links: { youtube: 'https://www.youtube.com/watch?v=oMHLkcc9I9c', spotify: 'https://open.spotify.com/search/Irgendwie%20Irgendwo%20Irgendwann%20Nena' },
    lines: [
      { original: 'Irgendwie irgendwo irgendwann', korean: '이르겐트비 이르겐트보 이르겐트반' },
      { original: 'Fängt die Zukunft an', korean: '펭트 디 추쿤프트 안' },
      { original: 'Ich warte nicht mehr lang', korean: '이히 바르테 니히트 메어 랑' },
      { original: 'Liebe wird aus Mut gemacht', korean: '리베 비어트 아우스 무트 게마흐트' },
      { original: 'Denk nicht lange nach', korean: '덴크 니히트 랑에 나흐' },
    ]
  },
  {
    id: 's81', title: 'Tum Hi Ho', artist: 'Arijit Singh', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#ff6b6b,#4ecdc4)',
    links: { youtube: 'https://www.youtube.com/watch?v=BjL7AuPsmEk', spotify: 'https://open.spotify.com/search/Tum%20Hi%20Ho%20Arijit%20Singh' },
    lines: [
      { original: 'Hum tere bin ab reh nahi sakte', korean: '험 테레 빈 압 레 나히 삭테' },
      { original: 'Tere bina kya wajood mera', korean: '테레 비나 끼야 와주드 메라' },
      { original: 'Tujhse juda gar ho jaayenge', korean: '투즈세 주다 가르 호 자옌게' },
      { original: 'To khud se hi ho jaayenge juda', korean: '토 쿠드 세 히 호 자옌게 주다' },
      { original: 'Kyunki tum hi ho', korean: '큔키 툼 히 호' },
    ]
  },
  {
    id: 's82', title: 'Kal Ho Naa Ho', artist: 'Sonu Nigam', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
    links: { youtube: 'https://www.youtube.com/watch?v=g0eO74UmRBs', spotify: 'https://open.spotify.com/search/Kal%20Ho%20Naa%20Ho%20Sonu%20Nigam' },
    lines: [
      { original: 'Har ghadi badal rahi hai roop zindagi', korean: '하르 가디 바달 라히 하이 루프 진다가' },
      { original: 'Chhaon hai kabhi kabhi hai dhoop zindagi', korean: '차온 하이 카비 카비 하이 두프 진다가' },
      { original: 'Har pal yahan jee bhar jiyo', korean: '하르 팔 야한 지 바르 지요' },
      { original: 'Jo hai sama kal ho naa ho', korean: '조 하이 사마 칼 호 나 호' },
      { original: 'Kal ho naa ho', korean: '칼 호 나 호' },
    ]
  },
  {
    id: 's83', title: 'Chaiyya Chaiyya', artist: 'Sukhwinder Singh', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#f6d365,#fda085)',
    links: { youtube: 'https://www.youtube.com/watch?v=9yT4F8hzykY', spotify: 'https://open.spotify.com/search/Chaiyya%20Chaiyya%20Sukhwinder%20Singh' },
    lines: [
      { original: 'Jinke sar ho ishq ki chaaon', korean: '진케 사르 호 이쉬크 키 차온' },
      { original: 'Paaon ke neeche jannat hogi', korean: '파온 케 니체 잔낫 호기' },
      { original: 'Chal chaiyya chaiyya', korean: '찰 차이야 차이야' },
      { original: 'Chaiyya chaiyya chaiyya chaiyya', korean: '차이야 차이야 차이야 차이야' },
      { original: 'Jinke sar ho ishq ki chaaon', korean: '진케 사르 호 이쉬크 키 차온' },
    ]
  },
  {
    id: 's84', title: 'Jai Ho', artist: 'A.R. Rahman', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#84fab0,#8fd3f4)',
    links: { youtube: 'https://www.youtube.com/watch?v=Yc5OyXmHD0w', spotify: 'https://open.spotify.com/search/Jai%20Ho%20A.R.%20Rahman' },
    lines: [
      { original: 'Jai ho', korean: '자이 호' },
      { original: 'Aaja aaja jind shamiyane ke tale', korean: '아자 아자 진드 샤미야네 케 탈레' },
      { original: 'Aaja zariwale nile aasman ke tale', korean: '아자 자리왈레 닐레 아스만 케 탈레' },
      { original: 'Ratti ratti sachi maine jaan gavayi hai', korean: '라띠 라띠 사치 마이네 잔 가바이 하이' },
      { original: 'Jai ho', korean: '자이 호' },
    ]
  },
  {
    id: 's85', title: 'Tujhe Dekha To', artist: 'Lata Mangeshkar, Kumar Sanu', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#fccb90,#d57eeb)',
    links: { youtube: 'https://www.youtube.com/watch?v=cNV5hLSa9H8', spotify: 'https://open.spotify.com/search/Tujhe%20Dekha%20To%20Lata%20Mangeshkar%20Kumar%20Sanu' },
    lines: [
      { original: 'Tujhe dekha to yeh jaana sanam', korean: '투제 데카 토 예 자나 사남' },
      { original: 'Pyar hota hai deewana sanam', korean: '피야르 호타 하이 디와나 사남' },
      { original: 'Ab yahan se kahan jaayein hum', korean: '압 야한 세 카한 자옌 훔' },
      { original: 'Teri baahon mein mar jaayein hum', korean: '테리 바혼 메인 마르 자옌 훔' },
      { original: 'Tujhe dekha to', korean: '투제 데카 토' },
    ]
  },
  {
    id: 's86', title: 'Teri Meri', artist: 'Rahat Fateh Ali Khan, Shreya Ghoshal', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#30cfd0,#330867)',
    links: { youtube: 'https://www.youtube.com/watch?v=wVakhLyFvPc', spotify: 'https://open.spotify.com/search/Teri%20Meri%20Rahat%20Fateh%20Ali%20Khan%20Shreya%20Ghoshal' },
    lines: [
      { original: 'Teri meri meri teri prem kahani hai mushkil', korean: '테리 메리 메리 테리 프렘 카하니 하이 무쉬킬' },
      { original: 'Do lafzon mein yeh bayaan na ho paaye', korean: '도 라프존 메인 예 바얀 나 호 파예' },
      { original: 'Ik ladka ik ladki ki yeh kahani hai nayi', korean: '익 라드카 익 라드키 키 예 카하니 하이 나이' },
      { original: 'Do roohon ke milne ki yeh nishani hai nayi', korean: '도 루혼 케 밀네 키 예 니샤니 하이 나이' },
      { original: 'Teri meri meri teri', korean: '테리 메리 메리 테리' },
    ]
  },
  {
    id: 's87', title: 'Dil Dhadakne Do', artist: 'Priyanka Chopra, Farhan Akhtar', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
    links: { youtube: 'https://www.youtube.com/watch?v=56ZzM4mz4yY', spotify: 'https://open.spotify.com/search/Dil%20Dhadakne%20Do%20Priyanka%20Chopra%20Farhan%20Akhtar' },
    lines: [
      { original: 'Hey hey chalo na', korean: '헤이 헤이 찰로 나' },
      { original: 'Dhoondhe shehar naya', korean: '둔데 셰하르 나야' },
      { original: 'Jahaan muskurahat ho har jagah', korean: '자한 무스쿠라핫 호 하르 자가' },
      { original: 'Dil dhadakne do', korean: '딜 다닥네 도' },
      { original: 'Dil dhadakne do', korean: '딜 다닥네 도' },
    ]
  },
  {
    id: 's88', title: 'Kun Faya Kun', artist: 'A.R. Rahman, Javed Ali, Mohit Chauhan', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#5ee7df,#b490ca)',
    links: { youtube: 'https://www.youtube.com/watch?v=T94PHkuydcw', spotify: 'https://open.spotify.com/search/Kun%20Faya%20Kun%20A.R.%20Rahman' },
    lines: [
      { original: 'Kun faya kun', korean: '쿤 파야 쿤' },
      { original: 'Kun faya kun', korean: '쿤 파야 쿤' },
      { original: 'Faya kun faya kun', korean: '파야 쿤 파야 쿤' },
      { original: 'Jab kahin pe kuch nahi bhi nahi tha', korean: '잡 카힌 페 쿠치 나히 비 나히 타' },
      { original: 'Wahi tha wahi tha wahi tha', korean: '와히 타 와히 타 와히 타' },
    ]
  },
  {
    id: 's89', title: 'Senorita', artist: 'Farhan Akhtar, Hrithik Roshan, Abhay Deol', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#c3cfe2,#c3cfe2)',
    links: { youtube: 'https://www.youtube.com/watch?v=2Z0Put0teCM', spotify: 'https://open.spotify.com/search/Senorita%20Zindagi%20Na%20Milegi%20Dobara' },
    lines: [
      { original: 'Quien eres tu', korean: '키엔 에레스 투' },
      { original: 'Donde has estado', korean: '돈데 아스 에스타도' },
      { original: 'He removido cielo y tierra y no te encontre', korean: '에 레모비도 씨엘로 이 띠에라 이 노 테 엔콘트레' },
      { original: 'Senorita', korean: '세뇨리타' },
      { original: 'Mujhse ab nazar na phero', korean: '무즈세 압 나자르 나 페로' },
    ]
  },
  {
    id: 's90', title: 'Latika\'s Theme', artist: 'A.R. Rahman', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    links: { youtube: 'https://www.youtube.com/watch?v=EfdVdNPz_ok', spotify: 'https://open.spotify.com/search/Latika%27s%20Theme%20A.R.%20Rahman' },
    lines: [
      { original: 'Aaj ki raat', korean: '아즈 키 라트' },
      { original: 'Na jaane kaun sa nasha hai', korean: '나 자네 카운 사 나샤 하이' },
      { original: 'Raat ka shola', korean: '라트 카 숄라' },
      { original: 'Dil mein ujala', korean: '딜 메인 우잘라' },
      { original: 'Latika', korean: '라티카' },
    ]
  },
  {
    id: 's91', title: 'ลืม', artist: 'Scrubb', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#ff6b6b,#4ecdc4)',
    links: { youtube: 'https://www.youtube.com/watch?v=9YBWypt2o5g', spotify: 'https://open.spotify.com/search/%E0%B8%A5%E0%B8%B7%E0%B8%A1%20Scrubb' },
    lines: [
      { original: 'ลืมไปแล้วหรือยัง', korean: '름 빠이 래오 르양' },
      { original: 'ภาพวันนั้นยังชัดเจน', korean: '팝 완난 양 찻젠' },
      { original: 'เธออยู่ตรงนี้ในใจ', korean: '터 유 뜽니 나이 짜이' },
      { original: 'แม้เวลาจะผ่านไป', korean: '매 웨라 짜 판 빠이' },
      { original: 'ฉันยังลืมไม่ลง', korean: '찬 양 름 마이 롱' },
    ]
  },
  {
    id: 's92', title: 'คิดถึง', artist: 'Bodyslam', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
    links: { youtube: 'https://www.youtube.com/watch?v=jDe3UUFawqs', spotify: 'https://open.spotify.com/search/%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%96%E0%B8%B6%E0%B8%87%20Bodyslam' },
    lines: [
      { original: 'คิดถึงเธอทุกที', korean: '킷틍 터 툭티' },
      { original: 'ในคืนที่ฟ้าเงียบงัน', korean: '나이 큰 티 파 응이엡안' },
      { original: 'ยังมีเรื่องราวของเรา', korean: '양 미 르앙 라오 콩 라오' },
      { original: 'เดินวนอยู่ในความฝัน', korean: '든 원 유 나이 콰암판' },
      { original: 'คิดถึงเหลือเกิน', korean: '킷틍 르아 끈' },
    ]
  },
  {
    id: 's93', title: 'ขอเวลาลืม', artist: 'Aun Feeble Heart', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#f6d365,#fda085)',
    links: { youtube: 'https://www.youtube.com/watch?v=wTynfy69U1U', spotify: 'https://open.spotify.com/search/%E0%B8%82%E0%B8%AD%E0%B9%80%E0%B8%A7%E0%B8%A5%E0%B8%B2%E0%B8%A5%E0%B8%B7%E0%B8%A1%20Aun%20Feeble%20Heart' },
    lines: [
      { original: 'ขอเวลาลืมเธอสักหน่อย', korean: '커 웨라 름 터 삭너이' },
      { original: 'ขอเวลาคืนใจที่พัง', korean: '커 웨라 큰 짜이 티 팡' },
      { original: 'อย่าเพิ่งถามว่าไหวไหม', korean: '야 펑 탐 와 와이 마이' },
      { original: 'แค่ยังหายใจไปวันวัน', korean: '캐 양 하이짜이 빠이 완완' },
      { original: 'ขอเวลาลืมจริงจริง', korean: '커 웨라 름 찡찡' },
    ]
  },
  {
    id: 's94', title: 'กอด', artist: 'Clash', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#84fab0,#8fd3f4)',
    links: { youtube: 'https://www.youtube.com/watch?v=4GmR6c4hiqQ', spotify: 'https://open.spotify.com/search/%E0%B8%81%E0%B8%AD%E0%B8%94%20Clash' },
    lines: [
      { original: 'กอดฉันไว้ให้นานนาน', korean: '껏 찬 와이 하이 난난' },
      { original: 'คืนนี้ฉันไม่อยากเดียวดาย', korean: '큰니 찬 마이 약 디아오다이' },
      { original: 'ถ้าพรุ่งนี้เธอต้องไป', korean: '타 프룽니 터 똥 빠이' },
      { original: 'อย่างน้อยมีฉันในใจ', korean: '양 너이 미 찬 나이 짜이' },
      { original: 'กอดฉันอีกครั้ง', korean: '껏 찬 익 크랑' },
    ]
  },
  {
    id: 's95', title: 'ลมหายใจ', artist: 'Big Ass', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#fccb90,#d57eeb)',
    links: { youtube: 'https://www.youtube.com/watch?v=5H4Lg-rl58U', spotify: 'https://open.spotify.com/search/%E0%B8%A5%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A2%E0%B9%83%E0%B8%88%20Big%20Ass' },
    lines: [
      { original: 'ทุกลมหายใจยังเป็นเธอ', korean: '툭 롬하이짜이 양 벤 터' },
      { original: 'ทุกความทรงจำยังชัดเจน', korean: '툭 콰암송짬 양 찻젠' },
      { original: 'อยู่ไกลแค่ไหนก็ยังรัก', korean: '유 글라이 캐 나이 꺼 양 락' },
      { original: 'ไม่ว่าโลกจะหมุนเร็ว', korean: '마이 와 록 짜 문 레오' },
      { original: 'เธอคือเหตุผลของหัวใจ', korean: '터 큐 헤툰 콩 후어짜이' },
    ]
  },
  {
    id: 's96', title: 'ผิดทั้งหมดทั้งตัว', artist: 'Slot Machine', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#30cfd0,#330867)',
    links: { youtube: 'https://www.youtube.com/watch?v=UZxDLz-li_c', spotify: 'https://open.spotify.com/search/%E0%B8%9C%E0%B8%B4%E0%B8%94%E0%B8%97%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%AB%E0%B8%A1%E0%B8%94%E0%B8%97%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%95%E0%B8%B1%E0%B8%A7%20Slot%20Machine' },
    lines: [
      { original: 'ผิดทั้งหมดทั้งตัวและหัวใจ', korean: '핏 탕못 탕투아 래 후어짜이' },
      { original: 'ที่ฉันยังรักเธอหมดใจ', korean: '티 찬 양 락 터 못짜이' },
      { original: 'ยอมรับความจริงไม่ไหว', korean: '염랍 콰암찡 마이 와이' },
      { original: 'ปล่อยฉันจมอยู่ในคืนยาว', korean: '쁠로이 찬 좀 유 나이 큰 야오' },
      { original: 'ผิดที่รักเธอเกินไป', korean: '핏 티 락 터 끈 빠이' },
    ]
  },
  {
    id: 's97', title: 'ฤดูที่ฉันเหงา', artist: 'Stamp', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
    links: { youtube: 'https://www.youtube.com/watch?v=h2ga9eGdzs0', spotify: 'https://open.spotify.com/search/%E0%B8%A4%E0%B8%94%E0%B8%B9%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%89%E0%B8%B1%E0%B8%99%E0%B9%80%E0%B8%AB%E0%B8%87%E0%B8%B2%20Stamp' },
    lines: [
      { original: 'ในฤดูที่ฉันเหงา', korean: '나이 르두 티 찬 응아오' },
      { original: 'มีเพียงเงาของเรา', korean: '미 피앙 응아 콩 라오' },
      { original: 'ฝนตกเบาเบาในหัวใจ', korean: '폰 똑 바오바오 나이 후어짜이' },
      { original: 'ถนนเดิมยังพาไป', korean: '타논 드엄 양 파 빠이' },
      { original: 'หาคนที่ไม่กลับมา', korean: '하 콘 티 마이 글랍 마' },
    ]
  },
  {
    id: 's98', title: 'รักแท้มีจริงหรือเปล่า', artist: 'Potato', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#5ee7df,#b490ca)',
    links: { youtube: 'https://www.youtube.com/watch?v=79qwUtFnpJs', spotify: 'https://open.spotify.com/search/%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%81%E0%B8%97%E0%B9%89%E0%B8%A1%E0%B8%B5%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%87%E0%B8%AB%E0%B8%A3%E0%B8%B7%E0%B8%AD%E0%B9%80%E0%B8%9B%E0%B8%A5%E0%B9%88%E0%B8%B2%20Potato' },
    lines: [
      { original: 'รักแท้มีจริงหรือเปล่า', korean: '락 태 미 찡 르 프라오' },
      { original: 'หรือเป็นแค่คำสวยงาม', korean: '르 벤 캐 캄 수아이응암' },
      { original: 'ฉันรออยู่ทุกคืนดาว', korean: '찬 러 유 툭 큰 다오' },
      { original: 'หวังว่ามันจะเป็นความจริง', korean: '왕 와 만 짜 벤 콰암찡' },
      { original: 'ตอบฉันทีได้ไหม', korean: '똡 찬 티 다이 마이' },
    ]
  },
  {
    id: 's99', title: 'ยิ่งรู้จัก ยิ่งรักเธอ', artist: 'Getsunova', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#c3cfe2,#c3cfe2)',
    links: { youtube: 'https://www.youtube.com/watch?v=v5wvIGxvdLI', spotify: 'https://open.spotify.com/search/%E0%B8%A2%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B8%A3%E0%B8%B9%E0%B9%89%E0%B8%88%E0%B8%B1%E0%B8%81%20%E0%B8%A2%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%98%E0%B8%AD%20Getsunova' },
    lines: [
      { original: 'ยิ่งรู้จักยิ่งรักเธอ', korean: '잉 루짝 잉 락 터' },
      { original: 'ยิ่งเจอยิ่งคิดถึง', korean: '잉 저 잉 킷틍' },
      { original: 'ทุกนาทีที่มีเธอ', korean: '툭 나티 티 미 터' },
      { original: 'ทำให้ใจฉันเต้นแรง', korean: '탐 하이 짜이 찬 뗀 랭' },
      { original: 'รักเธอมากขึ้นทุกวัน', korean: '락 터 막 큰 툭 완' },
    ]
  },
  {
    id: 's100', title: 'Dhoom Dhoom', artist: 'Tata Young', emoji: '🎵',
    gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    links: { youtube: 'https://www.youtube.com/watch?v=CGn0Ww_WvME', spotify: 'https://open.spotify.com/search/Dhoom%20Dhoom%20Tata%20Young' },
    lines: [
      { original: 'Dhoom dhoom come and light my fire', korean: '둠 둠 컴 앤 라이트 마이 파이어' },
      { original: 'Dhoom dhoom let me take you higher', korean: '둠 둠 렛 미 테이크 유 하이어' },
      { original: 'Dhoom dhoom I wanna feel that burn', korean: '둠 둠 아이 워너 필 댓 번' },
      { original: 'Dhoom dhoom baby make me turn', korean: '둠 둠 베이비 메이크 미 턴' },
      { original: 'Dhoom dhoom all night long', korean: '둠 둠 올 나이트 롱' },
    ]
  },
];
