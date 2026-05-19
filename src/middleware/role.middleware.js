const roleMiddleware = (allowed) =>{
    return (req,res,next) =>{
        const roles = Array.isArray(allowed) ? allowed : [allowed];

        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message: "Forbidden: You do not have the required persmissions"
            });
        }
        next();
    }
}

export default roleMiddleware