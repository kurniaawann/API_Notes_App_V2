class AuthenticationHandler {
    constructor(authenticationsService, usersService, tokenManager, validator) {
        this._authenticationsService = authenticationsService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
        this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
        this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
    }
    //! login
    async postAuthenticationHandler(request, h){
        this._validator.validatePostAuthenticationPayload(request.payload);
        const {username, password} = request.payload
        const id = await this._usersService.verifyUserCredential(username, password);

        const accessToken = this._tokenManager.generatedAccessToken({id});
        const refreshToken = this._tokenManager.generatedRefreshToken({id});

        await this._authenticationsService.addRefreshToken(refreshToken);

        const response = h.response({
            status:'success',
            message:'Authentication berhasil ditambahkan',
            data:{
                accessToken,
                refreshToken,
            }
        });
        response.code(201);
        return response;
        
    }
    
    //! get new accessToken
    async putAuthenticationHandler(request){
        this._validator.validatePutAuthenticationPayload(request.payload);
        const {refreshToken} = request.payload;

        await this._authenticationsService.verifyRefreshToken(refreshToken);

        const {id} = this._tokenManager.verifyRefreshToken(refreshToken);
        const accessToken = this._tokenManager.generatedAccessToken({id});
        return {
            status:'success',
            message:'Access Token berhasil di perbaharui',
            data:{
                accessToken
            }
        }
    }

    //! Logout
    async deleteAuthenticationHandler(request){
        this._validator.validateDeleteAuthenticationPayload(request.payload);
        
        const {refreshToken} = request.payload
        await this._authenticationsService.verifyRefreshToken(refreshToken);
        await this._authenticationsService.deleteRefreshToken(refreshToken);

        return {
            status:'success',
            message: 'Refresh token berhasil dihapus'
        }
    }
}


module.exports =  AuthenticationHandler