const express = require('express');
const Model = require('../db/models/model_distribuidor');
const router = express.Router();
const model_distribuidor = require('../db/models/model_distribuidor');
const model_oscann = require('../db/models/model_oscann');

//Here the code of the API over Express

//Endpoint to allow a reboot of the hardware device
router.get('/Reboot', async (req, res) => {
    try {
        res.json("rebooted!")
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get the summary from backup
router.get('/getAll', async (req, res) => {
    try {
        const data = await model_distribuidor.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get the hardware detail from backup
router.get('/getOne/:id', async (req, res) => {
    try {
        const data = await model_oscann.findOne({ id_oscann: req.params.id.toString() });
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Post the hardware detail to backup
router.post('/store_detail', async (req, res) => {
    model_oscann.findOne({ id_oscann: req.body.id_oscann.toString() }, async function (err, data) {
        if (data == null) {
            try {
                let dataToSave = new model_oscann(req.body);
                res.status(200).json(dataToSave)
                await dataToSave.save()
            }
            catch (error) {
                res.status(400).json({ message: error.message })
            }
            console.log("New oscann to empty DB!")
            return
        }
        
        if (JSON.stringify(req.body) != JSON.stringify(data)) {
            console.log(req.body)
            try {
                let dataToSave = new model_oscann(req.body);
                res.status(200).json(dataToSave)
                await dataToSave.save()
                console.log("Oscann inserted!")
            }
            catch (error) {
                res.status(400).json({ message: error.message })
            }
        } else {
            try {
                await model_oscann.findOneAndUpdate(
                    req.body,
                    { new: true }
                );
                res.status(200).json(req.body)
                console.log("Oscann Updated!")
            }
            catch (error) {
                res.status(400).json({ message: error.message })
            }
        }
    }).sort({ updatedAt: -1 }).select('-_id -createdAt -updatedAt -__v');
})

module.exports = router;