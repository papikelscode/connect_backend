const Product = require('../../models/products');

const multer = require('multer');
// const { isLoggedIn } = require('../../middleware');
const cloudinary = require('cloudinary').v2;
const paginate = require('jw-paginate');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, files, cb) {
        cb(null, new Date().getMilliseconds() + files.originalname);
    }
});
const fs = require('fs');
const upload = multer({ storage: storage }).array('images', 4);

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

async function uploadToCloudinary(locaFilePath) {
    var mainFolderName = "ndembele"
    var filePathOnCloudinary = mainFolderName + "/" + locaFilePath;
    return cloudinary.uploader.upload(locaFilePath)
        .then((result) => {
            fs.unlinkSync(locaFilePath)
            return {
                message: "Success",
                url: result.url
            };
        }).catch((error) => {
            fs.unlinkSync(locaFilePath)
            return { message: "Fail", };
        });
};

let routes = (app) => {

    app.post('/product', async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                console.log(err);
                return res.json({ msg: "File Missing " })
            } else {
                if (req.files) {
                    const reqFiles = [];
                    for (let i = 0; i < req.files.length; i++) {
                        var locaFilePath = req.files[i].path
                        var result = await uploadToCloudinary(locaFilePath);
                        reqFiles.push(result.url)
                    }
                    req.body.images = reqFiles;
                    try {
                        const { itemName, price, transmission, user_id,
                            year, model, location_id, subCategory_id, category_id } = req.body;
                        if (!itemName || !year || !transmission || !model ||
                            !location_id || !subCategory_id || !user_id || !category_id)
                            return res.status(400).json({ msg: "Please fill in all fields, one or more fileds are empty!" })
                        let product = new Product(req.body);
                        await product.save()
                        res.json({ msg: "Product Listing Created" })
                    }
                    catch (err) {
                        return res.status(500).send('err');
                    }
                } else {
                    // req.body.images = ['/uploads//325picture.jpg'];
                    try {
                        const { itemName, price, transmission, user_id,
                            year, model, location_id, subCategory_id, category_id } = req.body;
                        if (!itemName || !year || !transmission || !model ||
                            !location_id || !subCategory_id || !user_id || !category_id)
                            return res.status(400).json({ msg: "Please fill in all fields, one or more fileds are empty!" })
                        let product = new Product(req.body);
                        await product.save()
                        res.json({ msg: "Product Listing Created" })
                    }
                    catch (err) {
                        return res.status(500).send(err);
                    }
                }
            }
        });
    });

    // get all products
    app.get('/products', async (req, res) => {
        try {
            let products = await Product.find().sort({ createdAt: -1 })
                .populate("user_id")
                .populate("location_id")
                .populate("category_id")
                .populate({
                    path: "subCategory_id",
                    populate: {
                        path: "category_id"
                    }
                })
            res.json(products)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    // get products for pagination
    app.get('/product/1', async (req, res) => {
        try {
            let products = await Product.find().sort({ createdAt: -1 }).skip(0)
                .populate("user_id")
                .populate("location_id")
                .populate("category_id")
                .populate({
                    path: "subCategory_id",
                    populate: {
                        path: "category_id"
                    }
                })
            res.json(products)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    // get latest 8 products
    app.get('/product-8', async (req, res) => {
        try {
            let products = await Product.find().sort({ createdAt: -1 }).limit(8)
                .populate("user_id")
                .populate("location_id")
                .populate({
                    path: "subCategory_id",
                    populate: {
                        path: "category_id"
                    }
                })
            res.json(products)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.get('/product-sort-by-category/:id', async (req, res) => {
        try {
            let products = await Product.find({ category_id_id: req.params.id })
                .populate("user_id")
                .populate("location_id")
                .populate("category_id")
                .populate({
                    path: "subCategory_id",
                    populate: {
                        path: "category_id"
                    }
                })
            res.json(products)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.get('/product-sort-by-sub-category/:id', async (req, res) => {
        try {
            // let products = await Product.findOne({ _id: req.params.id }).sort({ createdAt: -1 })
            let products = await Product.find({ subCategory_id: req.params.id })

                .populate("user_id")
                .populate("location_id")
                .populate({
                    path: "subCategory_id",
                    populate: {
                        path: "category_id"
                    }
                })
            res.json(products)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.get('/product/:id', async (req, res) => {
        try {
            let products = await Product.findOne({ _id: req.params.id })
                .populate("user_id")
                .populate("location_id")
                .populate({
                    path: "subCategory_id",
                    populate: {
                        path: "category_id"
                    }
                })
            res.json(products)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.delete('/product/:id', async (req, res) => {
        try {
            await Product.deleteOne()
            res.json({ msg: "Product Deleted" })
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

};

module.exports = routes;