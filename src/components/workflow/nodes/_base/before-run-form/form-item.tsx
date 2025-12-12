'use client'
import type { FC } from 'react'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { InputVar } from '../../../../types'
import { InputVarType } from '../../../../types'
import Select from '@/app/components/base/select'
import Input from '@/app/components/base/input'
import Textarea from '@/app/components/base/textarea'
import TextGenerationImageUploader from '@/app/components/base/image-uploade
import cn from '@/utils/classnames'
import BoolInput from './bool-input'

type Props = {
  payload: InputVar
  value: any
  onChange: (value: any) => void
  className?: string
  autoFocus?: boolean
  inStepRun?: boolean
}

const FormItem: FC<Props> = ({
  payload,
  value,
  onChange,
  className,
  autoFocus,
  inStepRun = false,
}) => {
  const { t } = useTranslation()
  const { type } = payload

  const isBooleanType = type === InputVarType.checkbox

  return (
    <div className={cn(className)}>
      {!isBooleanType && (
        <div className='system-sm-semibold mb-1 flex h-6 items-center gap-1 text-text-secondary'>
          <div className='truncate'>
            { payload.label}
          </div>
          {payload.hide === true ? (
            <span className='system-xs-regular text-text-tertiary'>
              {t('workflow.panel.optional_and_hidden')}
            </span>
          ) : (
            !payload.required && (
              <span className='system-xs-regular text-text-tertiary'>
                {t('workflow.panel.optional')}
              </span>
            )
          )}
        </div>
      )}
      <div className='grow'>
        {
          type === InputVarType.textInput && (
            <Input
              value={value || ''}
              onChange={e => onChange(e.target.value)}
              placeholder={t('appDebug.variableConfig.inputPlaceholder')!}
              autoFocus={autoFocus}
            />
          )
        }

        {
          type === InputVarType.number && (
            <Input
              type="number"
              value={value || ''}
              onChange={e => onChange(e.target.value)}
              placeholder={t('appDebug.variableConfig.inputPlaceholder')!}
              autoFocus={autoFocus}
            />
          )
        }

        {
          type === InputVarType.paragraph && (
            <Textarea
              value={value || ''}
              onChange={e => onChange(e.target.value)}
              placeholder={t('appDebug.variableConfig.inputPlaceholder')!}
              autoFocus={autoFocus}
            />
          )
        }

        {
          type === InputVarType.select && (
            <Select
              className="w-full"
              defaultValue={value || payload.default || ''}
              items={payload.options?.map(option => ({ name: option, value: option })) || []}
              onSelect={i => onChange(i.value)}
              allowSearch={false}
            />
          )
        }

        {isBooleanType && (
          <BoolInput
            name={payload.label as string}
            value={!!value}
            required={payload.required}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  )
}
export default React.memo(FormItem)
