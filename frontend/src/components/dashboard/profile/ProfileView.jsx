import { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Edit3,
  MapPin,
  Calendar,
  Mail,
  GraduationCap,
  Briefcase,
  Globe,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Copy,
  Check,
  CheckCircle2,
  Eye,
  User,
  Image as ImageIcon,
  Info,
  Activity,
  Lock,
  Settings as SettingsIcon,
  Circle,
  Laptop,
  X,
  Upload,
  Heart,
  MessageSquare,
  Share2,
  Sparkles,
  Loader2,
  Trash2,
  Plus,
  Smile,
  Code,
  Award,
  Layers,
  Send,
} from 'lucide-react';
import { getAccentTheme } from '../../../utils/themeHelper';
import settingsService from '../../../services/settingsService';
import dashboardService from '../../../services/dashboardService';
import { authStorage } from '../../../utils/authStorage';
import { useToast } from '../../../context/ToastContext';

export default function ProfileView({ user, isDark = true, onNavigateTab, accentColor = 'purple' }) {
  const { showToast } = useToast();
  const theme = getAccentTheme(accentColor);
  const [activeSubTab, setActiveSubTab] = useState('Overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [isUploadPhotoModalOpen, setIsUploadPhotoModalOpen] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  // Hidden File Input Refs
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Editable Profile Data backed by DB
  const [profileData, setProfileData] = useState({
    name: user?.displayName || user?.username || 'sairam_developer',
    username: user?.username || 'sairam_developer',
    tagline: user?.bio || 'Building real connections in a better way 🚀',
    field: 'Computer Science',
    location: 'Nellore, Andhra Pradesh',
    fullLocation: 'Nellore, Andhra Pradesh, India',
    joinedDate: 'Joined Sep 2026',
    aboutParagraph:
      "Hey! I'm Sairam.\nI'm a Computer Science graduate who loves technology, building cool projects, and connecting with interesting people.\n\nHere to make real connections — no phone numbers, just people. 🤝",
    email: user?.email || 'sairammuttukurua0.cse@gmail.com',
    education: 'Narayana Engineering College',
    occupation: 'Software Developer',
    website: 'https://www.linkedin.com/in/sairam-muttukuru/',
    customStatus: 'Coding today, connections tomorrow 💻',
    coverPhotoUrl: '/images/dashboard/profile_cover_banner.jpg',
    avatarUrl: user?.avatarUrl || '/images/boy_1.jpg',
    friendsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });

  // Edit Form Temporary State
  const [editForm, setEditForm] = useState({ ...profileData });
  const [newStatusInput, setNewStatusInput] = useState('');

  // Photos Gallery State
  const [photos, setPhotos] = useState([
    {
      id: 1,
      url: '/images/dashboard/profile_cover_banner.jpg',
      caption: 'Serene mountain morning views 🏔️',
      likes: 42,
      comments: 6,
      liked: false,
      date: 'Yesterday',
    },
    {
      id: 2,
      url: '/images/dashboard/cover_clean.jpg',
      caption: 'Evening dusk coding session 🌌',
      likes: 89,
      comments: 14,
      liked: true,
      date: '3 days ago',
    },
    {
      id: 3,
      url: '/images/mountain.jpg',
      caption: 'High-altitude hiking trail 🌲',
      likes: 67,
      comments: 8,
      liked: false,
      date: '1 week ago',
    },
    {
      id: 4,
      url: '/images/boy_1.jpg',
      caption: 'Weekend team meetup & hackathon 💻',
      likes: 112,
      comments: 21,
      liked: true,
      date: '2 weeks ago',
    },
    {
      id: 5,
      url: '/images/girl_2.jpg',
      caption: 'ConnectX community meetup in Hyderabad 🎉',
      likes: 95,
      comments: 11,
      liked: false,
      date: '3 weeks ago',
    },
    {
      id: 6,
      url: '/images/boy_2.jpg',
      caption: 'Building next-generation private messaging 🛡️',
      likes: 148,
      comments: 32,
      liked: true,
      date: 'Last month',
    },
  ]);

  // Activity Feed Posts State
  const [activityPosts, setActivityPosts] = useState([
    {
      id: 1,
      content:
        'Just released the all-new ConnectX real-time settings and device session controls! 🚀 Building real connections without phone numbers always.',
      time: '2 hours ago',
      likes: 24,
      comments: 5,
      isLiked: false,
      tag: 'Announcement',
    },
    {
      id: 2,
      content:
        'Enjoying the weekend while optimizing distributed WebSockets and audio synthesis. What are you building this week?',
      time: '1 day ago',
      likes: 46,
      comments: 12,
      isLiked: true,
      tag: 'Tech',
    },
    {
      id: 3,
      content:
        'True connections happen when people share moments, thoughts, and mutual respect — not just telephone numbers. 💜',
      time: '3 days ago',
      likes: 88,
      comments: 19,
      isLiked: true,
      tag: 'Thoughts',
    },
  ]);

  // Load latest settings, profile, and friends count from Backend on mount
  useEffect(() => {
    let isMounted = true;
    const loadProfileFromBackend = async () => {
      try {
        const [settingsRes, metricsRes, friendsRes] = await Promise.allSettled([
          settingsService.getSettings(),
          dashboardService.getDashboardMetrics(),
          dashboardService.getFriends(),
        ]);

        if (isMounted) {
          const data = settingsRes.status === 'fulfilled' ? settingsRes.value : null;
          const metrics = metricsRes.status === 'fulfilled' ? metricsRes.value : null;
          const friends = friendsRes.status === 'fulfilled' ? friendsRes.value : [];
          const realFriendsCount = metrics?.friendsCount ?? (Array.isArray(friends) ? friends.length : 0);

          if (data) {
            const resolvedAvatar = data.avatarUrl || user?.avatarUrl || '/images/boy_1.jpg';
            setProfileData((prev) => ({
              ...prev,
              name: data.displayName || user?.displayName || user?.username || prev.name,
              username: data.username || user?.username || prev.username,
              tagline: data.bio !== undefined && data.bio !== '' ? data.bio : prev.tagline,
              avatarUrl: resolvedAvatar,
              email: data.email || user?.email || prev.email,
              location: data.location || prev.location,
              fullLocation: data.location || prev.fullLocation,
              education: data.education || prev.education,
              occupation: data.occupation || prev.occupation,
              website: data.website || prev.website,
              customStatus: data.customStatus || prev.customStatus,
              coverPhotoUrl: data.coverPhotoUrl || prev.coverPhotoUrl,
              field: data.fieldOfStudy || prev.field,
              aboutParagraph: data.aboutParagraph || prev.aboutParagraph,
              friendsCount: realFriendsCount,
            }));

            // Ensure app-wide avatar sync
            if (resolvedAvatar) {
              const currentAuthUser = authStorage.getUser() || {};
              if (currentAuthUser.avatarUrl !== resolvedAvatar) {
                authStorage.setUser({ ...currentAuthUser, avatarUrl: resolvedAvatar });
                window.dispatchEvent(
                  new CustomEvent('connectx_profile_updated', {
                    detail: { avatarUrl: resolvedAvatar },
                  })
                );
              }
            }
          } else {
            setProfileData((prev) => ({
              ...prev,
              friendsCount: realFriendsCount,
            }));
          }
        }
      } catch (err) {
        console.warn('Could not load profile from backend, using session cache:', err.message);
      }
    };

    loadProfileFromBackend();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Copy ConnectX ID Handler
  const handleCopyId = () => {
    const idToCopy = `@${profileData.username}`;
    navigator.clipboard?.writeText?.(idToCopy);
    setCopiedId(true);
    showToast(`ConnectX ID "${idToCopy}" copied to clipboard!`);
    setTimeout(() => setCopiedId(false), 2500);
  };

  // Open Edit Profile Modal
  const startEditProfile = () => {
    setEditForm({ ...profileData });
    setIsEditing(true);
  };

  // Save Profile Changes to DB
  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    if (!editForm.name.trim()) {
      showToast('Display name cannot be empty', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        displayName: editForm.name.trim(),
        bio: editForm.tagline.trim(),
        location: editForm.fullLocation.trim(),
        education: editForm.education.trim(),
        occupation: editForm.occupation.trim(),
        website: editForm.website.trim(),
        customStatus: editForm.customStatus.trim(),
        coverPhotoUrl: editForm.coverPhotoUrl,
        fieldOfStudy: editForm.field.trim(),
        aboutParagraph: editForm.aboutParagraph.trim(),
      };

      const res = await settingsService.updateProfile(payload);

      const updatedProfile = {
        ...profileData,
        ...editForm,
        name: res.displayName || editForm.name,
        tagline: res.bio || editForm.tagline,
      };

      setProfileData(updatedProfile);

      // Sync across app
      const currentAuthUser = authStorage.getUser() || {};
      const updatedUser = {
        ...currentAuthUser,
        displayName: updatedProfile.name,
        bio: updatedProfile.tagline,
      };
      authStorage.setUser(updatedUser);

      window.dispatchEvent(
        new CustomEvent('connectx_profile_updated', {
          detail: { displayName: updatedProfile.name, bio: updatedProfile.tagline },
        })
      );

      setIsEditing(false);
      showToast('Profile updated successfully in database!');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper for compressing image to lightweight DataURL
  const compressImage = (file, maxWidth, maxHeight, quality = 0.85) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let { width, height } = img;
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(event.target.result);
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
    });
  };

  // Avatar Upload Handler
  const handleAvatarFilePicked = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Image size must be less than 8MB', 'error');
        return;
      }
      try {
        const dataUrl = await compressImage(file, 400, 400, 0.85);
        setProfileData((prev) => ({ ...prev, avatarUrl: dataUrl }));

        const currentAuthUser = authStorage.getUser() || {};
        authStorage.setUser({ ...currentAuthUser, avatarUrl: dataUrl });

        window.dispatchEvent(
          new CustomEvent('connectx_profile_updated', {
            detail: { avatarUrl: dataUrl },
          })
        );

        await settingsService.updateProfile({ avatarUrl: dataUrl });
        showToast('Profile photo updated and saved!');
      } catch (err) {
        console.error('Error saving avatar:', err);
        showToast('Failed to save profile photo to server', 'error');
      }
    }
  };

  // Cover Banner Upload Handler
  const handleCoverFilePicked = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Cover photo must be less than 10MB', 'error');
        return;
      }
      try {
        const dataUrl = await compressImage(file, 1200, 500, 0.85);
        setProfileData((prev) => ({ ...prev, coverPhotoUrl: dataUrl }));
        await settingsService.updateProfile({ coverPhotoUrl: dataUrl });
        showToast('Cover banner photo updated successfully!');
      } catch (err) {
        console.error('Error saving cover:', err);
        showToast('Failed to save cover banner to server', 'error');
      }
    }
  };

  // Custom Status Save Handler
  const handleSaveStatus = async (statusText) => {
    const targetStatus = statusText || newStatusInput.trim();
    if (!targetStatus) return;

    try {
      await settingsService.updateProfile({ customStatus: targetStatus });
      setProfileData((prev) => ({ ...prev, customStatus: targetStatus }));
      setIsEditingStatus(false);
      setNewStatusInput('');
      showToast('Custom status updated!');
    } catch {
      setProfileData((prev) => ({ ...prev, customStatus: targetStatus }));
      setIsEditingStatus(false);
      showToast('Custom status updated locally!');
    }
  };

  // Gallery Upload Handler
  const handleGalleryFilePicked = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewPhotoUrl(event.target.result);
        setIsUploadPhotoModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmPhotoUpload = () => {
    if (!newPhotoUrl) return;
    const newEntry = {
      id: Date.now(),
      url: newPhotoUrl,
      caption: newPhotoCaption || 'New memory on ConnectX ✨',
      likes: 1,
      comments: 0,
      liked: true,
      date: 'Just now',
    };
    setPhotos([newEntry, ...photos]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setIsUploadPhotoModalOpen(false);
    showToast('New photo added to your gallery!');
  };

  // Post Like Toggle
  const handleTogglePostLike = (postId) => {
    setActivityPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const nextLiked = !post.isLiked;
          return {
            ...post,
            isLiked: nextLiked,
            likes: nextLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  return (
    <div className="p-4 sm:p-7 max-w-[1480px] w-full mx-auto space-y-6">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarFilePicked}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={coverInputRef}
        onChange={handleCoverFilePicked}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={galleryInputRef}
        onChange={handleGalleryFilePicked}
        accept="image/*"
        className="hidden"
      />

      {/* Main Grid: Left 8 cols, Right 4 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT COLUMN (Col Span 8) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Cover Photo & Main Profile Card */}
          <div
            className={`rounded-3xl overflow-hidden border shadow-2xl transition-all ${
              isDark ? 'bg-[#0B0D19]/90 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200/80 shadow-xs'
            }`}
          >
            {/* Top Cover Banner */}
            <div className="relative h-48 sm:h-64 w-full overflow-hidden group">
              <img
                src={profileData.coverPhotoUrl}
                alt="Profile Mountain Cover"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = '/images/mountain.jpg';
                }}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  isDark ? 'from-[#0B0D19] via-transparent to-black/30' : 'from-white via-transparent to-black/20'
                }`}
              />

              {/* Edit Cover Button */}
              <button
                onClick={() => coverInputRef.current?.click()}
                className="absolute top-4 right-4 px-3.5 py-2 rounded-xl bg-black/50 hover:bg-black/75 text-white text-xs sm:text-sm font-semibold backdrop-blur-md transition-all flex items-center gap-2 border border-white/20 cursor-pointer shadow-lg active:scale-95"
                title="Change Cover Banner"
              >
                <Camera className="w-4 h-4" />
                <span>Edit Cover</span>
              </button>

              {/* Cursive Art Text Overlay */}
              <div className="absolute bottom-4 right-6 text-right pointer-events-none hidden sm:block">
                <p
                  style={{ fontFamily: "'Caveat', 'Dancing Script', cursive, sans-serif" }}
                  className="text-lg sm:text-xl font-bold text-slate-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] leading-tight -rotate-2"
                >
                  Real People<br />
                  Real Conversations<br />
                  No Phone Numbers
                </p>
              </div>
            </div>

            {/* Profile Info Section */}
            <div className="px-6 sm:px-8 pb-6 pt-0 relative">
              {/* Avatar + Edit Button Row */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
                {/* Circular Avatar with green camera icon */}
                <div className="relative inline-block">
                  <img
                    src={profileData.avatarUrl}
                    alt={profileData.name}
                    className={`w-26 h-26 sm:w-30 sm:h-30 rounded-full object-cover border-4 shadow-2xl ${
                      isDark ? 'border-[#0B0D19]' : 'border-white'
                    }`}
                    onError={(e) => {
                      e.target.src = '/images/boy_1.jpg';
                    }}
                  />
                  {/* Green Camera Icon Button */}
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className={`absolute bottom-1 right-1 w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 cursor-pointer transition-transform hover:scale-110 active:scale-95 ${
                      isDark ? 'border-[#0B0D19]' : 'border-white'
                    }`}
                    title="Change Avatar"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Edit Profile Button */}
                <button
                  onClick={startEditProfile}
                  className={`inline-flex items-center gap-2 px-4.5 py-2.5 rounded-2xl text-sm font-bold border transition-all cursor-pointer self-start sm:self-auto shadow-sm active:scale-95 ${
                    isDark
                      ? `bg-white/[0.08] hover:bg-white/15 text-white border-white/15 ${theme.borderHover}`
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                  }`}
                >
                  <Edit3 className={`w-4 h-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`} />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Name, Handle, Online Status & Bio */}
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3">
                  <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {profileData.name}
                  </h1>
                  <span className={`text-sm sm:text-base font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    @{profileData.username}
                  </span>
                </div>

                {/* Online indicator */}
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs sm:text-sm text-emerald-500 font-bold">Online</span>
                </div>

                {/* Bio Tagline */}
                <p className={`text-sm sm:text-base font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {profileData.tagline}
                </p>

                {/* Meta Tags: Computer Science, Location, Joined Date */}
                <div className={`flex flex-wrap items-center gap-5 pt-1.5 text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span className="flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-purple-400" />
                    <span>{profileData.field}</span>
                  </span>

                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <span>{profileData.location}</span>
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>{profileData.joinedDate}</span>
                  </span>
                </div>
              </div>

              {/* Stats Row: 124 Friends, 18 Followers, 12 Following */}
              <div
                className={`flex items-center gap-8 pt-5 pb-2 border-t mt-5 ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}
              >
                <div>
                  <span className={`block text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {profileData.friendsCount}
                  </span>
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Friends</span>
                </div>

                <div>
                  <span className={`block text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {profileData.followersCount}
                  </span>
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Followers</span>
                </div>

                <div>
                  <span className={`block text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {profileData.followingCount}
                  </span>
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Following</span>
                </div>
              </div>

              {/* Sub Navigation Tabs: Overview, Photos, About, Activity */}
              <div
                className={`flex items-center gap-2.5 pt-4 border-t ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}
              >
                {[
                  { id: 'Overview', label: 'Overview', icon: User },
                  { id: 'Photos', label: 'Photos', icon: ImageIcon },
                  { id: 'About', label: 'About', icon: Info },
                  { id: 'Activity', label: 'Activity', icon: Activity },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = activeSubTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveSubTab(t.id)}
                      className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        isActive
                          ? `${theme.btn} text-white shadow-lg scale-105`
                          : isDark
                          ? 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
                          : 'bg-white text-slate-700 hover:text-black hover:bg-slate-100 border border-slate-200 shadow-xs'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= SUB-TAB CONTENT ================= */}

          {/* TAB 1: OVERVIEW (Matching exact reference screenshot) */}
          {activeSubTab === 'Overview' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left: About Me Card (Col Span 7) */}
              <div
                className={`md:col-span-7 rounded-3xl border p-6 space-y-4 shadow-xl ${
                  isDark ? 'bg-[#0B0D19]/90 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200/80 shadow-xs'
                }`}
              >
                <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    About Me
                  </h3>
                  <button
                    onClick={startEditProfile}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-black hover:bg-slate-100'
                    }`}
                    title="Edit About Me"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bio Paragraphs */}
                <div className={`space-y-2.5 text-xs sm:text-sm leading-relaxed font-normal ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <p className="whitespace-pre-line">{profileData.aboutParagraph}</p>
                </div>

                {/* Meta Detail Rows */}
                <div className={`space-y-3.5 pt-4 border-t text-xs sm:text-sm ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className={`flex items-center gap-2.5 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <Mail className="w-4 h-4 shrink-0 text-purple-400" />
                      <span>Email</span>
                    </span>
                    <span className={`font-semibold truncate max-w-[220px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {profileData.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className={`flex items-center gap-2.5 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <MapPin className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>Location</span>
                    </span>
                    <span className={`font-semibold truncate max-w-[220px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {profileData.fullLocation}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className={`flex items-center gap-2.5 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <GraduationCap className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>Education</span>
                    </span>
                    <span className={`font-semibold truncate max-w-[220px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {profileData.education}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className={`flex items-center gap-2.5 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <Briefcase className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>Occupation</span>
                    </span>
                    <span className={`font-semibold truncate max-w-[220px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {profileData.occupation}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className={`flex items-center gap-2.5 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <Globe className="w-4 h-4 shrink-0 text-blue-400" />
                      <span>Website</span>
                    </span>
                    <a
                      href={profileData.website}
                      target="_blank"
                      rel="noreferrer"
                      className={`${theme.text} ${theme.textHover} font-bold flex items-center gap-1 truncate max-w-[220px] hover:underline`}
                    >
                      <span className="truncate">{profileData.website}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right: Quick Actions + Status Cards (Col Span 5) */}
              <div className="md:col-span-5 space-y-5">
                {/* Quick Actions Card */}
                <div
                  className={`rounded-3xl border p-5.5 space-y-3.5 shadow-xl ${
                    isDark ? 'bg-[#0B0D19]/90 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200/80 shadow-xs'
                  }`}
                >
                  <h3 className={`text-base font-bold tracking-tight pb-2 border-b ${isDark ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'}`}>
                    Quick Actions
                  </h3>

                  <div className="space-y-1.5">
                    <button
                      onClick={startEditProfile}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                        isDark ? 'hover:bg-white/[0.06] text-slate-200 hover:text-white' : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <Edit3 className={`w-4.5 h-4.5 ${theme.text}`} />
                      <span>Edit Profile</span>
                    </button>

                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                        isDark ? 'hover:bg-white/[0.06] text-slate-200 hover:text-white' : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <ImageIcon className={`w-4.5 h-4.5 ${theme.text}`} />
                      <span>Change Profile Photo</span>
                    </button>

                    <button
                      onClick={() => coverInputRef.current?.click()}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                        isDark ? 'hover:bg-white/[0.06] text-slate-200 hover:text-white' : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <Camera className={`w-4.5 h-4.5 ${theme.text}`} />
                      <span>Change Cover Photo</span>
                    </button>

                    <button
                      onClick={() => onNavigateTab && onNavigateTab('Settings')}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                        isDark ? 'hover:bg-white/[0.06] text-slate-200 hover:text-white' : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <Lock className={`w-4.5 h-4.5 ${theme.text}`} />
                      <span>Privacy Settings</span>
                    </button>

                    <button
                      onClick={() => onNavigateTab && onNavigateTab('Settings')}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                        isDark ? 'hover:bg-white/[0.06] text-slate-200 hover:text-white' : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <SettingsIcon className={`w-4.5 h-4.5 ${theme.text}`} />
                      <span>Manage Account</span>
                    </button>
                  </div>
                </div>

                {/* Status Card */}
                <div
                  className={`rounded-3xl border p-5.5 space-y-3.5 shadow-xl ${
                    isDark ? 'bg-[#0B0D19]/90 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200/80 shadow-xs'
                  }`}
                >
                  <h3 className={`text-base font-bold tracking-tight pb-2 border-b ${isDark ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'}`}>
                    Status
                  </h3>

                  <div
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-colors ${
                      isDark ? 'bg-[#080A14] border-white/5 hover:bg-white/[0.04]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Online</span>
                    </div>
                    <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
                  </div>

                  <div className="pt-1">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <span className="font-semibold uppercase tracking-wider">Custom Status</span>
                      <button
                        onClick={() => {
                          setNewStatusInput(profileData.customStatus);
                          setIsEditingStatus(true);
                        }}
                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                          isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-black hover:bg-slate-100'
                        }`}
                        title="Edit Custom Status"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {profileData.customStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PHOTOS */}
          {activeSubTab === 'Photos' && (
            <div
              className={`rounded-3xl border p-6 sm:p-7 space-y-6 shadow-xl ${
                isDark ? 'bg-[#0B0D19]/90 border-white/[0.08]' : 'bg-white border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Photos & Shared Memories
                  </h3>
                  <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {photos.length} shared photographs on your ConnectX timeline
                  </p>
                </div>

                <button
                  onClick={() => galleryInputRef.current?.click()}
                  className={`px-4.5 py-2.5 rounded-2xl ${theme.btn} text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Photo</span>
                </button>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setLightboxPhoto(item)}
                    className="relative group rounded-2xl overflow-hidden aspect-square border border-white/10 cursor-pointer shadow-md"
                  >
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3.5">
                      <p className="text-white text-xs font-semibold line-clamp-1">{item.caption}</p>
                      <div className="flex items-center gap-3 mt-1 text-white/90 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                          <span>{item.likes}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{item.comments}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT (Expanded Story & Skills) */}
          {activeSubTab === 'About' && (
            <div
              className={`rounded-3xl border p-6 sm:p-7 space-y-6 shadow-xl ${
                isDark ? 'bg-[#0B0D19]/90 border-white/[0.08]' : 'bg-white border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Full Bio & Profile Dossier
                  </h3>
                  <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Complete technical background, academic journey, and interests
                  </p>
                </div>
                <button
                  onClick={startEditProfile}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border cursor-pointer ${
                    isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-black hover:bg-slate-200'
                  }`}
                >
                  Edit Details
                </button>
              </div>

              {/* Skills & Stack */}
              <div className="space-y-3">
                <h4 className={`text-xs font-extrabold uppercase tracking-wider ${theme.text}`}>
                  Skills & Technology Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Java 25',
                    'Spring Boot 3',
                    'React 19',
                    'TailwindCSS',
                    'PostgreSQL',
                    'WebSockets',
                    'Web Audio API',
                    'Docker',
                    'REST APIs',
                    'TypeScript',
                    'Git',
                  ].map((skill) => (
                    <span
                      key={skill}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border ${theme.badge}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education & Experience Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
                <div className={`p-4.5 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                    <h5 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Academics</h5>
                  </div>
                  <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Narayana Engineering College
                  </p>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Bachelor of Technology in Computer Science (2022 - 2026)
                  </p>
                </div>

                <div className={`p-4.5 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    <h5 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Experience</h5>
                  </div>
                  <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Full-Stack Engineer @ ConnectX
                  </p>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Designing phone-number-free private communication networks.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVITY (Interactive Posts Feed) */}
          {activeSubTab === 'Activity' && (
            <div className="space-y-4">
              {activityPosts.map((post) => (
                <div
                  key={post.id}
                  className={`rounded-3xl border p-5.5 shadow-xl transition-all ${
                    isDark ? 'bg-[#0B0D19]/90 border-white/[0.08]' : 'bg-white border-slate-200/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={profileData.avatarUrl}
                        alt={profileData.name}
                        className="w-10 h-10 rounded-full object-cover border border-purple-400/40"
                      />
                      <div>
                        <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {profileData.name}
                        </h4>
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{post.time}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.badge}`}>
                      {post.tag}
                    </span>
                  </div>

                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {post.content}
                  </p>

                  <div className={`flex items-center gap-6 pt-3 mt-4 border-t text-xs font-bold ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                    <button
                      onClick={() => handleTogglePostLike(post.id)}
                      className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                        post.isLiked ? 'text-rose-500' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => showToast('Opening comments')}
                      className={`flex items-center gap-1.5 cursor-pointer ${
                        isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </button>

                    <button
                      onClick={() => showToast('Post link copied to clipboard')}
                      className={`flex items-center gap-1.5 cursor-pointer ${
                        isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'
                      }`}
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT COLUMN (Col Span 4) ================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1. Profile Stats Card at top right (Matching Screenshot) */}
          <div
            className={`rounded-3xl border p-5 shadow-xl ${
              isDark ? 'bg-[#0B0D19]/90 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200/80 shadow-xs'
            }`}
          >
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <span className={`block text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {profileData.friendsCount}
                </span>
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Friends</span>
              </div>
              <div>
                <span className={`block text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {profileData.followersCount}
                </span>
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Followers</span>
              </div>
              <div>
                <span className={`block text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {profileData.followingCount}
                </span>
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Following</span>
              </div>
            </div>
          </div>

          {/* 2. Inspirational Quote Card (Matching Screenshot) */}
          <div
            className={`rounded-3xl border p-6 shadow-xl relative overflow-hidden ${
              isDark ? 'bg-[#0B0D19]/90 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200/80 shadow-xs'
            }`}
          >
            <span className={`text-4xl sm:text-5xl font-serif ${theme.text} opacity-40 leading-none block select-none`}>
              “
            </span>
            <p className={`text-sm sm:text-base font-normal leading-relaxed -mt-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              People make places special. Not phone numbers.
            </p>
            <p className={`text-xs font-bold text-right mt-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              — ConnectX
            </p>
          </div>

          {/* 3. Your ConnectX ID Card (Matching Screenshot) */}
          <div
            className={`rounded-3xl border p-5.5 space-y-3.5 shadow-xl ${
              isDark ? 'bg-[#0B0D19]/90 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200/80 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl ${theme.badge} flex items-center justify-center font-black text-sm`}>
                @
              </div>
              <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Your ConnectX ID
              </h3>
            </div>

            <div
              className={`flex items-center justify-between p-3 rounded-2xl border ${
                isDark ? 'bg-[#080A14] border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className={`text-sm font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
                @{profileData.username}
              </span>
              <button
                onClick={handleCopyId}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
                title="Copy ID"
              >
                {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Share this with others so they can find you on ConnectX.
            </p>
          </div>

          {/* 4. Account Security Card (Matching Screenshot) */}
          <div
            className={`rounded-3xl border p-5.5 space-y-2.5 shadow-xl ${
              isDark ? 'bg-[#0B0D19]/90 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200/80 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Account Security
              </h3>
            </div>

            <div
              onClick={() => onNavigateTab && onNavigateTab('Settings')}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-colors cursor-pointer ${
                isDark ? 'bg-[#080A14] hover:bg-white/[0.04] border-white/5' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-bold text-emerald-400">
                  Your account is secure
                </span>
              </div>
              <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
            </div>

            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Last password change: 23 Sep 2026
            </p>
          </div>
        </div>
      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {isEditing && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div
            className={`max-w-2xl w-full rounded-3xl p-6 sm:p-7 border shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 ${
              isDark ? 'bg-[#0C1024] border-white/15 text-white' : 'bg-white border-slate-200 text-black'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Edit3 className={`w-5 h-5 ${theme.text}`} />
                <h3 className="text-lg font-extrabold">Edit Profile Information</h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-400">Display Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium focus:outline-none ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-black'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-400">Tagline / Bio</label>
                  <input
                    type="text"
                    value={editForm.tagline}
                    onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium focus:outline-none ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-black'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-400">Field of Study</label>
                  <input
                    type="text"
                    value={editForm.field}
                    onChange={(e) => setEditForm({ ...editForm, field: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium focus:outline-none ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-black'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-400">Location (City, Country)</label>
                  <input
                    type="text"
                    value={editForm.fullLocation}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        fullLocation: e.target.value,
                        location: e.target.value.split(',')[0].trim() + ', Andhra Pradesh',
                      })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium focus:outline-none ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-black'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-400">Education / College</label>
                  <input
                    type="text"
                    value={editForm.education}
                    onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium focus:outline-none ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-black'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-400">Occupation / Role</label>
                  <input
                    type="text"
                    value={editForm.occupation}
                    onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium focus:outline-none ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-black'
                    }`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-400">Website or Portfolio Link</label>
                  <input
                    type="url"
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium focus:outline-none ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-black'
                    }`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-400">About Me Paragraph</label>
                  <textarea
                    rows={4}
                    value={editForm.aboutParagraph}
                    onChange={(e) => setEditForm({ ...editForm, aboutParagraph: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium focus:outline-none resize-none ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-black'
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4.5 py-2.5 rounded-xl text-sm font-semibold border border-white/10 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-6 py-2.5 rounded-xl ${theme.btn} text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50`}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT CUSTOM STATUS MODAL ================= */}
      {isEditingStatus && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div
            className={`max-w-md w-full rounded-3xl p-6 border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#0C1024] border-white/15 text-white' : 'bg-white border-slate-200 text-black'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">Set Custom Status</h3>
              <button
                onClick={() => setIsEditingStatus(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={newStatusInput}
              onChange={(e) => setNewStatusInput(e.target.value)}
              placeholder="What are you up to?"
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium focus:outline-none ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-black'
              }`}
            />

            <div className="flex flex-wrap gap-2 text-xs">
              {[
                'Coding today, connections tomorrow 💻',
                'In a focus session 🎧',
                'Exploring new ideas 🚀',
                'Available for chats 💬',
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setNewStatusInput(s)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingStatus(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveStatus(newStatusInput)}
                className={`px-5 py-2 rounded-xl ${theme.btn} text-xs font-bold cursor-pointer shadow-md`}
              >
                Set Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PHOTO LIGHTBOX MODAL ================= */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full rounded-3xl overflow-hidden border border-white/20 bg-[#0B0D19] shadow-2xl space-y-4 p-4 cursor-default"
          >
            <div className="relative rounded-2xl overflow-hidden max-h-[65vh]">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.caption}
                className="w-full h-full object-contain mx-auto"
              />
            </div>
            <div className="flex items-center justify-between px-2">
              <div>
                <p className="text-white text-sm font-bold">{lightboxPhoto.caption}</p>
                <p className="text-slate-400 text-xs mt-0.5">{lightboxPhoto.date}</p>
              </div>
              <button
                onClick={() => setLightboxPhoto(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= UPLOAD PHOTO MODAL ================= */}
      {isUploadPhotoModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div
            className={`max-w-md w-full rounded-3xl p-6 border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#0C1024] border-white/15 text-white' : 'bg-white border-slate-200 text-black'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold">Add Photo to Gallery</h3>
              <button
                onClick={() => setIsUploadPhotoModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-video border border-white/10">
              <img src={newPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Caption</label>
              <input
                type="text"
                value={newPhotoCaption}
                onChange={(e) => setNewPhotoCaption(e.target.value)}
                placeholder="Write a caption for this moment..."
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium focus:outline-none ${
                  isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-black'
                }`}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsUploadPhotoModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPhotoUpload}
                className={`px-5 py-2 rounded-xl ${theme.btn} text-xs font-bold cursor-pointer shadow-md`}
              >
                Publish Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
