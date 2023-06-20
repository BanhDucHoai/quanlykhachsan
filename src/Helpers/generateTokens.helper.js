const jwt = require('jsonwebtoken');

const generateTokens =  async (id, username, password ) => {

    
    return new Promise( ( resolve, reject ) => {
        
        const payload = { id, username, password };

        jwt.sign( payload , process.env.KEY_JWTOKEN, { 
            expiresIn: '12h'
        }, ( err, token ) => {

            if( !err ){ 
                resolve( token ); 
            }
            else {
                
                reject( 'No generate Token' ); 
            }
        });

    });   
}

module.exports = {
    generateTokens
}