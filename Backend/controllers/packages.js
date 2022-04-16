require('dotenv').config();
const validator = require('validator');
const { validator_isEmpty, validator_isFloat } = require('../modals/validator');
const { defaultResponse } = require('../modals/defaultResponse');
const { ObjectId, MongoClient } = require('mongodb');

const MONGODB_URL = "mongodb+srv://igymproject:YhsPQfKjB2AmOBaJ@cluster0.7mbph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

exports.add_packages = function(req, res){

    try {

        if(validator_isEmpty(req.body.title)){
            defaultResponse(res, 403, false, "Please enter a valid title for the package.");
            return;
        } else if(validator_isEmpty(req.body.duration)){
            defaultResponse(res, 403, false, "Please select a valid duration for the package.");
            return;
        } else if(validator_isEmpty(req.body.fee) || !validator_isFloat(parseFloat(req.body.fee).toFixed(2))){
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
                        title: req.body.title
                    }
                    let result = await mdb.collection("packages").find(query).toArray();

                    if(result.length > 0){
                        db.close();
                        defaultResponse(res, 409, false, "Duplicate record found");
                        return;
                    } else {
                        var query2 = {
                            title: req.body.title,
                            duration: req.body.duration,
                            fee: req.body.fee,
                            access: req.body.access
                        };
                        await mdb.collection("packages").insertOne(query2);
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

exports.get_packages = function(req, res){

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
                let result = await mdb.collection("packages").find(query).toArray();

                defaultResponse(res, 200, true, result);
            
            }
        });

    } catch (err) {
        console.error(err);
        defaultResponse(res, 500, false, "Internal Server Error.");
        return;
    }
    
}

exports.patch_packages = function(req, res){

    try {

        if(validator_isEmpty(req.body.id)){
            defaultResponse(res, 403, false, "designation ID is required.");
            return;
        } else if(validator_isEmpty(req.body.title)){
            defaultResponse(res, 403, false, "Please enter a valid title for the package.");
            return;
        } else if(validator_isEmpty(req.body.duration)){
            defaultResponse(res, 403, false, "Please select a valid duration for the package.");
            return;
        } else if(validator_isEmpty(req.body.fee) || !validator_isFloat(parseFloat(req.body.fee).toFixed(2))){
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
                        title: req.body.title,
                        duration: req.body.duration,
                        fee: req.body.fee,
                        access: req.body.access
                    };

                    await mdb.collection("packages").updateOne(query, { $set: {...query2}});
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

exports.delete_packages = function(req, res){

    try {

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

                await mdb.collection("packages").deleteOne(query);
                db.close();

                defaultResponse(res, 200, true, "Success.");

            }
        });

    } catch (err) {
        console.error(err);
        defaultResponse(res, 500, false, "Internal Server Error.");
        return;
    }
    
}