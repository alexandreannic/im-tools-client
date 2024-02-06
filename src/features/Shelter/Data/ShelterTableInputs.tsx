import {ShelterProgress, ShelterTagValidation} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import {AaSelect, AaSelectBase, AaSelectSimple} from '@/shared/Select/Select'
import React from 'react'
import {ShelterContractor, ShelterContractorPrices} from '@/core/sdk/server/kobo/custom/ShelterContractor'
import {Enum} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {Shelter_TA} from '@/core/sdk/server/kobo/generatedInterface/Shelter_TA'

export const ShelterSelectStatus = (props: Pick<AaSelectSimple<ShelterProgress>, 'value' | 'defaultValue' | 'onChange'> & Pick<AaSelectBase, 'disabled' | 'sx' | 'label'>) => {
  const {m} = useI18n()
  return (
    <AaSelect<ShelterProgress>
      multiple={false}
      showUndefinedOption
      {...props}
      options={Enum.values(ShelterProgress).map(_ => ({value: _, children: m._shelter.progress[_],}))}
    />
  )
}

export const ShelterSelectAccepted = (props: Pick<AaSelectSimple<ShelterTagValidation>, 'value' | 'defaultValue' | 'onChange'> & Pick<AaSelectBase, 'disabled' | 'sx' | 'label'>) => {
  return (
    <AaSelect<ShelterTagValidation>
      multiple={false}
      showUndefinedOption
      options={[
        {value: ShelterTagValidation.Accepted, children: <TableIcon color="success">check_circle</TableIcon>},
        {value: ShelterTagValidation.Rejected, children: <TableIcon color="error">cancel</TableIcon>},
        {value: ShelterTagValidation.Pending, children: <TableIcon color="warning">schedule</TableIcon>},
      ]}
      {...props}
    />
  )
}

export const ShelterSelectContractor = ({
  oblast,
  ...props
}: Pick<AaSelectSimple<ShelterContractor>, 'value' | 'defaultValue' | 'onChange'> & Pick<AaSelectBase, 'disabled' | 'sx' | 'label'> & {
  oblast?: keyof typeof Shelter_TA.options['ben_det_oblast']
}) => {
  return (
    <AaSelect
      multiple={false}
      showUndefinedOption
      options={ShelterContractorPrices.findContractor({oblast, lot: 1})}
      {...props}
    />
  )
}