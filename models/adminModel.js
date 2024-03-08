
//j'importe mongoose pour créer schema puis Model et interargir avec bdd :
const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema ({
 name:{
     type:String,
     require :[true, "Nom de l'administrateur requis"],
     validate:{
         validator: function (valeur){
             return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/g.test(valeur)
         },
         message :'Entrez un nom valide'
       },
   },

 isAdmin:{
     type:Boolean,
     default: false,
  },

 mail:{
     type:String,
     require:[true, 'Adresse mail requise'],
     validate:{
         validator: function(valeur){
             return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(valeur);
           },
         message: 'Entrez une adresse mail valide',
        },
    },

 password:{
     type:String,
     require:[true,'Mot de passe requis'],
   }
})

const adminModel= mongoose.model('admins', adminSchema);
module.exports = adminModel;