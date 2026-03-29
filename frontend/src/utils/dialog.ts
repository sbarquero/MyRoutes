// Imports Sweetalert2
import 'sweetalert2/dist/sweetalert2.all.min.js';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@/assets/css/sweetalert-custom.scss';

import Swal, { type SweetAlertResult } from 'sweetalert2';

export const showError = (title: string, text = '') => {
  Swal.fire({
    title,
    text,
    icon: 'error',
    customClass: {
      confirmButton: 'swal-btn-confirm',
    },
  });
};

export function showOk(title: string, text = '', timer = 3000) {
  Swal.fire({
    title,
    text,
    icon: 'success',
    timer,
    customClass: {
      confirmButton: 'swal-btn-confirm',
    },
  });
}

export async function confirm(
  title: string,
  text: string,
  confirmButtonText: string,
  cancelButtonText: string,
): Promise<SweetAlertResult<any>> {
  return await Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    customClass: {
      confirmButton: 'swal-btn-danger',
      cancelButton: 'swal-btn-cancel',
    },
    confirmButtonText,
    cancelButtonText,
  });
}
