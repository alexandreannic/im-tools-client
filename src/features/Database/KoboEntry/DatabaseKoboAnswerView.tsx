import {Box, Dialog, DialogActions, DialogContent, DialogTitle, Icon, Switch} from '@mui/material'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {useI18n} from '@/core/i18n'
import {KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {KoboApiForm, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import React, {useState} from 'react'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {KoboTranslateChoice, KoboTranslateQuestion} from '@/features/Database/KoboTable/DatabaseKoboTableContent'
import {Txt} from 'mui-extension'
import {useSetState} from '@alexandreannic/react-hooks-lib'

export const DatabaseKoboAnswerView = ({
  onClose,
  answer,
  schema,
  translateQuestion,
  translateChoice,
}: {
  translateChoice: KoboTranslateChoice
  translateQuestion: KoboTranslateQuestion
  answer: KoboMappedAnswer<any>
  schema: KoboApiForm
  onClose: () => void
  open: boolean
}) => {
  const {m} = useI18n()
  const [showQuestionWithoutAnswer, setShowQuestionWithoutAnswer] = useState(true)
  return (
    <Dialog open={true}>
      <DialogTitle>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          {answer.id}
          <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
            <Txt sx={{fontSize: '1rem'}} color="hint">{m._koboDatabase.showAllQuestions}</Txt>
            <Switch value={showQuestionWithoutAnswer} onChange={e => setShowQuestionWithoutAnswer(e.target.checked)}/>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <KoboAnswerFormView
          showQuestionWithoutAnswer={showQuestionWithoutAnswer}
          translateChoice={translateChoice}
          translateQuestion={translateQuestion}
          answer={answer}
          schema={schema}
        />
      </DialogContent>
      <DialogActions>
        <AaBtn onClick={onClose}>{m.close}</AaBtn>
      </DialogActions>
    </Dialog>
  )
}

const KoboAnswerFormView = ({
  answer,
  schema,
  translateQuestion,
  translateChoice,
  showQuestionWithoutAnswer,
}: {
  showQuestionWithoutAnswer?: boolean
  translateQuestion: KoboTranslateQuestion
  translateChoice: KoboTranslateChoice
  answer: KoboMappedAnswer<any>
  schema: KoboApiForm
}) => {
  return (
    <Box>
      {schema.content.survey.filter(q => showQuestionWithoutAnswer || q.type === 'begin_group' || (answer[q.name] !== '' && answer[q.name])).map(q => (
        <Box key={q.name} sx={{mb: 1.5}}>
          <KoboAnswerQuestionView
            schema={q}
            answer={answer}
            translateChoice={translateChoice}
            translateQuestion={translateQuestion}
          />
        </Box>
      ))}
    </Box>
  )
}

const KoboAnswerQuestionView = ({
  schema,
  answer: row,
  translateQuestion,
  translateChoice,
}: {
  schema: KoboQuestionSchema
  answer: KoboMappedAnswer<any>
  translateChoice: KoboTranslateChoice
  translateQuestion: KoboTranslateQuestion
}) => {
  const {formatDateTime} = useI18n()
  switch (schema.type) {
    case 'begin_group': {
      return <Box sx={{pt: 1, mt: 2, borderTop: t => `1px solid ${t.palette.divider}`}}>
        <Txt bold block size="title">{translateQuestion(schema.name)}</Txt>
      </Box>
    }
    case 'image': {
      return <>
        <KoboQuestionLabelView>{translateQuestion(schema.name)}</KoboQuestionLabelView>
        <KoboAttachedImg attachments={row.attachments} size={84} fileName={row[schema.name] as string}/>
      </>
    }
    case 'text': {
      return <>
        <KoboQuestionLabelView>{translateQuestion(schema.name)}</KoboQuestionLabelView>
        <KoboQuestionAnswerView icon="short_text">{row[schema.name]}</KoboQuestionAnswerView>
      </>
    }
    case 'note': {
      return <>
        <KoboQuestionLabelView>{translateQuestion(schema.name)}</KoboQuestionLabelView>
        <KoboQuestionAnswerView icon="label">{row[schema.name]}</KoboQuestionAnswerView>
      </>
    }
    case 'begin_repeat': {
      return <>
        <KoboQuestionLabelView>{translateQuestion(schema.name)}</KoboQuestionLabelView>
        <pre>{JSON.stringify(row[schema.name], null, 2)}</pre>
      </>
    }
    case 'start':
    case 'end':
    case 'date': {
      return <>
        <KoboQuestionLabelView>{translateQuestion(schema.name)}</KoboQuestionLabelView>
        <KoboQuestionAnswerView icon="event">{formatDateTime(row[schema.name])}</KoboQuestionAnswerView>
      </>
    }
    case 'select_multiple': {
      return <>
        <KoboQuestionLabelView>{translateQuestion(schema.name)}</KoboQuestionLabelView>
        <KoboQuestionAnswerView icon="check_box">{translateChoice(schema.name, row[schema.name])}</KoboQuestionAnswerView>
      </>
    }
    case 'select_one': {
      return <>
        <KoboQuestionLabelView>{translateQuestion(schema.name)}</KoboQuestionLabelView>
        <KoboQuestionAnswerView icon="radio_button_checked">{translateChoice(schema.name, row[schema.name])}</KoboQuestionAnswerView>
      </>
    }
    case 'calculate':
      return <>
        <KoboQuestionLabelView>{translateQuestion(schema.name)}</KoboQuestionLabelView>
        <KoboQuestionAnswerView icon="functions">{row[schema.name]}</KoboQuestionAnswerView>
      </>
    case 'decimal':
    case 'integer': {
      return <>
        <KoboQuestionLabelView>{translateQuestion(schema.name)}</KoboQuestionLabelView>
        <KoboQuestionAnswerView icon="tag">{row[schema.name]}</KoboQuestionAnswerView>
      </>
    }
    default: {
      return <>
        <KoboQuestionLabelView>{translateQuestion(schema.name)}</KoboQuestionLabelView>
        <KoboQuestionAnswerView icon="short_text">{JSON.stringify(row[schema.name])}</KoboQuestionAnswerView>
      </>
    }
  }
}

const KoboQuestionLabelView = ({
  children,
}: {
  children: string
}) => {
  return <Txt bold block sx={{mb: .5}}>{children}</Txt>
}

const KoboQuestionAnswerView = ({
  icon,
  children,
}: {
  icon: string
  children: string
}) => {
  if (!children) return
  return (
    <Box sx={{display: 'flex', alignItems: 'center'}}>
      <Icon color="disabled" sx={{mr: 1}}>{icon}</Icon>
      <Txt color="hint">{children}</Txt>
    </Box>
  )
}
