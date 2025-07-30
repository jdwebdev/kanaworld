const express = require("express");
const router = express.Router();

const testCtrl = require("../controllers/test");
const auth = require("../middleware/auth");

router.get("/", testCtrl.testFunc);
router.post("/signup", testCtrl.signup);
router.post("/login", testCtrl.login);
router.put("/save", auth, testCtrl.save);

module.exports = router;