import React from 'react'
import Link from 'next/link'

export function NavScheduleCalendarLink() {
  return (
    <Link
      href="/admin/schedule-calendar"
      style={{
        display: 'block',
        padding: '8px 16px',
        color: '#333',
        textDecoration: 'none',
        fontSize: 14,
      }}
    >
      スケジュールカレンダー
    </Link>
  )
}
