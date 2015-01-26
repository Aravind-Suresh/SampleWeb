var error = {};

error.ERR_DESCRIPTION = {
	"420":"Insufficient parameters passed",
	"210":"User already exists",
	"909":"Permission denied",
	"305":"User not registered",
	"101":"Choose a file to upload",
};

error.err = function( res, code, desc ){
	res.end(JSON.stringify(
		{ result:false, err:{ code:code, description: ( desc || error.ERR_DESCRIPTION[code] || "No description" ) } }
		));
}

error.err_insuff_params = function( res, req,  arr ) {
	var errobj = { params:[] };
	for(var i=0;i<arr.length;i++) {
		param = arr[i];
		if( !(req.query[param]) )
			errobj.params.push(param);
	}

	if( errobj.params.length ){
		res.end(JSON.stringify(
			{ result:false, err:{ code:"420", missingParams: errobj.params } }
			));
		return false;
	}

	return true;

}

module.exports = error;
