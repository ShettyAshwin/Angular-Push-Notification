
'use strict';
(function () {
    angular.module('myApp.notificationDialogController', []).
        controller('notificationDialogController', [
            '$scope',
            'notificationService',
            '$modalInstance',
            function ($scope, notifierService, $modalInstance) {

                $scope.notifyData = notifierService.getNotifications().ReturnObjectList();

                $scope.$on("myApp.SycNotification",function(event,props){
                    $scope.refresh();
                });

                $scope.refresh = function () {
                    if(notifierService.getNotifications().Count() == 0) {
                        $modalInstance.close();
                    }

                    $scope.notifyData = notifierService.getNotifications().ReturnObjectList();
                };

                $scope.onAcceptAllClicked = function (){
                    notifierService.sendNotificationAll();
                   $scope.refresh();
                };

                $scope.acceptClicked = function(obj){
                    obj.callBackDelegate();
                    $scope.refresh();
                } ;

                $scope.onCancelClicked = function() {
                    $modalInstance.dismiss('cancel');
                };
            }]);
})();