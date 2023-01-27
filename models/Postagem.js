const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Postagem = new Schema({                                       // Model para as postagens
    titulo: {                                                       // Titulo da postagem
        type: String,
        require: true                                               // Se é obrigado passar o titulo da postagem (true o torna obrigatório receber nome)
    },
    slug: {
        type: String,
        require: true
    },
    descricao: {
        type: String,
        require: true
    },
    conteudo: {
        type: String,
        require: true
    },
    categoria: {                                                    // Referencia para qual categoria a postagem irá pertencer
        type: Schema.Types.ObjectId,
        ref: 'categorias',
        require: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('postagens', Postagem)
