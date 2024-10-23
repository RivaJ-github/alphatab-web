<script setup lang="ts">
import { useAPI } from "../composables/useAPI";
const { loadingMusicScore } = useAPI()
</script>

<template>
  <div class="at-overlay" v-show="loadingMusicScore">
    <div class="at-overlay-content">载入中...</div>
  </div>
</template>

<style>

/** Overlay **/

.at-overlay {
  /** Fill Parent */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1002;

  /* Blurry dark shade */
  backdrop-filter: blur(3px);
  background: rgba(0, 0, 0, 0.5);

  /** center content */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.at-overlay-content {
  /* white box with drop-shadow */
  margin-top: 20px;
  background: #fff;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
  padding: 10px;
}
</style>
