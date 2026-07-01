/**
 * QuestionEditor – handles creating/editing a single question of any supported type.
 * Props:
 *   question   – current question object
 *   onChange   – (updatedQuestion) => void
 *   onDelete   – () => void
 *   index      – display number
 */
import {
  Box, Card, CardContent, Typography, TextField, Select, MenuItem,
  FormControl, IconButton, Button, Chip, Radio,
  RadioGroup, FormControlLabel, Divider, Tooltip, Avatar,
} from '@mui/material'
import DeleteRoundedIcon  from '@mui/icons-material/DeleteRounded'
import AddRoundedIcon     from '@mui/icons-material/AddRounded'
import DragHandleIcon     from '@mui/icons-material/DragHandle'
import SwapVertIcon       from '@mui/icons-material/SwapVert'

/* ── Question type meta ──────────────────────────────────────────────────── */
// eslint-disable-next-line react-refresh/only-export-components
export const QUESTION_TYPES = [
  { value: 'mcq',        label: '🔘 MCQ',              desc: 'Multiple choice – one correct answer' },
  { value: 'imagemcq',   label: '🖼️ Image MCQ',        desc: 'MCQ with an image prompt' },
  { value: 'truefalse',  label: '✅ True / False',      desc: 'Simple true or false question' },
  { value: 'fillinblank',label: '✏️ Fill in the Blank', desc: 'Complete the sentence' },
  { value: 'matching',   label: '🔗 Match the Pairs',   desc: 'Connect left column to right column' },
  { value: 'sequence',   label: '🔢 Sequencing',        desc: 'Arrange items in correct order' },
  { value: 'oddoneout',  label: '🚫 Odd One Out',       desc: 'Pick the item that doesn\'t belong' },
  { value: 'flashcard',  label: '💡 Flashcard',         desc: 'Front / Back study card' },
]

// eslint-disable-next-line react-refresh/only-export-components
export const emptyQuestion = (type = 'mcq') => {
  const base = { type, text: '', explanation: '', points: 10 }
  switch (type) {
    case 'mcq':
    case 'imagemcq':
    case 'oddoneout':
      return { ...base, imageUrl: '', options: ['', '', '', ''], correctAnswer: '' }
    case 'truefalse':
      return { ...base, options: ['True', 'False'], correctAnswer: 'True' }
    case 'fillinblank':
      return { ...base, correctAnswer: '' }
    case 'matching':
      return { ...base, pairs: [{ left: '', right: '' }, { left: '', right: '' }, { left: '', right: '' }] }
    case 'sequence':
      return { ...base, items: ['', '', '', ''], correctOrder: ['', '', '', ''] }
    case 'flashcard':
      return { ...base, correctAnswer: '' }   // text = front, correctAnswer = back
    default:
      return { ...base, options: ['', '', '', ''], correctAnswer: '' }
  }
}

/* ── Sub-editors ─────────────────────────────────────────────────────────── */

function McqEditor({ q, onChange, showImage }) {
  return (
    <Box>
      {showImage && (
        <TextField fullWidth size="small" label="Image URL" value={q.imageUrl || ''}
          onChange={e => onChange({ ...q, imageUrl: e.target.value })}
          placeholder="https://..." sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
      )}
      {showImage && q.imageUrl && (
        <Box sx={{ mb: 1.5, textAlign: 'center' }}>
          <img src={q.imageUrl} alt="question" style={{ maxHeight: 160, borderRadius: 8, border: '1px solid #e2e8f0' }} />
        </Box>
      )}
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        Click the radio button to mark the correct answer
      </Typography>
      <RadioGroup value={q.correctAnswer} onChange={e => onChange({ ...q, correctAnswer: e.target.value })}>
        {(q.options || ['', '', '', '']).map((opt, oi) => (
          <Box key={oi} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
            <Radio value={opt} size="small" disabled={!opt} />
            <TextField fullWidth size="small" value={opt}
              placeholder={`Option ${oi + 1}`}
              onChange={e => {
                const opts = [...(q.options || ['', '', '', ''])]
                const wasCorrect = opt === q.correctAnswer
                opts[oi] = e.target.value
                onChange({ ...q, options: opts, correctAnswer: wasCorrect ? e.target.value : q.correctAnswer })
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: opt && opt === q.correctAnswer ? '#10B981' : undefined },
                },
              }} />
          </Box>
        ))}
      </RadioGroup>
      {(q.options || []).length < 6 && (
        <Button size="small" startIcon={<AddRoundedIcon />}
          onClick={() => onChange({ ...q, options: [...(q.options || []), ''] })}
          sx={{ mt: 0.5, borderRadius: '8px', fontSize: '0.72rem' }}>
          Add Option
        </Button>
      )}
    </Box>
  )
}

function TrueFalseEditor({ q, onChange }) {
  return (
    <RadioGroup row value={q.correctAnswer} onChange={e => onChange({ ...q, correctAnswer: e.target.value })}>
      <FormControlLabel value="True"  control={<Radio />} label="✅ True" />
      <FormControlLabel value="False" control={<Radio />} label="❌ False" />
    </RadioGroup>
  )
}

function FillInBlankEditor({ q, onChange }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        Use <strong>___</strong> in the question text to mark the blank. Type the expected answer below.
      </Typography>
      <TextField fullWidth size="small" label="Correct Answer" value={q.correctAnswer || ''}
        onChange={e => onChange({ ...q, correctAnswer: e.target.value })}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
    </Box>
  )
}

function MatchingEditor({ q, onChange }) {
  const pairs = q.pairs || [{ left: '', right: '' }]
  const update = (idx, side, val) => {
    const updated = pairs.map((p, i) => i === idx ? { ...p, [side]: val } : p)
    onChange({ ...q, pairs: updated })
  }
  return (
    <Box>
      {pairs.map((pair, idx) => (
        <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.75 }}>
          <TextField size="small" value={pair.left} placeholder={`Left ${idx + 1}`}
            onChange={e => update(idx, 'left', e.target.value)}
            sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
          <Typography color="text.secondary">↔</Typography>
          <TextField size="small" value={pair.right} placeholder={`Right ${idx + 1}`}
            onChange={e => update(idx, 'right', e.target.value)}
            sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
          {pairs.length > 2 && (
            <IconButton size="small" color="error"
              onClick={() => onChange({ ...q, pairs: pairs.filter((_, i) => i !== idx) })}>
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
      {pairs.length < 8 && (
        <Button size="small" startIcon={<AddRoundedIcon />}
          onClick={() => onChange({ ...q, pairs: [...pairs, { left: '', right: '' }] })}
          sx={{ mt: 0.5, borderRadius: '8px', fontSize: '0.72rem' }}>
          Add Pair
        </Button>
      )}
    </Box>
  )
}

function SequenceEditor({ q, onChange }) {
  const items = q.correctOrder?.length ? q.correctOrder : (q.items || ['', '', '', ''])

  const updateItem = (idx, val) => {
    const updated = [...items]
    updated[idx] = val
    onChange({ ...q, correctOrder: updated, items: [...updated].sort(() => Math.random() - 0.5) })
  }

  const moveUp = (idx) => {
    if (idx === 0) return
    const updated = [...items]
    ;[updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]]
    onChange({ ...q, correctOrder: updated, items: [...updated].sort(() => Math.random() - 0.5) })
  }

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.75, display: 'block' }}>
        Enter items in the <strong>correct order</strong>. Students will see them shuffled.
      </Typography>
      {items.map((item, idx) => (
        <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.75 }}>
          <Avatar sx={{ width: 26, height: 26, fontSize: '0.72rem', fontWeight: 800, bgcolor: 'primary.main', flexShrink: 0 }}>
            {idx + 1}
          </Avatar>
          <TextField fullWidth size="small" value={item} placeholder={`Step / item ${idx + 1}`}
            onChange={e => updateItem(idx, e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
          <Tooltip title="Move up">
            <span>
              <IconButton size="small" disabled={idx === 0} onClick={() => moveUp(idx)}>
                <SwapVertIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          {items.length > 2 && (
            <IconButton size="small" color="error"
              onClick={() => {
                const updated = items.filter((_, i) => i !== idx)
                onChange({ ...q, correctOrder: updated, items: [...updated].sort(() => Math.random() - 0.5) })
              }}>
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
      {items.length < 8 && (
        <Button size="small" startIcon={<AddRoundedIcon />}
          onClick={() => {
            const updated = [...items, '']
            onChange({ ...q, correctOrder: updated, items: updated })
          }}
          sx={{ mt: 0.5, borderRadius: '8px', fontSize: '0.72rem' }}>
          Add Item
        </Button>
      )}
    </Box>
  )
}

function FlashcardEditor({ q, onChange }) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ flex: 1, p: 2, bgcolor: '#F0F4FF', borderRadius: '12px' }}>
        <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ mb: 0.5, display: 'block' }}>
          FRONT (Question)
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Already set as the Question text above
        </Typography>
      </Box>
      <Box sx={{ flex: 1, p: 2, bgcolor: '#F0FFF4', borderRadius: '12px' }}>
        <Typography variant="caption" fontWeight={700} color="success.main" sx={{ mb: 0.5, display: 'block' }}>
          BACK (Answer)
        </Typography>
        <TextField fullWidth size="small" multiline rows={2} value={q.correctAnswer || ''}
          placeholder="Answer shown on card flip…"
          onChange={e => onChange({ ...q, correctAnswer: e.target.value })}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }} />
      </Box>
    </Box>
  )
}

/* ── Main QuestionEditor ─────────────────────────────────────────────────── */
export default function QuestionEditor({ question, onChange, onDelete, index }) {
  const q = question
  const typeMeta = QUESTION_TYPES.find(t => t.value === q.type) || QUESTION_TYPES[0]

  return (
    <Card variant="outlined" sx={{ borderRadius: '14px', border: '1.5px solid #E2E8F0' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Header row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <DragHandleIcon sx={{ color: 'text.disabled', cursor: 'grab', flexShrink: 0 }} />
          <Avatar sx={{ width: 26, height: 26, fontSize: '0.72rem', fontWeight: 800, bgcolor: 'primary.main', flexShrink: 0 }}>
            {index + 1}
          </Avatar>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select value={q.type}
              onChange={e => onChange({ ...emptyQuestion(e.target.value), text: q.text, explanation: q.explanation, points: q.points })}
              sx={{ borderRadius: '8px', fontSize: '0.8rem' }}>
              {QUESTION_TYPES.map(t => (
                <MenuItem key={t.value} value={t.value}>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{t.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Chip label={typeMeta.desc} size="small" sx={{ fontSize: '0.62rem', bgcolor: '#F1F5F9', flexShrink: 0 }} />
          <Box sx={{ flex: 1 }} />
          <TextField size="small" type="number" label="Pts" value={q.points ?? 10}
            onChange={e => onChange({ ...q, points: Number(e.target.value) })}
            sx={{ width: 68, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
          <Tooltip title="Delete question">
            <IconButton size="small" color="error" onClick={onDelete}>
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Question text */}
        <TextField fullWidth size="small" multiline
          label={q.type === 'flashcard' ? 'Front of card (question)' : 'Question text *'}
          value={q.text}
          onChange={e => onChange({ ...q, text: e.target.value })}
          sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />

        {/* Type-specific editor */}
        {(q.type === 'mcq' || q.type === 'oddoneout') && (
          <McqEditor q={q} onChange={onChange} showImage={false} />
        )}
        {q.type === 'imagemcq' && (
          <McqEditor q={q} onChange={onChange} showImage />
        )}
        {q.type === 'truefalse' && (
          <TrueFalseEditor q={q} onChange={onChange} />
        )}
        {q.type === 'fillinblank' && (
          <FillInBlankEditor q={q} onChange={onChange} />
        )}
        {q.type === 'matching' && (
          <MatchingEditor q={q} onChange={onChange} />
        )}
        {q.type === 'sequence' && (
          <SequenceEditor q={q} onChange={onChange} />
        )}
        {q.type === 'flashcard' && (
          <FlashcardEditor q={q} onChange={onChange} />
        )}

        {/* Explanation */}
        <Divider sx={{ my: 1.5 }} />
        <TextField fullWidth size="small" label="💡 Explanation (shown after answer)"
          value={q.explanation || ''}
          onChange={e => onChange({ ...q, explanation: e.target.value })}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
      </CardContent>
    </Card>
  )
}
