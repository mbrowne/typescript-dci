



//IN PROGRESS




import DCI = require('../../DCI');
export = FrontLoader;

var FrontLoader = DCI.Context.extend(function() {
	
	function bindRoles(activities) {
		AllActivities <- activities;
	}
	
	role AllActivities {
		plan() {
			this.forEach(function(activity) {
				if (!activity.planned) activity.plan();
			});
		}
	}
	
	this.plan = function() {
		AllActivities.plan();
		return AllActivities;
	}
});