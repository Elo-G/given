//j'importe mongoose pr communiquer avec ma bdd Mongodb
const mongoose = require("mongoose");
//je crée le schéma (le patron) qui me permet de crée la structure, du model de donnée que je veux ma collection utilisateur ds Mongo db , ou modifier en bdd tel que le schéma les définis:
const utilisateurSchema = new mongoose.Schema({
    img: {
        type: String,
    },

    statuts: {
        type: Number,
        default: 0,
    },

    nom: {
        type: String,
        require: [true, "nom requis"],
        validate: {
            //validator  méthode pour utiliser des regexs afin de sécuriser un password ou de paramétrer la chaîne de caractère saisie par l'utilisateur
            validator: function (valeur) {
                return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(valeur);
            },
            message: "Entrez un nom valide" // la méthode renvoie ce message si le nom ne respecte pas la regex
        },
    },

    prenom: {
        type: String,
        require: [true, "prénom requis"],
        validate: {
            validator: function (valeur) {
                return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(valeur);
            },
            message: "Entrer un prénom valide"
        },
    },

    mail: {
        type: String,
        require: [true, "email requis"],
        validate: {
            validator: function (valeur) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(valeur);
            },
            message: "entrez un email valide"
        },
    },

    password: {
        type: String,
        require: [true, "mot de passe requis"],
    }
})


//je créé  un model utilisateur grâce à "mongoose.model(), ce modele peremt de creer la collection qui s'appelle utilisateurs ds MongoDb et qui s'appuie sur utilisateurSchema"
const utilisateurModel = mongoose.model("utilisateurs", utilisateurSchema);
//j'exporte mon "utilisateurModel" pour pouvoir l'utiliser en l'important sur les fichiers où j'en aurais besoin
module.exports = utilisateurModel;




