// //fichier router des utilisateurs de l'application


// //j'importe bcrypt pour hacher les mots de passes
// const bcrypt= require ("bcrypt");
// // j'importe utilisateurModel
// const utilisateurModel = require ("../models/utilisateurModel");
// //j'importe authGard pour sécuriser les routes de l'appli (:L'utilisateur doit être autentifié pour que authGard lui donne accès à l'url)
// // const authGard = require("../services/authGard");
// const upload = require("../services/uploadFile");
// const { log } = require("async");
// const  utilisateurRouter = require('express').Router();





// //-----------------------------------------ROUTE POUR ALLER SUR LA PAGE INDEX:---------------------------------------------------
// // le 1er parametre de la methode get est l'u'rl de la page où le client veut aller, et le 2ème est la fonction async qui envoie cette page au client
// utilisateurRouter.get('/', async (req, res)=>{
//     res.render('./templates/index.twig')
// })


// //--------------------------------------------ROUTE ALLER SUR LA PAGE REGISTER:-------------------------------------------------

// utilisateurRouter.get ('/register', async(req,res)=>{
//     try{
//         res.render("./templates/register.twig"); //rend la page où se trouve le formulaire register
//     }catch (err) {
//         console.log(err);
//         res.send(err);
//     } 
// })


//-------------------------------------------ROUTE POUR S'ENREGISTRER (créer son compte):-------------------------------------

utilisateurRouter.post('/register',upload.single("img"), async (req, res)=>{
 try{
     if (req.body.password !== req.body.confirmPassword){ 
         throw {confirmPassword: "les mots de passe doivent être identiques"}
       }

     //je verifie que le mail n'est pas déjà utilisé pour un compte:
     let findUser= await utilisateurModel.findOne({mail: req.body.mail})
     if (findUser){
         throw { mailExisting : "cette adresse mail est déjà enregistrée"}
        }
    console.log(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/g.test(req.body.password));
     // je vérifie que le mot de passe est conforme à la regex définit ds  utilisateurModel.js:
     if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/g.test(req.body.password)){ //g.test = methode qui permet de tester si le password saisie respecte la regex 
        throw {errorPassword: "le mot de passe doit contenir 8 caractères, une majuscule et un chiffre"}

     } 
     
     let user = new utilisateurModel(req.body)
     if (req.file) { 
         user.img = req.file.filename 
     }

     //je verifie  si il y a une erreur retournée par validateSync() à chaque nouvel utilisateur crée
     let err = user.validateSync()
     if (err){//Si il y a une err (= erreur retournée par validateSync())
         throw err //relève l'erreur  (cette err sera dans le catch dans niveau de errors créé par monngose)
     }  

     // je sécurise le password en utilisant la methode hashSync de la bibliothèque bcrypt:
     user.password = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT));
     //puis je sauvegarde mon utilisateur:
     await user.save()
     res.redirect('/login')
    } catch (error) {
        console.log(error);
         /*rend moi la vue register avec les éventuels messages d'erreurs  */ 
         res.render('./templates/register.twig',
         {validateErrors: error.errors, /*error = parametre qui il fait parti de la methode catch de js d'office.  et errors est créé par mongoose et il  fait référence à l'ensemble des erreurs ôuvant être générées par validate */
          errorConfirmPassword: error.confirmPassword, /*ds error.confirmPassword  error  fait réf à l'objet error généré dans le throw et confirmpassword est la*/
          errorMail: error.mailExisting,
          errorPassword: error.errorPassword
        })
} 
})


// //---------------------------------------------ROUTE POUR ALLER SUR LA PAGE LOGIN: ---------------------------------------------------

// utilisateurRouter.get('/login', async (req, res) => {
//     try {
//         res.render('./templates/login.twig')
//     } catch (err) {
//         console.log(err);
//         res.send(err)
//     }
// })


// //---------------------------------------------ROUTE POUR SE LOGUER:----------------------------------------------------------------

// utilisateurRouter.post('/login', async (req, res) => {
//     try {
//        let user = await utilisateurModel.findOne({mail: req.body.mail}) //j'utilise la methode findOne du modele
//        if (!user) {
//         res.render('./templates/login.twig',{
//             errorMail: "l'utilisateur n'existe pas"
//         })
//        }else{
//         if (bcrypt.compareSync(req.body.password, user.password)) {
//             req.session.user = user;//garde moi cet user en session
//             res.redirect('/main')// et redirige moi vers la route main
//         }else{
//             res.render('./templates/login.twig',{
//                errorPassword:"mot de passe invalide" 
//             })
//         }
//        }
     
//     } catch (err) {
//         console.log(err);
//         res.send(err)
//     }
// })


// //-------------------------------------------------------ROUTEPOUR SE DELOGUER:--------------------------------------------------------

// utilisateurRouter.get('/logout', async (req, res)=>{
//     try{
//         req.session.destroy();
//         res.redirect('./');
//     }catch(err){
//         console.log(err);
//         res.send(err);
//     }
// })


// //  ------------------------------------------------ROUTE POUR ALLER SUR LA PAGE MAIN SANS CONNEXION (= visiteur):-----------------------------------------------
// utilisateurRouter.get('/main', async (req, res) => {
//     try {
//         res.render('./templates/annonces/main.twig',{
//             user:  req.session.user
//         })
//     } catch (err) {
//         console.log(err);
//         res.send(err)
//     }
// })


// // ------------------------------------------------ROUTE POUR ALLER SUR MENTIONS LEGALES----------------------------------------

// utilisateurRouter.get('/mentions_legales', async(req, res)=>{
//     try{
//         res.render('./templates/mentions_legales.twig')
//     } catch(err){
//         console.log(err);
//         res.send(err)
//     }
// })


// //-------------------------------------------------ROUTE POUR ALLER SUR GCU (conditions générales d'utilisation)----------------------------

// utilisateurRouter.get('/GCU',async(req, res) =>{
//     try{
//         res.render('./templates/gcu.twig')
//     }catch (err){
//         console.log(err);
//         res.send (err)
//     }
// })


// //-------------------------------------------------ROUTE POUR ALLER SUR POLITIQUE DE CONFIDENTIALITE ----------------------------------------

// utilisateurRouter.get('/confidentialite', async(req,res)=>{
//     try{
//         res.render('./templates/confidentialite.twig')
//     }catch(err){
//         console.log(err);
//         res.send(err)
//     }
// })


// //-------------------------------------------------ROUTE POUR ALLER SUR CONTACT ----------------------------------------
// utilisateurRouter.get('/contact',async(req, res)=>{
//     try{
//         res.render('./templates/contact.twig')
//     }catch(err){
//         console.log(err);
//         res.send(err);
//     }
// })






// // TEST ROUTE





// /*variable err = methode validatesync appliquée à l'user: (validatesync vérifie si les données saisie sont conforme 
//     aux règles de validation définis ds utilisateurModel avant de les stocker en bdd)
//     let err = user.validateSync()
//     console.log(err);
//     if (err){
//         throw err
//     }*/
// // module.exports = utilisateurRouter;


