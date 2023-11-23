'use client'

import { useEffect } from 'react'

const useTalk = (tawkToScriptSrc: string) => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            var Tawk_API: any = Tawk_API || {}
            var Tawk_LoadStart = new Date()
            ;(function () {
                const s1 = document.createElement('script')
                const s0 = document.getElementsByTagName('script')[0]
                s1.async = true
                s1.src = tawkToScriptSrc
                s1.charset = 'UTF-8'
                s1.setAttribute('crossorigin', '*')
                if (s0 && s0.parentNode) s0.parentNode.insertBefore(s1, s0)
            })()
        }
    }, [tawkToScriptSrc])
}

export default useTalk
