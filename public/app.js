/* global moment */

var app = angular.module('app', ['ui.bootstrap']);

app.controller('ReservationController', function ReservationController($scope, $http, $q) {

    $scope.reservation = {};
    $scope.reservations = [];
    $scope.barbers = [];
    $scope.times = [];
    $scope.allTimes = [];

    $scope.datePickerOptions = {
        maxMode: 'month',
        startingDay: 1,
        showWeeks: false,
        minDate: Date.now(),
    };

    $scope.$watchGroup(['reservation.date', 'reservation.barber'], function(val) {
        if(val[0] && val[1]) {
            getTimes(val[0], val[1])
        }
    })

    var timeStops = getTimeStops("10:00", "19:45");



   $scope.saveReservation = function() {
        $scope.error = null;

        $scope.reservation.time = moment($scope.reservation.date);
        $scope.reservation.time.set({
            h: $scope.reservation.hour.split(':')[0],
            m: $scope.reservation.hour.split(':')[1]
        })


       if (!$scope.reservation.hour) {
           $scope.error = "Įveskite vardą, bei pasirinkite laiką, bei kirpėją!";
           return;
       }

       $http.post('/api/reservations', $scope.reservation)
        .then(function() {
            $scope.reservationSuccess = true;
        }).catch(function(err) {
            $scope.error = 'Something went wrong. Reservation exists.'
        });
   }

   function getTimes(date, barber) {
     $http
       .post("/api/reservations/times", { date: date, barber: barber })
       .then(function(times) {
         $scope.times = times.data.map(function(time) {
           return moment(time.time).format("HH:mm");
         });

         $scope.allTimes = timeStops.map(function(time) {
           return {
             time: time,
             available: !$scope.times.includes(time)
           };
         });
       });
   }

   function load() {

    $http.get('/api/barbers').then(function(barbers) {
        $scope.barbers = barbers.data;
    }).catch(function(err) {
        console.log(err);
     })
    }

     load();

     function getTimeStops(start, end) {
       var startTime = moment(start, "HH:mm");
       var endTime = moment(end, "HH:mm");

       if (endTime.isBefore(startTime)) {
         endTime.add(1, "day");
       }

       var timeStops = [];

       while (startTime <= endTime) {
         timeStops.push(new moment(startTime).format("HH:mm"));

         startTime.add(15, "minutes");
       }

       return timeStops;
     }
});

app.controller("BarberController", function BarberController($scope, $http, $q) {
    $scope.barbers = [];
    $scope.reservations = [];
    $scope.newBarber = {};

    load();

    $scope.deleteBarber = function(barberId) {
        $http.post('/api/barbers/delete', { id: barberId }).then(function() {
            load();
        })
        .catch(function(err) {
            $scope.error = 'Something went wrong.'
        });
    }

    $scope.deleteReservation = function(reservationId) {
        $http.post('/api/reservations/delete', { id: reservationId}).then(function() {
            load();
        }).catch(function(err) {
            $scope.error = 'Something went wrong.'
        });
    }

    $scope.addBarber = function() {
        $scope.error = null;

        $http.post('/api/barbers', $scope.newBarber)
            .then(function() {
                load();
            }).catch(function(err) {
                $scope.error = 'Something went wrong.'
            });
   } 

    function load() {

        $q.all([$http.get('/api/reservations'), $http.get('/api/barbers')]).then(function(data) {
            $scope.barbers = data[1].data;
            $scope.reservations = data[0].data
        }).catch(function(err) {
            console.log(err);
         })
    }
})