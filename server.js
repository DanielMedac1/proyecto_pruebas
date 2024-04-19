//Importación de las librerías
const express = require("express");
const fs = require("fs");
var session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const {
  confirmationMail,
  resetMail,
  contactMail,
} = require("./email-controller.js");
const rateLimiter = require("express-rate-limit");

//Creación de la aplicación
const app = express();

//Para los ficheros HTML
app.use(express.static("public"));
app.use("/styles", express.static(__dirname + "/public/css"));

//Para los ficheros EJS
app.set("views", "views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "TtwDnEKvK10E9to",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      name: "session_id",
      httpOnly: true,
      //secure: true //ESTO PARA CUANDO LO SUBAMOS AL RENDER
    },
  })
);

//Conexión a la base de datos
const pool = require("./db/db_sql.js");
const uri = require("./db/db_mongo.js");
const { stringify } = require("querystring");

//Middleware de autenticación
var auth = function (req, res, next) {
  if (req.session && (req.session.admin || req.session.user)) {
    return next();
  } else {
    console.log("Reririge");
    res.redirect("/login");
  }
};

//Middleware de limite de peticiones
const limiter = rateLimiter({
  windowsMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Demasiadas peticiones, espera 15 minutos",
});

app.use(limiter);

// Función para encriptar una contraseña con bcrypt
async function encrypt(value) {
  const saltRounds = 10; // Número de rondas de hashing
  const hashedValue = await bcrypt.hash(value, saltRounds);
  return hashedValue;
}

//Función para enviar respuestas JSON más facilmente
function sendResponse(res, message) {
  res.send({ res: message });
}

//Función para generar tokens
function generateToken(length = 32) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

let loginAttempts = 0; // Contador de intentos de inicio de sesión
const maxLoginAttempts = 6; // Número máximo de intentos permitidos
const lockoutTime = 5000; // Tiempo de bloqueo en milisegundos (30 segundos)

let lastLoginAttemptTime = 0; // Inicializar el tiempo del último intento de inicio de sesión

// Función para manejar los intentos de inicio de sesión
function handleLoginAttempt(req, res) {
  const currentTime = Date.now(); // Obtener el tiempo actual en milisegundos

  // Verificar si el usuario está bloqueado
  if (currentTime - lastLoginAttemptTime < lockoutTime) {
    // Si el usuario está bloqueado, enviar una respuesta indicando que el inicio de sesión está bloqueado temporalmente
    return true;
  }

  // Incrementar el contador de intentos de inicio de sesión
  loginAttempts++;

  // Verificar si se ha alcanzado el número máximo de intentos permitidos
  if (loginAttempts >= maxLoginAttempts) {
    // Si se alcanzó el número máximo de intentos, bloquear al usuario y actualizar el tiempo del último intento de inicio de sesión
    lastLoginAttemptTime = currentTime;
    loginAttempts = 0;
    return true;
  }
  return false;
  // Aquí podrías realizar el resto de la lógica de manejo del inicio de sesión, como verificar las credenciales del usuario, etc.
  // ...
}

//Rutas de páginas
app.get("/", (req, res) => {
  var contenido = fs.readFileSync("public/index.html", "utf8");
  res.setHeader("Content-Type", "text/html");
  res.send(contenido);
});
app.get("/login", (req, res) => {
  var contenido = fs.readFileSync("public/iniciarSesion.html", "utf8");
  res.setHeader("Content-Type", "text/html");
  res.send(contenido);
});
app.get("/register", (req, res) => {
  var contenido = fs.readFileSync("public/registrarUsuario.html", "utf8");
  res.setHeader("Content-Type", "text/html");
  res.send(contenido);
});
app.get("/forgot-password", (req, res) => {
  var contenido = fs.readFileSync("public/resetPass1.html", "utf8");
  res.setHeader("Content-Type", "text/html");
  res.send(contenido);
});

app.get("/profile", auth, (req, res) => {
  if (req.session.admin || req.session.user) {
    res.render("profile-info", { usuario: req.session.info });
  } else {
    res.redirect("/login");
  }
});
app.get("/home", auth, (req, res) => {
  if (req.session.admin) {
    res.render("admin/home-admin", { usuario: req.session.info });
  } else if (req.session.user) {
    res.render("usuario/home-user", { usuario: req.session.info });
  } else {
    res.redirect("/login");
  }
});

app.get("/userlist", (req, res) => {
  if (req.session.admin) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.error("Error al obtener la conexión de la pool: ", err);
      } else {
        connection.query(
          "SELECT * FROM usuarios WHERE username != ?",
          [req.session.info.username],
          function (error, results, fields) {
            connection.release(); // Liberar la conexión después de usarla
            if (error) {
              console.error("Error al ejecutar la consulta: ", error);
            } else {
              results.forEach((user) => {
                user.admin = user.admin ? "Administrador" : "Usuario";
              });
              res.render("admin/userlist-admin", { users: results });
            }
          }
        );
      }
    });
  } else {
    res.redirect("/login");
  }
});

//Ruta para que se cierre la sesión del usuario
app.post("/logout", (req, res) => {
  if (!req.session) return sendResponse(res, "logout error");
  req.session.destroy();
  res.clearCookie("connect.sid", { path: "/" });
  sendResponse(res, "logout success");
});

//Consultas BBDD para la gestión de cuentas de usuario

// Para el inicio de sesión del usuario
app.post("/iniciar", async (req, res) => {
  var locked = handleLoginAttempt(req, res);
  console.log(loginAttempts);
  if (locked) {
    sendResponse(res, "login timeout");
    return;
  }

  if (!req.body.username || !req.body.password) {
    sendResponse(res, "login failed");
    return;
  } else {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.error("Error al obtener la conexión de la pool: ", err);
        sendResponse(res, "login error");
      } else {
        connection.query(
          "SELECT * FROM usuarios WHERE username = ?",
          [req.body.username],
          async function (error, results, fields) {
            connection.release(); // Liberar la conexión después de usarla

            if (error) {
              console.error("Error al ejecutar la consulta: ", error);
              sendResponse(res, "login error");
            } else {
              if (results.length === 0) {
                sendResponse(res, "login invalid");
                return;
              }

              const user = results[0];
              const hashedPassword = results[0].password;

              const passwordMatch = await bcrypt.compare(
                req.body.password,
                hashedPassword
              );

              if (!passwordMatch) {
                console.log("Contraseña incorrecta");
                sendResponse(res, "login invalid");
                return;
              }

              if (user.is_confirmed === 0 || user.confirm_token !== null) {
                console.log("Usuario no confirmado");
                sendResponse(res, "login unconfirmed");
                return;
              }

              const esAdmin = parseInt(user.admin);
              var rol = "";

              if (esAdmin === 1) {
                req.session.admin = true;
                rol = "Administrador";
                console.log("Entró un administrador");
              } else {
                req.session.user = true;
                rol = "Usuario";
                console.log("Entró un usuario");
              }

              const fecha = user.fecha;
              var dia = fecha.getDate();
              var numMes = fecha.getMonth() + 1;
              var nombreMes;
              var anio = fecha.getFullYear();

              switch (numMes) {
                case 1:
                  nombreMes = "Enero";
                  break;
                case 2:
                  nombreMes = "Febrero";
                  break;
                case 3:
                  nombreMes = "Marzo";
                  break;
                case 4:
                  nombreMes = "Abril";
                  break;
                case 5:
                  nombreMes = "Mayo";
                  break;
                case 6:
                  nombreMes = "Junio";
                  break;
                case 7:
                  nombreMes = "Julio";
                  break;
                case 8:
                  nombreMes = "Agosto";
                  break;
                case 9:
                  nombreMes = "Septiembre";
                  break;
                case 10:
                  nombreMes = "Octubre";
                  break;
                case 11:
                  nombreMes = "Noviembre";
                  break;
                case 12:
                  nombreMes = "Diciembre";
                  break;
              }

              const usuario = {
                username: user.username,
                email: user.email,
                password: req.body.password,
                dia: dia,
                mes: nombreMes,
                anio: anio,
                rol: rol,
              };
              req.session.info = usuario;
              if (req.body.remember) {
                console.log("Recordar usuario");
                req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // Duración de la sesión si se recuerda al usuario
                req.session.save(function (err) {
                  if (err) {
                    console.error("Error al guardar la sesión: ", err);
                  } else {
                    console.log("Sesión guardada");
                  }
                });
              }
              sendResponse(res, "login true");
            }
          }
        );
      }
    });
  }
});

//Para el registro de los usuarios
app.post("/registrar", async (req, res) => {
  const { username, password, email, captcha } = req.body;
  const hashedPassword = await encrypt(password);

  if (captcha === undefined || captcha === "" || captcha === null) {
    sendResponse(res, "invalid captcha");
    return;
  }

  if (!username || !password || !email) {
    sendResponse(res, "register failed");
    return;
  }

  if (username.length > 30 || username.length <= 5 || username.includes(" ")) {
    sendResponse(res, "invalid username");
    return;
  }

  if (email.length > 75 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    sendResponse(res, "invalid email");
    return;
  }

  if (
    password.length > 50 ||
    !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_,.-])[A-Za-z\d!@#$%^&*_,.-]{8,}$/.test(
      password
    )
  ) {
    sendResponse(res, "invalid password");
    return;
  }

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error("Error al obtener la conexión de la pool: ", err);
      sendResponse(res, "register failed");
      return;
    } else {
      const confirmToken = generateToken();
      connection.query(
        "INSERT INTO usuarios(username, email, password, admin, fecha, confirm_token) VALUES (?,?,?, false, CURDATE(), ?)",
        [username, email, hashedPassword, confirmToken],
        function (error, results, fields) {
          connection.release(); // Liberar la conexión después de usarla

          if (error) {
            if (error.code === "ER_DUP_ENTRY") {
              sendResponse(res, "user exists");
            } else {
              console.error("Error al ejecutar la consulta: ", error);
              sendResponse(res, "register failed");
            }
          } else {
            if (results.affectedRows > 0) {
              confirmationMail(email, username, confirmToken);
              sendResponse(res, "register true");
            } else {
              sendResponse(res, "register invalid");
            }
          }
        }
      );
    }
  });
});

//Ruta para confirmar el usuario
app.get("/confirm", (req, res) => {
  const { token } = req.query;
  pool.getConnection((err, connection) => {
    // Buscar el usuario con el token de confirmación en la base de datos
    connection.query(
      "SELECT * FROM usuarios WHERE confirm_token = ?",
      [token],
      (err, result) => {
        connection.release();
        if (err) {
          console.error(err);
          res.status(500).send("Error al confirmar el usuario.");
        } else {
          if (result.length === 0) {
            var contenido = fs.readFileSync(
              "public/passwordAlreadyConfirmed.html",
              "utf8"
            );
            res.setHeader("Content-Type", "text/html");
            res.status(404).send(contenido);
          } else {
            // Actualizar el estado de confirmación del usuario
            connection.query(
              "UPDATE usuarios SET is_confirmed = 1, confirm_token = NULL WHERE username = ?",
              [result[0].username],
              (err, updateResult) => {
                if (err) {
                  console.error(err);
                  res.status(500).send("Error al confirmar el usuario.");
                } else {
                  var contenido = fs.readFileSync(
                    "public/passwordConfirmed.html",
                    "utf8"
                  );
                  res.setHeader("Content-Type", "text/html");
                  res.send(contenido);
                }
              }
            );
          }
        }
      }
    );
  });
});

//Ruta para comprobar el usuario para restablecer la contraseña
app.get("/reset", (req, res) => {
  const { token } = req.query;
  pool.getConnection((err, connection) => {
    // Buscar el usuario con el token de confirmación en la base de datos
    connection.query(
      "SELECT * FROM usuarios WHERE reset_token = ?",
      [token],
      (err, result) => {
        connection.release();
        if (err) {
          console.error(err);
          res.status(500).send("Error al confirmar el usuario.");
        } else {
          if (result.length === 0) {
            var contenido = fs.readFileSync("public/notFound.html", "utf8");
            res.setHeader("Content-Type", "text/html");
            res.status(404).send(contenido);
          } else {
            // Actualizar el estado de confirmación del usuario
            var contenido = fs.readFileSync("public/resetPass2.html", "utf8");
            res.setHeader("Content-Type", "text/html");
            res.send(contenido);
          }
        }
      }
    );
  });
});

//Ruta para que se envíe por e-mail el enlace para restablecer la contraseña
app.post("/forgot-password", (req, res) => {
  const email = req.body.email;

  pool.getConnection((err, connection) => {
    connection.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email],
      (err, result) => {
        connection.release();
        if (err) {
          console.error(err);
          sendResponse(res, "email error");
        } else {
          if (result.length === 0) {
            console.log("No existe el usuario");
            sendResponse(res, "email invalid");
          } else {
            const resetToken = generateToken();
            const usuario = result[0].username;

            connection.query(
              "UPDATE usuarios SET reset_token = ? WHERE email = ?",
              [resetToken, email],
              (err, results) => {
                if (err) {
                  console.error(err);
                  res.status(500).send("Error al confirmar el usuario.");
                } else {
                  if (results.affectedRows > 0) {
                    console.log("Usuario: " + usuario);
                    resetMail(email, usuario, resetToken);
                    sendResponse(res, "email true");
                  } else {
                    sendResponse(res, "email error");
                  }
                }
              }
            );
          }
        }
      }
    );
  });
});

//Para que el usuario pueda cambiar la contraseña (si se le ha olvidado)
app.post("/reset-password", async (req, res) => {
  const password = req.body.password;
  const token = req.body.token;

  if (!password) {
    console.log("No hay password");
    sendResponse(res, "change invalid");
    return;
  }

  if (
    password == "" ||
    password.length > 50 ||
    !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_.])[A-Za-z\d!@#$%^&*_.]{8,}$/.test(
      password
    )
  ) {
    console.log("La contraseña no cumple");
    sendResponse(res, "change invalid");
    return;
  }

  const hashedPassword = await encrypt(password);

  /* pool.getConnection(function (err, connection) {
        connection.query('UPDATE usuarios SET password = ? WHERE username = ?', [hashedPassword, req.session.info.username], (err, updateResult) => {
            connection.release();
            if (err) {
                console.error(err);
                sendResponse(res, "change error");
            } else {
                sendResponse(res, "change success");
            }
        });
    }) */

  pool.getConnection(function (err, connection) {
    connection.query(
      "SELECT * FROM usuarios WHERE reset_token = ?",
      [token],
      (err, result) => {
        connection.release();
        console.log("Devuelve: " + stringify(result));
        if (err) {
          console.error(err);
          sendResponse(res, "change error");
        } else {
          if (result.length === 0) {
            sendResponse(res, "change error");
          } else {
            connection.query(
              "UPDATE usuarios SET password = ?, reset_token = NULL WHERE reset_token = ?",
              [hashedPassword, token],
              (err, updateResult) => {
                if (err) {
                  console.error(err);
                  sendResponse(res, "change error");
                } else {
                  sendResponse(res, "change success");
                }
              }
            );
          }
        }
      }
    );
  });
});

//Para que el usuario pueda cambiar la contraseña (en la interfaz de CyberNiks)
app.put("/change-password", async (req, res) => {
  if (!req.session.info && (!req.session.admin || !req.session.user)) {
    console.log("No hay sesión");
    sendResponse(res, "change invalid");
  } else {
    const password = req.body.password;

    if (!password) {
      sendResponse(res, "change invalid");
      return;
    }

    if (
      password == "" ||
      password.length > 50 ||
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_.])[A-Za-z\d!@#$%^&*_.]{8,}$/.test(
        password
      )
    ) {
      sendResponse(res, "change invalid");
      return;
    }

    const hashedPassword = await encrypt(password);

    pool.getConnection(function (err, connection) {
      connection.query(
        "UPDATE usuarios SET password = ? WHERE username = ?",
        [hashedPassword, req.session.info.username],
        (err, updateResult) => {
          connection.release();
          if (err) {
            console.error(err);
            sendResponse(res, "change error");
          } else {
            sendResponse(res, "change success");
          }
        }
      );
    });
  }
});

//Para que el usuario pueda eliminar su perfil (en la interfaz de CyberNiks)
app.delete("/delete-user", async (req, res) => {
  if (!req.session.info && (!req.session.admin || !req.session.user)) {
    console.log("No hay sesión");
    sendResponse(res, "delete invalid");
  } else {
    pool.getConnection(function (err, connection) {
      connection.query(
        "DELETE FROM usuarios WHERE username = ?",
        [req.session.info.username],
        (err, updateResult) => {
          connection.release();
          if (err) {
            console.error(err);
            sendResponse(res, "delete error");
          } else {
            sendResponse(res, "delete success");
          }
        }
      );
    });
  }
});

//Para que un administrador pueda eliminar un perfil (desde la interfaz de admin.)
app.delete("/eliminar-usuario/:user", (req, res) => {
  if (!req.session.info || !req.session.admin) {
    sendResponse(res, "delete error");
  } else {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "DELETE FROM usuarios WHERE username = ?",
        [req.params.user],
        (err, result) => {
          connection.release();
          if (!err) {
            if (result.affectedRows > 0) {
              sendResponse(res, "delete success");
            } else {
              sendResponse(res, "user invalid");
            }
          } else {
            sendResponse(res, "delete error");
          }
        }
      );
    });
  }
});

//Para que un administrador pueda convertir un usuario en administrador (desde la interfaz de admin.)
app.put("/to-admin/:user", (req, res) => {
  if (!req.session.info || !req.session.admin) {
    sendResponse(res, "to-admin error");
  } else {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "UPDATE usuarios SET admin = TRUE WHERE username = ?",
        [req.params.user],
        (err, result) => {
          connection.release();
          if (!err) {
            if (result.affectedRows > 0) {
              sendResponse(res, "to-admin success");
            } else {
              sendResponse(res, "to-admin invalid");
            }
          } else {
            sendResponse(res, "to-admin error");
          }
        }
      );
    });
  }
});

//Para que un administrador pueda convertir un administrador en usuario (desde la interfaz de admin.)
app.put("/to-user/:user", (req, res) => {
  if (!req.session.info || !req.session.admin) {
    sendResponse(res, "to-user error");
  } else {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "UPDATE usuarios SET admin = FALSE WHERE username = ?",
        [req.params.user],
        (err, result) => {
          connection.release();
          if (!err) {
            if (result.affectedRows > 0) {
              sendResponse(res, "to-user success");
            } else {
              sendResponse(res, "to-user invalid");
            }
          } else {
            sendResponse(res, "to-user error");
          }
        }
      );
    });
  }
});

app.post("/contact", (req, res) => {
  const { name, email, subject, message, captcha } = req.body;

  if (!name || !email || !subject || !message) {
    sendResponse(res, "contact failed");
    return;
  }

  if (email > 75 || name > 75 || subject > 100 || message > 2000) {
    sendResponse(res, "contact failed");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    sendResponse(res, "contact failed");
  }

  if (captcha === undefined || captcha === "" || captcha === null) {
    sendResponse(res, "invalid captcha");
    return;
  }

  contactMail(name, email, subject, message);
  sendResponse(res, "contact success");
});

//En el caso de que vayamos a una ruta que no existe, se lanzará un error 404
app.use((req, res, next) => {
  var contenido = fs.readFileSync("public/notFound.html", "utf8");
  res.setHeader("Content-Type", "text/html");
  res.status(404).send(contenido);
});

//Servidor
const port = 3005;
app.listen(port, () => {
  console.log(`Aplicación escuchando en el puerto ${port}`);
});
