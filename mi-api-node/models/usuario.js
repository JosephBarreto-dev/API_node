const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);
module.exports = Usuario;