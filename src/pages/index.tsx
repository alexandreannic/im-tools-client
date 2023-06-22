import {useI18n} from '@/core/i18n'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {useMsal} from '@azure/msal-react'
import {Box} from '@mui/material'

const Index = () => {
  const {m} = useI18n()
  const msal = useMsal()

  return (
    <>
      <Box>test</Box>
    </>
  )
}

export default Index