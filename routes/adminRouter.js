//j'importe les fichiers et extensions dont j'ai besoin :

const bcrypt = require('bcrypt');
const adminModel =require ('../models/adminModel');
//j'importe annonceModelModel car j'en aurai besoin dans les routes qui affichent les dernières annonces:
const annonceModel = require ('../models/annonceModel');
//j'importe userModel car j'en aurai besoin dans les routes pour update les users:
const userModel = require('../models/userModel');
//j'importe authGard pour sécuriser les routes de l'appli (:L'utilisateur doit être authentifié pour que authGard lui donne accès à l'url)
const authGardAdmin = require("../services/authGardAdmin");
//j'importe uploadFile où est configuré multer pour qu'on puisse uploader des fichiers (les images)
const upload = require ('../services/uploadFile');
const { log } = require('async');
const { lightblue } = require('color-name');
const adminRouter = require ('express').Router();



//--------------------------------route pour aller sur le formulaire adminRegister:

adminRouter.get('/enregistrement_admin', async(req,res)=>{
    try {
     res.render('./pages/adminRegister.twig',);
    } catch (error) {
     console.log(error);
     res.send(error);
    }
});

//---------------------------------------- route pr s'enregistrer (créer son compte):

adminRouter.post('/enregistrement_admin', async(req, res)=>{
    try {
        //vérifie si mail existe déjà en bdd
        let findAdmin = await adminModel.findOne({mail:req.body.mail}); /*vérifie si en bdd  il y a un adminModel 
                                                                         dont  mail: adresse mail saisie ds l'input (<=> dc stoquée ds le req.body)*/
        if (findAdmin){
            throw {mailExisting: 'Cette adresse existe déjà'};
        }

        //vérifie si mdp conforme à regex:
        if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/g.test(req.body.password)){
            throw {errorPassword :'Le mot de passe doit contenir 8 caractères, 1 majuscule , et 1 chiffre'};
        }

        //vérifie confirmation du mdp:
        if (req.body.password !== req.body.confirmPassword){
            throw {errorConfirmPassword: 'Les mots de passe doivent être identiques'};
        }
        /*crée une nvelle instance d'adminModel que tu stoque dans la variable admin (à partir de cette instance on créera un nvl admin 
        en bdd quand on sauvegardera  admin plus bas ds le code)*/
        let admin = new adminModel(req.body);
        //vérifie que les regles de validation  établie ds le Schema sont respectéesen appliquant validateSync() à l'admin crée:
        let err = admin.validateSync();
        if (err){
            throw err;
        }
         //si aucune erreur relevée, poursuit avec la sécurisation du mdp puis la sauvegarde de l'admin en bdd
         admin.password=bcrypt.hashSync(req.body.password, parseInt (process.env.SALT));
         await admin.save();
         res.redirect('/connexion_admin');

    } catch (error) {
        console.log(error);
        res.render('./pages/adminRegister.twig',{
         errorMail:error.mailExisting,
         errorPassword:error.errorPassword,
         errorConfirmPassword :error.errorConfirmPassword,
         validateErrors:error.errors
        });
    };
});


//---------------------------------------- route page adminLogin:

adminRouter.get('/connexion_admin',async (req,res)=>{
    try {
     let loginMessageAdmin = null;
     if (req.session.loginMessageAdmin){
         loginMessageAdmin= req.session.loginMessageAdmin;
        };
     res.render('./pages/adminLogin.twig',{loginMessageAdmin});
    } catch (error) {
        console.log(error);
        res.send(error);
    };
});


//---------------------------------------- route pr se loguer:

adminRouter.post('/connexion_admin', async (req, res)=>{
 try{      
     let admin = await adminModel.findOne({mail:req.body.mail});
     if (!admin){
         res.render ('./pages/adminLogin.twig', {errorMail:"Cet administrateur n'existe pas"});
     //si le mdp saisie correspond au mdp de l'admin,enregistré en bdd:
     } else if (bcrypt.compareSync(req.body.password, admin.password)){
         /*garde l'admin en session via son _id (:en donnant pr valeur à l'attribut adminId de l'objet de session : admin._id
         (req.session représente l'objet qui stoque les données spécifique à la session du client connecté (l'admin ds notre cas ):*/
         req.session.adminId = admin._id;
         res.redirect ('/tableau_de_bord_admin');
     } else {
         res.render ('./pages/adminLogin.twig', {errorPassword:"Mot de passe invalide"});
     };
    }catch(error){
      console.log(error);
      res.send(error);
    };
});
    

//---------------------------------------- route pr se déloguer:

adminRouter.get ('/deconnexion',async (req, res)=>{
    try {
      req.session.destroy();
      res.redirect('/');
    } catch(error){
        console.log(error);
        res.send (error);
    };
});


//---------------------------------------- route pour réinitialiser son mdp:

adminRouter.get('/forgot_password', async (req, res)=>{
    try {
        res.render('./pages/forgotPassword.twig')
    } catch (error) {
        console.log(error);
        res.send(error);
    }
 })

 //TODO:-------------------------------------- code réinitilisation du mdp



//--------------------------- route pr aller sur page adminDashboard et y afficher les employées:

adminRouter.get('/tableau_de_bord_admin', authGardAdmin, async (req, res)=>{
    let users = await userModel.find();
    try {
      res.render('./pages/adminDashboard.twig',{users:users});//le 1er users est une clé que je nomme users, et le 2èmes users est la valeur de let users = await userModel.find()= tous les users trouvés par mongoose dans mongodb
    } catch (error) {
      console.log(error);
     res.send (error);
    };
});

//--------------------------- route pr aller sur main depuis l'interface admin

adminRouter.get('/dernieres_annonces', async(req,res)=>{
    let annonces= await annonceModel.find();
    try {
        res.render('./pages/main.twig', {annonces:annonces, userType: "admin"})
       // console.log(annonces);ligne de code à retirer ensuite ,je verifie juste que la clé annonces contiennent ttes les annonces trouvé par mongoose en bdd
    } catch (error) {
        console.log(error);
        res.send(error);
    };
    });


    //----------------route pour chercher les annonces par nom de l'objet via searchBar depuis l'interface admin:

adminRouter.get('/admin_resultats_recherche/', async (req,res)=>{
    try {
      //récupération des anonces dont l'objectName correspond à req.query.categorie:
      let searchResults = await annonceModel.find({objectName:req.query.objectName});
      res.render ('./pages/recherche.twig',{searchResults:searchResults, userType:"admin" });
    } catch (error) {
      console.log(error);
      res.send(error);
    };
  });
  
  
  //----------------route pour chercher une categorie via la barre de recherche depuis l'interface admin:
  
  adminRouter.get('/admin_resultats_par_categorie/', async(req, res)=>{
    try {
      //récupération de la catégorie via req.query.categorie:
      let annoncesByCategorie= await annonceModel.find({categorie:req.query.categorie});
      res.render('./pages/annoncesByCategorie.twig',{annoncesByCategorie:annoncesByCategorie, userType:"admin" });
    } catch (error) {
      console.log(error);
      res.send(error);
    };
  });
//------------------------------------route supprimer un utilisateur:

adminRouter.get('/delete_user/:id',async(req,res)=>{
    try {
        await userModel.deleteOne({_id:req.params.id});//supprime moi l'user dont la clé "_id" (dans la bbd), = à la valeur du paramètre ":id" dans l'url
                                                       //cet id est disponible dynamiquement ds l'url grâce au {{user.id}} qu'on a mis dans la vue adminDashboard au niveau du href pour le bouton supprimer des cards 
        res.redirect('/tableau_de_bord_admin');
    } catch (error) {
        console.log(error);
        res.send(error);
    };
});


//------------------------------------route obtenir le formulaire de modification des utilisateurs:

adminRouter.get('/mise_a_jour_utilisateur/:id', async (req,res)=>{
    try {
       let userToUpdate = await userModel.findOne({_id:req.params.id});
       res.render('./pages/updateUser.twig',{
         user : userToUpdate
        });
    } catch (error) {
        console.log(error);
        res.send(error);
    };
});


//------------------------------------route enregistrer modif utilisateur:

adminRouter.post('/mise_a_jour_utilisateur/:id',upload.single('img'), async (req,res)=>{ 
    // user à mettre à j = userModel trouvé en bdd dont l'_id correspond à req.params.id:
    let userToUpdate = await userModel.findById(req.params.id);
    try {
        if (req.file) {
            if (req.multerError) {
             throw {fileError: 'Veuillez entrer un fichier valide'};
            }else {
             req.body.img=req.file.filename;
            };
        };
        //si il y a un userToUpdate et que le mail saisi dans l input du form de modification est different de celui stoqué initialement en bdd:
        if (userToUpdate && req.body.mail !== userToUpdate.mail){
             /* on vérifie que ce nouveau mail saisi n'appartient pas déjà à un autre user (en vérifiant si on trouve un user en bdd dont le
             mail correspond au mail saisi ds le req.body):*/
            let findUser = await userModel.findOne({mail:req.body.mail});
            if (findUser) { 
             throw {mailExisting: 'cette adresse existe déjà'};
            };
        } ; 
        //màj de l'utilisateur  à partir des donnée saisi ds le form et dc stoquée ds le req.body, et application des regles de validation établies ds le userSchema
        await userModel.updateOne({_id:req.params.id}, req.body, {runValidators:true, omitUndefined:true});// omitUndefined:true <=>Seules les valeurs définies dans req.body sont prises en compte 
        res.redirect('/tableau_de_bord_admin');
    }catch (error) {
     console.log(error);
     res.render('./pages/updateUser.twig',{
          user:req.body,//je met cette clé ds le res.render du block catch  pr qu'en cas d'erreur générée par l'admin lors de la modification de l'user ,les modif saisies par l'admin se réaffiche dans le form au chargement de la page(généré qd les erreurs s'affichent)
          errorMail:error.mailExisting,
          errorFile:error.fileError,
          validateErrors:error.errors,
        });
    };
});



   module.exports= adminRouter;

