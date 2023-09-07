import { NextResponse } from 'next/server'
import { createClient } from 'redis';
import JsonResp from '../../json_resp';

export async function POST(request) {

  // const client = createClient({
  //   url: 'redis://default:next@192.168.2.39:6379'
  // })

  const client = await createClient()

  client.on('error', err => console.log('Redis Client Error' + err))

  console.log('start connect redis')
  await client.connect()
  console.log('redis connected')
  
  const data = []
  data.push(await client.lLen('TARGET:0'))
  data.push(await client.lLen('TARGET:1'))
  data.push(await client.lLen('TARGET:2'))
  data.push(await client.lLen('TARGET:3'))
  data.push(await client.lLen('TARGET:4'))
  data.push(await client.lLen('TARGET:5'))

  console.log('lLen succ')

  await client.disconnect()

  return NextResponse.json(new JsonResp(200, '查询成功', data))
}