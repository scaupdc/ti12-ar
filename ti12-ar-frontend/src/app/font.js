import localFont from 'next/font/local'

// Font files can be colocated inside of `app`
const font = localFont({
    src: [
        {
            path: './JasonHandwriting2.woff',
            style: 'normal',
        },
        {
            path: './JasonHandwriting2.ttf',
            style: 'normal',
        }
    ]
})

export { font }