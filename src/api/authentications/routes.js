const routes = (handler) => [

    {
        method:'POST',
        handler:handler.postAuthenticationHandler,
        path:'/authentication',
    },

    {
        method:'PUT',
        path:'/authentication',
        handler:handler.putAuthenticationHandler,
    },

    {
        method:'DELETE',
        path:'/authentication',
        handler:handler.deleteAuthenticationHandler,
    },
    
]

module.exports = routes