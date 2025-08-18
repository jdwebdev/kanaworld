const jwt = require("jsonwebtoken");

// Pour chaque requête sur une route protégée on passe d'abord par ce middleware : 
module.exports = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodedToken.userId;
        //? Si l'id est undefined/null OU qu'il ne correspond pas au userId du Token, on lance l'exception
        if (!req.body.id || req.body.id !== userId) {
            throw "User ID non valable !";
        } else {
            next();
        }


    } catch(error) {
        res.status(401).json({ error: error | "Requête non authentifiée !" });
    }
};