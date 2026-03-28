<template>
  <div class="p-2 pt-3 pb-4 overflow-hidden bg-light">
    <form @submit.prevent ref="form">
      <div class="card p-2">
        <div class="d-flex justify-content-around">
          <!-- Select file button -->
          <label class="btn btn-primary" for="file">
            {{ t('homeView.sliderBox.trackUpload.selectFile') }}
          </label>
          <!-- File Input not visible -->
          <input
            type="file"
            accept=".geojson,.gpx,.kml"
            id="file"
            class="d-none"
            name="file"
            @click="initializeForm"
            @change="handleFileUpload($event)"
          />
          <!-- Upload button -->
          <button
            id="uploadBtn"
            class="btn btn-primary"
            :title="t('homeView.sliderBox.trackUpload.uploadBtn')"
            type="button"
            @click="onTrackUpload"
            :disabled="state.file === ''"
          >
            <IconUpload />
          </button>
        </div>
        <!-- File name -->
        <div v-if="state.fileName" id="file-name" class="mt-1 p-0">
          <small> {{ state.fileName }} </small>
        </div>
      </div>
      <!-- Infomation -->
      <div v-if="state.file" class="card p-2 mt-3">
        <h6>{{ t('homeView.sliderBox.trackUpload.editInformation') }}</h6>
        <!-- Public checkbox -->
        <div class="form-check mt-0 mb-2">
          <label class="float-end form-check-label ms-2" for="public">{{
            t('homeView.sliderBox.trackUpload.public')
          }}</label>
          <input
            class="float-end form-check-input"
            type="checkbox"
            id="public"
            v-model="state.isPublic"
          />
        </div>
        <!-- Name input -->
        <div class="form-floating mb-3">
          <input type="text" class="form-control form-control-sm" id="name" v-model="state.name" />
          <label for="name">{{ t('homeView.sliderBox.trackUpload.name') }}</label>
        </div>
        <!-- Description -->
        <div class="form-floating mb-3">
          <textarea
            type="text"
            class="form-control form-control-sm"
            id="description"
            v-model="state.description"
          />
          <label for="description">{{ t('homeView.sliderBox.trackUpload.description') }}</label>
        </div>
        <!-- File creation date -->
        <div class="form-floating mb-1">
          <input
            type="datetime-local"
            class="form-control form-control-sm"
            id="createAt"
            v-model="state.createAt"
          />
          <label for="createAt">{{ t('homeView.sliderBox.trackUpload.creationDate') }}</label>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

import { showError, showOk } from '@/utils/dialog';
import { useAuthStore } from '@/stores/authStore';
import { useTrackStore } from '@/stores/trackStore';
import IconUpload from '../icons/IconUpload.vue';

const authStore = useAuthStore();
const trackStore = useTrackStore();

const { t } = useI18n();

const state = reactive({
  name: '',
  description: '',
  isPublic: false,
  createAt: '',
  file: '',
  fileName: '',
});

function handleFileUpload(event: any) {
  state.file = event.target.files[0];
  state.fileName = event.target.files[0].name;
  const fileExtension = state.fileName.split('.').pop();
  const date: Date = event.target.files[0].lastModifiedDate;
  state.createAt = date.toISOString().substring(0, 19);

  const reader = new FileReader();

  if (fileExtension === 'kml') {
    reader.onload = e => getDataFromKML(e.target?.result);
  } else if (fileExtension === 'gpx') {
    reader.onload = e => getDataFromGPX(e.target?.result);
  } else if (fileExtension === 'geojson') {
    reader.onload = e => getDataFromGeoJson(e.target?.result?.toString() || '');
  }
  reader.readAsText(event.target.files[0]);
}

const onTrackUpload = async () => {
  const formData = new FormData();
  formData.append('name', state.name.trim());
  formData.append('description', state.description.trim());
  formData.append('userId', authStore.userId);
  formData.append('isPublic', state.isPublic.toString());
  formData.append('fileName', state.fileName);
  formData.append('createAt', state.createAt.toString());
  formData.append('file', state.file);
  var response = await trackStore.uploadForm(formData);

  if (response.ok) {
    showOk(t('homeView.sliderBox.trackUpload.uploadOk'), state.fileName);
    initializeForm();
  } else {
    showError(t('homeView.sliderBox.trackUpload.uploadError'), response.message);
  }
};

function initializeForm() {
  state.name = '';
  state.description = '';
  state.isPublic = false;
  state.createAt = '';
  state.file = '';
  state.fileName = '';
  document.forms[0].reset();
}

function getDataFromKML(xmlString: string | ArrayBuffer | null | undefined) {
  if (!xmlString) return;

  const xmlDOM = new DOMParser().parseFromString(xmlString as string, 'text/xml');
  state.name = xmlDOM.getElementsByTagName('name')[0].childNodes[0].textContent || state.fileName;
  state.description = xmlDOM.getElementsByTagName('description')[0].childNodes[0].textContent || '';
}

function getDataFromGPX(xmlString: string | ArrayBuffer | null | undefined) {
  if (!xmlString) return;

  const xmlDOM = new DOMParser().parseFromString(xmlString as string, 'text/xml');
  state.name = xmlDOM.getElementsByTagName('name')[0]?.textContent || state.fileName;
  state.description = xmlDOM.getElementsByTagName('desc')[0]?.textContent || '';
  const time = xmlDOM.getElementsByTagName('time')[0].textContent;
  state.createAt = time?.substring(0, 19) || state.createAt;
}

function getDataFromGeoJson(jsonString: string) {
  const geojson = JSON.parse(jsonString);
  state.name = geojson.name || state.fileName;
  state.description = geojson.description || '';
}
</script>

<style scoped>
#file-name {
  padding-bottom: 0.15rem;
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: visible;
}

/* width */
::-webkit-scrollbar {
  height: 0.65rem;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #999;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #777;
}
</style>
