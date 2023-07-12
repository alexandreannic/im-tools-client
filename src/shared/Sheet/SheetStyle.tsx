import {GlobalStyles} from '@mui/material'
import React from 'react'

export const koboDatabaseStyle = <GlobalStyles styles={t => ({
  '.table': {
    borderTop: '1px solid ' + t.palette.divider,
    tableLayout: 'fixed',
    borderCollapse: 'collapse',
    borderSpacing: 0,
  },
  '.table tr': {
    whiteSpace: 'nowrap',
  },
  '.table .td-clickable:hover': {
    background: t.palette.action.hover,
  },
  'td.fw': {
    width: '100%',
  },
  '::-webkit-resizer': {
    background: 'invisible',
  },
  '.table td:first-of-type': {
    paddingLeft: 8,
  },
  '.td-center': {
    textAlign: 'center',
  },
  '.td-right': {
    textAlign: 'right',
  },
  '.td-loading': {
    padding: 0,
    border: 'none',
  },
  '.table td, .table th': {
    alignItems: 'center',
    height: 34,
    resize: 'both',
    padding: '2px 2px 2px 2px',
    borderRight: `1px solid ${t.palette.divider}`,
    borderBottom: `1px solid ${t.palette.divider}`,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  '.table th': {
    height: 42,
    zIndex: 2,
    background: t.palette.background.paper,
    top: 0,
    paddingTop: t.spacing(.25),
    paddingBottom: t.spacing(.25),
    position: 'sticky',
    color: t.palette.text.secondary,
  },
})}
/>
//
// export const koboDatabaseStyle = <GlobalStyles styles={t => ({
//   '.table': {
//     borderTop: '1px solid ' + t.palette.divider,
//     tableLayout: 'fixed',
//     // overflowX: 'auto',
//     borderCollapse: 'collapse',
//     borderSpacing: 0,
//     // borderTop: `1px solid ${t.palette.divider}`,
//     // borderLeft: `1px solid ${t.palette.divider}`,
//   },
//   // 'th:first-child': {
//   //   position: 'sticky',
//   //   left: 0,
//   //   zIndex: 2,
//   // },
//   '.th': {
//     position: 'relative',
//     // overflow: 'auto',
//   },
//   '.tr': {
//     // display: 'flex',
//     whiteSpace: 'nowrap',
//     // borderBottom: `1px solid ${t.palette.divider}`,
//   },
//   // '.th-action': {
//   //   position: 'absolute',
//   //   left: 0,
//   //   display: 'none',
//   // },
//   // '.th:hover .th-action': {
//   //   display: 'block',
//   // },
//   // '.th-active': {
//   //   borderBottomColor: t.palette.primary.main,
//   //   boxShadow: `${t.palette.primary.main} 0 -1px 0 0 inset`,
//   // },
//   '.td-clickable:hover': {
//     background: t.palette.action.hover,
//   },
//   '.td.fw': {
//     width: '100%',
//   },
//   '::-webkit-resizer': {
//     background: 'invisible',
//   },
//   '.td:first-of-type': {
//     paddingLeft: 8,
//   },
//   '.td-center': {
//     textAlign: 'center',
//   },
//   '.td-right': {
//     textAlign: 'right',
//   },
//   '.td-loading': {
//     padding: 0,
//     border: 'none',
//   },
//   '.td': {
//     // display: 'inline-flex',
//     alignItems: 'center',
//     height: 34,
//     resize: 'both',
//     padding: '2px 2px 2px 2px',
//     borderRight: `1px solid ${t.palette.divider}`,
//     borderBottom: `1px solid ${t.palette.divider}`,
//     whiteSpace: 'nowrap',
//     // overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     // minWidth: 100,
//     // width: 100,
//   },
//   'thead .th': {
//     height: 42,
//     zIndex: 2,
//     background: t.palette.background.paper,
//     top: 0,
//     paddingTop: t.spacing(.25),
//     paddingBottom: t.spacing(.25),
//     position: 'sticky',
//     color: t.palette.text.secondary,
//   },
// })}
// />
