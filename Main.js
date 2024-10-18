const http = require('http');
const { program } = require('commander');

program
  .requiredOption('-h, --host <host>', 'Server host')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-c, --cache <path>', 'Cache directory');

program.parse(process.argv);

const { host, port, cache } = program.opts();

const fs = require('fs');
if (!fs.existsSync(cache)) {
  console.error(`Error: Cache directory "${cache}" does not exist.`);
  process.exit(1);
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
  console.log(`Cache directory: ${cache}`);
});
