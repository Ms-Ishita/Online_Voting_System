import * as authService from "./auth.service.js"

// register API
export const register=async(req, res, next)=>{
    try {
        const user = await authService.registerUser(req.body)

        res.status(201).json({message: "User registered successfully. Please check your email to verify your account.", userID: user.id})
    } catch (error) {
        next(error)
    }
}

export const verifyEmail = async(req, res, next) => {
    try {
        const { token } = req.body
        await authService.verifyEmail(token)
        res.status(200).json({ message: "Email verified successfully!" })
    } catch (error) {
        next(error)
    }
}

// login API
export const login=async(req,res,next)=>{
    try {
        const {user,token}=await authService.loginUser(req.body)

        res.json({
            token,
            user:{
                id:user.id,
                name:user.name,
                role:user.role
            }
        })
    } catch (error) {
        next(error)
    }
}