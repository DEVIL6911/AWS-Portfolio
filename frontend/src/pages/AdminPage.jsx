import { useState, useEffect } from 'react';
import { fetchAllMembers, updateMember, deleteMember } from '../api/members';
import SectionHeader from '../components/SectionHeader';

export default function AdminPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    document.title = 'Admin Panel | AWS Cloud Club';
    window.scrollTo(0, 0);
    loadMembers();
  }, []);

  const loadMembers = () => {
    setLoading(true);
    fetchAllMembers()
      .then((data) => {
        setMembers(data);
        if (selectedMember) {
          const updated = data.find(m => m.id === selectedMember.id);
          if (updated) {
            setSelectedMember(updated);
            setFormData({
              ...updated,
              skills: updated.skills.map(s => s.name),
              achievements: updated.achievements.map(a => a.title)
            });
          }
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleSelect = (member) => {
    setSelectedMember(member);
    setFormData({
      ...member,
      skills: member.skills.map(s => s.name),
      achievements: member.achievements.map(a => a.title)
    });
    setSaveStatus('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field, index) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    try {
      // Clean up empty strings from arrays
      const cleanedData = {
        ...formData,
        skills: formData.skills.filter(s => s.trim() !== ''),
        achievements: formData.achievements.filter(a => a.trim() !== '')
      };
      await updateMember(selectedMember.id, cleanedData);
      setSaveStatus('Saved successfully!');
      loadMembers();
    } catch (err) {
      setSaveStatus(`Error: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedMember.name}?`)) return;
    setSaveStatus('Deleting...');
    try {
      await deleteMember(selectedMember.id);
      setSelectedMember(null);
      setFormData(null);
      setSaveStatus('');
      loadMembers();
    } catch (err) {
      setSaveStatus(`Error: ${err.message}`);
    }
  };

  if (loading && members.length === 0) {
    return (
      <section className="section" style={{ minHeight: '100vh', paddingTop: '120px' }}>
        <div className="container" style={{ textAlign: 'center' }}>Loading members...</div>
      </section>
    );
  }

  return (
    <section className="section" style={{ minHeight: '100vh', paddingTop: '120px', background: 'var(--bg)' }}>
      <div className="container">
        <SectionHeader label="Admin Panel" title="Manage Club Members" description="Edit or delete member details." />
        
        {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px', alignItems: 'start' }}>
          
          {/* Sidebar List */}
          <div style={{ background: 'var(--card)', borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--purple-light)' }}>Members List</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '70vh', overflowY: 'auto' }}>
              {members.map(member => (
                <button
                  key={member.id}
                  onClick={() => handleSelect(member)}
                  style={{
                    background: selectedMember?.id === member.id ? 'var(--purple-border)' : 'transparent',
                    border: '1px solid var(--border)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    color: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{member.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{member.team_key}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Edit Form */}
          {formData ? (
            <div style={{ background: 'var(--card)', borderRadius: 'var(--radius-lg)', padding: '40px', border: '1px solid var(--border)' }}>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'white' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Team Key</label>
                    <input name="team_key" value={formData.team_key} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'white' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Role</label>
                  <input name="role" value={formData.role} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'white' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Avatar URL</label>
                  <input name="avatar_url" value={formData.avatar_url || ''} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'white' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Bio</label>
                  <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows="4" style={{ width: '100%', padding: '10px', borderRadius: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'white' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
                    <input name="email" value={formData.email || ''} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'white' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px' }}>LinkedIn URL</label>
                    <input name="linkedin" value={formData.linkedin || ''} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'white' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px' }}>GitHub URL</label>
                    <input name="github" value={formData.github || ''} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'white' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Instagram URL</label>
                    <input name="instagram" value={formData.instagram || ''} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'white' }} />
                  </div>
                </div>

                {/* Skills Array */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Skills</label>
                  {formData.skills.map((skill, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input value={skill} onChange={(e) => handleArrayChange(e, 'skills', index)} style={{ flex: 1, padding: '10px', borderRadius: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'white' }} />
                      <button type="button" onClick={() => removeArrayItem('skills', index)} style={{ padding: '0 15px', background: '#ef4444', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>X</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('skills')} style={{ padding: '8px 16px', background: 'var(--purple-border)', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>+ Add Skill</button>
                </div>

                {/* Achievements Array */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Achievements</label>
                  {formData.achievements.map((ach, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input value={ach} onChange={(e) => handleArrayChange(e, 'achievements', index)} style={{ flex: 1, padding: '10px', borderRadius: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'white' }} />
                      <button type="button" onClick={() => removeArrayItem('achievements', index)} style={{ padding: '0 15px', background: '#ef4444', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>X</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('achievements')} style={{ padding: '8px 16px', background: 'var(--purple-border)', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>+ Add Achievement</button>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginTop: '20px', alignItems: 'center' }}>
                  <button type="submit" style={{ padding: '12px 30px', background: 'var(--purple)', border: 'none', borderRadius: 'var(--radius-pill)', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                    Save Changes
                  </button>
                  <button type="button" onClick={handleDelete} style={{ padding: '12px 30px', background: 'transparent', border: '1px solid #ef4444', borderRadius: 'var(--radius-pill)', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                    Delete Member
                  </button>
                  {saveStatus && <span style={{ color: saveStatus.includes('Error') ? '#ef4444' : '#10b981' }}>{saveStatus}</span>}
                </div>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', minHeight: '400px', color: 'var(--text-muted)' }}>
              Select a member from the list to edit their details.
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
