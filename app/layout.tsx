import './global.css'
import styles from './styles.module.css'

export default function RootLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={
                styles.ar
            }>
                {children}</body>
        </html>
    )
}
