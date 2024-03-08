// const { log } = require('async')
const annonceModel= require('../models/annonceModel');
const authGardUser = require('../services/authGardUser');
const upload = require ('../services/uploadFile');
const annonceRouter= require ('express').Router();


//--------------------------------route pour aller sur AnnonceForm:


annonceRouter.get ('/creer_annonce',authGardUser, async (req, res)=>{
  try {
    res.render('./pages/annonceForm.twig');
  } catch (error) {
   console.log(error);
   res.send (error);
  };
});


//--------------------------------route pour poster l'annonce:

annonceRouter.post('/creer_annonce', authGardUser, upload.array('imgs'), async (req, res)=>{
  const userId = req.session.userId;  /*la propriété userId de l'annonce créé = l id de l'user en session, ainsi si j'utilise
                                        populate pr afficher l'identité de "l'user donneur" mongoose saura qu'il faut récuperer 
                                        les donnée de cet user là pour les afficher dans la vue annonce.twig (cf route suivante)*/
  try{
    let annonce = new annonceModel(req.body);
    annonce.userId= userId;
   
    if(req.multerError){
       throw {fileError:'Veuillez entrer un fichier valide'};
      } else if (req.files && req.files.length > 0) {
       annonce.imgs= req.files.map(file => file.filename);
      };
    
    let err =annonce.validateSync();
    if(err){
      throw err;
    };
    
    await annonce.save();
    res.redirect ('/accueil');

  }catch(error){
    console.log(error);
    res.render('./pages/annonceForm.twig',{
      errorFile:error.fileError,
      ValidateError:error.errors
    });
  };
});


//--------------------------------route page annonce (voir une annonce en détail):

annonceRouter.get('/annonce/:id',authGardUser, async (req,res)=>{
  try {
    let annonceDisplayed = await annonceModel.findOne({_id:req.params.id}).populate('userId','pseudo');// !!! A COMMENTER !!!
    res.render('./pages/annonce.twig',{annonce : annonceDisplayed });
  }catch(error){
    console.log(error);
    res.send(error);
  };
});


//--------------------------------------route pour voir ses annonces postées :
    
annonceRouter.get('/mes_annonces', async(req,res)=>{
  try {
    let myAnnonces= await annonceModel.find({userId:req.session.userId});/*le 1er userId fait ref à l'attribut userId  
                                                                           du annonceSchema, et le userId de req.session.userId est definit dans la route login( req.session.userId = user._id)
                                                                           qd on garde l'user en session une fois logué (et express y a acces malgré qu il se trouve le fichier userRouter.js,  grâce au app.use userRouter  codé dans app.js)*/                                                                     
    res.render ('./pages/myAnnonces.twig', {myAnnonces:myAnnonces});
  } catch (error) {
      console.log(error);
      res.send(error);
  };
});


//--------------------------------------route pour aller sur le formulaire update de l'annonce :

annonceRouter.get('/modifier_annonce/:id',async (req, res)=>{
  try {
    let annonceToUpdate= await annonceModel.findOne({_id:req.params.id});
    res.render("./pages/annonceForm.twig",{annonce: annonceToUpdate, action: "update"})//je passe à ma vue la clé action: update ,pour quele sache quelle contenu de vue rendre (celle pour updateForm et pas celle pour add) 
  } catch (error) {
    console.log(error);
    res.send(error);
  }
})

//--------------------------------------route enregistrer les modification de l'annonce :

annonceRouter.post('/modifier_annonce/:id',upload.array('imgs'), async (req,res)=>{
  try {
   if (req.file){
     if (req.multerError){
       throw {fileError: 'Veuillez entrer des fichiers valides'};  
     }else{
       req.body.img=req.file.filename;
     };
    };

    await annonceModel.updateOne({_id:req.params.id},req.body, {runValidators: true, omiUndefined:true});
    res.redirect('/mes_annonces');
   
  }catch (error) {
    console.log(error);
    res.render('./pages/annonceForm.twig',{
     annonce:req.body
    });  /*je mets cette clé ds le res.render du block catch  pr qu'en cas d'erreur générée par client lors de 
          la modification de son annonce , le form affiche les modif qu'il avait saisit apres le chargement de la page 
          (lui même généré par l'affichage des erreurs)*/
  };
});


//--------------------------------------route pour supprimer l'annonce :

annonceRouter.get('/delete_annonce/:id', async(req,res)=>{
  try {
    await annonceModel.deleteOne({_id:req.params.id});
    res.redirect('/mes_annonces');
  } catch (error) {
    console.log(error);
    res.send(error);
  };
});


//----------------route pour chercher les annonces par nom de l'objet via searchBar

annonceRouter.get('/recherche/', async (req,res)=>{
  try {
    /*trouve une annonce (en bdd) dont l'attribut objectName correspond à l'attribut objectName de l'objet de la requête query :
    (en utilisant une méthode GET dans un formulaire HTML, les données saisies dans les champs de ce formulaire seront transmises
    dans l'URL sous forme de chaîne de requête (query string) lorsque le formulaire est soumis. Ces données seront alors accessibles
    via l'objet req.query dans Express.js*/
    let searchResults = await annonceModel.find({objectName:req.query.objectName});
    res.render ('./pages/recherche.twig',{searchResults:searchResults});
  } catch (error) {
    console.log(error);
    res.send(error);
  };
});


//----------------route pour chercher une categorie via la barre de recherche:

annonceRouter.get('/annonces_par_categorie', async(req, res)=>{
  try {
    //récupération de la catégorie via req.query.categorie:
    let annoncesByCategorie= await annonceModel.find({categorie:req.query.categorie});
    res.render('./pages/annoncesByCategorie.twig',{annoncesByCategorie:annoncesByCategorie});
  } catch (error) {
    console.log(error);
    res.send(error);
  };
});

module.exports= annonceRouter;

/* résumé des trois principales manières de récupérer des données dans une application Express: 
Utilisez req.body.name pour les données POST, 
req.query.name pour les paramètres de requête GET, 
et req.params.name pour les valeurs dynamiques dans l'URL définies dans la route Express.*/

/*Lorsque le client clique sur le bouton submit d'un formulaire, cela déclenche une requête HTTP vers le serveur 
avec toutes les données du formulaire.
Dans le cas d'une méthode GET et d'un formulaire avec des paramètres, les valeurs des champs de formulaire sont 
ajoutées à l'URL en tant que paramètres de requête. La structure est définie par le nom des éléments de 
formulaire (name attribut dans le HTML) et les valeurs sélectionnées ou saisies par l'utilisateur.

Reprenons votre exemple avec une liste déroulante pour la catégorie :
html
Copy code
<form action="/annonces_par_categorie" method="get">
    <select class='bar' name='categorie'>
        <!-- Options... -->
    </select>  
    <div class="iconResearch">
        <button type="submit">Recherchez</button>
    </div>
</form>
Lorsque l'utilisateur sélectionne une catégorie et soumet le formulaire, si par exemple la catégorie 
"Electronique" est sélectionnée, cela ajoutera ?categorie=Electronique à la fin de l'URL. 
C'est ainsi que la valeur de la catégorie est stockée dans la requête, et Express la récupère 
automatiquement dans req.query.categorie. Le nom categorie vient du name attribut de l'élément select.
donc la requete http envoyée par le formulaire est crée dans la route associée au formulaire

//La première étape est celle du client : c'est une demande pour envoyer les informations saisies ou 
sélectionnées dans le formulaire vers la route spécifiée dans l'attribut "action" du formulaire. 
Cette demande est envoyée au serveur pour qu'il traite les informations.
Ensuite, cette première étape déclenche une seconde requête, mais cette fois-ci du côté du serveur. 
Cette deuxième requête est créée dans la route du serveur. Dans l'exemple, cette requête demande au 
serveur de trouver toutes les annonces dont la catégorie correspond à celle sélectionnée par le client 
via le formulaire.
Cette requête côté serveur peut être réalisée car la route possède la valeur de la catégorie 
sélectionnée par le client. Cette valeur a été stockée dans "req.query.categorie", où "query" 
est l'endroit où toutes les données relatives à un formulaire de type "GET" sont stockées. 
Ces données sont ensuite transmises à la route lorsque le formulaire est soumis.

!!!!!!! EN RESUME :Suite à la première requête du client envoyée à la route côté serveur, 
celle-ci déclenche une deuxième requête interne (côté serveur) pour récupérer des données ou effectuer 
des actions spécifiques, puis génère une réponse à la requete du client (le resultat),  
pour renvoyer la vue et/ou  les données nécessaires au client. !!!!!!*/

/*
??? Si le formulaire utilise la méthode GET, les données du formulaire sont incluses dans l'URL, ce qui les 
rends visibles dans l url ,donc je me demande pourquoi malgré ça je n'ai pas pu les récuperer via req.params.(commee pour le form update des users)
REPONSE:  dans le contexte d'Express.js, les données envoyées via GET dans un formulaire HTML sont récupérées 
via req.query, même si elles sont dans l'URL. 
Pour les paramètres de l'URL définis dans la route, c'est req.params qui est utilisé. 
C'est une particularité du traitement des données avec Express.js. 
Donc, même si les données sont dans l'URL, elles sont récupérées avec req.query. 
Si elles étaient définies comme des paramètres dans la route (/:categorie), 
alors vous les récupéreriez avec req.params.*/



