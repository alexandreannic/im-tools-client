import React, {useMemo, useState} from 'react'
import {Page} from '@/shared/Page'
import {AaInput} from '@/shared/ItInput/AaInput'
import {format, getDaysInMonth, parse, subMonths} from 'date-fns'
import {Arr, mapFor} from '@alexandreannic/ts-utils'
import {Box} from '@mui/material'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'

enum Status {
  AM = 'AM',
  PM = 'PM',
  N = 'N',
  OFF = 'OFF',
}

const config = {
  maxNightPerWeek: 3,
  daysBreakAfterNightShift: 2,
}

const SafetyPage = () => {
  const [period, setPeriod] = useState(format(subMonths(new Date(), 1), 'yyyy-MM'))
  const [persons, setPersons] = useState([
    'Yana',
    'Denys',
    'Bohdan',
    'Volodymyr',
    'Stanislav',
  ])
  const [leaves, setLeaves] = useState(Arr(persons).reduceObject<Record<string, number[]>>(_ => [_, []]))

  const dayInMonth = getDaysInMonth(parse(period, 'yyyy-MM', new Date()))

  const data = useMemo(() => {
    const res: Record<string, Status>[] = []
    const dayInMonth = getDaysInMonth(parse(period, 'yyyy-MM', new Date()))
    for (let i = 0; i < dayInMonth - 1; i++) {
      persons.forEach(p => {
        if (!res[i]) res[i] = {}
        res[i][p]

      })
    }

  }, [persons, period])

  return (
    <Page>
      {period} --
      {+period.split('-')![1] - 1}
      --
      {dayInMonth}
      <AaInput
        type="month"
        sx={{width: 200, mr: 1}}
        value={period}
        onChange={_ => setPeriod(_.target.value)}
      />

      <Box component="table" className="table borderY" sx={{
        '& td': {
          minWidth: 32,
          pr: 0, pl: 0,
          textAlign: 'center'
        }
      }}>
        <thead>
        <tr>
          <td></td>
          {mapFor(dayInMonth, i => <td key={i}>{i + 1}</td>)}
        </tr>
        </thead>
        <tbody>
        {persons.map(p =>
          <tr key={p}>
            <td>{p}</td>
            {mapFor(dayInMonth, i => <td key={i}>{i}</td>)}
          </tr>
        )}
        </tbody>
      </Box>
    </Page>
  )
}

export default SafetyPage