'use client'

import styles from './page.module.css'
import { font } from './font'
import html2canvas from 'html2canvas'
import { Suspense, useEffect, useRef, useState } from 'react'
import TargetSelector from './target_selector'
import { unstable_batchedUpdates } from 'react-dom'
import GlobalMask from './global_mask'

const ACTION_MAIN_WRITE_CARD = 1
const ACTION_SUB_WRITE_CARD_INIT = 10
const ACTION_SUB_SEND_CARD = 11
const ACTION_SUB_SAVE_SELF_CARD = 12

const ACTION_MAIN_VIEW_CARD = 2
const ACTION_SUB_VIEW_CARD_INIT = 20
const ACTION_SUB_SAVE_PUBLIC_CARD = 21

const TARGETS = [
  {
    'folder': '0',
    'name': 'AR战队',
    'stamp': '/0.jpg'
  },
  {
    'folder': '1',
    'name': '楼神',
    'stamp': '/1.jpg'
  },
  {
    'folder': '2',
    'name': '超哥',
    'stamp': '/2.jpg'
  },
  {
    'folder': '3',
    'name': '查猪',
    'stamp': '/3.jpg'
  },
  {
    'folder': '4',
    'name': '森哥',
    'stamp': '/4.jpg'
  },
  {
    'folder': '5',
    'name': '天哥',
    'stamp': '/5.jpg'
  }
]

let userCard

export default function Home() {
  const refCardContent = useRef(null)
  const [mainAction, setMainAction] = useState(ACTION_MAIN_WRITE_CARD)
  const [subAction, setSubAction] = useState(ACTION_SUB_WRITE_CARD_INIT)
  const [target, setTarget] = useState(TARGETS[0])
  const [targetSelectorOpen, setTargetSelectorOpen] = useState(false)
  const [globalMaskOpen, setGlobalMaskOpen] = useState(false)
  const [globalMaskTitle, setGlobalMaskTitile] = useState(null)
  const [fetchedCard, setFetchedCard] = useState('/card_ph.png')

  useEffect(() => {
    console.log('useEffect')
    switch (mainAction) {
      case ACTION_MAIN_WRITE_CARD:
        switch (subAction) {
          case ACTION_SUB_SAVE_SELF_CARD:
            handleSaveSelfCard()
            break
          case ACTION_SUB_SEND_CARD:
            handleSendCard()
            break
          default: break
        }
        break
      case ACTION_MAIN_VIEW_CARD:

        break
      default: break
    }
  })

  const handleSaveSelfCard = () => {
    console.log('handleSaveSelfCard')
    html2canvas(refCardContent.current, {
      width: 620,
      height: 368,
      scale: 1
    }).then(function (canvas) {
      const canvasData = canvas.toDataURL('image/png')
      let aLink = document.createElement('a');
      aLink.style.display = 'none';
      aLink.href = canvasData;
      aLink.download = new Date().getTime() + '.png';
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
      setSubAction(ACTION_SUB_WRITE_CARD_INIT)
    })
  }

  const handleSendCard = () => {
    console.log('handleSendCard')
    html2canvas(refCardContent.current, {
      width: 620,
      height: 368,
      scale: 1
    }).then(async function (canvas) {
      const canvasData = canvas.toDataURL('image/png')
      const res = await fetch('/api/card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ target: target.folder, date: new Date().getTime(), card: canvasData }),
      })
      console.log(await res.json())
      unstable_batchedUpdates(() => {
        setGlobalMaskOpen(false)
        setGlobalMaskTitile(null)
        setSubAction(ACTION_SUB_WRITE_CARD_INIT)
      })
    })
  }

  const clickSaveSelfCard = (e) => {
    console.log('save self card')
    setSubAction(ACTION_SUB_SAVE_SELF_CARD)
  }

  const clickSendCard = (e) => {
    console.log('send card')
    unstable_batchedUpdates(() => {
      setGlobalMaskOpen(true)
      setGlobalMaskTitile('正在寄出卡片...')
      setSubAction(ACTION_SUB_SEND_CARD)
    })
  }

  const clickSelectTarget = (e) => {
    if (subAction != ACTION_SUB_WRITE_CARD_INIT) return
    console.log('clickSelectTarget')
    setTargetSelectorOpen(true)
  }

  const onTargetSelect = (target) => {
    console.log(target)
    unstable_batchedUpdates(() => {
      setTargetSelectorOpen(false)
      setTarget(TARGETS[target])
    })
  }

  const onTargetCancel = () => {
    setTargetSelectorOpen(false)
  }

  const renderTabs = () => {
    return (
      <div className={styles.topTabs}>
        <button disabled={mainAction == ACTION_MAIN_WRITE_CARD} className={`${styles.btn} ${font.className}`} onClick={clickWriteCard}>写卡片</button>
        <button disabled={mainAction == ACTION_MAIN_VIEW_CARD} className={`${styles.btn} ${font.className}`} onClick={clickViewCard}>看卡片</button>
      </div>
    )
  }

  const renderTools = () => {
    if (mainAction == ACTION_MAIN_WRITE_CARD) {
      return (
        <div className={styles.writeBottomTools}>
          <button className={`${styles.btn} ${font.className}`} onClick={clickSaveSelfCard}>下载卡片</button>
          <button className={`${styles.btn} ${font.className}`} onClick={clickSendCard}>寄出卡片</button>
        </div>
      )
    } else {
      return (
        <div className={styles.viewBottomTools}>
          <div className={styles.viewBtnGroup}>
            <button className={`${styles.btn} ${font.className}`} onClick={clickViewRandom}>随便看</button>
            <button className={`${styles.btn} ${font.className}`} onClick={clickViewTarget0}>看AR</button>
            <button className={`${styles.btn} ${font.className}`} onClick={clickViewTarget1}>看楼神</button>
            <button className={`${styles.btn} ${font.className}`} onClick={clickViewTarget2}>看超哥</button>
            <button className={`${styles.btn} ${font.className}`} onClick={clickViewTarget3}>看查猪</button>
            <button className={`${styles.btn} ${font.className}`} onClick={clickViewTarget4}>看森哥</button>
            <button className={`${styles.btn} ${font.className}`} onClick={clickViewTarget5}>看天哥</button>
          </div>
          <div>
            <button className={`${styles.btn} ${font.className}`} onClick={clickSavePublicCard}>下载卡片</button>
          </div>
        </div>
      )
    }
  }

  const renderCard = () => {
    if (mainAction == ACTION_MAIN_WRITE_CARD) {
      return (
        <div className={subAction == ACTION_SUB_SAVE_SELF_CARD || subAction == ACTION_SUB_SEND_CARD ? `${styles.card} ${styles.cardReadOnly}` : `${styles.card}`}>
          <div ref={refCardContent} className={styles.cardContent}>
            <img className={styles.stamp} src={target.stamp} width='96px' height='65px' alt='' />
            <div onClick={clickSelectTarget} className={styles.headWrapper}>
              <span className={styles.toWho}>{target.name}</span>
            </div>
            <div className={styles.contentWrapper}>
              <div contentEditable='true' className={`${styles.content} ${font.className}`} rows='3' placeholder='写上您的祝福吧……'></div>
            </div>
            <div className={styles.tailWrapper}>
              <span className={styles.fromWho} contentEditable='true' placeholder='匿名粉丝'></span>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className={`${styles.card} ${styles.cardReadOnly}`}>
          <img src={fetchedCard} width='620px' height='368px' alt='' />
        </div>
      )
    }

  }

  const clickWriteCard = (e) => {
    unstable_batchedUpdates(() => {
      setMainAction(ACTION_MAIN_WRITE_CARD)
      setSubAction(ACTION_SUB_WRITE_CARD_INIT)
      setTarget(TARGETS[0])
    })
  }

  const clickViewCard = (e) => {
    unstable_batchedUpdates(() => {
      setMainAction(ACTION_MAIN_VIEW_CARD)
      setSubAction(ACTION_SUB_VIEW_CARD_INIT)
    })
  }

  const clickViewRandom = async (e) => {
    // unstable_batchedUpdates(() => {
    //   setGlobalMaskOpen(true)
    //   setGlobalMaskTitile('正在捞卡片……')
    // })
    const localData = getLocalItem()
    if (!localData) {
      const res = await fetch('/api/card/sum', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const { code, message, data } = await res.json()
      if (code == 200) {
        console.log(data)
        const _localData = {}
        _localData['lastUpdate'] = Date.now()
        _localData['target0'] = {
          'remote_sum': data[0],
          'available_index': Array.from({ length: data[0] }, (v, k) => k)
        }
        _localData['target1'] = {
          'remote_sum': data[1],
          'available_index': Array.from({ length: data[1] }, (v, k) => k)
        }
        _localData['target2'] = {
          'remote_sum': data[2],
          'available_index': Array.from({ length: data[2] }, (v, k) => k)
        }
        _localData['target3'] = {
          'remote_sum': data[3],
          'available_index': Array.from({ length: data[3] }, (v, k) => k)
        }
        _localData['target4'] = {
          'remote_sum': data[4],
          'available_index': Array.from({ length: data[4] }, (v, k) => k)
        }
        _localData['target5'] = {
          'remote_sum': data[5],
          'available_index': Array.from({ length: data[5] }, (v, k) => k)
        }

        console.log(JSON.stringify(_localData))
      }

    }
  }

  const clickViewTarget0 = (e) => {

  }
  const clickViewTarget1 = (e) => {

  }
  const clickViewTarget2 = (e) => {

  }
  const clickViewTarget3 = (e) => {

  }
  const clickViewTarget4 = (e) => {

  }
  const clickViewTarget5 = (e) => {

  }
  const clickSavePublicCard = (e) => {

  }

  const fetchCard = (target) => {
    let needUpdate = false
    if (!userCard) userCard = getLocalItem()
    if (userCard && userCard.lastUpdate) {
      if (Date.now() - userCard.lastUpdate > 5 * 60 * 1000) {
        needUpdate = true
      }
    } else {
      needUpdate = true
    }

    if (needUpdate) {
      //需要先同步云端各个TARGET的总计
    } else {
      const userTarget = userCard['target'][target]
      console.log(userTarget)
      const remote = Array.from({ length: userTarget.remote_count }, (v, k) => k)
      if (userTarget.local_used && userTarget.local_used.length > 0) {

        newRemote = remote.filter((x) => !userTarget.local_used.some((item) => arr.indexOf(x) === item))
      }

      // const randomMath.floor(userTarget.remote_count * Math.random())
    }

  }

  const getLocalItem = () => {
    const item = localStorage.getItem('USER_CARD')
    if (item) {
      return JSON.parse(item)
    }
    return null
  }

  const fetchCardByTargetAndIndex = (target, index) => {

  }

  console.log('render')

  return (
    <>
      <div>

        {
          renderTabs()
        }

        {
          renderCard()
        }

        {
          renderTools()
        }

      </div>

      <TargetSelector open={targetSelectorOpen} onSelect={onTargetSelect} onCancel={onTargetCancel} />
      <GlobalMask open={globalMaskOpen} title={globalMaskTitle} />
    </>
  )
}