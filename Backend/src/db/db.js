const mongoose = require('mongoose');

function ConnettoDB() {
    mongoose.connect(process.env.MONGO_URI).then(()=>{console.log("✅ connected to Successfully")}).catch(()=>{console.log("❌ Not connected")})
}

module.exports = ConnettoDB;