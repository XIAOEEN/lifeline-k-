import React, { useState } from 'react';
import { UserInput, Gender, Language } from '../types';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { getTexts } from '../locales';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
  lang: Language;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, lang }) => {
  const t = getTexts(lang);
  const [formData, setFormData] = useState<UserInput>({
    name: '',
    gender: Gender.MALE,
    birthDate: '1990-01-01',
    birthTime: '00:00',
    birthLocation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-700 transition-colors duration-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white serif mb-2 transition-colors">{t.inputTitle}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">{t.inputSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">{t.nameLabel}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 transition-colors"
              placeholder={lang === 'zh' ? "您的姓名" : "Your Name"}
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">{t.genderLabel}</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: Gender.MALE })}
              className={`py-3 rounded-lg border font-medium transition-all ${
                formData.gender === Gender.MALE
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              {t.male}
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: Gender.FEMALE })}
              className={`py-3 rounded-lg border font-medium transition-all ${
                formData.gender === Gender.FEMALE
                  ? 'bg-pink-50 dark:bg-pink-900/30 border-pink-500 text-pink-700 dark:text-pink-300'
                  : 'border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              {t.female}
            </button>
          </div>
        </div>

        {/* Birth Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">{t.birthDateLabel}</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="date"
              name="birthDate"
              required
              value={formData.birthDate}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:scheme-dark transition-colors"
            />
          </div>
        </div>

        {/* Birth Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">{t.birthTimeLabel}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="time"
              name="birthTime"
              required
              value={formData.birthTime}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:scheme-dark transition-colors"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">{t.birthPlaceLabel}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              name="birthLocation"
              required
              value={formData.birthLocation}
              onChange={handleChange}
              placeholder={t.birthPlacePlaceholder}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t.loading}
            </>
          ) : (
            `✨ ${t.submitButton}`
          )}
        </button>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50 flex items-start gap-3 transition-colors">
          <div className="mt-0.5">💡</div>
          <p>{t.tip}</p>
        </div>
      </form>
    </div>
  );
};

export default InputForm;