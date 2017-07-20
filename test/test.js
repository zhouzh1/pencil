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
const commands = ['help', 'init', 'create', 'publish', 'generate', 'server', 'push'];
let testdir;

describe('Commands:', () => {
	describe('#help_>', () => {
		let expected;
		before(() => {
			expected = exec(`node ${test_help}`, execOptions);
		});

		it('pencil help: should show overall usage message', () => {
			const actual = exec(`node ${pencil} help`, execOptions);
			assert.equal(expected, actual);
		});

		it('pencil help argv_1 argv_2: should show overall usage message', () => {
			const actual = exec(`node ${pencil} help argv_1 argv_2`, execOptions);
			assert.equal(expected, actual);
		});

		it('pencil help non_existing_command: should show overall usage message', () => {
			const actual = exec(`node ${pencil} help non_existing_command`, execOptions);
			assert(expected, actual);
		});

		commands.forEach((command) => {
			it(`pencil help ${command}: should show usage message of command ${command}`, () => {
				const expected = exec(`node ${test_help} ${command}`, execOptions);
				const actual = exec(`node ${pencil} help ${command}`, execOptions);
				assert(expected, actual);
			});
		});
	});

	describe('#init_>', () => {
		let expected;
		before(() => {
			expected = exec(`node ${test_help} init`, execOptions);
		});

		it('pencil init: should show usage message', () => {
			const actual = exec(`node ${pencil} init`, execOptions);
			assert.equal(expected, actual);
		});

		it('pencil init argv_1 argv_2: should show usage message', () => {
			const actual = exec(`node ${pencil} init path_1 path_2`, execOptions);
			assert.equal(expected, actual);
		});

		it('pencil init non_empty_dir: should show error message', () => {
			const non_empty_dir = path.join(cwd, fse.mkdtempSync('non_empty_'));
			const test_file = path.join(non_empty_dir, './test.txt');
			fse.outputFileSync(test_file, 'test');
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
		let expected;
		before(() => {
			testdir = fse.mkdtempSync('test_');
			exec(`node ${pencil} init ${testdir}`, execOptions);
			process.chdir(testdir);
			expected = exec(`node ${test_help} create`, execOptions);
		});

		it('pencil create: should show usage message', () => {
			const actual = exec(`node ${pencil} create`, execOptions);
			assert.equal(expected, actual);
		});
		it('pencil create argv_1 argv_2 argv_3: should show usage message', () => {
			const actual = exec(`node ${pencil} create argv_1 argv_2 argv_3`, execOptions);
			assert.equal(expected, actual);
		});
		it('pencil create incorrect_type title: should show usage message', () => {
			const actual = exec(`node ${pencil} create incorrect_type title`, execOptions);
			assert.equal(expected, actual);
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
		let expected;
		before(() => {
			expected = exec(`node ${test_help} publish`, execOptions);
		});

		it('pencil publish: should show usage message', () => {
			const actual = exec(`node ${pencil} publish`, execOptions);
			assert.equal(expected, actual);
		});

		it('pencil publish argv_1 argv_2 argv_3: should show usage message', () => {
			const actual = exec(`node ${pencil} publish argv_1 argv_2 argv_3`, execOptions);
			assert.equal(expected, actual);
		});

		it('pencil publish incorrect_type title: should show usage message', () => {
			const actual = exec(`node ${pencil} publish incorrect_type title`, execOptions);
			assert.equal(expected, actual);
		});

		it('pencil publish hello: should publish a article whose title is hello', () => {
			fse.appendFileSync('./source/draft/article/hello.md', '\n# hello', 'utf8');
			const stdout = exec(`node ${pencil} publish hello`, execOptions);
			const draftExists = fse.existsSync('./source/draft/article/hello.md');
			const sourceExists = fse.existsSync('./source/article/hello.md');
			assert.ok((!draftExists && sourceExists) || console.log(stdout));
		});

		it('pencil publish article world: should publish a article whose title is world', () => {
			const draft = './source/draft/article/world.md';
			let content = fse.readFileSync(draft, 'utf8');
			fse.outputFileSync(draft, content.replace('filename:', 'filename: test world'));
			fse.appendFileSync(draft, '\n# world', 'utf8');
			const stdout = exec(`node ${pencil} publish article world`, execOptions);
			const draftExists = fse.existsSync(draft);
			const sourceExists = fse.existsSync('./source/article/hello.md');
			assert.ok((!draftExists && sourceExists) || console.log(stdout));
		});

		it('pencil publish page doc: should publish a page whose title is doc', () => {
			fse.appendFileSync('./source/draft/page/doc.md', '\n# document', 'utf8');
			const stdout = exec(`node ${pencil} publish page doc`, execOptions);
			const draftExists = fse.existsSync('./source/draft/page/doc.md');
			const sourceExists = fse.existsSync('./source/page/doc.md');
			assert.ok((!draftExists && sourceExists) || console.log(stdout));
		});
	});

	describe('#generate_>', () => {
		let expected;
		before(() => {
			expected = exec(`node ${test_help} generate`);
		});

		it('pencil generate argv_1: should show usage message', () => {
			const actual = exec(`node ${pencil} generate argv_1`, execOptions);
			assert.equal(expected, actual);
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
		let expected;
		before(() => {
			expected = exec(`node ${test_help} server`, execOptions);
		});

		it('pencil server argv_1 argv_2: should show usage message', () => {
			const actual = exec(`node ${pencil} server argv_1 argv_2`, execOptions);
			assert.equal(expected, actual);
		});

		it('pencil server: should start a static server listening on port 3000', () => {
			const server = spawn('node', [pencil, 'server']);
			server.stdout.on('data', (data) => {
				process.kill(server.pid);
				assert.ok(data.includes(' [INFO] ') || console.log(data));
			});
		});

		it('pencil server 8888: should start a static server listening on port 8888', () => {
			const server = spawn('node', [pencil, 'server', 8888]);
			server.stdout.on('data', (data) => {
				process.kill(server.pid);
				assert.ok(data.includes(' [INFO] ') || console.log(data));
			});
		});

		it('pencil server invalid_port: should show error message', () => {
			const server = spawn('node', [pencil, 'server', 'invalid_port']);
			server.stdout.on('data', (data) => {
				process.kill(server.pid);
				assert.ok(data.includes(' [ERROR] ') || console.log(data));
			});
		});
	});

	after(() => {
		const cwd = process.cwd();
		if (path.parse(cwd).base === testdir) {
			process.chdir('../');
			fse.removeSync(cwd);
		}
	});
});

