const axios = require('axios');
const sharp = require('sharp');

module.exports = async function (url, imageName, arraybuffer) {

  const original = '/images-catalog/' + imageName + '.jpg';
  if (url) {
    await axios({
      method: 'get',
      url: url,
      responseType: 'arraybuffer'
    })
      .then(async function ({ data: imageBuffer }) {
        console.log(__dirname)
        await sharp(imageBuffer)
            .resize(1280, 1280, {
              kernel: sharp.kernel.nearest,
              fit: 'inside'
            })
            .jpeg({ quality: 80 })
            .toFile(__dirname.replace('helpers', 'public') + original)
            .then(info => { console.info('img save') });

          return { status: 'success' }

        }).catch((e) => { console.error(e); return { status: 'fail', error: 'error' } })
  }
  if (arraybuffer) {

    sharp(arraybuffer)
      .resize(1600, 1600, {
        kernel: sharp.kernel.nearest,
        fit: 'inside'
      })
      .jpeg({ quality: 80 })
      .toFile(__dirname.replace('helpers', 'public') + original)
      .then(info => { console.info(info) });
  }
  return { original }
};
