import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.card}>
      <Image className={styles.stamp} src="/stamp.jpg" width={100} height={100} alt='超哥' />
      <div>
        <div>
          <span>TO</span>
          <span>超哥</span>
        </div>
        <div>
          <textarea placeholder='写上您的祝福吧……' />
        </div>
        <div>
          <span>FROM</span>
          <span>超哥粉丝</span>
        </div>
      </div>
    </div>

  )
}
