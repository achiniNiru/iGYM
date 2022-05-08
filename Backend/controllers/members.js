require('dotenv').config();
const validator = require('validator');
const { validator_isEmpty, validator_isDate } = require('../modals/validator');
const { defaultResponse } = require('../modals/defaultResponse');
const { ObjectId, MongoClient } = require('mongodb');
const multer = require('multer');
const handleDelete = require('../modals/handleDelete');

const MONGODB_URL = process.env.MONGO_URL;

exports.add_member = async function(req, res) {
    
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
                callback(null, './public/members');
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

            let input_packages = JSON.parse(req.body.packages);

            if (err instanceof multer.MulterError) {
                console.error(err);
                defaultResponse(res, 400, false, "Internal Server Error.");
                return;
            } else if (err) {
                console.error(err);
                defaultResponse(res, 400, false, "Internal Server Error.");
                return;
            } else if(uploadedFile === ""){
                defaultResponse(res, 403, false, "Please insert a valid profile picture");
                return; 
            } else if(validator_isEmpty(req.body.name)){
                defaultResponse(res, 403, false, "Please enter a valid name.");
                return;
            } else if(!validator_isDate(req.body.dob)){
                defaultResponse(res, 403, false, "Please enter a valid Date of Birth.");
                return;
            } else if(validator_isEmpty(req.body.phone) || !validator.isMobilePhone(req.body.phone)){
                defaultResponse(res, 403, false, "Please enter a valid phone number.");
                return;
            } else if(validator_isEmpty(req.body.email) || !validator.isEmail(req.body.email)) {
                defaultResponse(res, 403, false, "Please enter a valid email address.");
                return;
            } else if(validator_isEmpty(req.body.nic) || !validator.isIdentityCard(req.body.nic,'any')){
                defaultResponse(res, 403, false, "Please enter a valid NIC.");
                return;
            } else if(validator_isEmpty(req.body.gender)){
                defaultResponse(res, 403, false, "Please select a valid gender.");
                return;
            } else if(validator_isEmpty(req.body.address)) {
                defaultResponse(res, 403, false, "You must enter a valid address.");
                return;
            } else {
                
                MongoClient.connect(MONGODB_URL, async function(err, db) {
                    if (err){
                        console.error(err);
                        defaultResponse(res, 500, false, "Internal Server Error.");
                        return;
                    } else {

                        var mdb = db.db("igym");

                        let dob = new Date(req.body.dob);
                        let dob_month = String(dob.getMonth()+1).padStart(2, '0');
                        let dob_date = String(dob.getDate()).padStart(2, '0');
                        let dob_string = dob.getFullYear()+"-"+dob_month+"-"+dob_date;

                        var query = {
                            $or: [
                                {phone: req.body.phone},
                                {email: req.body.email},
                                {nic: req.body.nic}
                            ]
                        }
                        let result = await mdb.collection("members").find(query).toArray();

                        if(result.length > 0){
                            db.close();
                            defaultResponse(res, 409, false, "Duplicate record found");
                            return;
                        } else {
                            var query2 = {
                                name: req.body.name,
                                dob: dob_string,
                                phone: req.body.phone,
                                email: req.body.email,
                                nic: req.body.nic,
                                gender: req.body.gender,
                                address: req.body.address,
                                packages: input_packages,
                                dp: uploadedFile,

                            };
                            await mdb.collection("members").insertOne(query2);
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

exports.get_member = async function(req, res) {

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
                let result = await mdb.collection("members").find(query).toArray();

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

exports.patch_member = async function(req, res) {

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
                callback(null, './public/members');
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

            let input_packages = JSON.parse(req.body.packages);

            if (err instanceof multer.MulterError) {
                console.error(err);
                defaultResponse(res, 400, false, "Internal Server Error.");
                return;
            } else if (err) {
                console.error(err);
                defaultResponse(res, 400, false, "Internal Server Error.");
                return;
            } else if(validator_isEmpty(req.body.id)){
                defaultResponse(res, 403, false, "User ID is required.");
                return;
            } else if(validator_isEmpty(req.body.name)){
                defaultResponse(res, 403, false, "Please enter a valid name.");
                return;
            } else if(validator_isEmpty(req.body.dob) || validator.toDate(req.body.dob) === null){
                defaultResponse(res, 403, false, "Please enter a valid Date of Birth.");
                return;
            } else if(validator_isEmpty(req.body.phone) || !validator.isMobilePhone(req.body.phone)){
                defaultResponse(res, 403, false, "Please enter a valid phone number.");
                return;
            } else if(validator_isEmpty(req.body.email) || !validator.isEmail(req.body.email)) {
                defaultResponse(res, 403, false, "Please enter a valid email address.");
                return;
            } else if(validator_isEmpty(req.body.nic) || !validator.isIdentityCard(req.body.nic,'any')){
                defaultResponse(res, 403, false, "Please enter a valid NIC.");
                return;
            } else if(validator_isEmpty(req.body.gender)){
                defaultResponse(res, 403, false, "Please select a valid gender.");
                return;
            } else if(validator_isEmpty(req.body.address)) {
                defaultResponse(res, 403, false, "You must enter a valid address.");
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
                            dob: req.body.dob,
                            phone: req.body.phone,
                            email: req.body.email,
                            nic: req.body.nic,
                            gender: req.body.gender,
                            address: req.body.address,
                            packages: input_packages,
                        };
                        if(uploadedFile !== ""){
                            query2 = {
                                ...query2,
                                dp: uploadedFile
                            }
                        }

                        await mdb.collection("members").updateOne(query, { $set: {...query2}});
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

exports.delete_member = async function(req, res) {
    
    try {

        if(validator_isEmpty(req.body.id)){
            defaultResponse(res, 403, false, "User ID is required.");
            return;
        } else {

            await handleDelete(req, res, "members");

        }

    } catch (err) {
        console.error(err);
        defaultResponse(res, 500, false, "Internal Server Error.");
        return;
    }

}