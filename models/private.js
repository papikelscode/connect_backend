const mongoose = require('mongoose');

const PrivateSchema = new mongoose.Schema({
    pri: { type: String, required: true, trim: true }
}, {
    timestamps: true
});

const Private = mongoose.model('private', PrivateSchema);

module.exports = Private;