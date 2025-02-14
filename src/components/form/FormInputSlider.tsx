import React, { useEffect } from 'react'

import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  PathValue,
} from 'react-hook-form'
import { InputLabel, Slider, Typography } from '@mui/material'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import { Variant } from '@mui/material/styles/createTypography'
import { UseFormSetValue } from 'react-hook-form/dist/types/form'

type FormInputSliderProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  id: string
  name: TName
  control: Control<TFieldValues>
  label: string
  setValue: UseFormSetValue<TFieldValues>
  size?: 'small' | 'medium'
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  labelVariant?: Variant
}

export const FormInputSlider = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  id,
  name,
  control,
  setValue,
  label,
  size = 'small',
  rules,
  labelVariant = 'subtitle2',
}: FormInputSliderProps<TFieldValues, TName>) => {
  const [sliderValue, setSliderValue] = React.useState(0)

  useEffect(() => {
    if (sliderValue)
      setValue(name, sliderValue as PathValue<TFieldValues, TName>)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderValue])

  const handleChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number)
  }

  return (
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
        render={() => (
          <Slider
            id={id}
            name={name}
            size={size}
            sx={{ width: '100%' }}
            value={sliderValue}
            onChange={handleChange}
          />
        )}
        rules={rules}
      />
    </div>
  )
}
