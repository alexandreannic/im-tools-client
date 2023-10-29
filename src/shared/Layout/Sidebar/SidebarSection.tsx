import {Box, Collapse} from '@mui/material'
import {ReactNode} from 'react'
import {Txt} from 'mui-extension'
import {AAIconBtn} from '@/shared/IconBtn'
import {usePersistentState} from '@/alexlib-labo/usePersistantState'

export const SidebarSection = ({
  title,
  children,
}: {
  title: ReactNode
  children: ReactNode
}) => {
  const [open, setOpen] = usePersistentState(true, {'sidebar-section-' + title)
  return (
    <Box sx={{
      mt: .5,
      pb: .5,
      '&:not(:last-of-type)': {
        borderBottom: t => `1px solid ${t.palette.divider}`,
      }
    }}>
      <Box sx={{pl: 1}}>
        <AAIconBtn onClick={() => setOpen(_ => !_)} size="small" sx={{mr: 1}}>
          {open ? 'expand_less' : 'expand_more'}
        </AAIconBtn>
        <Txt uppercase bold color="disabled" sx={{fontSize: '.825em'}}>{title}</Txt>
      </Box>
      <Collapse in={open}>
        {children}
      </Collapse>
    </Box>
  )
}