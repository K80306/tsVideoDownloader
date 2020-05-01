
const https = require('https');
const http = require('http');
const fs = require('fs');

// var url = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';
//var url = 'https://112vod-adaptive.akamaized.net/exp=1587420475~acl=%2F058ba3de-8c94-4bf3-a378-8361f654dbe7%2F%2A~hmac=4a2e4de3ecf2657be717b99539e181d2538eb2ca006784ca315eefccb2b796d3/058ba3de-8c94-4bf3-a378-8361f654dbe7/video/a9fecbda/chop/segment-'
// var url = 'https://skyfire.vimeocdn.com/1587513816-0x00d86b50ed673cb753e01c9616fd9544bfe1535b/e9246377-76cd-4a57-9c35-4cff3da8cad3/video/c3edc60a/chop/segment-';
// var url = 'https://skyfire.vimeocdn.com/1587689529-0x4a393067b64883dde15a55a13b5f4934041edf4f/73a8a958-2d2a-4eee-a340-dc1a7b49700d/video/ed543fb1/chop/segment-'
// var url = 'https://7vod-adaptive.akamaized.net/exp=1587768748~acl=%2F2c8130a7-315d-4756-960f-051375ca75fe%2F%2A~hmac=c26a39ab298439dd7519fdc04eb692f5640c4caaba40f7a88168de17769bf45f/2c8130a7-315d-4756-960f-051375ca75fe/video/510d212c/chop/segment-'
// var url = 'https://119vod-adaptive.akamaized.net/exp=1587924182~acl=%2F71951b5a-a817-4c8a-8249-5d91e77bbb8e%2F%2A~hmac=2c4b7e855c8612d2d9d9034a518a4e44fbf470e7c3b2a32200a5b472e9ef1a11/71951b5a-a817-4c8a-8249-5d91e77bbb8e/video/ba1ab14f/chop/segment-'
//var url = 'https://skyfire.vimeocdn.com/1588026511-0x6e0912915a20e73cd44512424daaf27ee402a994/ea6d5625-c4b0-4511-8d2d-2e825cece7bf/video/4b503a89/chop/segment-';
// var url= 'https://188vod-adaptive.akamaized.net/exp=1588027812~acl=%2Fcf8f2378-fd70-4acf-9d58-ffeb86fa0c73%2F%2A~hmac=ed189e35a36957c5abc872be3e6884465c54132f3fb91865bb383174aa1a86a8/cf8f2378-fd70-4acf-9d58-ffeb86fa0c73/video/b6f4027e/chop/segment-';
// var url  = 'https://143vod-adaptive.akamaized.net/exp=1588114686~acl=%2Fb95862e6-9bce-4959-990d-90840bff1c8e%2F%2A~hmac=5ab9c8a2e5c0579dea485ae5670ff7969448a01ecc380569c6c1ce2c03eee89c/b95862e6-9bce-4959-990d-90840bff1c8e/video/c70bc593/chop/segment-';
// var url = 'https://skyfire.vimeocdn.com/1588115035-0x6a17ab83e61e6fbca0781f8d40f9bf16a9d4f93d/16e68bb0-9315-4b9f-bb9e-79332982b26b/video/e5ba2441/chop/segment-';
// var url = 'https://14vod-adaptive.akamaized.net/exp=1588115127~acl=%2F7be0308f-64f2-498a-a0ba-f40aad119d55%2F%2A~hmac=6565c6f6ebea29400cdc629f41cc2f8b2edbbd6b1cb10d79fea552e72473cb16/7be0308f-64f2-498a-a0ba-f40aad119d55/video/70fec067/chop/segment-';
// var url = 'https://25vod-adaptive.akamaized.net/exp=1588115228~acl=%2Fec9f73b0-260d-4326-9b86-4425101ddca8%2F%2A~hmac=693128b423ef3efd173f94a57e8a42353d33be014667966e953ace97a254c205/ec9f73b0-260d-4326-9b86-4425101ddca8/video/a1ec4346/chop/segment-';
// var url = 'https://55vod-adaptive.akamaized.net/exp=1588115403~acl=%2F0011b6c4-e69e-4adb-9457-e0975d5175b6%2F%2A~hmac=e3db716fdf72b9461acbba63c706ed1fe0542f1200f90ea6a78b1a3727fb994d/0011b6c4-e69e-4adb-9457-e0975d5175b6/video/f2d18f84/chop/segment-';
// var url = 'https://skyfire.vimeocdn.com/1588115414-0x2a6cfe4c52a445a2413add6d98246288b1b9e138/8fea2be7-7566-4612-8cf5-e93a99e01f08/video/3684a3fc/chop/segment-';
var url = 'https://skyfire.vimeocdn.com/1588115542-0x195e76cf9ddceb34c287e104cb5f3225c86f1cd5/d29935d4-f918-4bed-8f14-69475ba1705d/video/caf7c19b/chop/segment-';

var dir = './Ep9_6/'
const lastChunk = 900;

var currentChunk = 1;

run(currentChunk);

function run(chunk) {
    downloadOne(chunk).then(
        (result) => {
            triggerNext(result);
        });
}

function downloadOne(chunk) {
    console.log('download ' + chunk);
    return new Promise((resolve, reject) => {

        var suffix =  chunk + ".ts";
        var fileName = dir + suffix;
        const file = fs.createWriteStream(fileName);
        const request = https.get(url + suffix, function (response) {
            // console.log(response);
            response.pipe(file);
            // console.log(file);
            resolve(chunk);
        });
    });
}

function triggerNext(chunk) {
    return new Promise((resolve, reject) => {
        resolve(chunk);
    }).then((chunk) => {
        console.log('saved: ' + chunk);
        var nextChunk = chunk + 1;
        var savedFile = dir + chunk + ".ts";
        var savedFileSize = getFilesizeInBytes(savedFile);
        if (nextChunk < lastChunk 
            // && savedFileSize > 1000
            ) {
            run(nextChunk++);
        }
        else {
            console.log('End.. Last file: ' + savedFile + ' File size ' + savedFileSize) }
    });
}

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename)
    var fileSizeInBytes = stats["size"]
    return fileSizeInBytes
}