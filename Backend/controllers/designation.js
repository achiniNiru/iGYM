require('dotenv').config();
const validator = require('validator');
const { validator_isEmpty, validator_isFloat } = require('../modals/validator');
const { defaultResponse } = require('../modals/defaultResponse');
const { ObjectId, MongoClient } = require('mongodb');
const handleDelete = require('../modals/handleDelete');


const MONGODB_URL = process.env.MONGO_URL;

exports.add_designation = async function(req, res){

    try {

        if(validator_isEmpty(req.body.name)){
            defaultResponse(res, 403, false, "Please enter a valid name.");
            return;
        } else if(validator_isEmpty(req.body.salary) || !validator_isFloat(parseFloat(req.body.salary).toFixed(2))){
            defaultResponse(res, 403, false, "Please enter a valid salary.");
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
                        name: req.body.name
                    }
                    let result = await mdb.collection("designation").find(query).toArray();

                    if(result.length > 0){
                        db.close();
                        defaultResponse(res, 409, false, "Duplicate record found");
                        return;
                    } else {
                        var query2 = {
                            name: req.body.name,
                            salary: req.body.salary
                        };
                        await mdb.collection("designation").insertOne(query2);
                        db.close();

                        defaultResponse(res, 200, true, "Success.");
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

exports.get_designation = function(req, res){

    try {

        MongoClient.connect(MONGODB_URL, async function(err, db) {
            if (err){
                console.error(err);
                defaultResponse(res, 500, false, "Internal Server Error.");
                return;
            } else {

                var mdb = db.db("igym");
                var query = {}
                if(!validator_isEmpty(req.query.id)){
                    query = {
                        _id: ObjectId(req.query.id)
                    }
                }
                let result = await mdb.collection("designation").find(query).toArray();

                db.close();
                defaultResponse(res, 200, true, result);
            
            }
        });

    } catch (err) {
        console.error(err);
        defaultResponse(res, 500, false, "Internal Server Error.");
        return;
    }
    
}

exports.patch_designation = function(req, res){

    try {

        if(validator_isEmpty(req.body.id)){
            defaultResponse(res, 403, false, "designation ID is required.");
            return;
        } else if(validator_isEmpty(req.body.name)){
            defaultResponse(res, 403, false, "Please enter a valid name.");
            return;
        } else if(validator_isEmpty(req.body.salary) || !validator_isFloat(parseFloat(req.body.salary).toFixed(2))){
            defaultResponse(res, 403, false, "Please enter a valid salary.");
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
                        name: req.body.name,
                        salary: req.body.salary
                    };

                    await mdb.collection("designation").updateOne(query, { $set: {...query2}});
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

exports.delete_designation = async function(req, res){

    try {

        if(validator_isEmpty(req.body.id)){
            defaultResponse(res, 403, false, "User ID is required.");
            return;
        } else {

            await handleDelete(req, res, "designation");

        }

    } catch (err) {
        console.error(err);
        defaultResponse(res, 500, false, "Internal Server Error.");
        return;
    }
    
}