/**
 * delete command
 */

if (process.argv[2] === 'help') {
	help();
	process.exit();
}

const checkroot = require('../lib/checkroot');
checkroot.check();

const fse = require('fs-extra');
const yaml = require('js-yaml');
const repl = require('repl');
const logger = require('../lib/logger');
const EOL = require('os').EOL;

const frontmatterRegExp = /^-{3}\n([\s\S]+?)\n-{3}/;

function help() {
	console.log('Usage: pencil delete <type> <title>');
	console.log('  Description:');
	console.log('    delete drafts, articles and pages');
	console.log('  Arguments:');
	console.log("     <type>  one of ['draft-article', 'draft-page', 'article', 'page']");
	console.log('    <title>  title of item');
}

function eval(cmd, context, filename, callback) {
	if (cmd === `yes${EOL}`) {
		// input 'yes', delete
		fse.removeSync(context.markdown);
		console.log('[+] successfully!');
		// if exist html file, remove it and re-generate
		let html = context.html;
		if (html && fse.existsSync(html)) {
			console.log('[+] generate site again...');
			require('./generate').runner([]);
		}
		process.exit();
	}
	else if (cmd === `no${EOL}`) {
		// input 'no', exit
		process.exit();
	}
	else {
		callback();
	}
}

function remove(type, title) {
	// check if exist such article or page
	let fragments = type.split('-');
	let markdown = `./source/${fragments.join('/')}/${title.split(' ').join('-')}.md`;
	let html = null;
	if (!fse.existsSync(markdown)) {
		logger.error(`no such ${fragments.reverse().join(' ')}: ${title}`);
		process.exit();
	}
	else if (fragments[0] !== 'draft') {
		// get path of html file
		let source = fse.readFileSync(markdown, 'utf8');
		let frontmatter = yaml.safeLoad(frontmatterRegExp.exec(source)[1]);
		let filename = (frontmatter.filename || frontmatter.title).split(' ').join('-');
		html = `./public/${type}/${filename}.html`;
	}
	let options = {
		prompt: 'Could not restore, sure? (yes or no)',
		eval: eval
	};
	// wait to confirm
	let r = repl.start(options);
	r.context.markdown = markdown;
	r.context.html = html;
}

function runner(argvs) {
	if (argvs.length !== 2) {
		help();
	}
	else {
		let type = argvs[0];
		let title = argvs[1];
		switch(type) {
			case 'draft-article':
			case 'darft-page':
			case 'article':
			case 'page':
				remove(type, title);
				break;
			default:
				help();
				break;
		} 
	}
}

module.exports = { help, runner };