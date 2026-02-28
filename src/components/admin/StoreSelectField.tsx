'use client'

import React, { useCallback } from 'react'
import { SelectInput } from '@payloadcms/ui'
import { useField, useForm } from '@payloadcms/ui'
import type { SelectFieldClientComponent } from 'payload'

// Define a local interface for Payload's select options

const StoreSelectField: SelectFieldClientComponent = (props) => {
  const { path, field, value } = props

  const label = field.label
  const options = field.options
  const required = field.required
  const description = field.admin?.description
  const placeholder = field.admin?.placeholder as string | undefined // Cast placeholder

  const { dispatch } = useForm() as any
  const { setValue } = useField<string>({ path })

  const handleOnChange = useCallback(
    (selectedOption: any) => {
      let incomingValue: string | undefined

      if (Array.isArray(selectedOption)) {
        // Handle multi-select if necessary, though store is single select
        incomingValue = selectedOption.length > 0 ? selectedOption[0].value : undefined
      } else {
        incomingValue = selectedOption?.value
      }

      setValue(incomingValue)

      if (incomingValue !== value) {
        dispatch({ type: 'REVALIDATE_FIELD', path: 'cast' })
        dispatch({ type: 'REVALIDATE_FIELD', path: 'date' })
        dispatch({ type: 'UPDATE_FIELD', path: 'cast', value: null })
      }
    },
    [dispatch, setValue, value],
  )

  return (
    <SelectInput
      path={path}
      name={path} // Add the name prop
      label={label}
      options={options as any} // Use any for options
      required={required}
      description={description}
      placeholder={placeholder}
      value={value}
      onChange={handleOnChange as any} // Use any for onChange handler
    />
  )
}

export default StoreSelectField
