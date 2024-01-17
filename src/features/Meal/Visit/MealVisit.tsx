import React, {useEffect} from 'react'
import {Outlet} from 'react-router-dom'
import {KoboSchemaProvider} from '@/features/Kobo/KoboSchemaContext'
import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboIndex} from '@/KoboIndex'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {MealVisitProvider} from '@/features/Meal/Visit/MealVisitContext'

export const MealVisit = () => {
  const {api} = useAppSettings()
  const fetcherSchema = useFetcher(() => api.koboApi.getForm({id: KoboIndex.byName('meal_visitMonitoring').id}))
  useEffect(() => {
    fetcherSchema.fetch()
  }, [])

  return (
    <>
      {fetcherSchema.entity && (
        <KoboSchemaProvider schema={fetcherSchema.entity}>
          <MealVisitProvider>
            <Outlet/>
          </MealVisitProvider>
        </KoboSchemaProvider>
      )}
    </>
  )
}
