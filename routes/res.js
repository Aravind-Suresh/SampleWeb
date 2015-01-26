var sqlConnectCount = 1;
var currentUser="default";
var currentAccessToken=null;

module.exports = {"sqlConnectCount":sqlConnectCount, "currentUser":currentUser, changeUser: function(userName) {
	currentUser = userName;
}, getCurrentUser: function() {
	return currentUser;
}, getCurrentAccessToken: function() {
	return currentAccessToken;
}, setCurrentAccessToken: function(accesstoken) {
	currentAccessToken = accesstoken;
}};