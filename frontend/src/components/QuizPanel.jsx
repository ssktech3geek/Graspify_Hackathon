import { useState } from 'react'

function QuizPanel({ panels }) {
  const [quiz, setQuiz] = useState(null)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const buildContext = () => {
    return panels
      .filter(p => p.type === 'NOTES' && p.content)
      .map(p => {
        try { return JSON.parse(p.content).text || '' }
        catch { return '' }
      })
      .filter(Boolean)
      .join('\n\n')
  }

  const generateQuiz = async () => {
    const context = buildContext()
    if (!context) {
      setError('Add some Notes first — the AI needs content to generate questions from!')
      return
    }

    setLoading(true)
    setError('')
    setQuiz(null)
    setFinished(false)
    setScore(0)
    setCurrent(0)
    setSelected(null)

    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token
      const res = await fetch('http://localhost:8080/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: `Generate exactly 5 multiple choice questions based on the following study notes. 
Return ONLY a valid JSON array, no explanation, no markdown, no backticks.
Format: [{"question":"...","options":["A","B","C","D"],"answer":"A"},...]
Each question must have exactly 4 options and one correct answer letter (A, B, C, or D).
Notes: ${context}`,
          context: ''
        })
      })

      const data = await res.json()
      const text = data.answer || ''

      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error('Could not parse quiz')

      const parsed = JSON.parse(jsonMatch[0])
      setQuiz(parsed)
    } catch (err) {
      setError('Failed to generate quiz. Try again!')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (option) => {
    if (selected) return
    setSelected(option)
    if (option === quiz[current].answer) {
      setScore(s => s + 1)
    }
  }

  const handleNext = () => {
    if (current + 1 >= quiz.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
    }
  }

  const getOptionStyle = (option) => {
    if (!selected) return styles.option
    if (option === quiz[current].answer) return { ...styles.option, ...styles.correct }
    if (option === selected) return { ...styles.option, ...styles.wrong }
    return { ...styles.option, opacity: 0.5 }
  }

  const getScoreEmoji = () => {
    const pct = score / quiz.length
    if (pct === 1) return '🏆'
    if (pct >= 0.8) return '🎉'
    if (pct >= 0.6) return '👍'
    if (pct >= 0.4) return '📚'
    return '💪'
  }

  // Empty state
  if (!quiz && !loading && !error) {
    return (
      <div style={styles.center}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🧠</div>
        <p style={{ fontSize: '14px', color: '#2C2A1E', fontWeight: '600', margin: '0 0 6px' }}>
          AI Quiz Generator
        </p>
        <p style={{ fontSize: '12px', color: '#7A7560', margin: '0 0 20px', textAlign: 'center' }}>
          I'll read your Notes panels and generate 5 questions to test your knowledge
        </p>
        <button onClick={generateQuiz} style={styles.generateBtn}>
          ✨ Generate Quiz
        </button>
      </div>
    )
  }

  // Loading
  if (loading) {
    return (
      <div style={styles.center}>
        <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'spin 1s linear infinite' }}>⚙️</div>
        <p style={{ fontSize: '13px', color: '#7A7560' }}>Generating your quiz...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Error
  if (error) {
    return (
      <div style={styles.center}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
        <p style={{ fontSize: '13px', color: '#E53E3E', margin: '0 0 16px', textAlign: 'center' }}>{error}</p>
        <button onClick={generateQuiz} style={styles.generateBtn}>Try Again</button>
      </div>
    )
  }

  // Results
  if (finished) {
    return (
      <div style={styles.center}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{getScoreEmoji()}</div>
        <p style={{ fontSize: '20px', fontWeight: '800', color: '#2C2A1E', margin: '0 0 6px' }}>
          {score}/{quiz.length}
        </p>
        <p style={{ fontSize: '13px', color: '#7A7560', margin: '0 0 8px' }}>
          {score === quiz.length ? 'Perfect score!' :
           score >= quiz.length * 0.8 ? 'Great job!' :
           score >= quiz.length * 0.6 ? 'Good effort!' : 'Keep studying!'}
        </p>
        <div style={{ width: '100%', height: '8px', background: '#F5F0DC', borderRadius: '4px', margin: '12px 0 20px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(score / quiz.length) * 100}%`, background: '#F5C842', borderRadius: '4px', transition: 'width 1s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={generateQuiz} style={styles.generateBtn}>🔄 New Quiz</button>
          <button
            onClick={() => { setCurrent(0); setSelected(null); setFinished(false) }}
            style={{ ...styles.generateBtn, background: 'transparent', border: '1.5px solid #E8E0C8', color: '#2C2A1E', boxShadow: 'none' }}
          >
            Review
          </button>
        </div>
      </div>
    )
  }

  // Quiz
  const q = quiz[current]
  const letters = ['A', 'B', 'C', 'D']

  return (
    <div style={styles.quizContainer}>
      {/* Progress */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#7A7560', marginBottom: '6px' }}>
          <span>Question {current + 1} of {quiz.length}</span>
          <span>Score: {score}</span>
        </div>
        <div style={{ height: '4px', background: '#F5F0DC', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((current + 1) / quiz.length) * 100}%`, background: '#F5C842', borderRadius: '2px', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Question */}
      <p style={{ fontSize: '14px', fontWeight: '600', color: '#2C2A1E', margin: '0 0 14px', lineHeight: '1.5' }}>
        {q.question}
      </p>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(letters[i])}
            style={getOptionStyle(letters[i])}
          >
            <span style={{ fontWeight: '700', marginRight: '8px', color: '#7A7560' }}>{letters[i]}</span>
            {opt}
          </button>
        ))}
      </div>

      {/* Next button */}
      {selected && (
        <button onClick={handleNext} style={styles.generateBtn}>
          {current + 1 >= quiz.length ? 'See Results →' : 'Next →'}
        </button>
      )}

      {/* Regenerate */}
      <button
        onClick={generateQuiz}
        style={{ background: 'transparent', border: 'none', color: '#B0A890', fontSize: '11px', cursor: 'pointer', marginTop: '8px' }}
      >
        🔄 New quiz
      </button>
    </div>
  )
}

const styles = {
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '20px',
  },
  quizContainer: {
    padding: '16px',
    height: '100%',
    overflowY: 'auto',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  },
  option: {
    padding: '10px 14px',
    background: '#F5F0DC',
    border: '1.5px solid #E8E0C8',
    borderRadius: '10px',
    fontSize: '13px',
    color: '#2C2A1E',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  },
  correct: {
    background: '#D1FAE5',
    borderColor: '#22C55E',
    color: '#166534',
  },
  wrong: {
    background: '#FEE2E2',
    borderColor: '#E53E3E',
    color: '#991B1B',
  },
  generateBtn: {
    padding: '10px 20px',
    background: '#F5C842',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '13px',
    color: '#2C2A1E',
    cursor: 'pointer',
    boxShadow: '0 3px 0 #D4A800',
  },
}

export default QuizPanel