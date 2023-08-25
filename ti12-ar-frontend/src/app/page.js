'use client'

import Image from 'next/image'
import styles from './page.module.css'
import { font } from "./font"
import html2canvas from 'html2canvas'
import { useEffect, useRef, useState } from 'react'

export default function Home() {

  const refCardContent = useRef(null)
  const [cardReadOnly, setCardReadOnly] = useState(false)

  useEffect(() => {
    console.log(cardReadOnly)
    if (cardReadOnly) {
      console.log("get")
      console.log(refCardContent.current)
      html2canvas(refCardContent.current, {
        scale: 1
      }).then(function (canvas) {
        console.log("shit")
        document.body.appendChild(canvas);
        setCardReadOnly(false)
      })
    }
  })

  const clickSaveCard = (e) => {
    console.log("click")
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
        <button onClick={clickSaveCard}>存图</button>
        <button>寄信</button>
      </div>
    </div>
  )
}