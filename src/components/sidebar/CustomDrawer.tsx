import {
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material'
import { SxProps } from '@mui/system'
import Toolbar from '@mui/material/Toolbar'
import React, { ReactNode } from 'react'
import { Icono } from '@/components/Icono'
import { ModuloType } from '@/app/login/types/loginTypes'
import CustomBadge from '@/components/CustomBadge'
import { versionNumber } from '@/utils'

export type SidebarModuloType = ModuloType & {
  showed?: boolean
  open?: boolean
}
export const CustomDrawer = ({
  variant,
  open,
  onClose,
  sx,
  modulos,
  setModulos,
  navigateTo,
  rutaActual,
  badgeVariant,
  checkContentBadge,
}: {
  variant?: 'permanent' | 'persistent' | 'temporary'
  open?: boolean | undefined
  onClose?: () => void
  sx?: SxProps<Theme>
  modulos: Array<SidebarModuloType>
  setModulos: (modulos: Array<SidebarModuloType>) => void
  navigateTo: (url: string) => void
  rutaActual: string
  badgeVariant: string
  checkContentBadge: (id: string) => ReactNode
}) => {
  const rutaActiva = (routeName: string, currentRoute: string) =>
    currentRoute.includes(routeName, 0)

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={sx}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        {modulos.map((modulo, index) => (
          <div key={`div-${index}`}>
            <Box
              sx={{
                display: 'flex',
                m: 0,
                mx: 0.4,
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => {
                const tempModulos = structuredClone(modulos)
                tempModulos[index].open = !tempModulos[index].open
                setModulos(tempModulos)
              }}
              onMouseOver={() => {
                const tempModulos = structuredClone(modulos)
                tempModulos[index].showed = true
                setModulos(tempModulos)
              }}
              onMouseLeave={() => {
                const tempModulos = structuredClone(modulos)
                tempModulos[index].showed = false
                setModulos(tempModulos)
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  m: 0,
                  borderRadius: 1,
                  alignItems: 'center',
                  margin: '12px 6px',
                  width: '100%',
                }}
              >
                <Box width={'15px'} />
                <Tooltip
                  title={modulo.propiedades.descripcion}
                  enterDelay={1000}
                  placement={'left'}
                >
                  <Typography
                    variant={'body2'}
                    color={'text.secondary'}
                    sx={{ fontWeight: '400' }}
                  >
                    {`${modulo.label}`}
                  </Typography>
                </Tooltip>

                <Box sx={{ flexGrow: 1 }} />
                {(modulo.showed || !modulo.open) && (
                  <Icono
                    fontSize={'small'}
                    sx={{ p: 0, m: 0, mx: 1.5 }}
                    color={'action'}
                  >
                    {modulo.open ? 'expand_more' : 'navigate_next'}
                  </Icono>
                )}
              </Box>
            </Box>

            <Collapse in={modulo.open}>
              <List
                key={`submodulos-${index}`}
                component="ul"
                style={{ cursor: 'pointer' }}
                sx={{ pt: 0, pb: 0 }}
              >
                {modulo.subModulo.map((subModuloItem, indexSubModulo) => (
                  <ListItemButton
                    id={subModuloItem.url}
                    key={`submodulo-${index}-${indexSubModulo}`}
                    component="li"
                    about={subModuloItem.propiedades.descripcion}
                    selected={rutaActiva(subModuloItem.url, rutaActual)}
                    sx={{
                      px: 0.5,
                      mx: 1.5,
                      justifyContent: 'space-between',
                    }}
                    onClick={() => navigateTo(subModuloItem.url)}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        m: 0,
                        borderRadius: 1,
                        alignItems: 'center',
                      }}
                    >
                      <Box width={'9px'} />
                      <Icono
                        color={
                          rutaActiva(subModuloItem.url, rutaActual)
                            ? 'primary'
                            : 'action'
                        }
                        fontSize={'medium'}
                      >
                        {subModuloItem.propiedades.icono}
                      </Icono>
                      <Box width={'12px'} />
                      <Tooltip
                        title={subModuloItem.propiedades.descripcion}
                        enterDelay={1000}
                        placement={'left'}
                      >
                        <Typography
                          variant={'body2'}
                          sx={{
                            fontWeight: rutaActiva(
                              subModuloItem.url,
                              rutaActual
                            )
                              ? '600'
                              : '500',
                          }}
                          color={
                            rutaActiva(subModuloItem.url, rutaActual)
                              ? 'primary'
                              : undefined
                          }
                        >
                          {`${subModuloItem.label}`}
                        </Typography>
                      </Tooltip>
                    </Box>

                    <Box sx={{ mr: 2.5 }}>
                      <CustomBadge
                        content={checkContentBadge(subModuloItem.url)}
                        variante={badgeVariant}
                        sx={{
                          fontSize: '10px',
                          padding: '11px 6px',
                          borderRadius: '60px',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
            {!modulo.open && <Divider sx={{ mx: 1 }} />}
          </div>
        ))}
      </Box>
      <Box sx={{ pb: 2 }} display="flex" flex="1" justifyContent="space-around">
        <Box sx={{ alignSelf: 'flex-end' }}>
          <Typography color="text.secondary" variant={'body2'}>
            {`v${versionNumber()}`}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  )
}
