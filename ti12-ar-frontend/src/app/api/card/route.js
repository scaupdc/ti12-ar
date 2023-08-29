import { NextResponse } from 'next/server'
const Bull = require('bull')

import { createClient } from 'redis';



export async function POST(request) {
  const bodyJson = await request.json()
  // console.log(bodyJson)

  //将数据发到MQ
  const client = createClient({
    url: 'redis://default:next@10.55.134.36:6379'
  });

  client.on('error', err => console.log('Redis Client Error', err))
  await client.connect();

  const value = await client.lPush('card', JSON.stringify(bodyJson))
  console.log("pushed")

  await client.disconnect();

  console.log("dis")


  // const queue = new Bull('queue', { redis: { port: 6379, host: '10.55.134.36', password: '' } }); // Specify Redis connection using object
  // queue.add(bodyJson);

  return NextResponse.json({ a: "hello" })
}