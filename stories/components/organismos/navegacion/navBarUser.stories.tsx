import { Meta, StoryFn } from '@storybook/react'
import { NavbarUser } from '@/components/navbars/NavbarUser'
import { DemoNavbarUser } from './demoNavbarUser'
import { DemoNavbarUserDefault } from './demoNavbarUserDefault'
// import { CustomFrame } from '../../../utils/CustomFrame'

export default {
  title: 'Organismos/Navegación/NavBarUser',
  component: DemoNavbarUserDefault,
  decorators: [
    (Story) => (
      <div style={{ margin: '65px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    accion: {
      type: 'function',
      control: () => {},
    },
  },
  parameters: {
    docs: {
      description: {
        component: `Este código crea una barra de navegación en React con varios botones y menús desplegables para el usuario, utilizando MUI y React hooks y componentes. Permite cambiar el tema de la aplicación, acceder a la información del perfil del usuario y mostrar un diálogo de ayuda. También utiliza diferentes contextos para el estado de la aplicación.`,
      },
    },
  },
} as Meta<typeof DemoNavbarUserDefault>
/* const Template1: StoryFn<typeof NavbarUser> = () => {
  return (
    <CustomFrame height="65px" padding={'10px'}>
      <NavbarUser />
    </CustomFrame>
  )
}
export const NavBarUserDefault = Template.bind({})
NavBarUserDefault.storyName = 'NavBarUser' */

// DemoNavbarDefault
const Template2: StoryFn<typeof NavbarUser> = () => {
  return (
    <DemoNavbarUserDefault
      nombres={'Luis'}
      primerApellido={'Perez'}
      segundoApellido={'Velasco'}
      rol={'Administrador'}
      entidad={'Ministerio de Salud'}
    />
  )
}
export const NavBarUserDemo = Template2.bind({})
NavBarUserDemo.storyName = 'NavBarUser por defecto'
//DemoNavbarUser
const Template3: StoryFn<typeof NavbarUser> = () => {
  return (
    <DemoNavbarUser
      nombres={'Luis'}
      primerApellido={'Perez'}
      segundoApellido={'Velasco'}
      rol={'Supervisor'}
      sistema={'Sistema Único de Salud'}
      entidad={'Ministerio de Salud'}
    />
  )
}
export const NavBarUserNameRol = Template3.bind({})
NavBarUserNameRol.storyName = 'NavBarUser con nombre completo, rol y entidad'
//
const Template4: StoryFn<typeof NavbarUser> = () => {
  return (
    <DemoNavbarUser
      nombres={'Alberto'}
      primerApellido={'Mendoza'}
      segundoApellido={'Urzagaste'}
      rol={'Técnico'}
      sistema={'Entel S.A.'}
    />
  )
}
export const NavBarUserEntity = Template4.bind({})
NavBarUserEntity.storyName = 'NavBarUser sólo con rol'
//
const Template5: StoryFn<typeof NavbarUser> = () => {
  return (
    <DemoNavbarUser
      nombres={'Fernanda'}
      primerApellido={'Segovia'}
      segundoApellido={'Pacheco'}
      sistema={'Gob.bo'}
    />
  )
}
export const NavBarUserName = Template5.bind({})
NavBarUserName.storyName = 'NavBarUser sólo con nombre'
//
const Template6: StoryFn<typeof NavbarUser> = () => {
  return (
    <DemoNavbarUser
      nombres={'Manuel'}
      primerApellido={'Espada'}
      segundoApellido={'Ramos'}
      rol={'Administrador'}
      sistema={'Consume lo Nuestro'}
      buscador={true}
    />
  )
}
export const NavBarStore = Template6.bind({})
NavBarStore.storyName = 'NavBarUser con buscador'
