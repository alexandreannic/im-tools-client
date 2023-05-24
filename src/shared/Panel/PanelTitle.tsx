import {BoxProps, Typography, TypographyProps} from '@mui/material'

interface Props extends TypographyProps {
}

export const PanelTitle = ({sx, ...props}: Props) => {
  return (
    <Typography
      variant="h3"
      {...props}
      sx={{
        my: 2,
        mx: 0,
        ...sx,
      }}
    />
  )
}
