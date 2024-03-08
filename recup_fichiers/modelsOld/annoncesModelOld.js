//j'importe mongoose pr communiquer avec ma bdd Mongodb
const mongoose = require("mongoose");

const annonceSchema = new mongoose.Schema({
    imgs:
        [{
            type: String, 
            require: [true,"images de l'objet requises"]
        }],


    objetName: {
        type: String,
        require:[true, "nom de l'objet donné requis"],
        validate:{
           validator : function (valeur) { // validator prend en parametre la valeur de objetName
               return /^[a-zA-Z0-9-]+$/.test(valeur); //test si la valeur d'objetName respecte la regex
              },
           message: "le nom de l'objet n'accepte que des lettres, des chiffres, et des traits d'union." //message d'erreur si regex pas respectée
        }
    }
,

categorie: {
    type : String,
        require:[true, "indiquez la catégorie de l'objet"],
},

localite: {
    type : String,
        require:
    [true, "ville et arrondissement requis"],

}

,

etat: {
    type : String,
        require:[true, "indiquez l'état de l'objet"],
}
,

description: {
    type:String,
}
,

disponibilite : {
    type:String,
}
,

publicationDate : {
    type: Date,
default:
    Date.now,
}
,

userId:{
    type: mongoose.Schema.Types.objectId,
    ref:'user', //référence au modèle user
    required:true
},

})
/*TODO :qd on va devoir utiliser la clé userId dans le form annonce on lui dira qu' on veux que sa valeur soit
=  user._id; (elle même = à req.session.userId  car on a définit dans le login router que req.session.userId= user._id;
    qd on lui a dit de garder l'user connecté en session)*/

const annonceModel = mongoose.model("annonces", annonceSchema);
module.exports = annonceModel;