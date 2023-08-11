import {AAIconBtn, AAIconBtnProps} from '@/shared/IconBtn'
import React from 'react'
import {useSession} from '@/core/Session/SessionContext'
import {Box, Popover} from '@mui/material'
import {useI18n} from '@/core/i18n'
import {Txt} from 'mui-extension'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {alpha} from '@mui/material/styles'

export const AppHeaderMenu = ({sx, ...props}: Partial<AAIconBtnProps>) => {
  const session = useSession()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const open = (!!anchorEl)
  const {m} = useI18n()
  if (!session.session) {
    return <></>
  }
  return (
    <>
      <AAIconBtn
        children="person"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          '&:hover': {
            background: t => alpha(t.palette.primary.main, .6),
          },
          background: t => t.palette.primary.main,
          color: t => t.palette.primary.contrastText,
          ...sx,
        }}
        {...props}
      />
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={() => setAnchorEl(null)}
        open={open}
      >
        <Box sx={{textAlign: 'center'}}>
          <Box sx={{p: 2}}>
            <Txt block size="big">{session.session.name}</Txt>
            <Txt block color="hint">{session.session.email}</Txt>
          </Box>
          <AaBtn icon="logout" variant="outlined" onClick={session.logout} sx={{mb: 2}}>{m.logout}</AaBtn>
        </Box>
      </Popover>
    </>
  )
}