require('dotenv').config();
const bcrypt = require('bcrypt');
const validator = require('validator');
const { validator_isEmpty } = require('../modals/validator');
const { defaultResponse } = require('../modals/defaultResponse');
const { generateAccessToken } = require('../modals/accesstoken');
const MongoClient = require('mongodb').MongoClient;

const MONGODB_URL = process.env.MONGO_URL;

exports.login = async function(req, res) {

    try {

        if(validator_isEmpty(req.body.email) || !validator.isEmail(req.body.email)) {
            defaultResponse(res, 403, false, "Please enter a valid email address.");
            return;
        } else if(validator_isEmpty(req.body.password) || req.body.password.length < 8) {
            defaultResponse(res, 403, false, "Password must be at least 8 characters long.");
            return;
        } else {

            MongoClient.connect(MONGODB_URL, async function(err, db) {
                if (err){
                    console.error(err);
                    defaultResponse(res, 500, false, "Internal Server Error.");
                    return;
                } else {

                    var mdb = db.db("igym");
                    var query = { email:req.body.email };
                    let result = await mdb.collection("users").find(query).toArray();

                    db.close();
                    if(result.length > 0){

                        const matchPassword = await bcrypt.compare(req.body.password, result[0].password);

                        if(matchPassword){

                            let datafortoken = {
                                email: result[0].email
                            }
                            let accessToken = generateAccessToken(datafortoken);
                            var currentTime = new Date().getTime();
                                var expireTime = currentTime + 3600000;


                            let response = {
                                email: result[0].email,
                                token: accessToken,
                                expire: expireTime
                            };

                            defaultResponse(res, 200, true, response);
                            return;
        
                        } else {
                            defaultResponse(res, 403, false, "Invalid credentials.");
                            return;
                        }
            
                    } else {
                        console.error(err);
                        defaultResponse(res, 403, false, "Invalid credentials.");
                        return;
                    }

                }
                

            });
    
        }

    } catch (err) {
        console.error(err);
        defaultResponse(res, 500, false, "Internal Server Error.");
        return;
    }

}

exports.logout = async function(req, res) {
    
    defaultResponse(res, 200, false, "Success.");
    return;

}