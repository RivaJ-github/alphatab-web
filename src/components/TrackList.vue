<script setup lang="ts">
import globalState from '@/store/globalState';
import { useAPI } from '@/composables/useAPI'

const { trackOptionList, activeTrackSet } = useAPI()

const handleChangeTrack = (id: any) => {
  if (activeTrackSet.value.has(id)) return
  globalState.api!.renderTracks(globalState.trackList!.filter(track => track.index == id))
}
</script>

<template>
  <div class="at-track-list">
    <div class="at-track" v-for="op in trackOptionList"
      :class="{ active: activeTrackSet.has(op.id) }" 
      @click="handleChangeTrack(op.id)"
    >
      <div class="at-track-icon">
        <i class="fas fa-guitar"></i>
      </div>
      <div class="at-track-details">
        <div class="at-track-name">{{ op.name }}</div>
      </div>
    </div>
  </div>
</template>
  
<style>
</style>