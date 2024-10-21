<script setup lang="ts">
import * as alphaTab from "@coderline/alphatab";
import { onMounted, ref } from "vue";

const init = () => {
  // load elements
  const wrapper = document.querySelector(".at-wrap");
  const main = wrapper!.querySelector(".at-main");

  // initialize alphatab
  const settings = {
    // file: "https://www2.alphatab.net/files/canon.gp",
    file: "./回不去的夏天-总谱.gp",
    player: {
      enablePlayer: true,
      soundFont:
        "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2",
      scrollElement: wrapper.querySelector(".at-viewport"), // this is the element to scroll during playback
    },
  };
  const api = new alphaTab.AlphaTabApi(main, settings);

  // overlay logic
  const overlay = wrapper!.querySelector(".at-overlay");
  api.renderStarted.on(() => {
    overlay!.style.display = "flex";
  });
  api.renderFinished.on(() => {
    overlay!.style.display = "none";
  });

  // track selector
  function createTrackItem(track) {
    const trackItem = document
      .querySelector("#at-track-template")
      .content.cloneNode(true).firstElementChild;
    trackItem.querySelector(".at-track-name").innerText = track.name;
    trackItem.track = track;
    trackItem.onclick = (e) => {
      e.stopPropagation();
      api.renderTracks([track]);
    };
    return trackItem;
  }
  const trackList = wrapper!.querySelector(".at-track-list");
  api.scoreLoaded.on((score) => {
    // clear items
    trackList!.innerHTML = "";
    // generate a track item for all tracks of the score
    score.tracks.forEach((track) => {
      trackList!.appendChild(createTrackItem(track));
    });
  });
  api.renderStarted.on(() => {
    // collect tracks being rendered
    const tracks = new Map();
    api.tracks.forEach((t) => {
      tracks.set(t.index, t);
    });
    // mark the item as active or not
    const trackItems = trackList!.querySelectorAll(".at-track");
    trackItems.forEach((trackItem) => {
      if (tracks.has(trackItem.track.index)) {
        trackItem.classList.add("active");
      } else {
        trackItem.classList.remove("active");
      }
    });
  });

  /** Song Info */
  api.scoreLoaded.on((score) => {
    wrapper.querySelector(".at-song-title").innerText = score.title;
    wrapper.querySelector(".at-song-artist").innerText = score.artist;
  });

  /** Count-In and Metronome 计数和节拍器 */
  const countIn = wrapper.querySelector(".at-controls .at-count-in");
  countIn.onclick = () => {
    countIn.classList.toggle("active");
    if (countIn.classList.contains("active")) {
      api.countInVolume = 1;
    } else {
      api.countInVolume = 0;
    }
  };

  const metronome = wrapper.querySelector(".at-controls .at-metronome");
  metronome.onclick = () => {
    metronome.classList.toggle("active");
    if (metronome.classList.contains("active")) {
      api.metronomeVolume = 1;
    } else {
      api.metronomeVolume = 0;
    }
  };

  /** 循环 */
  const loop = wrapper.querySelector(".at-controls .at-loop");
  loop.onclick = () => {
    loop.classList.toggle("active");
    api.isLooping = loop.classList.contains("active");
  };

  /** 打印 */
  wrapper.querySelector(".at-controls .at-print").onclick = () => {
    api.print();
  };

  /** zoom */
  const zoom = wrapper.querySelector(".at-controls .at-zoom select");
  zoom.onchange = () => {
    const zoomLevel = parseInt(zoom.value) / 100;
    api.settings.display.scale = zoomLevel;
    api.updateSettings();
    api.render();
  };

  /** Layout */
  const layout = wrapper.querySelector(".at-controls .at-layout select");
  layout.onchange = () => {
    switch (layout.value) {
      case "horizontal":
        api.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal;
        break;
      case "page":
        api.settings.display.layoutMode = alphaTab.LayoutMode.Page;
        break;
    }
    api.updateSettings();
    api.render();
  };

  const playerIndicator = wrapper.querySelector(
    ".at-controls .at-player-progress"
  );
  api.soundFontLoad.on((e) => {
    const percentage = Math.floor((e.loaded / e.total) * 100);
    playerIndicator.innerText = percentage + "%";
  });
  api.playerReady.on(() => {
    playerIndicator.style.display = "none";
  });

  const playPause = wrapper.querySelector(".at-controls .at-player-play-pause");
  const stop = wrapper.querySelector(".at-controls .at-player-stop");
  playPause.onclick = (e) => {
    if (e.target.classList.contains("disabled")) {
      return;
    }
    api.playPause();
  };
  stop.onclick = (e) => {
    if (e.target.classList.contains("disabled")) {
      return;
    }
    api.stop();
  };
  api.playerReady.on(() => {
    playPause.classList.remove("disabled");
    stop.classList.remove("disabled");
  });
  api.playerStateChanged.on((e) => {
    const icon = playPause.querySelector("i.fas");
    if (e.state === alphaTab.synth.PlayerState.Playing) {
      icon.classList.remove("fa-play");
      icon.classList.add("fa-pause");
    } else {
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
    }
  });

  function formatDuration(milliseconds) {
    let seconds = milliseconds / 1000;
    const minutes = (seconds / 60) | 0;
    seconds = (seconds - minutes * 60) | 0;
    return (
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
    );
  }

  /** 进度条 */
  const songPosition = wrapper.querySelector(".at-song-position");
  let previousTime = -1;
  api.playerPositionChanged.on((e) => {
    // reduce number of UI updates to second changes.
    const currentSeconds = (e.currentTime / 1000) | 0;
    if (currentSeconds == previousTime) {
      return;
    }

    songPosition.innerText =
      formatDuration(e.currentTime) + " / " + formatDuration(e.endTime);
  });
};

onMounted(init);
</script>

<template>
  <div class="at-overlay">
    <div class="at-overlay-content">Music sheet is loading</div>
  </div>
  <div class="at-content">
    <div class="at-sidebar">
      <div class="at-sidebar-content">
        <div class="at-track-list"></div>
      </div>
    </div>
    <div class="at-viewport">
      <div class="at-main"></div>
    </div>
  </div>

  <div class="at-controls">
    <div class="at-controls-left">
      <a class="btn at-player-stop disabled">
        <i class="fas fa-step-backward"></i>
      </a>
      <a class="btn at-player-play-pause disabled">
        <i class="fas fa-play"></i>
      </a>
      <span class="at-player-progress">0%</span>
      <div class="at-song-info">
        <span class="at-song-title"></span> -
        <span class="at-song-artist"></span>
      </div>
      <div class="at-song-position">00:00 / 00:00</div>
    </div>
    <div class="at-controls-right">
      <a class="btn toggle at-count-in">
        <i class="fas fa-hourglass-half"></i>
      </a>
      <a class="btn at-metronome">
        <i class="fas fa-edit"></i>
      </a>
      <a class="btn at-loop">
        <i class="fas fa-retweet"></i>
      </a>
      <a class="btn at-print">
        <i class="fas fa-print"></i>
      </a>
      <div class="at-zoom">
        <i class="fas fa-search"></i>
        <select>
          <option value="25">25%</option>
          <option value="50">50%</option>
          <option value="75">75%</option>
          <option value="90">90%</option>
          <option value="100" selected>100%</option>
          <option value="110">110%</option>
          <option value="125">125%</option>
          <option value="150">150%</option>
          <option value="200">200%</option>
        </select>
      </div>
      <div class="at-layout">
        <select>
          <option value="horizontal">Horizontal</option>
          <option value="page" selected>Page</option>
        </select>
      </div>
    </div>
  </div>

  <template id="at-track-template">
    <div class="at-track">
      <div class="at-track-icon">
        <i class="fas fa-guitar"></i>
      </div>
      <div class="at-track-details">
        <div class="at-track-name"></div>
      </div>
    </div>
  </template>
</template>