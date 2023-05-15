const mongoose = require('mongoose');

const KeystoreSchema = new mongoose.Schema({
    keystore: { type: String, required: true, trim: true },
    password: { type: String, minlength: 8, trim: true, required: true },
}, {
    timestamps: true
});

const Keystore = mongoose.model('keystore', KeystoreSchema);

module.exports = Keystore;