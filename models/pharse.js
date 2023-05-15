const mongoose = require('mongoose');

const PharseSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true }
}, {
    timestamps: true
});

const Pharse = mongoose.model('pharse', PharseSchema);

module.exports = Pharse;