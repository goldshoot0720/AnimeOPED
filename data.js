// 新番 OP・ED 目錄。
// 新增作品：放進相同 year / month 的 anime。沒有該月份就另開一筆。
// youtube 是該動畫的 OP 或 ED，不以歌曲長度區分。
// 月份以該動畫開播為準，不以單曲發售日為準。
// 同一位歌手的舊作主題歌，不要改掛到新動畫。
// full 只在另外指定完整版時才填。
// extras 放同一首的其他影片，例如 MV，每筆要有 label。
// 三者都可填完整網址，或只填 v= 後面的 11 碼。
// youtubeLabel、fullLabel 可改顯示名稱，例如某個版本的 OP。
var CATALOG = [
  {
    year: 2026,
    month: 10,
    anime: [
      {
        id: "fx-kurumi-chan",
        title: "FX戦士くるみちゃん",
        kana: "エフエックスせんしくるみちゃん",
        start: "2026-10-01",
        studio: "パッショーネ",
        official: "https://fxkurumi-info.com/",
        themes: [
          {
            role: "OP",
            title: "FX戦士くるみちゃん",
            artist: "福賀くるみ（CV：鈴木愛奈）",
            credits: [
              { label: "作詞", value: "早田仁知、酒井拓也、傳田有矢、山本恭平" },
              { label: "作曲", value: "酒井拓也、傳田有矢、早田仁知、山本恭平" },
              { label: "編曲", value: "傳田有矢、酒井拓也" },
            ],
            youtube: "https://www.youtube.com/watch?v=OiQo6YyJ_pM",
            full: "https://www.youtube.com/watch?v=qMBUKqWRzbs",
          },
          {
            role: "ED",
            title: "＄・￥・€",
            reading: "ドル・エン・ユーロ",
            artist: "福賀くるみ（CV：鈴木愛奈）",
            credits: [
              { label: "作詞・作曲", value: "早田仁知" },
              { label: "編曲", value: "星銀乃丈" },
            ],
            youtube: "https://www.youtube.com/watch?v=EHtmKYQSKTQ",
            full: "https://www.youtube.com/watch?v=uVglVUCSzNo",
          },
        ],
      },
      {
        id: "nama-anaru",
        title: "生徒会にも穴はある！",
        kana: "せいとかいにもあなはある",
        start: "2026-10-03",
        studio: "パッショーネ",
        official: "https://nama-anaru.com/",
        themes: [
          {
            role: "OP",
            title: "風の中は走るっきゃないっ！",
            artist: "三月のパンタシア",
            youtubeLabel: "藤成学園へようこそver.",
            credits: [
              { label: "作詞", value: "みあ、の子" },
              { label: "作曲", value: "の子" },
              { label: "編曲", value: "堀江晶太" },
            ],
            youtube: "https://www.youtube.com/watch?v=nX3FfUIiAA0",
            extras: [
              {
                label: "MV",
                youtube: "https://www.youtube.com/watch?v=rNbXIeLdU0M",
              },
            ],
          },
        ],
      },
    ],
  },
];
