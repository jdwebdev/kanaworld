const express = require("express");
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
const helmet = require("helmet");

const testRoutes = require("../routes/test");
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sanitize = require("mongo-sanitize");

const auth = require("../middleware/auth");

//Pour créer une application express
const app = express();

require("dotenv").config();
// mongoose.connect(process.env.MONGODB_URI)
//     .then(() => console.log("Connexion à MongoDB réussie !"))
//     .catch((e) => {
// 		console.log(e);
// 		console.log("Connexion à MongoDB échouée !")
// 	});


app.use(helmet());

// Système de sécurité CORS : Cross Origin Resource Sharing
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

//? À ajouter peut-être
// app.use(cors())

//Transformer le corps de la requête en objet javascript utilisable grâce à la méthode json() de bodyParser
app.use(bodyParser.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// app.use("/test", testRoutes);
app.get("/test", async (req, res) => {
	res.status(200).json("OK");
})

app.post("/test/signup", async (req, res, next) => {
	const name = req.body.name; // Dans le front : Empêcher les caractères spéciaux
    const password = sanitize(req.body.password);

    let bNameOk = false;
    let bPassOk = false;
    let authorizedChar = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (name.length >= 6 && name.length <= 20) {
        bNameOk = true;
        for (let i = 0; i < name.length; i++) {
            if (!authorizedChar.includes(name[i])) {
                bNameOk = false;
            }
        }
    }
    if (password.length >= 6 && password.length <= 20) {
        bPassOk = true;
        for (let i = 0; i < password.length; i++) {
            if (!authorizedChar.includes(password[i])) {
                bPassOk = false;
            }
        }
    }
	

	try {

		if (bNameOk && bPassOk) { 

			const { data, error } = await supabase
			.from('USER')
			.select()
			.eq("username", name);

			if (data.length === 0) {
				req.newDatas = {
					bodyName: name,
					bodyPassword: password,
					hash: "",
					saveData: req.body.saveData
				}
				next();

			} else {
				return res.status(409).json({ 'error': 'already' });
			}

		} else {
			return res.status(400).json({ error: "Ko"});
		}

	} catch (error) {
		return res.status(400).json({ error })
	}

}, (req, res, next) => {
	bcrypt.hash(req.newDatas.bodyPassword, 10)
	.then(hash => {
		req.newDatas.hash = hash
		next()
	})
}, async (req, res) => {

	const { data, error } = await supabase
		.from('USER')
		.insert([{ 
			username: req.newDatas.bodyName, 
			pass: req.newDatas.hash, 
			saveData: req.newDatas.saveData 
		}])
		.select()

		if (data.length === 1) {
	
			let newUser = {
				id: data[0].id,
				username: req.newDatas.bodyName,
				pass: req.newDatas.hash,
				saveData: req.newDatas.saveData
			}
	
			return res.status(201).json({
				userId: newUser.id,
				userName: newUser.username,
				saveData: newUser.saveData,
				token: jwt.sign(
					{ userId: newUser.id },
					process.env.TOKEN, 
					{ expiresIn: "24h" }
				)
			});

		} else {
			return res.status(400).json({ error })
		}
});

app.post("/test/login", async (req, res) => {

	try {

		const { data, error } = await supabase
		.from('USER')
		.select()
		.eq("username", req.body.name);

		if (data.length === 1) {
			let foundUser = data[0];

			bcrypt.compare(req.body.password,foundUser.pass)
			.then(valid => {
				if (!valid) {
					return res.status(401).json({ error: "Incorrect user or password"});
				}
				res.status(200).json({ 
					userId: foundUser.id, 
					userName: foundUser.username,
					saveData: foundUser.saveData,
					token: jwt.sign(
						{ userId: foundUser.id },
						process.env.TOKEN, 
						{ expiresIn: "24h" }
					)
				});
			})
			.catch(error => res.status(500).json({ error: error }))

		} else {
			return res.status(401).json({ error: "Incorrect user or password"});
		}

	} catch (error) {
		return res.status(400).json({ error })
	}

});

app.put("/test/save", auth, async (req, res) => {
	const body = sanitize(req.body);
    let user = { ...body };

	try {
		let today = new Date();
		today += "";
		today = today.split("(")[0];

		const { data, error } = await supabase
		.from('USER')
		.update({ saveData: user.saveData, lastConnection: today })
		.eq("id", req.body.id)
		.select()

		if (error) {
			res.status(400).json({ error });
		} else {
			res.status(200).json({ message: "OK"});
		}

	} catch (error) {
		return res.status(400).json({ error })
	}

});



const http = require("http");
// const app = require("./api/index");

const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = error => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === "string" ? "pipe " + address : "port: " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges.");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use.");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
    const address = server.address();
    const bind = typeof address === "string" ? "pipe " + address : "port " + port;
    console.log("Listening on " + bind);
});

server.listen(port);

module.exports = app;