const express = require('express');


const { login, logout } = require('../controllers/auths');
const { get_counts } = require('../controllers/dashboard');
const { add_designation, get_designation, patch_designation, delete_designation } = require('../controllers/designation');
const { add_equipment, get_equipment, patch_equipment, delete_equipment } = require('../controllers/equipment');
const { add_goals, get_goals, patch_goals, delete_goals } = require('../controllers/goals');
const { add_member, get_member, delete_member, patch_member } = require('../controllers/members');
const { add_packages, get_packages, patch_packages, delete_packages } = require('../controllers/packages');
const { add_schedule, get_schedule, patch_schedule, delete_schedule } = require('../controllers/schedule');
const { add_staff, get_staff, patch_staff, delete_staff } = require('../controllers/staff');
const { authenticateToken } = require('../modals/accesstoken');

const app = express.Router();

//test routes
app.get("/abc", (req,res) => { res.status(200).send("responce"); });
app.post("/decodetoken", authenticateToken, (req,res) => { res.status(200).send(req.user); });

app.get("/testmongo", (req,res) => {
    let mongo_url = process.env.MONGO_URL;
    res.status(200).send(mongo_url);
})

//auths
app.post("/login", login);
app.post("/logout", logout);

//dashboard
app.get("/dashboard/count", authenticateToken, get_counts);

//members
app.post("/members", authenticateToken, add_member);
app.get("/members", authenticateToken, get_member);
app.patch("/members", authenticateToken, patch_member);
app.delete("/members", authenticateToken, delete_member);

//goals
app.post("/goals", authenticateToken, add_goals);
app.get("/goals", authenticateToken, get_goals);
app.patch("/goals", authenticateToken, patch_goals);
app.delete("/goals", authenticateToken, delete_goals);

//designation
app.post("/designation", authenticateToken, add_designation);
app.get("/designation", authenticateToken, get_designation);
app.patch("/designation", authenticateToken, patch_designation);
app.delete("/designation", authenticateToken, delete_designation);

//staff
app.post("/staff", authenticateToken, add_staff);
app.get("/staff", authenticateToken, get_staff);
app.patch("/staff", authenticateToken, patch_staff);
app.delete("/staff", authenticateToken, delete_staff);

//schedule
app.post("/schedule", authenticateToken, add_schedule);
app.get("/schedule", authenticateToken, get_schedule);
app.patch("/schedule", authenticateToken, patch_schedule);
app.delete("/schedule", authenticateToken, delete_schedule);

//equipment
app.post("/equipment", authenticateToken, add_equipment);
app.get("/equipment", authenticateToken, get_equipment);
app.patch("/equipment", authenticateToken, patch_equipment);
app.delete("/equipment", authenticateToken, delete_equipment);

//package
app.post("/package", authenticateToken, add_packages);
app.get("/package", authenticateToken, get_packages);
app.patch("/package", authenticateToken, patch_packages);
app.delete("/package", authenticateToken, delete_packages);


module.exports = app;