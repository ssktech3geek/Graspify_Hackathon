import { useState, useEffect } from 'react'
import useAuthStore from '../store/authStore'
import useThemeStore from '../store/themeStore'

function UserProfile() {
  const { user, token, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({ name: '', avatarUrl: '' })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && token) {
      fetchProfile()
    }
  }, [isOpen, token])

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.name) {
        setProfile({ name: data.name, avatarUrl: data.avatarUrl || '' })
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('http://localhost:8080/api/auth/profile/avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if (data.avatarUrl) {
        setProfile({ ...profile, avatarUrl: data.avatarUrl })
      } else {
        setError(data.error || 'Failed to upload image')
      }
    } catch (err) {
      setError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:8080/api/auth/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: profile.name, avatarUrl: profile.avatarUrl })
      })
      const data = await res.json()
      if (data.name) {
        setProfile({ name: data.name, avatarUrl: data.avatarUrl || '' })
        setIsEditing(false)
      } else {
        setError(data.error || 'Failed to update profile')
      }
    } catch (err) {
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (!user || user.name === 'Guest') return null

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: profile.avatarUrl ? `url(${profile.avatarUrl}) center/cover` : 'var(--accent)',
          border: '2px solid var(--border)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.target.style.borderColor = 'var(--accent)'}
        onMouseLeave={(e) => e.target.style.borderColor = 'var(--border)'}
      >
        {!profile.avatarUrl && getInitials(profile.name || user.name)}
      </button>

      {isOpen && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
            onClick={() => setIsOpen(false)}
          />
          <div style={{
            position: 'absolute',
            top: '52px',
            right: 0,
            background: 'var(--bg-primary)',
            border: '1.5px solid var(--border)',
            borderRadius: '12px',
            padding: '16px',
            minWidth: '280px',
            boxShadow: '0 8px 24px var(--shadow)',
            zIndex: 1000,
            animation: 'fadeInUp 0.2s ease both'
          }}>
            <style>{`
              @keyframes fadeInUp { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
            `}</style>

            {!isEditing ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: profile.avatarUrl ? `url(${profile.avatarUrl}) center/cover` : 'var(--accent)',
                    border: '2px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: 'var(--text-primary)'
                  }}>
                    {!profile.avatarUrl && getInitials(profile.name || user.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {profile.name || user.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {user.email}
                    </div>
                  </div>
                </div>

                <button
                  onClick={toggleTheme}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: theme === 'dark' ? '#2C2A1E' : '#F5F0DC',
                    border: '1.5px solid #E8E0C8',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: theme === 'dark' ? '#FFFDF4' : '#2C2A1E',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = theme === 'dark' ? '#3D3B2F' : '#F5C842'}
                  onMouseLeave={(e) => e.target.style.background = theme === 'dark' ? '#2C2A1E' : '#F5F0DC'}
                >
                  {theme === 'light' ? '🌙 Dark Mode' : '☀ Light Mode'}
                </button>

                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'var(--bg-secondary)',
                    border: '1.5px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--accent)'}
                  onMouseLeave={(e) => e.target.style.background = 'var(--bg-secondary)'}
                >
                  ✏ Edit Profile
                </button>

                <button
                  onClick={logout}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'transparent',
                    border: '1.5px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#FCEBEB'
                    e.target.style.borderColor = '#E53E3E'
                    e.target.style.color = '#E53E3E'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent'
                    e.target.style.borderColor = 'var(--border)'
                    e.target.style.color = 'var(--text-secondary)'
                  }}
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Edit Profile
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1.5px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="avatar-upload"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px 16px',
                      background: uploading ? 'var(--bg-secondary)' : 'var(--accent)',
                      border: '1.5px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      transition: 'all 0.15s',
                      opacity: uploading ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!uploading) e.target.style.background = 'var(--accent)'
                    }}
                    onMouseLeave={(e) => {
                      if (!uploading) e.target.style.background = 'var(--bg-secondary)'
                    }}
                  >
                    {uploading ? 'Uploading...' : 'Change profile'}
                  </label>
                  {uploading && (
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', textAlign: 'center' }}>
                      Please wait...
                    </div>
                  )}
                </div>

                {error && (
                  <div style={{ fontSize: '12px', color: '#E53E3E', marginBottom: '12px' }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setError('')
                      fetchProfile()
                    }}
                    disabled={loading || uploading}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: 'transparent',
                      border: '1.5px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      cursor: loading || uploading ? 'not-allowed' : 'pointer',
                      opacity: loading || uploading ? 0.6 : 1
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading || uploading}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: 'var(--accent)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      cursor: loading || uploading ? 'not-allowed' : 'pointer',
                      opacity: loading || uploading ? 0.6 : 1
                    }}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default UserProfile
