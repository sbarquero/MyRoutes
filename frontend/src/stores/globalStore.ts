import { defineStore } from 'pinia';

export const useGlobalStore = defineStore({
  id: 'global',
  state: () => ({
    userLocation: [0, 0],
    initialLocation: [40, -4.25],
    zoom: 5,
    isEditing: false,
  }),
  getters: {
    isUserLocationReady: state => state.userLocation[0] != 0 && state.userLocation[1] != 0,
  },
  actions: {
    getUserLocation() {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => (this.userLocation = [coords.latitude, coords.longitude]),
        err => {
          console.error(err);
          throw new Error('No geolocation :( ');
        },
      );
    },
  },
});
