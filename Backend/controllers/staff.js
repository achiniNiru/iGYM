require('dotenv').config();
const validator = require('validator');
const { validator_isEmpty } = require('../modals/validator');
const { defaultResponse } = require('../modals/defaultResponse');
const { ObjectId, MongoClient } = require('mongodb');
const multer = require('multer');
const handleDelete = require('../modals/handleDelete');

const MONGODB_URL = process.env.MONGO_URL;

exports.add_staff = function(req, res){

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
                callback(null, './public/staff');
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
            } else if(uploadedFile === ""){
                defaultResponse(res, 403, false, "Please insert a valid profile picture");
                return; 
            } else if(validator_isEmpty(req.body.fname)){
                defaultResponse(res, 403, false, "First name is required.");
                return;
            } else if(validator_isEmpty(req.body.lname)){
                defaultResponse(res, 403, false, "Last name is required.");
                return;
            } else if(validator_isEmpty(req.body.dob) || validator.toDate(req.body.dob) === null){
                defaultResponse(res, 403, false, "Please enter a valid Date of Birth.");
                return;
            } else if(validator_isEmpty(req.body.address)) {
                defaultResponse(res, 403, false, "You must enter a valid address.");
                return;
            } else if(validator_isEmpty(req.body.nic) || !validator.isIdentityCard(req.body.nic,'any')){
                defaultResponse(res, 403, false, "Please enter a valid NIC.");
                return;
            } else if(validator_isEmpty(req.body.phone) || !validator.isMobilePhone(req.body.phone)){
                defaultResponse(res, 403, false, "Please enter a valid phone number.");
                return;
            } else if(validator_isEmpty(req.body.phone2) || !validator.isMobilePhone(req.body.phone2)){
                defaultResponse(res, 403, false, "Please provide a sercondary phone number");
                return;
            } else if(validator_isEmpty(req.body.home)){
                defaultResponse(res, 403, false, "Please enter a valid home contact number.");
                return;
            } else if(validator_isEmpty(req.body.email) || !validator.isEmail(req.body.email)) {
                defaultResponse(res, 403, false, "Please enter a valid email address.");
                return;
            } else if(validator_isEmpty(req.body.gender)){
                defaultResponse(res, 403, false, "Please select a valid gender.");
                return;
            } else if(validator_isEmpty(req.body.maritial_status)){
                defaultResponse(res, 403, false, "Please select a valid maritial status.");
                return;
            } else if(validator_isEmpty(req.body.designation)){
                defaultResponse(res, 403, false, "Please select a valid designation.");
                return;
            } else if(validator_isEmpty(req.body.center)){
                defaultResponse(res, 403, false, "Please select a valid center.");
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
                                {phone: req.body.phone},
                                {phone: req.body.phone2},
                                {email: req.body.email},
                                {nic: req.body.nic}
                            ]
                        }
                        let result = await mdb.collection("staff").find(query).toArray();

                        if(result.length > 0){
                            db.close();
                            defaultResponse(res, 409, false, "Duplicate record found");
                            return;
                        } else {
                            var query2 = {
                                fname: req.body.fname,
                                lname: req.body.lname,
                                dob: req.body.dob,
                                address: req.body.address,
                                nic: req.body.nic,
                                phone: req.body.phone,
                                phone2: req.body.phone2,
                                home: req.body.home,
                                email: req.body.email,
                                gender: req.body.gender,
                                maritial_status: req.body.maritial_status,
                                designation: req.body.designation,
                                center: req.body.center,
                                dp: uploadedFile
                            };
                            await mdb.collection("staff").insertOne(query2);
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

exports.get_staff = function(req, res){

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
                let result = await mdb.collection("staff").find(query).toArray();

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

exports.patch_staff = function(req, res){

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
                callback(null, './public/staff');
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
            } else if(validator_isEmpty(req.body.fname)){
                defaultResponse(res, 403, false, "First name is required.");
                return;
            } else if(validator_isEmpty(req.body.lname)){
                defaultResponse(res, 403, false, "Last name is required.");
                return;
            } else if(validator_isEmpty(req.body.dob) || validator.toDate(req.body.dob) === null){
                defaultResponse(res, 403, false, "Please enter a valid Date of Birth.");
                return;
            } else if(validator_isEmpty(req.body.address)) {
                defaultResponse(res, 403, false, "You must enter a valid address.");
                return;
            } else if(validator_isEmpty(req.body.nic) || !validator.isIdentityCard(req.body.nic,'any')){
                defaultResponse(res, 403, false, "Please enter a valid NIC.");
                return;
            } else if(validator_isEmpty(req.body.phone) || !validator.isMobilePhone(req.body.phone)){
                defaultResponse(res, 403, false, "Please enter a valid phone number.");
                return;
            } else if(validator_isEmpty(req.body.phone2) || !validator.isMobilePhone(req.body.phone2)){
                defaultResponse(res, 403, false, "Please provide a sercondary phone number");
                return;
            } else if(validator_isEmpty(req.body.home)){
                defaultResponse(res, 403, false, "Please enter a valid home contact number.");
                return;
            } else if(validator_isEmpty(req.body.email) || !validator.isEmail(req.body.email)) {
                defaultResponse(res, 403, false, "Please enter a valid email address.");
                return;
            } else if(validator_isEmpty(req.body.gender)){
                defaultResponse(res, 403, false, "Please select a valid gender.");
                return;
            } else if(validator_isEmpty(req.body.maritial_status)){
                defaultResponse(res, 403, false, "Please select a valid maritial status.");
                return;
            } else if(validator_isEmpty(req.body.designation)){
                defaultResponse(res, 403, false, "Please select a valid designation.");
                return;
            } else if(validator_isEmpty(req.body.center)){
                defaultResponse(res, 403, false, "Please select a valid center.");
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
                            fname: req.body.fname,
                            lname: req.body.lname,
                            dob: req.body.dob,
                            address: req.body.address,
                            nic: req.body.nic,
                            phone: req.body.phone,
                            phone2: req.body.phone2,
                            home: req.body.home,
                            email: req.body.email,
                            gender: req.body.gender,
                            maritial_status: req.body.maritial_status,
                            designation: req.body.designation,
                            center: req.body.center
                        };
                        if(uploadedFile !== ""){
                            query2 = {
                                ...query2,
                                dp: uploadedFile
                            }
                        }
                        
                        await mdb.collection("staff").updateOne(query, { $set: {...query2}});
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

exports.delete_staff = async function(req, res){

    try {

        await handleDelete(req, res, "staff");

    } catch (err) {
        console.error(err);
        defaultResponse(res, 500, false, "Internal Server Error.");
        return;
    }
    
}