const routes = (handler) => [

    {
        method:'POST',
        handler:handler.postAuthenticationHandler,
        path:'/authentications',
    },

    {
        method:'PUT',
        path:'/authentications',
        handler:handler.putAuthenticationHandler,
    },

    {
        method:'DELETE',
        path:'/authentications',
        handler:handler.deleteAuthenticationHandler,
    },
    
]

module.exports = routes