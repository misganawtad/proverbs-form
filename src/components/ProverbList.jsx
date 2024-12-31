import React, { useState, useEffect } from 'react';

const ProverbList = () => {
  const API_URL = 'http://localhost:5000/api';
  const [proverbs, setProverbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  // Common styles
  const sectionClass = "bg-white rounded-lg shadow-md p-6 mb-6";
  const headerClass = "text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200";
  const inputClass = "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  useEffect(() => {
    fetchProverbs();
  }, []);

  const fetchProverbs = async () => {
    try {
      const response = await fetch(`${API_URL}/proverbs`);
      if (!response.ok) throw new Error('Failed to fetch proverbs');
      const data = await response.json();
      setProverbs(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this proverb?')) {
      try {
        const response = await fetch(`${API_URL}/proverbs/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete proverb');
        setProverbs(proverbs.filter(p => p._id !== id));
      } catch (err) {
        alert('Error deleting proverb: ' + err.message);
      }
    }
  };

  const handleEdit = (proverb) => {
    setEditingId(proverb._id);
    setEditForm({ ...proverb });
  };

  const handleSave = async () => {
    try {
      if (!editForm.originalText || !editForm.language || !editForm.country) {
        alert('Original text, language, and country are required fields');
        return;
      }

      const response = await fetch(`${API_URL}/proverbs/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update proverb');
      }
      
      const updatedProverb = await response.json();
      setProverbs(proverbs.map(p => p._id === editingId ? updatedProverb : p));
      setEditingId(null);
      setEditForm(null);
      alert('Proverb updated successfully!');
    } catch (err) {
      alert('Error updating proverb: ' + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'relevantSituations') {
      // Handle multiple select
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setEditForm(prev => ({
        ...prev,
        [name]: selectedOptions
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const formatRelevantSituations = (situations) => {
    if (!Array.isArray(situations)) return '';
    
    // Map of values to display names
    const situationNames = {
      breakups: 'Breakups and Divorce',
      friendship_loss: 'Loss of Friendships',
      family_conflicts: 'Family Conflicts',
      social_isolation: 'Social Isolation',
      toxic_relationships: 'Toxic Relationships',
      grief: 'Loss of Loved Ones',
      job_loss: 'Job Loss',
      career_setbacks: 'Career Setbacks',
      workplace_issues: 'Workplace Harassment',
      burnout: 'Professional Burnout',
      unfulfilling_work: 'Unfulfilling Work',
      financial_stress: 'Financial Stress',
      academic_failure: 'Academic Failure',
      poor_performance: 'Poor Performance',
      school_bullying: 'School Bullying',
      learning_difficulties: 'Learning Difficulties',
      academic_pressure: 'Academic Pressure',
      chronic_illness: 'Chronic Illness',
      physical_disability: 'Physical Disability',
      hormonal_changes: 'Hormonal Changes',
      chronic_pain: 'Chronic Pain',
      sleep_disorders: 'Sleep Disorders',
      low_self_esteem: 'Low Self-esteem',
      identity_crisis: 'Identity Crisis',
      body_image: 'Body Image Issues',
      cultural_adjustment: 'Cultural Adjustment',
      life_transitions: 'Life Transitions',
      relocation: 'Moving to New Place',
      life_changes: 'Major Life Changes',
      financial_hardship: 'Financial Hardship',
      legal_problems: 'Legal Problems',
      housing_issues: 'Housing Insecurity',
      physical_abuse: 'Physical Abuse',
      emotional_abuse: 'Emotional Abuse',
      childhood_trauma: 'Childhood Trauma',
      accident_trauma: 'Accidents',
      violence_trauma: 'Witnessing Violence',
      seasonal_depression: 'Seasonal Depression',
      lack_of_sunlight: 'Lack of Sunlight',
      geographic_isolation: 'Geographic Isolation',
      environmental_stress: 'Environmental Stress'
    };

    return situations.map(s => situationNames[s] || s).join(', ');
  };

  if (loading) return <div>Loading proverbs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Proverbs List</h1>
      <div className="max-w-4xl mx-auto space-y-6">
        {proverbs.map((proverb) => (
          <div key={proverb._id} className="bg-white rounded-lg shadow-md">
            {editingId === proverb._id ? (
              <div className="p-6">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-semibold">Edit Proverb</h2>
                  <div className="space-x-2">
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditForm(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Core Information Section */}
                <section className={sectionClass}>
                  <h2 className={headerClass}>Core Information</h2>
                  <div className="grid gap-6">
                    <div>
                      <label className={labelClass}>Original Text *</label>
                      <textarea
                        name="originalText"
                        value={editForm.originalText}
                        onChange={handleChange}
                        className={`${inputClass} h-24`}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>English Translation</label>
                      <textarea
                        name="englishTranslation"
                        value={editForm.englishTranslation}
                        onChange={handleChange}
                        className={`${inputClass} h-24`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Language *</label>
                        <input
                          type="text"
                          name="language"
                          value={editForm.language}
                          onChange={handleChange}
                          className={inputClass}
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Country/Region *</label>
                        <input
                          type="text"
                          name="country"
                          value={editForm.country}
                          onChange={handleChange}
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Meaning and Usage Section */}
                <section className={sectionClass}>
                  <h2 className={headerClass}>Meaning and Usage</h2>
                  <div className="grid gap-6">
                    <div>
                      <label className={labelClass}>Literal Meaning</label>
                      <textarea
                        name="literalMeaning"
                        value={editForm.literalMeaning}
                        onChange={handleChange}
                        className={`${inputClass} h-24`}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Metaphorical Meaning</label>
                      <textarea
                        name="metaphoricalMeaning"
                        value={editForm.metaphoricalMeaning}
                        onChange={handleChange}
                        className={`${inputClass} h-24`}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Usage Scenarios</label>
                      <textarea
                        name="usageScenarios"
                        value={editForm.usageScenarios}
                        onChange={handleChange}
                        className={`${inputClass} h-24`}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Life Lesson</label>
                      <textarea
                        name="lifeLesson"
                        value={editForm.lifeLesson}
                        onChange={handleChange}
                        className={`${inputClass} h-24`}
                      />
                    </div>
                  </div>
                </section>

                {/* Applications Section */}
                <section className={sectionClass}>
                  <h2 className={headerClass}>Applications and Impact</h2>
                  <div className="grid gap-6">
                    <div>
                      <label className={labelClass}>Therapeutic Value</label>
                      <textarea
                        name="therapeuticValue"
                        value={editForm.therapeuticValue}
                        onChange={handleChange}
                        className={`${inputClass} h-24`}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Relevant Situations</label>
                      <select
                        name="relevantSituations"
                        value={editForm.relevantSituations || []}
                        onChange={handleChange}
                        className={`${inputClass}`}
                        multiple
                        size="10"
                      >
                        <optgroup label="Relationship-Related">
                          <option value="breakups">Breakups and Divorce</option>
                          <option value="friendship_loss">Loss of Friendships</option>
                          <option value="family_conflicts">Family Conflicts</option>
                          <option value="social_isolation">Social Isolation</option>
                          <option value="toxic_relationships">Toxic Relationships</option>
                          <option value="grief">Loss of Loved Ones</option>
                        </optgroup>

                        <optgroup label="Career/Professional">
                          <option value="job_loss">Job Loss</option>
                          <option value="career_setbacks">Career Setbacks</option>
                          <option value="workplace_issues">Workplace Harassment</option>
                          <option value="burnout">Professional Burnout</option>
                          <option value="unfulfilling_work">Unfulfilling Work</option>
                          <option value="financial_stress">Financial Stress</option>
                        </optgroup>

                        <optgroup label="Academic/Educational">
                          <option value="academic_failure">Academic Failure</option>
                          <option value="poor_performance">Poor Performance</option>
                          <option value="school_bullying">School Bullying</option>
                          <option value="learning_difficulties">Learning Difficulties</option>
                          <option value="academic_pressure">Academic Pressure</option>
                        </optgroup>

                        <optgroup label="Health-Related">
                          <option value="chronic_illness">Chronic Illness</option>
                          <option value="physical_disability">Physical Disability</option>
                          <option value="hormonal_changes">Hormonal Changes</option>
                          <option value="chronic_pain">Chronic Pain</option>
                          <option value="sleep_disorders">Sleep Disorders</option>
                        </optgroup>

                        <optgroup label="Identity/Personal">
                          <option value="low_self_esteem">Low Self-esteem</option>
                          <option value="identity_crisis">Identity Crisis</option>
                          <option value="body_image">Body Image Issues</option>
                          <option value="cultural_adjustment">Cultural Adjustment</option>
                          <option value="life_transitions">Life Transitions</option>
                        </optgroup>

                        <optgroup label="Circumstantial">
                          <option value="relocation">Moving to New Place</option>
                          <option value="life_changes">Major Life Changes</option>
                          <option value="financial_hardship">Financial Hardship</option>
                          <option value="legal_problems">Legal Problems</option>
                          <option value="housing_issues">Housing Insecurity</option>
                        </optgroup>

                        <optgroup label="Trauma-Related">
                          <option value="physical_abuse">Physical Abuse</option>
                          <option value="emotional_abuse">Emotional Abuse</option>
                          <option value="childhood_trauma">Childhood Trauma</option>
                          <option value="accident_trauma">Accidents</option>
                          <option value="violence_trauma">Witnessing Violence</option>
                        </optgroup>

                        <optgroup label="Seasonal/Environmental">
                          <option value="seasonal_depression">Seasonal Depression</option>
                          <option value="lack_of_sunlight">Lack of Sunlight</option>
                          <option value="geographic_isolation">Geographic Isolation</option>
                          <option value="environmental_stress">Environmental Stress</option>
                        </optgroup>
                      </select>
                      <small className="text-gray-500 mt-1 block">
                        Hold Ctrl (Cmd on Mac) to select multiple situations
                      </small>
                    </div>

                    <div>
                      <label className={labelClass}>Mood Category</label>
                      <select
                        name="moodCategory"
                        value={editForm.moodCategory}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select a category</option>
                        <option value="uplifting">Uplifting</option>
                        <option value="comforting">Comforting</option>
                        <option value="motivating">Motivating</option>
                        <option value="calming">Calming</option>
                        <option value="empowering">Empowering</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Success Stories</label>
                      <textarea
                        name="successStories"
                        value={editForm.successStories}
                        onChange={handleChange}
                        className={`${inputClass} h-24`}
                      />
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{proverb.originalText}</h2>
                      {proverb.englishTranslation && (
                        <p className="text-gray-600 italic">{proverb.englishTranslation}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <p><span className="font-medium">Language:</span> {proverb.language}</p>
                      <p><span className="font-medium">Country:</span> {proverb.country}</p>
                    </div>

                    {proverb.literalMeaning && (
                      <p><span className="font-medium">Literal Meaning:</span> {proverb.literalMeaning}</p>
                    )}
                    {proverb.metaphoricalMeaning && (
                      <p><span className="font-medium">Metaphorical Meaning:</span> {proverb.metaphoricalMeaning}</p>
                    )}
                    {proverb.usageScenarios && (
                      <p><span className="font-medium">Usage:</span> {proverb.usageScenarios}</p>
                    )}
                    {proverb.lifeLesson && (
                      <p><span className="font-medium">Life Lesson:</span> {proverb.lifeLesson}</p>
                    )}
                    {proverb.therapeuticValue && (
                      <p><span className="font-medium">Therapeutic Value:</span> {proverb.therapeuticValue}</p>
                    )}
                    {proverb.relevantSituations && (
                      <p><span className="font-medium">Relevant Situations:</span> {formatRelevantSituations(proverb.relevantSituations)}</p>
                    )}
                    {proverb.moodCategory && (
                      <p><span className="font-medium">Mood:</span> {proverb.moodCategory}</p>
                    )}
                    {proverb.successStories && (
                      <p><span className="font-medium">Success Stories:</span> {proverb.successStories}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(proverb)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(proverb._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProverbList;