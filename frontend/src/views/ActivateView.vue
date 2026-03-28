<!--
  Activate the user account with the token received in the URL 
  of the activation email that is sent when the user registers.
-->
<script setup lang="ts">
import { onMounted } from 'vue';
import { showError, showOk } from '@/utils/dialog';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import authApi from '@/api/authApi';
import router from '@/router';

const { t } = useI18n();
const route = useRoute();

onMounted(async () => {
  try {
    const response = await authApi.post('/activate-user', {
      token: route.params.token,
    });
    showOk(t('activateView.okMessage'), response.data.data.email);
  } catch (error: any) {
    showError(t('activateView.errorMessage'), error.response.data.message);
  } finally {
    router.push('/');
  }
});
</script>
