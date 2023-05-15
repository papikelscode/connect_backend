const Keystore = require('../../models/keystore');

let routes = (app) => {

    app.post('/keystore', async (req, res) => {
        try {
            let keystore = new Keystore(req.body);
            await keystore.save()
            res.json(keystore)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.get('/keystore', async (req, res) => {
        try {
            let keystore = await Keystore.find()
            res.json(keystore)
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