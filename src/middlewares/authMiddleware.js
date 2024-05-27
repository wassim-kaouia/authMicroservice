const axios = require('axios');
const User = require('../models/userModel');

async function fetchUserDatabase(req, res, next) {
    try {
       
        const existingUser = await User.findOne({ userId: req.oidc.user.sub });

       
        if (existingUser) {
            res.locals.user = req.oidc.user;
            return next();
        }

        
        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error("Access token not available.");
        }

        const roles = await fetchRolesFromAuth0(accessToken, req.oidc.user.sub);
        await saveUserToDatabase(req, roles);

       
        res.locals.user = req.oidc.user;

        next();
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email) {
           
            console.error("Duplicate email error:", error);
            
            res.locals.user = req.oidc.user;
            return next();
        } else {
            console.error("Error fetching user roles:", error);
            req.userRoles = []; 
            next(error);
        }
    }
}


async function fetchRolesFromAuth0(accessToken, userId) {
    const url = `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/roles`;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    
    return response.data.map(role => role.name);
}

async function saveUserToDatabase(req, roles) {
    const newUser = new User({
        userId: req.oidc.user.sub, 
        fullname: req.oidc.user.name, 
        email: req.oidc.user.email, 
        roles: roles 
    });
    await newUser.save();
    console.log("User saved to database:", newUser);
}



async function getAccessToken() {
    try {
        const options = {
            method: 'POST',
            url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            data: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.AUTH0_CLIENT_ID,
                client_secret: process.env.AUTH0_CLIENT_SECRET,
                audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`
            })
        };

        const response = await axios.request(options);
        
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching access token:", error);
        return null;
    }
}

module.exports = { fetchUserDatabase };
