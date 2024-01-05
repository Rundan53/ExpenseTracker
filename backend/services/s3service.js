const AWS = require('aws-sdk');

const uploadToS3 = (data, fileName)=> {
    const s3Key = process.env.IAM_USER_KEY;
    const s3Secret = process.env.IAM_USER_SECRET;
    const bucketName = process.env.S3_BUCKET_NAME;

    const s3bucket = new AWS.S3({
        accessKeyId: s3Key,
        secretAccessKey: s3Secret,
    });

    var params = {
        Bucket: bucketName,
        Key: fileName,
        Body: data,
        ACL: 'public-read'
    };

    return new Promise((resolve, reject)=> {
        s3bucket.upload(params, (err, s3Resposne) => {
            if (err) {
                console.log(err);
                reject(err);
            }
    
            console.log('>>>Success', s3Resposne);
            resolve(s3Resposne.Location);
        })
    
    })
   
}


module.exports = {
    uploadToS3
}