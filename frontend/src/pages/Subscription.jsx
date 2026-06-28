import { useEffect, useState } from 'react'
import useAuthStore from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import './Subscription.css'

function Subscription() {
  const { user, subscription, fetchSubscription } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [plans, setPlans] = useState(null)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/subscription/plans', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setPlans(data)
    } catch (error) {
      console.error('Failed to load plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const planCards = [
    {
      type: 'FREE',
      name: 'Free',
      price: plans?.FREE?.priceInRupees || 0,
      canvasLimit: plans?.FREE?.canvasLimit || 5,
      aiSpeed: plans?.FREE?.aiSpeedMultiplier || 1,
      description: plans?.FREE?.description || 'Basic Access',
      current: subscription === 'FREE'
    },
    {
      type: 'SILVER',
      name: 'Silver',
      price: plans?.SILVER?.priceInRupees || 199,
      canvasLimit: plans?.SILVER?.canvasLimit || 15,
      aiSpeed: plans?.SILVER?.aiSpeedMultiplier || 2,
      description: plans?.SILVER?.description || 'Enhanced Access',
      current: subscription === 'SILVER',
      popular: true
    },
    {
      type: 'GOLD',
      name: 'Gold',
      price: plans?.GOLD?.priceInRupees || 499,
      canvasLimit: plans?.GOLD?.canvasLimit || 50,
      aiSpeed: plans?.GOLD?.aiSpeedMultiplier || 3,
      description: plans?.GOLD?.description || 'Premium Access',
      current: subscription === 'GOLD'
    },
    {
      type: 'DIAMOND',
      name: 'Diamond',
      price: plans?.DIAMOND?.priceInRupees || 999,
      canvasLimit: plans?.DIAMOND?.canvasLimit || 'Unlimited',
      aiSpeed: plans?.DIAMOND?.aiSpeedMultiplier || 4,
      description: plans?.DIAMOND?.description || 'Unlimited Access',
      current: subscription === 'DIAMOND',
      featured: true
    }
  ]

  const handleUpgrade = async (planType) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ planType })
      })
      
      if (response.ok) {
        await fetchSubscription()
        alert(`Successfully upgraded to ${planType}!`)
      } else {
        alert('Upgrade failed. Please try again.')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      alert('Upgrade failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="subscription-container">
        <div className="loading">Loading subscription plans...</div>
      </div>
    )
  }

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h1>Choose Your Plan</h1>
        <p>Unlock your full potential with the right subscription</p>
      </div>

      <div className="plans-grid">
        {planCards.map((plan) => (
          <div 
            key={plan.type} 
            className={`plan-card ${plan.current ? 'current' : ''} ${plan.popular ? 'popular' : ''} ${plan.featured ? 'featured' : ''}`}
          >
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            {plan.featured && <div className="featured-badge">Best Value</div>}
            
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price">
              {plan.price === 0 ? 'Free' : `₹${plan.price}`}
              <span className="plan-period">/month</span>
            </div>
            <div className="plan-description">{plan.description}</div>
            
            <div className="plan-features">
              <div className="feature">
                <span className="feature-icon">🎨</span>
                <span>{plan.canvasLimit === 'Unlimited' ? 'Unlimited' : `${plan.canvasLimit}`} canvases</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🤖</span>
                <span>{plan.aiSpeed}x AI speed</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✨</span>
                <span>All basic features</span>
              </div>
            </div>

            {plan.current ? (
              <button className="plan-btn current" disabled>
                Current Plan
              </button>
            ) : (
              <button 
                className="plan-btn" 
                onClick={() => handleUpgrade(plan.type)}
              >
                {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
              </button>
            )}
          </div>
        ))}
      </div>

      {user?.name === 'Guest' && (
        <div className="guest-info">
          <h3>Guest Limitations</h3>
          <p>Guest users can create up to 2 canvases. Sign up for a Silver account to unlock 15 canvases!</p>
        </div>
      )}

      <button className="exit-btn" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>
    </div>
  )
}

export default Subscription
