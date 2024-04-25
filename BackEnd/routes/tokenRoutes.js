

const express = require("express");
const router = express.Router();

const {handleRefreshToken} = require('../controllers/handleRefreshToken');


router.post("/refresh",handleRefreshToken)


module.exports = router;