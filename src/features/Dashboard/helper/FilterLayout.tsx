import {themeLightScrollbar} from '@/core/theme'
import React, {Dispatch, ReactNode, SetStateAction} from 'react'
import {Box, BoxProps} from '@mui/material'
import {DataFilter} from '@/features/Dashboard/helper/dashoardFilterInterface'
import {Enum} from '@alexandreannic/ts-utils'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {DashboardFilterOptions} from '@/features/Dashboard/shared/DashboardFilterOptions'
import {AAIconBtn} from '@/shared/IconBtn'
import {useI18n} from '@/core/i18n'

export const FilterLayout = ({
  before,
  after,
  shape,
  filters,
  setFilters,
  onClear,
  sx,
}: {
  onClear?: () => void
  filters: Record<string, string[] | undefined>
  setFilters: Dispatch<SetStateAction<Record<string, undefined | string[]>>>
  before?: ReactNode
  after?: ReactNode
  shape: Record<string, DataFilter.Shape<any>>
} & Pick<BoxProps, 'sx'>) => {
  const {m} = useI18n()
  return (
    <Box sx={{
      maxWidth: '100%',
      display: 'flex',
      alignItems: 'center',
    }}>
      <Box sx={{
        flex: 1,
        mt: -1,
        pt: 1,
        pb: 1,
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
      {onClear && (
        <AAIconBtn sx={{ml: 1, mb: 1.5}} children="clear" tooltip={m.clearFilter} onClick={onClear}/>
      )}
    </Box>
  )
}