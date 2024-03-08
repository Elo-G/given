// //fichier contenant ma fonction pr previsualiser la photo de profil lors de la création d'un compte

// function previewPicture (input){
//   const pictures = input.files; 
//   const profilImg = document.getElementById('profil_img');
//   const imgAnnoncePrvw = document.getElementsByClassName('imgAnnonce_prvw');
  
//   const reader = new FileReader() //crée une instance de l'api filereader (qui peremt de lire le fichier)

//   for (let i = 0; i < pictures.length; i++){
//     console.log('Function called!'); 
//     const picture= pictures[i];
 
//     if(picture){
//        reader.onload= function (e){
//          if(profilImg){
//            profilImg.src=e.target.result;
//          }
//          if (imgAnnoncePrvw[i]){
//             imgAnnoncePrvw[i].src=e.target.result;
//          }
//        }
//      }    
//    reader.readAsDataURL(picture) 
//  }
// }



function previewPicture(input){

  const pictures = input.files; 
  const profilImg = document.getElementById('profil_img');
  const imgAnnoncePrvwContainer = document.getElementById('imgAnnoncePreview'); // Container to display uploaded images
  
  const reader = new FileReader(); // Crée une instance de l'API FileReader

  for (let i = 0; i < pictures.length; i++){
    const picture = pictures[i];

    if(picture){
      reader.onload = function (e){
        if(profilImg){
          profilImg.src = e.target.result;
        }
        // Creating elements to display multiple images
        const imgElement = document.createElement('img');
        imgElement.src = e.target.result;
        imgElement.classList.add('imgAnnonce_prvw');
        imgAnnoncePrvwContainer.appendChild(imgElement);
      };

      reader.readAsDataURL(picture);
    }
  }

}

//ATTENTION!!!! revoir explication et commentaire et essayer de le refaire seule!!!
function standardizeInputText(inputField) {
  inputField.value =inputField.value.toLowerCase();
}

// Récupère tous les inputs (via leur classe) auxquels je veux appliquer cette fonction
const inputTextToStandardize = document.querySelectorAll('.inputToStandardize');

// Ajoute un événement au changement de valeur dans chaque input
inputTextToStandardize.forEach(function(inputField) {
  inputField.addEventListener('change', function(e) {
      standardizeInputText(inputField);
  });
});










