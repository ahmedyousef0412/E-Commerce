const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  toggleBlock,
} = require("../controllers/userCtrl");


const { authMiddleware, isAdmin } = require("../middlewares/auth");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/getAll", authMiddleware, isAdmin, getAllUser);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.put("/:id", authMiddleware, isAdmin, updateUser);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);
router.put("/toggle-block/:id", authMiddleware, isAdmin, toggleBlock);


module.exports = router;
