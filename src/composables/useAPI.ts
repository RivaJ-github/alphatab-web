// AlphaTabAPI相关状态 - 全局

import * as AlphaTab from "@coderline/alphatab";
import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";
import globalState from '../store/globalState';
import { formatDuration } from "@/utils";

interface Option {
  id: number
  name: string
}

interface BaseInfo {
  /** 标题 */
  title: string
  /** 演奏者 */
  artist: string
  /** 预备拍音量 */
  countInVolume: number
  /** 节拍器音量 */
  metronomeVolume: number
  /** 循环 */
  isLooping: boolean
  /** 播放状态 */
  state: AlphaTab.synth.PlayerState
  /** 播放进度文案 */
  songPosition: string
}

const DefaultBaseInfo = {
  title: '',
  artist: '',
  countInVolume: 0,
  metronomeVolume: 0,
  isLooping: false,
  state: AlphaTab.synth.PlayerState.Paused,
  songPosition: '00:00 / 00:00'
}

/** 创建API */
export const useAPI = createGlobalState(() => {
  const loadingMusicScore = ref(false);

  const fontLoadPercent = ref(0)

  const isPlayerReady = ref(false)

  const baseInfo = ref<BaseInfo>({ ...DefaultBaseInfo })

  const activeTrackSet = ref<Set<number>>(new Set())

  /** 音轨名称列表，主要用来触发更新 */
  const trackOptionList = ref<Option[]>([])

  const init = (container: HTMLElement, settings: AlphaTab.Settings | any) => {
    const api = globalState.init(container, settings);

    /** 新音乐加载监听 */
    api.scoreLoaded.on((score) => {
      globalState.trackList = score.tracks;
      trackOptionList.value = globalState.trackList!.map((track) => ({
        id: track.index,
        name: track.name
      }))

      baseInfo.value.title = score.title
      baseInfo.value.artist = score.artist
    });

    // 更新曲谱渲染状态
    api.renderStarted.on(() => {
      loadingMusicScore.value = true;
    });
    api.renderFinished.on(() => {
      loadingMusicScore.value = false;
    });

    api.soundFontLoad.on((e) => {
      fontLoadPercent.value = Math.floor((e.loaded / e.total) * 100);
    });
    api.playerReady.on(() => {
      isPlayerReady.value = true
    });

    // 收集激活的音轨
    api.renderStarted.on(() => {
      activeTrackSet.value = new Set(api!.tracks.map(track => track.index));
    });

    api.playerStateChanged.on((e) => {
      baseInfo.value.state = e.state
    });

    /** 进度条 */
    let previousTime = -1;
    api.playerPositionChanged.on((e) => {
      const currentSeconds = (e.currentTime / 1000) | 0;
      if (currentSeconds == previousTime) {
        return;
      }
      previousTime = currentSeconds
      baseInfo.value.songPosition = formatDuration(e.currentTime) + " / " + formatDuration(e.endTime);
    });
  };

  return {
    /** 曲谱基本信息 */
    baseInfo,
    /** 曲谱渲染状态 */
    loadingMusicScore,
    /** 当前曲谱音轨名称列表 */
    trackOptionList,
    /** 当且被渲染的音轨 */
    activeTrackSet,
    /** 音乐字体加载进度 */
    fontLoadPercent,
    /** 播放器是否准备 */
    isPlayerReady,
    /** 初始化 */
    init,
  };
});
