'use client'

import styles from './page.module.css'
import { font } from './font'
import html2canvas from 'html2canvas'
import { useEffect, useRef, useState } from 'react'
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

const UPDATE_DELAY = 1 * 60 * 1000

let localData = null
let focusUpdate = false

export default function Home() {
  const refCardContent = useRef(null)
  const refCardInput = useRef(null)
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
      const { code, message, data } = await res.json()
      if (code == 200) {
        focusUpdate = true
      } else {
        console.log('/api/card fail:', message)
      }
      unstable_batchedUpdates(() => {
        setGlobalMaskOpen(false)
        setSubAction(ACTION_SUB_WRITE_CARD_INIT)
      })
    })
  }

  const clickSaveSelfCard = (e) => {
    console.log('save self card')
    setSubAction(ACTION_SUB_SAVE_SELF_CARD)
  }

  const clickSendCard = (e) => {
    const userInput = refCardInput.current.innerHTML
    if (!userInput || userInput == '') {
      console.log('请带上您的祝福！')
      return
    }
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
            <button className={`${styles.btn} ${font.className}`} onClick={(e) => clickViewRandom(-1)}>随便看</button>
            <button className={`${styles.btn} ${font.className}`} onClick={(e) => clickViewRandom(0)}>看AR</button>
            <button className={`${styles.btn} ${font.className}`} onClick={(e) => clickViewRandom(1)}>看楼神</button>
            <button className={`${styles.btn} ${font.className}`} onClick={(e) => clickViewRandom(2)}>看超哥</button>
            <button className={`${styles.btn} ${font.className}`} onClick={(e) => clickViewRandom(3)}>看查猪</button>
            <button className={`${styles.btn} ${font.className}`} onClick={(e) => clickViewRandom(4)}>看森哥</button>
            <button className={`${styles.btn} ${font.className}`} onClick={(e) => clickViewRandom(5)}>看天哥</button>
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
              <div ref={refCardInput} contentEditable='true' suppressContentEditableWarning className={`${styles.content} ${font.className}`} rows='3' placeholder='写上您的祝福吧……'></div>
            </div>
            <div className={styles.tailWrapper}>
              <span className={styles.fromWho} contentEditable='true' suppressContentEditableWarning placeholder='匿名粉丝'></span>
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

  const clickViewRandom = async (target) => {
    let needUpdate = false
    if (focusUpdate) {
      console.log('focusUpdate')
      needUpdate = true
      focusUpdate = false
    } else {
      if (!localData) localData = getLocalData()
      if (localData) {
        if (Date.now() - localData['lastUpdate'] > UPDATE_DELAY) {
          console.log('lastUpdate delay')
          needUpdate = true
        }
      } else {
        console.log('local data empty')
        needUpdate = true
      }
    }

    if (needUpdate) {
      console.log('Start update.')
      unstable_batchedUpdates(async () => {
        setGlobalMaskOpen(true)
        setGlobalMaskTitile('正在更新卡片库...')
      })

      const res = await fetch('/api/card/sum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const { code, message, data } = await res.json()
      if (code == 200) {
        console.log('Remote data:')
        console.log(data)

        if (localData) {
          console.log('Append')
          //追加
          for (let i = 0; i < 6; i++) {
            const tempTarget = localData[i.toString()]
            const oldSum = tempTarget['remote_sum']
            const newSum = data[i]
            if (newSum > oldSum) {
              const pushData = Array.from({ length: newSum - oldSum }, (v, k) => k + oldSum)
              console.log('target' + i + ' pushData=' + pushData)
              tempTarget['available_index'].push(...pushData)
              tempTarget['remote_sum'] = newSum
            }//ignore other case
          }
        } else {
          console.log('Overwrite')
          //替换
          const _localData = {}
          _localData['0'] = {
            'remote_sum': data[0],
            'available_index': Array.from({ length: data[0] }, (v, k) => k)
          }
          _localData['1'] = {
            'remote_sum': data[1],
            'available_index': Array.from({ length: data[1] }, (v, k) => k)
          }
          _localData['2'] = {
            'remote_sum': data[2],
            'available_index': Array.from({ length: data[2] }, (v, k) => k)
          }
          _localData['3'] = {
            'remote_sum': data[3],
            'available_index': Array.from({ length: data[3] }, (v, k) => k)
          }
          _localData['4'] = {
            'remote_sum': data[4],
            'available_index': Array.from({ length: data[4] }, (v, k) => k)
          }
          _localData['5'] = {
            'remote_sum': data[5],
            'available_index': Array.from({ length: data[5] }, (v, k) => k)
          }
          localData = _localData
        }

        localData['lastUpdate'] = Date.now()
        console.log(JSON.stringify(localData))

        localStorage.setItem('USER_CARD', JSON.stringify(localData))

        unstable_batchedUpdates(async () => {
          setGlobalMaskOpen(false)
        })

        console.log('Updated.')
      } else {
        console.log('/api/card/sum fail:', message)
      }
    } else {
      console.log('Do not need to update.')
    }

    console.log('After checking.')

    let selectedTarget

    if (target == -1) {
      //随便看
      const notEmptyTargets = []
      if (localData['0']['available_index'].length > 0) notEmptyTargets.push('0')
      if (localData['1']['available_index'].length > 0) notEmptyTargets.push('1')
      if (localData['2']['available_index'].length > 0) notEmptyTargets.push('2')
      if (localData['3']['available_index'].length > 0) notEmptyTargets.push('3')
      if (localData['4']['available_index'].length > 0) notEmptyTargets.push('4')
      if (localData['5']['available_index'].length > 0) notEmptyTargets.push('5')

      if (notEmptyTargets.length > 0) {
        selectedTarget = notEmptyTargets[Math.floor(notEmptyTargets.length * Math.random())]
      }
    } else {
      //指定看
      selectedTarget = target
    }

    if (selectedTarget >= 0 && localData[selectedTarget]['available_index'].length > 0) {
      const localDataTarget = localData[selectedTarget]
      const localDataAvailableIndex = localDataTarget['available_index']
      const selectedIndex = localDataAvailableIndex[Math.floor(localDataAvailableIndex.length * Math.random())]

      console.log('selectedTarget=' + selectedTarget)
      console.log('selectedIndex=' + selectedIndex)

      localDataAvailableIndex.splice(localDataAvailableIndex.indexOf(selectedIndex), 1)
      if (localDataAvailableIndex.length == 0) {
        //重置
        console.log('Reset available_index')
        localDataTarget['available_index'] = Array.from({ length: localDataTarget['remote_sum'] }, (v, k) => k)
      }

      localStorage.setItem('USER_CARD', JSON.stringify(localData))
      console.log('/ti12ar/' + selectedTarget + '/' + selectedTarget + '_' + selectedIndex + '.png')
      setFetchedCard('/ti12ar/' + selectedTarget + '/' + selectedTarget + '_' + selectedIndex + '.png')

      console.log('After rolling:')
      console.log(JSON.stringify(localData))
    } else {
      console.log('No card found.')
    }
  }

  const clickSavePublicCard = (e) => {
    let aLink = document.createElement('a');
    aLink.href = fetchedCard;
    aLink.download = new Date().getTime() + '.png';
    aLink.target = 'blank'
    const event = new MouseEvent('click')
    aLink.dispatchEvent(event)
  }

  const getLocalData = () => {
    const item = localStorage.getItem('USER_CARD')
    if (item) {
      console.log(item)
      return JSON.parse(item)
    }
    return null
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