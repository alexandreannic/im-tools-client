import {red} from '@mui/material/colors'
import {alpha, createTheme, darken, SxProps, Theme} from '@mui/material'
import {ThemeOptions} from '@mui/material/styles/createTheme'
import {lighten} from '@mui/system/colorManipulator'

export const combineSx = (...sxs: (SxProps<Theme> | undefined | false)[]): SxProps<Theme> => {
  return sxs.reduce((res, sx) => (sx !== undefined && sx !== false ? {...res, ...sx} : res), {} as any)
}

export const makeSx = <T>(_: { [key in keyof T]: SxProps<Theme> }) => _
export const makeStyle = (_: SxProps<Theme>) => _

export const sxUtils = makeSx({
  fontBig: {
    fontSize: t => t.typography.fontSize * 1.15,
  },
  fontNormal: {
    fontSize: t => t.typography.fontSize,
  },
  fontSmall: {
    fontSize: t => t.typography.fontSize * 0.85,
  },
  fontTitle: {
    fontSize: t => t.typography.fontSize * 1.3,
  },
  fontBigTitle: {
    fontSize: t => t.typography.fontSize * 1.6,
  },
  tdActions: {
    textAlign: 'right',
  },
  truncate: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  inlineIcon: {
    display: 'inline !important',
    fontSize: 'inherit',
    lineHeight: 1,
    verticalAlign: 'text-top',
  },
  divider: {
    mt: 2,
    mb: 2,
  },
})

export const styleUtils = (t: Theme) => ({
  gridSpacing: 3 as any,
  fontSize: {
    big: t.typography.fontSize * 1.15,
    normal: t.typography.fontSize,
    small: t.typography.fontSize * 0.85,
    title: t.typography.fontSize * 1.3,
    bigTitle: t.typography.fontSize * 1.6,
  },
  spacing: (...args: number[]) => {
    const [top = 0, right = 0, bottom = 0, left = 0] = args ?? [1, 1, 2, 1]
    return `${t.spacing(top)} ${t.spacing(right)} ${t.spacing(bottom)} ${t.spacing(left)}`
  },
  color: {
    success: '#00b79f',
    error: '#cf0040',
    warning: '#FFB900',
    info: '#0288d1',
  },
  truncate: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  } as any,
})

export const defaultSpacing = 8

export const muiTheme = (dark?: boolean): Theme => {
  const defaultRadius = 8
  const fontFamily = '"Open Sans", sans-serif'
  const fontSize = 14
  const mainColor = '#c9000a'
  const colorPrimary = {
    main: mainColor,
    light: alpha(mainColor, .4),
    dark: darken(mainColor, .4),
  }
  const colorSecondary = {
    main: '#1a73e8',
    light: lighten('#1a73e8', 0.3),
    dark: darken('#1a73e8', 0.3),
  }
  const baseTheme = createTheme({
    spacing: defaultSpacing,
    palette: {
      action: {
        focus: alpha(mainColor, .1),
        focusOpacity: .1,
      },
      primary: colorPrimary,
      secondary: colorSecondary,
      error: red,
      mode: dark ? 'dark' : 'light',
      background: {
        // default: dark ? 'black' : 'white',
        default: dark ? '#000' : '#f8f9fa',
        paper: dark ? '#1e1e22' : '#fff',
      }
    },
    shape: {
      borderRadius: defaultRadius,
    },
    typography: {
      fontSize,
      fontFamily,
      fontWeightBold: 500,
      h1: {
        fontSize: '2.4em',
        fontWeight: 500,
      },
      subtitle1: {
        fontSize: '1.5em',
        fontWeight: 500,
      },
      h2: {
        fontSize: '1.7em',
        fontWeight: 500,
      },
      h3: {
        fontWeight: 500,
        fontSize: '1.3em',
      },
    },
  })
  const theme: ThemeOptions = {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box',
          },
          '@font-face': {
            fontFamily: 'Material Icons',
            fontStyle: 'normal',
            fontWeight: 400,
            src: 'url(https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2) format("woff2")',
          },
          '.material-icons': {
            fontFamily: 'Material Icons',
            fontWeight: 'normal',
            fontStyle: 'normal',
            fontSize: 24,
            lineHeight: 1,
            letterSpacing: 'normal',
            textTransform: 'none',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            wordWrap: 'normal',
            direction: 'ltr',
            WebkitFontFeatureSettings: '"liga"',
            WebkitFontSmoothing: 'antialiased',
          },
          '.recharts-surface': {
            overflow: 'visible',
          },
          b: {
            fontWeight: 'bold',
          },
          html: {
            fontSize: baseTheme.typography.fontSize,
            fontFamily,
          },
          button: {
            fontFamily,
          },
          body: {
            color: baseTheme.palette.text.primary,
            fontSize: '1rem',
            lineHeight: '1.5',
            background: baseTheme.palette.background.default,
            margin: 0,
            boxSizing: 'border-box',
          },
          ul: {
            marginTop: '.5em',
          },
          p: {
            ...baseTheme.typography.body1,
            textAlign: 'justify',
          },
          '.link': {
            color: baseTheme.palette.info.main,
            textDecoration: 'underline',
          },
          a: {
            color: 'inherit',
            textDecoration: 'none',
          },
          ':focus': {
            outline: 0,
          },
          ...tableTheme(baseTheme),
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 'bold',
            borderRadius: 20,
          },
          outlinedPrimary: {
            borderColor: baseTheme.palette.divider,
          },
        },
      },
      MuiCard: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            border: 'none',
            // border: `1px solid ${baseTheme.palette.divider}`,
            //       borderRadius: defaultRadius,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 0,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            minHeight: 40,
            minWidth: '80px !important',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          outlined: {
            borderColor: baseTheme.palette.divider,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: '1rem',
            minHeight: 42,
            [baseTheme.breakpoints.up('xs')]: {
              minHeight: 42,
            },
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            paddingRight: defaultSpacing * 2,
            paddingLeft: defaultSpacing * 2,
            paddingBottom: defaultSpacing,
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            paddingRight: defaultSpacing * 2,
            paddingLeft: defaultSpacing * 2,
          }
        }
      },
      MuiFormHelperText: {
        styleOverrides: {
          sizeSmall: {
            marginBottom: -4,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            paddingTop: 0,
            paddingBottom: 0,
            minHeight: 50,
            height: 50,
            paddingRight: 8,
            paddingLeft: 8,
          },
          head: {
            lineHeight: 1.2,
          },
          sizeSmall: {
            height: 40,
            minHeight: 40,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: baseTheme.typography.fontSize,
            fontWeight: 'normal',
          },
        },
      },
      MuiIcon: {
        styleOverrides: {
          root: {
            width: 'auto',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            spacing: 6,
          },
        },
      },
      MuiOutlinedInput: dark ? {} : {
        styleOverrides: {
          root: {
            '&:hover $notchedOutline': {
              borderColor: alpha(colorPrimary.main, 0.7),
            },
          },
          notchedOutline: {
            transition: 'border-color 140ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            background: 'rgba(0,0,0,.02)',
            borderColor: 'rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
  }
  return createTheme({
    ...baseTheme,
    ...theme,
    ...(dark
      ? {
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: '#d9dce0',
            },
          },
        },
      }
      : ({} as any)),
  })
}

const tableTheme = (t: Theme) => ({
  '.table': {
    minWidth: '100%',
    width: 'max-content',
    borderTop: '1px solid ' + t.palette.divider,
    tableLayout: 'fixed',
    borderCollapse: 'collapse',
    borderSpacing: 0,
  },
  '.table tr': {
    whiteSpace: 'nowrap',
  },
  '.table tr:hover': {
    background: t.palette.action.hover,
  },
  '.th-resize': {
    display: 'flex',
    overflow: 'hidden',
    resize: 'horizontal',
    minWidth: 102,
    width: 102,
  },
  'td.fw': {
    width: '100%',
  },
  '::-webkit-resizer': {
    background: 'invisible',
  },
  '.table td:first-of-type, .table th:first-of-type': {
    paddingLeft: 8,
  },
  '.td-sticky-end': {
    boxShadow: t.shadows[1],
    borderLeft: `1px solid ${t.palette.divider}`,
    paddingTop: '1px',
    position: 'sticky',
    right: 0,
    background: t.palette.background.paper,
  },
  '.td-center': {
    textAlign: 'center !important',
  },
  '.td-right': {
    textAlign: 'right !important',
  },
  '.td-loading': {
    padding: 0,
    border: 'none',
  },
  '.table td': {
    maxWidth: 102,
  },
  '.table td, .table th': {
    alignItems: 'left',
    textAlign: 'left',
    height: 32,
    padding: '2px 0px 2px 3px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    borderBottom: `1px solid ${t.palette.divider}`,
    textOverflow: 'ellipsis',
  },
  '.table.borderY td, .table.borderY th': {
    borderRight: `1px solid ${t.palette.divider}`,
    borderBottom: `1px solid ${t.palette.divider}`,
  },
  '.table th': {
    height: 40,
    zIndex: 2,
    minWidth: 0,
    width: 0,
    background: t.palette.background.paper,
    top: 0,
    paddingTop: t.spacing(.25),
    paddingBottom: t.spacing(.25),
    position: 'sticky',
    color: t.palette.text.secondary,
  },
  //
  // 'table.sheet': {
  //   borderCollapse: 'collapse',
  //   borderSpacing: 0,
  // },
  // '.sheet th': {
  //   textAlign: 'left',
  // },
  // '.sheet td': {
  //   padding: '2px',
  //   borderBottom: `1px solid ${baseTheme.palette.divider}`
  //   // background: 'red',
  // },
})
