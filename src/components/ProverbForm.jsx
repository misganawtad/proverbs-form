import React, { useState } from 'react';

const ProverbForm = () => {
  const initialFormState = {
    originalText: '',
    englishTranslation: '',
    language: '',
    country: '',
    literalMeaning: '',
    metaphoricalMeaning: '',
    usageScenarios: '',
    lifeLesson: '',
    therapeuticValue: '',
    relevantSituations: [],
    moodCategory: '',
    successStories: ''
  };
  
  const API_URL = '/api';
  const [formData, setFormData] = useState(initialFormState);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'relevantSituations') {
      // Handle multiple select
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prevState => ({
        ...prevState,
        [name]: selectedOptions
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting...');

    try {
      if (!formData.moodCategory) {
        setMessage('Please select a mood category');
        return;
      }

      const response = await fetch(`${API_URL}/proverbs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit proverb');
      }

      const data = await response.json();
      
      // Show success message with proverb details
      setMessage(`Proverb "${formData.originalText}" has been successfully submitted in ${formData.language}!`);
      setFormData(initialFormState);
    } catch (error) {
      setMessage('Error submitting proverb: ' + error.message);
      console.error('Submission error:', error);
    }
  };

  // Common styles
  const sectionClass = "bg-white rounded-lg shadow-md p-6 mb-6";
  const headerClass = "text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200";
  const inputClass = "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Proverb Collection Form
        </h1>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Core Information Section */}
          <section className={sectionClass}>
            <h2 className={headerClass}>Core Information</h2>
            <div className="grid gap-6">
              <div>
                <label className={labelClass}>Original Text *</label>
                <textarea
                  name="originalText"
                  value={formData.originalText}
                  onChange={handleChange}
                  className={`${inputClass} h-24`}
                  required
                  placeholder="Enter the proverb in its original language"
                />
              </div>

              <div>
                <label className={labelClass}>English Translation</label>
                <textarea
                  name="englishTranslation"
                  value={formData.englishTranslation}
                  onChange={handleChange}
                  className={`${inputClass} h-24`}
                  placeholder="Provide English translation if applicable"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Language *</label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className={inputClass}
                    required
                    placeholder="e.g., Arabic, Chinese, English"
                  />
                </div>

                <div>
                  <label className={labelClass}>Country/Region *</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={inputClass}
                    required
                    placeholder="Country or region of origin"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Meaning Section */}
          <section className={sectionClass}>
            <h2 className={headerClass}>Meaning and Usage</h2>
            <div className="grid gap-6">
              <div>
                <label className={labelClass}>Literal Meaning</label>
                <textarea
                  name="literalMeaning"
                  value={formData.literalMeaning}
                  onChange={handleChange}
                  className={`${inputClass} h-24`}
                  placeholder="What does this proverb literally mean?"
                />
              </div>

              <div>
                <label className={labelClass}>Metaphorical Meaning</label>
                <textarea
                  name="metaphoricalMeaning"
                  value={formData.metaphoricalMeaning}
                  onChange={handleChange}
                  className={`${inputClass} h-24`}
                  placeholder="What deeper meaning does this proverb convey?"
                />
              </div>

              <div>
                <label className={labelClass}>Usage Scenarios</label>
                <textarea
                  name="usageScenarios"
                  value={formData.usageScenarios}
                  onChange={handleChange}
                  className={`${inputClass} h-24`}
                  placeholder="In what situations would this proverb be used?"
                />
              </div>

              <div>
                <label className={labelClass}>Life Lesson</label>
                <textarea
                  name="lifeLesson"
                  value={formData.lifeLesson}
                  onChange={handleChange}
                  className={`${inputClass} h-24`}
                  placeholder="What life lesson does this proverb teach?"
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
                  value={formData.therapeuticValue}
                  onChange={handleChange}
                  className={`${inputClass} h-24`}
                  placeholder="How might this proverb help someone who is struggling?"
                />
              </div>

              <div>
                <label className={labelClass}>Relevant Situations</label>
                <select
                  name="relevantSituations"
                  value={formData.relevantSituations}
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
                <label className={labelClass}>Mood Category *</label>
                <select
                  name="moodCategory"
                  value={formData.moodCategory}
                  onChange={handleChange}
                  className={inputClass}
                  required>
                  <option value="" disabled>Please select a mood category</option>
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
                  value={formData.successStories}
                  onChange={handleChange}
                  className={`${inputClass} h-24`}
                  placeholder="Share any stories of how this proverb has helped others"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all font-medium"
            >
              Submit Proverb
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProverbForm;
