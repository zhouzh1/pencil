/**
 * process the argvs for commands
 */

/**
 * process the argvs for commands, get correct type and title
 * @param  {[Array]} argvs [argvs for commands]
 * @param  {[Function]} help    [help function for commands]
 * @return {[Object]}         [including corerct type and title]
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
		if (types.indexOf(type) == -1) {
			help();
			process.exit(0);
		}
	}
	else {
		help();
		process.exit(0);
	}
	return {type, title};
};