/**
 * Created with JetBrains WebStorm.
 * User: singhi5
 * Date: 10/3/13
 * Time: 3:57 PM
 * To change this template use File | Settings | File Templates.
 */
'use strict';
(function () {
    angular.module('myApp.notificationController', ['ui.bootstrap']).
        controller('notificationController', [
            '$scope', '$timeout',
            'notificationService',
            '$modal',
            '$rootScope',
            function ($scope, $timeout, notifierService, $dialog, $rootScope) {
                var _userScreenNotification = angular.GetNewDictionaryInstance();
                $scope.Notification = {Count:0, NotificationWindowVisible : false, NotificationList: _userScreenNotification.ReturnObjectList(), AlertWindowVisible : false};

                $scope.CloseTimer = function(keyname)
                {
                   var timer  = $timeout(function(){$scope.onCloseNotificationClose(keyname);}, 5000);
                }


                $scope.$on("myApp.ChangeNotification",function(event,props){
                    var _count = notifierService.getNotifications().Count();
                    $scope.Notification.Count = _count;
                    $scope.Notification.NotificationList =  _userScreenNotification.ReturnObjectList();
                    $scope.Notification.NotificationWindowVisible = (_count > 0 ? true : false);
                    switch(props.ChangeType)
                    {
                        case "Added":
                            _userScreenNotification.Add(props.obj.topic.name, {type:"success", msg:props.obj.topic.title});// msg:(props.obj.topic.title == undefined ? props.obj.text : props.obj.topic.title)});
                           // _userScreenNotification.Add(props.obj.topic.name + "Duplicate", {type:"success", msg:props.obj.topic.title});// msg:(props.obj.topic.title == undefined ? props.obj.text : props.obj.topic.title)});

                            $scope.CloseTimer(props.obj.topic.name);
                            break;
                        case "Updated":
                                 if(_userScreenNotification.ContainsKey(props.obj.topic.name)) {
                                     _userScreenNotification.setValue(props.obj.topic.name, {type:"success", msg:props.obj.topic.title});
                                     //_displayMessage.msg =  props.obj.topic.msg;//(props.obj.topic.msg == undefined ? props.obj.text : props.obj.topic.msg);
                                 }
                            else {
                                     _userScreenNotification.Add(props.obj.topic.name, {type:"success", msg:props.obj.topic.title});//{type:"success", msg:(props.obj.topic.title == undefined ? props.obj.text : props.obj.topic.title)});
                                 }
                                $scope.CloseTimer(props.obj.topic.name);
                            break;
                        case "Removed":
                                if(_userScreenNotification.ContainsKey(props.obj.topic.name))
                                {
                                    _userScreenNotification.Remove(props.obj.topic.name) ;
                                    $scope.onCloseNotificationClose(props.obj.topic.name);
                                }
                            break;

                    }
                    $scope.Notification.AlertWindowVisible = (_userScreenNotification.Count() > 0 ?  true : false);
                    $scope.Notification.NotificationList = _userScreenNotification.ReturnObjectList();
                    $rootScope.$broadcast("myApp.SycNotification", props);

                });

                $scope.onCloseNotificationClose = function(keyname){
                   if(_userScreenNotification.ContainsKey(keyname))
                    {
                        _userScreenNotification.Remove(keyname) ;
                    }
                    $scope.Notification.AlertWindowVisible = (_userScreenNotification.Count() > 0 ?  true : false);
                    $scope.Notification.NotificationList = _userScreenNotification.ReturnObjectList();
                }

                var modalOptions = {
                    templateUrl: 'partials/notifyDialog.html',
                    controller: 'notificationDialogController',
                    resolve: {
                        items: function () {
                            return "";
                        }
                    }
                };

                $scope.onNotifyIconClick = function (){
                    var modalInstance = $dialog.open(modalOptions);
                };

            }]);
})();