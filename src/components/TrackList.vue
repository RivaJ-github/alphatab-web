<script setup lang="ts">
import { useAPI } from '@/composables/useAPI'

const { api, trackList, activeTrackList } = useAPI()

const handleChangeTrack = (track: any) => {
  api.value!.renderTracks([track])
}
</script>

<template>
  <div class="at-track-list">
    <div class="at-track" :class="{ active: activeTrackList.has(track.index) }" v-for="(track, index) in trackList" @click="handleChangeTrack(track)">
      <div class="at-track-icon">
        <i class="fas fa-guitar"></i>
      </div>
      <div class="at-track-details">
        <div class="at-track-name">{{ track.name }}</div>
      </div>
    </div>
  </div>
</template>
  
<style>
</style>