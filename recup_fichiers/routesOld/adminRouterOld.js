const express = require("express")
const adminRouter = express.Router()


adminRouter.get('/dashboardAdmin', async (req, res) => {
        try {
            res.render('./templates/dashboardAdmin.twig')
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    }
)

module.exports = adminRouter