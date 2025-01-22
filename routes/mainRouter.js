const express = require('express');
const router = express.Router()

const travel = require('../models/travel');


// to view all travels
router.get('/', async (req, res) => {
    try {
        const travels = await travel.find();
        res.render('index', { travels });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// to get added travel
router.get('/add', (req, res) => {
    res.render('add');
});


// process to add after submission
router.post('/add', async (req, res) => {
    const { destination, duration, cost } = req.body;
    const Travel = new travel({ destination, duration, cost });
    await Travel.save();
    // Redirect to the details page of the newly added travel
    res.redirect(`details/${Travel.destination}`);
});

// travel details
router.get('/details/:destination', async (req, res) => {
    const travelDetail = await travel.findOne({ destination: req.params.destination });
    if (!travelDetail) {
        return res.status(404).send('Travel not found');
    }
    res.render('details', { travel: travelDetail });
});

//update details

router.post('/update/:destination', async (req, res) => {
    const { destination } = req.params;
    const { duration, cost } = req.body;

    const updatedTravel = await travel.findOneAndUpdate(
        { destination }, { duration, cost },
        { new: true , upsert: true}
    );
    if (!updatedTravel) {
        return res.status(404).send('Travel not found');
    }
    res.redirect(`/details/${destination}`);
});

//delete travel 

router.post('/delete/:destination', async (req, res) => {
    const { destination } = req.params;

    const deletedTravel = await travel.findOneAndDelete({ destination });
    if (!deletedTravel) {
        return res.status(404).send('Travel not found');
    }
    res.redirect('/');
});

module.exports = router;



