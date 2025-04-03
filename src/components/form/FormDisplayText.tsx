import { Box, InputLabel, Typography } from '@mui/material'
import React from 'react'

type FormDisplayProps<> = {
    color:string, backgroundColor: string, borderColor:string, nombre: string, titulo: string, valor: string
}
const FormDisplayText = ({color, backgroundColor, borderColor, nombre, titulo, valor}:FormDisplayProps) => {
    return (
        <>
            <InputLabel htmlFor={`${nombre}`}>
                {(titulo !== '' &&
                    <Typography
                        variant={'subtitle2'}
                        sx={{ color: 'text.primary', fontWeight: '500' }}
                    >
                        {titulo}
                    </Typography>
                )}
            </InputLabel>
            <Box sx={{ p: 2, height: 40, border: '1px solid', margin: 0, backgroundColor: `${backgroundColor}`, color: `${color}`, borderColor: `${borderColor}` }}>{valor}</Box>
        </>
    )
}

export default FormDisplayText
