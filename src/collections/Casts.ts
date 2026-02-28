// src/collections/Casts.ts
import type { CollectionConfig } from 'payload'

export const Casts: CollectionConfig = {
  slug: 'casts',
  labels: {
    singular: 'キャスト',
    plural: 'キャスト',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'store',
      // 'serviceArea',
      // 'travelFee',
      // 'specialNominationFee',
      // 'rating',
      // 'isAvailableForDelivery',
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: '名前',
    },
    // {
    //   name: 'profileImage',
    //   type: 'upload',
    //   relationTo: 'media',
    //   label: 'プロフィール写真',
    // },
    {
      name: 'store',
      type: 'select',
      label: '所属店舗',
      required: true,
      options: [
        { label: '店舗A', value: 'store_a' },
        { label: '店舗B', value: 'store_b' },
        { label: '店舗C', value: 'store_c' },
      ],
      admin: {
        description: 'キャストの所属店舗を選択',
        placeholder: '所属店舗を選択',
      },
    },
    // {
    //   name: 'serviceArea',
    //   type: 'text',
    //   label: '対応エリア・最寄り駅',
    // },
    // {
    //   name: 'travelFee',
    //   type: 'number',
    //   label: '出張費',
    //   admin: {
    //     description: '円単位で入力',
    //   },
    // },
    // {
    //   name: 'specialNominationFee',
    //   type: 'select',
    //   label: '特別指名料',
    //   options: [
    //     { label: '1000円', value: '1000' },
    //     { label: '2000円', value: '2000' },
    //     { label: '3000円', value: '3000' },
    //     { label: '4000円', value: '4000' },
    //     { label: '5000円', value: '5000' },
    //   ],
    //   admin: {
    //     description: '特別指名料を設定する場合のみ選択（未選択の場合はなし）',
    //     placeholder: '特別指名料を選択',
    //   },
    // },
    // {
    //   name: 'bio',
    //   type: 'richText',
    //   label: '自己紹介',
    // },
    // {
    //   name: 'rating',
    //   type: 'number',
    //   label: '評価',
    //   min: 0,
    //   max: 5,
    //   admin: {
    //     description: '0〜5の範囲で入力',
    //   },
    // },
    // {
    //   name: 'latitude',
    //   type: 'number',
    //   label: '緯度',
    //   admin: {
    //     description: 'キャストの現在地または主な活動拠点の緯度',
    //   },
    // },
    // {
    //   name: 'longitude',
    //   type: 'number',
    //   label: '経度',
    //   admin: {
    //     description: 'キャストの現在地または主な活動拠点の経度',
    //   },
    // },
    // {
    //   name: 'isAvailableForDelivery',
    //   type: 'checkbox',
    //   label: 'デリバリー対応可能',
    //   defaultValue: false,
    //   admin: {
    //     description: 'キャストが現在デリバリーサービスに対応可能かどうか',
    //   },
    // },
  ],
}
