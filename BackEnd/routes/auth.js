
const express = require("express");
const router = express.Router();
const { createUser, loginUser, getAllUser, getUser,updateUser,deleteUser } = require("../controllers/userCtrl")



router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/getAll", getAllUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
