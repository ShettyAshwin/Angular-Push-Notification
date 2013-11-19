'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('patientController', ['$scope','repositoryService', 'notificationService',
        function($scope, repositoryService, notificationService) {

        repositoryService.getCaseFor('S09-09154 1').then(function (_case) {
             $scope.patient = _case.patient;
        });

        repositoryService.whenPatientChanged(function(patient){
            if (!_.isEqual(patient, $scope.patient)) {

                var title = 'Patient changed: ';
                var message =
                    'FROM: ' +
                        $scope.patient.lastname + ', ' +
                        $scope.patient.firstname +
                        ' gender: ' + $scope.patient.gender +
                        ' TO: ' +
                        patient.lastname + ', ' + patient.firstname +
                        ' gender: ' + patient.gender ;

                notificationService.sendNotification(message, {name:"PatientNotification", title: title}, function(){
                    $scope.patient = patient;
                });
            }
        });
  }]);