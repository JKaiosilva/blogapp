if(process.env.NODE_ENV == 'production'){                                                                                                               // Verifica se a aplicação esta em desenvolvimento ou produção
    module.exports = {mongoURI: 'mongodb+srv://kaiosilva_blogapp:<J0JNza6tCZTq8060>@cluster0.0bhhirg.mongodb.net/?retryWrites=true&w=majority'}         // Caso esteja em produção, se conectará com o banco de dados online
}else{
    module.exports = {mongoURI: 'mongodb://0.0.0.0:27017/blogapp'}                                                                                      // Caso esteja em desenvolvimento, se conectará com o banco de dados local
}