
// libraries
const admin = require("firebase-admin");
const { format } = require('util')

// keys
const serviceAccount = require('../keys/serviceAccountKey.json');

//initialize firebase inorder to access its services
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://cllws-2ab94.appspot.com"
});

// create ref to default bucket
const bucket = admin.storage().bucket();

/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */
const uploadImg = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject('No image file');
      }
      let newFileName = `${Date.now()}_${file.originalname}`;
  
      let fileUpload = bucket.file(newFileName);
  
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype
        }
      });
  
      blobStream.on('error', (error) => {
          console.log(error)
        reject('Something is wrong! Unable to upload at the moment.');
      });
  
      blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
        resolve(url);
      });
  
      blobStream.end(file.buffer);
    });
}

// /**
//  * Upload the image file to Google Storage
//  * @param {File} file object that will be uploaded to Google Storage
//  */
// const downloadImg = (file) => {
//     return new Promise((resolve, reject) => {
//       if (!file) {
//         reject('No image file');
//       }
//       let newFileName = `${Date.now()}_${file.originalname}`;
  
//       let fileUpload = bucket.file(newFileName);
  
//       const blobStream = fileUpload.createWriteStream({
//         metadata: {
//           contentType: file.mimetype
//         }
//       });
  
//       blobStream.on('error', (error) => {
//           console.log(error)
//         reject('Something is wrong! Unable to upload at the moment.');
//       });
  
//       blobStream.on('finish', () => {
//         // The public URL can be used to directly access the file via HTTP.
//         const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
//         resolve(url);
//       });
  
//       blobStream.end(file.buffer);
//     });
// }

// export bucket
module.exports = uploadImg;

// https://storage.googleapis.com/cllws-2ab94.appspot.com/1595533451707_DSC04298.jpg