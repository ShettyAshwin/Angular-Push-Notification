var Dictionary = (function () {

    var collection = [];
    return {
        _dictionary: collection,

        Add: function (KeyName, Obj) {
            this._dictionary[KeyName] = Obj;
        },
        Remove: function (KeyName) {
            delete this._dictionary[KeyName];
        },/*
         IsKeyAvailable: function (KeyName) {
         if (this._dictionary[KeyName] == null) {
         return false;
         }
         else { return true; }
         },*/
        getValue: function (KeyName) {
            return this._dictionary[KeyName];
        },
        setValue : function(KeyName, obj){
            this._dictionary[KeyName] = obj;
        },
        Count: function () {
            var count = 0;
            for (var property in this._dictionary) {
                if (this._dictionary.hasOwnProperty(property)) {
                    ++count;
                }
            }
            return count;
        },
        ContainsKey : function(KeyName){
            return this._dictionary.hasOwnProperty(KeyName);
        },
        ReturnFirstObject: function () {
            for (var property in this._dictionary) {
                if (this._dictionary.hasOwnProperty(property)) {
                    return property;
                }
            }
        },
        ReturnObjectList: function () {
            var list = [];
            for (var property in this._dictionary) {
                if (this._dictionary.hasOwnProperty(property)) {
                    list.push({key: property, value: this._dictionary[property]});
                }
            }
            return list;
        }
    }
});


(function(){
    var _SingtonDictionary = new Dictionary();
    angular.GetNewDictionaryInstance = (function(InstanceName)
    {
       if(!_SingtonDictionary.ContainsKey(InstanceName)) {
           var _temp = new Dictionary();
           if(InstanceName != null) {
                _SingtonDictionary.Add(InstanceName, _temp);
           }
           return _temp;
       } else {
           throw {
               name: "Dictionary Error",
               level: "",
               message: "Instance with same name already exists.",
               htmlMessage: "<p>Instance with same name already exists.</p>",
               toString: function () { return this.name + ": " + this.message }
           };
       }
    });
    angular.GetDictionaryInstance = (function(InstanceName)
    {
        if(_SingtonDictionary.ContainsKey(InstanceName)) {
            return _SingtonDictionary.getValue(InstanceName);
        } else {
           return null;
        }
    });
    angular.RemoveDictionaryInstance = (function(InstanceName){
        if(_SingtonDictionary.ContainsKey(InstanceName)) {
            _SingtonDictionary.Remove(InstanceName);
        }else {
            throw {
                name: "Dictionary Error",
                level: "",
                message: "Instance with name doesn't exists.",
                htmlMessage: "<p>Instance with name doesn't exists.</p>",
                toString: function () { return this.name + ": " + this.message }
            };
        }

    });
})();