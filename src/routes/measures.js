const express = require('express');
const serialport = require('serialport');
const router = express.Router();

// Models
const Measure = require('../models/Measure');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// New Form Measure 
router.get('/measures/add', isAuthenticated, (req, res) => {
    res.render('measures/new-measure');
});

// Real Time Measures view
router.get('/measures/real-time', isAuthenticated, (req, res) => {
    res.render('measures/real-time-measures');
});

// Post Real Time Measures
router.post('/measures/current', (req, res) => {
    const { port } = req.body;
    const erros = [];
    if (!port) {
        erros.push({ text: "Por favor ingrese el puerto" });
    }
    if (erros.length > 0) {
        res.render('measures/new-measure', {
            erros
        });
    } else {
        const ReadLine = serialport.parsers.Readline;
        global.sp = new serialport(port, {
            baudRate: 9600,
            autoOpen: false
        });
        const parser = sp.pipe(new ReadLine({ delimiter: '\r\n' }));
        sp.open(function(err) {
            if (err) {
                console.log('Error al intentar abrir el puerto: ' + err.message);
            } else {
                console.log('Conexion serial exitosa');
            }
        });
        parser.on('data', function(data) {
            console.log('SerialData: ' + data);
            global.io.emit('SerialData', data.toString());
            const serial_data = JSON.parse(data);
            serial_data.forEach(async function(obj) {
                const sensor_type = obj.type;
                const value = "" + obj.value;
                const unit = "ppm";
                const newMeasure = new Measure({
                    sensor_type,
                    value,
                    unit
                });
                newMeasure.user = req.user.id;
                // console.log(newMeasure);
                await newMeasure.save();
            });
            //req.flash('success_msg', 'Note Added Successfully');
            //res.redirect('/notes');
        });
        parser.on('error', (err) => console.log('Error parser: ' + err));
        sp.on('error', (err) => console.log('Error seriaport: ' + err));

        res.render('measures/real-time-measures', {
            port
        })
    }
});

// Cerrar una toma de datos
router.post('/measures/current-close', (req, res) => {
    global.sp.close();
    req.flash('success_msg', 'Desconexion del puerto exitosa');
    res.redirect('/measures/add')
});

// Ver medidas
router.get('/measures/show', isAuthenticated, async(req, res) => {
    // const measures = await Measure.find();
    /* await measures.forEach(async function(element) {
        global.io.emit('ShowPlotData', element);
        new Promise(resolve => setTimeout(resolve, 1000));
    }); */
    res.render('measures/show-measures');
});

// obtener dats de measures
router.get('/measures/get-data-plot', isAuthenticated, async(req, res) => {
    console.log("AQUI");
    const measures = await Measure.find({ user: req.user._id });
    console.log(measures);


    res.send(measures);
});


module.exports = router;