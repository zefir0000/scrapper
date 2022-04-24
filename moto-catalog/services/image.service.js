const axios = require('axios');
const sharp = require('sharp');

exports.factoryLogo = async (url, imageName) => {
  console.log(imageName , ' afgdshfashdg')

  const original = '/assets/images/logosy/' + imageName.replace('/','-') + '.jpg';
  await axios({
    method: 'get',
    url: url,
    responseType: 'arraybuffer'
  })
    .then(async function ({ data: imageBuffer }) {

      await sharp(imageBuffer)
        .resize(600, 600, {
          kernel: sharp.kernel.nearest,
          fit: 'inside'
        })
        .jpeg({ quality: 80 })
        .toFile(__dirname.replace('services', 'public') + original)
        .then(info => { console.info('img save') });

      return { status: 'success' }

    }).catch((e) => { console.error(e); return { status: 'fail', error: 'error' } })
  return { original }
};
