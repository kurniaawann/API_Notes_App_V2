const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');
const TokenManager = {
    generatedAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
    generatedRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
    
    verifyRefreshToken: (refreshToken)=> {
        try {
            const artifacts = Jwt.token.decode(refreshToken);
            Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
            const {payload} = artifacts.decoded;
            return payload
        } catch (error) {
            console.log(error);
            throw new InvariantError('Refresh token tidak valid')   
        }
    }
};

module.exports = TokenManager