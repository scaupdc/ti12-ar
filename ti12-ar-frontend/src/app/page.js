'use client'

import styles from './page.module.css'
import { font } from './font'
import html2canvas from 'html2canvas'
import { useEffect, useRef, useState } from 'react'
import TargetSelector from './target_selector'
import { unstable_batchedUpdates } from 'react-dom'

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

export default function Home() {
  const refCardContent = useRef(null)
  const [mainAction, setMainAction] = useState(ACTION_MAIN_WRITE_CARD)
  const [subAction, setSubAction] = useState(ACTION_SUB_WRITE_CARD_INIT)
  const [target, setTarget] = useState(TARGETS[0])
  const [targetSelectorOpen, setTargetSelectorOpen] = useState(false)
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
      setSubAction(ACTION_SUB_WRITE_CARD_INIT)
    })
  }

  const clickSaveSelfCard = (e) => {
    console.log('save self card')
    setSubAction(ACTION_SUB_SAVE_SELF_CARD)
  }

  const clickSendCard = (e) => {
    console.log('send card')
    setSubAction(ACTION_SUB_SEND_CARD)
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

  const clickViewRandom = (e) => {

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
    </>
  )
}