import {ShelterTagValidation} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import {AaSelect, AaSelectBase, AaSelectProps, AaSelectSimple} from '@/shared/Select/Select'
import React from 'react'

export const ShelterSelectAccepted = (props: Pick<AaSelectSimple<ShelterTagValidation>, 'value' | 'defaultValue' | 'onChange'> & Pick<AaSelectBase, 'label'>) => {
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