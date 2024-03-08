const express = require("express")
const annonceModel = require("../models/annoncesModel")
const upload = require("../services/uploadFile")
const annoncesRouter = express.Router()



// ROUTE POUR ALLER SUR LA PAGE MAIN (page d'accueil = Dernières annonces):
annoncesRouter.get('/main', async (req, res) => {
    try {
        let annonces = await annonceModel.find()
        res.render('./templates/annonces/main.twig', {
            user: req.session.user,
            annonces: annonces
        })
    } catch (err) {
        console.log(err);
        res.send(err)
    }
})
annoncesRouter.get('/formAnnonces', async (req, res) => {
    try {
        res.render('./templates/annonces/formAnnonces.twig', {
            user: req.session.user
        })
    } catch (err) {
        console.log(err);
        res.send(err)
    }
})

annoncesRouter.post("/formAnnonces", upload.array('imgs'), async (req, res) => {
        try {
            let annonce = new annonceModel(req.body)
            req.files.forEach(elem => {
                annonce.imgs.push(elem.filename)
            })
            annonce.save()
            res.redirect('/main')
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }
)
annoncesRouter.get("/annonce/:id", async (req, res) => {
    try {
        await annonceModel.deleteOne({ id: req.params.id });
        res.redirect("/main");
    } catch (error) {
        res.send(error);
    }
});


module.exports = annoncesRouter
