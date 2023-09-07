`use client`

import styles from './target_selector.module.css'

export default function TargetSelector(props) {
    const { open, onSelect, onCancel } = props

    return (
        open ?
            <div className={styles.mainbox}>
                <div onClick={(e) => onCancel()} className={styles.mask}></div>
                <img onClick={(e) => onSelect(0)} className={styles.target} src='/0.jpg' width='50px' height='50px' alt='' />
                <img onClick={(e) => onSelect(1)} className={styles.target} src='/1.jpg' width='50px' height='50px' alt='' />
                <img onClick={(e) => onSelect(2)} className={styles.target} src='/2.jpg' width='50px' height='50px' alt='' />
                <img onClick={(e) => onSelect(3)} className={styles.target} src='/3.jpg' width='50px' height='50px' alt='' />
                <img onClick={(e) => onSelect(4)} className={styles.target} src='/4.jpg' width='50px' height='50px' alt='' />
                <img onClick={(e) => onSelect(5)} className={styles.target} src='/5.jpg' width='50px' height='50px' alt='' />
            </div>
            : <></>
    )
}