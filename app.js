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



// Configs
    // Sessão
        app.use(session({
            secret: 'cursodenode',
            resave: true,
            saveUnitialized: true
        }))
        app.use(flash())
    //midleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
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
        mongoose.connect('mongodb://0.0.0.0:27017/blogapp').then(() => {
            console.log('Conectado')
        }).catch((err) => {
            console.log('Erro ' + err)
        })
    // Public
        app.use(express.static(path.join(__dirname, 'public')))
        app.use((req, res, next) => {
            console.log('Middle aqui')
            next();
        })

// Rotas
    app.use('/admin', admin)

// Outros
    const PORT = 8081
    app.listen(PORT, () => {
        console.log('Servidor Rodando!')
    })