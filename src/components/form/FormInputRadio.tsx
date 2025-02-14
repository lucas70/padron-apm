import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import { FormControlLabel, InputLabel, Radio, RadioGroup } from '@mui/material'
import Typography from '@mui/material/Typography'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import React from 'react'
import { Variant } from '@mui/material/styles/createTypography'

type FormInputRadioProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  id: string
  name: TName
  control: Control<TFieldValues>
  label: string
  size?: 'small' | 'medium'
  options: any[]
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  disabled?: boolean
  labelVariant?: Variant
}

export const FormInputRadio = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  id,
  name,
  control,
  label,
  options,
  rules,
  disabled,
  labelVariant = 'subtitle2',
}: FormInputRadioProps<TFieldValues, TName>) => (
  <div>
    <InputLabel htmlFor={id}>
      <Typography
        variant={labelVariant}
        sx={{ color: 'text.primary', fontWeight: '500' }}
      >
        {label}
      </Typography>
    </InputLabel>
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <RadioGroup value={value} onChange={onChange} id={id} name={name}>
          {options.map((singleOption, index) => (
            <FormControlLabel
              key={index}
              disabled={disabled}
              value={singleOption.value}
              label={singleOption.label}
              control={<Radio />}
            />
          ))}
        </RadioGroup>
      )}
      rules={rules}
    />
  </div>
)
