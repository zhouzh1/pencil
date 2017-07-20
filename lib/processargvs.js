/**
 * process command arguments
 */

/**
 * extract type and title from command arguments
 * @param  {[Array]}    argvs   [command arguments]
 * @param  {[Function]} help    [help function]
 * @return {[Object]}           [type and title]
 */
module.exports = function (argvs, help) {
	var types = ['article', 'page'];
	var type, title;
	if (argvs.length == 1) {
		type = 'article';
		title = argvs[0];
	}
	else if (argvs.length == 2) {
		type = argvs[0];
		title = argvs[1];
		if (types.indexOf(type) === -1) {
			help();
			process.exit();
		}
	}
	else {
		help();
		process.exit();
	}
	return { type, title };
};