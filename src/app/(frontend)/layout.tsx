import React from 'react'
import './styles.css'

export const metadata = {
  description: '派遣型（デリバリー）エステの管理システムです。',
  title: 'デリバリーエステ管理',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ja">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
