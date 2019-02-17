const router = require('express').Router();
const wrap = require('express-async-wrap');

const Barber = require('../../schemas/Barber');
const Reservation = require('../../schemas/Reservation');

router.get('/reservations', wrap(async (req, res, next) => res.json(await Reservation.find())));

router.post('/reservations', wrap(async (req, res, next) => {
	const reservation = req.body;

	await Reservation.create(reservation);


	res.sendStatus(200);
}));
router.post("/reservations/delete", wrap(async (req, res, next) => {
	await Reservation.findByIdAndDelete(req.body.id);
	res.sendStatus(200);
}));

router.get("/barbers", wrap(async (req, res, next) => res.json(await Barber.find())));

router.post("/barbers", wrap(async (req, res, next) => {
	await Barber.create(req.body);
	res.sendStatus(200);
}));

router.post("/barbers/delete", wrap(async (req, res, next) => {
	await Barber.findByIdAndDelete(req.body.id);
	res.sendStatus(200);
}));




module.exports = router;