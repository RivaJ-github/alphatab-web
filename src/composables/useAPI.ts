// AlphaTabAPI相关状态 - 全局

import * as AlphaTab from "@coderline/alphatab";
import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";

/** 创建API */
export const useAPI = createGlobalState(() => {
  const api = ref<AlphaTab.AlphaTabApi | null>(null);

  const loading = ref(false);

  const trackList = ref<AlphaTab.model.Score['tracks']>([]);

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
    /** 初始化 */
    init,
    reset,
  };
});
