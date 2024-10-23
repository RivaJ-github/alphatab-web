<script setup lang="ts">
import * as AlphaTab from "@coderline/alphatab";
import { useAPI } from "@/composables/useAPI";
import globalState from "@/store/globalState";

const { baseInfo, isPlayerReady, fontLoadPercent } = useAPI();

const handleSwitchCountIn = () => {
  const newCountInVolume = baseInfo.value.countInVolume === 1 ? 0 : 1;
  globalState.api!.countInVolume = baseInfo.value.countInVolume =
    newCountInVolume;
};

const handleSwitchMetronome = () => {
  const newMetronomeVolume = baseInfo.value.metronomeVolume === 1 ? 0 : 1;
  globalState.api!.metronomeVolume = baseInfo.value.metronomeVolume =
    newMetronomeVolume;
};

const handleSwitchLoop = () => {
  const newIsLooping = !baseInfo.value.isLooping;
  globalState.api!.isLooping = baseInfo.value.isLooping = newIsLooping;
};

const handlePrint = () => {
  globalState.api!.print();
};

const handleChangeZoom = (e: any) => {
  globalState.api!.settings.display.scale = parseInt(e.target!.value) / 100;
  globalState.api!.updateSettings();
  globalState.api!.render();
};

const handleChangeLayout = (e: any) => {
  switch (e.target.value) {
    case "horizontal":
      globalState.api!.settings.display.layoutMode = AlphaTab.LayoutMode.Horizontal;
      break;
    case "page":
      globalState.api!.settings.display.layoutMode = AlphaTab.LayoutMode.Page;
      break;
  }
  globalState.api!.updateSettings();
  globalState.api!.render();
};

const handleStop = () => {
  if (!isPlayerReady) return
  globalState.api!.stop()
}
const handlePlayPause = () => {
  if (!isPlayerReady) return
  globalState.api!.playPause()
}
</script>

<template>
  <div class="at-controls">
    <div class="at-controls-left">
      <a class="btn at-player-stop" @click="handleStop">
        <i class="fas fa-step-backward"></i>
      </a>
      <a class="btn at-player-play-pause" @click="handlePlayPause">
        <i :class="`fas fa-${baseInfo.state === AlphaTab.synth.PlayerState.Playing ? 'pause' : 'play'}`"></i>
      </a>
      <span class="at-player-progress" v-if="!isPlayerReady">{{ fontLoadPercent }}%</span>
      <div class="at-song-info">
        <span class="at-song-title">{{ baseInfo.title }}</span> -
        <span class="at-song-artist">{{ baseInfo.artist }}</span>
      </div>
      <div class="at-song-position">{{ baseInfo.songPosition }}</div>
    </div>
    <div class="at-controls-right">
      <!-- 预备拍 -->
      <a
        class="btn toggle at-count-in"
        :class="{ active: baseInfo.countInVolume === 1 }"
        @click="handleSwitchCountIn"
      >
        <i class="fas fa-hourglass-half"></i>
      </a>
      <!-- 节拍器 -->
      <a
        class="btn at-metronome"
        :class="{ active: baseInfo.metronomeVolume === 1 }"
        @click="handleSwitchMetronome"
      >
        <i class="fas fa-edit"></i>
      </a>
      <!-- 循环 -->
      <a
        class="btn at-loop"
        :class="{ active: baseInfo.isLooping }"
        @click="handleSwitchLoop"
      >
        <i class="fas fa-retweet"></i>
      </a>
      <!-- 打印 -->
      <a class="btn at-print" @click="handlePrint">
        <i class="fas fa-print"></i>
      </a>
      <!-- 缩放 -->
      <div class="at-zoom">
        <select @change="handleChangeZoom">
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
      <!-- 方向 -->
      <div class="at-layout" @click="handleChangeLayout">
        <select>
          <option value="horizontal">Horizontal</option>
          <option value="page" selected>Vertical</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style>
.at-controls {
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  background: #436d9d;
  color: #fff;
}
.at-controls > div {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
}
.at-controls > div > * {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
  margin: 0 3px;
}
.at-controls .btn {
  color: #fff;
  border-radius: 0;
  height: 40px;
  width: 40px;
  height: 40px;
  font-size: 16px;
}
.at-controls a.active {
  background: #5588c7;
  text-decoration: none;
}
.at-controls .btn i {
  vertical-align: top;
}
.at-controls select {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  border: none;
  width: 100%;
  height: 40px;
  background: #436d9d;
  padding: 4px 10px;
  color: #fff;
  font-size: 16px;
  text-align-last: center;
  text-align: center;
  -ms-text-align-last: center;
  -moz-text-align-last: center;
  cursor: pointer;
}

.at-song-title {
  font-weight: bold;
}
</style>
