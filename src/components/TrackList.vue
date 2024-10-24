<script setup lang="ts">
import globalState from "@/store/globalState";
import { useAPI } from "@/composables/useAPI";
import { ref } from "vue";

const { trackOptionList, activeTrackSet } = useAPI();

const isExpand = ref(false);

document.body.addEventListener('click', () => {
  isExpand.value = false
})

const handleChangeTrack = (e: any, id: number) => {
  e.stopPropagation()
  if (!isExpand.value) {
    return
  }
  if (activeTrackSet.value.has(id)) return;
  globalState.api!.renderTracks(
    globalState.trackList!.filter((track) => track.index == id)
  );
};

const handleChangeVolume = (id: number, volume: number) => {
  console.log('volume', volume)
  const op = trackOptionList.value.filter(op => op.id === id)[0]
  const track = globalState.trackList!.filter((track) => track.index == id)[0]
  globalState.api!.player?.setChannelVolume(track.playbackInfo.primaryChannel, volume)
  globalState.api!.player?.setChannelVolume(track.playbackInfo.secondaryChannel, volume)
  op.volume = volume
}

const setChannelMute = (e: MouseEvent, id: number) => {
  e.stopPropagation()
  const op = trackOptionList.value.filter(op => op.id === id)[0]
  const track = globalState.trackList!.filter((track) => track.index == id)[0]
  globalState.api!.player?.setChannelMute(track.playbackInfo.primaryChannel, !op.mute)
  globalState.api!.player?.setChannelMute(track.playbackInfo.secondaryChannel, !op.mute)
  op.mute = !op.mute
}

const setChannelSolo = (e: MouseEvent, id: number) => {
  e.stopPropagation()
  const op = trackOptionList.value.filter(op => op.id === id)[0]
  const track = globalState.trackList!.filter((track) => track.index == id)[0]
  globalState.api!.player?.setChannelSolo(track.playbackInfo.primaryChannel, !op.solo)
  globalState.api!.player?.setChannelSolo(track.playbackInfo.secondaryChannel, !op.solo)
  op.solo = !op.solo
}

const triggerExpand = (e: any) => {
  e.stopPropagation()
  isExpand.value = !isExpand.value
};
</script>

<template>
  <div class="at-sidebar" :class="{ open: isExpand }" @click="triggerExpand">
    <div class="at-sidebar-content">
      <div class="at-track-list">
        <div
          class="at-track"
          :class="{ active: activeTrackSet.has(op.id) }"
          v-for="op in trackOptionList"
          @click="(e) => handleChangeTrack(e, op.id)"
        >
          <div class="at-track-icon">
            <i class="fas fa-guitar"></i>
          </div>
          <div class="at-track-name">{{ op.name }}</div>
          <div class="at-track-controls">
            <div
              class="btn btn-danger" 
              :class="{ active: op.mute }"
              @click="(e) => setChannelMute(e, op.id)"
            >
              Mute
            </div>
            <div
              class="btn btn-success"
              :class="{ active: op.solo }"
              @click="(e) => setChannelSolo(e, op.id)"
            >
              Solo
            </div>
            <i class="fas fa-volume-high" />
            <input 
              type="range" min="0" max="16" 
              :value="op.volume" 
              @change="(e: any) => handleChangeVolume(op.id, e.target!.value)"
              @click="e => e.stopPropagation()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/** Sidebar **/
.at-sidebar {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  max-width: 70px;
  width: auto;
  display: flex;
  align-content: stretch;
  z-index: 1001;
  overflow: hidden;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  background: #f7f7f7;
  font-size: 15px;
}
.at-sidebar.open {
  max-width: 400px;
  transition: max-width 0.2s;
  overflow-y: auto;
}

/** Track selector **/
.at-track {
  display: grid;
  grid-template-areas:
    "c d"
    "c e";
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  padding: 5px;
  transition: background 0.2s;
  grid-gap: 5px;
  cursor: pointer;
}

.at-track.active {
  background: #00000008;
}

.at-track > .at-track-icon {
  align-items: center;
  display: flex;
  font-size: 32px;
  grid-area: c;
  height: 64px;
  justify-content: center;
  opacity: 0.5;
  transition: opacity 0.2s;
  width: 64px;
}

.at-track.active > .at-track-icon {
  color: #4972a1;
  opacity: 1;
}

.at-track > .at-track-name {
  font-weight: 500;
  grid-area: d;
}

.at-track > .at-track-controls {
  opacity: 0.8;
  align-items: center;
  display: flex;
  grid-area: e;
}

.at-track > .at-track-controls > * {
  margin: 0 2px;
}

input[type="range"] {
  -webkit-appearance: none;
  background: #d3d3d3;
  height: 5px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.at-sidebar .btn {
  font-size: 10.5px;
  padding: 4.5px 18px; 
  border: 1px solid var(--primary-color);
  border-radius: 6px;
  color: var(--primary-color);
  background-color: var(--second-primary-color);
}

.at-sidebar .btn.btn-danger {
  --primary-color: rgb(250, 56, 62);
  --second-primary-color: transparent;
}

.at-sidebar .btn.btn-success {
  --primary-color: rgb(0, 164, 0);
  --second-primary-color: transparent;
}

.at-sidebar .btn.btn-danger.active {
  --primary-color: #fff;
  --second-primary-color: rgb(250, 56, 62);
}

.at-sidebar .btn.btn-success.active {
  --primary-color: #fff;
  --second-primary-color: rgb(0, 164, 0);
}
</style>
