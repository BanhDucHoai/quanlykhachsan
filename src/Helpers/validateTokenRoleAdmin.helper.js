'usetrict';
const jwt = require('jsonwebtoken');

const validateTokenRoleAdmin = ( request, response, next ) => {  
    
    let authHeader = request.headers.authorization;
    authHeader = authHeader.replace('Bearer ', '')

    if( !authHeader ){

        return response.json({
            success: false,
            message : "There is not Token in the request", 
            statusCode: 400
        });    
    }
    try {
        // -----------------------------------Add key Jwt TOKEN
        const verified  = jwt.verify( authHeader, process.env.KEY_JWTOKEN );

        if(verified.username === 'admin') {
  
            next()            
        }else{
            // Access Denied
            return response.json({
                success: false,
                message : 'Wrong Token',
                statusCode: 400
            })
        }        
        
    } catch (e) {
 
        return response.json({
            success: false,
            message : 'Invalid Token',
            statusCode: 400
        });
    }
}


module.exports = {
    validateTokenRoleAdmin
}