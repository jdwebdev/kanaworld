const Test = require("../models/Test");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sanitize = require("mongo-sanitize");
const fs = require("fs");

/* 
	username:JaDona;;;
	password:$2b$10$U6FupRYFS4vG9W1teTta2OrA4aRjvV/xXgMz6CbfiZR9aMpuynFaa;;;
	{"intro":1,"prologue":12,"lessons":
		{"h1":{"fullcomplete":1,"finish":1,"lessonTestGeneral":48,"lessonTest1":48,"lessonTest2":48,"fullTestGeneral":48,"fullTest1":48,"fullTest2":48,"buttonAnimation":1,"newAnimation":1,"newFinish":1,"fullcompleteAnimation":0},
		"h2":{"fullcomplete":1,"finish":1,"lessonTestGeneral":48,"lessonTest1":48,"lessonTest2":48,"fullTestGeneral":48,"fullTest1":48,"fullTest2":48,"buttonAnimation":1,"newAnimation":1,"newFinish":1,"fullcompleteAnimation":0},
		"h3":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":1,"newAnimation":1,"newFinish":1,"fullcompleteAnimation":0},
		"h4":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"h5":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"h6":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"h7":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"h8":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"h9":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"h10":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"h11":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"h12":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"h13":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"h14":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"h15":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"k1":{"fullcomplete":1,"finish":1,"lessonTestGeneral":48,"lessonTest1":48,"lessonTest2":48,"fullTestGeneral":48,"fullTest1":48,"fullTest2":48,"buttonAnimation":1,"newAnimation":1,"newFinish":1,"fullcompleteAnimation":0},
		"k2":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":48,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":1,"newAnimation":1,"newFinish":1,"fullcompleteAnimation":0},
		"k3":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"k4":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"k5":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"k6":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"k7":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"k8":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"k9":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"k10":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"k11":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"k12":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"k13":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"k14":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0},
		"k15":{"fullcomplete":0,"finish":0,"lessonTestGeneral":0,"lessonTest1":0,"lessonTest2":0,"fullTestGeneral":0,"fullTest1":0,"fullTest2":0,"buttonAnimation":0,"newAnimation":0,"newFinish":0,"fullcompleteAnimation":0}},
		"freemode":{"game1":{"hiraganaGeneral":0,"hiragana1":0,"hiragana2":0,"katakanaGeneral":0,"katakana1":0,"katakana2":0}},
	"bgm":0,"sfx":0.5}

*/

exports.testFunc = ((req, res, _) => {

	// fs.readFile("./save.txt", 'utf8', function (err, data) {
	// 	console.log("reading...");
	// 	// console.log(data);
	// 	let bFound = false;
	// 	let userFound = {};
	// 	const users = data.split("\n");
	// 	users.forEach((u, i) => {
	// 		let username = u.split(";;;")[0];
	// 		let pass = u.split(";;;")[1];
	// 		if (username === "JaDona") {
	// 			console.log("JADONA user found !!!!");
	// 			console.log(username);
	// 			console.log(pass);
	// 			userFound = {
	// 				username: username,
	// 				password: pass,
	// 				saveData: u.split(";;;")[2],
	// 				token:
				
	// 			};
	// 		}
	// 	});
	// });

    res.status(200).json("OK")
});

exports.getAllUsers = (req, res, next) => {
    Test.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => res.status(400).json({ error }));
};

exports.signup = (req, res, next) => {
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
    if (bNameOk && bPassOk) {
			
		
		fs.readFile("./save.json", 'utf8', function (err, data) {
			let users = JSON.parse(data);
			let bFound = false;
			users.forEach((u, i) => {
				if (u.username === name) {
					bFound = true;
				}
			});
			if (!bFound) {

				bcrypt.hash(password, 10)
                    .then(hash => {

						let newUser = {
							username: name,
							pass: hash,
							saveData: JSON.parse(req.body.saveData)
						}

						users.push(newUser);

						let newData = JSON.stringify(users);

						fs.writeFile("./save.json", newData, (err) => {
							if (err) {
								res.status(400).json({ message: "WRITE FILE ERROR"})
							} else {

								return res.status(201).json({
									userId: "1234",
									userName: newUser.username,
									saveData: newUser.saveData,
									token: jwt.sign(
										{ username: newUser.username },
										process.env.TOKEN, 
										{ expiresIn: "24h" }
									)
								});

							}
						});

                    })

				

				
			} else {
				return res.status(409).json({ 'error': 'already' });
			}
		});





        // Test.findOne({ name: name })
        // .then((user) => {
        //     if (!user) {
        //         bcrypt.hash(password, 10)
        //             .then(hash => {
        //                 const user = new Test({
        //                     name: name,
        //                     password: hash,
        //                     saveData: req.body.saveData
        //                 });
        //                 user.save()
        //                 .then((newUser) => {
        //                     return res.status(201).json({
        //                         userId: newUser.id,
        //                         userName: newUser.name,
        //                         saveData: newUser.saveData,
        //                         token: jwt.sign(
        //                             { userId: newUser.id },
        //                             process.env.TOKEN, 
        //                             { expiresIn: "24h" }
        //                         )
        //                     });
        //                 })
        //                 .catch(() => res.status(500).json({'error': 'Impossible de créer un nouvel utilisateur' }))
        //             })
        //     } else {
        //         return res.status(409).json({ 'error': 'already' });
        //     }
        // })
        // .catch(() => { return res.status(500).json({ 'error': `Impossible de vérifier l'utilisateur` }) });




    } else {
        return res.status(500).json({'error': 'Ko'});
    }
};

exports.login = (req, res, next) => {
    const reqBodyName = req.body.name;
    const reqBodyPassword = sanitize(req.body.password);

	console.log("__dirname: " + __dirname);

	// fs.readFile("./save.json", 'utf8', function (err, data) {
	// 	if (err) {
	// 		console.log("ERROR: save.json");
	// 	} else {
	// 		console.log("OK: save.json");
	// 	}
	// })
	// fs.readFile("./save2.json", 'utf8', function (err, data) {
	// 	if (err) {
	// 		console.log("ERROR: /save2.json");
	// 	} else {
	// 		console.log("OK: /save2.json");
	// 	}
	// })
	// fs.readFile("/save3.json", 'utf8', function (err, data) {
	// 	if (err) {
	// 		console.log("ERROR: /save3.json");
	// 	} else {
	// 		console.log("OK: /save3.json");
	// 	}
	// })

	

	fs.readFile(__dirname + "/save3.json", 'utf8', function (err, data) {
		if (err) {
			console.log("ERROR: __dirname/save3.json");
		} else {
			console.log("OK: __dirname/save3.json");
		}
	})



	fs.readFile(__dirname + "/save3.json", 'utf8', function (err, data) {
	
		if (err) {
			console.log("error: " + "__dirname/save3.json");
			return res.status(400).json({ error: err });
		} else {
			return res.status(200).json({ msg: "OKKK" });
		}

		console.log(data);
		let users = JSON.parse(data);

		let bFound = false;
		let userFound = {};

		users.forEach(u => {
			if (u.username === reqBodyName) {
				bFound = true;
				userFound = u;
			}
		});

		if (bFound) {

			bcrypt.compare(reqBodyPassword, userFound.pass)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Incorrect user or password"});
                    }

                    return res.status(200).json({ 
						userId: "1234",
                        userName: userFound.username,
                        saveData: userFound.saveData,
						fromFile: "DATA FROM FILE",
                        token: jwt.sign(
                            { username: userFound.username },
                            process.env.TOKEN, 
                            { expiresIn: "24h" }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
		} else {
			return res.status(401).json({ error: "Incorrect user or password"});
		}

		return;
	});

    // Test.findOne({ name: name })
    //     .then(user => {
    //         if (!user) {
    //             return res.status(401).json({ error: "Incorrect user or password"});
    //         }
    //         bcrypt.compare(password, user.password)
    //             .then(valid => {
    //                 if (!valid) {
    //                     return res.status(401).json({ error: "Incorrect user or password"});
    //                 }
    //                 res.status(200).json({ 
    //                     userId: user._id, 
    //                     userName: user.name,
    //                     saveData: user.saveData,
    //                     token: jwt.sign(
    //                         { userId: user._id },
    //                         process.env.TOKEN, 
    //                         { expiresIn: "24h" }
    //                     )
    //                 });
    //             })
    //             .catch(error => res.status(500).json({ error }))
    //     })
    //     .catch(error => res.status(500).json({ error }));


};

exports.save = (req, res, _) => {
    let user = {};
    const body = sanitize(req.body);
    user = { ...body };
	let saveData = "";

	fs.readFile("./save.json", 'utf8', function (err, data) {
		let users = JSON.parse(data);
		
		users.forEach((u, i) => {
			if (u.username === user.name) {
				bFound = true;
				u.saveData = JSON.parse(user.saveData);
			}
		});
		if (bFound) {
			let usersJson = JSON.stringify(users);
			fs.writeFile("./save.json", usersJson, (err) => {
				if (err) {
					res.status(400).json({ message: "WRITE FILE ERROR"})
				} else {
					res.status(200).json({ message: "OK"})
				}
			});
		}
	});
    


    // Test.updateOne({ _id: req.body.id }, { saveData: req.body.saveData, _id: req.body.id })
    //     .then(() => { 
    //         res.status(200).json({ message: "OK"})
    //     })
    //     .catch(error => res.status(400).json({ error }));
};