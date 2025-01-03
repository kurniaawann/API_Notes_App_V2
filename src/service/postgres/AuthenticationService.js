const {Pool} = require('pg');

const InvariantError = require('../../exceptions/InvariantError');
class AuthenticationsService{
    constructor(){
        this._Pool = new Pool()
    }

    async addRefreshToken(token){
        const query = {
            text:"INSERT INTO authentications VALUES($1)",
            values:[token],
        };
        await this._Pool.query(query);
    }

    async verifyRefreshToken(token){
        const query = {
            text: 'SELECT token FROM authentications WHERE token = $1',
            values:[token]
        };
        const result = await this._Pool.query(query);
    
        if (!result.rows.length) {
            throw new InvariantError('Refresh token tidak valid')
        }
    }

    async deleteRefreshToken(token){
        const query = {
            text:'DELETE FROM authentications WHERE token = $1',
            values:[token],
        };

        await this._Pool.query(query)
    }
}

module.exports = AuthenticationsService;