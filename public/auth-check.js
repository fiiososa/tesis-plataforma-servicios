const usuario_id = localStorage.getItem('usuario_id');

if (!usuario_id) {

    window.location.href = 'login.html';

}