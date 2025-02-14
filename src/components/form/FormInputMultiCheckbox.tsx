import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  PathValue,
} from 'react-hook-form'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
} from '@mui/material'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import { UseFormSetValue } from 'react-hook-form/dist/types/form'
import React from 'react'

export interface multiOptionType {
  key: string
  value: string
  label: string
}

type FormInputMultiCheckboxProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  id: string
  name: TName
  control: Control<TFieldValues>
  label: string
  setValue: UseFormSetValue<TFieldValues>
  options: multiOptionType[]
  size?: 'small' | 'medium'
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  disabled?: boolean
}

export const FormInputMultiCheckbox = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  id,
  name,
  control,
  setValue,
  label,
  size = 'small',
  options,
  rules,
  disabled,
}: FormInputMultiCheckboxProps<TFieldValues, TName>) => {
  return (
    <FormControl size={'small'} variant={'outlined'}>
      <FormLabel component="legend">{label}</FormLabel>
      <div>
        {options.map((option: multiOptionType) => (
          <FormControlLabel
            name={name}
            control={
              <Controller
                name={name}
                control={control}
                render={({ field }) => {
                  return (
                    <Checkbox
                      id={id}
                      size={size}
                      checked={field.value.includes(option.value)}
                      onChange={() => {
                        const isPresent = field.value.indexOf(option.value)
                        if (isPresent !== -1) {
                          const remaining = field.value.filter(
                            (item: string) => item !== option.value
                          )
                          setValue(name, remaining)
                        } else {
                          setValue(name, [
                            ...new Set([...field.value, option.value]),
                          ] as PathValue<TFieldValues, TName>)
                        }
                      }}
                    />
                  )
                }}
                rules={rules}
              />
            }
            disabled={disabled}
            label={option.label}
            key={option.value}
          />
        ))}
      </div>
    </FormControl>
  )
}
