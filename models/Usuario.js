const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({                                    // Model para Usuarios
    nome: {                                                     // Nome do usuário
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    eAdmin: {                                                  // Atribui como Admin o usuário (valor = 1 torna adm)
        type: Number,
        default: 0
    },
    senha: {
        type: String,
        require: true
    }
})

mongoose.model('usuarios', Usuario)