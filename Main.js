const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const { program } = require('commander');

program
  .requiredOption('-h, --host <host>', 'server host')
  .requiredOption('-p, --port <port>', 'server port')
  .requiredOption('-c, --cache <cache>', 'cache directory');

program.parse(process.argv);

const options = program.opts();
const cacheDir = path.join(__dirname, options.cache);

const server = http.createServer(async (req, res) => {
  const url = req.url;
  const method = req.method;
  const statusCode = parseInt(url.slice(1)); 
  const filePath = path.join(cacheDir, `${statusCode}.jpg`);

  // Обробка GET запиту
  if (method === 'GET') {
    try {
      await fs.access(filePath);
      const image = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(image);
    } catch (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } 
  // Обробка PUT запиту
  else if (method === 'PUT') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', async () => {
      const imageBuffer = Buffer.concat(chunks);
      try {
        await fs.writeFile(filePath, imageBuffer);
        res.writeHead(201, { 'Content-Type': 'text/plain' });
        res.end('Created');
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    });
  } 
  else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
  }
});

server.listen(options.port, options.host, () => {
  console.log(`Server running at http://${options.host}:${options.port}/`);
});
