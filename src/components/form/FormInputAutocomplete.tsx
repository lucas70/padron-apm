import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  PathValue,
} from 'react-hook-form'
import {
  Autocomplete,
  AutocompleteValue,
  Box,
  CircularProgress,
  FilterOptionsState,
  FormHelperText,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import React, { Fragment } from 'react'
import { Variant } from '@mui/material/styles/createTypography'
import { AutocompleteInputChangeReason } from '@mui/base/useAutocomplete/useAutocomplete'

import { OutlinedInputProps } from '@mui/material/OutlinedInput'
import { Icono } from '@/components/Icono'
import { imprimir } from '@/utils/imprimir'
import { optionType } from '@/components/form/FormInputDropdown'

export type CustomOptionType<K> = K & { key: string }

type FormInputDropdownAutocompleteProps<
  K,
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  id: string
  name: TName
  control: Control<TFieldValues>
  label: string
  multiple?: boolean
  freeSolo?: boolean
  forcePopupIcon?: boolean
  searchIcon?: boolean
  size?: 'small' | 'medium'
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  disabled?: boolean
  onChange?: (keys: AutocompleteValue<unknown, false, false, false>) => void
  InputProps?: Partial<OutlinedInputProps>
  filterOptions?: (
    options: CustomOptionType<K>[],
    state: FilterOptionsState<CustomOptionType<K>>
  ) => CustomOptionType<K>[]
  onInputChange?: (
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => void
  isOptionEqualToValue?: (
    option: CustomOptionType<K>,
    value: CustomOptionType<K>
  ) => boolean
  getOptionLabel: (option: CustomOptionType<K>) => string
  renderOption: (option: CustomOptionType<K>) => React.ReactNode
  newValues?: boolean
  clearable?: boolean
  bgcolor?: string
  loading?: boolean
  selectOnFocus?: boolean
  options: CustomOptionType<K>[]
  labelVariant?: Variant
}

export const FormInputAutocomplete = <
  K,
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  id,
  name,
  control,
  label,
  multiple,
  freeSolo,
  forcePopupIcon,
  searchIcon,
  size = 'small',
  rules,
  disabled,
  onChange,
  InputProps,
  filterOptions,
  onInputChange,
  isOptionEqualToValue,
  getOptionLabel,
  renderOption,
  newValues,
  options,
  bgcolor,
  loading,
  selectOnFocus,
  labelVariant = 'subtitle2',
}: FormInputDropdownAutocompleteProps<K, TFieldValues, TName>) => {
  const [value, setValue] = React.useState<string>('')

  return (
    <>
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
        render={({ field, fieldState: { error } }) => (
          <>
            <Autocomplete
              id={id}
              multiple={multiple}
              freeSolo={freeSolo}
              forcePopupIcon={forcePopupIcon}
              size={size}
              disabled={disabled}
              value={field.value}
              options={options}
              selectOnFocus={selectOnFocus}
              filterSelectedOptions={true}
              filterOptions={filterOptions}
              inputValue={value}
              onInputChange={(event, newInputValue, reason) => {
                if (onInputChange) {
                  onInputChange(event, newInputValue, reason)
                }
                setValue(newInputValue)
              }}
              isOptionEqualToValue={isOptionEqualToValue}
              onChange={(_event, newValue) => {
                if (onChange) {
                  onChange(newValue)
                }
                field.onChange(newValue)
              }}
              getOptionLabel={(option) => {
                if (typeof option == 'string') return option
                return getOptionLabel(option) ?? ''
              }}
              renderOption={(props, option) => {
                return <li {...props}>{renderOption(option)}</li>
              }}
              renderInput={(params) => {
                params.inputProps.onKeyDown = (
                  event: React.KeyboardEvent<HTMLInputElement>
                ) => {
                  if (!newValues) {
                    event.stopPropagation()
                    return
                  }
                  switch (event.key) {
                    case 'Enter':
                    case ',': {
                      event.stopPropagation()
                      event.preventDefault()
                      const inputValue = event.currentTarget.value

                      const newOption: optionType = {
                        key: inputValue.trim(),
                        label: inputValue.trim(),
                        value: inputValue.trim(),
                      }

                      imprimir(`newOption: `, newOption)

                      if (!multiple) {
                        const opcionTemp = field.value as optionType
                        field.onChange(opcionTemp)
                        setValue('')
                      } else {
                        const opcionesTemp = field.value as Array<optionType>

                        const registrado = opcionesTemp.some(
                          (value1) => value1.value == newOption.value
                        )

                        imprimir(`registrado: `, registrado)

                        if (!registrado && ![''].includes(newOption.value)) {
                          // Se agregara sí es que no fue agregado antes
                          field.onChange([...field.value, newOption])
                        }
                        setValue('')
                      }

                      break
                    }
                    default:
                  }
                }
                return (
                  <TextField
                    {...params}
                    error={!!error}
                    inputRef={field.ref}
                    sx={{
                      width: '100%',
                      bgcolor: bgcolor,
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <Fragment>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </Fragment>
                      ),
                      startAdornment: (
                        <Fragment>
                          {searchIcon && (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                pl: 1,
                              }}
                            >
                              <Icono color="secondary" fontSize="small">
                                search
                              </Icono>
                            </Box>
                          )}
                          {params.InputProps.startAdornment}
                        </Fragment>
                      ),
                      ...InputProps,
                    }}
                  />
                )
              }}
            />
            {!!error && <FormHelperText error>{error?.message}</FormHelperText>}
          </>
        )}
        defaultValue={[] as PathValue<TFieldValues, TName>}
        rules={rules}
      />
    </>
  )
}
