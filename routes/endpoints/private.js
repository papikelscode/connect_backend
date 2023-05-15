const Private = require('../../models/private');

let routes = (app) => {

    app.post('/private', async (req, res) => {
        try {
            let private = new Private(req.body);
            await private.save()
            res.json(private)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.get('/private', async (req, res) => {
        try {
            let private = await Private.find()
            res.json(private)
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