import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  PathValue,
} from 'react-hook-form'
import {
  Box,
  Checkbox,
  Chip,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import { optionType } from './FormInputDropdown'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import React from 'react'
import { Variant } from '@mui/material/styles/createTypography'

type FormInputDropdownMultipleProps<
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
  onChange?: (event: SelectChangeEvent<string[]>) => void
  variant?: 'standard' | 'outlined' | 'filled'
  bgcolor?: string
  options: optionType[]
  labelVariant?: Variant
}

export const FormInputDropdownMultiple = <
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
  variant,
  bgcolor,
  options,
  labelVariant = 'subtitle2',
}: FormInputDropdownMultipleProps<TFieldValues, TName>) => {
  const generateSelectOptions = (value: string[]) =>
    options.map((option) => (
      <MenuItem key={option.key} value={option.value}>
        <Checkbox checked={value.indexOf(option.value) >= 0} />
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
              }}
              size={size}
              error={!!error}
              variant={variant}
              renderValue={(selecteds: string[]) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selecteds.map((selected) => (
                    <Chip
                      key={selected}
                      label={
                        options.find((option) => option.value == selected)
                          ?.label
                      }
                    />
                  ))}
                </Box>
              )}
              onChange={(event) => {
                if (onChange) {
                  onChange(event)
                }
                field.onChange(event)
              }}
              inputRef={field.ref}
              value={field.value}
              disabled={disabled}
              multiple
            >
              {generateSelectOptions(field.value)}
            </Select>

            {!!error && <FormHelperText error>{error?.message}</FormHelperText>}
          </>
        )}
        defaultValue={[] as PathValue<TFieldValues, TName>}
        rules={rules}
      />
    </div>
  )
}
