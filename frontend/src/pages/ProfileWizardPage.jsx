import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../services/api';
import { useTranslation } from '../i18n/index.js';

const STEPS_KEYS = ['step_personal', 'step_location', 'step_work', 'step_special', 'step_additional'];
const STEP_FIELDS = [
  ['age', 'gender'],
  ['state', 'category'],
  ['occupation', 'education', 'income'],
  ['is_farmer', 'land_size', 'disability'],
  ['marital_status', 'is_bpl', 'domicile_certificate'],
];

const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'];
const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi',
];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const GENDERS = ['Male', 'Female', 'Other'];
const OCCUPATIONS = ['Farmer', 'Student', 'Government Employee', 'Private Employee', 'Self-employed', 'Unemployed', 'Retired', 'Other'];
const EDUCATIONS = ['No Education', '10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'PhD', 'Diploma', 'Other'];

export default function ProfileWizardPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    age: '', gender: '', income: '', state: '', category: '',
    occupation: '', education: '', is_farmer: false, land_size: '', disability: false,
    marital_status: '', is_bpl: false, domicile_certificate: false,
  });
  const [existingProfile, setExistingProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    profileAPI.getMyProfile()
      .then((res) => {
        if (res.data?.profile) {
          const p = res.data.profile;
          setExistingProfile(p);
          setFormData({
            age: p.age || '',
            gender: p.gender || '',
            income: p.income || '',
            state: p.state || '',
            category: p.category || '',
            occupation: p.occupation || '',
            education: p.education || '',
            is_farmer: p.is_farmer || false,
            land_size: p.land_size || '',
            disability: p.disability || false,
            marital_status: p.marital_status || '',
            is_bpl: p.is_bpl || false,
            domicile_certificate: p.domicile_certificate || false,
          });
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        income: formData.income ? parseInt(formData.income) : null,
        land_size: formData.land_size ? parseFloat(formData.land_size) : null,
      };

      if (existingProfile) {
        await profileAPI.updateProfile(payload);
      } else {
        await profileAPI.createProfile(payload);
      }
      setSuccess(t('profile.savedSuccess'));
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || t('profile.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page"><div className="loading"><div className="spinner"></div> {t('profile.loading')}</div></div>;
  }

  return (
    <div className="page" style={{ maxWidth: '600px' }}>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1>📝 {existingProfile ? t('profile.updateTitle').replace('📝 ', '') : t('profile.completeTitle').replace('📝 ', '')}</h1>
        <p>{t('profile.subtitle')}</p>
      </div>

      {/* Stepper */}
      <div className="wizard-steps">
        {STEPS_KEYS.map((key, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            <div
              className={`wizard-step ${i === step ? 'active' : i < step ? 'done' : ''}`}
              onClick={() => setStep(i)}
              style={{ cursor: 'pointer' }}
            >
              {i < step ? '✓' : i + 1}
            </div>
            {i < STEPS_KEYS.length - 1 && <div className={`wizard-connector ${i < step ? 'done' : ''}`}></div>}
          </span>
        ))}
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem' }}>{t(`profile.${STEPS_KEYS[step]}`)} {t('profile.details')}</h3>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Step 1: Personal */}
        {step === 0 && (
          <>
            <div className="form-group">
              <label>{t('profile.ageLabel')}</label>
              <input type="number" className="form-control" placeholder={t('profile.agePlaceholder')}
                value={formData.age} onChange={(e) => handleChange('age', e.target.value)} min="1" max="120" />
            </div>
            <div className="form-group">
              <label>{t('profile.genderLabel')}</label>
              <select className="form-control" value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)}>
                <option value="">{t('profile.selectGender')}</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </>
        )}

        {/* Step 2: Location */}
        {step === 1 && (
          <>
            <div className="form-group">
              <label>{t('profile.stateLabel')}</label>
              <select className="form-control" value={formData.state} onChange={(e) => handleChange('state', e.target.value)}>
                <option value="">{t('profile.selectState')}</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t('profile.categoryLabel')}</label>
              <select className="form-control" value={formData.category} onChange={(e) => handleChange('category', e.target.value)}>
                <option value="">{t('profile.selectCategory')}</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </>
        )}

        {/* Step 3: Work */}
        {step === 2 && (
          <>
            <div className="form-group">
              <label>{t('profile.occupationLabel')}</label>
              <select className="form-control" value={formData.occupation} onChange={(e) => handleChange('occupation', e.target.value)}>
                <option value="">{t('profile.selectOccupation')}</option>
                {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t('profile.educationLabel')}</label>
              <select className="form-control" value={formData.education} onChange={(e) => handleChange('education', e.target.value)}>
                <option value="">{t('profile.selectEducation')}</option>
                {EDUCATIONS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t('profile.incomeLabel')}</label>
              <input type="number" className="form-control" placeholder={t('profile.incomePlaceholder')}
                value={formData.income} onChange={(e) => handleChange('income', e.target.value)} min="0" />
            </div>
          </>
        )}

        {/* Step 4: Special */}
        {step === 3 && (
          <>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.is_farmer}
                  onChange={(e) => handleChange('is_farmer', e.target.checked)}
                  style={{ width: '18px', height: '18px' }} />
                {t('profile.farmerLabel')}
              </label>
            </div>
            {formData.is_farmer && (
              <div className="form-group">
                <label>{t('profile.landSizeLabel')}</label>
                <input type="number" className="form-control" placeholder={t('profile.landSizePlaceholder')}
                  value={formData.land_size} onChange={(e) => handleChange('land_size', e.target.value)} min="0" step="0.1" />
              </div>
            )}
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.disability}
                  onChange={(e) => handleChange('disability', e.target.checked)}
                  style={{ width: '18px', height: '18px' }} />
                {t('profile.disabilityLabel')}
              </label>
            </div>
          </>
        )}

        {/* Step 5: Additional (Optional) */}
        {step === 4 && (
          <>
            <div className="form-group">
              <label>{t('profile.maritalStatusLabel')}</label>
              <select className="form-control" value={formData.marital_status} onChange={(e) => handleChange('marital_status', e.target.value)}>
                <option value="">{t('profile.selectMarital')}</option>
                {MARITAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.is_bpl}
                  onChange={(e) => handleChange('is_bpl', e.target.checked)}
                  style={{ width: '18px', height: '18px' }} />
                {t('profile.bplLabel')}
              </label>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.domicile_certificate}
                  onChange={(e) => handleChange('domicile_certificate', e.target.checked)}
                  style={{ width: '18px', height: '18px' }} />
                {t('profile.domicileLabel')}
              </label>
            </div>
          </>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
          <button className="btn btn-outline" onClick={() => setStep(step - 1)} disabled={step === 0}>
            {t('profile.previous')}
          </button>
          {step < STEPS_KEYS.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
              {t('profile.next')}
            </button>
          ) : (
            <button className="btn btn-accent" onClick={handleSubmit} disabled={saving}>
              {saving ? <><span className="spinner"></span> {t('profile.saving')}</> : t('profile.saveProfile')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
