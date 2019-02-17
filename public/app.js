var app = angular.module('app', ['ui.bootstrap']);

app.controller('ReservationController', function ReservationController($scope, $http) {

    $scope.reservation = {
        name: '',
    };

    $scope.datePickerOptions = {
        maxMode: 'month',
        startingDay: 1,
        showWeeks: false,
        minDate: Date.now(),
    };
    $scope.timePickerOptions = {
    };
    $scope.deleteReservation = function(reservationId) {
        $http.post('/api/reservations/delete', { id: reservationId }).then(function() {
            load();
        })
        .catch(function(err) {
            $scope.error = 'Something went wrong.'
        });
    }

   $scope.saveReservation = function() {
        $scope.error = null;

       if (!$scope.reservation.name || !$scope.reservation.time) {
           $scope.error = "Įveskite vardą, bei pasirinkite laiką, bei kirpėją!";
           return;
       }

       $http.post('/api/reservations', $scope.reservation)
        .then(function() {
            $scope.reservationSuccess = true;
        }).catch(function(err) {
            $scope.error = 'Something went wrong.'
        });
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