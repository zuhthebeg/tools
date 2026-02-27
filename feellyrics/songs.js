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
];
