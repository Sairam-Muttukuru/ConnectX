import { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Shield,
  Volume2,
  VolumeX,
  Play,
  Square,
  Upload,
  Music,
  Moon,
  Sun,
  Lock,
  Monitor,
  Smartphone,
  Laptop,
  Camera,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Edit2,
  ChevronRight,
  ArrowRight,
  Check,
  X,
  Loader2,
  Trash2,
  LogOut,
  Sparkles,
  KeyRound,
  Fingerprint,
} from 'lucide-react';
import settingsService from '../../../services/settingsService';
import { authStorage } from '../../../utils/authStorage';
import { useToast } from '../../../context/ToastContext';

// Accent theme definitions with rich colors, gradients, and glow
const ACCENT_THEMES = {
  purple: {
    id: 'purple',
    name: 'Purple Neon',
    btn: 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30',
    tab: 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold',
    ring: 'ring-purple-500',
    border: 'border-purple-500',
    text: 'text-purple-400',
    bgBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    toggle: 'bg-purple-600',
  },
  blue: {
    id: 'blue',
    name: 'Electric Blue',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30',
    tab: 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold',
    ring: 'ring-blue-500',
    border: 'border-blue-500',
    text: 'text-blue-400',
    bgBadge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    toggle: 'bg-blue-600',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Wave',
    btn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30',
    tab: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold',
    ring: 'ring-emerald-500',
    border: 'border-emerald-500',
    text: 'text-emerald-400',
    bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    toggle: 'bg-emerald-600',
  },
  rose: {
    id: 'rose',
    name: 'Rose Bloom',
    btn: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30',
    tab: 'bg-rose-600 text-white shadow-md shadow-rose-600/30 font-bold',
    ring: 'ring-rose-500',
    border: 'border-rose-500',
    text: 'text-rose-400',
    bgBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    toggle: 'bg-rose-600',
  },
  amber: {
    id: 'amber',
    name: 'Amber Sunset',
    btn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30',
    tab: 'bg-amber-600 text-white shadow-md shadow-amber-600/30 font-bold',
    ring: 'ring-amber-500',
    border: 'border-amber-500',
    text: 'text-amber-400',
    bgBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    toggle: 'bg-amber-600',
  },
};

// Preset Ringtones with web audio sound synthesis
const PRESET_RINGTONES = [
  {
    id: 'ConnectX Chime (Default)',
    name: 'ConnectX Chime',
    desc: 'Crisp dual-tone crystal notification chime (Recommended)',
    type: 'preset',
    tags: 'Default • Melodic',
  },
  {
    id: 'Cosmic Ripple',
    name: 'Cosmic Ripple',
    desc: 'Deep ethereal arpeggio wave with dreamy spatial echo',
    type: 'preset',
    tags: 'Futuristic • Ambient',
  },
  {
    id: 'Crystal Bell',
    name: 'Crystal Bell',
    desc: 'High clarity bell chime with lingering glass resonance',
    type: 'preset',
    tags: 'Gentle • Clear',
  },
  {
    id: 'Neon Pulse',
    name: 'Neon Pulse',
    desc: 'Energetic cybernetic pulse alert with bass kick',
    type: 'preset',
    tags: 'Punchy • Cyber',
  },
  {
    id: 'Subtle Pop',
    name: 'Subtle Pop',
    desc: 'Minimalist organic droplet click for quiet environments',
    type: 'preset',
    tags: 'Minimal • Soft',
  },
  {
    id: 'Zen Marimba',
    name: 'Zen Marimba',
    desc: 'Warm acoustic wooden mallet melody',
    type: 'preset',
    tags: 'Warm • Relaxing',
  },
  {
    id: 'Cyber Beacon',
    name: 'Cyber Beacon',
    desc: 'Dual acoustic frequency beacon with sharp pickup',
    type: 'preset',
    tags: 'Modern • Sharp',
  },
];

export default function SettingsView({
  user,
  isDark = true,
  toggleTheme,
  onLogout,
  accentColor: externalAccent = 'purple',
  onAccentChange,
}) {
  const [activeTab, setActiveTab] = useState('Account & Security');
  const [loading, setLoading] = useState(false);

  // Edit modes
  const [isEditingAccount, setIsEditingAccount] = useState(false);

  // Saving spinners
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [saving2FA, setSaving2FA] = useState(false);
  const [savingRingtone, setSavingRingtone] = useState(false);
  const [savingAppearance, setSavingAppearance] = useState(false);
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  // Backups for cancel functionality
  const accountBackupRef = useRef({ username: '', email: '' });

  // Account Information
  const [username, setUsername] = useState(user?.username || 'sairam_developer');
  const [email, setEmail] = useState(user?.email || 'sairammuttukurua0.cse@gmail.com');

  // Password fields (strictly guarded against autofill)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Guarantee password fields are always empty on mount and tab switch
  useEffect(() => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    const timer = setTimeout(() => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 150);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notification Ringtone State
  const [selectedRingtone, setSelectedRingtone] = useState(
    localStorage.getItem('connectx_ringtone') || 'ConnectX Chime (Default)'
  );
  const [ringtoneVolume, setRingtoneVolume] = useState(85);
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(true);
  const [customAudioFile, setCustomAudioFile] = useState(null);
  const [customAudioName, setCustomAudioName] = useState(
    localStorage.getItem('connectx_custom_ringtone_name') || ''
  );
  const [customAudioUrl, setCustomAudioUrl] = useState(
    localStorage.getItem('connectx_custom_ringtone_url') || ''
  );
  const [playingRingtoneId, setPlayingRingtoneId] = useState(null);
  const audioRef = useRef(null);
  const ringtoneFileInputRef = useRef(null);

  // Appearance State
  const [appearance, setAppearance] = useState({
    theme: isDark ? 'dark' : 'light',
    accentColor: externalAccent || localStorage.getItem('connectx_accent') || 'purple',
    compactMode: localStorage.getItem('connectx_compact_mode') === 'true',
    messageFontSize: localStorage.getItem('connectx_message_font_size') || 'medium',
  });

  // Privacy State
  const [privacy, setPrivacy] = useState({
    privateAccount: false,
    showOnlineStatus: true,
    showReadReceipts: true,
    allowDirectMessages: 'EVERYONE',
    searchEngineIndexing: false,
  });

  // Connected Devices State
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const { showToast } = useToast();
  const usernameInputRef = useRef(null);

  // Sync external accent if passed
  useEffect(() => {
    if (externalAccent && externalAccent !== appearance.accentColor) {
      setAppearance((prev) => ({ ...prev, accentColor: externalAccent }));
    }
  }, [externalAccent]);

  // Selected Accent Theme
  const currentAccent = ACCENT_THEMES[appearance.accentColor] || ACCENT_THEMES.purple;

  // Web Audio Synthesizer for high-fidelity preset playback
  const playToneSound = (ringtoneId) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const gainNode = ctx.createGain();
      const masterVolume = (ringtoneVolume / 100) * 0.25;

      gainNode.gain.setValueAtTime(masterVolume, ctx.currentTime);
      gainNode.connect(ctx.destination);

      setPlayingRingtoneId(ringtoneId);

      if (ringtoneId.includes('ConnectX Chime')) {
        // Dual-bell shimmer
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(880, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
        osc2.frequency.setValueAtTime(1760, ctx.currentTime + 0.1);
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc1.start();
        osc2.start(ctx.currentTime + 0.08);
        osc1.stop(ctx.currentTime + 0.5);
        osc2.stop(ctx.currentTime + 0.5);
        setTimeout(() => setPlayingRingtoneId(null), 550);
      } else if (ringtoneId.includes('Cosmic Ripple')) {
        // Space arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          noteGain.gain.setValueAtTime(masterVolume, ctx.currentTime + idx * 0.1);
          noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);
          osc.connect(noteGain);
          noteGain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.1);
          osc.stop(ctx.currentTime + idx * 0.1 + 0.4);
        });
        setTimeout(() => setPlayingRingtoneId(null), 850);
      } else if (ringtoneId.includes('Crystal Bell')) {
        // Bright glass chime
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
        osc.connect(gainNode);
        osc.start();
        osc.stop(ctx.currentTime + 0.65);
        setTimeout(() => setPlayingRingtoneId(null), 700);
      } else if (ringtoneId.includes('Neon Pulse')) {
        // Electronic pulse
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.25);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gainNode);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
        setTimeout(() => setPlayingRingtoneId(null), 400);
      } else if (ringtoneId.includes('Subtle Pop')) {
        // Wooden pop
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gainNode);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
        setTimeout(() => setPlayingRingtoneId(null), 200);
      } else if (ringtoneId.includes('Zen Marimba')) {
        // Marimba chord
        const notes = [440, 554.37, 659.25];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
          noteGain.gain.setValueAtTime(masterVolume, ctx.currentTime + idx * 0.07);
          noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.45);
          osc.connect(noteGain);
          noteGain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.07);
          osc.stop(ctx.currentTime + idx * 0.07 + 0.45);
        });
        setTimeout(() => setPlayingRingtoneId(null), 750);
      } else {
        // Cyber Beacon
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(987.77, ctx.currentTime);
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.12);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.connect(gainNode);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
        setTimeout(() => setPlayingRingtoneId(null), 500);
      }
    } catch {
      setPlayingRingtoneId(null);
    }
  };

  const handlePlayRingtone = (ringtone) => {
    if (playingRingtoneId === ringtone.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingRingtoneId(null);
      return;
    }

    if (ringtone.type === 'custom' && customAudioUrl) {
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio(customAudioUrl);
        } else {
          audioRef.current.src = customAudioUrl;
        }
        audioRef.current.volume = Math.max(0, Math.min(1, ringtoneVolume / 100));
        setPlayingRingtoneId(ringtone.id);
        audioRef.current.play();
        audioRef.current.onended = () => setPlayingRingtoneId(null);
        audioRef.current.onerror = () => {
          setPlayingRingtoneId(null);
          showToast('Could not play custom audio file', 'error');
        };
      } catch {
        setPlayingRingtoneId(null);
      }
    } else {
      playToneSound(ringtone.id);
    }
  };

  const handleCustomAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        showToast('Audio file size must be less than 12MB', 'error');
        return;
      }
      const url = URL.createObjectURL(file);
      setCustomAudioFile(file);
      setCustomAudioName(file.name);
      setCustomAudioUrl(url);
      setSelectedRingtone(`Custom: ${file.name}`);
      localStorage.setItem('connectx_custom_ringtone_name', file.name);
      localStorage.setItem('connectx_custom_ringtone_url', url);
      showToast(`Custom audio loaded: "${file.name}". Click Save to persist.`);
    }
  };

  // Sync theme with prop when isDark changes
  useEffect(() => {
    setAppearance((prev) => ({
      ...prev,
      theme: isDark ? 'dark' : 'light',
    }));
  }, [isDark]);

  // Load Settings from Backend on Mount
  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      setLoading(true);
      try {
        const data = await settingsService.getSettings();
        if (isMounted && data) {
          const un = data.username || user?.username || 'sairam_developer';
          const em = data.email || user?.email || 'sairammuttukurua0.cse@gmail.com';

          setUsername(un);
          setEmail(em);

          accountBackupRef.current = { username: un, email: em };

          if (data.twoFactorEnabled !== undefined) setTwoFactorEnabled(data.twoFactorEnabled);

          if (data.notificationRingtone) {
            setSelectedRingtone(data.notificationRingtone);
            localStorage.setItem('connectx_ringtone', data.notificationRingtone);
          }

          const savedAccent = data.accentColor || localStorage.getItem('connectx_accent') || 'purple';
          const savedCompact = data.compactMode ?? (localStorage.getItem('connectx_compact_mode') === 'true');
          const savedFont = data.messageFontSize || localStorage.getItem('connectx_message_font_size') || 'medium';

          setAppearance({
            theme: data.theme || (isDark ? 'dark' : 'light'),
            accentColor: savedAccent,
            compactMode: savedCompact,
            messageFontSize: savedFont,
          });

          localStorage.setItem('connectx_accent', savedAccent);
          localStorage.setItem('connectx_compact_mode', String(savedCompact));
          localStorage.setItem('connectx_message_font_size', savedFont);

          if (onAccentChange && savedAccent !== externalAccent) {
            onAccentChange(savedAccent);
          }

          setPrivacy({
            privateAccount: data.privateAccount ?? false,
            showOnlineStatus: data.showOnlineStatus ?? true,
            showReadReceipts: data.showReadReceipts ?? true,
            allowDirectMessages: data.allowDirectMessages || 'EVERYONE',
            searchEngineIndexing: data.searchEngineIndexing ?? false,
          });
        }
      } catch (err) {
        console.warn('Could not load backend settings (using session fallback):', err.message);
        if (user) {
          if (user.displayName) setDisplayName(user.displayName);
          if (user.username) setUsername(user.username);
          if (user.email) setEmail(user.email);
          if (user.bio) setBio(user.bio);
          if (user.avatarUrl) setAvatarUrl(user.avatarUrl);

          profileBackupRef.current = {
            displayName: user.displayName || user.username || '',
            bio: user.bio || '',
            avatarUrl: user.avatarUrl || '/images/boy_1.jpg',
          };
          accountBackupRef.current = {
            username: user.username || '',
            email: user.email || '',
          };
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Connected Devices when activeTab is 'Connected Devices'
  useEffect(() => {
    if (activeTab === 'Connected Devices') {
      loadDevices();
    }
  }, [activeTab]);

  const loadDevices = async () => {
    setLoadingDevices(true);
    try {
      const data = await settingsService.getConnectedDevices();
      if (Array.isArray(data) && data.length > 0) {
        setDevices(data);
      } else {
        setDevices([
          {
            id: 'dev-1',
            deviceName: 'Google Chrome on Windows 11',
            userAgent: 'Chrome 122.0 / Windows NT 10.0',
            ipAddress: '127.0.0.1 (Localhost)',
            createdAt: new Date().toISOString(),
            currentSession: true,
          },
        ]);
      }
    } catch {
      setDevices([
        {
          id: 'dev-1',
          deviceName: 'Google Chrome on Windows 11',
          userAgent: 'Chrome 122.0 / Windows NT 10.0',
          ipAddress: '127.0.0.1 (Localhost)',
          createdAt: new Date().toISOString(),
          currentSession: true,
        },
      ]);
    } finally {
      setLoadingDevices(false);
    }
  };

  // Sync updated user profile to localStorage for immediate UI consistency
  const syncLocalUser = (updatedFields) => {
    const currentUser = authStorage.getUser() || {};
    const updated = { ...currentUser, ...updatedFields };
    authStorage.setUser(updated);
  };

  // 2. Account: Enable Edit Mode
  const startEditingAccount = () => {
    accountBackupRef.current = { username, email };
    setIsEditingAccount(true);
    setTimeout(() => {
      usernameInputRef.current?.focus();
    }, 50);
    showToast('Credentials editing enabled.');
  };

  // Cancel Account Edit
  const cancelEditingAccount = () => {
    setUsername(accountBackupRef.current.username);
    setEmail(accountBackupRef.current.email);
    setIsEditingAccount(false);
  };

  // Save Account Changes
  const handleSaveAccount = async () => {
    if (!username.trim() || !email.trim()) {
      showToast('Username and email are required', 'error');
      return;
    }
    setSavingAccount(true);
    try {
      const res = await settingsService.updateProfile({
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
      });
      syncLocalUser({ username: res.username, email: res.email });
      accountBackupRef.current = { username: res.username, email: res.email };
      setIsEditingAccount(false);
      showToast('Account credentials updated successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to update credentials', 'error');
    } finally {
      setSavingAccount(false);
    }
  };

  // 3. Handle Change Password with Strength Meter
  const calculatePasswordStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score += 25;
    if (pw.length >= 12) score += 25;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 25;
    if (/[0-9]/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score += 25;
    return score;
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  const handleChangePassword = async (e) => {
    e?.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password', 'error');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      showToast('New password must be at least 8 characters long', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match', 'error');
      return;
    }
    setSavingPassword(true);
    try {
      await settingsService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated securely!');
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  // 4. Handle 2FA Toggle
  const handleToggle2FA = async () => {
    setSaving2FA(true);
    try {
      const res = await settingsService.toggle2FA();
      setTwoFactorEnabled(res.twoFactorEnabled);
      showToast(res.twoFactorEnabled ? '2FA enabled successfully!' : '2FA disabled');
    } catch (err) {
      showToast(err.message || 'Failed to toggle 2FA', 'error');
    } finally {
      setSaving2FA(false);
    }
  };

  // 5. Handle Save Custom Ringtone
  const handleSaveRingtone = async () => {
    setSavingRingtone(true);
    try {
      await settingsService.updateNotifications({
        notificationRingtone: selectedRingtone,
      });
      localStorage.setItem('connectx_ringtone', selectedRingtone);
      localStorage.setItem('connectx_ringtone_volume', String(ringtoneVolume));
      localStorage.setItem('connectx_sound_alerts', String(soundAlertsEnabled));
      window.dispatchEvent(new CustomEvent('connectx_ringtone_changed', { detail: { ringtone: selectedRingtone } }));
      showToast(`Notification ringtone saved: "${selectedRingtone}"!`);
    } catch (err) {
      showToast(err.message || 'Failed to save ringtone preference', 'error');
    } finally {
      setSavingRingtone(false);
    }
  };

  // 6. Handle Appearance Save
  const handleSaveAppearance = async () => {
    setSavingAppearance(true);
    try {
      await settingsService.updateAppearance(appearance);
      localStorage.setItem('connectx_accent', appearance.accentColor);
      localStorage.setItem('connectx_message_font_size', appearance.messageFontSize);
      localStorage.setItem('connectx_compact_mode', String(appearance.compactMode));
      window.dispatchEvent(
        new CustomEvent('connectx_appearance_changed', {
          detail: {
            accentColor: appearance.accentColor,
            messageFontSize: appearance.messageFontSize,
            compactMode: appearance.compactMode,
          },
        })
      );
      showToast(`Appearance saved! ${currentAccent.name} is active.`);
    } catch (err) {
      showToast(err.message || 'Failed to save appearance', 'error');
    } finally {
      setSavingAppearance(false);
    }
  };

  // 7. Handle Privacy Save
  const handleSavePrivacy = async () => {
    setSavingPrivacy(true);
    try {
      await settingsService.updatePrivacy(privacy);
      syncLocalUser({
        privateAccount: privacy.privateAccount,
        showOnlineStatus: privacy.showOnlineStatus,
      });
      window.dispatchEvent(
        new CustomEvent('connectx_privacy_changed', {
          detail: privacy,
        })
      );
      showToast('All privacy preferences updated successfully in database!');
    } catch (err) {
      showToast(err.message || 'Failed to save privacy settings', 'error');
    } finally {
      setSavingPrivacy(false);
    }
  };

  // 8. Handle Revoke Session
  const handleRevokeSession = async (sessionId) => {
    try {
      await settingsService.revokeDeviceSession(sessionId);
      setDevices((prev) => prev.filter((d) => d.id !== sessionId));
      showToast('Device session terminated and removed from DB');
    } catch (err) {
      showToast(err.message || 'Failed to terminate session', 'error');
    }
  };

  // 9. Handle Revoke All Other Sessions
  const handleRevokeAllOtherSessions = async () => {
    try {
      await settingsService.revokeAllOtherSessions();
      setDevices((prev) => prev.filter((d) => d.currentSession));
      showToast('All other sessions signed out and deactivated in DB');
    } catch (err) {
      showToast(err.message || 'Failed to revoke other sessions', 'error');
    }
  };

  // 10. Avatar Upload Handler
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size must be less than 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setAvatarUrl(dataUrl);
        if (!isEditingProfile) {
          setIsEditingProfile(true);
        }
        showToast('Avatar preview updated! Click Save Profile to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  const navTabs = [
    { id: 'Account & Security', label: 'Account & Security', icon: Shield },
    { id: 'Notification Ringtone', label: 'Notification Ringtone', icon: Volume2 },
    { id: 'Appearance', label: 'Appearance', icon: Moon },
    { id: 'Privacy', label: 'Privacy', icon: Lock },
    { id: 'Connected Devices', label: 'Connected Devices', icon: Monitor },
  ];

  const accentColors = [
    { id: 'purple', name: 'Purple Neon', bg: 'bg-purple-600' },
    { id: 'blue', name: 'Electric Blue', bg: 'bg-blue-600' },
    { id: 'emerald', name: 'Emerald Wave', bg: 'bg-emerald-600' },
    { id: 'rose', name: 'Rose Bloom', bg: 'bg-rose-600' },
    { id: 'amber', name: 'Amber Sunset', bg: 'bg-amber-600' },
  ];

  const formatFriendlyTime = (dateStr, isCurrent) => {
    if (isCurrent) return 'Active Now';
    if (!dateStr) return 'Recently';
    const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Active Today';
    if (diffDays === 1) return 'Active Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="p-4 sm:p-7 max-w-[1520px] w-full mx-auto space-y-6">
      {/* Hidden file input for custom ringtone */}


      {/* Hidden file input for custom ringtone */}
      <input
        type="file"
        ref={ringtoneFileInputRef}
        onChange={handleCustomAudioUpload}
        accept="audio/*"
        className="hidden"
      />

      {/* Header */}
      <div>
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl ${currentAccent.bgBadge} flex items-center justify-center ${currentAccent.text} shadow-md`}>
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
              Settings & Preferences
            </h1>
            <p className={`text-sm sm:text-base mt-1 font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Manage your profile, security credentials, notification ringtones, and app appearance.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pt-1">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4.5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                isActive
                  ? `${currentAccent.tab} scale-[1.02]`
                  : isDark
                  ? 'bg-[#0E1225] text-slate-200 hover:text-white border border-white/[0.08] hover:border-white/20'
                  : 'bg-white text-slate-800 hover:text-black border border-slate-200 shadow-xs'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid Layout: Left Column (Col Span 8) + Right Column (Col Span 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT MAIN AREA (Col Span 8) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: Account & Security */}
          {activeTab === 'Account & Security' && (
            <>
              {/* Card 1: Account Information */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (isEditingAccount) handleSaveAccount();
                }}
                autoComplete="off"
                className={`p-6 rounded-3xl border shadow-sm space-y-5 transition-all ${
                  isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                        Account Information
                      </h3>
                      {isEditingAccount && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                          Editing Mode
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {isEditingAccount
                        ? 'Update your username handle or email, then click Save.'
                        : 'Your unique handle and registered email address.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {isEditingAccount ? (
                      <>
                        <button
                          type="button"
                          onClick={cancelEditingAccount}
                          disabled={savingAccount}
                          className={`px-3.5 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                            isDark
                              ? 'bg-[#0E1225] hover:bg-white/[0.08] border-white/10 text-slate-300'
                              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                          }`}
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>

                        <button
                          type="submit"
                          disabled={savingAccount}
                          className={`px-4.5 py-2.5 rounded-xl ${currentAccent.btn} text-sm font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50`}
                        >
                          {savingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          <span>{savingAccount ? 'Saving...' : 'Save Credentials'}</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={startEditingAccount}
                        className={`px-4.5 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                          isDark
                            ? 'bg-[#0E1225] hover:bg-white/[0.08] border-white/10 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-black'
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit Details</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Unique Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">@</span>
                      <input
                        ref={usernameInputRef}
                        type="text"
                        name="account-username"
                        autoComplete="username"
                        readOnly={!isEditingAccount}
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                        className={`w-full pl-8 pr-10 py-2.5 rounded-xl text-sm border font-medium focus:outline-none transition-all ${
                          !isEditingAccount
                            ? isDark
                              ? 'bg-[#0E1225]/60 border-white/5 text-slate-300 cursor-not-allowed select-none'
                              : 'bg-slate-100/70 border-slate-200 text-slate-700 cursor-not-allowed select-none'
                            : isDark
                            ? `bg-[#0E1225] ${currentAccent.border} text-white ring-2 ${currentAccent.ring}/40`
                            : `bg-white ${currentAccent.border} text-black ring-2 ${currentAccent.ring}/40`
                        }`}
                      />
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-400" />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Registered Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="account-email"
                        autoComplete="email"
                        readOnly={!isEditingAccount}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border font-medium focus:outline-none transition-all ${
                          !isEditingAccount
                            ? isDark
                              ? 'bg-[#0E1225]/60 border-white/5 text-slate-300 cursor-not-allowed select-none'
                              : 'bg-slate-100/70 border-slate-200 text-slate-700 cursor-not-allowed select-none'
                            : isDark
                            ? `bg-[#0E1225] ${currentAccent.border} text-white ring-2 ${currentAccent.ring}/40`
                            : `bg-white ${currentAccent.border} text-black ring-2 ${currentAccent.ring}/40`
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </form>

              {/* Card 3: Change Password with Strength Meter & Sleek Design */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChangePassword();
                }}
                autoComplete="off"
                className={`p-6 rounded-3xl border shadow-sm space-y-5 transition-all ${
                  isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${currentAccent.bgBadge} flex items-center justify-center ${currentAccent.text}`}>
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                        Password & Security
                      </h3>
                      <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Keep your account safe with a strong, multi-character password.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className={`px-4.5 py-2.5 rounded-xl ${currentAccent.btn} text-sm font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50`}
                  >
                    {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    <span>{savingPassword ? 'Updating...' : 'Update Password'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  {/* Current Password (Strictly masked, never autofilled or revealed) */}
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="cx_verify_cur_pass"
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl text-sm border font-medium focus:outline-none transition-all ${
                          isDark
                            ? 'bg-[#0E1225] border-white/10 text-white focus:border-purple-500/60'
                            : 'bg-slate-50 border-slate-300 text-black focus:border-blue-500'
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        name="cx_new_pwd"
                        autoComplete="new-password"
                        placeholder="Min 8 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl text-sm border font-medium focus:outline-none transition-all ${
                          isDark
                            ? 'bg-[#0E1225] border-white/10 text-white focus:border-purple-500/60'
                            : 'bg-slate-50 border-slate-300 text-black focus:border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${
                          isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'
                        }`}
                      >
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        name="cx_confirm_pwd"
                        autoComplete="new-password"
                        placeholder="Re-type new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl text-sm border font-medium focus:outline-none transition-all ${
                          isDark
                            ? 'bg-[#0E1225] border-white/10 text-white focus:border-purple-500/60'
                            : 'bg-slate-50 border-slate-300 text-black focus:border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${
                          isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'
                        }`}
                      >
                        {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Password Strength:</span>
                      <span
                        className={`font-extrabold ${
                          passwordStrength <= 25
                            ? 'text-rose-400'
                            : passwordStrength <= 50
                            ? 'text-amber-400'
                            : passwordStrength <= 75
                            ? 'text-blue-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {passwordStrength <= 25
                          ? 'Weak'
                          : passwordStrength <= 50
                          ? 'Moderate'
                          : passwordStrength <= 75
                          ? 'Strong'
                          : 'Excellent'}
                      </span>
                    </div>

                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          passwordStrength <= 25
                            ? 'bg-rose-500'
                            : passwordStrength <= 50
                            ? 'bg-amber-500'
                            : passwordStrength <= 75
                            ? 'bg-blue-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                )}
              </form>

              {/* Card 4: Two-Factor Authentication (2FA) */}
              <div
                className={`p-6 rounded-3xl border shadow-sm flex items-center justify-between gap-4 transition-all ${
                  isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                    <Fingerprint className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                      Two-Factor Authentication (2FA)
                    </h3>
                    <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Add a second verification step for enhanced security against unauthorized access.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-sm flex items-center gap-1.5 font-bold ${isDark ? 'text-slate-200' : 'text-black'}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    <span>{twoFactorEnabled ? 'Enabled' : 'Not Enabled'}</span>
                  </span>

                  <button
                    onClick={handleToggle2FA}
                    disabled={saving2FA}
                    className={`px-4.5 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 ${
                      twoFactorEnabled
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                        : `${currentAccent.btn} border-transparent`
                    }`}
                  >
                    {saving2FA ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>{twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: Custom Notification Ringtone */}
          {activeTab === 'Notification Ringtone' && (
            <div
              className={`p-6 sm:p-7 rounded-3xl border shadow-sm space-y-6 transition-all ${
                isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-black'}`}>
                      Custom Notification Ringtone
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${currentAccent.bgBadge}`}>
                      Live Sound Studio
                    </span>
                  </div>
                  <p className={`text-sm sm:text-base mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Choose from curated crystal sound profiles or upload your own audio file for alerts.
                  </p>
                </div>

                <button
                  onClick={handleSaveRingtone}
                  disabled={savingRingtone}
                  className={`px-5 py-2.5 rounded-xl ${currentAccent.btn} text-sm font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 shrink-0`}
                >
                  {savingRingtone ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{savingRingtone ? 'Saving...' : 'Save Ringtone'}</span>
                </button>
              </div>

              {/* Volume & In-App Chime Controls */}
              <div className={`p-4.5 rounded-2xl border ${isDark ? 'bg-[#0E1225]/80 border-white/[0.08]' : 'bg-slate-50 border-slate-200'} space-y-4`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Master Volume Slider */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 font-bold">
                        <Volume2 className={`w-4.5 h-4.5 ${currentAccent.text}`} />
                        <span className={isDark ? 'text-white' : 'text-black'}>Alert Volume</span>
                      </div>
                      <span className={`font-mono font-bold ${currentAccent.text}`}>{ringtoneVolume}%</span>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={ringtoneVolume}
                      onChange={(e) => setRingtoneVolume(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer h-2 bg-white/10 rounded-lg"
                    />
                  </div>

                  {/* Sound Alerts Toggle */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0 sm:border-l sm:border-white/10 sm:pl-6">
                    <div>
                      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>Sound Alerts</p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Play audio chime</p>
                    </div>

                    <div
                      onClick={() => setSoundAlertsEnabled(!soundAlertsEnabled)}
                      className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        soundAlertsEnabled ? currentAccent.toggle : isDark ? 'bg-slate-700' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4.5 h-4.5 rounded-full bg-white transition-transform absolute top-1 ${
                          soundAlertsEnabled ? 'translate-x-6.5' : 'translate-x-1'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Custom Audio Card */}
              <div
                className={`p-5 rounded-2xl border-2 border-dashed transition-all ${
                  isDark
                    ? 'border-purple-500/30 bg-purple-950/10 hover:border-purple-500/50'
                    : 'border-blue-400/40 bg-blue-50/50 hover:border-blue-500'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl ${currentAccent.bgBadge} flex items-center justify-center ${currentAccent.text} shrink-0`}>
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                        Upload Custom Ringtone
                      </h4>
                      <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Upload your favorite MP3, WAV, or OGG audio file (Max 12MB).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {customAudioName ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePlayRingtone({ id: `Custom: ${customAudioName}`, type: 'custom' })}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                            playingRingtoneId === `Custom: ${customAudioName}`
                              ? 'bg-rose-500 text-white'
                              : `${currentAccent.btn}`
                          }`}
                        >
                          {playingRingtoneId === `Custom: ${customAudioName}` ? (
                            <>
                              <Square className="w-3.5 h-3.5" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Preview</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCustomAudioFile(null);
                            setCustomAudioName('');
                            setCustomAudioUrl('');
                            localStorage.removeItem('connectx_custom_ringtone_name');
                            localStorage.removeItem('connectx_custom_ringtone_url');
                            setSelectedRingtone('ConnectX Chime (Default)');
                            showToast('Custom ringtone removed, defaulted to ConnectX Chime');
                          }}
                          className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                          title="Remove custom audio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => ringtoneFileInputRef.current?.click()}
                        className={`px-4.5 py-2.5 rounded-xl ${currentAccent.btn} text-sm font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-2`}
                      >
                        <Music className="w-4 h-4" />
                        <span>Choose Audio File</span>
                      </button>
                    )}
                  </div>
                </div>

                {customAudioName && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Loaded: {customAudioName}
                    </span>
                    <button
                      type="button"
                      onClick={() => ringtoneFileInputRef.current?.click()}
                      className={`font-bold hover:underline cursor-pointer ${currentAccent.text}`}
                    >
                      Replace File
                    </button>
                  </div>
                )}
              </div>

              {/* Preset Ringtones Studio */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-extrabold uppercase tracking-wider ${currentAccent.text}`}>
                    Preset Ringtones
                  </h4>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Click Play to preview sound
                  </span>
                </div>

                <div className="space-y-2.5">
                  {PRESET_RINGTONES.map((tone) => {
                    const isSelected = selectedRingtone === tone.id;
                    const isPlaying = playingRingtoneId === tone.id;

                    return (
                      <div
                        key={tone.id}
                        onClick={() => {
                          setSelectedRingtone(tone.id);
                          playToneSound(tone.id);
                        }}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer group ${
                          isSelected
                            ? `${currentAccent.border} ${isDark ? 'bg-white/[0.07] ring-1 ' + currentAccent.ring : 'bg-slate-100/90'}`
                            : isDark
                            ? 'bg-[#0E1225] border-white/[0.06] hover:bg-white/[0.04]'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Play / Preview Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayRingtone(tone);
                            }}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer shadow-md ${
                              isPlaying
                                ? 'bg-rose-500 text-white animate-pulse'
                                : isSelected
                                ? `${currentAccent.btn}`
                                : isDark
                                ? 'bg-slate-800 text-white hover:bg-slate-700'
                                : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                            }`}
                          >
                            {isPlaying ? (
                              <Square className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h5 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-black'}`}>
                                {tone.name}
                              </h5>
                              <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${currentAccent.bgBadge}`}>
                                {tone.tags}
                              </span>
                            </div>
                            <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              {tone.desc}
                            </p>
                          </div>
                        </div>

                        {/* Radio Check Circle */}
                        <div className="shrink-0 flex items-center gap-2">
                          {isPlaying && (
                            <div className="flex items-end gap-0.5 h-4">
                              <span className="w-1 bg-emerald-400 animate-[bounce_0.6s_infinite_100ms] rounded-full h-3" />
                              <span className="w-1 bg-emerald-400 animate-[bounce_0.6s_infinite_200ms] rounded-full h-4" />
                              <span className="w-1 bg-emerald-400 animate-[bounce_0.6s_infinite_300ms] rounded-full h-2" />
                            </div>
                          )}

                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? `${currentAccent.border} ${currentAccent.toggle} text-white`
                                : isDark
                                ? 'border-white/20'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Appearance */}
          {activeTab === 'Appearance' && (
            <div
              className={`p-6 sm:p-7 rounded-3xl border shadow-sm space-y-6 transition-all ${
                isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                    Appearance & Themes
                  </h3>
                  <p className={`text-sm sm:text-base mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Customize visual styling, themes, message font size, and interface density.
                  </p>
                </div>
                <button
                  onClick={handleSaveAppearance}
                  disabled={savingAppearance}
                  className={`px-5 py-2.5 rounded-xl ${currentAccent.btn} text-sm font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50`}
                >
                  {savingAppearance ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{savingAppearance ? 'Saving...' : 'Save Appearance'}</span>
                </button>
              </div>

              {/* Theme Choice Cards */}
              <div>
                <label className={`block text-xs font-extrabold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Interface Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Dark Mode */}
                  <div
                    onClick={() => {
                      if (!isDark && toggleTheme) toggleTheme();
                      setAppearance((p) => ({ ...p, theme: 'dark' }));
                      showToast('Switched to Dark Mode');
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                      isDark
                        ? `${currentAccent.border} bg-white/[0.06] shadow-md`
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#090C1B] border border-white/10 flex items-center justify-center text-purple-400 shadow-sm shrink-0">
                      <Moon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                        Dark Theme (Neon Contrast)
                      </p>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        High-contrast dark backdrop with glowing highlights
                      </p>
                    </div>
                    {isDark && <CheckCircle2 className={`w-5 h-5 ${currentAccent.text}`} />}
                  </div>

                  {/* Light Mode */}
                  <div
                    onClick={() => {
                      if (isDark && toggleTheme) toggleTheme();
                      setAppearance((p) => ({ ...p, theme: 'light' }));
                      showToast('Switched to Light Mode');
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                      !isDark
                        ? `${currentAccent.border} bg-white shadow-md`
                        : 'border-white/10 bg-[#0E1225] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                      <Sun className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                        Light Theme (Crisp Clean)
                      </p>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Clean bright surfaces with rich black typography
                      </p>
                    </div>
                    {!isDark && <CheckCircle2 className={`w-5 h-5 ${currentAccent.text}`} />}
                  </div>
                </div>
              </div>

              {/* Accent Color Palette */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={`block text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Accent Color
                  </label>
                  <span className={`text-xs font-bold ${currentAccent.text}`}>
                    Active: {currentAccent.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                  {accentColors.map((color) => {
                    const isSelected = appearance.accentColor === color.id;
                    const meta = ACCENT_THEMES[color.id];
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => {
                          setAppearance((p) => ({ ...p, accentColor: color.id }));
                          localStorage.setItem('connectx_accent', color.id);
                          if (onAccentChange) onAccentChange(color.id);
                          showToast(`Accent switched to ${color.name}`);
                        }}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer ${
                          isSelected
                            ? `${meta.border} ${isDark ? 'bg-white/[0.08]' : 'bg-slate-100'} shadow-lg scale-105`
                            : isDark
                            ? 'bg-[#0E1225] border-white/10 text-slate-300 hover:text-white hover:border-white/20'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-black hover:border-slate-300'
                        }`}
                      >
                        <span className={`w-4.5 h-4.5 rounded-full ${color.bg} shadow-md shrink-0`} />
                        <span className="truncate">{color.name}</span>
                        {isSelected && <Check className="w-4 h-4 ml-auto shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Font Size & Compact Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className={`block text-xs font-extrabold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Message Font Size
                  </label>
                  <select
                    value={appearance.messageFontSize}
                    onChange={(e) => {
                      const newSize = e.target.value;
                      setAppearance((p) => ({ ...p, messageFontSize: newSize }));
                      localStorage.setItem('connectx_message_font_size', newSize);
                      window.dispatchEvent(new CustomEvent('connectx_appearance_changed', { detail: { messageFontSize: newSize } }));
                      showToast(`Message font size set to: ${newSize}`);
                    }}
                    className={`w-full px-4 py-3 rounded-xl text-sm border font-medium focus:outline-none transition-all cursor-pointer ${
                      isDark
                        ? 'bg-[#0E1225] border-white/10 text-white focus:border-purple-500/60'
                        : 'bg-slate-50 border-slate-300 text-black focus:border-blue-500'
                    }`}
                  >
                    <option value="small">Small (13px compact)</option>
                    <option value="medium">Medium (15px standard default)</option>
                    <option value="large">Large (17px comfortable)</option>
                    <option value="xlarge">Extra Large (19px high visibility)</option>
                  </select>

                  {/* Dynamic Font Size Preview */}
                  <div
                    className={`mt-3 p-4 rounded-xl border ${
                      isDark ? 'bg-[#0E1225]/60 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <p className={`text-xs uppercase font-extrabold mb-1.5 ${currentAccent.text}`}>
                      Live Message Font Preview
                    </p>
                    <p
                      className={`${
                        appearance.messageFontSize === 'small'
                          ? 'text-[13px] leading-snug'
                          : appearance.messageFontSize === 'large'
                          ? 'text-[17px] leading-relaxed'
                          : appearance.messageFontSize === 'xlarge'
                          ? 'text-[19px] leading-relaxed font-medium'
                          : 'text-[15px] leading-normal'
                      } ${isDark ? 'text-slate-100' : 'text-slate-900'}`}
                    >
                      "Hello! This is how your chat messages will render on screen."
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className={`p-5 rounded-2xl border ${isDark ? 'border-white/10 bg-[#0E1225]/40' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                          Compact Chat Spacing
                        </p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Reduce message bubble padding to fit more messages per viewport
                        </p>
                      </div>
                      <div
                        onClick={() => {
                          const nextVal = !appearance.compactMode;
                          setAppearance((p) => ({ ...p, compactMode: nextVal }));
                          localStorage.setItem('connectx_compact_mode', String(nextVal));
                          window.dispatchEvent(new CustomEvent('connectx_appearance_changed', { detail: { compactMode: nextVal } }));
                          showToast(nextVal ? 'Compact spacing enabled' : 'Normal spacing restored');
                        }}
                        className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                          appearance.compactMode ? currentAccent.toggle : isDark ? 'bg-slate-700' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4.5 h-4.5 rounded-full bg-white transition-transform absolute top-1 ${
                            appearance.compactMode ? 'translate-x-6.5' : 'translate-x-1'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Current Density:</span>
                      <span className={`font-bold ${appearance.compactMode ? currentAccent.text : 'text-slate-400'}`}>
                        {appearance.compactMode ? 'Compact Layout Active' : 'Comfortable Layout'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Privacy */}
          {activeTab === 'Privacy' && (
            <div
              className={`p-6 sm:p-7 rounded-3xl border shadow-sm space-y-6 transition-all ${
                isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                    Privacy & Visibility
                  </h3>
                  <p className={`text-sm sm:text-base mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Control who can see your activity, read status, and message you.
                  </p>
                </div>
                <button
                  onClick={handleSavePrivacy}
                  disabled={savingPrivacy}
                  className={`px-5 py-2.5 rounded-xl ${currentAccent.btn} text-sm font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50`}
                >
                  {savingPrivacy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{savingPrivacy ? 'Saving...' : 'Save Privacy'}</span>
                </button>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    key: 'privateAccount',
                    label: 'Private Account',
                    desc: 'Only accepted connections can view your full profile, posts, and details',
                    onToggle: (v) => showToast(v ? 'Account set to Private 🔒' : 'Account is now Public 🌍'),
                  },
                  {
                    key: 'showOnlineStatus',
                    label: 'Display Online Activity Status',
                    desc: 'Let other users see when you are currently online and active',
                    onToggle: (v) => showToast(v ? 'Online activity visible (Green dot)' : 'Invisible mode enabled (Gray dot)'),
                  },
                  {
                    key: 'showReadReceipts',
                    label: 'Send Read Receipts (Blue checks)',
                    desc: 'Show when you have read direct messages',
                  },
                  {
                    key: 'searchEngineIndexing',
                    label: 'Allow Search Engine Indexing',
                    desc: 'Permit Google and other search engines to index your public profile page',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => {
                      setPrivacy((prev) => {
                        const nextVal = !prev[item.key];
                        if (item.onToggle) item.onToggle(nextVal);
                        return { ...prev, [item.key]: nextVal };
                      });
                    }}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isDark
                        ? 'bg-[#0E1225] border-white/[0.06] hover:bg-white/[0.05]'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                        {item.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {item.desc}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        privacy[item.key] ? currentAccent.toggle : isDark ? 'bg-slate-700' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4.5 h-4.5 rounded-full bg-white transition-transform absolute top-1 ${
                          privacy[item.key] ? 'translate-x-6.5' : 'translate-x-1'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Messages Permission */}
              <div className="pt-2">
                <label className={`block text-xs font-extrabold uppercase tracking-wider mb-2.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Who Can Send You Direct Messages
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'EVERYONE', title: 'Everyone', desc: 'Any registered ConnectX user can reach out' },
                    { id: 'CONNECTIONS_ONLY', title: 'Connections Only', desc: 'Only approved connections can message you' },
                  ].map((opt) => {
                    const isSelected = privacy.allowDirectMessages === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          setPrivacy((p) => ({ ...p, allowDirectMessages: opt.id }));
                          showToast(`Direct message permissions: ${opt.title}`);
                        }}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? `${currentAccent.border} ${isDark ? 'bg-white/[0.08]' : 'bg-slate-100'}`
                            : isDark
                            ? 'border-white/[0.06] bg-[#0E1225] hover:bg-white/[0.05]'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                          {opt.title}
                        </p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {opt.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Connected Devices */}
          {activeTab === 'Connected Devices' && (
            <div
              className={`p-6 sm:p-7 rounded-3xl border shadow-sm space-y-6 transition-all ${
                isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                    Active Sessions & Devices
                  </h3>
                  <p className={`text-sm sm:text-base mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Review all web and mobile sessions currently authorized with your account in the database.
                  </p>
                </div>

                <button
                  onClick={handleRevokeAllOtherSessions}
                  className="px-4.5 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-sm font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out All Other Devices</span>
                </button>
              </div>

              {loadingDevices ? (
                <div className="flex items-center justify-center py-12 text-slate-400 text-sm gap-2.5">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  <span>Loading device sessions from database...</span>
                </div>
              ) : devices.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No other active device sessions found.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {devices.map((device) => {
                    const isMobile =
                      device.userAgent?.toLowerCase().includes('mobile') ||
                      device.userAgent?.toLowerCase().includes('iphone') ||
                      device.userAgent?.toLowerCase().includes('android');

                    return (
                      <div
                        key={device.id}
                        className={`p-4.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          device.currentSession
                            ? isDark
                              ? `${currentAccent.border} bg-white/[0.05]`
                              : `${currentAccent.border} bg-slate-50`
                            : isDark
                            ? 'bg-[#0E1225] border-white/[0.06]'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                              device.currentSession
                                ? `${currentAccent.bgBadge} ${currentAccent.text}`
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isMobile ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                                {device.deviceName}
                              </h4>
                              {device.currentSession && (
                                <span className={`px-2.5 py-0.5 rounded-full ${currentAccent.bgBadge} text-xs font-extrabold`}>
                                  Current Device
                                </span>
                              )}
                            </div>
                            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              IP: {device.ipAddress} • {formatFriendlyTime(device.createdAt, device.currentSession)}
                            </p>
                          </div>
                        </div>

                        {!device.currentSession && (
                          <button
                            onClick={() => handleRevokeSession(device.id)}
                            className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                            title="Terminate Session"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= RIGHT COLUMN (Col Span 4): Quick Settings ================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Quick Settings */}
          <div
            className={`p-6 rounded-3xl border shadow-sm space-y-4 transition-all ${
              isDark ? 'bg-[#0A0D1F]/90 border-white/[0.08]' : 'bg-white border-slate-200'
            }`}
          >
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              Quick Settings
            </h3>

            <div className="space-y-2.5">
              {[
                { title: 'Account & Security', desc: 'Manage login & credentials', icon: Shield },
                { title: 'Notification Ringtone', desc: 'Custom alert sounds & volume', icon: Volume2 },
                { title: 'Appearance', desc: 'Themes, message font size & spacing', icon: Moon },
                { title: 'Privacy', desc: 'Visibility and message permissions', icon: Lock },
                { title: 'Connected Devices', desc: 'Active sessions stored in DB', icon: Monitor },
              ].map((item) => {
                const Icon = item.icon;
                const isItemActive = activeTab === item.title;
                return (
                  <div
                    key={item.title}
                    onClick={() => {
                      setActiveTab(item.title);
                      showToast(`Navigated to ${item.title}`);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                      isItemActive
                        ? `${currentAccent.bgBadge} ${currentAccent.border} ${isDark ? 'text-white' : 'text-black'}`
                        : isDark
                        ? 'bg-[#0E1225] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isItemActive
                            ? `${currentAccent.toggle} text-white`
                            : `${currentAccent.bgBadge} ${currentAccent.text}`
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <h4
                          className={`text-sm font-bold truncate group-hover:${currentAccent.text} transition-colors ${
                            isDark ? 'text-white' : 'text-black'
                          }`}
                        >
                          {item.title}
                        </h4>
                        <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4.5 h-4.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
