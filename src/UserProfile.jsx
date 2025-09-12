import React, { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const userData = await response.json();
      setUser(userData);
      setFormData(userData);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditing(false);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!user) return <div className="error">User not found</div>;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img src={user.avatar} alt={`${user.name}'s avatar`} className="avatar" />
        <div className="user-info">
          {editing ? (
            <input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="name-input"
            />
          ) : (
            <h2>{user.name}</h2>
          )}
          <p className="user-email">{user.email}</p>
          <span className={`status ${user.status}`}>{user.status}</span>
        </div>
      </div>
      
      <div className="profile-details">
        <div className="detail-group">
          <label>Bio:</label>
          {editing ? (
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="bio-textarea"
            />
          ) : (
            <p>{user.bio}</p>
          )}
        </div>
        
        <div className="detail-group">
          <label>Location:</label>
          {editing ? (
            <input
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          ) : (
            <p>{user.location}</p>
          )}
        </div>
      </div>
      
      <div className="profile-actions">
        {editing ? (
          <>
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={() => setEditing(false)} className="cancel-btn">Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className="edit-btn">Edit Profile</button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;