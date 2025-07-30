const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");

const testRoutes = require("./routes/test");

//Pour créer une application express
const app = express();

require("dotenv").config();
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch((e) => {
		console.log(e);
		console.log("Connexion à MongoDB échouée !")
	});

app.use(helmet());

// Système de sécurité CORS : Cross Origin Resource Sharing
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

//Transformer le corps de la requête en objet javascript utilisable grâce à la méthode json() de bodyParser
app.use(bodyParser.json());

app.use("/test", testRoutes);

module.exports = app;