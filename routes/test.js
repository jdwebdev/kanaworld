const express = require("express");
const cors = require("cors");
const router = express.Router();

const testCtrl = require("../controllers/test");
const auth = require("../middleware/auth");

router.get("/", cors(), testCtrl.testFunc);
router.post("/signup", testCtrl.signup);
router.post("/login", testCtrl.login);
router.put("/save", auth, testCtrl.save);

module.exports = router;