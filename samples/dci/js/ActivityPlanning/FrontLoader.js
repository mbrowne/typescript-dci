var __dci_internal__ = require('typescript-dci/dci');
var DCI = require('../../DCI');


var FrontLoader = DCI.Context.extend(function () {
var __context = this;
this.__$AllActivities = {        plan: function () {
            __dci_internal__.callMethodOnSelf(__context, this, 'AllActivities', 'forEach', [function (activity) {
                if (!activity.planned)
                    activity.plan();
            }]);
        }
};
    function bindRoles(activities) {
        __context.AllActivities = activities;
    }

    this.plan = function () {
        __context.__$AllActivities.plan.call(__context.AllActivities);
        return AllActivities;
    };
});
module.exports = FrontLoader;

