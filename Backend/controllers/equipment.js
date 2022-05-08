require('dotenv').config();
const validator = require('validator');
const { validator_isEmpty } = require('../modals/validator');
const { defaultResponse } = require('../modals/defaultResponse');
const { ObjectId, MongoClient } = require('mongodb');
const multer = require('multer');
const handleDelete = require('../modals/handleDelete');


const MONGODB_URL = process.env.MONGO_URL;

exports.add_equipment = function(req, res){

    try {

        var allowedFileTypes = [
            "image/jpg",
            "image/jpeg",
            "image/png"
        ];
        var uploadedFile = "";

        //Define where project photos will be stored
        var storage = multer.diskStorage({

            destination: function (request, file, callback) {
                callback(null, './public/equipment');
            },
            filename: function (request, file, callback) {
                let extension = "jpg";
                if(file.mimetype === "image/jpg"){
                    extension = "jpg";
                } else if(file.mimetype === "image/jpeg"){
                    extension = "jpeg";
                } else if(file.mimetype === "image/png"){
                    extension = "png";
                } else {
                    extension = "jpg"
                }

                let filename = "eq_"+Date.now()+"."+extension;

                uploadedFile = filename;

                callback(null, filename)
            }

        });

        // Function to upload project images
        var upload = multer({
            storage: storage,
            limits: {
                fileSize: 10000000 // 1000000 Bytes = 1 MB
            },
            fileFilter: (req, file, cb) => {
                if (allowedFileTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(null, false);
                    defaultResponse(res, 400, false, "Only .jpg, .jpeg & .png files are supported");
                    return;
                }
            }
        }).single('display_pic');

        // add new photos to the DB
        upload(req, res, (err) => {

            if (err instanceof multer.MulterError) {
                console.error(err);
                defaultResponse(res, 400, false, "Internal Server Error.");
                return;
            } else if (err) {
                console.error(err);
                defaultResponse(res, 400, false, "Internal Server Error.");
                return;
            } else if(uploadedFile === ""){
                defaultResponse(res, 403, false, "Please insert a valid image for the image");
                return; 
            } else if(validator_isEmpty(req.body.name)){
                defaultResponse(res, 403, false, "Equipment name is required.");
                return;
            } else if(validator_isEmpty(req.body.type)){
                defaultResponse(res, 403, false, "Equipment type is required.");
                return;
            } else if(validator_isEmpty(req.body.code)){
                defaultResponse(res, 403, false, "Please enter a code number for equipment.");
                return;
            } else if(validator_isEmpty(req.body.weight)) {
                defaultResponse(res, 403, false, "You must enter a weight for the equipment.");
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
                            $or: [
                                {name: req.body.name},
                                {code: req.body.code}
                            ]
                        }
                        let result = await mdb.collection("equipment").find(query).toArray();

                        if(result.length > 0){
                            db.close();
                            defaultResponse(res, 409, false, "Duplicate record found");
                            return;
                        } else {
                            var query2 = {
                                name: req.body.name,
                                type: req.body.type,
                                code: req.body.code,
                                weight: req.body.weight,
                                dp: uploadedFile,
                                timestamp: new Date()
                            };
                            await mdb.collection("equipment").insertOne(query2);
                            db.close();

                            defaultResponse(res, 200, true, "Success.");
                        }

                    }
                });

            }
        });

    } catch (err) {
        console.error(err);
        defaultResponse(res, 500, false, "Internal Server Error.");
        return;
    }
    
}

exports.get_equipment = function(req, res){

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
                let result = await mdb.collection("equipment").find(query).toArray();

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

exports.patch_equipment = function(req, res){

    try {

        var allowedFileTypes = [
            "image/jpg",
            "image/jpeg",
            "image/png"
        ];
        var uploadedFile = "";

        //Define where project photos will be stored
        var storage = multer.diskStorage({

            destination: function (request, file, callback) {
                callback(null, './public/equipment');
            },
            filename: function (request, file, callback) {
                let extension = "jpg";
                if(file.mimetype === "image/jpg"){
                    extension = "jpg";
                } else if(file.mimetype === "image/jpeg"){
                    extension = "jpeg";
                } else if(file.mimetype === "image/png"){
                    extension = "png";
                } else {
                    extension = "jpg"
                }

                let filename = "dp_"+Date.now()+"."+extension;

                uploadedFile = filename;

                callback(null, filename)
            }

        });

        // Function to upload project images
        var upload = multer({
            storage: storage,
            limits: {
                fileSize: 10000000 // 1000000 Bytes = 1 MB
            },
            fileFilter: (req, file, cb) => {
                if (allowedFileTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(null, false);
                    defaultResponse(res, 400, false, "Only .jpg, .jpeg & .png files are supported");
                    return;
                }
            }
        }).single('display_pic');

        // add new photos to the DB
        upload(req, res, (err) => {

            if (err instanceof multer.MulterError) {
                console.error(err);
                defaultResponse(res, 400, false, "Internal Server Error.");
                return;
            } else if (err) {
                console.error(err);
                defaultResponse(res, 400, false, "Internal Server Error.");
                return;
            }  else if(validator_isEmpty(req.body.name)){
                defaultResponse(res, 403, false, "Equipment name is required.");
                return;
            } else if(validator_isEmpty(req.body.type)){
                defaultResponse(res, 403, false, "Equipment type is required.");
                return;
            } else if(validator_isEmpty(req.body.code)){
                defaultResponse(res, 403, false, "Please enter a code number for equipment.");
                return;
            } else if(validator_isEmpty(req.body.weight)) {
                defaultResponse(res, 403, false, "You must enter a weight for the equipment.");
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
                            type: req.body.type,
                            code: req.body.code,
                            weight: req.body.weight
                        };
                        if(uploadedFile !== ""){
                            query2 = {
                                ...query2,
                                dp: uploadedFile
                            }
                        }
                        
                        await mdb.collection("equipment").updateOne(query, { $set: {...query2}});
                        db.close();

                        defaultResponse(res, 200, true, "Success.");

                    }
                });

            }
        });

    } catch (err) {
        console.error(err);
        defaultResponse(res, 500, false, "Internal Server Error.");
        return;
    }
    
}

exports.delete_equipment = async function(req, res){

    try {

        await handleDelete(req, res, "equipment");

    } catch (err) {
        console.error(err);
        defaultResponse(res, 500, false, "Internal Server Error.");
        return;
    }
    
}