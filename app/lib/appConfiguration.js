/**
 * Created with JetBrains WebStorm.
 * User: shettya
 * Date: 10/7/13
 * Time: 5:13 PM
 * To change this template use File | Settings | File Templates.
 */

var config_module = angular.module('myApp.config', []);

var app_Config = {
    'Service' : {
        'Case': 'http://localhost:8003/WorkflowManagementService/json/GetCaseBySpecimen/'
    },
    'StompConfiguration' : {
        'Server': '10.55.144.81',
        'Port': '61623',
        'Protocol': 'ws',
        'UserName': 'admin',
        'Password': 'password'
    },
    'PubSubTopic' : {
        'Patient' : '/topic/patient',
        'SpecialInstruction' : '/topic/specialInstructions'
    }
}

angular.forEach(app_Config,function(key,value) {
    config_module.constant(value,key);
});

angular.getAppSection = function(key){
      return app_Config[key];
}