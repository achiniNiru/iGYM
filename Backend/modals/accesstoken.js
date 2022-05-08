require('dotenv').config();
const jwt = require('jsonwebtoken');
const { defaultResponse } = require('./defaultResponse');
const MongoClient = require('mongodb').MongoClient;

const MONGODB_URL = process.env.MONGO_URL;

exports.authenticateToken = function(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null){
        defaultResponse(res, 401, false, "Invalid token");
        return;
    } else {

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err){
                defaultResponse(res, 419, false, "Your session may be expired, please refresh the browser.");
                return;
            } else {
            
                try {
                    MongoClient.connect(MONGODB_URL, async function(err, db) {
                        if (err) {
                            console.error(err);
                            defaultResponse(res, 500, false, "Internal Server Error");
                            return;
                        } else {
                            var mdb = db.db("igym");
                            var query = { email: user.email };
                            let result = await mdb.collection("users").find(query).toArray();
                            
                            db.close();
                            if(result[0] === undefined || result[0] === null){
                                defaultResponse(res, 401, false, "Unauthorized");
                                return;
                            } else {
                                req.user = result[0]
                                next();
                            }

                        }
                    });
                } catch(err) {
                    console.error(err);
                    defaultResponse(res, 500, false, "Internal Server Error");
                    return;
                }

            }

        })

    }
}

exports.generateAccessToken = function(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });
}

/*
exports.generateRefreshToken = function(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '86400s' });
}
*/