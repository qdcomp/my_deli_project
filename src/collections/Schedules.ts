import type { CollectionConfig } from 'payload'

export const Schedules: CollectionConfig = {
  slug: 'schedules',
  labels: {
    singular: 'スケジュール',
    plural: 'スケジュール',
  },
  admin: {
    useAsTitle: 'date',
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      label: '日付',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'store',
      type: 'select',
      label: '店舗',
      required: true,
      options: [
        { label: '店舗A', value: 'store_a' },
        { label: '店舗B', value: 'store_b' },
        { label: '店舗C', value: 'store_c' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'cast',
      type: 'relationship',
      relationTo: 'casts',
      label: 'キャスト',
      required: true,
      filterOptions: ({ data }) => {
        if (data?.store) {
          return {
            store: { equals: data.store },
          }
        }
        return true
      },
    },
  ],
}
