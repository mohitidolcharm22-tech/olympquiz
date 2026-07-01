import { useState, useEffect } from 'react'
import { useParams, useNavigate, useBlocker } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Typography, Card, CardContent, Button, LinearProgress,
  Chip, Avatar,
  Dialog, DialogContent, DialogTitle, DialogActions, Alert,
  Table, TableBody, TableRow, TableCell, CircularProgress,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import TimerRoundedIcon from '@mui/icons-material/TimerRounded'
import BookmarkAddRoundedIcon from '@mui/icons-material/BookmarkAddRounded'
import BookmarkAddedRoundedIcon from '@mui/icons-material/BookmarkAddedRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { startQuiz, answerQuestion, nextQuestion, prevQuestion, submitQuiz, tickTimer, setQuizResult, clearActiveQuiz } from '../../store/slices/quizSlice'
import { updateUser } from '../../store/slices/authSlice'
import { quizzesApi } from '../../services/apiCatalog'
import api from '../../services/api'
import QuestionRenderer from './QuestionRenderer'

export default function QuizPage() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { activeQuiz, currentQuestionIndex, answers, quizResult, timeRemaining } = useSelector(s => s.quiz)

  // Local state
  const [markedForReview, setMarkedForReview] = useState(new Set())
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showSummaryDialog, setShowSummaryDialog] = useState(false)
  const [blockedNavigator, setBlockedNavigator] = useState(null)
  const [alreadyAttempted, setAlreadyAttempted] = useState(false)
  const [loadingCheck, setLoadingCheck]         = useState(true)

  // Block navigation only when a quiz with questions is actively in progress
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !!activeQuiz && !!activeQuiz.questions?.length && !quizResult &&
      currentLocation.pathname !== nextLocation.pathname
  )

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setBlockedNavigator(blocker)
      setShowExitDialog(true)
    }
  }, [blocker])

  // Load fresh quiz data. `alreadyAttempted` ships in the same response so
  // we don't need a separate getMyAttempts round-trip just to gate retakes.
  useEffect(() => {
    let cancelled = false
    setLoadingCheck(true)

    quizzesApi.getOne(quizId)
      .then(d => {
        if (cancelled) return
        const quiz = d.data.quiz
        if (quiz.alreadyAttempted) {
          setAlreadyAttempted(true)
        } else {
          dispatch(startQuiz({ ...quiz, id: quiz._id }))
        }
      })
      .catch(() => { if (!cancelled) navigate('/student/quizzes') })
      .finally(() => { if (!cancelled) setLoadingCheck(false) })

    return () => { cancelled = true }
  }, [quizId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (quizResult) {
      navigate(`/student/quiz/${quizId}/result`)
    }
  }, [quizResult, navigate, quizId])

  // Submit + normalise the server response into the shape QuizResultPage expects,
  // and refresh the Redux user so the dashboard sees the new XP/level/stats.
  const submitAndStoreResult = async (answersArray, timeTaken) => {
    try {
      const data = await quizzesApi.submit(quizId, answersArray, timeTaken)
      const { attempt, score, passed, xpEarned, quiz } = data.data
      dispatch(setQuizResult({
        score,
        passed,
        xpEarned,
        timeTaken:       attempt.timeTaken ?? timeTaken,
        correct:         attempt.answers?.filter(a => a.correct).length ?? 0,
        total:           quiz?.questions?.length ?? activeQuiz?.questions?.length ?? 0,
        quizTitle:       quiz?.title ?? activeQuiz?.title ?? '',
        questionResults: (attempt.answers ?? []).map(a => ({
          questionId: String(a.questionId),
          isCorrect:  a.correct,
          given:      a.selected,
          correct:    quiz?.questions?.find(q => String(q._id) === String(a.questionId))?.correctAnswer ?? '',
        })),
        quiz: {
          title:        quiz?.title ?? activeQuiz?.title ?? '',
          passingScore: quiz?.passingScore ?? 60,
          questions:    quiz?.questions ?? [],
        },
      }))
      api.get('/auth/me').then(res => dispatch(updateUser(res.data.data.user))).catch(() => {})
    } catch {
      dispatch(submitQuiz()) // fallback: local scoring
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeRemaining > 0) dispatch(tickTimer())
      else if (timeRemaining === 0) {
        clearInterval(timer)
        const timeTaken = activeQuiz ? activeQuiz.durationMinutes * 60 : 0
        const answersArray = Object.entries(answers).map(([questionId, selected]) => ({ questionId, selected }))
        submitAndStoreResult(answersArray, timeTaken)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [timeRemaining, dispatch, quizId, answers, activeQuiz]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loadingCheck) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>
  )

  if (alreadyAttempted) return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 500, mx: 'auto', textAlign: 'center', pt: 8 }}>
      <CheckCircleRoundedIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
      <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Quiz Already Completed!</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        You have already taken this quiz. Each quiz can only be attempted once.
      </Typography>
      <Button variant="contained" onClick={() => navigate(`/student/quiz/${quizId}/result`)} sx={{ mr: 1 }}>
        View My Result
      </Button>
      <Button variant="outlined" onClick={() => navigate('/student/quizzes')}>
        Back to Quizzes
      </Button>
    </Box>
  )

  if (!activeQuiz) return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography>Loading quiz...</Typography>
    </Box>
  )

  if (!activeQuiz.questions?.length) return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 500, mx: 'auto', textAlign: 'center', pt: 8 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>No Questions Yet</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This quiz doesn{'"'}t have any questions added yet. Please check back later.
      </Typography>
      <Button variant="outlined" onClick={() => { dispatch(clearActiveQuiz()); navigate('/student/quizzes') }}>Back to Quizzes</Button>
    </Box>
  )

  const question = activeQuiz.questions[currentQuestionIndex]

  if (!question) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>
  )

  const totalQuestions = activeQuiz.questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100
  const selectedAnswer = answers[question._id]
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1
  const isMarked = markedForReview.has(question._id)
  const answeredCount = Object.keys(answers).length

  const toggleMark = () => {
    setMarkedForReview(prev => {
      const next = new Set(prev)
      if (next.has(question._id)) next.delete(question._id)
      else next.add(question._id)
      return next
    })
  }

  const handleExitConfirm = () => {
    setShowExitDialog(false)
    if (blockedNavigator) {
      blockedNavigator.proceed()
      setBlockedNavigator(null)
    }
  }

  const handleExitCancel = () => {
    setShowExitDialog(false)
    if (blockedNavigator) {
      blockedNavigator.reset()
      setBlockedNavigator(null)
    }
  }

  const handleSubmitClick = () => {
    setShowSummaryDialog(true)
  }

  const handleFinalSubmit = async () => {
    setShowSummaryDialog(false)
    const timeTaken = activeQuiz.durationMinutes * 60 - timeRemaining
    const answersArray = Object.entries(answers).map(([questionId, selected]) => ({ questionId, selected }))
    await submitAndStoreResult(answersArray, timeTaken)
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 700, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={700} noWrap sx={{ flex: 1 }}>{activeQuiz.title}</Typography>
        <Chip
          icon={<TimerRoundedIcon />}
          label={`${minutes}:${String(seconds).padStart(2, '0')}`}
          color={timeRemaining < 60 ? 'error' : 'default'}
          sx={{ fontWeight: 700, fontSize: '1rem', ml: 1 }}
        />
      </Box>

      {/* Progress */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography variant="caption" color="text.secondary">Question {currentQuestionIndex + 1} of {totalQuestions}</Typography>
          <Typography variant="caption" fontWeight={700} color="primary.main">
            {answeredCount}/{totalQuestions} answered
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress}
          sx={{ height: 8, borderRadius: '100px', '& .MuiLinearProgress-bar': { borderRadius: '100px' } }} />
      </Box>

      {/* Question Card */}
      <Card sx={{ borderRadius: '20px', mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          {/* Question header row */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 3 }}>
            <Avatar sx={{
              bgcolor: '#6C63FF', color: 'white', fontWeight: 800,
              width: 36, height: 36, fontSize: '0.9rem', flexShrink: 0,
            }}>
              {currentQuestionIndex + 1}
            </Avatar>
            <Typography variant="h6" fontWeight={600} sx={{ lineHeight: 1.4, flex: 1 }}>
              {question.text}
            </Typography>
            {/* Mark for review */}
            <Button
              size="small"
              variant={isMarked ? 'contained' : 'outlined'}
              color="warning"
              startIcon={isMarked ? <BookmarkAddedRoundedIcon /> : <BookmarkAddRoundedIcon />}
              onClick={toggleMark}
              sx={{ borderRadius: '10px', flexShrink: 0, fontSize: '0.7rem', minWidth: 0, px: 1 }}
            >
              {isMarked ? 'Marked' : 'Review'}
            </Button>
          </Box>

          {/* Unanswered warning — only for answer-based types */}
          {!selectedAnswer && !['flashcard','matching','sequence'].includes(question.type) && (
            <Alert severity="info" sx={{ mb: 2, borderRadius: '10px', py: 0.5 }}>
              Select an answer to continue to the next question.
            </Alert>
          )}

          <QuestionRenderer
            question={question}
            answer={selectedAnswer || ''}
            onAnswer={value => dispatch(answerQuestion({ questionId: question._id, answer: value }))}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" startIcon={<ArrowBackRoundedIcon />}
          disabled={currentQuestionIndex === 0}
          onClick={() => dispatch(prevQuestion())}
          sx={{ borderRadius: '12px' }}>
          Previous
        </Button>
        <Box sx={{ flex: 1 }} />
        {isLastQuestion ? (
          <Button
            variant="contained" color="success"
            startIcon={<AssignmentTurnedInRoundedIcon />}
            onClick={handleSubmitClick}
            sx={{ borderRadius: '12px', px: 3 }}>
            Review & Submit
          </Button>
        ) : (
          <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />}
            disabled={!selectedAnswer}
            onClick={() => dispatch(nextQuestion())}
            sx={{ borderRadius: '12px' }}>
            Next
          </Button>
        )}
      </Box>

      {/* Question Navigator */}
      <Box sx={{ mt: 2.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Question Navigator · 
          <Box component="span" sx={{ color: 'success.main', fontWeight: 700 }}> ● Answered</Box>
          <Box component="span" sx={{ color: 'warning.main', fontWeight: 700 }}> ● Review</Box>
          <Box component="span" sx={{ color: 'text.disabled' }}> ● Unanswered</Box>
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {activeQuiz.questions.map((q, idx) => {
            const qKey = q._id ?? q.id
            const isAnswered = !!answers[qKey]
            const isReview = markedForReview.has(qKey)
            const isCurrent = idx === currentQuestionIndex
            return (
              <Avatar
                key={qKey}
                sx={{
                  width: 34, height: 34, fontSize: '0.78rem', cursor: 'pointer',
                  fontWeight: 700,
                  border: isCurrent ? '2px solid' : isReview ? '2px solid' : 'none',
                  borderColor: isCurrent ? 'primary.main' : isReview ? 'warning.main' : 'transparent',
                  bgcolor: isCurrent ? 'primary.main' : isReview ? '#FEF3C7' : isAnswered ? 'success.main' : '#E5E7EB',
                  color: isCurrent ? 'white' : isReview ? 'warning.dark' : isAnswered ? 'white' : 'text.secondary',
                  transition: 'all 0.15s ease',
                }}
                onClick={() => {
                  const diff = idx - currentQuestionIndex
                  if (diff > 0) for (let i = 0; i < diff; i++) dispatch(nextQuestion())
                  else for (let i = 0; i < Math.abs(diff); i++) dispatch(prevQuestion())
                }}
              >
                {idx + 1}
              </Avatar>
            )
          })}
        </Box>
      </Box>

      {/* ============ EXIT CONFIRMATION DIALOG ============ */}
      <Dialog open={showExitDialog} onClose={handleExitCancel} PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningAmberRoundedIcon color="warning" />
          Leave Quiz?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 1 }}>
            If you leave now, <strong>your quiz progress will be lost</strong> and the attempt will be cancelled.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All {answeredCount} answered question{answeredCount !== 1 ? 's' : ''} will be cleared.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={handleExitCancel} variant="contained" sx={{ borderRadius: '10px' }}>
            Stay in Quiz
          </Button>
          <Button onClick={handleExitConfirm} color="error" variant="outlined" sx={{ borderRadius: '10px' }}>
            Yes, Leave & Clear
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============ SUMMARY DIALOG BEFORE SUBMIT ============ */}
      <Dialog
        open={showSummaryDialog}
        onClose={() => setShowSummaryDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          📋 Quiz Summary
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {/* Stats row */}
          <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: 'action.hover', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={800} color="success.main">{answeredCount}</Typography>
              <Typography variant="caption" color="text.secondary">Answered</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={800} color="error.main">{totalQuestions - answeredCount}</Typography>
              <Typography variant="caption" color="text.secondary">Skipped</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={800} color="warning.main">{markedForReview.size}</Typography>
              <Typography variant="caption" color="text.secondary">For Review</Typography>
            </Box>
          </Box>

          {/* Question list */}
          <Table size="small">
            <TableBody>
              {activeQuiz.questions.map((q, idx) => {
                const qKey = q._id ?? q.id
                const chosenAnswer = answers[qKey]
                const isReview = markedForReview.has(qKey)
                return (
                  <TableRow key={qKey} sx={{
                    bgcolor: !chosenAnswer ? '#FFF5F5' : isReview ? '#FFFBEB' : 'transparent',
                  }}>
                    <TableCell sx={{ width: 40, py: 1 }}>
                      <Avatar sx={{
                        width: 28, height: 28, fontSize: '0.7rem', fontWeight: 700,
                        bgcolor: !chosenAnswer ? 'error.main' : isReview ? 'warning.main' : 'success.main',
                        color: 'white',
                      }}>
                        {idx + 1}
                      </Avatar>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Typography variant="body2" fontWeight={500} sx={{
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
                      }}>
                        {q.text}
                      </Typography>
                      {chosenAnswer && (
                        <Typography variant="caption" color="success.main" fontWeight={700}>
                          ✓ {chosenAnswer}
                        </Typography>
                      )}
                      {!chosenAnswer && (
                        <Typography variant="caption" color="error.main" fontWeight={700}>
                          — Not answered
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1, width: 80 }} align="right">
                      {isReview && <Chip label="Review" size="small" color="warning"
                        sx={{ fontSize: '0.6rem', height: 18 }} />}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {totalQuestions - answeredCount > 0 && (
            <Alert severity="warning" sx={{ m: 2, borderRadius: '10px' }}>
              You have <strong>{totalQuestions - answeredCount} unanswered</strong> question{totalQuestions - answeredCount !== 1 ? 's' : ''}. 
              Unanswered questions will be marked incorrect.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setShowSummaryDialog(false)} variant="outlined" sx={{ borderRadius: '10px' }}>
            Go Back & Review
          </Button>
          <Button onClick={handleFinalSubmit} variant="contained" color="success" sx={{ borderRadius: '10px', px: 3 }}>
            Submit Quiz 🎉
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
