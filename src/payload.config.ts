import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { en } from 'payload/i18n/en'
import { ja } from 'payload/i18n/ja'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Casts } from './collections/Casts'
import { Schedules } from './collections/Schedules'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    dateFormat: 'yyyy年M月d日 H:mm',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: ['/components/admin/NavScheduleCalendarLink#NavScheduleCalendarLink'],
      views: {
        ScheduleCalendar: {
          Component: '/components/admin/ScheduleCalendarView#ScheduleCalendarView',
          path: '/schedule-calendar',
          meta: {
            title: 'スケジュールカレンダー',
          },
        },
      },
    },
  },
  collections: [Users, Media, Casts, Schedules],
  i18n: {
    supportedLanguages: { en, ja },
    fallbackLanguage: 'ja',
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
