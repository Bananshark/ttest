import { defineStore } from 'pinia';

export const useArtifactsStore = defineStore('artifacts', {
  state: () => ({
    selected: null,
    loading: false
  }),
  actions: {
    setSelected(artifact) {
      this.selected = artifact;
    }
  }
});

