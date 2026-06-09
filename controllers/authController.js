const bcrypt = require('bcryptjs');
const db = require('../db/connection');

// ==========================================
// 1. REGISTRO DE USUARIO (Corregido)
// ==========================================
exports.registrarUsuario = async (req, res) => {
  const { nombre, cedula, telefono, correo, contraseña } = req.body;

  // REVISIÓN 1: Comprobar estrictamente si los datos están bloqueados por separado
  db.get(
    `SELECT * FROM usuarios_bloqueados WHERE correo = ? OR cedula = ?`,
    [correo, cedula],
    async (err, bloqueado) => {
      if (err) return res.status(500).send('Error del servidor al comprobar bloqueos');
      
      // SI EXISTE EN BLOQUEADOS: Detenemos todo inmediatamente
      if (bloqueado) {
        return res.status(403).send(
          `USUARIO BLOQUEADO/ELIMINADO\n\nMotivo: ${bloqueado.motivo}\n${bloqueado.comentario || ''}\n\nNo tienes permitido registrarte nuevamente.`
        );
      }

      // REVISIÓN 2: Si no está bloqueado, comprobar si ya existe en usuarios activos
      db.get(
        `SELECT correo, cedula FROM usuarios WHERE correo = ? OR cedula = ?`,
        [correo, cedula],
        async (err, usuarioExistente) => {
          if (err) return res.status(500).send('Error del servidor al validar duplicados');
          
          if (usuarioExistente) {
            if (usuarioExistente.correo === correo) {
              return res.status(400).send('Este correo ya está registrado');
            }
            if (usuarioExistente.cedula === cedula) {
              return res.status(400).send('Esta cédula ya está registrada');
            }
          }

          // REVISIÓN 3: Si todo está limpio, se procede al registro
          try {
            const hash = await bcrypt.hash(contraseña, 10);
            const rol = correo === 'admin@admin.com' ? 'admin' : 'usuario';
            const sql = `INSERT INTO usuarios (nombre, cedula, telefono, correo, contraseña, rol) VALUES (?, ?, ?, ?, ?, ?)`;

            db.run(sql, [nombre, cedula, telefono, correo, hash, rol], function (err) {
              if (err) {
                console.error(err.message);
                return res.status(500).send('Error al guardar el usuario');
              }
              res.send('Usuario registrado correctamente');
            });
          } catch (hashError) {
            console.error(hashError);
            return res.status(500).send('Error al procesar la seguridad del registro');
          }
        }
      );
    }
  );
};

// ==========================================
// 2. LOGIN DE USUARIO (Corregido)
// ==========================================
exports.loginUsuario = (req, res) => {
  const { correo, contraseña } = req.body;

  // REVISIÓN 1: Buscar PRIMERO si el correo figura en la tabla de bloqueados
  db.get(`SELECT * FROM usuarios_bloqueados WHERE correo = ?`, [correo], async (err, bloqueado) => {
    if (err) return res.status(500).send('Error en el servidor al verificar credenciales');
    
    // SI EL USUARIO ESTÁ BLOQUEADO: Mostrar el motivo de inmediato y cortar el flujo
    if (bloqueado) {
      return res.status(403).send(
        `USUARIO ELIMINADO\n\nMotivo:\n${bloqueado.motivo}\n\n${bloqueado.comentario || ''}\n\nYa no puedes acceder a la plataforma.`
      );
    }

    // REVISIÓN 2: Si NO está bloqueado, buscarlo en la tabla de usuarios activos
    const sql = `SELECT * FROM usuarios WHERE correo = ?`;
    db.get(sql, [correo], async (err, usuario) => {
      if (err) return res.status(500).send('Error en el servidor');
      
      // Si no existe en usuarios activos (y tampoco estaba bloqueado), es porque realmente no existe
      if (!usuario) return res.status(401).send('Correo no registrado');

      // Validar contraseña
      const valido = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!valido) return res.status(401).send('Contraseña incorrecta');

      res.send({ mensaje: 'Inicio de sesión exitoso', usuario });
    });
  });
};

// ==========================================
// 3. GUARDAR Y EDITAR PERFIL
// ==========================================
exports.guardarPerfil = (req, res) => {
    const { usuario_id, rol_trabajador, rol_empleador, oficios, horario, area, tarifa } = req.body;

    const rTrabajador = (rol_trabajador === 1 || rol_trabajador === true || rol_trabajador === '1' || rol_trabajador === 'true') ? 1 : 0;
    const rEmpleador = (rol_empleador === 1 || rol_empleador === true || rol_empleador === '1' || rol_empleador === 'true') ? 1 : 0;
    
    const oficiosFinal = rTrabajador === 1 ? oficios : 'empleador';
    const horarioFinal = rTrabajador === 1 ? horario : '';
    const areaFinal = rTrabajador === 1 ? area : '';
    const tarifaFinal = (rTrabajador === 1 && tarifa) ? Number(tarifa) : null;

    db.get(`SELECT id FROM perfiles WHERE usuario_id = ?`, [usuario_id], (err, row) => {
        if (err) return res.status(500).send('Error al consultar base de datos');
        
        if (row) {
            const sql = `UPDATE perfiles 
                         SET rol_trabajador = ?, rol_empleador = ?, oficios = ?, horario = ?, area = ?, tarifa = ? 
                         WHERE usuario_id = ?`;
            db.run(sql, [rTrabajador, rEmpleador, oficiosFinal, horarioFinal, areaFinal, tarifaFinal, usuario_id], function (err) {
                if (err) return res.status(500).send('Error al actualizar el perfil');
                res.send('Perfil actualizado correctamente');
            });
        } else {
            const sql = `INSERT INTO perfiles (usuario_id, rol_trabajador, rol_empleador, oficios, horario, area, tarifa) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            db.run(sql, [usuario_id, rTrabajador, rEmpleador, oficiosFinal, horarioFinal, areaFinal, tarifaFinal], function (err) {
                if (err) return res.status(500).send('Error al crear el perfil');
                res.send('Perfil creado correctamente');
            });
        }
    });
};

// ==========================================
// 4. LISTAR PERFILES
// ==========================================
exports.listarPerfiles = (req, res) => {
  const sql = `
    SELECT perfiles.*, usuarios.nombre, usuarios.telefono, usuarios.correo, usuarios.cedula, usuarios.id AS usuario_id
    FROM perfiles
    JOIN usuarios ON usuarios.id = perfiles.usuario_id
    ORDER BY perfiles.id DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).send('Error al obtener perfiles');
    res.json(rows);
  });
};

// ==========================================
// 5. VERIFICAR PERFIL
// ==========================================
exports.verificarPerfil = (req, res) => {
  const { usuario_id } = req.params;
  db.get(`SELECT * FROM perfiles WHERE usuario_id = ?`, [usuario_id], (err, perfil) => {
    if (err) return res.status(500).send(err.message);
    res.json({
      tienePerfil: !!perfil,
      perfil: perfil || null
    });
  });
};

// ==========================================
// 6. ELIMINAR CUENTA Y BLOQUEAR (¡CORREGIDO!)
// ==========================================
exports.eliminarPerfil = (req, res) => {
  const { usuario_id } = req.params;
  const { motivo, comentario } = req.body; // Captura los datos enviados por el admin.html

  // PASO 1: Obtener todos los datos del usuario antes de que sea borrado
  db.get(`SELECT * FROM usuarios WHERE id = ?`, [usuario_id], (err, usuario) => {
    if (err) return res.status(500).send('Error al buscar los datos del usuario para bloquear');
    if (!usuario) return res.status(404).send('Usuario no encontrado');

    // PASO 2: Insertar al usuario en la tabla de usuarios_bloqueados con el motivo del Admin
    const sqlBloqueo = `
      INSERT INTO usuarios_bloqueados (nombre, cedula, telefono, correo, motivo, comentario) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(
      sqlBloqueo, 
      [usuario.nombre, usuario.cedula, usuario.telefono, usuario.correo, motivo || 'No especificado', comentario || ''], 
      function (err) {
        if (err) {
          console.error("Error al registrar en usuarios_bloqueados:", err.message);
          return res.status(500).send('Error crítico: No se pudo procesar el bloqueo en la lista negra');
        }

        // PASO 3: Una vez asegurado en la lista negra, lo eliminamos de perfiles
        db.run(`DELETE FROM perfiles WHERE usuario_id = ?`, [usuario_id], function (err) {
          if (err) return res.status(500).send('Error al remover el perfil de la plataforma');

          // PASO 4: Finalmente, lo eliminamos de la tabla usuarios activos
          db.run(`DELETE FROM usuarios WHERE id = ?`, [usuario_id], function (err) {
            if (err) return res.status(500).send('Error al remover la cuenta del usuario activo');
            
            // Éxito absoluto
            res.status(200).send('Usuario bloqueado y eliminado con éxito de la plataforma');
          });
        });
      }
    );
  });
};