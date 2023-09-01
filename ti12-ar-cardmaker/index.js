const path = require('path')
const redis = require('redis')
const fs = require('fs')

const home = require('os').homedir()
const mainFolder = path.join(home, 'ti12ar')

function createFolders() {
    fs.mkdirSync(path.join(mainFolder, '0'), { recursive: true })
    fs.mkdirSync(path.join(mainFolder, '1'), { recursive: true })
    fs.mkdirSync(path.join(mainFolder, '2'), { recursive: true })
    fs.mkdirSync(path.join(mainFolder, '3'), { recursive: true })
    fs.mkdirSync(path.join(mainFolder, '4'), { recursive: true })
    fs.mkdirSync(path.join(mainFolder, '5'), { recursive: true })
}

async function initRedis() {
    // const client = redis.createClient({
    //     url: 'redis://default:next@192.168.2.39:6379'
    // })

    const client = redis.createClient()

    client.on('error', err => console.log('Redis Client Error' + err))

    console.log('begin connect')
    client.connect();
    console.log('connect succ')

    //从文件系统中重建redis list缓存
    // const mainFolder = path.resolve('D:\\ti12ar')
    // const fullMainFolder = path.resolve(mainFolder)
    const subFiles = fs.readdirSync(mainFolder)
    console.log(subFiles)
    subFiles.forEach((subFile) => {
        const subFilePath = path.join(mainFolder, subFile)
        const subFileStat = fs.statSync(subFilePath)
        if (subFileStat.isDirectory()) {
            //先删除旧的redis list
            const key = 'TARGET:' + subFile
            console.log(key)
            client.del(key)
            console.log('del ok')
            //遍历图片
            const subImages = fs.readdirSync(subFilePath)
            const redisValues = []
            subImages.forEach((subImage) => {
                redisValues.push(subImage)
            })
            console.log(redisValues)
            console.log(key)
            if (redisValues.length > 0) {
                console.log('rpush')
                //批量写入redis list
                client.rPush(key, redisValues)
                console.log('done')
            }
        }
    })

    //侦听消息队列中的卡片制作任务
    while (true) {
        console.log('while')
        const val = await client.brPop('CARD', 0)
        console.log('block')
        if (val) {
            const { target, card } = JSON.parse(val.element)
            const base64 = card.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
            console.log('query len')
            const len = await client.lLen('TARGET:' + target)
            const fileName = target + '_' + len + '.png'
            console.log('file save:' + fileName)
            const buff = Buffer.from(base64, 'base64')
            fs.writeFileSync(path.join(mainFolder, target, fileName), buff)
            client.rPush('TARGET:' + target, fileName)
            console.log('file rpush')
        }
    }
}

createFolders()
initRedis()