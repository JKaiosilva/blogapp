module.exports = {                                                          // Exporta a Função de verificação de contas Admins
    eAdmin: function(req, res, next) {                                      // Função de middleware 
        if(req.isAuthenticated() && req.user.eAdmin == 1) {                 // Se a conta for autenticada e recebe o parâmetro de Admin = 1 (1 = a admin, 0 = a usuário convencional)
            return next();                                                  // Prossegue para as rotas admin
        }                                       
        req.flash('error_msg', 'Você precisa ser admin')                    // Se a conta não for Admin, prosseguirá para as rotas convencionais de usuário com uma mesagem de erro
        res.redirect('/')                                                   
    }
}