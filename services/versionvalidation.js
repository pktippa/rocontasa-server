var versions = require('../config/versions');

var validateVersion = function(platform, inputversion){
  var configuredVersion = versions[platform];
  var isValid = false;
  // TODO Semver x.y.z check with > < =  support
  if(inputVersion === configuredVersion)
    isValid = true;
  return isValid;
};

module.exports = {
  validateVersion: validateVersion
};