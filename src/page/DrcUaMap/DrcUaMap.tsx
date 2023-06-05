import {Enum, sleep} from '@alexandreannic/ts-utils'
import React, {useEffect} from 'react'
import {Box, GlobalStyles, Icon, useTheme} from '@mui/material'
import {useConfig} from '../../core/context/ConfigContext'
import {Theme} from '@mui/material/styles'
import {Txt} from 'mui-extension'
import {OblastIndex} from '../../shared/UkraineMap/oblastIndex'

const generalStyles = <GlobalStyles styles={{
  '#map-offices svg path[fill="none"]': {
    strokeWidth: 0
  },
  '#map-ua svg path[fill="none"]': {
    strokeWidth: 0
  }
}}/>

const occupiedColor = '#ffdcd2'

interface Office {
  city: string
  closed?: boolean
  align?: 'right'
}

const officeStyle = (t: Theme) => ({
  open: {
    icon: 'business',
    color: t.palette.primary.main,
    label: 'Operational office'
  },
  closed: {
    icon: 'domain_disabled',
    color: '#afafaf',
    label: 'Temporary closed office',
  }
})

const offices: Office[] = [
  {city: 'Kyiv'},
  {city: 'Dnipro'},
  {city: 'Mykolaiev'},
  {city: 'Lviv'},
  {city: 'Chernihiv'},
  {city: 'Poltava'},
  {city: 'Chernivtsi'},
  {city: 'Sloviansk', closed: true},
  {city: 'Slevlerodonetsk', closed: true, align: 'right'},
  {city: 'Mariupol', closed: true},
]

const drawMaps = async ({
  apiKey,
  theme,
  mapOfficeSelector,
  mapUaSelector,
}: {
  mapOfficeSelector: string
  mapUaSelector: string
  apiKey: string
  theme: Theme
}) => {
  let trys = 0
  while (!google) {
    await sleep(200 + (100 * trys))
    trys++
    if (trys > 140) break
  }
  google.charts.load('current', {
    'packages': ['geochart'],
    'mapsApiKey': apiKey
  })
  google.charts.setOnLoadCallback(() => {
    drawUA(mapUaSelector, theme)
    drawOffices(mapOfficeSelector)
    setTimeout(() => drawOfficeMarkers(mapOfficeSelector, theme), 2000)
  })
}

const drawOffices = (selector: string) => {
  const data = google.visualization.arrayToDataTable([
    ['City', 'Population', 'Area'],
    ...offices.map(o => [o.city, 100, 100]),
  ])

  console.log('data', offices.map(o => [o.city, 100, 100]))
  const chart = new google.visualization.GeoChart(document.querySelector(selector)!)
  chart.draw(data, {
    legend: 'none',
    backgroundColor: 'transparent',
    datalessRegionColor: 'transparent',
    displayMode: 'text',
    region: 'UA',
    resolution: 'provinces',
    // colorAxis: {
    //   colors: ['#fafafa']
    // }
  })
}

const drawUA = (selector: string, theme: Theme) => {
  const occupiedOblasts = [
    'UA14',
    'UA23',
    'UA43',
    'UA09',
    'UA65',
  ]

  const data = google.visualization.arrayToDataTable([
    ['State', 'Population'],
    ...Enum.keys(OblastIndex.oblastByISO).map(_ => [_.replace('UA', 'UA-'), occupiedOblasts.includes(_) ? 2 : 1]),
  ])
  console.log(Enum.keys(OblastIndex.oblastByISO).map(_ => [_.replace('UA', 'UA-'), occupiedOblasts.includes(_) ? 2 : 1]),)

  console.log(theme.palette.primary.light,',color')
  const chart = new google.visualization.GeoChart(document.querySelector(selector)!)
  chart.draw(data, {
    legend: 'none',
    colorAxis: {
      colors: ['#f8f8f8', occupiedColor],
    },
    backgroundColor: 'transparent',
    datalessRegionColor: 'transparent',
    displayMode: 'regions',
    region: 'UA',
    resolution: 'provinces',
  })
}

const drawOfficeMarkers = (selector: string, theme: Theme) => {
  console.log('draw markers', `${selector} text[text-anchor=middle]`)
  document.querySelectorAll(`${selector} text[text-anchor=middle]`).forEach((marker: any) => {
    console.log(marker)
    const office = offices.find(_ => _.city === marker.innerHTML.trim())
    if (!office) {
      return
    }
    const label = marker.cloneNode(true)
    marker.setAttribute('font-family', 'Material Icons')
    marker.setAttribute('font-size', '26')
    if (office.closed) {
      marker.innerHTML = officeStyle(theme).closed.icon
      marker.style.fill = officeStyle(theme).closed.color
    } else {
      marker.innerHTML = officeStyle(theme).open.icon
      marker.style.fill = officeStyle(theme).open.color
    }
    if (office.align === 'right') {
      label.setAttribute('x', +marker.getAttribute('x') + 16)
      label.setAttribute('y', +marker.getAttribute('y') - 6)
      label.setAttribute('text-anchor', 'right')
    } else {
      label.setAttribute('y', +marker.getAttribute('y') + 12)
    }
    marker.parentNode.insertBefore(label, marker.nextSibling)
    label.setAttribute('font-size', theme.typography.fontSize * .875)
    label.setAttribute('font-family', theme.typography.fontFamily)
    label.setAttribute('fill', theme.palette.text)
    label.setAttribute('font-weight', 'bold')
  })

}

export const DrcUaMap = () => {
  const theme = useTheme()
  const {conf} = useConfig()
  useEffect(() => {
    drawMaps({
      apiKey: conf.gooogle.apiKey,
      theme,
      mapUaSelector: '#map-ua',
      mapOfficeSelector: '#map-offices',
    })
  }, [])

  return (
    <div>
      {generalStyles}
      hello
      <Box sx={{display: 'inline-flex', m: 2, border: t => `1px solid ${t.palette.divider}`, alignItems: 'center', background: 'white'}}>
        <Box sx={{position: 'relative', height: 500, width: 700}}>
          <Box id="map-ua" sx={{top: 0, right: 0, bottom: 0, left: 0, position: 'absolute'}}/>
          <Box id="map-offices" sx={{top: 0, right: 0, bottom: 0, left: 0, position: 'absolute'}}/>
        </Box>
        <Box sx={{ml: 3}}>
          <Txt block color="hint" size="big" sx={{mb: 1}}>Legend</Txt>
          {Enum.values(officeStyle(theme)).map(t =>
            <Box key={t.label} sx={{display: 'flex', alignItems: 'center', mb: 2}}>
              <Icon sx={{color: t.color, mr: 1}}>{t.icon}</Icon>
              {t.label}
            </Box>
          )}
          <Box sx={{display: 'flex', alignItems: 'center', mb: 1, mr: 4}}>
            <Box sx={{background: occupiedColor, height: 21, width: 21, borderRadius: 21, mr: 1, border: t => `2px solid ${t.palette.divider}`}}/>
            Oblasts totally or partially<br/>
            controlled by Russian military
          </Box>
        </Box>
      </Box>
    </div>
  )
}
