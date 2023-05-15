const Pharse = require('../../models/pharse');

let routes = (app) => {

    app.post('/pharse', async (req, res) => {
        try {
            let pharse = new Pharse(req.body);
            await pharse.save()
            res.json(pharse)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.get('/pharse', async (req, res) => {
        try {
            let pharse = await Pharse.find()
            res.json(pharse)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    // app.delete('/category/:id', async (req, res) => {
    //     try {
    //         await Category.deleteOne()
    //         res.json({ msg: "Category Deleted" })
    //     }
    //     catch (err) {
    //         res.status(500).send(err)
    //     }
    // });

};

module.exports = routes;