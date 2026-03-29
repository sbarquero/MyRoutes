<template>
  <form class="px-4 py-3" @submit.prevent novalidate style="min-width: 300px">
    <h5 class="mb-4">{{ t('registerForm.title') }}</h5>
    <!-- Name -->
    <div class="form-floating mb-3">
      <input
        class="form-control"
        id="nameInput"
        type="text"
        v-model="state.name"
        :class="v$.name.$error ? 'is-invalid' : ''"
        :placeholder="t('registerForm.name')"
        @blur="v$.name.$touch"
      />
      <label for="nameInput">{{ t('registerForm.name') }}</label>
      <div v-if="v$.name.$error" class="invalid-feedback">
        {{ v$.name.$errors[0].$message }}
      </div>
    </div>
    <!-- Email -->
    <div class="form-floating mb-3">
      <input
        class="form-control"
        :class="v$.email.$error ? 'is-invalid' : ''"
        id="emailInput"
        required
        type="email"
        v-model="state.email"
        @blur="v$.email.$touch"
        :placeholder="t('registerForm.emailAddress')"
      />
      <label for="emailInput">{{ t('registerForm.emailAddress') }}</label>
      <div v-if="v$.email.$error" class="invalid-feedback">
        {{ v$.email.$errors[0].$message }}
      </div>
    </div>
    <!-- Password -->
    <div class="form-floating mb-4">
      <input
        autocomplete="new-password"
        type="password"
        class="form-control"
        :class="state.passwordError ? 'is-invalid' : ''"
        id="password"
        :placeholder="t('registerForm.password')"
        v-model="state.password"
        @input="onPasswordInput"
        @blur="onPasswordInput"
      />
      <label for="password" class="form-label">{{ t('registerForm.password') }}</label>
      <div v-if="state.passwordError" class="invalid-feedback">
        {{ state.passwordErrorMessage }}
      </div>
    </div>
    <!-- Confirm Password -->
    <div class="form-floating mb-4">
      <input
        type="password"
        class="form-control"
        :class="state.confirmPasswordError ? 'is-invalid' : ''"
        id="confirmPassword"
        :placeholder="t('registerForm.confirmPassword')"
        v-model="state.confirmPassword"
        @input="onRepeatPasswordInput"
        @blur="onRepeatPasswordInput"
      />
      <label for="password" class="form-label">{{ t('registerForm.confirmPassword') }}</label>
      <div v-if="state.confirmPasswordError" class="invalid-feedback">
        {{ state.confirmPasswordErrorMessage }}
      </div>
    </div>
    <div class="d-flex justify-content-between">
      <!-- Register button -->
      <button @click.prevent="onRegister" type="submit" class="btn btn-primary">
        {{ t('registerForm.registerButton') }}
      </button>
      <!-- Cancel button -->
      <button @click.prevent="auth.form = 'login'" class="btn btn-light border-primary">
        {{ t('registerForm.cancelButton') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { email, helpers, minLength, required } from '@vuelidate/validators';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import { useAuthStore } from '@/stores/authStore';
import { showError, showOk } from '@/utils/dialog';
import type { RegisterUserDto } from '@/interfaces/auth.interface';

const { t } = useI18n();
const auth = useAuthStore();

const state = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  passwordError: false,
  passwordErrorMessage: '',
  confirmPasswordError: false,
  confirmPasswordErrorMessage: '',
});

const rules = {
  name: {
    required: helpers.withMessage(t('userView.userCard.errorMsg.nameRequired'), required),
    minLength: helpers.withMessage(t('userView.userCard.errorMsg.nameMinLength'), minLength(3)),
  },
  email: {
    required: helpers.withMessage(t('userView.userCard.errorMsg.emailRequired'), required),
    email: helpers.withMessage(t('userView.userCard.errorMsg.emailValid'), email),
  },
};

const v$ = useVuelidate(rules, state);

async function onRegister() {
  const validInput = await v$.value.$validate();
  validatePassword();
  validateConfirmPassword();
  if (!validInput || state.passwordError || state.confirmPasswordError) {
    return;
  }
  await createUser();
}

const createUser = async () => {
  const userData: RegisterUserDto = {
    name: state.name,
    email: state.email,
    password: state.password,
  };

  const result = await auth.register(userData);

  if (result.ok) {
    showOk(t('registerForm.confirmCreate.title'), t('registerForm.confirmCreate.text'));
  } else {
    showError(t('error'), result.message);
  }
};

const onPasswordInput = () => {
  validatePassword();
};

const onRepeatPasswordInput = () => {
  validateConfirmPassword();
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
</script>

<style scoped></style>
