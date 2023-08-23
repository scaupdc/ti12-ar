import styles from './styles.module.css'

export default function Page() {
    return <div>
        <div className={styles.banner}><img className={styles.bannerImg} src="/ar.png" alt="ar" /></div>
        <h1 className={styles.title}>For AR on TI12</h1>
    </div>
}