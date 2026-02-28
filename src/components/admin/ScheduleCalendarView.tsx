import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import config from '@/payload.config'

const STORE_OPTIONS = [
  { label: '店舗A', value: 'store_a' },
  { label: '店舗B', value: 'store_b' },
  { label: '店舗C', value: 'store_c' },
] as const

type ScheduleCalendarViewProps = {
  searchParams?: Promise<{ store?: string; year?: string; month?: string }>
  initPageResult?: { req?: { query?: Record<string, string | string[] | undefined> } }
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export async function ScheduleCalendarView(props: ScheduleCalendarViewProps) {
  let resolvedParams: { store?: string; year?: string; month?: string } = {}
  if (props.searchParams) {
    resolvedParams = await props.searchParams
  } else if (props.initPageResult?.req?.query) {
    const q = props.initPageResult.req.query
    resolvedParams = {
      store: typeof q.store === 'string' ? q.store : q.store?.[0],
      year: typeof q.year === 'string' ? q.year : q.year?.[0],
      month: typeof q.month === 'string' ? q.month : q.month?.[0],
    }
  }
  const store = resolvedParams.store || 'store_a'
  const now = new Date()
  const year = resolvedParams.year ? parseInt(resolvedParams.year, 10) : now.getFullYear()
  const month = resolvedParams.month ? parseInt(resolvedParams.month, 10) : now.getMonth() + 1

  const startOfMonth = new Date(year, month - 1, 1)
  const endOfMonth = new Date(year, month - 1 + 1, 0)

  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'schedules',
    where: {
      and: [
        { store: { equals: store } },
        { date: { greater_than_equal: startOfMonth.toISOString().slice(0, 10) } },
        { date: { less_than_equal: endOfMonth.toISOString().slice(0, 10) } },
      ],
    },
    depth: 1,
    limit: 500,
  })

  const schedulesByDate: Record<string, { id: string; castName: string }[]> = {}
  for (const doc of docs) {
    const dateKey = doc.date
      ? typeof doc.date === 'string'
        ? doc.date.slice(0, 10)
        : formatDateKey(new Date(doc.date))
      : ''
    if (!dateKey) continue
    if (!schedulesByDate[dateKey]) schedulesByDate[dateKey] = []
    const cast = (doc as any).cast
    const castName =
      typeof cast === 'object' && cast !== null && 'name' in cast
        ? String((cast as { name: string }).name)
        : '—'
    schedulesByDate[dateKey].push({ id: String(doc.id), castName })
  }

  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month - 1 + 1, 0)
  const startPad = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year

  const baseUrl = '/admin/schedule-calendar'
  const storeParam = `store=${store}`
  const prevUrl = `${baseUrl}?${storeParam}&year=${prevYear}&month=${prevMonth}`
  const nextUrl = `${baseUrl}?${storeParam}&year=${nextYear}&month=${nextMonth}`

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 16 }}>スケジュールカレンダー</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        店舗を選ぶと、その店舗のスケジュールだけが表示されます。キャストは所属店舗のスケジュールにのみ登録できます。
      </p>

      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <span>店舗:</span>
        {STORE_OPTIONS.map((opt) => (
          <Link
            key={opt.value}
            href={`${baseUrl}?store=${opt.value}&year=${year}&month=${month}`}
            style={{
              padding: '8px 12px',
              borderRadius: 4,
              textDecoration: 'none',
              background: store === opt.value ? '#333' : '#eee',
              color: store === opt.value ? '#fff' : '#333',
            }}
          >
            {opt.label}
          </Link>
        ))}
        <span style={{ fontWeight: 600 }}>
          {year}年{month}月
        </span>
        <Link
          href={prevUrl}
          style={{
            padding: '8px 12px',
            background: '#eee',
            borderRadius: 4,
            textDecoration: 'none',
            color: '#333',
          }}
        >
          ← 前月
        </Link>
        <Link
          href={nextUrl}
          style={{
            padding: '8px 12px',
            background: '#eee',
            borderRadius: 4,
            textDecoration: 'none',
            color: '#333',
          }}
        >
          翌月 →
        </Link>
        <Link
          href="/admin/collections/schedules/create"
          style={{
            padding: '8px 16px',
            background: '#333',
            color: '#fff',
            borderRadius: 4,
            textDecoration: 'none',
            marginLeft: 'auto',
          }}
        >
          スケジュールを追加
        </Link>
      </div>

      <div style={{ overflow: 'auto' }}>
        <table
          role="grid"
          style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}
        >
          <thead>
            <tr>
              {['日', '月', '火', '水', '木', '金', '土'].map((d) => (
                <th
                  key={d}
                  style={{
                    border: '1px solid #ddd',
                    padding: 8,
                    textAlign: 'center',
                    background: '#f5f5f5',
                    width: '14.28%',
                  }}
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(() => {
              const rows: React.ReactNode[] = []
              let day = 1 - startPad
              while (
                day <= daysInMonth ||
                (rows.length === 0 ? day <= 42 : day < daysInMonth + 7)
              ) {
                const cells: React.ReactNode[] = []
                for (let w = 0; w < 7; w++) {
                  const cellDate = day
                  const isCurrentMonth = cellDate >= 1 && cellDate <= daysInMonth
                  const dateKey = isCurrentMonth
                    ? `${year}-${String(month).padStart(2, '0')}-${String(cellDate).padStart(2, '0')}`
                    : ''
                  const schedules = dateKey ? schedulesByDate[dateKey] || [] : []
                  cells.push(
                    <td
                      key={w}
                      style={{
                        border: '1px solid #ddd',
                        padding: 8,
                        minHeight: 100,
                        verticalAlign: 'top',
                        background: isCurrentMonth ? '#fff' : '#f9f9f9',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: isCurrentMonth ? 600 : 400,
                          color: isCurrentMonth ? '#333' : '#999',
                          marginBottom: 4,
                        }}
                      >
                        {cellDate}
                      </div>
                      {isCurrentMonth && (
                        <div style={{ fontSize: 12 }}>
                          {schedules.map((s) => (
                            <div key={s.id}>
                              <Link
                                href={`/admin/collections/schedules/${s.id}`}
                                style={{ color: '#2563eb' }}
                              >
                                {s.castName}
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>,
                  )
                  day++
                }
                rows.push(<tr key={rows.length}>{cells}</tr>)
              }
              return rows
            })()}
          </tbody>
        </table>
      </div>
    </div>
  )
}
