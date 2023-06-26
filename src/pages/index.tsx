import {useI18n} from '@/core/i18n'
import {useMsal} from '@azure/msal-react'
import {HeaderItem} from '@/shared/Layout/Header/HeaderItem'
import {NavLink} from 'react-router-dom'
import React from 'react'
import {Box} from '@mui/material'

const Index = () => {
  const {m} = useI18n()
  const msal = useMsal()

  return (
    <>

      <Box>
        <a href="/activity-info">
          Activity-Info
        </a>
      </Box>
      <Box>
        <a href="/snapshot">
          Snapshots
        </a>
      </Box>
      <Box>
        <a href="/database">
          Database
        </a>
      </Box>
      <Box>
        <a href="/dashboard">
          Dashboards
        </a>
      </Box>
      <Box>
        <a href="/mpca">
          MPCA
        </a>
      </Box>
      <Box>
        <a href="/map">
          Map
        </a>
      </Box>
      <Box>
        <a href="/playground">
          Playground
        </a>
      </Box>

    </>
  )
}

export default Index