const path = require('path')
const redis = require('redis')
const fs = require('fs')

function createFolders() {
    fs.mkdirSync('D:\\ti12ar\\0', { recursive: true })
    fs.mkdirSync('D:\\ti12ar\\1', { recursive: true })
    fs.mkdirSync('D:\\ti12ar\\2', { recursive: true })
    fs.mkdirSync('D:\\ti12ar\\3', { recursive: true })
    fs.mkdirSync('D:\\ti12ar\\4', { recursive: true })
    fs.mkdirSync('D:\\ti12ar\\5', { recursive: true })
}

async function listenRedis() {
    const client = redis.createClient({
        url: 'redis://default:next@192.168.2.39:6379'
    });

    client.on('error', err => console.log('Redis Client Error', err))

    await client.connect();

    while (true) {
        const val = await client.brPop('card', 0)
        const { target, card } = JSON.parse(val.element)
        const base64 = card.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
        const fileName = Date.now() + '.png'
        const buff = Buffer.from(base64, 'base64')
        fs.writeFileSync('D:\\ti12ar\\' + target + '\\' + fileName, buff)
    }
}

createFolders()
listenRedis()