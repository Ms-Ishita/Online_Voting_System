import * as userService from "./user.service.js"

/*
GET /api/users/me
*/
export const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id)
    res.json(user)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}

/*
GET /api/users
(Admin only)
*/
export const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers()
  res.json(users)
}

/*
DELETE /api/users/:id
(Admin only)
*/
export const deleteUser = async (req, res) => {
  console.log("Path Params (req.params):", req.params);
  try {
       // god can delete any but not temselves
       if(req.user.id == req.params.id && req.user.role === "god"){
        return res.status(400).json({
          message: "A god cannot delete their own account. Please contact another god to delete your account."
        });
       }

       

    await userService.deleteUser(req.params.id)
    res.json({ message: "User deleted" })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}


// Update user details (god can only update)
export const updateUserRole = async(req, res) =>{
  try{
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["voter", "admin", "god"];
    if(!validRoles.includes(role)){
      return res.status(400).json({ 
        message: "Invalid role specified"
      });
    }

    if(req.user.id == id && req.user.role === "god" && role !== "god" ){
      return res.status(400).json({
        message: "A god cannot demote themselves. Please contact another god to change your role."
      });
    }

    const updatedUser = await userService.updateUserRole(id, role);
     
    const userJson = updatedUser.toJSON();
    delete userJson.password;


    res.status(200).json({
      message: `User role updated successfully to ${role}`,
      user: userJson,
    });

  }catch(error){
    console.error("Error while updating user role:",error);

    if(error.message === "User not found"){
      return res.status(404).json({error: error.message});
    }

    res.status(500).json({
      error: "Internal Server Error",
      error: error.message
    });
  }
};


export const updateProfile = async(req, res)=>{
  try {
    const userId = req.user.id;

    const { email, password } = req.body;

    if(!email && !password){
      return res.status(400).json({
        message: "At least one field email/password must be provied for update"
      });
    }

    const updateData = await userService.updateProfile(userId, { email, password});

    const userJson = updateData.toJSON();
    delete userJson.password;

    res.status(200).json({
      message: "Profile updated successfully",
      user: userJson,
    });
  } catch (error) {
    console.error("Upadte Profile Error:",erorr);

    if(error.message === "User not found"){
      return res.status(404).json({message: error.message});
    }

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};


export const verifyUser = async(req, res) =>{
  try {
    const { id } = req.params;

    const updatedUser = await userService.verifyUserAccount(id);

    const userJson = updatedUser.toJSON();
    delete userJson.password;

    res.status(200).json({
      message: "User account verified successfully",
      user: userJson,  
    });
  } catch (error) {
    console.error("Verify User Error:",error);
    if(error.message === "User not found"){
      return res.status(404).json({message: error.message});
    }
    res.status(500).json({
      message: "Internal Server Error",
      erro: error.message
    });
  }
};

export const suspendUser = async(req, res)=>{
  try {
    const { id } = req.params;

    if(req.user.id == id){
      return res.status(400).json({
        message: "You cannot suspend your own account"
      });
    }
    const updatedUser = await userService.suspendUserAccount(id); 
    
    if(updatedUser.role === "god" && req.user.role !== "god"){
      updatedUser.isSuspended = false;
      await updatedUser.save();
      return res.status(403).json({
        message:"Admins cannot suspend a god-level user." 
      });
    }
    const userJson = updatedUser.toJSON();
    delete userJson.password;

    res.status(200).json({
      message: "User account suspended successfully",
      user: userJson,
    });
  } catch (error) {
    console.erro("Suspending User Error:",error);
    if(error.message === "User not found"){
      return res.status(404).json({
        message: error.message
      });
    }
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
}