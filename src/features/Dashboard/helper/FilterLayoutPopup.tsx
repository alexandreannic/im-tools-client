import {Box, Icon, Popover} from '@mui/material'
import React, {useEffect, useState} from 'react'
import {AAIconBtn} from '@/shared/IconBtn'
import {Enum} from '@alexandreannic/ts-utils'
import {FilterLayoutProps} from '@/features/Dashboard/helper/FilterLayout'
import {DataFilter} from '@/features/Dashboard/helper/dashoardFilterInterface'
import {AaSelectMultiple} from '@/shared/Select/AaSelectMultiple'
import {Txt} from 'mui-extension'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {useI18n} from '@/core/i18n'

export const FilterLayoutPopup = ({
  before,
  after,
  sx,
  shape,
  filters,
  setFilters,
  onClear,
  onConfirm,
  onClose,
}: FilterLayoutProps & {
  onConfirm: (_: DataFilter.Filter) => void
  onClose?: () => void
  onClear?: () => void
}) => {
  const {m} = useI18n()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const [innerFilters, setInnerFilters] = useState(filters)

  useEffect(() => setInnerFilters(filters), [filters])

  const open = (!!anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
    onClose?.()
  }

  const handleSubmit = () => {
    onConfirm(innerFilters)
    handleClose()
  }

  return (
    <Box sx={{position: 'relative', ...sx}}>
      <AAIconBtn
        children="tune"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      />
      <Popover
        disableScrollLock={true}
        open={open}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        sx={{
          boxShadow: t => t.shadows[4],
          overflow: 'hidden',
          // border: 'none',
          // position: 'absolute',
          // top: 46,
        }}
      >
        <Box sx={{
          p: 2,
          overflowY: 'auto',
          // maxHeight: '50vh',
        }}>
          <Box sx={{mb: 1}}>{before}</Box>
          {Enum.entries(shape).map(([name, shape]) =>
            <Box key={name} sx={{display: 'flex', alignItems: 'center', mb: 2}}>
              <Icon color="disabled">{shape.icon}</Icon>
              <Txt truncate sx={{mx: 1, width: 140, maxWidth: 140}}>{shape.label}</Txt>
              <Box sx={{flex: 1}}>
                <AaSelectMultiple
                  sx={{maxWidth: 250, width: 250}}
                  value={innerFilters[name] ?? []}
                  onChange={_ => setInnerFilters((prev: any) => ({...prev, [name]: _}))}
                  options={shape.getOptions()?.map(_ => ({value: _.value, children: _.label})) ?? []}
                />
              </Box>
            </Box>
          )}
          <Box sx={{mt: 1}}>{after}</Box>
          <Box sx={{display: 'flex', mt: 1}}>
            <AaBtn color="primary" onClick={() => setInnerFilters({})}>{m.reinitialize}</AaBtn>
            <AaBtn color="primary" onClick={handleClose} sx={{marginLeft: 'auto', mr: 1}}>{m.close}</AaBtn>
            <AaBtn color="primary" variant="contained" onClick={handleSubmit}>{m.confirm}</AaBtn>
          </Box>
        </Box>
      </Popover>
    </Box>
  )
}