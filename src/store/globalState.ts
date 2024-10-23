import * as AlphaTab from "@coderline/alphatab";

class GlobalState {
  constructor() {}
  api?: AlphaTab.AlphaTabApi;
  trackList?: AlphaTab.AlphaTabApi["tracks"];

  init(container: HTMLElement, settings: AlphaTab.Settings | any) {
    this.api = new AlphaTab.AlphaTabApi(container, settings);
    return this.api
  }
}

export default new GlobalState();
