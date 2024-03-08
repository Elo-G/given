//authGard des utilisateurs:
const userModel = require ("../models/userModel");


const authGardUser = async (req, res, next) => {
  
  let user = await userModel.findById(req.session.userId);
  if(user){
     next();
        
  }else {
   req.session.loginMessage='Vous devez être connecté pour créer une annonce';
   res.redirect('/connexion');  
  }
}
   
    

    

module.exports = authGardUser