import { NextResponse } from 'next/server'
import { createClient } from 'redis';
import JsonResp from '../json_resp';

export async function POST(request) {
  const bodyJson = await request.json()

  // const client = createClient({
  //   url: 'redis://default:next@192.168.2.39:6379'
  // })

  const client = await createClient()

  client.on('error', err => console.log('Redis Client Error' + err))

  console.log('start connect redis')
  await client.connect()
  console.log('redis connected')
  
  await client.lPush('CARD', JSON.stringify(bodyJson))
  console.log('lpush CARD succ')

  await client.disconnect()

  return NextResponse.json(new JsonResp(200, '发送成功', null))
}