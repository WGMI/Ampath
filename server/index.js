const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const mysql = require('mysql')

const db = mysql.createPool({
	host:'142.93.103.37',
	user:'test_user',
	password:'Eek6FEuxS7Y8IGlV@2021',
	database:'testDB',
	port:'3306'
})

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))

const PORT = 3001

app.get('/',(req,res) => {
	const select = "SELECT * FROM patient"
	db.query(select,(err,result) => {
		res.send(result)
	})
})

app.get('/patientsearch/:patient',(req,res) => {
	const select = "SELECT * FROM patient where name = ?";
	db.query(select,req.params.patient,(err,result) => {
		res.send(result)
	})
})

app.get('/locations',(req,res) => {
	const select = "SELECT name FROM location";
	db.query(select,(err,result) => {
		res.send(result)
	})
})

app.get('/patientdetails/:patient_id',(req,res) => {
	const select = "SELECT htn_status, dm_status FROM patient p join flat_cdm_summary f on p.patient_id = f.patient_id where p.patient_id = ?";
	db.query(select,req.params.patient_id,(err,result) => {
		res.send(result)
	})
})

app.get('/nhreport',(req,res) => {

	const nh = "SELECT l.name,count(p.patient_id) as 'New Hypertensive' FROM patient p join flat_cdm_summary f on p.patient_id = f.patient_id join location l on l.id = f.location_id where htn_status = 7285 group by location_id,htn_status order by location_id;";
	db.query(nh,(err,result) => {
		res.send(result)
	})
})

app.get('/khreport',(req,res) => {

	const nh = "SELECT l.name,count(p.patient_id) as 'Known Hypertensive' FROM patient p join flat_cdm_summary f on p.patient_id = f.patient_id join location l on l.id = f.location_id where htn_status = 7286 group by location_id,htn_status order by location_id;";
	db.query(nh,(err,result) => {
		res.send(result)
	})
})

app.get('/ndreport',(req,res) => {

	const nh = "SELECT l.name,count(p.patient_id) as 'New Diabetic' FROM patient p join flat_cdm_summary f on p.patient_id = f.patient_id join location l on l.id = f.location_id where dm_status = 7281 group by location_id,dm_status order by location_id;";
	db.query(nh,(err,result) => {
		res.send(result)
	})
})

app.get('/kdreport',(req,res) => {

	const nh = "SELECT l.name,count(p.patient_id) as 'Known Diabetic' FROM patient p join flat_cdm_summary f on p.patient_id = f.patient_id join location l on l.id = f.location_id where dm_status = 7282 group by location_id,dm_status order by location_id;";
	db.query(nh,(err,result) => {
		res.send(result)
	})
})

app.get('/hdreport',(req,res) => {

	const nh = "SELECT l.name,count(p.patient_id) as 'Known Diabetic' FROM patient p join flat_cdm_summary f on p.patient_id = f.patient_id join location l on l.id = f.location_id where dm_status = 7282 group by location_id,dm_status order by location_id;";
	db.query(nh,(err,result) => {
		res.send(result)
	})
})

app.get('/hppatientsreport',(req,res) => {

	const nh = "SELECT p.name as PatinentName,encounter_datetime,l.name as Location,IF(htn_status = 7285,'New','Known') as 'HypertensionStatus',gender,YEAR(CURRENT_TIMESTAMP) - YEAR(dob) - (RIGHT(CURRENT_TIMESTAMP, 5) < RIGHT(dob, 5)) as age from flat_cdm_summary f join patient p on p.patient_id = f.patient_id join location l on l.id = f.location_id where htn_status = 7285 or htn_status = 7286 limit 20;";
	db.query(nh,(err,result) => {
		res.send(result)
	})
})

app.listen(PORT,() => {
	console.log('RUNNING on ' + PORT)
})