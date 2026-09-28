import { useState, useRef } from 'react';
import { AtSign, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Camera, Trash2, Loader2, Sparkles, User as UserIcon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import authApi from '../../api/authApi';

export default function RegisterForm({ onSuccess, onNavigate, isDark = true }) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Optional Profile Picture with Cloudinary
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image (JPEG, PNG, WEBP, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Profile photo must be less than 5MB');
      return;
    }

    setErrorMessage('');
    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);
    setIsUploadingAvatar(true);

    try {
      const response = await authApi.uploadAvatar(file);
      if (response.data && response.data.url) {
        setAvatarUrl(response.data.url);
      }
    } catch (err) {
      console.warn('Avatar upload fallback used:', err);
      // Fallback: convert file to local data URI so user avatar is still preserved
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview('');
    setAvatarUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // 0 - 5
  };

  const strengthScore = getPasswordStrength();
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const strengthColors = [
    'bg-slate-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-emerald-500',
    'bg-emerald-400',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim()) {
      setErrorMessage('Please choose a username');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    if (isUploadingAvatar) {
      setErrorMessage('Please wait until your profile picture finishes uploading');
      return;
    }

    setIsLoading(true);
    try {
      const normalizedUsername = username.trim().toLowerCase().replace(/\s+/g, '');
      const normalizedEmail = email.trim().toLowerCase();

      await register({
        username: normalizedUsername,
        email: normalizedEmail,
        password,
        confirmPassword,
        avatarUrl: avatarUrl || undefined,
      });

      setSuccessMessage('Registration successful! Please enter the 6-digit OTP sent to your email.');
      if (onSuccess) {
        setTimeout(() => onSuccess(normalizedEmail), 1200);
      } else if (onNavigate) {
        setTimeout(() => onNavigate('verify-email', { email: normalizedEmail }), 1200);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-start gap-2.5 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="flex-1">{errorMessage}</span>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-400 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Profile Picture Upload (Optional) */}
      <div className="flex flex-col items-center justify-center pb-1">
        <div className="relative group">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden relative ${
              avatarPreview
                ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                : isDark
                ? 'border-white/20 bg-white/[0.04] hover:border-purple-400 hover:bg-white/[0.08]'
                : 'border-slate-300 bg-slate-50 hover:border-purple-500 hover:bg-purple-50/50'
            }`}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-slate-400 group-hover:text-purple-400 transition-colors">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[9px] font-semibold">Upload</span>
              </div>
            )}

            {/* Uploading Overlay */}
            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
              </div>
            )}
          </div>

          {/* Camera Badge / Remove Button */}
          {avatarPreview ? (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-transform hover:scale-110 cursor-pointer"
              title="Remove profile photo"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:scale-105 transition-transform cursor-pointer"
              title="Add profile photo"
            >
              <Camera className="w-3 h-3" />
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <div className="text-center mt-1.5">
          <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Profile Photo <span className="text-purple-400 font-normal">(Optional)</span>
          </span>
          {isUploadingAvatar && (
            <p className="text-[10px] text-purple-400 animate-pulse mt-0.5">Uploading to Cloudinary...</p>
          )}
        </div>
      </div>

      {/* Username */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Unique Username
          </label>
          {username && (
            <span className="text-[10px] text-emerald-400 font-mono">
              @{username.toLowerCase().replace(/[^a-z0-9_]/g, '')}
            </span>
          )}
        </div>
        <div className="relative">
          <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="register-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
            placeholder="alex_cx"
            disabled={isLoading}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors focus:outline-none focus:border-purple-500 ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com"
            disabled={isLoading}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors focus:outline-none focus:border-purple-500 ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            disabled={isLoading}
            className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors focus:outline-none focus:border-purple-500 ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Password Strength:
              </span>
              <span className="font-semibold text-purple-400">
                {strengthLabels[strengthScore]}
              </span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden flex gap-1">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <div
                  key={lvl}
                  className={`h-full flex-1 rounded-full transition-all duration-300 ${
                    strengthScore >= lvl ? strengthColors[strengthScore] : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="register-confirm-password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            disabled={isLoading}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors focus:outline-none focus:border-purple-500 ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500 shrink-0"
          />
          <span className={`text-[11px] sm:text-xs leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            I agree to the ConnectX{' '}
            <a href="#terms" className="text-purple-400 hover:underline">Terms of Service</a> and{' '}
            <a href="#privacy" className="text-purple-400 hover:underline">Privacy Policy</a>.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        id="register-submit-btn"
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 group relative inline-flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(124,58,237,0.45)] hover:shadow-[0_0_35px_rgba(124,58,237,0.7)] transition-all duration-300 disabled:opacity-60 cursor-pointer"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating Account...
          </span>
        ) : (
          <>
            <span>Create Your Free Account</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
