require('dotenv').config();
const validator = require('validator');
const { validator_isEmpty, validator_isFloat } = require('../modals/validator');
const { defaultResponse } = require('../modals/defaultResponse');
const { ObjectId, MongoClient } = require('mongodb');

const MONGODB_URL = process.env.MONGO_URL;

exports.get_counts = async function(req, res){

    try {

        MongoClient.connect(MONGODB_URL, async function(err, db) {
            if (err){
                console.error(err);
                defaultResponse(res, 500, false, "Internal Server Error.");
                return;
            } else {

                var mdb = db.db("igym");
                let count_member = await mdb.collection("members").countDocuments({});
                let count_staff = await mdb.collection("staff").countDocuments({});
                let count_schedule = await mdb.collection("schedule").countDocuments({});
                let count_equipment = await mdb.collection("equipment").countDocuments({});

                let response = {
                    member: count_member,
                    staff: count_staff,
                    schedule: count_schedule,
                    equipment: count_equipment
                }

                db.close();
                defaultResponse(res, 200, true, response);
                
            
            }
        });

    } catch (err) {
        console.error(err);
        defaultResponse(res, 500, false, "Internal Server Error.");
        return;
    }
    
}