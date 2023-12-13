import {themeLightScrollbar} from '@/core/theme'
import React, {Dispatch, ReactNode, SetStateAction} from 'react'
import {Box, BoxProps} from '@mui/material'
import {DataFilter} from '@/features/Dashboard/helper/dashoardFilterInterface'
import {Enum} from '@alexandreannic/ts-utils'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {DashboardFilterOptions} from '@/features/Dashboard/shared/DashboardFilterOptions'

export const FilterLayout = ({
  before,
  after,
  shape,
  filters,
  setFilters,
  sx,
}: {
  filters: Record<string, string[] | undefined>
  setFilters: Dispatch<SetStateAction<Record<string, undefined | string[]>>>
  before?: ReactNode
  after?: ReactNode
  shape: Record<string, DataFilter.Shape<any>>
} & Pick<BoxProps, 'sx'>) => {
  return (
    <Box sx={{
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
  )
}