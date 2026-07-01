/**
 * QuestionRenderer – student-facing renderer for all question types.
 * Props:
 *   question       – question object from API
 *   answer         – current answer value (string or JSON string)
 *   onAnswer       – (value: string) => void
 *   showResult     – boolean (post-submit review mode)
 */
import { useState, useEffect } from 'react'
import {
  Box, Typography, Radio, RadioGroup, FormControlLabel, TextField,
  Chip, Card, Button, Avatar,
} from '@mui/material'
import CheckCircleRoundedIcon  from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon       from '@mui/icons-material/CancelRounded'

/* ── MCQ / Odd-one-out / Image MCQ ───────────────────────────────────────── */
function McqRenderer({ question, answer, onAnswer, showResult }) {
  return (
    <Box>
      {question.imageUrl && (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <img src={question.imageUrl} alt="question" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 12 }} />
        </Box>
      )}
      <RadioGroup value={answer || ''}
        onChange={e => !showResult && onAnswer(e.target.value)}>
        {(question.options || []).map((opt, idx) => {
          const isSelected  = answer === opt
          const isCorrect   = opt === question.correctAnswer
          let borderColor   = 'divider'
          let bgColor       = 'transparent'
          if (showResult) {
            if (isCorrect)          { borderColor = 'success.main'; bgColor = '#F0FFF4' }
            else if (isSelected)    { borderColor = 'error.main';   bgColor = '#FFF5F5' }
          } else if (isSelected) {
            borderColor = 'primary.main'; bgColor = 'primary.main' + '10'
          }
          return (
            <Box key={idx} onClick={() => !showResult && onAnswer(opt)}
              sx={{
                border: '2px solid', borderColor, borderRadius: '12px',
                mb: 1.5, overflow: 'hidden', bgcolor: bgColor,
                cursor: showResult ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': showResult ? {} : { borderColor: 'primary.main', bgcolor: 'primary.main' + '08' },
              }}>
              <FormControlLabel value={opt}
                control={<Radio sx={{ ml: 1 }} disabled={showResult} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                    <Typography variant="body1" fontWeight={isSelected ? 700 : 400}>{opt}</Typography>
                    {showResult && isCorrect && <CheckCircleRoundedIcon color="success" fontSize="small" />}
                    {showResult && isSelected && !isCorrect && <CancelRoundedIcon color="error" fontSize="small" />}
                  </Box>
                }
                sx={{ m: 0, width: '100%', py: 0.5 }} />
            </Box>
          )
        })}
      </RadioGroup>
    </Box>
  )
}

/* ── True / False ────────────────────────────────────────────────────────── */
function TrueFalseRenderer({ answer, onAnswer, showResult, question }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 1 }}>
      {['True', 'False'].map(opt => {
        const isSelected = answer === opt
        const isCorrect  = opt === question.correctAnswer
        let bgcolor = isSelected ? 'primary.main' : 'action.hover'
        let color   = isSelected ? 'white' : 'text.primary'
        if (showResult) {
          if (isCorrect)       { bgcolor = 'success.main'; color = 'white' }
          else if (isSelected) { bgcolor = 'error.main';   color = 'white' }
          else                 { bgcolor = 'action.hover'; color = 'text.primary' }
        }
        return (
          <Button key={opt} variant="contained" size="large"
            onClick={() => !showResult && onAnswer(opt)}
            disabled={showResult}
            sx={{
              px: 6, py: 2, borderRadius: '14px', fontSize: '1.1rem', fontWeight: 800,
              bgcolor, color, '&:hover': showResult ? {} : { opacity: 0.9 },
              '&.Mui-disabled': { bgcolor, color, opacity: showResult ? 1 : 0.5 },
            }}>
            {opt === 'True' ? '✅ True' : '❌ False'}
          </Button>
        )
      })}
    </Box>
  )
}

/* ── Fill in the Blank ───────────────────────────────────────────────────── */
function FillBlankRenderer({ answer, onAnswer, showResult, question }) {
  return (
    <Box>
      <TextField fullWidth variant="outlined" placeholder="Type your answer here…"
        value={answer || ''}
        onChange={e => !showResult && onAnswer(e.target.value)}
        disabled={showResult}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', fontSize: '1.1rem' } }} />
      {showResult && (
        <Box sx={{ mt: 1 }}>
          {answer?.trim().toLowerCase() === question.correctAnswer?.trim().toLowerCase()
            ? <Chip icon={<CheckCircleRoundedIcon />} label="Correct!" color="success" />
            : <Chip icon={<CancelRoundedIcon />}
                label={`Correct answer: ${question.correctAnswer}`} color="error" />
          }
        </Box>
      )}
    </Box>
  )
}

/* ── Match the Pairs ─────────────────────────────────────────────────────── */
function MatchingRenderer({ question, answer, onAnswer, showResult }) {
  const pairs = question.pairs || []
  // Parse saved answer or build empty map
  const getMap = () => {
    try { return answer ? JSON.parse(answer) : [] } catch { return [] }
  }
  const [userMap, setUserMap] = useState(getMap)

  const getUserRight = (left) => userMap.find(m => m.left === left)?.right || ''

  const handleChange = (left, right) => {
    const updated = [...userMap.filter(m => m.left !== left), { left, right }]
    setUserMap(updated)
    onAnswer(JSON.stringify(updated))
  }

  // Shuffle right options once
  const [rightOptions] = useState(() =>
    [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5)
  )

  return (
    <Box>
      {pairs.map((pair, idx) => {
        const selected     = getUserRight(pair.left)
        const isCorrect    = selected === pair.right
        return (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Box sx={{ flex: 1, p: 1.5, bgcolor: '#EEF2FF', borderRadius: '10px', fontWeight: 600 }}>
              <Typography variant="body2" fontWeight={600}>{pair.left}</Typography>
            </Box>
            <Typography color="text.secondary">↔</Typography>
            <Box sx={{ flex: 1 }}>
              {showResult ? (
                <Box sx={{ p: 1.5, borderRadius: '10px',
                  bgcolor: isCorrect ? '#F0FFF4' : '#FFF5F5',
                  border: '1.5px solid', borderColor: isCorrect ? 'success.main' : 'error.main' }}>
                  <Typography variant="body2" fontWeight={600}>{selected || '—'}</Typography>
                  {!isCorrect && (
                    <Typography variant="caption" color="success.main">✓ {pair.right}</Typography>
                  )}
                </Box>
              ) : (
                <RadioGroup value={selected} onChange={e => handleChange(pair.left, e.target.value)}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {rightOptions.map(opt => (
                      <Chip key={opt} label={opt} clickable
                        color={selected === opt ? 'primary' : 'default'}
                        onClick={() => handleChange(pair.left, opt)}
                        sx={{ cursor: 'pointer', fontWeight: selected === opt ? 700 : 400 }} />
                    ))}
                  </Box>
                </RadioGroup>
              )}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

/* ── Sequencing ──────────────────────────────────────────────────────────── */
function SequenceRenderer({ question, answer, onAnswer, showResult }) {
  const getOrder = () => {
    try { return answer ? JSON.parse(answer) : (question.items || question.correctOrder || []) }
    catch { return question.items || question.correctOrder || [] }
  }
  const [order, setOrder] = useState(getOrder)

  const moveUp = (idx) => {
    if (idx === 0 || showResult) return
    const updated = [...order]
    ;[updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]]
    setOrder(updated)
    onAnswer(JSON.stringify(updated))
  }

  const moveDown = (idx) => {
    if (idx === order.length - 1 || showResult) return
    const updated = [...order]
    ;[updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]]
    setOrder(updated)
    onAnswer(JSON.stringify(updated))
  }

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Use the arrows to arrange items in the correct order ↕
      </Typography>
      {order.map((item, idx) => {
        const isCorrect = showResult && question.correctOrder?.[idx] === item
        const isWrong   = showResult && question.correctOrder?.[idx] !== item
        return (
          <Box key={idx} sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75,
            p: 1.5, borderRadius: '10px', border: '1.5px solid',
            borderColor: isCorrect ? 'success.main' : isWrong ? 'error.main' : 'divider',
            bgcolor: isCorrect ? '#F0FFF4' : isWrong ? '#FFF5F5' : 'background.paper',
          }}>
            <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', fontWeight: 800,
              bgcolor: isCorrect ? 'success.main' : isWrong ? 'error.main' : 'primary.main' }}>
              {idx + 1}
            </Avatar>
            <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>{item}</Typography>
            {!showResult && (
              <Box>
                <Button size="small" sx={{ minWidth: 32, p: 0.5 }} onClick={() => moveUp(idx)} disabled={idx === 0}>▲</Button>
                <Button size="small" sx={{ minWidth: 32, p: 0.5 }} onClick={() => moveDown(idx)} disabled={idx === order.length - 1}>▼</Button>
              </Box>
            )}
            {showResult && isWrong && (
              <Typography variant="caption" color="success.main" fontWeight={700}>
                → {question.correctOrder?.[idx]}
              </Typography>
            )}
          </Box>
        )
      })}
    </Box>
  )
}

/* ── Flashcard ───────────────────────────────────────────────────────────── */
function FlashcardRenderer({ question, onAnswer }) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    // Flashcards auto-answer "seen" so they earn points
    onAnswer('seen')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{ perspective: '1000px' }}>
      <Box
        onClick={() => setFlipped(f => !f)}
        sx={{
          position: 'relative', height: 200, cursor: 'pointer',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.5s ease',
        }}>
        {/* Front */}
        <Card sx={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #6C63FF, #A78BFA)',
          borderRadius: '16px', p: 3, textAlign: 'center',
        }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
              Question — tap to reveal
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>{question.text}</Typography>
          </Box>
        </Card>
        {/* Back */}
        <Card sx={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #10B981, #34D399)',
          borderRadius: '16px', p: 3, textAlign: 'center',
        }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
              Answer
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>{question.correctAnswer}</Typography>
          </Box>
        </Card>
      </Box>
      <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 1, display: 'block' }}>
        {flipped ? 'Tap to see question' : 'Tap to reveal answer'}
      </Typography>
    </Box>
  )
}

/* ── Main renderer ───────────────────────────────────────────────────────── */
export default function QuestionRenderer({ question, answer, onAnswer, showResult = false }) {
  if (!question) return null
  const type = question.type || 'mcq'

  switch (type) {
    case 'mcq':
    case 'oddoneout':
    case 'imagemcq':
      return <McqRenderer question={question} answer={answer} onAnswer={onAnswer} showResult={showResult} />
    case 'truefalse':
      return <TrueFalseRenderer question={question} answer={answer} onAnswer={onAnswer} showResult={showResult} />
    case 'fillinblank':
      return <FillBlankRenderer question={question} answer={answer} onAnswer={onAnswer} showResult={showResult} />
    case 'matching':
      return <MatchingRenderer question={question} answer={answer} onAnswer={onAnswer} showResult={showResult} />
    case 'sequence':
      return <SequenceRenderer question={question} answer={answer} onAnswer={onAnswer} showResult={showResult} />
    case 'flashcard':
      return <FlashcardRenderer question={question} onAnswer={onAnswer} />
    default:
      return <McqRenderer question={question} answer={answer} onAnswer={onAnswer} showResult={showResult} />
  }
}
