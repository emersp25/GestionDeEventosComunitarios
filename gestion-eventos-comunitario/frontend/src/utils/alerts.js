import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export function alertSuccess(title = 'Éxito', text = 'Operación completada correctamente.') {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'OK'
  });
}

export function alertInfo(title = 'Información', text = '') {
  return Swal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonText: 'OK'
  });
}

export function alertWarning(title = 'Revisa los datos', text = '') {
  return Swal.fire({
    icon: 'warning',
    title,
    html: text ? `<div style="text-align:left">${text}</div>` : undefined,
    text: text || undefined,
    confirmButtonText: 'Entendido'
  });
}

export function alertError(title = 'Error', text = 'Ocurrió un error inesperado.') {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Cerrar'
  });
}


export function alertErrorsList(title = 'Revisa los campos', errors = []) {
  const listHtml = `<ul style="text-align:left;margin:0;padding-left:1.25rem">
    ${errors.map((e) => `<li>${e}</li>`).join('')}
  </ul>`;
  return Swal.fire({
    icon: 'warning',
    title,
    html: listHtml,
    confirmButtonText: 'Entendido'
  });
}


export function confirmDialog(title = 'Confirmar', text = '¿Deseas continuar?') {
  return Swal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  });
}
