const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')
const {eAdmin} = require('../helpers/eAdmin')


router.get('/', eAdmin, (req, res) => {
    res.render('admin/index')
})

router.get('/posts', eAdmin,(req, res) => {
    res.send('Página de posts')
})


 // Rota de Categorias
router.get('/categorias', eAdmin,(req, res) => {
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render('admin/categorias', {categorias: categorias.map(Categoria => Categoria.toJSON())})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar categorias')
        res.redirect('/admin')
    })
    
})

// Rota para adicionar categorias

router.get('/categorias/add', eAdmin,(req, res) => {
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', eAdmin,(req, res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: 'Nome inválido'})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({texto: 'Slug inválido'})
    }
    if(req.body.nome.length < 2) {
        erros.push({texto: 'Nome da categoria pequeno'})
    }
    if(erros.length > 0) {
        res.render('admin/addcategorias', {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar')
            res.redirect('/admin')
        })
    }

})

// Rota para editar categorias

router.get('/categorias/edit/:id', eAdmin,(req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render('admin/editcategorias', {categoria: categoria})
    }).catch((err) => {
        req.flash('error_msg', 'Esta categoria não existe')
        res.redirect('/admin/categorias')
    })
})


router.post('/categorias/edit', eAdmin,(req, res) => {
    Categoria.findOne({_id: req.body.id}).then((categoria) => {
        
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao salvar edição')
            res.redirect('/admin/categorias')
        })

    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao editar a categoria')
        res.redirect('/admin/categorias')
    })
})

// Rota para deletar categorias

router.post('/categorias/deletar', eAdmin,(req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso!')
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao apagar a mensagem')
        res.redirect('/admin/categorias')
    })
})

// Rota para exibir postagens

router.get('/postagens', eAdmin,(req, res) => {
    Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens) => {
        res.render('admin/postagens', {postagens: postagens})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as postagens')
        res.redirect('/admin')
    })
})

// Rota para adicionar postagens

router.get('/postagens/add', eAdmin,(req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render('admin/addpostagem', {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulario')
        res.redirect('/admin')
    })
})

router.post('/postagens/nova', eAdmin,(req, res) => {
    
    var erros = []

    if(req.body.categorias == '0') {
        erros.push({texto: 'Categoria inválida'})
    }
    if(erros.length > 0) {
        res.render('admin/addpostagens', {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', 'Postagem criada com sucesso')
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro durante a postagem')
            res.redirect('/admin/postagens')
        })
    }

})


// Rota para editar postagens

router.get('/postagens/edit/:id', eAdmin,(req, res) => {

    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render('admin/editpostagens', {categorias: categorias, postagem: postagem})
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao listra as categorias")
            res.redirect('/admin/postagens')
        })

    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao carregar o formulario de edição")
        res.redirect('/admin/postagens')
    })


})


router.post('/postagens/edit', eAdmin,(req, res) => {
    Postagem.findOne({_id: req.body.id}).then((postagem) => {
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() => {
            req.flash('success_msg', 'Postagem editada com sucesso')
            res.redirect('/admin/postagens')
        }).catch((err) => {
            console.log(err)
            req.flash('error_msg', "Erro interno")
            res.redirect('/admin/postagens')
        })

    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Houve um erro ao salvar a edição')
        res.redirect('/admin/postagens')
    })
})

// Rota para deletar postagem

router.get('/postagens/deletar/:id', eAdmin,(req, res) => {
    Postagem.remove({_id: req.params.id}).then(() => {
        req.flash('success_msg', 'Postagem deletada')
        res.redirect('/admin/postagens')
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', "erro ao deletar postagem")
        res.redirect('/admin/postagens')
    })
})



module.exports = router