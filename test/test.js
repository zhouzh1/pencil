/**
 * test script
 */
const assert = require('assert');
const path = require('path');
const fse = require('fs-extra');
const child_process = require('child_process');
const exec = child_process.execSync;
const spawn = child_process.spawn;

const pencil = path.join(__dirname, '../bin/pencil.js');
const test_help = path.join(__dirname, './test_help.js');

const cwd = process.cwd();
const execOptions = { encoding: 'utf8' };
const commands = ['help', 'init', 'create', 'build', 'update', 'server', 'push'];
let testdir;

describe('Commands:', () => {
	describe('#help_>', () => {
		let actual;
		before(() => {
			actual = exec(`node ${test_help}`, execOptions);
		});

		it('pencil help: should show overall usage message', () => {
			const expected = exec(`node ${pencil} help`, execOptions);
			assert.equal(actual, expected);
		});

		it('pencil help argv_1 argv_2: should show overall usage message', () => {
			const expected = exec(`node ${pencil} help argv_1 argv_2`, execOptions);
			assert.equal(actual, expected);
		});

		it('pencil help non_existing_command: should show overall usage message', () => {
			const expected = exec(`node ${pencil} help non_existing_command`, execOptions);
			assert(actual, expected);
		});

		commands.forEach((command) => {
			it(`pencil help ${command}: should show usage message of command ${command}`, () => {
				const actual = exec(`node ${test_help} ${command}`, execOptions);
				const expected = exec(`node ${pencil} help ${command}`, execOptions);
				assert(actual, expected);
			});
		});
	});

	describe('#init_>', () => {
		let actual;
		before(() => {
			actual = exec(`node ${test_help} init`, execOptions);
		});

		it('pencil init: should show usage message', () => {
			const expected = exec(`node ${pencil} init`, execOptions);
			assert.equal(actual, expected);
		});

		it('pencil init argv_1 argv_2: should show usage message', () => {
			const expected = exec(`node ${pencil} init path_1 path_2`, execOptions);
			assert.equal(actual, expected);
		});

		it('pencil init non_empty_dir: should show error message', () => {
			const non_empty_dir = path.join(cwd, fse.mkdtempSync('non_empty_'));
			const test_file = path.join(non_empty_dir, './test.txt');
			fse.ensureFileSync(test_file);
			fse.writeFileSync(test_file, 'test', 'utf8');
			const stdout = exec(`node ${pencil} init ${non_empty_dir}`, execOptions);
			fse.removeSync(non_empty_dir);
			assert.ok(stdout.includes(' [ERROR] ') || console.log(stdout));
		});

		it('pencil init empty_dir: should show success message', () => {
			const empty_dir = path.join(cwd, fse.mkdtempSync('empty_'));
			const stdout = exec(`node ${pencil} init ${empty_dir}`, execOptions);
			fse.removeSync(empty_dir);
			assert.ok(stdout.includes(' [INFO] ') || console.log(stdout));
		});
	});

	describe('#create_>', () => {
		let actual;
		before(() => {
			actual = exec(`node ${test_help} create`, execOptions);
			testdir = fse.mkdtempSync('test_');
			exec(`node ${pencil} init ${testdir}`, execOptions);
			process.chdir(testdir);
		});

		it('pencil create: should show usage message', () => {
			const expected = exec(`node ${pencil} create`, execOptions);
			assert.equal(actual, expected);
		});
		it('pencil create argv_1 argv_2 argv_3: should show usage message', () => {
			const expected = exec(`node ${pencil} create argv_1 argv_2 argv_3`, execOptions);
			assert.equal(actual, expected);
		});
		it('pencil create incorrect_type title: should show usage message', () => {
			const expected = exec(`node ${pencil} create incorrect_type title`, execOptions);
			assert.equal(actual, expected);
		});
		it('pencil create hello: should create a article draft whose title is hello', () => {
			const stdout = exec(`node ${pencil} create hello`, execOptions);
			const exists = fse.existsSync('./source/draft/article/hello.md');
			assert.ok(exists || console.log(stdout));
		});
		it('pencil create article world: should create a article draft whose title is world', () => {
			const stdout = exec(`node ${pencil} create article world`, execOptions);
			const exists = fse.existsSync('./source/draft/article/world.md');
			assert.ok(exists || console.log(stdout));
		});
		it('pencil create page doc: should create a page draft whose title is doc', () => {
			const stdout = exec(`node ${pencil} create page doc`, execOptions);
			const exists = fse.existsSync('./source/draft/page/doc.md');
			assert.ok(exists || console.log(stdout));
		});
	});

	describe('#publish_>', () => {
		let actual;
		before(() => {
			actual = exec(`node ${test_help} publish`, execOptions);
		});

		it('pencil publish: should show usage message', () => {
			const expected = exec(`node ${pencil} publish`, execOptions);
			assert.equal(actual, expected);
		});

		it('pencil publish argv_1 argv_2 argv_3: should show usage message', () => {
			const expected = exec(`node ${pencil} publish argv_1 argv_2 argv_3`, execOptions);
			assert.equal(actual, expected);
		});

		it('pencil publish incorrect_type title: should show usage message', () => {
			const expected = exec(`node ${pencil} publish incorrect_type title`, execOptions);
			assert.equal(actual, expected);
		});

		it('pencil publish hello: should publish a article whose title is hello', () => {
			fse.appendFileSync('./source/draft/article/hello.md', '# hello', 'utf8');
			const stdout = exec(`node ${pencil} publish hello`, execOptions);
			const draftExists = fse.existsSync('./source/draft/article/hello.md');
			const sourceExists = fse.existsSync('./source/article/hello.md');
			assert.ok((!draftExists && sourceExists) || console.log(stdout));
		});

		it('pencil publish article world: should publish a article whose title is world', () => {
			const draft = './source/draft/article/world.md';
			let content = fse.readFileSync(draft, 'utf8');
			fse.outputFileSync(draft, content.replace('filename:', 'filename: test world'));
			fse.appendFileSync(draft, '# world', 'utf8');
			const stdout = exec(`node ${pencil} publish article world`, execOptions);
			const draftExists = fse.existsSync(draft);
			const sourceExists = fse.existsSync('./source/article/hello.md');
			assert.ok((!draftExists && sourceExists) || console.log(stdout));
		});

		it('pencil publish page doc: should publish a page whose title is doc', () => {
			fse.appendFileSync('./source/draft/page/doc.md', '# document', 'utf8');
			const stdout = exec(`node ${pencil} publish page doc`, execOptions);
			const draftExists = fse.existsSync('./source/draft/page/doc.md');
			const sourceExists = fse.existsSync('./source/page/doc.md');
			assert.ok((!draftExists && sourceExists) || console.log(stdout));
		});
	});

	describe('#generate_>', () => {
		let actual;
		before(() => {
			actual = exec(`node ${test_help} generate`);
		});

		it('pencil generate argv_1: should show usage message', () => {
			const expected = exec(`node ${pencil} generate argv_1`, execOptions);
			assert.equal(actual, expected);
		});

		it('pencil generate: should generate all static pages', () => {
			const stdout = exec(`node ${pencil} generate`, execOptions);
			const existsHello = fse.existsSync('./public/article/hello.html');
			const existsWorld = fse.existsSync('./public/article/test_world.html');
			const existsDoc = fse.existsSync('./public/page/doc.html');
			const existsIndex = fse.existsSync('./public/index.html');
			assert.ok((existsHello && existsWorld && existsDoc && existsIndex) || console.log(stdout));
		});
	});

	describe('#server_>', () => {
		let actual;
		before(() => {
			actual = exec(`node ${test_help} server`, execOptions);
		});

		it('pencil server argv_1 argv_2: should show usage message', () => {
			const expected = exec(`node ${pencil} server argv_1 argv_2`, execOptions);
			assert.equal(actual, expected);
		});

		it('pencil server: should start a static server listening on port 3000', () => {
			const server = spawn('node', [pencil, 'server']);
			let stdout;
			server.stdout.on('data', (data) => {
				stdout = data;
				process.kill(server.pid);
			});
			assert.ok(stdout.includes(' [INFO] ') || console.log(stdout));
		});

		it('pencil server 8888: should start a static server listening on port 8888', () => {
			const server = spawn('node', [pencil, 'server', 8888]);
			let stdout;
			server.stdout.on('data', (data) => {
				stdout = data;
				process.kill(server.pid);
			});
			assert.ok(stdout.includes(' [INFO] ') || console.log(stdout));
		});

		it('pencil server invalid_port: should show error message', () => {
			const server = spawn('node', [pencil, 'server', 'invalid_port']);
			let stdout;
			server.stdout.on('data', (data) => {
				stdout = data;
				process.kill(server.pid);
			});
			assert.ok(stdout.includes(' [ERROR] ') || console.log(stdout));
		});
	});

	after(() => {
		const cwd = process.cwd();
		if (path.parse(cwd).base === testdir) {
			process.chdir('../');
			fse.removeSync(testdir);
		}
	});
});

