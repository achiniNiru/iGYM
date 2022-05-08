require('dotenv').config();
const validator = require('validator');
const { validator_isEmpty } = require('../modals/validator');
const { defaultResponse } = require('../modals/defaultResponse');
const { ObjectId, MongoClient } = require('mongodb');
const { DATA_GOALS } = require('../config/data');
const handleDelete = require('../modals/handleDelete');

const MONGODB_URL =process.env.MONGO_URL;


exports.add_goals = function(req, res){

    try {

        let valid_goal = DATA_GOALS.find((item) => {
            return parseInt(item.id) === parseInt(req.body.goal)
        })

        if (validator_isEmpty(req.body.user)) {
            defaultResponse(res, 403, false, "Please select a valid user.");
            return;
        } else if (valid_goal === undefined || valid_goal === null) {
            defaultResponse(res, 403, false, "Please select a valid goal.");
            return;
        } else if (validator_isEmpty(req.body.height)) {
            defaultResponse(res, 403, false, "Please select a valid height.");
            return;
        } else if (validator_isEmpty(req.body.weight)) {
            defaultResponse(res, 403, false, "Please enter a valid weight.");
            return;
        } else {

            MongoClient.connect(MONGODB_URL, async function(err, db) {
                if (err){
                    console.error(err);
                    defaultResponse(res, 500, false, "Internal Server Error.");
                    return;
                } else {

                    var mdb = db.db("igym");

                    var query = {
                        user: req.body.user,
                        goal: valid_goal.id,
                        height: req.body.height,
                        weight: req.body.weight,
                        timestamp: new Date()
                    };
                    await mdb.collection("goals").insertOne(query);
                    db.close();

                    defaultResponse(res, 200, true, "Success.");
                    
                }
            });

        }

    } catch (err) {
        console.error(err);
        defaultResponse(res, 500, false, "Internal Server Error.");
        return;
    }
    
}

exports.get_goals = function(req, res){

    try {

        MongoClient.connect(MONGODB_URL, async function(err, db) {
            if (err){
                console.error(err);
                defaultResponse(res, 500, false, "Internal Server Error.");
                return;
            } else {

                if (validator_isEmpty(req.query.user)) {
                    defaultResponse(res, 403, false, "Need user id to send data.");
                    return;
                } else {

                    var mdb = db.db("igym");
                    var query = {
                        user: req.query.user
                    }
                    if(!validator_isEmpty(req.query.id)){
                        query = {
                            user: req.query.user,
                            _id: ObjectId(req.query.id)
                        }
                    }
                    let result = await mdb.collection("goals").find(query).toArray();

                    db.close();
                    defaultResponse(res, 200, true, result);

                }
            
            }
        });

    } catch (err) {
        console.error(err);
        defaultResponse(res, 500, false, "Internal Server Error.");
        return;
    }
    
}

exports.patch_goals = function(req, res){

    try {

        let valid_goal = DATA_GOALS.find((item) => {
            return parseInt(item.id) === parseInt(req.body.goal)
        })

        if(validator_isEmpty(req.body.id)){
            defaultResponse(res, 403, false, "designation ID is required.");
            return;
        } else if (valid_goal === undefined || valid_goal === null) {
            defaultResponse(res, 403, false, "Please select a valid goal.");
            return;
        } else if (validator_isEmpty(req.body.height)) {
            defaultResponse(res, 403, false, "Please select a valid height.");
            return;
        } else if (validator_isEmpty(req.body.weight)) {
            defaultResponse(res, 403, false, "Please enter a valid weight.");
            return;
        } else {

            MongoClient.connect(MONGODB_URL, async function(err, db) {
                if (err){
                    console.error(err);
                    defaultResponse(res, 500, false, "Internal Server Error.");
                    return;
                } else {

                    var mdb = db.db("igym");

                    var query = {
                        _id: ObjectId(req.body.id)
                    }
                    var query2 = {
                        goal: valid_goal.id,
                        height: req.body.height,
                        weight: req.body.weight
                    };

                    await mdb.collection("goals").updateOne(query, { $set: {...query2}});

                    db.close();
                    defaultResponse(res, 200, true, "Success.");
                    
                }
            });

        }

    } catch (err) {
        console.error(err);
        defaultResponse(res, 500, false, "Internal Server Error.");
        return;
    }
    
}

exports.delete_goals = async function(req, res){

    try {

        await handleDelete(req, res, "goals");

    } catch (err) {
        console.error(err);
        defaultResponse(res, 500, false, "Internal Server Error.");
        return;
    }
    
}