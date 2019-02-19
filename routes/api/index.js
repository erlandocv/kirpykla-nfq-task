const router = require('express').Router();
const wrap = require('express-async-wrap');
const moment = require('moment');

const Barber = require('../../schemas/Barber');
const Reservation = require('../../schemas/Reservation');

router.get('/reservations', wrap(async (req, res, next) => {
	const reservations = await Reservation.find().populate({
		path: 'barber',
		model: Barber
	})
	res.json(reservations)
}));

router.post('/reservations', wrap(async (req, res, next) => {
	const reservation = req.body;

	const exists = await Reservation.findOne({name: req.body.name, time: { $gte: Date.now() }});

	if(exists) {
		return res.sendStatus(403);
	}

	await Reservation.create(reservation);
	res.sendStatus(200);
}));

router.post('/reservations/times', wrap(async (req, res, next) => {
	const date = req.body.date;

	const start = moment(date).startOf('day').format();
	const end = moment(date).endOf('day').format();

	const allReservations = await Reservation.find({
		$and: [
			{
				time: { $gte: start }
			},
			{
				time: { $lte: end }
			},
			{
				barber: req.body.barber
			}
		]
	}).lean();

	res.json(allReservations);
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