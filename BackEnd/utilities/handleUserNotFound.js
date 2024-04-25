
const userNotFound = (res) =>{
    return res.status(404).json({ message: "User not found" });
}


module.exports = {userNotFound};