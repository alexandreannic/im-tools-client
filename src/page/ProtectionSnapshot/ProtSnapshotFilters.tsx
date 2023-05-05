import React from 'react'
import {Box, BoxProps, Divider, Icon, Switch} from '@mui/material'
import {UkraineMap} from '../../shared/UkraineMap/UkraineMap'
import {ItSelect} from '../../shared/Select/Select'
import {KoboFormProtHH} from '../../core/koboModel/koboFormProtHH'
import {Enum} from '@alexandreannic/ts-utils'
import {IconBtn, Txt} from 'mui-extension'
import {Btn} from '../../shared/Btn/Btn'
import {useI18n} from '../../core/i18n'
import {protSnapshotInitialFilters, ProtSnapshotSlideProps} from './ProtSnapshot'
import {PeriodPicker} from '../../shared/PeriodPicker/PeriodPicker'
import {NavLink} from 'react-router-dom'

export const ProtSnapshotFilters = ({
  filters,
  onFilter,
  customFilters,
  onCustomFilters,
  onFilterOblast,
  current,
  sx,
  ...props
}: ProtSnapshotSlideProps & BoxProps) => {
  const {m} = useI18n()
  return (
    <Box {...props} sx={{
      ...sx,
      p: 2,
      // position: 'fixed',
      // top: 0,
      // left: 0,
      width: 300,
    }}>
      <Box sx={{mb: 2, }}>
        <NavLink to="/">
          <IconBtn color="primary">
            <Icon>arrow_back</Icon>
          </IconBtn>
        </NavLink>
        <Btn
          sx={{marginLeft: 'auto', ml: 2}}
          color="primary"
          variant="contained"
          icon="download"
          onClick={() => window.print()}
        >
          Download PDF
        </Btn>
      </Box>
      <Divider sx={{mb: 3}}/>
      <Btn
        icon="clear"
        color="primary"
        onClick={() => onCustomFilters(protSnapshotInitialFilters)}
      >
        Clear filters
      </Btn>
      <UkraineMap
        legend={false}
        data={current.computed.oblastCurrent}
        onSelect={onFilterOblast('_4_What_oblast_are_you_from_iso')}
        sx={{width: '260px', mb: 1}}
      />
      <PeriodPicker
        value={[customFilters.start, customFilters.end]}
        onChange={([start, end]) => onCustomFilters(prev => ({
          ...prev,
          start: start ?? prev.start,
          end: end ?? prev.end
        }))}
        sx={{mb: 3}}
      />
      <Txt block color="hint" sx={{mb: 1}}>Compare to...</Txt>
      <PeriodPicker
        value={[customFilters.previousPeriodStart, customFilters.previousPeriodEnd]}
        onChange={([previousPeriodStart, previousPeriodEnd]) => onCustomFilters(prev => ({
          ...prev,
          previousPeriodStart: previousPeriodStart ?? prev.previousPeriodStart,
          previousPeriodEnd: previousPeriodEnd ?? prev.previousPeriodEnd
        }))}
        sx={{mb: 3}}
      />
      <ItSelect<KoboFormProtHH.GetType<'vulnerability'>>
        sx={{mb: 3}}
        multiple
        label={m.vulnerabilities}
        value={filters.C_Vulnerability_catergories_that ?? []}
        onChange={_ => onFilter(prev => ({...prev, C_Vulnerability_catergories_that: _}))}
        options={Enum.keys(m.protHHSnapshot.enum.vulnerability).map(v =>
          ({value: v, children: m.protHHSnapshot.enum.vulnerability[v]})
        )}
      />
      <ItSelect<KoboFormProtHH.Status>
        sx={{mb: 3}}
        multiple
        label={m.status}
        value={filters._12_Do_you_identify_as_any_of ?? []}
        onChange={_ => onFilter(prev => ({...prev, _12_Do_you_identify_as_any_of: _}))}
        options={Enum.values(KoboFormProtHH.Status).map(v =>
          ({value: v, children: m.statusType[v]})
        )}
      />
      {/*<AaSelect<OblastISO>*/}
      {/*  multiple*/}
      {/*  label={m.oblast}*/}
      {/*  value={filters._4_What_oblast_are_you_from_iso ?? []}*/}
      {/*  onChange={_ => setFilters(prev => ({...prev, _4_What_oblast_are_you_from_iso: _}))}*/}
      {/*  options={selectedCurrentOblastISOs.map(iso => ({*/}
      {/*    value: iso,*/}
      {/*    children: map(OblastIndex.findByIso(iso!)?.koboKey, _ => m.protHHSnapshot.enum.oblast[_])*/}
      {/*  }))}*/}
      {/*/>*/}
      <Divider/>
      <Box sx={{display: 'flex', alignItems: 'center', py: 1,}}>
        <Txt block bold sx={{flex: 1}}>{m.hohhOlder}</Txt>
        <Switch
          checked={!!customFilters.hohh60}
          onChange={(e: any) => onCustomFilters(prev => ({...prev, hohh60: e.target.checked}))}
        />
      </Box>
      <Divider/>
      <Box sx={{display: 'flex', alignItems: 'center', py: 1,}}>
        <Txt block bold sx={{flex: 1}}>{m.hohhFemale}</Txt>
        <Switch
          checked={!!customFilters.hohhFemale}
          onChange={(e: any) => onCustomFilters(prev => ({...prev, hohhFemale: e.target.checked}))}
        />
      </Box>
      <Divider/>
      <Box>
        <Txt color="hint" sx={{ml: 2}}>
          {/*{filters.start.toDateString()}{' - '}*/}
          {/*{filters.end.toDateString()}*/}
        </Txt>
        <Txt color="hint" bold sx={{ml: 2}}>
          {current.data.length ?? '-'}
        </Txt>
      </Box>
    </Box>
  )
}