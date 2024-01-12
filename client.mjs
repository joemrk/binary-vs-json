import axios from 'axios';
import { jsonData } from './json-data.mjs';
import zlib from 'node:zlib';
import util from 'util';

const getBinary = () => {
  return Buffer.from(JSON.stringify(jsonData))
};
const deflateAsync = util.promisify(zlib.deflate);

const sendJson = async () => {
  return await axios.post('http://localhost:3000/json', jsonData, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const sendBinary = async () => {
  const packaged = getBinary();
  return await axios.post('http://localhost:3000/binary', packaged, {
    headers: {
      'Content-Type': 'application/msgpack'
    }
  })
}

const sendFlate = async () => {
  const jsonString = JSON.stringify(jsonData);
  const deflate = await deflateAsync(jsonString)
  return await axios.post('http://localhost:3000/flate', deflate, {
    headers: {
      'Content-Type': 'application/msgpack'
    }
  })
}

;(async () => {
  console.time('json')
  const jsonResult = await sendJson();
  console.timeEnd('json')
  console.log(jsonResult.data);

  console.time('binary')
  const binaryResult = await sendBinary();
  console.timeEnd('binary')
  console.log(binaryResult.data);

  console.time('deflate')
  const flateResult = await sendFlate();
  console.timeEnd('deflate')
  console.log(flateResult.data);
})();