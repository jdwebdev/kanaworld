const Test = require("../models/Test");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sanitize = require("mongo-sanitize");

exports.testFunc = ((req, res, _) => {
    res.status(200).json("OK")
})

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
        Test.findOne({ name: name })
        .then((user) => {
            if (!user) {
                bcrypt.hash(password, 10)
                    .then(hash => {
                        const user = new Test({
                            name: name,
                            password: hash,
                            saveData: req.body.saveData
                        });
                        user.save()
                        .then((newUser) => {
                            return res.status(201).json({
                                userId: newUser.id,
                                userName: newUser.name,
                                saveData: newUser.saveData,
                                token: jwt.sign(
                                    { userId: newUser.id },
                                    process.env.TOKEN, 
                                    { expiresIn: "24h" }
                                )
                            });
                        })
                        .catch(() => res.status(500).json({'error': 'Impossible de créer un nouvel utilisateur' }))
                    })
            } else {
                return res.status(409).json({ 'error': 'already' });
            }
        })
        .catch(() => { return res.status(500).json({ 'error': `Impossible de vérifier l'utilisateur` }) });
    } else {
        return res.status(500).json({'error': 'Ko'});
    }
};

exports.login = (req, res, next) => {
    const name = req.body.name;
    const password = sanitize(req.body.password);
    Test.findOne({ name: name })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Incorrect user or password"});
            }
            bcrypt.compare(password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Incorrect user or password"});
                    }
                    res.status(200).json({ 
                        userId: user._id, 
                        userName: user.name,
                        saveData: user.saveData,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN, 
                            { expiresIn: "24h" }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};

exports.save = (req, res, _) => {
    let user = {};
    const body = sanitize(req.body);
    user = { ...body };
        
    Test.updateOne({ _id: req.body.id }, { saveData: req.body.saveData, _id: req.body.id })
        .then(() => { 
            res.status(200).json({ message: "OK"})
        })
        .catch(error => res.status(400).json({ error }));
};