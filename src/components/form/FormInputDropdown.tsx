import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  PathValue,
} from 'react-hook-form'
import {
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import React from 'react'
import { Variant } from '@mui/material/styles/createTypography'
import { Icono } from '@/components/Icono'

export interface optionType {
  key: string
  value: string
  label: string
}

type FormInputDropdownProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  id: string
  name: TName
  control: Control<TFieldValues>
  label: string
  size?: 'small' | 'medium'
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  disabled?: boolean
  onChange?: (event: SelectChangeEvent) => void
  clearable?: boolean
  bgcolor?: string
  options: optionType[]
  labelVariant?: Variant
}

export const FormInputDropdown = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  id,
  name,
  control,
  label,
  size = 'small',
  rules,
  disabled,
  onChange,
  options,
  clearable,
  bgcolor,
  labelVariant = 'subtitle2',
}: FormInputDropdownProps<TFieldValues, TName>) => {
  const generateSelectOptions = () =>
    options.map((option) => (
      <MenuItem key={option.key} value={option.value}>
        {option.label}
      </MenuItem>
    ))

  return (
    <div>
      <InputLabel htmlFor={id}>
        <Typography
          variant={labelVariant}
          sx={{ pb: 1, color: 'text.primary', fontWeight: '600' }}
        >
          {label}
        </Typography>
      </InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <Select
              id={id}
              name={name}
              sx={{
                width: '100%',
                bgcolor: bgcolor,
                '& .MuiSelect-iconOutlined': {
                  display: field.value && clearable ? 'none' : '',
                },
                '&.Mui-focused .MuiIconButton-root': { color: 'primary.main' },
              }}
              size={size}
              error={!!error}
              disabled={disabled}
              onChange={(event) => {
                if (onChange) {
                  onChange(event)
                }
                field.onChange(event)
              }}
              inputRef={field.ref}
              value={field.value}
              endAdornment={
                field.value && clearable ? (
                  <IconButton
                    sx={{ display: field.value ? '' : 'none' }}
                    onClick={() => {
                      field.onChange('')
                    }}
                    color={'primary'}
                  >
                    <Icono color={'primary'}>clear</Icono>
                  </IconButton>
                ) : undefined
              }
            >
              {generateSelectOptions()}
            </Select>
            {!!error && <FormHelperText error>{error?.message}</FormHelperText>}
          </>
        )}
        defaultValue={'' as PathValue<TFieldValues, TName>}
        rules={rules}
      />
    </div>
  )
}
