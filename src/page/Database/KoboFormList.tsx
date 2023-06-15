import {IKoboForm} from '../../core/sdk/server/kobo/Kobo'
import {ScRadioGroup, ScRadioGroupItem} from '../../shared/RadioGroup'
import {UUID} from '../../core/type'
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material'
import {useI18n} from '../../core/i18n'
import {AaBtn, AaBtnProps} from '../../shared/Btn/AaBtn'
import React, {useState} from 'react'

export const KoboFormListButton = ({children, variant = 'contained', ...props}: Omit<AaBtnProps, 'onChange'> & KoboFormListProps) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <AaBtn onClick={() => setOpen(_ => !_)} children={children} variant={variant}/>
      <KoboFormListDialog open={open} onClose={() => setOpen(false)} {...props}/>
    </>
  )
}
export const KoboFormListDialog = ({
  open,
  onClose,
  value,
  onChange,
  forms,
}: {
  onClose: () => void
  open?: boolean
} & KoboFormListProps) => {
  const {m} = useI18n()
  return (
    <Dialog open={!!open}>
      <DialogTitle>{m.selectForm}</DialogTitle>
      <DialogContent>
        <KoboFormList
          value={value}
          onChange={e => {
            onChange?.(e)
            setTimeout(onClose, 100)
          }}
          forms={forms}
        />
      </DialogContent>
      <DialogActions>
        <AaBtn color="primary" onClick={onClose}>
          {m.close}
        </AaBtn>
      </DialogActions>
    </Dialog>
  )
}

interface KoboFormListProps {
  value?: UUID,
  onChange?: (e: UUID) => void
  forms: IKoboForm[]
}

export const KoboFormList = ({
  value,
  onChange,
  forms
}: KoboFormListProps) => {
  const {formatDateTime} = useI18n()
  return (
    <ScRadioGroup value={value} onChange={onChange}>
      {forms.map(form =>
        <ScRadioGroupItem
          dense
          key={form.uid}
          value={form.uid}
          title={form.name}
          description={<>
            {formatDateTime(form.date_created)}
          </>
          }/>
      )}
    </ScRadioGroup>
  )
}