import './globals.css'
import { font } from "./font";

export const metadata = {
  title: 'For AR on TI12.',
  description: 'For AR on TI12.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body className={font.className}>{children}</body>
    </html>
  )
}
