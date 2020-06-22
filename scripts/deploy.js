const { exec } = require("child_process");
const fs = require('fs');

let package = JSON.parse(fs.readFileSync('package.json'));

let version = package.version.split('.');
version[version.length-1]++;

if (version[version.length-1] == '100')
{
	version[version.length-1] = 0;
	version[version.length-2]++;
}

package.version = version.join('.');

fs.writeFileSync('package.json', JSON.stringify(package, null, '    '));

function run (command)
{
	return new Promise ((resolve, reject) =>
	{
		console.log('\x1B[32m * ' + command + '\x1B[0m');
		exec(command, (err, stdout) =>
		{
			if (stdout)
				console.log(stdout);

			if (err) {
				console.log('\x1B[31m Error: ' + err + '\x1B[0m');
				reject(err);
				return;
			}

			resolve();
		});
	});
};


run('svn-msg "Published: v'+package.version+'"')
.then(r => run('git add .'))
.then(r => run('git commit -F .svn\\messages.log'))
.then(r => run('git push'))
.then(r => run('git tag v' + package.version))
.then(r => run('git push origin refs/tags/v'+package.version))

.then(() => {
	console.log();
	console.log('\x1B[93m * Published: '+package.version+'.\x1B[0m');
});
