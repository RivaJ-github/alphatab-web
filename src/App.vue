<script setup lang="ts">
import { onMounted } from "vue";
import { Analytics } from "@vercel/analytics/vue"
import { useAPI } from "./composables/useAPI";
import TrackList from "./components/TrackList.vue";
import AtOverlay from "./components/AtOverlay.vue";
import AtControls from "./components/AtControls.vue";
import globalState from "./store/globalState";

const { init } = useAPI()

onMounted(() => {
  // load elements
  const wrapper = document.querySelector(".at-wrap");
  const main = wrapper!.querySelector(".at-main") as HTMLElement;

  // initialize alphatab
  const settings = {
    player: {
      enablePlayer: true,
      soundFont: './assets/soundfont/sonivox.sf2',
        // "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2",
      scrollElement: wrapper!.querySelector(".at-viewport"), // this is the element to scroll during playback
    },
  };
  init(main, settings);

  const api = globalState.api
  if (!api) {
    throw Error('初始化失败！')
  }
});
</script>

<template>
  <Analytics />
  
  <AtOverlay />

  <div class="at-content">
    <TrackList />
    <div class="at-viewport">
      <div class="at-main"></div>
    </div>
  </div>

  <AtControls />
</template>

<style>
.at-content {
  position: relative;
  overflow: hidden;
  height: calc(100% - 48px);
  flex: 1 1 auto;
}

.at-viewport {
  overflow-y: auto;
  position: absolute;
  top: 0;
  left: 70px;
  right: 0;
  bottom: 0;
  padding-right: 20px;
}
.at-footer {
  flex: 0 0 auto;
  background: #436d9d;
  color: #fff;
}

.at-cursor-bar {
  /* Defines the color of the bar background when a bar is played */
  background: rgba(255, 242, 0, 0.25);
}

.at-selection div {
  /* Defines the color of the selection background */
  background: rgba(64, 64, 255, 0.1);
}

.at-cursor-beat {
  /* Defines the beat cursor */
  background: rgba(64, 64, 255, 0.75);
  width: 3px;
}

.at-highlight * {
  /* Defines the color of the music symbols when they are being played (svg) */
  fill: #0078ff;
  stroke: #0078ff;
}

.at-controls .btn.disabled {
  cursor: progress;
  opacity: 0.5;
}
</style>