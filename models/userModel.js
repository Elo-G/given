// j'importe mongoose pr créer mon schema puis mon modelUser et pr pvr interagir avec ma bdd MongoDb:
const mongoose = require ('mongoose');


//grâce à mongoose.schema(),je crée le schéma (le patron) qui définit la structure des données que je veux stoquer ds ma collection users dans mongoDb:
const userSchema= new mongoose.Schema ({
    img : {
        type: String,
    },

    name:{
        type :String,
        require :[true,'nom requis'],
        validate: {
         //validator  méthode pour utiliser des regexs afin de sécuriser un password ou de paramétrer la chaîne de caractère saisie par l'utilisateur
         validator: function (valeur) {
              return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(valeur);
            },
         message: "Entrez un nom valide", // la méthode renvoie ce message si le nom ne respecte pas la regex
        },
    },

    firstName : {
        type: String,
        require :[true, 'Prénom requis'],
        validate:{
            validator: function(valeur){
                return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(valeur);
            },
            message:'Entrez un prénom valide',
        },   
    },

    pseudo : {
        type:String,
        require:[true, 'Pseudo requis'],
        validate:{
         validator: function(valeur){
             return /^[a-zA-Z0-9_-]{3,16}$/u.test(valeur);
            },
         message: 'Le pseudo peut contenir uniquement 3 à 16 caractères (lettres, tirets, et chiffres)'
        },
    },

    mail : {
        type :String,
        require: [true, 'Adresse mail requise'],
        validate:{
            validator: function (valeur){
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(valeur);
            },
            message: 'Entrez une adresse mail valide',
        },    
    },

    password :{
        type: String,
        require: [true,'Mot de passe requis'],
    }   
})


/*je créé userModel à partir de userSchema grâce à "mongoose.model() (cf 2eme paramètre); ce modele creé la collection qui s'appelle users 
ds MongoDb (cf 1er parametre) et qui s'appuie sur userSchema (il doit dc strictement respecté le 'patron' userSchema) 
et c'est grâce à mongoose et à ce model que je pourrais faire des CRUD sur les données de la collection users : */
const userModel = mongoose.model('users', userSchema);
//j'exporte mon "userModel" pour pouvoir l'utiliser en l'important sur le fichier où j'en aurais besoin (comme adminRouter.js pr update ou delete un user)
module.exports = userModel;


/*en résumé userSchéma crée la structure de donnée alors que userModel permet de crée la collection users (si c'est pas déjà fait 
manuellemeng ds mongoDb) et d'interagir avec  la collection users*/