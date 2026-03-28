<template>
  <div class="reset-password">
    <div class="card">
      <div class="card-body p-5">
        <form>
          <h1 class="mb-5">{{ t('resetView.title') }}</h1>
          <!-- Password -->
          <div class="form-floating mb-4">
            <input
              autocomplete="new-password"
              v-model="state.password"
              type="password"
              class="form-control"
              id="password"
              :class="state.passwordError ? 'is-invalid' : ''"
              :placeholder="t('resetView.password')"
              @input="onPasswordInput"
              @blur="onPasswordInput"
            />
            <label for="password" class="form-label">{{ t('resetView.password') }}</label>
            <div v-if="state.passwordError" class="invalid-feedback">
              {{ state.passwordErrorMessage }}
            </div>
          </div>
          <!-- ConfirmPassword -->
          <div class="form-floating mb-4">
            <input
              v-model="state.confirmPassword"
              type="password"
              class="form-control"
              id="confirmPassword"
              :class="state.confirmPasswordError ? 'is-invalid' : ''"
              :placeholder="t('resetView.confirmPassword')"
              @input="onRepeatPasswordInput"
              @blur="onRepeatPasswordInput"
            />
            <label for="password" class="form-label">{{ t('resetView.confirmPassword') }}</label>
            <div v-if="state.confirmPasswordError" class="invalid-feedback">
              {{ state.confirmPasswordErrorMessage }}
            </div>
          </div>
          <!-- Buttons -->
          <div class="d-flex justify-content-between">
            <!-- Login button -->
            <button @click.prevent="onResetPassword" type="submit" class="btn btn-primary">
              {{ t('resetView.resetButton') }}
            </button>
            <!-- Cancel button -->
            <button @click.prevent="onCancel" class="btn btn-light border-primary">
              {{ t('resetView.cancelButton') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import authApi from '@/api/authApi';
import router from '@/router';
import { useRoute } from 'vue-router';
import { showError, showOk } from '@/utils/dialog';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();

const state = reactive({
  password: '',
  confirmPassword: '',
  passwordError: false,
  passwordErrorMessage: '',
  confirmPasswordError: false,
  confirmPasswordErrorMessage: '',
});

const onPasswordInput = () => {
  validatePassword();
};

const onRepeatPasswordInput = () => {
  validateConfirmPassword();
};

const onResetPassword = async () => {
  if (validForm()) resetPassword();
};

const onCancel = () => {
  router.push('/');
};

const validForm = (): boolean => {
  validatePassword();
  validateConfirmPassword();
  if (state.passwordError || state.confirmPasswordError) {
    showError(t('resetView.formValidation.errorTitle'));
    return false;
  }
  return true;
};

const validatePassword = () => {
  state.passwordError = false;
  if (state.password.length === 0) {
    state.passwordError = true;
    state.passwordErrorMessage = t('userView.userCard.errorMsg.passwordRequired');
  } else if (state.password.length > 0 && state.password.length < 6) {
    state.passwordError = true;
    state.passwordErrorMessage = t('userView.userCard.errorMsg.passwordMinLength');
  } else {
    if (state.password === state.confirmPassword) {
      state.confirmPasswordError = false;
    } else {
      state.confirmPasswordError = true;
      state.confirmPasswordErrorMessage = t('userView.userCard.errorMsg.passwordDifferent');
    }
  }
};

const validateConfirmPassword = () => {
  state.confirmPasswordError = false;
  if (state.confirmPassword.length === 0) {
    state.confirmPasswordError = true;
    state.confirmPasswordErrorMessage = t('userView.userCard.errorMsg.passwordRequired');
  } else if (state.confirmPassword.length > 0 && state.confirmPassword.length < 6) {
    state.confirmPasswordError = true;
    state.confirmPasswordErrorMessage = t('userView.userCard.errorMsg.passwordMinLength');
  } else if (state.confirmPassword.length >= 6 && state.password != state.confirmPassword) {
    state.confirmPasswordError = true;
    state.confirmPasswordErrorMessage = t('userView.userCard.errorMsg.passwordDifferent');
  } else {
    if (state.password != state.confirmPassword) {
      state.confirmPasswordError = true;
      state.confirmPasswordErrorMessage = t('userView.userCard.errorMsg.passwordDifferent');
      validatePassword();
    } else {
      state.passwordError = false;
      state.confirmPasswordError = false;
    }
  }
};

const resetPassword = async () => {
  try {
    await authApi.post('/reset-password', {
      token: route.params.token,
      password: state.password,
    });
    showOk(t('resetView.resetPassword.okTitle'));
  } catch (error: any) {
    showError(t('resetView.resetPassword.errorTitle'), error.response.data.message);
  } finally {
    router.push('/');
  }
};
</script>

<style lang="scss" scoped>
.reset-password {
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0px;
  width: 100vw;
  text-align: center;
  .card {
    text-align: left;
  }
}
</style>
