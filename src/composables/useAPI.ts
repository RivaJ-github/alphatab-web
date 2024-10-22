// AlphaTabAPI相关状态 - 全局

import * as AlphaTab from "@coderline/alphatab";
import { ref } from "vue";
import type { Ref } from "vue";
import { createGlobalState } from "@vueuse/core";

type TrackList = AlphaTab.AlphaTabApi["tracks"]

/** 创建API */
export const useAPI = createGlobalState(() => {
  const api = ref<AlphaTab.AlphaTabApi | null>(null);

  const loading = ref(false);

  const trackList = ref<TrackList>([]) as Ref<TrackList>;

  const activeTrackList = ref<Set<number>>(new Set())

  const init = (container: HTMLElement, settings: AlphaTab.Settings | any) => {
    api.value = new AlphaTab.AlphaTabApi(container, settings);

    // 更新曲谱渲染状态
    api.value.renderStarted.on(() => {
      loading.value = true;
    });
    api.value.renderFinished.on(() => {
      loading.value = false;
    });

    api.value.scoreLoaded.on((score) => {
      trackList.value = score.tracks;
    });

    api.value.renderStarted.on(() => {
      // collect tracks being rendered
      activeTrackList.value = new Set(api.value!.tracks.map(track => track.index));
    });
  };

  const reset = (container: HTMLElement, settings: AlphaTab.Settings | any) => {
    loading.value = false;
    init(container, settings);
  };

  return {
    api,
    /** 曲谱渲染状态 */
    loading,
    /** 音轨列表 */
    trackList,
    /** 当且被渲染的音轨 */
    activeTrackList,
    /** 初始化 */
    init,
    reset,
  };
});
