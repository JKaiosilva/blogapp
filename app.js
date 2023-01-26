// Carregamento de Módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const { default: mongoose } = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Postagem')
const Postagem = mongoose.model('postagens')
require('./models/Categoria')
const Categoria = mongoose.model('categorias')
const usuarios = require('./routes/usuario')
const passport = require('passport')
require('./config/auth')(passport)
const db = require('./config/db')

// Configs
    // Sessão
        app.use(session({
            secret: 'cursodenode',
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())
    //midleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null;
            next()
        })
    // Body Parser
        app.use(express.json());
        app.use(express.urlencoded({extended:true}))
    // Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // Mongoose
        mongoose.set('strictQuery', false)
        mongoose.Promise = global.Promise;
        mongoose.connect(db.mongoURI).then(() => {
            console.log('Conectado')
        }).catch((err) => {
            console.log('Erro ' + err)
        })
    // Public
        app.use(express.static(path.join(__dirname, 'public')))
        app.use((req, res, next) => {
            next();
        })

// Rotas
        app.get('/', (req, res) => {
            Postagem.find().populate('categoria').lean().sort({data: 'desc'}).then((postagens) => {
                res.render('index', {postagens: postagens})
            }).catch((err) => {
                console.log(err)
                req.flash('error_msg', 'Houve um erro interno')
                res.redirect('/404')
            })
        })

        app.get('/postagem/:slug', (req, res) => {
            Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
                if(postagem) {
                    res.render('postagem/index', {postagem: postagem})
                }else{
                    req.flash('error_msg', 'Essa postagem não existe')
                    res.redirect('/')
                }
            }).catch((err) => {
                req.flash('error_msg', "Houve um erro interno")
                res.redirect('/')
            })
        })


        app.use('/admin', admin)

        app.get('/categorias', (req, res) => {
            Categoria.find().lean().then((categorias) => {
                res.render('categorias/index', {categorias: categorias})
            }).catch((err) => {
                req.flash('error_msg', 'Erro ao listar categorias')
                res.redirect('/')
            })
        })


        app.get('/categorias/:slug', (req, res) => {
            Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
                if(categoria) {
                    Postagem.find({categoria: categoria._id}).populate('categoria').lean().then((postagens) => {
                        res.render('categorias/postagens', {postagens: postagens, categoria: categoria})
                    }).catch((err) => {
                        console.log(err)
                        req.flash('error_msg', 'Houve um erro interno')
                        res.redirect('/')
                    })
                }else{
                    req.flash('error_msg', 'Esta categoria não existe')
                    res.redirect('/')
                }
            }).catch((err) => {
                console.log(err)
                req.flash('error_msg', 'Houve um erro interno')
                res.redirect('/')
            })
        })

        app.use('/usuarios', usuarios)

        app.get('/404', (req, res) => {
            res.send('Erro 404!')
        })

// Outros
    app.listen(process.env.PORT || 8081)