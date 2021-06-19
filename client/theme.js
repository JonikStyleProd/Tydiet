import { createMuiTheme } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'

const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
      light: '#5c67a3',
      main: '#3f4771',
      dark: '#304ffe',
      contrastText: '#fff',
    },
    secondary: {
      light: '#01579b',
      main: '#01579b',
      dark: '#0288d1',
      contrastText: '#fff',
    },
      openTitle: '#3f4771',
      protectedTitle: green['A700'],
      type: 'light'
    }
  })

  export default theme