import {Box, BoxProps, Checkbox, useTheme} from '@mui/material'
import {PartnershipData} from '@/features/Partnership/PartnershipType'
import {Txt} from 'mui-extension'
import {useKoboSchemaContext} from '@/features/Kobo/KoboSchemaContext'
import {UseSetState} from '@/alexlib-labo/useSetState2'

export const PartnershipCard = ({
  partner,
  sx,
  state,
  ...props
}: {
  state: UseSetState<string>
  partner: PartnershipData
} & BoxProps) => {
  const t = useTheme()
  const ctxSchema = useKoboSchemaContext()
  return (
    <Box sx={{display: 'flex', mb: 1, alignItems: 'flex-start', ...sx}} {...props}>
      <Checkbox size="small" checked={state.has(partner.id)} onChange={(e, _) => state.set(partner.id, _)}/>
      <Box>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <Txt size={'small'} truncate bold>{partner.computed.name ?? partner.id}</Txt>
        </Box>
        <Txt color="hint" truncate block size="small">{ctxSchema.translate.choice('Type_of_organization', partner.Type_of_organization)}</Txt>
        {/*<Box sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start'}}>*/}
        {/*<Txt block size="small" color="hint" sx={{*/}
        {/*  borderRadius: '100px',*/}
        {/*  whiteSpace: 'nowrap',*/}
        {/*  overflow: 'hidden',*/}
        {/*  py: .125,*/}
        {/*  px: 1,*/}
        {/*  display: 'flex',*/}
        {/*  maxWidth: 146,*/}
        {/*  background: t.palette.divider,*/}
        {/*  // border: t => '1px solid ' + t.palette.divider*/}
        {/*}}*/}
        {/*>{ctxSchema.translate.choice('Type_of_organization', partner.Type_of_organization)}</Txt>*/}
        {/*</Box>*/}
      </Box>
    </Box>
  )
}