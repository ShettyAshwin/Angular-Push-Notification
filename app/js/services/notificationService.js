angular.module('myApp.notificationService', [])

    .factory('notificationService', ['$rootScope', function ($scope) {

        var notifyImpl = {};
        notifyImpl.notifications = angular.GetNewDictionaryInstance();

        // Send out a notification to the system.
        notifyImpl.sendNotification = function (props, topicDetail, callbackDelegate) {
            var notification = {
                read: true,
                closed: false,
                topic : topicDetail,
                text: props,
                callBackDelegate : function(){
                    var _notification = notifyImpl.notifications.getValue(notification.topic.name);
                    callbackDelegate();
                    notifyImpl.notifications.Remove(topicDetail.name);
                    $scope.$broadcast("myApp.ChangeNotification", {ChangeType:'Removed', obj:_notification});
                }
            };

            if(notifyImpl.notifications.ContainsKey(notification.topic.name))
            {
               notifyImpl.notifications.setValue(notification.topic.name, notification);
                $scope.$broadcast("myApp.ChangeNotification", {ChangeType:'Updated', obj:notification});
            }
            else
            {
                notifyImpl.notifications.Add(notification.topic.name, notification);
                $scope.$broadcast("myApp.ChangeNotification", {ChangeType:'Added', obj:notification});
            }
            //$scope.$broadcast("cytology.newNotification", notification);
        }

        notifyImpl.getNotifications = function () {
            return notifyImpl.notifications;
        }

        notifyImpl.readNotification = function (TopicName) {
            if(notifyImpl.notifications.ContainsKey(TopicName)) {
                return notifyImpl.notifications.getValue(TopicName);
            }
            else {
                return null;
            }
        }

        notifyImpl.sendNotificationAll = function(){
            while (notifyImpl.notifications.Count()> 0)
            {
                var NotifyObject =  notifyImpl.notifications.getValue(notifyImpl.notifications.ReturnFirstObject());
                NotifyObject.callBackDelegate();
            }
        }

        return notifyImpl;

    }]);