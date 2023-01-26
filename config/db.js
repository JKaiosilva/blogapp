if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI: 'mongodb+srv://kaiosilva_blogapp:<J0JNza6tCZTq8060>@cluster0.0bhhirg.mongodb.net/?retryWrites=true&w=majority'}
}else{
    module.exports = {mongoURI: 'mongodb://0.0.0.0:27017/blogapp'}
}