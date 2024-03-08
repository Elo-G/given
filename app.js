
/*j'importe  toutes les extensions dont je vais avoir besoin pour coder l'application (pour y avoir accès au sein de app.js):
  - express : pour faire le lien entre les requêtes html et  routes de l'appli, faire mes "try/catch", ajouter des middlewares, et démarrer le serveur en écoutant sur le port
  - mongoose : pour interagir avec la bdd Mongodb
  - dotenv : pour charger mes variables d'environnement présentes ds le fichier.env
  - express-session : pour gérer et garder en session (en "mémoire") les données de l'user durant toute sa connexion
  - bcrypt: pr sécuriser les mdp en les hachant
*/


//--------------------------------------------------------------IMPORT DES EXTENSIONS PR CODER L'APPLI:
const express = require ('express');
const mongoose = require ('mongoose');
const dotenv = require ('dotenv').config();  /*.config() permet à dotenv de lire les variables et 
                                               leur valeur ds le  fichier .env et de les ajouter ds "process.env"*/  
const session = require ('express-session');
const bcrypt= require ('bcrypt');
const nodemailer= require('nodemailer');



//---------------------------------------------------------------IMPORT DES FICHIERS ROUTERS DE L'APPLI

const userRouter= require('./routes/userRouter');
const adminRouter= require ('./routes/adminRouter');
const annonceRouter= require ('./routes/annonceRouter');



//-------------------------------------------------------------DECLARER LES CONST DE L'APPLI PR PVR LES UTILISER
//accès à l'url de ma bdd (mongodb):
//process permet d'accéder aux variables d'environnement de l'appli, dc ici <=> "accède à la variable d'environnement BDD_URL"
const db = process.env.BDD_URL;     

//créer une instance d'express() afin de pouvoir l'utiliser, et démarrer le serveur
const app =express (); 

//appli utilise session() et je sécurise la session avec un mot de passe pour éviter que les sessions soient hackées
app.use(session({secret: process.env.SECRET_SESSION, saveUninitialized: true, resave: false}));

// Middleware pour gérer les sessions utilisateur
app.use(function (req, res, next) {
    res.locals.session = req.sessionStore;
    next();
});

/*je demande à l'appli d'utiliser la methode urlencoded d'express( qui permet de parser et de convertir les données envoyés 
  par l'utilisateur au format urlencoded(ex:nom=John+Doe&email=johndoe%40example.com) , 
  en format objet js organisé sous la forme clé : valeur  
  ex:const user = { nom: 'John Doe',
                   email: 'johndoe@example.com'
                  }*/
app.use(express.urlencoded({extended: true}));

/*"Parse les données envoyées au format JSON et les converti en objet JavaScript. 
Rq :Bien que le format JSON ressemble à la structure d'un objet JavaScript avec des paires clé-valeur, 
la syntaxe diffère : dans JSON, les clés et les valeurs sont des chaînes de caractères entourées de guillemets DOUBLES, 
ce qui rend le format JSON non utilisable directement par JavaScript sans une conversion via express.json(). 
Cette conversion des données en objet JavaScript permet de manipuler ces données dans les routes de l'application 
afin de les transmettre à une vue pour affichage." bien que par défaut les données transmises par le client via formulaire 
soient au format url encoded, j'ai qd même besoin de cette ligne de code au cas où je fasse évoluer l'appli et récupère des 
données via une API  par ex (elles sont en format JSON en général):*/
app.use(express.json());

// app utilise static pour servir les fichiers statiques présents dans assets
app.use(express.static("./assets"));



//-------------------------------------------------------------------UTILISATION DES ROUTES 
app.use(userRouter); // tout ce que je demande à l'application d'utiliser avec "app.use ..." est accessible et utilisable par tous les fichiers de l'application parce que l'instruction app.use  est codée dans le fichier app.js qui est le coeur de l'application (sont cerveau ou poste de commande de l'ensemble de l appli) 
app.use(adminRouter);
app.use(annonceRouter);



//---------------------------------------------------------------------DEMARRAGE DU SERVEUR

//démarrage du serveur dont le port est définit dans la variable PORT du fichier.env (et récupéré via Process.env.PORT)
app.listen(process.env.PORT,(err)=>{
   if (err){
     console.log ("err")
 } else {
    console.log("vous écoutez sur le port " + process.env.PORT)
  }
}
)



//-----------------------------------------------------------------------CONNEXION A LA BDD

/*je dis à mongoose que je veux que seule les données strictement = au schéma de données que j'ai 
défini ds mes modèles de données pourront être insérrées ou màj ds mongodb:*/
mongoose.set('strictQuery', true)          

//je demande à mongoose de se connecter à la bdd (mongodb):
mongoose.connect(db)
    .then(() => {
     console.log ('vous êtes connécté à la bdd')   
    }).catch((err) => {
       console.log ('err') 
    });



/*EN RESUME pr express.json() et express.urlencoded: 
=> express.json() analyse et convertit les données envoyées au serveur sous forme de JSON en objet JavaScript utilisable dans tes routes.
=> express.urlencoded() analyse et convertit les données envoyées sous forme urlencoded (les données des formulaires HTML classiques) en objet JavaScript utilisable via req.body dans tes routes.*/