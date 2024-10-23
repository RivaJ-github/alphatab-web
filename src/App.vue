<script setup lang="ts">
import * as AlphaTab from "@coderline/alphatab";
import { onMounted } from "vue";
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
    // file: "https://www2.alphatab.net/files/canon.gp",
    file: "./回不去的夏天-总谱.gp",
    player: {
      enablePlayer: true,
      soundFont:
        "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2",
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
  <AtOverlay />
  <div class="at-content">
    <div class="at-sidebar">
      <div class="at-sidebar-content">
        <TrackList />
      </div>
    </div>
    <div class="at-viewport">
      <div class="at-main"></div>
    </div>
  </div>

  <AtControls />
</template>

<style>
</style>