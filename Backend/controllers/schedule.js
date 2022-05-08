require('dotenv').config();
const validator = require('validator');
const { validator_isEmpty } = require('../modals/validator');
const { defaultResponse } = require('../modals/defaultResponse');
const { ObjectId, MongoClient } = require('mongodb');
const handleDelete = require('../modals/handleDelete');

const MONGODB_URL = process.env.MONGO_URL;


exports.add_schedule = function(req, res){

    try {

        if(validator_isEmpty(req.body.title)){
            defaultResponse(res, 403, false, "Please enter a valid title for the event.");
            return;
        } else if (!Number.isInteger(parseInt(req.body.capacity))) {
            defaultResponse(res, 403, false, "Please enter a valid capacity for the event.");
            return;
        } else if(typeof req.body.allDay !== "boolean"){
            defaultResponse(res, 403, false, "Please select a all day option.");
            return;
        } else if(validator.toDate(req.body.start) === null){
            defaultResponse(res, 403, false, "Please enter a start date.");
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
                        $and: [
                            {title: req.body.title},
                            {allDay: req.body.allDay},
                            {start: req.body.start}
                        ]
                    }
                    let result = await mdb.collection("schedule").find(query).toArray();

                    if(result.length > 0){
                        db.close();
                        defaultResponse(res, 409, false, "Duplicate record found");
                        return;
                    } else {

                        var query2 = {
                            allDay: req.body.allDay,
                            start: req.body.start,
                            title: req.body.title,
                            capacity: parseInt(req.body.capacity),
                            timestamp: new Date()
                        };
                        await mdb.collection("schedule").insertOne(query2);
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

exports.get_schedule = function(req, res){

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
                let result = await mdb.collection("schedule").find(query).toArray();

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

exports.patch_schedule = function(req, res){

    try {

        if(validator_isEmpty(req.body.id)){
            defaultResponse(res, 403, false, "Event ID is required.");
            return;
        } else if(validator_isEmpty(req.body.title)){
            defaultResponse(res, 403, false, "Please enter a valid title for the event.");
            return;
        } else if (!Number.isInteger(parseInt(req.body.capacity))) {
            defaultResponse(res, 403, false, "Please enter a valid capacity for the event.");
            return;
        } else if(typeof req.body.allDay !== "boolean"){
            defaultResponse(res, 403, false, "Please select a all day option.");
            return;
        } else if(validator.toDate(req.body.start) === null){
            defaultResponse(res, 403, false, "Please enter a start date.");
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
                        allDay: req.body.allDay,
                        start: req.body.start,
                        title: req.body.title,
                        capacity: parseInt(req.body.capacity)
                    };

                    await mdb.collection("schedule").updateOne(query, { $set: {...query2}});
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

exports.delete_schedule = async function(req, res){

    try {

        await handleDelete(req, res, "schedule");

    } catch (err) {
        console.error(err);
        defaultResponse(res, 500, false, "Internal Server Error.");
        return;
    }
    
}