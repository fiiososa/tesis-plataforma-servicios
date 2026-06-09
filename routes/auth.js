const express = require('express');
const router = express.Router();

const {
  registrarUsuario,
  loginUsuario,
  guardarPerfil,
  listarPerfiles
} = require('../controllers/authController');


// =========================
/*        USUARIOS        */
// =========================

// Registro de usuario
router.post('/registro', registrarUsuario);

// Login de usuario
router.post('/login', loginUsuario);


// =========================
/*        PERFILES        */
// =========================

// Crear / guardar perfil
router.post('/perfil', guardarPerfil);

// Listar todos los perfiles (buscar servicio)
router.get('/perfiles', listarPerfiles);
router.get('/verificar/:usuario_id', require('../controllers/authController').verificarPerfil);
router.delete('/perfil/:usuario_id', require('../controllers/authController').eliminarPerfil); // Para eliminar

module.exports = router;