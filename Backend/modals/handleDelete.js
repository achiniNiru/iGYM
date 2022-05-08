require('dotenv').config();
const { ObjectId, MongoClient } = require('mongodb');
const { defaultResponse } = require('./defaultResponse');

const MONGODB_URL = process.env.MONGO_URL;

async function handleDelete(req, res, collection){

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

            await mdb.collection(collection).deleteOne(query);
            db.close();

            defaultResponse(res, 200, true, "Success.");

        }
    });

}

module.exports = handleDelete;