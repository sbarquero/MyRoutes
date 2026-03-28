<template>
  <div class="card p-4">
    <form
      @submit.prevent
      autocomplete="chrome-off"
      class="row gx-3 gy-2 needs-validation"
      id="userform"
      novalidate
    >
      <!-- User Id -->
      <div class="col-12 col-lg-6">
        <div class="form-floating mb-3">
          <input
            class="form-control"
            disabled
            id="userIdInput"
            type="text"
            v-model="userStore.selectedUser._id"
          />
          <label for="userIdInput">{{ t('configurationView.userConfiguration.id') }}</label>
        </div>
      </div>
      <!-- Email -->
      <div class="col-12 col-lg-6">
        <div class="form-floating mb-3">
          <input
            disabled
            class="form-control"
            id="emailInput"
            type="email"
            v-model="selectedUser.email"
          />
          <label for="emailInput">{{ t('configurationView.userConfiguration.email') }}</label>
        </div>
      </div>
      <!-- Name -->
      <div class="col-12">
        <div class="form-floating mb-3">
          <input
            autocomplete="new-name"
            class="form-control"
            id="nameInput"
            type="text"
            v-model="selectedUser.name"
            :class="v$.name.$error ? 'is-invalid' : ''"
            :placeholder="t('configurationView.userConfiguration.name')"
            @blur="v$.name.$touch"
          />
          <label for="nameInput">{{ t('configurationView.userConfiguration.name') }}</label>
          <div v-if="v$.name.$error" class="invalid-feedback">
            {{ v$.name.$errors[0].$message }}
          </div>
        </div>
      </div>
      <!-- Password -->
      <div class="col-12 col-lg-6">
        <div class="form-floating mb-3">
          <input
            autocomplete="new-password"
            v-model="state.password"
            type="password"
            class="form-control"
            id="passwordInput"
            :class="state.passwordError ? 'is-invalid' : ''"
            :placeholder="t('configurationView.userConfiguration.password')"
            @input="onPasswordInput"
            @blur="onPasswordInput"
          />
          <label for="floatingInput">{{ t('configurationView.userConfiguration.password') }}</label>
          <div v-if="state.passwordError" class="invalid-feedback">
            {{ state.passwordErrorMessage }}
          </div>
        </div>
      </div>
      <!-- ConfirmPassword -->
      <div class="col-12 col-lg-6">
        <div class="form-floating mb-3">
          <input
            v-model="state.confirmPassword"
            type="password"
            class="form-control"
            id="confirmPasswordInput"
            :class="state.confirmPasswordError ? 'is-invalid' : ''"
            :placeholder="t('configurationView.userConfiguration.confirmPassword')"
            @input="onRepeatPasswordInput"
            @blur="onRepeatPasswordInput"
          />
          <label for="floatingInput">
            {{ t('configurationView.userConfiguration.confirmPassword') }}
          </label>
          <div v-if="state.confirmPasswordError" class="invalid-feedback">
            {{ state.confirmPasswordErrorMessage }}
          </div>
        </div>
      </div>
      <!-- Created at & update at info -->
      <div v-if="!userStore.isNewUser" class="col-12 mb-3">
        <div class="card p-3">
          <div>
            <b>{{ t('configurationView.userConfiguration.createAt') }}: </b>
            {{ d(userStore.createDate, 'long') }}<br />
          </div>
          <div class="mt-2">
            <b>{{ t('configurationView.userConfiguration.updateAt') }}: </b>
            {{ d(userStore.upateDate, 'long') }}<br />
          </div>
        </div>
      </div>
      <!-- Session info -->
      <div>
        <SessionList />
      </div>
      <!-- Save & cancel buttons -->
      <div class="mt-4 d-flex justify-content-end">
        <button @click="onSaveUserConfiguration" type="button" class="btn btn-primary">
          <IconSave class="me-1" />
          {{ t('configurationView.userConfiguration.save') }}
        </button>
        <button
          @click="onCancelUserConfiguration"
          type="button"
          class="btn btn-light border-primary ms-3"
        >
          {{ t('configurationView.userConfiguration.cancel') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { helpers, minLength, required } from '@vuelidate/validators';
import { onMounted, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';

import { confirm, showError, showOk } from '@/utils/dialog';
import { useAuthStore } from '@/stores/authStore';
import { useGlobalStore } from '@/stores/globalStore';
import { useUserStore } from '@/stores/userStore';
import IconSave from '../icons/IconSave.vue';
import router from '@/router';
import SessionList from '../shared/SessionList.vue';

const { t, d } = useI18n();

const authStore = useAuthStore();
const userStore = useUserStore();
const globalStore = useGlobalStore();
const { selectedUser } = storeToRefs(userStore);

const state = reactive({
  password: '',
  confirmPassword: '',
  passwordError: false,
  passwordErrorMessage: '',
  confirmPasswordError: false,
  confirmPasswordErrorMessage: '',
});

onMounted(async () => {
  const response = await userStore.getUserConfiguration(authStore.userId);

  userStore.userEditing = true;
  globalStore.isEditing = true;
  if (!response.ok) {
    showError(response.message);
  }
});

const rules = {
  name: {
    required: helpers.withMessage(
      t('configurationView.userConfiguration.errorMsg.nameRequired'),
      required,
    ),
    minLength: helpers.withMessage(
      t('configurationView.userConfiguration.errorMsg.nameMinLength'),
      minLength(3),
    ),
  },
};

const v$ = useVuelidate(rules, selectedUser);

const onPasswordInput = () => {
  validatePassword();
};

const onRepeatPasswordInput = () => {
  validateConfirmPassword();
};

const validatePassword = () => {
  state.passwordError = false;
  if (userStore.isNewUser && state.password.length === 0) {
    state.passwordError = true;
    state.passwordErrorMessage = t('configurationView.userConfiguration.errorMsg.passwordRequired');
  } else if (state.password.length > 0 && state.password.length < 6) {
    state.passwordError = true;
    state.passwordErrorMessage = t(
      'configurationView.userConfiguration.errorMsg.passwordMinLength',
    );
  } else {
    if (state.password === state.confirmPassword) {
      state.confirmPasswordError = false;
    } else {
      state.confirmPasswordError = true;
      state.confirmPasswordErrorMessage = t(
        'configurationView.userConfiguration.errorMsg.passwordDifferent',
      );
    }
  }
};

const validateConfirmPassword = () => {
  state.confirmPasswordError = false;
  if (userStore.isNewUser && state.confirmPassword.length === 0) {
    state.confirmPasswordError = true;
    state.confirmPasswordErrorMessage = t(
      'configurationView.userConfiguration.errorMsg.passwordRequired',
    );
  } else if (state.confirmPassword.length > 0 && state.confirmPassword.length < 6) {
    state.confirmPasswordError = true;
    state.confirmPasswordErrorMessage = t(
      'configurationView.userConfiguration.errorMsg.passwordMinLength',
    );
  } else if (state.confirmPassword.length >= 6 && state.password != state.confirmPassword) {
    state.confirmPasswordError = true;
    state.confirmPasswordErrorMessage = t(
      'configurationView.userConfiguration.errorMsg.passwordDifferent',
    );
  } else {
    if (state.password != state.confirmPassword) {
      state.confirmPasswordError = true;
      state.confirmPasswordErrorMessage = t(
        'configurationView.userConfiguration.errorMsg.passwordDifferent',
      );
      validatePassword();
    } else {
      state.passwordError = false;
      state.confirmPasswordError = false;
    }
  }
};

const onSaveUserConfiguration = async () => {
  const validInput = await v$.value.$validate();
  validatePassword();
  validateConfirmPassword();
  if (!validInput || state.passwordError || state.confirmPasswordError) {
    showError(
      t('configurationView.userConfiguration.formValidation.errorTitle'),
      t('configurationView.userConfiguration.formValidation.errorText'),
    );
    return;
  }
  await updateUserConfiguration();
  goHomePage();
};

const onCancelUserConfiguration = () => {
  if (userHasChanged()) {
    confirmUserCancellation();
  } else {
    goHomePage();
  }
};

const userHasChanged = () => {
  return (
    userStore.userInitialState !== userStore.getUserState ||
    state.password !== '' ||
    state.confirmPassword !== ''
  );
};

const confirmUserCancellation = async () => {
  const result = await confirm(
    t('configurationView.userConfiguration.cancellation.title'),
    t('configurationView.userConfiguration.cancellation.text'),
    t('configurationView.userConfiguration.cancellation.confirmButtonText'),
    t('configurationView.userConfiguration.cancellation.cancelButtonText'),
  );
  if (result.isConfirmed) {
    goHomePage();
  }
};

const updateUserConfiguration = async () => {
  userStore.selectedUser.password = state.password;
  const result = await userStore.updateUserConfiguration();
  if (result.ok) {
    showOk(
      t('configurationView.userConfiguration.formValidation.updateTitle'),
      t('configurationView.userConfiguration.formValidation.updateText'),
    );
  } else {
    showError(t('error'), result.message);
  }
};

const goHomePage = () => {
  userStore.userEditing = false;
  globalStore.isEditing = false;
  userStore.clearUser();
  router.push('/');
};
</script>

<style scoped></style>
