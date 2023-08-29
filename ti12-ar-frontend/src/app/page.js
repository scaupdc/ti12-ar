'use client'

import Image from 'next/image'
import styles from './page.module.css'
import { font } from "./font"
import html2canvas from 'html2canvas'
import { useEffect, useRef, useState } from 'react'

const ACTION_DOWNLOAD_CARD = 1
const ACTION_SEND_CARD = 2
let action = null

const TARGET_0 = 0
const TARGET_1 = 1
const TARGET_2 = 1
const TARGET_3 = 1
const TARGET_4 = 1
const TARGET_5 = 1
let target = TARGET_0

console.log("action=" + action)

export default function Home() {
  const refCardContent = useRef(null)
  const [cardReadOnly, setCardReadOnly] = useState(false)

  useEffect(() => {
    console.log("action=" + action)
    switch (action) {
      case ACTION_DOWNLOAD_CARD:
        handleDownloadCard()
        break;
      case ACTION_SEND_CARD:
        handleSendCard()
        break;

      default:
        break;
    }
  })

  const handleDownloadCard = () => {
    html2canvas(refCardContent.current, {
      scale: 1
    }).then(function (canvas) {
      const canvasData = canvas.toDataURL("image/jpeg", 1)
      let aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = canvasData;
      aLink.download = new Date().getTime() + ".jpg";
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
      console.log("here")
      action = null
      setCardReadOnly(false)
    })
  }

  const handleSendCard = () => {
    console.log("handleSendCard")
    html2canvas(refCardContent.current, {
      scale: 1
    }).then(async function (canvas) {
      const canvasData = canvas.toDataURL("image/png")
      const res = await fetch('/api/card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ target, date: new Date().getTime(), card: canvasData }),
      })
      action = null
      // console.log(await res.json())
      setCardReadOnly(false)
    })
  }

  const clickDownloadCard = (e) => {
    console.log("download card")
    action = ACTION_DOWNLOAD_CARD
    setCardReadOnly(true)
  }

  const clickSendCard = (e) => {
    console.log("send card")
    action = ACTION_SEND_CARD
    console.log("action=" + action)
    setCardReadOnly(true)
  }

  return (
    <div>
      <div>
        <button>看信</button>
        <button>写信</button>
      </div>

      <div className={cardReadOnly ? `${styles.card} ${styles.cardReadOnly}` : `${styles.card}`}>
        <div ref={refCardContent} className={styles.cardContent}>
          <img className={styles.stamp} src='/stamp.jpg' width='94px' height='65px' alt='' />
          <div className={styles.headWrapper}>
            {/* <span className={styles.headTo}>TO</span> */}
            <span className={styles.toWho}>超哥</span>
          </div>
          <div className={styles.contentWrapper}>
            <div contentEditable='true' className={`${styles.content} ${font.className}`} rows='3' placeholder='写上您的祝福吧……'></div>
            {/* <textarea className={`${styles.content} ${font.className}`} rows='3' placeholder='写上您的祝福吧……' /> */}
          </div>
          <div className={styles.tailWrapper}>
            {/* <span className={styles.tailFrom}>FROM</span> */}
            <span className={styles.fromWho} contentEditable='true' placeholder='匿名粉丝'></span>
          </div>
        </div>
      </div>

      <div>
        <button onClick={clickDownloadCard}>下载卡片</button>
        <button onClick={clickSendCard}>寄出卡片</button>
      </div>
    </div>
  )
}