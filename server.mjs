import express from "express";
import zlib from 'node:zlib';
import util from 'util';

const PORT = 3000;
const inflateAsync = util.promisify(zlib.inflate);

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.raw({ limit: '1mb', type: 'application/msgpack' }));

const router = express.Router();

router.post('/binary', async (req, res) => {
  console.log('binary');

  const { body } = req;
  if(!body) {
    return;
  }
  const start = Date.now();
  const parsed = JSON.parse(body.toString());
  // console.log(parsed);

  res.send({ 
    unpackTime: Date.now() - start,
    size: req.headers['content-length'],
  });
})

router.post('/json', async (req, res) => {
  console.log('json');
  const { body } = req;
  if(!body) {
    return;
  }

  res.send({ size: req.headers['content-length'] });
  return;
})

router.post('/flate', async (req, res) => {
  console.log('flate');
  const { body } = req;
  if(!body) {
    return;
  }
  const start = Date.now();
  const decoded = (await inflateAsync(body)).toString();
  const parsed = JSON.parse(decoded);
  // console.log(parsed);
  res.send({ unpackTime: Date.now() - start, size: req.headers['content-length'] });
  return;
})
app.use(router)

app.listen(PORT, () => {
  console.log(`http:localhost:${PORT}`);
})