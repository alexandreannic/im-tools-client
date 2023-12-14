import {themeLightScrollbar} from '@/core/theme'
import React, {Dispatch, ReactNode, SetStateAction} from 'react'
import {Box, BoxProps} from '@mui/material'
import {DataFilter} from '@/features/Dashboard/helper/dashoardFilterInterface'
import {Enum} from '@alexandreannic/ts-utils'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {DashboardFilterOptions} from '@/features/Dashboard/shared/DashboardFilterOptions'
import {AAIconBtn} from '@/shared/IconBtn'
import {useI18n} from '@/core/i18n'
import {FilterLayoutPopup} from '@/features/Dashboard/helper/FilterLayoutPopup'

export interface FilterLayoutProps extends Pick<BoxProps, 'sx'> {
  onClear?: () => void
  filters: Record<string, string[] | undefined>
  setFilters: Dispatch<SetStateAction<Record<string, undefined | string[]>>>
  before?: ReactNode
  after?: ReactNode
  shape: Record<string, DataFilter.Shape<any>>
}

export const FilterLayout = ({sx, hidePopup, ...props}: FilterLayoutProps & {
  hidePopup?: boolean
}) => {
  const {m} = useI18n()
  const {
    before,
    after,
    shape,
    filters,
    setFilters,
    onClear,
  } = props
  return (
    <Box sx={{
      maxWidth: '100%',
      display: 'flex',
      alignItems: 'center',
    }}>
      <Box sx={{
        flex: 1,
        mt: -1,
        mb: 1,
        pt: 2,
        pb: .5,
        display: 'flex',
        alignItems: 'center',
        ...themeLightScrollbar,
        whiteSpace: 'nowrap',
        '& > *': {
          mr: .5,
        },
        ...sx as any,
      }}>
        {before}
        {Enum.entries(shape).map(([name, shape]) =>
          <DebouncedInput<string[]>
            key={name}
            debounce={50}
            value={filters[name]}
            onChange={_ => setFilters((prev: any) => ({...prev, [name]: _}))}
          >
            {(value, onChange) =>
              <DashboardFilterOptions
                icon={shape.icon}
                value={value ?? []}
                label={shape.label}
                addBlankOption={shape.addBlankOption}
                options={shape.getOptions}
                onChange={onChange}
              />
            }
          </DebouncedInput>
        )}
        {after}
      </Box>
      <Box sx={{
        alignSelf: 'flex-start',
        display: 'flex',
        alignItems: 'center',
        mt: 1.25,
      }}>
        {!hidePopup && (
          <FilterLayoutPopup {...props} onConfirm={setFilters} filters={filters} onClear={onClear}/>
        )}
        {onClear && (
          <AAIconBtn children="clear" tooltip={m.clearFilter} onClick={onClear}/>
        )}
      </Box>
    </Box>
  )
}