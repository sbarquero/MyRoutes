import { defineStore } from 'pinia';

import { convertDateToLocaleDateString } from '@/utils/date';
import { useAuthStore } from '@/stores/authStore';
import { useGlobalStore } from './globalStore';
import trackApi from '@/api/trackApi';
import type { Track, UpdateTrackDto } from '@/interfaces/track.interface';

export const useTrackStore = defineStore({
  id: 'track',
  state: () => ({
    selectedTrackId: '',
    selectedTrackIndex: -1,
    hideTrackIndex: -1,
    tracks: [] as Track[],
    isNewTrack: false,
    trackEditing: false,
    selectedTrack: {} as Track,
    trackInitialState: '',
    file: '',
    fileName: '',
    creationDate: '',
  }),
  getters: {
    trackList: state => state.tracks,
    uploadDate: state => state.selectedTrack.uploadAt || new Date(),
    updateDate: state => state.selectedTrack.updateAt || new Date(),
    getTrackState: (state): string => {
      return JSON.stringify({
        name: state.selectedTrack.name,
        description: state.selectedTrack.description,
        isPublic: state.selectedTrack.isPublic,
        createAt: state.selectedTrack.createAt,
      });
    },
  },
  actions: {
    async getAllPublic() {
      try {
        const path = 'public/';
        const response = await trackApi.get(path);
        this.tracks = response.data;
        this.tracks.forEach(track => (track.visible = false));
      } catch (error: any) {
        console.error('error', error.message);
        this.tracks = [];
      }
    },
    async getTrackListByUserId(userId: string): Promise<void> {
      try {
        const token = await getToken();
        const path = 'user/' + userId;
        const response = await trackApi.get(path, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.tracks = response.data;
        this.tracks.forEach(track => (track.visible = false));
      } catch (error: any) {
        console.error('error', error.message);
        this.tracks = [];
      }
    },
    async deleteById(id: string) {
      try {
        const token = await getToken();
        const path = '/' + id;
        await trackApi.delete(path, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return { ok: true };
      } catch (error: any) {
        console.error('error', error.message);
        return { ok: false, message: error.response.data.message };
      }
    },
    async uploadForm(formData: FormData) {
      try {
        const token = await getToken();
        const track = await trackApi.post('/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        this.tracks.push(track.data as Track);
        return { ok: true };
      } catch (error: any) {
        return { ok: false, message: error.response.data.message };
      }
    },
    async uploadTrack() {
      const formData = new FormData();
      formData.append('name', this.selectedTrack.name.trim());
      formData.append('description', this.selectedTrack.description.trim());
      formData.append('userId', getUserId());
      formData.append('isPublic', this.selectedTrack.isPublic.toString());
      formData.append('fileName', this.fileName);
      formData.append('createAt', this.creationDate.toString());
      formData.append('file', this.file);
      this.uploadForm(formData);
    },
    async selectTrack(index: number) {
      this.selectedTrackId = this.trackList[index]._id;
      const geojsonData = this.trackList[index].geojsonData;

      if (!geojsonData) await this.getTrackByListIndex(index);

      this.trackList[index].visible = true;
      this.selectedTrackIndex = index;
      this.hideTrackIndex = -1;
    },
    unselectTrack() {
      this.selectedTrack = {} as Track;
      this.selectedTrackId = '';
      this.selectedTrackIndex = -1;
    },
    async getTrackByListIndex(index: number) {
      const authStore = useAuthStore();
      try {
        const id = this.trackList[index]._id;
        if (authStore.isAuthenticated) {
          const token = await getToken();
          const path = '/' + id;
          const { data } = await trackApi.get(path, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.trackList[index] = { ...data };
        } else {
          const path = '/public/' + id;
          const { data } = await trackApi.get(path);
          this.trackList[index] = { ...data };
        }
        return { ok: true };
      } catch (error: any) {
        console.error('error', error.message);
        return { ok: false, message: error.response.data.message };
      }
    },
    async getTrackById(id: string) {
      const authStore = useAuthStore();
      try {
        if (authStore.isAuthenticated) {
          const token = await getToken();
          const path = '/' + id;
          const { data } = await trackApi.get(path, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.selectedTrack = { ...data } as Track;
          this.creationDate = convertDateToLocaleDateString(new Date(this.selectedTrack.createAt));
          this.trackInitialState = this.getTrackState;
        }
        return { ok: true };
      } catch (error: any) {
        console.error('error', error.message);
        return { ok: false, message: error.response.data.message };
      }
    },
    async updateTrack() {
      const globalStore = useGlobalStore();
      const track: UpdateTrackDto = {
        name: this.selectedTrack.name.trim(),
        description: this.selectedTrack.description.trim(),
        createAt: new Date(this.creationDate),
        isPublic: this.selectedTrack.isPublic,
      };
      const path = '/' + this.selectedTrack._id;
      const token = await getToken();
      await trackApi.put(path, track, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.isNewTrack = false;
      this.trackEditing = false;
      globalStore.isEditing = false;
    },
    async removeTrackLayer(index: number) {
      this.hideTrackIndex = index;
      this.trackList[index].visible = false;
      if (this.selectedTrackIndex === index) {
        this.selectedTrackIndex = -1;
        this.selectedTrackId = '';
      }
    },
    clearTrack() {
      const globalStore = useGlobalStore();
      this.isNewTrack = false;
      this.trackEditing = false;
      globalStore.isEditing = false;
      this.selectedTrack = {} as Track;
      this.trackInitialState = '';
      this.file = '';
      this.fileName = '';
    },
    newTrack() {
      const globalStore = useGlobalStore();
      this.isNewTrack = true;
      this.trackEditing = false;
      globalStore.isEditing = false;
      this.selectedTrack = {} as Track;
      this.creationDate = convertDateToLocaleDateString(new Date());
      this.selectedTrack.isPublic = false;
      this.trackInitialState = this.getTrackState;
    },
  },
});

async function getToken(): Promise<string> {
  const authStore = useAuthStore();
  const token = await authStore.getToken();
  return token;
}

function getUserId(): string {
  const authStore = useAuthStore();
  return authStore.userId;
}
