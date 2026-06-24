import { useState, useEffect } from 'react'
import useAuthStore from '../store/authStore'

function UserProfile() {
  const { user, token, logout } = useAuthStore()
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
          background: profile.avatarUrl ? `url(${profile.avatarUrl}) center/cover` : '#F5C842',
          border: '2px solid #E8E0C8',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: '700',
          color: '#2C2A1E',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.target.style.borderColor = '#F5C842'}
        onMouseLeave={(e) => e.target.style.borderColor = '#E8E0C8'}
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
            background: '#FFFDF4',
            border: '1.5px solid #E8E0C8',
            borderRadius: '12px',
            padding: '16px',
            minWidth: '280px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
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
                    background: profile.avatarUrl ? `url(${profile.avatarUrl}) center/cover` : '#F5C842',
                    border: '2px solid #E8E0C8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#2C2A1E'
                  }}>
                    {!profile.avatarUrl && getInitials(profile.name || user.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#2C2A1E' }}>
                      {profile.name || user.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#7A7560' }}>
                      {user.email}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: '#F5F0DC',
                    border: '1.5px solid #E8E0C8',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#2C2A1E',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#F5C842'}
                  onMouseLeave={(e) => e.target.style.background = '#F5F0DC'}
                >
                  ✏ Edit Profile
                </button>

                <button
                  onClick={logout}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'transparent',
                    border: '1.5px solid #E8E0C8',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#7A7560',
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
                    e.target.style.borderColor = '#E8E0C8'
                    e.target.style.color = '#7A7560'
                  }}
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#2C2A1E', marginBottom: '12px' }}>
                  Edit Profile
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', color: '#7A7560', marginBottom: '4px', display: 'block' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1.5px solid #E8E0C8',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', color: '#7A7560', marginBottom: '4px', display: 'block' }}>
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
                      background: uploading ? '#F5F0DC' : '#F5C842',
                      border: '1.5px solid #E8E0C8',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#2C2A1E',
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      transition: 'all 0.15s',
                      opacity: uploading ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!uploading) e.target.style.background = '#F5C842'
                    }}
                    onMouseLeave={(e) => {
                      if (!uploading) e.target.style.background = '#F5F0DC'
                    }}
                  >
                    {uploading ? 'Uploading...' : 'Change profile'}
                  </label>
                  {uploading && (
                    <div style={{ fontSize: '11px', color: '#7A7560', marginTop: '4px', textAlign: 'center' }}>
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
                      border: '1.5px solid #E8E0C8',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#7A7560',
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
                      background: '#F5C842',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#2C2A1E',
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
