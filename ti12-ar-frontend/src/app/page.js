'use client'

import styles from './page.module.css'
import { font } from './font'
import html2canvas from 'html2canvas'
import { useEffect, useRef, useState } from 'react'
import TargetSelector from './target_selector'

const ACTION_WRITE_CARD = 0
const ACTION_SEND_CARD = 1
const ACTION_VIEW_CARD = 2
const ACTION_SAVE_SELF_CARD = 3
const ACTION_SAVE_PUBLIC_CARD = 3

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
  const [action, setAction] = useState(ACTION_WRITE_CARD)
  const [target, setTarget] = useState(TARGETS[0])
  const [targetSelectorOpen, setTargetSelectorOpen] = useState(false)

  useEffect(() => {
    switch (action) {
      case ACTION_SAVE_SELF_CARD:
        handleSaveSelfCard()
        break;
      case ACTION_SEND_CARD:
        handleSendCard()
        break;

      default:
        break;
    }
  })

  const handleSaveSelfCard = () => {
    console.log('handleSaveSelfCard')
    html2canvas(refCardContent.current, {
      scale: 1
    }).then(function (canvas) {
      const canvasData = canvas.toDataURL('image/jpeg', 1)
      let aLink = document.createElement('a');
      aLink.style.display = 'none';
      aLink.href = canvasData;
      aLink.download = new Date().getTime() + '.jpg';
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
      setAction(ACTION_WRITE_CARD)
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
      setAction(ACTION_WRITE_CARD)
    })
  }

  const clickSaveSelfCard = (e) => {
    console.log('save self card')
    setAction(ACTION_SAVE_SELF_CARD)
  }

  const clickSendCard = (e) => {
    console.log('send card')
    setAction(ACTION_SEND_CARD)
  }

  const clickSelectTarget = (e) => {
    if (action != ACTION_WRITE_CARD) return
    console.log('clickSelectTarget')
    setTargetSelectorOpen(true)
  }

  const onTargetSelect = (target) => {
    console.log(target)
    setTargetSelectorOpen(false)
    setTarget(TARGETS[target])
  }

  const onTargetCancel = () => {
    setTargetSelectorOpen(false)
  }

  return (
    <>
      <div>
        <div>
          <button>看卡片</button>
          <button>写卡片</button>
        </div>

        <div className={action == ACTION_SAVE_SELF_CARD || action == ACTION_SEND_CARD ? `${styles.card} ${styles.cardReadOnly}` : `${styles.card}`}>
          <div ref={refCardContent} className={styles.cardContent}>
            <img className={styles.stamp} src={target.stamp} width='94px' height='65px' alt='' />
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

        <div>
          <button onClick={clickSaveSelfCard}>下载卡片</button>
          <button onClick={clickSendCard}>寄出卡片</button>
        </div>
      </div>
      <TargetSelector open={targetSelectorOpen} onSelect={onTargetSelect} onCancel={onTargetCancel} />
    </>
  )
}