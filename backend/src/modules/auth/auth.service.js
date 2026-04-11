import User from "../users/user.model.js"
import { hashPassword, comparePassword } from "../../utils/hash.js"
import { generateToken } from "../../utils/jwt.js"
import { INTEGER } from "sequelize";


// register user
export const registerUser= async ({name, email, password})=>{
    const existingUser = await User.findOne({where:{email}});
    if(existingUser){
        throw Error("Email already registered");
    }

    const userCount = await User.count();
    const assignedRole = userCount === 0 ? "god" : "voter";

    const hashedPassword = await hashPassword(password)

    const user= await User.create({
        name,
        email,
        password: hashedPassword,   
        role: assignedRole // default role is voter
    })

    const userJson = user.toJSON()
    delete userJson.password;

    return userJson;
}

// login user
export const loginUser = async({email,password})=>{
    const user=await User.findOne({where:{email}})
    if(!user){
        throw Error("Invalid Email")
    }

    const isMatch=await comparePassword(password,user.password)

    if(!isMatch){
        throw Error("Invalid Password")
    }

    const token = generateToken(user)


    // delete data before sending response to frontend
    const userJson = user.toJSON();
    delete userJson.password;

    return {user: userJson,token}
}