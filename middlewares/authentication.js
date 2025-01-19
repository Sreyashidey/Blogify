const { validateToken } = require("../services/authentication");
function checkForAuthenticationCookie(cookieName) {
    return (req,res, next)=>{
        const tokenCookieValue=req.cookies[cookieName];
        if(!tokenCookieValue){
           return next();
        }
    
    try{
        const userPayload= validateToken(tokenCookieValue);
        req.user=userPayload;
        
    }
    catch(error){
        console.error("Token validation failed:", error);
            // Optionally clear the invalid token cookie
            res.clearCookie(cookieName);
    }
    return next();
};
}

module.exports= {
    checkForAuthenticationCookie,
};