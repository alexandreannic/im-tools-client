import {KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'
import {alpha, Box, useTheme} from '@mui/material'
import {DatabaseTable} from '@/features/Database/KoboTable/DatabaseKoboTable'
import {memo, useState} from 'react'
import {SheetFilterValue} from '@/shared/Sheet/util/sheetType'
import {MealVerificationForm} from '@/features/Meal/Verification/Form/MealVerificationForm'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'
import {MealVerificationActivity} from '@/features/Meal/Verification/mealVerificationConfig'

export const MealVerificationFormData = ({
  activity,
  onFiltersChange,
  onDataChange,
}: {
  onFiltersChange: (_: MealVerificationForm['filters']) => void
  onDataChange: (_: MealVerificationForm['answerIds']) => void
  activity: MealVerificationActivity
}) => {
  const [selectedIds, setSelectedIds] = useState<KoboAnswerId[] | undefined>()
  const [selectedFilters, setSelectedFilters] = useState<Record<string, SheetFilterValue> | undefined>()
  const t = useTheme()

  useEffectFn(selectedIds, _ => _ && onDataChange(_))
  useEffectFn(selectedFilters, _ => _ && onFiltersChange(_))

  return (
    <>
      <Box sx={{
        p: 1,
        fontWeight: t.typography.fontWeightBold,
        borderRadius: t.shape.borderRadius + 'px',
        mb: 1,
        background: alpha(t.palette.primary.main, .1),
        color: t.palette.primary.main,
      }}>
        {selectedIds?.length} Selected
      </Box>
      <Box sx={{border: '1px solid ' + t.palette.divider, borderRadius: t.shape.borderRadius + 'px'}}>
        <DatabaseTable
          overrideEditAccess={false}
          formId={activity.registration.koboFormId}
          onFiltersChange={setSelectedFilters}
          dataFilter={activity.registration.filters}
          onDataChange={data => setSelectedIds(data.filteredData?.map(_ => _.id))}
        />
      </Box>
    </>
  )
}