const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey : process.env.PUBLICKEY,
    privateKey : process.env.PRIVATEKEY,
    urlEndpoint : process.env.ENDURLPOINT
});

async function uploadfile(file,filename){
    const responce = await imagekit.upload({
        file:file,
        fileName:filename,
        folder:"Chat-App"
    })

    return responce
}

module.exports = uploadfile