const path = require('path');
const execa = require('execa');
const chalk = require('chalk').default;
const portfinder = require('portfinder');

module.exports = function(bundler) {
  // we only want to run if we're in watch mode and target is set to node
  if (bundler.options.watch !== true || bundler.options.target !== 'node') return;

  const { outDir, outFile } = bundler.options;

  let server;
  let starting = false;

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', data => {
    if (data.trim() === 'rs') {
      restartServer();
    }
  });

  bundler.on('buildEnd', restartServer);

  function restartServer() {
    if (starting) {
      return;
    }
    starting = true;
    if (server) {
      console.log(chalk.magenta.bold(`🚽 Killing running server`));
      server.once('exit', () => {
        console.log(chalk.magenta.bold(`🚽 Running server successfully killed`));
        startServer();
      });
      process.kill(server.pid);
      return;
    }
    startServer();
  }

  async function startServer() {
    if (server) {
      throw new Error('trying to start a server when one is already running');
    }
    const entryPoint = path.join(outDir, outFile);
    const inspectPort = await portfinder.getPortPromise({ port: 9229, stopPort: 9239 });
    console.log(chalk.magenta.bold(`🚽 Starting server at: \`node ${entryPoint}\``));
    server = execa('node', [`--inspect=${inspectPort}`, entryPoint]);
    console.log(chalk.magenta.bold(`🚽 Started server: PID ${server.pid}`));
    server.once('exit', () => {
      server = undefined;
    });
    server.stdout.pipe(process.stdout);
    server.stderr.pipe(process.stderr);
    starting = false;
  }
};
