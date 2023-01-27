const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Categoria = new Schema({                   // Model para as categorias
    nome: {                                      // Nome da categoria
        type: String,                            // Tipo do nome da categoria
        require: true                            // Se é obrigado passar o nom da categoria (true o torna obrigatório receber nome)
    },
    slug: {                                      // SLug seria o link para a categoria
        type: String,
        require: true
    },
    date: {
       type: Date,
       default: Date.now()                // Função para pegar a hora em que a categoria foi postada
   }
})

mongoose.model('categorias', Categoria)