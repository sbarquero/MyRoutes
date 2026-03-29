<template>
  <h3 class="mb-4 ms-1">{{ t('trackView.trackCard.title') }}</h3>
  <div
    id="track-card"
    v-if="trackStore.selectedTrack._id || trackStore.isNewTrack"
    class="card p-4"
  >
    <form
      @submit.prevent
      autocomplete="chrome-off"
      class="row gx-3 gy-2 needs-validation align-baseline"
      id="trackform"
      novalidate
    >
      <!-- File Upload -->
      <div v-if="trackStore.isNewTrack" class="col-12 col-lg-9">
        <div class="d-flex align-items-center">
          <!-- Select file button -->
          <label class="btn btn-primary" for="file">
            <IconSelectFile class="me-1" />
            {{ t('trackView.trackCard.selectFile') }}
          </label>
          <span v-if="trackStore.fileName" id="file-name" class="text-primary py-auto ps-3">
            {{ trackStore.fileName }}
          </span>
          <!-- File Input not visible -->
          <input
            type="file"
            accept=".geojson,.gpx,.kml"
            id="file"
            class="d-none"
            name="file"
            @change="handleFileUpload($event)"
          />
        </div>
      </div>
      <!-- Track Id -->
      <div v-else class="col-12 col-lg-9">
        <div class="col-12 col-lg-7">
          <div class="form-floating mb-0">
            <input
              class="form-control"
              disabled
              id="trackId"
              type="text"
              v-model="trackStore.selectedTrack._id"
              :placeholder="t('trackView.trackCard.id')"
            />
            <label for="trackId">{{ t('trackView.trackCard.id') }}</label>
          </div>
        </div>
        <div class="col-0 col-lg-5"></div>
      </div>
      <!-- Public -->
      <div class="col-12 col-lg-3 d-flex justify-content-end align-items-center">
        <div class="form-check">
          <input
            class="form-check-input"
            id="isPublic"
            type="checkbox"
            :disabled="isFormEditionDisabled()"
            v-model="selectedTrack.isPublic"
          />
          <label for="isPublic" class="form-check-label ms-2">
            {{ t('trackView.trackCard.public') }}
          </label>
        </div>
      </div>
      <!-- Name -->
      <div class="col-12 mt-4">
        <div class="form-floating mb-3">
          <input
            autocomplete="new-route-name"
            class="form-control"
            id="routeName"
            type="text"
            v-model="selectedTrack.name"
            :disabled="isFormEditionDisabled()"
            :class="v$.name.$error ? 'is-invalid' : ''"
            :placeholder="t('trackView.trackCard.name')"
            @blur="v$.name.$touch"
          />
          <label for="routeName">{{ t('trackView.trackCard.name') }}</label>
          <div v-if="v$.name.$error" class="invalid-feedback">
            {{ v$.name.$errors[0].$message }}
          </div>
        </div>
      </div>
      <!-- Description -->
      <div class="col-8">
        <div class="col-12">
          <div class="form-floating mb-3">
            <textarea
              class="form-control"
              id="description"
              rows="5"
              v-model="selectedTrack.description"
              :disabled="isFormEditionDisabled()"
              :placeholder="t('trackView.trackCard.description')"
            />
            <label for="description">{{ t('trackView.trackCard.description') }}</label>
          </div>
        </div>
      </div>
      <!-- Dates -->
      <div class="col-4">
        <!-- Creation date -->
        <div class="form-floating mb-3">
          <input
            class="form-control"
            id="createAt"
            type="datetime-local"
            :disabled="isFormEditionDisabled()"
            v-model="trackStore.creationDate"
          />
          <label for="createAt">{{ t('trackView.trackCard.createAt') }}</label>
        </div>
        <!-- Upload date -->
        <div class="form-floating mb-3">
          <input
            class="form-control"
            disabled
            id="uploadAt"
            type="text"
            :value="d(trackStore.uploadDate, 'long')"
          />
          <label for="uploadAt">{{ t('trackView.trackCard.uploadAt') }}</label>
        </div>
        <!-- Update date -->
        <div class="form-floating mb-3">
          <input
            class="form-control"
            disabled
            id="updateAt"
            type="text"
            :value="d(trackStore.updateDate, 'long')"
          />
          <label for="updateAt">{{ t('trackView.trackCard.updateAt') }}</label>
        </div>
      </div>
      <!-- Buttons if track can be written -->
      <div
        v-if="selectedTrack.userId === authStore.userId || trackStore.isNewTrack"
        class="d-flex justify-content-between mt-3"
      >
        <!-- Delete button -->
        <div>
          <button
            v-if="!trackStore.isNewTrack"
            @click="onDeleteTrack"
            type="button"
            class="btn btn-danger"
            :disabled="isFormEditionDisabled()"
            :title="t('trackView.trackCard.delete')"
          >
            <IconDelete />
          </button>
        </div>
        <!-- Save/Upload & cancel buttons -->
        <div>
          <!-- Save modified track button -->
          <button
            v-if="!trackStore.isNewTrack"
            @click="onUpdateTrack"
            type="button"
            class="btn btn-primary"
            :disabled="isFormEditionDisabled()"
          >
            <IconSave class="me-1" />
            {{ t('trackView.trackCard.save') }}
          </button>
          <!-- Upload new track button -->
          <button
            v-if="trackStore.isNewTrack"
            @click="onTrackUpload"
            :disabled="trackStore.file === ''"
            type="button"
            class="btn btn-primary"
          >
            <IconUpload class="me-1" />
            {{ t('trackView.trackCard.uploadNewTrack') }}
          </button>
          <button @click="onCancelTrack" type="button" class="btn btn-light border-primary ms-3">
            {{ t('trackView.trackCard.cancel') }}
          </button>
        </div>
      </div>
      <!-- Exit button if track is readonly -->
      <div v-else class="d-flex justify-content-between">
        <p class="alert alert-info fw-bold px-5 py-2">
          {{ t('trackView.trackCard.anotherUserTrack') }}
        </p>
        <div>
          <button @click="onCancelTrack" type="button" class="btn btn-primary">
            <IconDoor class="door-icon me-1" />
            {{ t('trackView.trackCard.exit') }}
          </button>
        </div>
      </div>
    </form>
  </div>
  <div v-else>
    <h5 class="alert alert-primary ms-1">{{ t('trackView.trackCard.selectTrack') }}</h5>
  </div>
</template>

<script setup lang="ts">
import { helpers, minLength, required } from '@vuelidate/validators';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';

import { convertDateToLocaleDateString } from '@/utils/date';
import { confirm, showError, showOk } from '@/utils/dialog';
import { useAuthStore } from '@/stores/authStore';
import { useGlobalStore } from '@/stores/globalStore';
import { useTrackStore } from '@/stores/trackStore';
import IconDelete from '../icons/IconDelete.vue';
import IconDoor from '../icons/IconDoor.vue';
import IconSave from '../icons/IconSave.vue';
import IconSelectFile from '../icons/IconSelectFile.vue';
import IconUpload from '../icons/IconUpload.vue';

const { t, d } = useI18n();

const authStore = useAuthStore();
const globalStore = useGlobalStore();
const trackStore = useTrackStore();
const { selectedTrack } = storeToRefs(trackStore);

function initializeForm(): void {
  trackStore.clearTrack();
  v$.value.$reset();
}

const rules = {
  name: {
    required: helpers.withMessage(t('trackView.trackCard.errorMsg.nameRequired'), required),
    minLength: helpers.withMessage(t('trackView.trackCard.errorMsg.nameMinLength'), minLength(3)),
  },
};

const v$ = useVuelidate(rules, selectedTrack);

function handleFileUpload(event: any): void {
  trackStore.trackEditing = true;
  globalStore.isEditing = true;
  trackStore.file = event.target.files[0];
  trackStore.fileName = event.target.files[0].name;
  const fileExtension = trackStore.fileName.split('.').pop();
  const date: Date = event.target.files[0].lastModifiedDate;
  trackStore.selectedTrack.createAt = date;
  trackStore.creationDate = convertDateToLocaleDateString(date);

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

const onTrackUpload = async (): Promise<void> => {
  if (!(await isValidInput())) return;
  try {
    trackStore.uploadTrack();
    showOk(t('trackView.trackCard.trackUpload.uploadOk'), trackStore.fileName);
    initializeForm();
  } catch (error: any) {
    showError(t('trackView.trackCard.trackUpload.uploadError'), error);
  }
};

const onUpdateTrack = async (): Promise<void> => {
  if (!isValidInput()) return;
  try {
    await trackStore.updateTrack();
    showOk(t('trackView.trackCard.trackUpdate.updateOk'), trackStore.fileName);
    await trackStore.getTrackListByUserId(authStore.userId);
    initializeForm();
  } catch (error: any) {
    showError(t('trackView.trackCard.trackUpdate.updateError'), error.message);
  }
};

const onCancelTrack = (): void => {
  if (trackHasChanged()) {
    confirmTrackCancellation();
  } else {
    initializeForm();
  }
};

const onDeleteTrack = async (): Promise<void> => {
  const result = await confirm(
    t('trackView.trackCard.trackDelete.deleteQuestion'),
    selectedTrack.value.name,
    t('trackView.trackCard.trackDelete.confirmDeleteButton'),
    t('trackView.trackCard.trackDelete.cancelDeleteButton'),
  );
  if (result.isConfirmed) {
    const result = await trackStore.deleteById(selectedTrack.value._id);
    trackStore.getTrackListByUserId(authStore.userId);
    initializeForm();
    if (result.ok) {
      showOk(t('trackView.trackCard.trackDelete.deleteSuccess'));
    } else {
      showError(result.message);
    }
  }
};

const trackHasChanged = (): boolean => {
  return trackStore.trackInitialState !== trackStore.getTrackState;
};

const confirmTrackCancellation = async () => {
  const result = await confirm(
    t('trackView.trackCard.cancellation.title'),
    t('trackView.trackCard.cancellation.text'),
    t('trackView.trackCard.cancellation.confirmButtonText'),
    t('trackView.trackCard.cancellation.cancelButtonText'),
  );
  if (result.isConfirmed) {
    initializeForm();
  }
};

function getDataFromKML(xmlString: string | ArrayBuffer | null | undefined): void {
  if (!xmlString) return;

  const xmlDOM = new DOMParser().parseFromString(xmlString as string, 'text/xml');
  trackStore.selectedTrack.name =
    xmlDOM.getElementsByTagName('name')[0].childNodes[0].textContent || trackStore.fileName;
  trackStore.selectedTrack.description =
    xmlDOM.getElementsByTagName('description')[0].childNodes[0].textContent || '';
}

function getDataFromGPX(xmlString: string | ArrayBuffer | null | undefined) {
  if (!xmlString) return;

  const xmlDOM = new DOMParser().parseFromString(xmlString as string, 'text/xml');
  trackStore.selectedTrack.name =
    xmlDOM.getElementsByTagName('name')[0].textContent || trackStore.fileName;
  trackStore.selectedTrack.description = xmlDOM.getElementsByTagName('desc')[0].textContent || '';
  const time = xmlDOM.getElementsByTagName('time')[0].textContent;
  trackStore.creationDate = time?.substring(0, 19) || trackStore.creationDate;
}

function getDataFromGeoJson(jsonString: string) {
  const geojson = JSON.parse(jsonString);
  trackStore.selectedTrack.name = geojson.name || trackStore.fileName;
  trackStore.selectedTrack.description = geojson.description || '';
}

async function isValidInput(): Promise<boolean> {
  const valid = await v$.value.$validate();
  if (!valid) {
    showError(
      t('trackView.trackCard.formValidation.errorTitle'),
      t('trackView.trackCard.formValidation.errorText'),
    );
  }
  return valid;
}

function isFormEditionDisabled() {
  return (
    !trackStore.trackEditing ||
    (selectedTrack.value.userId != authStore.userId && !trackStore.isNewTrack)
  );
}
</script>

<style scoped>
#track-card {
  max-height: calc(100vh - 19rem);
  overflow-y: auto;
}

#description {
  height: 13rem;
  resize: none;
}

#file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.door-icon {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
