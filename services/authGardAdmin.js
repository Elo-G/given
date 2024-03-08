const adminModel= require('../models/adminModel');

const authGardAdmin = async (req,res,next) => {
   try {
     //trouve ds la base de données un admin dont l'_id correspond à celui de l'user en session (à l'user connecté),et stoque les ds la variable admin
     let  admin= await adminModel.findById(req.session.adminId);
     //si admin:
     if (admin){
         console.log('administrateur connecté: ' + admin);
         //passe à de la prochaine étape:
         next();
     }else {
        req.session.loginMessageAdmin='Vous devez vous connecter pour accéder à cette page';
        res.redirect('/connexion_admin');
     }
   } catch (error) {
     console.log(error);
     res.send(error)
   }
}
    
      


module.exports= authGardAdmin;