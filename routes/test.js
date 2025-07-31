const express = require("express");
const cors = require("cors");
const router = express.Router();

const testCtrl = require("../controllers/test");
const auth = require("../middleware/auth");

router.get("/", cors(), testCtrl.testFunc);
router.post("/signup", cors(), testCtrl.signup);
router.post("/login", cors(), testCtrl.login);
router.put("/save", cors(), auth, testCtrl.save);

module.exports = router;