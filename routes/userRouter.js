//j'importe les fichiers et extensions dont j'ai besoin :

//j'importe bcrypt pour hacher les mots de passe:
const bcrypt= require ('bcrypt');
const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');
//j'importe authGard pour sécuriser les routes de l'appli (:L'utilisateur doit être autentifié pour que authGard lui donne accès à l'url)
const authGardUser = require("../services/authGardUser");
//ds dossier services j'ai crée fichier upload.js contenant le code qui configure et utilise multer pr uploader les photos des utilisateurs:
const upload = require ('../services/uploadFile');
const userRouter= require('express').Router();
//j'importe annnceModel car je vais en avoir besoin  dans la route de la page main:
const annonceModel= require ('../models/annonceModel');



//--------------------------------------------------- route page index:

userRouter.get('/',async(req,res)=>{
    try {
        res.render('./pages/index.twig');
    } catch (error) {
        console.log(error);
        res.send(error);
    };
});


//  --------------------------------------------------route page main:

userRouter.get('/accueil', async(req,res)=>{
    let annonces= await annonceModel.find();
    try {
        res.render('./pages/main.twig',{annonces:annonces})
       // console.log(annonces);ligne de code à retirer ensuite ,je verifie juste que la clé annonces contiennent ttes les annonces trouvé par mongoose en bdd
    } catch (error) {
        console.log(error);
        res.send(error);
    };
    });
    

//-------------------------------------------------- route  page register:

userRouter.get("/creer_un_compte", async(req, res)=>{
    try {
     res.render('./pages/register.twig');
    } catch (error) {
     console.log(error);
     res.send(error);
    };
});

//---------------------------------------- route pr s'enregistrer (créer son compte):


userRouter.post('/creer_un_compte',upload.single('img'), async(req,res)=>{     //upload.single('img') indique que j'attends de recevoir un fichier nommé 'img' ds la requete
    try{
     //je vérifie que le mail n'existe pas déjà en bdd
     let findUser = await userModel.findOne({mail:req.body.mail}); //il y a des {} car on cherche les donnée de l'objet mail (cf userModel.js)
     if (findUser) {
         throw {mailExisting: 'Cette adresse existe déjà'} ; 
        };
    
     //je vérifie que le pseudo n'existe pas déjà en bdd:
     let findPseudoUser= await userModel.findOne({pseudo:req.body.pseudo});
     if (findPseudoUser){
         throw {pseudoExisting: "Ce pseudo existe déjà"};
       };
     
     //je vérifie que le mdp est conforme à la regex:
      if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/g.test(req.body.password)) {
         throw {errorPassword:'Le mot de passe doit contenir 8 caractères, 1 majuscule , et 1 chiffre'};
        };

     // je vérifie que  le mdp est correctement confirmé:  
      if (req.body.password !== req.body.confirmPassword){
         throw {errorConfirmPassword : 'Les mots de passe doivent être identiques'};
        } ;
    
     //à partir des données saisie par l'utilisateur(req.body), je crée une instance d'userModel que je stoque ds la variable user:
     let user = new userModel(req.body);
     if (req.multerError ){
         throw{ fileError:'Veuillez entrer un fichier valide'}; 
     }
     else if (req.file){   //si il y a un fichier télécharger dans la requete post
         user.img = req.file.filename;  // la donnée user.img aura le nom de ce fichier ( tu stoques le nom du fichier ds l'attribut img)
     };

     /*validateSync() vérifie si les données saisies par l'utilisateur sont conformes au règles 
     (les requires et les validators) de mon userSchema. Si elles ne sont pas conforme, validateSync génère un objet d'erreurs*/
     let err = user.validateSync();
     if(err){ //si tu trouves une erreur ( via validateSync)
         throw err; //Tu me releve cette erreur,( cette erreur sera dans le catch, dans l'objet errors (qui contient l'ensemble de ces "err"))
     };

     //tout est ok donc je poursuit :
     //je securise le mot de passe en utilisant la methode hashSync de la bibliothèque bcrypt:
     user.password=bcrypt.hashSync(req.body.password,parseInt (process.env.SALT));
     //je sauvegarde mon utilisateur en bdd, il est donc crée dans la collection users:
     await user.save();
     res.redirect('/connexion');

    }catch (error){
     console.log(error)
     /*rend à l'utilisateur la vue register avec les éventuels messages d'erreurs  */ 
     res.render('./pages/register.twig',
         {errorMail: error.mailExisting, /*ds error.mailExisting  error  fait réf à l'objet error généré dans le throw et mailExisting fait reference à  la clé de cet objet (" qu'on récupère et qu'on passe ici comme valeur de errorMail")*/ 
          errorPseudo: error.pseudoExisting,
          errorPassword: error.errorPassword, 
          errorConfirmPassword : error.errorConfirmPassword,
          errorFile:error.fileError,
          validateErrors : error.errors    /*error  fait réf à l'objet error généré dans le throw et errors est la clé, l'attribut de cet 
                                          objet et il contient l'ensemble des erreurs pvt être généreés par le validateSync*/
        });
       
    };
});


/*RQ:La variable err fait référence à une erreur spécifique retournée par validateSync
 à un moment donné dans le code. C'est généralement la première erreur qu'il 
 rencontre lors de la validation. En revanche, errors est un objet qui contient 
 toutes les erreurs détectées par validateSync pour l'ensemble du modèle. 
 Donc errors rassemble toutes les erreurs trouvées dans un objet global, 
 tandis que err contient une seule erreur à la fois, généralement la première trouvée.*/


/*En résumé, cette route POST attend un fichier image dans la requête et utilise une fonction middleware 
(middlewaare : elle execute quelquechose entre la req et la rep envoyée au client) 
asynchrone pour traiter les données envoyées par l'utilisateur*/ 


//---------------------------------------- route page login:

userRouter.get('/connexion', async (req, res)=>{
    try{
        let loginMessage = null;
        if (req.session.loginMessage){
         loginMessage= req.session.loginMessage;
        };
        res.render ('./pages/login.twig', {loginMessage}); 
    } catch (error){ 
        console.log(error);
        res.send (error);
    };
});


//---------------------------------------- route pr se loguer:

userRouter.post('/connexion', async (req, res)=>{
    try{
        let user = await userModel.findOne({mail:req.body.mail}); //trouve(sous entendu ds la bdd) un modele d'utilisateur dont l'attribut mail a pr valeur celle saisie par l'utilisateur (vu que req.body contient les données saisies ds l'input par l'user)
        if (!user) {   // ! veut dire si la condition n'est pas rempli (<=> dc si il n'y a pas d'user)
            res.render('./pages/login.twig',{errorMail:"L'utilisateur n'existe pas"});   //rend moi la page login avec ce message d'erreur
        } else if (bcrypt.compareSync(req.body.password, user.password)){  // si mot de passe saisi est comparable au mdp de l'user stoqué en bdd
                 req.session.userId = user._id;  //garde moi cet user en session via son _id
                 res.redirect('/accueil');  // et redirige le vers la route /accueil     
        } else {   //sinon (si les mdp sont pas comparables)
             res.render('./pages/login.twig', {errorPassword:"Mot de passe invalide"});   //rend moi la page login avec ce message d'erreur
        }
    } catch(error){
        console.log(error); 
        res.send(error);
    };
});


//---------------------------------------- route pr se déloguer:

userRouter.get('/deconnexion', async(req, res)=>{
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.send(error);
    };
});


//--------------------------------------route page forgotPassword (prréinitialiser son mdp):
 userRouter.get('/forgot_password', async (req, res)=>{
    try {
     res.render('./pages/forgotPassword.twig')
    } catch (error) {
     console.log(error);
     res.send(error);
    };
 });


 //--------------------------------------route pr réinitialiser son mdp :
 
//  TODO:  userRouter.post('/forgot_password', ...)


//---------------------------------------- route page mention légales:

userRouter.get('/mentions_legales', async (req,res)=>{
    try {
        res.render('./pages/mentions_legales.twig');
    } catch (error) {
        console.log(error);
        res.send(error);
    };
});


//---------------------------------------- route page GCU:

userRouter.get('/gcu',async(req,res)=>{
    try {
        res.render('./pages/gcu.twig');
    } catch (error) {
        console.log(error);
        res.send(error);
    };
});


//---------------------------------------- route confidentialité:

userRouter.get('/politique_de_confidentialite', async(req,res)=>{
    try {
        res.render('./pages/confidentialite.twig');
    } catch (error) {
        console.log(error);
        res.send(error);
    };
});


//---------------------------------------- route page contact admin:

userRouter.get('/contact', async(req,res)=>{
    try {
       res.render('./pages/contactAdmin.twig');
    } catch (error) {
        console.log(error);
        res.send(error);
    };
});

//--------------------------------------route pr contacter l'admin (lui envoyer un message) :
 userRouter.post('/contact', async(req,res)=>{
     // créer un objet anonyme et passer à ses attributs les valeur présente ds le req.body (= données saisie ds les input du form contact)
     const {name ,clientMail, subject, message} = req.body;
 console.log(req.body);
     // configurer Nodemailer (<=> "créer un transporteur de mail"):
     const transporter = nodemailer.createTransport({
         service :'gmail',
         auth:{
              user:process.env.MAIL_ADMIN,
              pass:process.env.PASSWORD_ADMIN,
           }
       });

     //options de l'email (on définit la structure de son contenu):
     const mailOptions ={
          from: clientMail,
          to:process.env.MAIL_ADMIN,
          subject: 'message de ' + name + ' - from: ' + clientMail + ' - objet: ' + subject,
          text: message
        };

     //envoyer l'email:
     try {
         await transporter.sendMail(mailOptions);
         res.render ('./pages/confirmMailSend.twig', {notification:"Message envoyé"});
     } catch (error) {
         console.log(error);
         res.render ('./pages/confirmMailSend.twig', {notification: "une erreur s'est produite, votre message n'a pas pu être envoyé"});
        };
    });

    
//--------------------------------------route page Compte de l'User:

 userRouter.get("/mon_compte", async(req,res)=>{
    try {
        let loggedUser= await userModel.findById(req.session.userId);
        res.render("./pages/userAccount.twig", {loggedUser:loggedUser});
    } catch (error) {
        console.log(error);
        res.send(error);
    };
 });


//--------------------------------------route pr aller sur form de modification de son compte:

 userRouter.get("/modifier_mon_compte/:id", async(req,res)=>{
    try {
        let userAccountToUpdate = await userModel.findOne({_id:req.params.id});
        res.render("./pages/register.twig", {user:userAccountToUpdate,
        action:"update"}
        );
    } catch (error) {
        console.log(error);
        res.send(error);
    };
 });


//--------------------------------------route pr enregistrerles  modification sur son compte:

userRouter.post("/modifier_mon_compte/:id", upload.single('img'), async (req,res)=>{
   try {
     let userAccountToUpdate = await userModel.findOne({_id:req.params.id});
     //Si tu trouve cet user  et que le mail qu'il saisit est  different que celui qu'il a déjà en bdd
     if (userAccountToUpdate && req.body.mail !== userAccountToUpdate.mail){
         //vérifie que le nvx mail saisi par l'user lors de la modification n'appartient  pas déjà à un autre user
         let findUser= await userModel.findOne({mail:req.body.mail});
         if (findUser){
             throw {mailExisting: 'cette adresse mail existe déjà'};
          };
        };

     //vérifie que le pseudo est disponible:
     if (userAccountToUpdate && req.body.pseudo!== userAccountToUpdate.pseudo){
         let findPseudoUser = await userModel.findOne({pseudo:req.body.pseudo});
         if (findPseudoUser){
             throw {pseudoExisting:"Ce pseudo existe déjà"};
         };
       };

     //Si il y a un fichier uploadé je vérifie qu'il est valide
     if (req.file) {
         if (req.multerError){ //cf ds uploadFile.js  explcation du code de multerError
             throw {fileError:"Veuillez entrer un fichier valide"};
         }else{
              req.body.img=req.file.filename;
         };
       };

     // je vérifie que le mdp est conforme à la regex:
     if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/g.test(req.body.password)) {
         throw{errorPassword:'le mot de passe doit contenir 8 caractères, 1 majuscule , et 1 chiffre'};
     };

     //je vérifie que le mdp est correctement confirmé:
     if (req.body.password !== req.body.confirmPassword){
         throw {errorConfirmPassword:'les mots de passe doivent être identiques'};
     };

     //je sécurise le password avec LA METHODE hashSync de la biblio bcrypt:
     req.body.password=bcrypt.hashSync(req.body.password,parseInt (process.env.SALT));
     await userModel.updateOne({_id:req.params.id}, req.body,{runValidators:true, omitUndefined:true});
     res.redirect('/mon_compte');
    } catch (error) {
      console.log(error);
      res.render("./pages/register.twig",
         {action:"update",
         user:req.body,//je met cette clé ds le res.render du block catch  pr qu'en cas d'erreur générée par l'admin lors de la modification de l'user ,les modif saisies par l'admin se réaffiche dans le form au chargement de la page(généré qd les erreurs s'affichent)
         errorMail:error.mailExisting,
         errorPseudo:error.pseudoExisting,
         errorFile:error.fileError,
         validateErrors:error.errors,
        });
   };
});

//--------------------------------------route pr supprimer sur son compte:

userRouter.get ('/supprimer_mon_compte', async (req,res)=>{
    try {
        await userModel.deleteOne({_id:req.params.id});
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.send(error);
    };
 });


    module.exports = userRouter;