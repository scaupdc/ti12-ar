`use client`

import styles from './global_mask.module.css'

export default function GlobalMask(props) {
    const { open, title } = props
    return (
        open ?
            <div className={styles.mainbox}>
                <div className={styles.mask}></div>
                <div className={styles.spinner}></div>
                <span className={styles.title}>{title||'loading...'}</span>
            </div>
            : <></>
    )
}