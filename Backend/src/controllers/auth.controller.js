const userModel = require("../model/user.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uploadfile = require("../services/Storage.service");
const {v4: uuidv4} = require('uuid')

async function authRegister(req,res){
    const {fullname , email, password, bio} = req.body

   
    
    const ifExist = await userModel.findOne({email});
    if(ifExist){
        return res.status(401).json({
            msg:"User already exist.!",
            
        })
    }

    // const image = await uploadfile(req.file.buffer , req.file.originalname);
    
    
    
    const user = await userModel.create({
        fullname,
        email,
        password:await bcrypt.hash(password , 10),
        bio,
    });

    const token = jwt.sign({id:user._id} , process.env.JWT_SECRET);
    res.cookie("token" , token);

    res.status(201).json({
        message:"Registered successfully.!",
        token:token,
        user
    })
}

async function authlogin(req,res){

    const{email,password} = req.body

    const EmailExist = await userModel.findOne({email})
    
    if(!EmailExist){
        return res.status(401).json({
            message:"Email does not exist.!"
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password , EmailExist.password)
    if(!isPasswordCorrect){
        return res.status(401).json({
            message:"Invalid Password.."
        })
    }
    
    const token = jwt.sign({id:EmailExist._id}, process.env.JWT_SECRET, {expiresIn:'2d'})
    res.cookie("token",token)

    res.status(200).json({
        message:"Login Successfull.!",
        token,
        EmailExist
    })


}

async function authlogOut(req,res){
    res.clearCookie("token")

    res.status(200).json({
        message:"Log Out Successfully",
    })
}

async function updateProfile(req, res) {
    const { id } = req.params;
    const { fullname, bio } = req.body;
    
    

    const updateUser = {};
    if (fullname) updateUser.fullname = fullname;
    if (bio) updateUser.bio = bio;
    
    if (req.file) {
        try {
             
            const uploadImage = await uploadfile(req.file.buffer, `${uuidv4()}`);
            updateUser.profilePic = uploadImage.url;
            
        } catch (uploadErr) {
            console.log("ImageKit Upload Error:", uploadErr);
            return res.status(500).json({ message: "Image upload failed" });
        }
    }

    const updateData = await userModel.findByIdAndUpdate(id, updateUser, { new: true });

    res.status(200).json({
        message: "Profile updated successfully!",
        updateData
    });
}



module.exports = {authRegister , authlogin , authlogOut ,updateProfile};