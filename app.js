(function () {
  var COUR = { 1: "冬番", 4: "春番", 7: "夏番", 10: "秋番" };
  var ROLE = { OP: "開場曲", ED: "片尾曲" };

  var seasons = CATALOG.slice().sort(function (a, b) {
    return b.year - a.year || b.month - a.month;
  });

  var nav = document.getElementById("season-nav");
  var summary = document.getElementById("summary");
  var list = document.getElementById("list");
  var search = document.getElementById("q");

  function seasonKey(season) {
    return season.year + "-" + String(season.month).padStart(2, "0");
  }

  function videoId(value) {
    var text = String(value || "").trim();
    var matched = text.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
    if (matched) return matched[1];
    if (/^[A-Za-z0-9_-]{11}$/.test(text)) return text;
    return "";
  }

  function formatDate(iso) {
    var parts = String(iso || "").split("-");
    if (parts.length !== 3) return iso || "";
    return Number(parts[0]) + "年" + Number(parts[1]) + "月" + Number(parts[2]) + "日";
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function currentKey() {
    var id = location.hash.replace(/^#/, "");
    for (var i = 0; i < seasons.length; i++) {
      if (seasonKey(seasons[i]) === id) return id;
    }
    return seasons.length ? seasonKey(seasons[0]) : "";
  }

  function activeSeason() {
    var key = currentKey();
    for (var i = 0; i < seasons.length; i++) {
      if (seasonKey(seasons[i]) === key) return seasons[i];
    }
    return null;
  }

  function haystack(anime) {
    var parts = [anime.title, anime.kana, anime.studio];
    (anime.themes || []).forEach(function (theme) {
      parts.push(
        theme.role,
        theme.title,
        theme.reading,
        theme.artist,
        theme.full,
        theme.youtubeLabel,
        theme.fullLabel
      );
      (theme.extras || []).forEach(function (extra) {
        if (!extra) return;
        parts.push(extra.label, extra.youtube);
      });
      (theme.credits || []).forEach(function (credit) {
        parts.push(credit.label, credit.value);
      });
    });
    return parts.join(" ").toLowerCase();
  }

  function renderNav() {
    nav.innerHTML = seasons
      .map(function (season) {
        var key = seasonKey(season);
        var cour = COUR[season.month] || "番組";
        var count = (season.anime || []).length;
        var pressed = key === currentKey();
        return (
          '<button type="button" class="season' +
          (pressed ? " is-active" : "") +
          '" data-season="' +
          esc(key) +
          '" aria-pressed="' +
          pressed +
          '">' +
          '<span class="season-kicker">' +
          esc(season.year + " " + cour) +
          "</span>" +
          '<span class="season-month">' +
          esc(season.month + "月") +
          "</span>" +
          '<span class="season-count">' +
          count +
          " 部</span>" +
          "</button>"
        );
      })
      .join("");
  }

  function renderTheme(theme) {
    var role = theme.role || "";
    var roleName = ROLE[role] || role;
    var clips = [];
    if (theme.youtube) {
      clips.push({
        label: theme.youtubeLabel || "映像",
        youtube: theme.youtube,
        custom: Boolean(theme.youtubeLabel),
      });
    }
    (theme.extras || []).forEach(function (extra) {
      if (!extra || !extra.youtube) return;
      clips.push({
        label: extra.label || "映像",
        youtube: extra.youtube,
        custom: Boolean(extra.label),
      });
    });
    if (theme.full) {
      clips.push({
        label: theme.fullLabel || "完整版",
        youtube: theme.full,
        custom: Boolean(theme.fullLabel),
      });
    }
    var named =
      clips.length > 1 ||
      clips.some(function (clip) {
        return clip.custom || clip.label === "完整版";
      });

    var players = clips
      .map(function (clip) {
        var clipId = videoId(clip.youtube);
        var aria =
          "播放" +
          (named ? clip.label + " " : "") +
          role + " " +
          "「" +
          theme.title +
          "」";
        var caption = (named ? clip.label + "・" : "") + (theme.title || "");
        var player = clipId
          ? '<button type="button" class="screen" data-video="' +
            esc(clipId) +
            '" data-caption="' +
            esc(caption) +
            '" aria-haspopup="dialog" aria-label="' +
            esc(aria) +
            '">' +
            '<img alt="" src="https://i.ytimg.com/vi/' +
            esc(clipId) +
            '/mqdefault.jpg" />' +
            '<span class="play" aria-hidden="true"></span>' +
            "</button>"
          : '<p class="missing">尚未收錄影片</p>';
        return (
          '<div class="clip">' +
          player +
          (named ? '<p class="clip-label">' + esc(clip.label) + "</p>" : "") +
          "</div>"
        );
      })
      .join("");

    if (!players) players = '<p class="missing">尚未收錄影片</p>';
    else players = '<div class="clips">' + players + "</div>";

    var links = clips
      .map(function (clip) {
        var clipId = videoId(clip.youtube);
        var href = clipId ? "https://www.youtube.com/watch?v=" + clipId : clip.youtube;
        if (!href) return "";
        var text = clips.length > 1 ? clip.label + " YouTube" : "在 YouTube 開啟";
        return (
          '<a class="outlink" href="' +
          esc(href) +
          '" target="_blank" rel="noopener noreferrer">' +
          esc(text) +
          "</a>"
        );
      })
      .join("");

    var reading = theme.reading
      ? '<p class="reading">' + esc(theme.reading) + "</p>"
      : "";

    var credits = (theme.credits || [])
      .map(function (credit) {
        return "<div><dt>" + esc(credit.label) + "</dt><dd>" + esc(credit.value) + "</dd></div>";
      })
      .join("");

    return (
      '<section class="theme theme-' +
      esc(String(role).toLowerCase()) +
      '">' +
      '<p class="role"><b>' +
      esc(role) +
      "</b> " +
      esc(roleName) +
      "</p>" +
      players +
      '<h3 class="song" lang="ja">' +
      esc(theme.title) +
      "</h3>" +
      reading +
      '<p class="artist">' +
      esc(theme.artist) +
      "</p>" +
      (credits ? '<dl class="credits">' + credits + "</dl>" : "") +
      (links ? '<p class="outlinks">' + links + "</p>" : "") +
      "</section>"
    );
  }

  function renderShow(anime, index) {
    var bits = [];
    if (anime.start) bits.push("<span>" + esc(formatDate(anime.start) + " 開播") + "</span>");
    if (anime.studio) bits.push("<span>" + esc(anime.studio) + "</span>");
    if (anime.official) {
      bits.push(
        '<a href="' +
          esc(anime.official) +
          '" target="_blank" rel="noopener noreferrer">官方網站</a>'
      );
    }

    var themes = (anime.themes || []).map(renderTheme).join("");

    return (
      '<article class="show" id="' +
      esc(anime.id || "") +
      '">' +
      '<header class="show-head">' +
      '<span class="index">' +
      String(index).padStart(2, "0") +
      "</span>" +
      "<div>" +
      (anime.kana ? '<p class="kana" lang="ja">' + esc(anime.kana) + "</p>" : "") +
      '<h2 lang="ja">' +
      esc(anime.title) +
      "</h2>" +
      (bits.length ? '<p class="show-meta">' + bits.join("") + "</p>" : "") +
      "</div></header>" +
      '<div class="themes">' +
      themes +
      "</div></article>"
    );
  }

  function render() {
    renderNav();
    var season = activeSeason();
    var query = search.value.trim().toLowerCase();

    if (!season) {
      summary.textContent = "";
      list.innerHTML = '<p class="empty">尚未收錄任何月份。</p>';
      return;
    }

    var indexed = (season.anime || []).map(function (anime, i) {
      return { anime: anime, n: i + 1 };
    });
    var visible = indexed.filter(function (item) {
      return !query || haystack(item.anime).indexOf(query) !== -1;
    });

    var cour = COUR[season.month] || "";
    var head = season.year + "年" + season.month + "月" + (cour ? "（" + cour + "）" : "");
    document.title = head + "｜新番 OP・ED 整理";
    summary.textContent = query
      ? head + "・找到 " + visible.length + " 部"
      : head + "・" + indexed.length + " 部作品";

    if (!visible.length) {
      list.innerHTML =
        '<p class="empty">沒有符合「' + esc(search.value.trim()) + "」的作品。</p>";
      return;
    }

    list.innerHTML = visible
      .map(function (item) {
        return renderShow(item.anime, item.n);
      })
      .join("");
  }

  nav.addEventListener("click", function (event) {
    var button = event.target.closest("[data-season]");
    if (!button) return;
    var key = button.getAttribute("data-season");
    if (location.hash === "#" + key) render();
    else location.hash = key;
  });

  var viewer = document.getElementById("viewer");
  var viewerStage = viewer.querySelector(".viewer-stage");
  var viewerCaption = viewer.querySelector(".viewer-caption");
  var viewerOpener = null;

  function closeViewer() {
    if (viewer.open) viewer.close();
  }

  var viewerLarge = false;

  function fitViewer() {
    var fit = viewerStage.querySelector(".viewer-fit");
    var scale = viewerStage.querySelector(".viewer-scale");
    if (!fit || !scale || !viewerLarge) return;
    var width = fit.clientWidth;
    if (!width) return;
    scale.style.transform = "scale(" + width / 1920 + ")";
  }

  function openViewer(button) {
    var id = button.getAttribute("data-video");
    var label = button.getAttribute("aria-label") || "YouTube";
    viewerOpener = button;
    viewerCaption.textContent = button.getAttribute("data-caption") || "";
    viewerStage.replaceChildren();
    viewerLarge = false;
    if (!viewer.open) viewer.showModal();

    var fit = document.createElement("div");
    fit.className = "viewer-fit";
    var scale = document.createElement("div");
    scale.className = "viewer-scale";
    var frame = document.createElement("iframe");
    frame.className = "screen-frame";
    frame.title = label;
    frame.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.setAttribute("allowfullscreen", "");
    scale.appendChild(frame);
    fit.appendChild(scale);
    viewerStage.appendChild(fit);

    var width = fit.clientWidth;
    // YouTube 依播放器尺寸選畫質。先以 1920×1080 載入再縮小，預設才會優先 1080p。
    if (width >= 960) {
      viewerLarge = true;
      scale.style.width = "1920px";
      scale.style.height = "1080px";
      frame.width = 1920;
      frame.height = 1080;
      frame.style.width = "1920px";
      frame.style.height = "1080px";
      fitViewer();
    }

    frame.src =
      "https://www.youtube-nocookie.com/embed/" +
      encodeURIComponent(id) +
      "?autoplay=1&rel=0&vq=hd1080";
    viewer.querySelector(".viewer-close").focus();
  }

  list.addEventListener("click", function (event) {
    var button = event.target.closest(".screen");
    if (!button) return;
    openViewer(button);
  });

  viewer.querySelector(".viewer-close").addEventListener("click", closeViewer);
  viewer.addEventListener("click", function (event) {
    if (event.target === viewer) closeViewer();
  });
  viewer.addEventListener("close", function () {
    viewerLarge = false;
    viewerStage.replaceChildren();
    viewerCaption.textContent = "";
    if (viewerOpener) viewerOpener.focus();
  });
  window.addEventListener("resize", fitViewer);

  search.addEventListener("input", render);
  document.querySelector(".search").addEventListener("submit", function (event) {
    event.preventDefault();
  });
  window.addEventListener("hashchange", render);

  render();
})();
