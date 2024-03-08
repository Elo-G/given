//j'importe mongoose pr communiquer avec ma bdd Mongodb
const mongoose = require("mongoose");

const annonceSchema = new mongoose.Schema({
    imgs:[{
        type: String, 
        require: [true,"images de l'objet requises"]
    }],
    

    objectName: {
        type: String,
        require:[true, "Nom de l'objet donné requis"],
        validate:{
        validator : function (valeur) { // validator prend en parametre la valeur de objetName
            return /^[A-Za-z0-9'\-_&@,.:;'"\/\s\[\](){}<>!?+=%#àáâãäåæçèéêëìíîïðòóôõöùúûüýÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÒÓÔÕÖÙÚÛÜÝ]+$/.test(valeur); //test si la valeur d'objetName respecte la regex
            },
        message: "Le nom de l'objet n'accepte que des lettres, les espaces, et des caractères spéciaux." //message d'erreur si regex pas respectée
        }
    },

    categorie: {
        type : String,
        require:[true, "Veuillez séléctionner la catégorie de l'objet"],
    },

    localite: {
     type : String,
     require:
     [true, "Veuillez sélectionner un secteur"],
    },

    etat: {
     type : String,
     require:[true, "Veuillez sélectionner l'état de l'objet"],
    },

    description: {
     type:String,
     validate:{
         validator : function (valeur) { // validator prend en parametre la valeur de description
             return /^[A-Za-z0-9'\-_&@,.:;'"\/\s\[\](){}<>!?+=%#àáâãäåæçèéêëìíîïðòóôõöùúûüýÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÒÓÔÕÖÙÚÛÜÝ]+$/.test(valeur); //test si la valeur de description respecte la regex
            },
         message: "La description de l'objet n'accepte que des lettres, des chiffres, les espaces, et des caractères spéciaux." //message d'erreur si regex pas respectée
        }
    },

    disponibilite : {
     type:String,
     validate:{
         validator : function (valeur) { // validator prend en parametre la valeur de description
             return /^[A-Za-z0-9'\-_&@,.:;'"\/\s\[\](){}<>!?+=%#àáâãäåæçèéêëìíîïðòóôõöùúûüýÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÒÓÔÕÖÙÚÛÜÝ]+$/.test(valeur); //test si la valeur de description respecte la regex
            },
         message: "La description de l'objet n'accepte que des lettres, des chiffres, les espaces et des caractères spéciaux." //message d'erreur si regex pas respectée
        }
    },

    publicationDate : {
     type: Date,
     default: Date.now,
    },

    userId:{
     type: mongoose.Schema.Types.ObjectId,
     ref:'users', //référence à la collection users
     required:true
    },

 /*Lorsqu'un utilisateur crée une annonce, et qu'il y a un champ userId dans le schéma de cette annonce, Mongoose va générer un ObjectId unique pour cette annonce. 
 Ce ObjectId va référencer l'identifiant unique de l'utilisateur qui a posté cette annonce.
 Ainsi, cette relation est établie via l'ObjectId de l'utilisateur, qui est stocké dans le champ userId du document d'annonce. Cette référence permet à Mongoose de 
 comprendre quel utilisateur est associé à cette annonce lorsqu'on utilise des méthodes comme populate() pour charger les détails de cet utilisateur à partir de 
 l'ObjectId stocké dans le champ userId.*/
})


/*TODO :qd on va devoir utiliser la clé userId dans le form annonce on lui dira qu' on veux que sa valeur soit
=  user._id; (elle même = à req.session.userId  car on a définit dans le login router que req.session.userId= user._id;
    qd on lui a dit de garder l'user connecté en session)*/


const annonceModel = mongoose.model("annonces", annonceSchema);
module.exports = annonceModel;