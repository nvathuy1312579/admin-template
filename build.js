const cp = require('child_process');
const fs = require('fs');
const pkg = require('./package.json');

const stage = process.env.BUILD_ENV || 'prod';

const writeFile = (file, contents) =>
  new Promise((resolve, reject) => {
    fs.writeFile(file, contents, 'utf8', err => (err ? reject(err) : resolve()));
  });

const spawn = (command, args, options) =>
  new Promise((resolve, reject) => {
    cp.spawn(command, args, options).on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} => ${code} (error)`));
      }
    });
  });

function compress() {
  const tar = require('tar');
  return tar.c(
    {
      gzip: true,
      file: `${pkg.name}-v${pkg.version}.tgz`,
    },
    ['client/build', 'node_modules', `config/`, 'server.js', 'package.json'],
  );
}

function writeFilePackage() {
  return writeFile(
    'package.json',
    JSON.stringify(
      {
        name: pkg.name,
        author: pkg.author,
        version: pkg.version,
        private: true,
        dependencies: pkg.dependencies,
        scripts: {
          start: `NODE_ENV=production BUILD_ENV=${stage} node server.js`,
        },
      },
      null,
      2,
    ),
  );
}

async function build() {
  try {
    console.log(new Date(), 'Start Build...');
    await writeFilePackage();
    console.log(new Date(), 'Install node_modules');
    // yarn install
    await spawn('yarn');
    // yarn cd client yarn install
    await spawn('yarn', [], { cwd: 'client' });
    console.log(new Date(), 'Build client');

    // yarn cd client yarn build:prod
    await spawn('yarn', ['build'], {
      cwd: 'client',
      env: { ...process.env, REACT_APP_STAGE: stage },
    });

    // yarn build client
    console.log(new Date(), 'Compress project');
    await compress();
    console.log(new Date(), 'Build Succeeded!');
  } catch (error) {
    console.log(new Date(), 'Build Error!', error);
  }
}

build();
