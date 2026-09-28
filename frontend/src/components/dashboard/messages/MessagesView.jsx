import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Send,
  Check,
  CheckCheck,
  Star,
  BellOff,
  User,
  Trash2,
  Ban,
  Flag,
  X,
  Copy,
  CheckCircle2,
  Camera,
  FileText,
  BarChart2,
  Users,
  MessageSquare,
  Sparkles,
  Loader2,
  RefreshCw,
  ExternalLink,
  Download,
  Image as ImageIcon,
} from 'lucide-react';
import { getAccentTheme } from '../../../utils/themeHelper';
import useAuth from '../../../hooks/useAuth';
import messageService from '../../../services/messageService';
import chatSocket from '../../../services/chatSocket';
import { useToast } from '../../../context/ToastContext';

// Categorized emoji dictionary for interactive picker
const EMOJI_CATEGORIES = {
  smileys: {
    name: 'Smileys',
    icon: '😊',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥹', '☺️',
      '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗',
      '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓',
      '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕',
      '🙁', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
      '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥',
      '😓', '🤗', '🤔', '🫣', '🤭', '🫢', '🫡', '🤫', '🫠', '🤐',
    ],
  },
  gestures: {
    name: 'Gestures',
    icon: '👍',
    emojis: [
      '👍', '👎', '👏', '🙌', '👐', '🤝', '🤜', '🤛', '✊', '👊',
      '🖐️', '✋', '🤚', '👋', '🤟', '🤘', '✌️', '🤞', '🤌', '🤏',
      '👌', '🤙', '🫰', '👈', '👉', '👆', '👇', '☝️', '🫶', '🙏',
      '💪', '🫡', '👀', '👁️', '👂', '👃', '🧠', '🫀', '🫁', '✨',
    ],
  },
  love: {
    name: 'Love & Vibes',
    icon: '❤️',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '💌',
      '🔥', '✨', '⚡', '🌟', '💥', '🎉', '🎊', '🎈', '🎁', '💯',
    ],
  },
  objects: {
    name: 'Fun & Work',
    icon: '🚀',
    emojis: [
      '🚀', '💬', '💭', '🔔', '🎵', '🎶', '📸', '🎥', '💻', '📱',
      '💡', '☕', '🍕', '🍻', '🍔', '🍦', '🍩', '🏆', '⚽', '🏀',
      '🎮', '🎲', '🎧', '✈️', '🏖️', '🌈', '☀️', '⭐', '🪄', '💎',
    ],
  },
};

export default function MessagesView({ isDark = true, accentColor = 'purple' }) {
  const { showToast } = useToast();
  const theme = getAccentTheme(accentColor);
  const { user } = useAuth();

  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Unread' | 'Favorites' | 'Groups'
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // New Chat Modal state
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [friendsSearchQuery, setFriendsSearchQuery] = useState('');
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);

  // Options & Dropdowns
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState('smileys');
  const [emojiSearch, setEmojiSearch] = useState('');
  const [lightboxImage, setLightboxImage] = useState(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const partnerTypingTimeoutRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const attachMenuRef = useRef(null);
  const messageInputRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        !e.target.closest('#emoji-toggle-btn')
      ) {
        setShowEmojiPicker(false);
      }
      if (
        attachMenuRef.current &&
        !attachMenuRef.current.contains(e.target) &&
        !e.target.closest('#attach-toggle-btn')
      ) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamic Appearance (Font Size & Compact Mode)
  const [messageFontSize, setMessageFontSize] = useState(
    localStorage.getItem('connectx_message_font_size') || 'medium'
  );
  const [compactMode, setCompactMode] = useState(
    localStorage.getItem('connectx_compact_mode') === 'true'
  );

  useEffect(() => {
    const handleAppearanceChange = (e) => {
      if (e?.detail?.messageFontSize) {
        setMessageFontSize(e.detail.messageFontSize);
      }
      if (e?.detail?.compactMode !== undefined) {
        setCompactMode(e.detail.compactMode);
      }
    };
    window.addEventListener('connectx_appearance_changed', handleAppearanceChange);
    return () => window.removeEventListener('connectx_appearance_changed', handleAppearanceChange);
  }, []);

  const fontSizeClass =
    messageFontSize === 'small'
      ? 'text-[13px] leading-snug'
      : messageFontSize === 'large'
      ? 'text-[17px] leading-relaxed'
      : messageFontSize === 'xlarge'
      ? 'text-[19px] leading-relaxed font-medium'
      : 'text-[15px] leading-normal';

  const bubblePaddingClass = compactMode ? 'px-3 py-1.5' : 'px-4 py-2.5';
  const chatStreamSpacingClass = compactMode ? 'space-y-2' : 'space-y-3.5';

  // Draggable message bar width (default 320px, min 240px, max 580px)
  const [messageBarWidth, setMessageBarWidth] = useState(320);
  const [isDragging, setIsDragging] = useState(false);
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(320);

  const startDragging = (e) => {
    e.preventDefault();
    isResizingRef.current = true;
    setIsDragging(true);
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0]?.clientX);
    startXRef.current = clientX || 0;
    startWidthRef.current = messageBarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMove = (moveEvent) => {
      if (!isResizingRef.current) return;
      const currentX = moveEvent.clientX !== undefined ? moveEvent.clientX : (moveEvent.touches && moveEvent.touches[0]?.clientX);
      if (currentX === undefined) return;
      const delta = currentX - startXRef.current;
      const newWidth = Math.min(Math.max(startWidthRef.current + delta, 240), 580);
      setMessageBarWidth(newWidth);
    };

    const handleEnd = () => {
      isResizingRef.current = false;
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
  };

  const formatMessageTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '';
      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

      if (isYesterday) {
        return 'Yesterday';
      }

      const diffDays = Math.round((now - date) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
      }

      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const formatLastSeen = (isoString) => {
    if (!isoString) return 'Offline';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'Offline';
      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (isToday) {
        return `Last seen today at ${timeStr}`;
      }

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

      if (isYesterday) {
        return `Last seen yesterday at ${timeStr}`;
      }

      const diffDays = Math.round((now - date) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        const weekday = date.toLocaleDateString([], { weekday: 'short' });
        return `Last seen ${weekday} at ${timeStr}`;
      }

      return `Last seen ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${timeStr}`;
    } catch {
      return 'Offline';
    }
  };

  const formatMessageObj = useCallback((m) => {
    const isMe = m.senderId === user?.id;
    return {
      id: m.id,
      sender: isMe ? 'me' : 'them',
      senderId: m.senderId,
      recipientId: m.recipientId,
      text: m.content || '',
      time: formatMessageTime(m.createdAt),
      type: (m.messageType || 'TEXT').toLowerCase(),
      mediaUrl: m.mediaUrl,
      mediaName: m.mediaName,
      status: (m.status || 'SENT').toLowerCase(),
      rawCreatedAt: m.createdAt,
    };
  }, [user?.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  // 1. Fetch Real Conversations from DB
  const loadConversations = useCallback(async (selectPartnerId = null) => {
    setIsLoadingConversations(true);
    try {
      const data = await messageService.getConversations();
      const mapped = (data || []).map((c) => ({
        id: c.partnerId,
        partnerId: c.partnerId,
        name: c.displayName || c.username,
        handle: `@${c.username}`,
        avatar: c.avatarUrl || '/images/boy_1.jpg',
        lastMessage: c.lastMessage || 'Start a conversation',
        time: formatMessageTime(c.lastMessageTime),
        unread: c.unreadCount || 0,
        unreadColor: 'bg-purple-600',
        online: Boolean(c.online),
        lastSeen: c.lastSeen || null,
        isGroup: false,
        isFriend: c.isFriend,
        lastMessageType: c.lastMessageType,
        hasImage: c.lastMessageType === 'IMAGE',
      }));

      setConversations(mapped);

      // Select active contact
      if (selectPartnerId) {
        setSelectedContactId(selectPartnerId);
      } else if (mapped.length > 0) {
        setSelectedContactId((current) => current || mapped[0].id);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  // 2. Fetch Messages History when selected contact changes
  const loadMessages = useCallback(async (partnerId) => {
    if (!partnerId) {
      setMessages([]);
      return;
    }
    setIsLoadingMessages(true);
    try {
      const history = await messageService.getMessageHistory(partnerId);
      const formatted = (history || []).map(formatMessageObj);
      setMessages(formatted);
      scrollToBottom();

      // Zero out unread count for this contact locally
      setConversations((prev) =>
        prev.map((c) => (c.partnerId === partnerId ? { ...c, unread: 0 } : c))
      );

      // Mark as read over WebSocket
      chatSocket.markAsRead(partnerId);
    } catch (err) {
      console.error(`Failed to load message history with ${partnerId}:`, err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [formatMessageObj]);

  // Load conversations on mount & connect WebSocket
  useEffect(() => {
    loadConversations();
    chatSocket.connect();

    // Subscribe to WebSocket events
    const unsubMessage = chatSocket.on('message', (incoming) => {
      if (!incoming) return;

      const formatted = formatMessageObj(incoming);

      // If message is from or to the current active chat partner
      setSelectedContactId((currentActiveId) => {
        const isCurrentChat =
          incoming.senderId === currentActiveId || incoming.recipientId === currentActiveId;

        if (isCurrentChat) {
          setMessages((prev) => {
            // 1. If message already exists by real ID, do not duplicate
            if (prev.some((m) => m.id === formatted.id)) return prev;

            // 2. If it's a message sent by me, find matching optimistic 'temp-' message and replace it
            if (formatted.sender === 'me') {
              const tempIndex = prev.findIndex(
                (m) =>
                  m.id &&
                  String(m.id).startsWith('temp-') &&
                  m.text === formatted.text &&
                  String(m.recipientId).toLowerCase() === String(formatted.recipientId).toLowerCase()
              );
              if (tempIndex !== -1) {
                const updated = [...prev];
                updated[tempIndex] = formatted;
                return updated;
              }
            }

            return [...prev, formatted];
          });
          scrollToBottom();

          // Mark incoming as read immediately
          if (incoming.senderId === currentActiveId) {
            chatSocket.markAsRead(incoming.senderId);
          }
        }

        // Update conversation list preview & unread counts
        setConversations((prev) => {
          const partnerId = incoming.senderId === user?.id ? incoming.recipientId : incoming.senderId;
          const idx = prev.findIndex((c) => c.partnerId === partnerId);

          if (idx !== -1) {
            const target = prev[idx];
            const updated = {
              ...target,
              lastMessage: incoming.content || (incoming.messageType === 'MEET_LINK' ? 'Video Meeting' : 'Attachment'),
              time: formatMessageTime(incoming.createdAt),
              lastMessageType: incoming.messageType,
              hasImage: incoming.messageType === 'IMAGE',
              unread: isCurrentChat ? 0 : (target.unread || 0) + 1,
            };
            const others = prev.filter((_, i) => i !== idx);
            return [updated, ...others];
          } else {
            // New conversation partner not in list yet -> reload list
            loadConversations(currentActiveId);
            return prev;
          }
        });

        return currentActiveId;
      });
    });

    const unsubOnlineList = chatSocket.on('online_users', (onlineIds) => {
      if (!Array.isArray(onlineIds)) return;
      const set = new Set(onlineIds.map((id) => String(id).toLowerCase()));
      setConversations((prev) =>
        prev.map((c) => ({
          ...c,
          online: set.has(String(c.partnerId).toLowerCase()),
        }))
      );
    });

    const unsubTyping = chatSocket.on('typing', ({ senderId, isTyping }) => {
      if (!senderId) return;
      // CRITICAL: Never show typing indicator for yourself!
      if (user?.id && String(senderId).toLowerCase() === String(user.id).toLowerCase()) {
        return;
      }
      const sId = String(senderId).toLowerCase();

      setSelectedContactId((currentActiveId) => {
        if (currentActiveId && String(currentActiveId).toLowerCase() === sId) {
          setIsPartnerTyping(Boolean(isTyping));
          clearTimeout(partnerTypingTimeoutRef.current);
          if (isTyping) {
            partnerTypingTimeoutRef.current = setTimeout(() => {
              setIsPartnerTyping(false);
            }, 3000);
          }
        }
        return currentActiveId;
      });

      // Update sidebar conversation item with isTyping
      setConversations((prev) =>
        prev.map((c) =>
          String(c.partnerId).toLowerCase() === sId
            ? { ...c, isTyping: Boolean(isTyping) }
            : c
        )
      );
    });

    const unsubRead = chatSocket.on('read', ({ senderId }) => {
      if (!senderId) return;
      const sId = String(senderId).toLowerCase();
      setSelectedContactId((currentActiveId) => {
        if (currentActiveId && String(currentActiveId).toLowerCase() === sId) {
          setMessages((prev) =>
            prev.map((m) => (m.sender === 'me' ? { ...m, status: 'read' } : m))
          );
        }
        return currentActiveId;
      });
    });

    const unsubStatus = chatSocket.on('status', ({ userId, status, timestamp }) => {
      if (!userId) return;
      const isOnline = status === 'ONLINE';
      const uId = String(userId).toLowerCase();
      setConversations((prev) =>
        prev.map((c) => {
          if (String(c.partnerId).toLowerCase() === uId) {
            return {
              ...c,
              online: isOnline,
              lastSeen: isOnline ? c.lastSeen : (timestamp || new Date().toISOString()),
            };
          }
          return c;
        })
      );
    });

    return () => {
      unsubMessage();
      unsubOnlineList();
      unsubTyping();
      unsubRead();
      unsubStatus();
      clearTimeout(partnerTypingTimeoutRef.current);
      clearTimeout(typingTimeoutRef.current);
    };
  }, [loadConversations, formatMessageObj, user?.id]);

  // Load message history when selectedContactId changes
  useEffect(() => {
    if (selectedContactId) {
      loadMessages(selectedContactId);
      setIsPartnerTyping(false);
    }
  }, [selectedContactId, loadMessages]);

  const activeContact = conversations.find((c) => c.id === selectedContactId) || null;

  // Handle Input typing and debounce typing indicator to partner
  const handleInputChange = (e) => {
    const val = e.target.value;
    setMessageInput(val);

    if (activeContact?.partnerId) {
      chatSocket.sendTyping({ recipientId: activeContact.partnerId, isTyping: true });

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        if (activeContact?.partnerId) {
          chatSocket.sendTyping({ recipientId: activeContact.partnerId, isTyping: false });
        }
      }, 2000);
    }
  };

  // Send Message via WebSocket (with REST fallback)
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeContact?.partnerId) return;

    const content = messageInput.trim();
    setMessageInput('');

    // Stop typing indicator
    if (activeContact?.partnerId) {
      chatSocket.sendTyping({ recipientId: activeContact.partnerId, isTyping: false });
    }

    // Optimistic message bubble
    const tempId = 'temp-' + Date.now();
    const optimistic = {
      id: tempId,
      sender: 'me',
      senderId: user?.id,
      recipientId: activeContact.partnerId,
      text: content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      status: 'sent',
    };

    setMessages((prev) => [...prev, optimistic]);
    scrollToBottom();

    // Update conversation item preview immediately
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.partnerId === activeContact.partnerId);
      if (idx !== -1) {
        const item = {
          ...prev[idx],
          lastMessage: content,
          time: optimistic.time,
        };
        const rest = prev.filter((_, i) => i !== idx);
        return [item, ...rest];
      }
      return prev;
    });

    // Send through WebSocket
    const sentViaWs = chatSocket.sendChatMessage({
      recipientId: activeContact.partnerId,
      content,
      messageType: 'TEXT',
    });

    // If WebSocket is disconnected or failed, send via REST API
    if (!sentViaWs) {
      try {
        const saved = await messageService.sendMessage(activeContact.partnerId, content, 'TEXT');
        if (saved) {
          setMessages((prev) =>
            prev.map((m) => (m.id === tempId ? formatMessageObj(saved) : m))
          );
        }
      } catch (err) {
        showToast('Message send failed: ' + (err.message || 'Network error'));
      }
    }
  };

  // Send Google Meet Link Card
  const handleSendMeetingLink = async () => {
    if (!activeContact?.partnerId) return;
    setShowAttachMenu(false);

    const randomSlug = Math.random().toString(36).substring(2, 5) + '-' +
                       Math.random().toString(36).substring(2, 6) + '-' +
                       Math.random().toString(36).substring(2, 5);
    const meetUrl = `meet.google.com/${randomSlug}`;

    try {
      const saved = await messageService.sendMessage(
        activeContact.partnerId,
        'Project Discussion - ConnectX',
        'MEET_LINK',
        meetUrl,
        'ConnectX Instant Meeting'
      );

      if (saved) {
        const formatted = formatMessageObj(saved);
        setMessages((prev) => {
          if (prev.some((m) => m.id === formatted.id)) return prev;
          return [...prev, formatted];
        });
        scrollToBottom();
      }
      showToast('Meeting link sent!');
    } catch (err) {
      showToast('Failed to send meeting link: ' + err.message);
    }
  };

  // Append emoji to message input and keep focus
  const handleEmojiSelect = (emoji) => {
    setMessageInput((prev) => prev + emoji);
    messageInputRef.current?.focus();
  };

  // Real Image Attachment Handler (Compress & Send)
  const handleImageFilePicked = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeContact?.partnerId) return;
    if (file.size > 20 * 1024 * 1024) {
      showToast('Image must be less than 20MB', 'error');
      return;
    }

    try {
      showToast('Preparing photo...', 'loading');
      setShowAttachMenu(false);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = new Image();
        img.onload = async () => {
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

          // Optimistic update
          const tempId = 'temp-' + Date.now();
          const optimistic = {
            id: tempId,
            sender: 'me',
            senderId: user?.id,
            recipientId: activeContact.partnerId,
            text: file.name,
            mediaUrl: compressedDataUrl,
            mediaName: file.name,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'image',
            status: 'sent',
          };
          setMessages((prev) => [...prev, optimistic]);
          scrollToBottom();

          // Send via WebSocket first
          let sent = false;
          if (chatSocket.isConnected) {
            sent = chatSocket.sendChatMessage({
              recipientId: activeContact.partnerId,
              content: file.name,
              messageType: 'IMAGE',
              mediaUrl: compressedDataUrl,
              mediaName: file.name,
            });
          }

          // Fallback to REST API if WebSocket offline
          if (!sent) {
            const saved = await messageService.sendMessage(
              activeContact.partnerId,
              file.name,
              'IMAGE',
              compressedDataUrl,
              file.name
            );
            if (saved) {
              const formatted = formatMessageObj(saved);
              setMessages((prev) => {
                const filtered = prev.filter((m) => m.id !== tempId && m.id !== formatted.id);
                return [...filtered, formatted];
              });
              scrollToBottom();
            }
          }

          showToast('Photo sent successfully!', 'success');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error sending photo:', err);
      showToast('Failed to send photo: ' + err.message, 'error');
    } finally {
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  // Real Document / File Attachment Handler
  const handleDocFilePicked = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeContact?.partnerId) return;
    if (file.size > 25 * 1024 * 1024) {
      showToast('File must be less than 25MB', 'error');
      return;
    }

    try {
      showToast(`Uploading ${file.name}...`, 'loading');
      setShowAttachMenu(false);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileDataUrl = event.target.result;
        const fileSizeStr =
          file.size < 1024 * 1024
            ? (file.size / 1024).toFixed(1) + ' KB'
            : (file.size / (1024 * 1024)).toFixed(1) + ' MB';
        const displayCaption = `${file.name} (${fileSizeStr})`;

        // Optimistic update
        const tempId = 'temp-' + Date.now();
        const optimistic = {
          id: tempId,
          sender: 'me',
          senderId: user?.id,
          recipientId: activeContact.partnerId,
          text: displayCaption,
          mediaUrl: fileDataUrl,
          mediaName: file.name,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'file',
          status: 'sent',
        };
        setMessages((prev) => [...prev, optimistic]);
        scrollToBottom();

        // Send via WebSocket
        let sent = false;
        if (chatSocket.isConnected) {
          sent = chatSocket.sendChatMessage({
            recipientId: activeContact.partnerId,
            content: displayCaption,
            messageType: 'FILE',
            mediaUrl: fileDataUrl,
            mediaName: file.name,
          });
        }

        // Fallback to REST API
        if (!sent) {
          const saved = await messageService.sendMessage(
            activeContact.partnerId,
            displayCaption,
            'FILE',
            fileDataUrl,
            file.name
          );
          if (saved) {
            const formatted = formatMessageObj(saved);
            setMessages((prev) => {
              const filtered = prev.filter((m) => m.id !== tempId && m.id !== formatted.id);
              return [...filtered, formatted];
            });
            scrollToBottom();
          }
        }

        showToast(`Document "${file.name}" sent!`, 'success');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error sending document:', err);
      showToast('Failed to send document: ' + err.message, 'error');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    showToast('Meeting link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Load Friends to start a new chat
  const handleOpenNewChatModal = async () => {
    setShowNewChatModal(true);
    setIsLoadingFriends(true);
    try {
      const friends = await messageService.getFriendsToChat();
      setFriendsList(friends || []);
    } catch (err) {
      console.error('Failed to load friends:', err);
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const handleSelectFriendToChat = (friend) => {
    setShowNewChatModal(false);
    // Check if friend is already in conversations list
    const existing = conversations.find((c) => c.partnerId === friend.id);
    if (existing) {
      setSelectedContactId(existing.id);
    } else {
      // Add friend to conversations and select
      const newConv = {
        id: friend.id,
        partnerId: friend.id,
        name: friend.displayName || friend.username,
        handle: `@${friend.username}`,
        avatar: friend.avatarUrl || '/images/boy_1.jpg',
        lastMessage: 'Start a conversation',
        time: 'Just now',
        unread: 0,
        unreadColor: 'bg-purple-600',
        online: false,
        isGroup: false,
        isFriend: true,
      };
      setConversations((prev) => [newConv, ...prev]);
      setSelectedContactId(friend.id);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (activeFilter === 'Online') return c.online;
    if (activeFilter === 'Unread') return c.unread > 0;
    if (activeFilter === 'Favorites') return c.isFriend;
    if (activeFilter === 'Groups') return c.isGroup;
    if (searchQuery) return c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.handle.toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  });

  const unreadTotal = conversations.reduce((acc, c) => acc + (c.unread || 0), 0);
  const onlineTotal = conversations.filter((c) => c.online).length;

  return (
    <div className={`h-screen w-full flex overflow-hidden transition-colors ${
      isDark ? 'bg-[#06080F] text-slate-100' : 'bg-[#F2F5FB] text-slate-900'
    }`}>
      {/* ================= 1. LEFT COLUMN: Conversations List (Draggable / Resizable Message Bar) ================= */}
      <div
        style={{ width: `${messageBarWidth}px` }}
        className={`shrink-0 border-r flex flex-col transition-colors relative select-none ${
          isDark ? 'border-white/[0.08] bg-[#070913]' : 'border-slate-200 bg-white shadow-xs'
        }`}
      >
        {/* Header: Title "Messages" + Plus Button */}
        <div className="p-4 flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <h2 className={`text-xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              Messages
            </h2>
            <span
              onMouseDown={startDragging}
              onTouchStart={startDragging}
              className={`text-[10px] px-1.5 py-0.5 rounded cursor-col-resize font-semibold transition-opacity select-none ${
                isDark ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-slate-100 text-black hover:bg-slate-200'
              }`}
              title="Drag here or on the divider to resize"
            >
              ↔ drag
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => loadConversations(selectedContactId)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-black hover:bg-slate-100'
              }`}
              title="Refresh messages"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingConversations ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleOpenNewChatModal}
              className={`w-8 h-8 rounded-full ${theme.btn} flex items-center justify-center text-white transition-transform active:scale-95 cursor-pointer shadow-md`}
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className={`w-full pl-10 pr-4 py-2 rounded-full text-xs border focus:outline-none transition-all ${
                isDark
                  ? `bg-[#0E1122] border-white/[0.08] text-white placeholder-slate-400 ${theme.ring}`
                  : `bg-slate-100 border-slate-200 text-black font-medium placeholder-slate-600 ${theme.ring}`
              }`}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 pb-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['All', 'Online', 'Unread', 'Favorites'].map((filterName) => {
            const isActive = activeFilter === filterName;
            return (
              <button
                key={filterName}
                onClick={() => setActiveFilter(filterName)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? theme.activeTab
                    : isDark
                    ? 'bg-[#0E1122] text-slate-300 hover:text-white border border-white/[0.06]'
                    : 'bg-slate-100 text-black font-bold hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{filterName}</span>
                {filterName === 'Online' && onlineTotal > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {onlineTotal}
                  </span>
                )}
                {filterName === 'Unread' && unreadTotal > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : `${theme.btnSolid} text-white`
                  }`}>
                    {unreadTotal}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
          {isLoadingConversations ? (
            <div className="flex flex-col items-center justify-center p-8 gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              <p className="text-xs">Loading conversations...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-6 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {searchQuery ? 'No matching conversations' : 'No conversations yet'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                  {searchQuery ? 'Try a different search query' : 'Start chatting in real-time with your friends!'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenNewChatModal}
                className={`mt-1 px-4 py-2 rounded-full text-xs font-bold ${theme.btn} text-white shadow-md transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Start New Chat</span>
              </button>
            </div>
          ) : (
            filteredConversations.map((contact) => {
              const isSelected = selectedContactId === contact.id;

              return (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContactId(contact.id)}
                  className={`px-4 py-3 flex items-center gap-3 transition-all cursor-pointer relative ${
                    isSelected
                      ? isDark
                        ? theme.activeChat
                        : `bg-slate-100/90 border-l-4 ${theme.border}`
                      : isDark
                      ? 'hover:bg-white/[0.03]'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Active glow top highlight */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  )}

                  {/* Avatar with Real Online Status Dot */}
                  <div className="relative shrink-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className={`w-11 h-11 rounded-full object-cover border ${theme.borderLight}`}
                      onError={(e) => {
                        e.target.src = '/images/boy_1.jpg';
                      }}
                    />
                    {contact.online && (
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ${
                        isDark ? 'ring-[#070913]' : 'ring-white'
                      }`} />
                    )}
                  </div>

                  {/* Info & Snippet */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h4 className={`text-sm font-bold truncate ${
                          isSelected
                            ? isDark ? 'text-white' : `${theme.text} font-extrabold`
                            : isDark ? 'text-slate-200' : 'text-black font-extrabold'
                        }`}>
                          {contact.name}
                        </h4>
                        {contact.isGroup && (
                          <span className={`px-2 py-0.5 rounded-md ${theme.badge} text-[10px] font-bold`}>
                            Group
                          </span>
                        )}
                      </div>
                      <span className={`text-xs shrink-0 ${
                        isSelected
                          ? isDark ? `${theme.text} font-medium` : `${theme.text} font-bold`
                          : isDark ? 'text-slate-400' : 'text-black font-semibold'
                      }`}>
                        {contact.time}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs truncate ${
                        isSelected
                          ? isDark ? 'text-slate-300' : 'text-black font-medium'
                          : isDark ? 'text-slate-400' : 'text-black font-medium'
                      }`}>
                        {contact.isTyping ? (
                          <span className="text-purple-400 font-semibold italic flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block animate-ping" />
                            typing...
                          </span>
                        ) : contact.hasImage ? (
                          <span className="flex items-center gap-1">
                            <span>📷</span>
                            <span>{contact.lastMessage}</span>
                          </span>
                        ) : (
                          contact.lastMessage
                        )}
                      </p>

                      {contact.unread > 0 && (
                        <span className={`w-4.5 h-4.5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-sm ${
                          contact.unreadColor || 'bg-purple-600'
                        }`}>
                          {contact.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Draggable Divider Splitter Handle for Message Bar */}
      <div
        onMouseDown={startDragging}
        onTouchStart={startDragging}
        className={`w-2.5 -ml-1.5 z-30 cursor-col-resize flex items-center justify-center group select-none transition-colors shrink-0 ${
          isDragging ? 'bg-purple-600/30' : 'hover:bg-purple-500/20'
        }`}
        title="Click and drag to resize message bar"
      >
        <div className={`w-1 rounded-full transition-all ${
          isDragging
            ? 'h-20 bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.9)]'
            : isDark
            ? 'h-8 bg-white/20 group-hover:h-14 group-hover:bg-purple-400'
            : 'h-8 bg-slate-400 group-hover:h-14 group-hover:bg-blue-600'
        }`} />
      </div>

      {/* ================= 2. RIGHT COLUMN: Active Chat Area ================= */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {activeContact ? (
          <>
            {/* Chat Room Header matching Image 1 */}
            <div className={`px-5 py-3 border-b flex items-center justify-between gap-4 z-20 transition-colors ${
              isDark ? 'border-white/[0.08] bg-[#070913]/90' : 'border-slate-200 bg-white shadow-xs'
            }`}>
              {/* User info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={activeContact.avatar}
                    alt={activeContact.name}
                    className="w-10 h-10 rounded-full object-cover border border-purple-400/40"
                    onError={(e) => {
                      e.target.src = '/images/boy_1.jpg';
                    }}
                  />
                  {activeContact.online && (
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ${
                      isDark ? 'ring-[#070913]' : 'ring-white'
                    }`} />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold truncate ${
                      isDark ? 'text-white' : 'text-black font-extrabold'
                    }`}>
                      {activeContact.name}
                    </h3>
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-black font-semibold'}`}>
                      {activeContact.handle}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${
                      activeContact.online
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                        : 'bg-slate-400'
                    }`} />
                    {isPartnerTyping ? (
                      <span className="text-[11px] text-purple-400 font-bold italic flex items-center gap-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping inline-block" />
                        <span>typing...</span>
                      </span>
                    ) : (
                      <span className={`text-[11px] font-medium ${
                        activeContact.online
                          ? isDark ? 'text-emerald-400 font-semibold' : 'text-emerald-600 font-bold'
                          : isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {activeContact.online ? 'Online' : formatLastSeen(activeContact.lastSeen)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action icons row matching Image 1 */}
              <div className="flex items-center gap-2 shrink-0 relative">
                <button
                  onClick={() => showToast(`Starting audio call with ${activeContact.name}...`)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isDark ? 'text-slate-300 hover:text-white hover:bg-white/[0.08]' : 'text-black hover:text-black hover:bg-slate-100'
                  }`}
                  title="Audio Call"
                >
                  <Phone className="w-4 h-4" />
                </button>

                <button
                  onClick={handleSendMeetingLink}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isDark ? 'text-slate-300 hover:text-white hover:bg-white/[0.08]' : 'text-black hover:text-black hover:bg-slate-100'
                  }`}
                  title="Create & Send Video Meeting"
                >
                  <Video className="w-4 h-4" />
                </button>

                <button
                  onClick={() => showToast('Search inside conversation')}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isDark ? 'text-slate-300 hover:text-white hover:bg-white/[0.08]' : 'text-black hover:text-black hover:bg-slate-100'
                  }`}
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* 3-dots with dropdown menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      showOptionsDropdown
                        ? 'bg-purple-600/20 text-purple-400'
                        : isDark ? 'text-slate-300 hover:text-white hover:bg-white/[0.08]' : 'text-black hover:text-black hover:bg-slate-100'
                    }`}
                    title="Options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {showOptionsDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowOptionsDropdown(false)}
                      />
                      <div className={`absolute right-0 top-full mt-2 w-56 rounded-2xl p-2 border shadow-2xl z-50 text-xs backdrop-blur-xl animate-in fade-in slide-in-from-top-2 ${
                        isDark
                          ? 'bg-[#0E1229]/95 border-white/10 text-slate-200'
                          : 'bg-white border-slate-200 text-black shadow-2xl'
                      }`}>
                        <button
                          onClick={() => {
                            showToast(`Viewing profile of ${activeContact.name}`);
                            setShowOptionsDropdown(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                            isDark ? 'hover:bg-white/[0.06] text-slate-300' : 'hover:bg-slate-100 text-black font-semibold'
                          }`}
                        >
                          <User className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-black'}`} />
                          <span>View Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsStarred(!isStarred);
                            showToast(isStarred ? 'Unstarred conversation' : 'Starred conversation');
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                            isDark ? 'hover:bg-white/[0.06] text-slate-300' : 'hover:bg-slate-100 text-black font-semibold'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-400' : isDark ? 'text-slate-400' : 'text-black'}`} />
                          <span>Star Conversation</span>
                        </button>

                        {/* Mute Notifications with Toggle */}
                        <div
                          onClick={() => setIsMuted(!isMuted)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                            isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <BellOff className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-black'}`} />
                            <span className={isDark ? 'text-slate-300' : 'text-black font-semibold'}>Mute Notifications</span>
                          </div>
                          <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${
                            isMuted ? 'bg-purple-600' : isDark ? 'bg-slate-700' : 'bg-slate-300'
                          }`}>
                            <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                              isMuted ? 'translate-x-4' : 'translate-x-0'
                            }`} />
                          </div>
                        </div>

                        <div className={`my-1 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`} />

                        <button
                          onClick={() => {
                            showToast(`Blocked ${activeContact.name}`);
                            setShowOptionsDropdown(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer font-semibold"
                        >
                          <Ban className="w-3.5 h-3.5 text-rose-500" />
                          <span>Block User</span>
                        </button>

                        <button
                          onClick={() => {
                            showToast(`Reported ${activeContact.name}`);
                            setShowOptionsDropdown(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer font-semibold"
                        >
                          <Flag className="w-3.5 h-3.5 text-rose-500" />
                          <span>Report User</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedContactId(null)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isDark ? 'text-slate-300 hover:text-white hover:bg-white/[0.08]' : 'text-black hover:text-black hover:bg-slate-100'
                  }`}
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Stream */}
            <div className={`flex-1 overflow-y-auto p-4 sm:p-6 ${chatStreamSpacingClass} relative ${
              isDark ? 'bg-[#06080F]/90' : 'bg-[#F4F6FB]'
            }`}>
              {/* Subtle doodle pattern overlay in dark mode */}
              {isDark && (
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none bg-repeat"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
              )}

              {/* Today Date Pill */}
              <div className="flex justify-center my-3">
                <span className={`px-4 py-1 rounded-full text-xs font-bold shadow-xs ${
                  isDark ? 'bg-[#0E1225] text-slate-400 border border-white/5' : 'bg-white text-black border border-slate-300 shadow-xs'
                }`}>
                  Live Chat Stream
                </span>
              </div>

              {/* Loading Indicator */}
              {isLoadingMessages ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 gap-2">
                  <Sparkles className="w-8 h-8 text-purple-400 mb-1" />
                  <p className="text-sm font-bold text-slate-300">Start the conversation!</p>
                  <p className="text-xs max-w-xs">Send your first message to {activeContact.name}. Real-time WebSocket messaging is active.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender === 'me';

                  // Google Meet Link Card
                  if (msg.type === 'meet_link') {
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-2xl max-w-sm border shadow-lg ${
                          isDark
                            ? 'bg-[#0E1328] border-white/10 text-white'
                            : 'bg-white border-slate-200 text-black shadow-md'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-blue-500 p-0.5 flex items-center justify-center shrink-0">
                              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                                isDark ? 'bg-[#0E1328]' : 'bg-white'
                              }`}>
                                <Video className="w-5 h-5 text-emerald-500" />
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className={`text-sm font-extrabold truncate ${isDark ? 'text-white' : 'text-black'}`}>
                                {msg.text || 'Project Discussion - ConnectX'}
                              </h4>
                              <a
                                href={msg.mediaUrl ? (msg.mediaUrl.startsWith('http') ? msg.mediaUrl : `https://${msg.mediaUrl}`) : '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-500 hover:underline truncate mt-0.5 font-medium flex items-center gap-1"
                              >
                                <span>{msg.mediaUrl || 'meet.google.com'}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>

                            <button
                              onClick={() => handleCopyLink(msg.mediaUrl || msg.text)}
                              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-black hover:bg-slate-100'
                              }`}
                              title="Copy Link"
                            >
                              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>

                          <div className="flex justify-end mt-1.5 gap-1.5 items-center">
                            <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-black font-semibold'}`}>{msg.time}</span>
                            {isMe && (
                              msg.status === 'read' ? (
                                <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                              ) : msg.status === 'delivered' ? (
                                <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-slate-400" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Photo / Image Message
                  if (msg.type === 'image' && msg.mediaUrl) {
                    return (
                      <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && (
                          <img
                            src={activeContact.avatar}
                            alt={activeContact.name}
                            className="w-8 h-8 rounded-full object-cover border border-purple-400/40 shrink-0 mb-1"
                            onError={(e) => {
                              e.target.src = '/images/boy_1.jpg';
                            }}
                          />
                        )}
                        <div className={`max-w-[75%] sm:max-w-md rounded-2xl overflow-hidden p-1 shadow-md group relative ${
                          isMe
                            ? `${theme.chatBubble} rounded-br-xs`
                            : isDark
                            ? 'bg-[#0E1328] border border-white/[0.08] rounded-bl-xs'
                            : 'bg-white border border-slate-200 rounded-bl-xs shadow-xs'
                        }`}>
                          <div
                            className="relative overflow-hidden rounded-xl cursor-pointer"
                            onClick={() => setLightboxImage(msg.mediaUrl)}
                          >
                            <img
                              src={msg.mediaUrl}
                              alt="Attachment"
                              className="max-h-72 w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <span className="px-3 py-1.5 rounded-xl bg-black/70 text-white text-xs font-semibold backdrop-blur-md">
                                Click to enlarge
                              </span>
                              <a
                                href={msg.mediaUrl}
                                download={msg.mediaName || 'connectx_image.jpg'}
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 rounded-xl bg-black/70 text-white hover:text-emerald-400 transition-colors backdrop-blur-md"
                                title="Download Image"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                          {msg.text && msg.text !== msg.mediaName && (
                            <p className="px-3 pt-2 text-xs font-medium text-white">{msg.text}</p>
                          )}
                          <div className="px-3 py-1 flex items-center justify-end gap-1.5 text-[10px] text-white/70">
                            <span>{msg.time}</span>
                            {isMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Document / File Message
                  if (msg.type === 'file' && msg.mediaUrl) {
                    return (
                      <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && (
                          <img
                            src={activeContact.avatar}
                            alt={activeContact.name}
                            className="w-8 h-8 rounded-full object-cover border border-purple-400/40 shrink-0 mb-1"
                            onError={(e) => {
                              e.target.src = '/images/boy_1.jpg';
                            }}
                          />
                        )}
                        <div className={`max-w-[80%] sm:max-w-md rounded-2xl p-3.5 shadow-md ${
                          isMe
                            ? `${theme.chatBubble} text-white rounded-br-xs`
                            : isDark
                            ? 'bg-[#0E1328] border border-white/[0.08] text-white rounded-bl-xs'
                            : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs shadow-xs'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-bold truncate leading-tight">
                                {msg.mediaName || msg.text || 'Document'}
                              </h5>
                              <p className="text-[10px] text-slate-300 mt-0.5 truncate">
                                {msg.text && msg.text !== msg.mediaName ? msg.text : 'Click download to view file'}
                              </p>
                            </div>
                            <a
                              href={msg.mediaUrl}
                              download={msg.mediaName || 'document'}
                              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-emerald-300 hover:text-white shrink-0 cursor-pointer shadow-xs"
                              title="Download File"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                          <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] text-white/70">
                            <span>{msg.time}</span>
                            {isMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Contact avatar on incoming messages */}
                      {!isMe && (
                        <img
                          src={activeContact.avatar}
                          alt={activeContact.name}
                          className="w-8 h-8 rounded-full object-cover border border-purple-400/40 shrink-0 mb-1"
                          onError={(e) => {
                            e.target.src = '/images/boy_1.jpg';
                          }}
                        />
                      )}

                      <div className={`max-w-[75%] sm:max-w-md rounded-2xl ${bubblePaddingClass} ${fontSizeClass} shadow-md ${
                        isMe
                          ? `${theme.chatBubble} text-white rounded-br-xs font-medium`
                          : isDark
                          ? 'bg-[#0E1328] border border-white/[0.08] text-slate-100 rounded-bl-xs'
                          : 'bg-white border border-slate-200 text-black font-medium rounded-bl-xs shadow-xs'
                      }`}>
                        <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                        <div className={`flex items-center justify-end gap-1.5 mt-1 text-[11px] ${
                          isMe ? 'text-purple-200' : isDark ? 'text-slate-400' : 'text-black font-semibold'
                        }`}>
                          <span>{msg.time}</span>
                          {isMe && (
                            msg.status === 'read' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-emerald-300" title="Read" />
                            ) : msg.status === 'delivered' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-slate-300" title="Delivered" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-purple-200" title="Sent" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Partner Typing Bubble */}
              {isPartnerTyping && (
                <div className="flex items-end gap-2 justify-start animate-in fade-in slide-in-from-bottom-1 duration-200">
                  <img
                    src={activeContact.avatar}
                    alt={activeContact.name}
                    className="w-7 h-7 rounded-full object-cover border border-purple-400/40 shrink-0"
                    onError={(e) => {
                      e.target.src = '/images/boy_1.jpg';
                    }}
                  />
                  <div className={`px-4 py-2.5 rounded-2xl rounded-bl-xs flex items-center gap-1.5 ${
                    isDark ? 'bg-[#0E1328] border border-purple-500/20' : 'bg-white border border-purple-200'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[11px] text-purple-400 font-medium ml-1.5">{activeContact.name} is typing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className={`p-3 sm:p-4 border-t z-20 transition-colors ${
              isDark ? 'border-white/[0.08] bg-[#070913]' : 'border-slate-200 bg-white shadow-xs'
            }`}>
              <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                {/* Hidden File Inputs */}
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  onChange={handleImageFilePicked}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="*/*"
                  onChange={handleDocFilePicked}
                  className="hidden"
                />

                {/* Left Utility Buttons: + , Emoji , Paperclip */}
                <div className="relative" ref={attachMenuRef}>
                  <button
                    id="attach-toggle-btn"
                    type="button"
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                      isDark ? 'bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/10' : 'bg-slate-100 text-black hover:bg-slate-200'
                    }`}
                    title="Attach"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Attach Dropdown Menu */}
                  {showAttachMenu && (
                    <div className={`absolute left-0 bottom-full mb-2 w-52 rounded-2xl p-2 border shadow-2xl z-50 text-xs backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 ${
                      isDark ? 'bg-[#0E1229] border-white/10 text-slate-200' : 'bg-white border-slate-200 text-black shadow-2xl'
                    }`}>
                      <button
                        type="button"
                        onClick={() => {
                          imageInputRef.current?.click();
                          setShowAttachMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                          isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100 text-black font-semibold'
                        }`}
                      >
                        <Camera className="w-4 h-4 text-blue-500" />
                        <span>Send Photo / Image</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          fileInputRef.current?.click();
                          setShowAttachMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                          isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100 text-black font-semibold'
                        }`}
                      >
                        <FileText className="w-4 h-4 text-purple-500" />
                        <span>Send Document / File</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSendMeetingLink}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                          isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100 text-black font-semibold'
                        }`}
                      >
                        <Video className="w-4 h-4 text-emerald-500" />
                        <span>Instant Video Meet</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Emoji Picker Popover Container */}
                <div className="relative">
                  <button
                    id="emoji-toggle-btn"
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                      showEmojiPicker
                        ? 'bg-purple-500/20 text-purple-400'
                        : isDark
                        ? 'text-slate-400 hover:text-white'
                        : 'text-black hover:bg-slate-100'
                    }`}
                    title="Choose Emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  {/* Interactive Glassmorphic Emoji Picker */}
                  {showEmojiPicker && (
                    <div
                      ref={emojiPickerRef}
                      className={`absolute left-0 bottom-full mb-3 w-80 sm:w-96 rounded-3xl p-3.5 border shadow-2xl z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-3 ${
                        isDark
                          ? 'bg-[#0B0F22]/95 border-white/15 text-white shadow-[0_20px_60px_rgba(0,0,0,0.85)]'
                          : 'bg-white/95 border-slate-200 text-slate-900 shadow-2xl'
                      }`}
                    >
                      {/* Search & Header */}
                      <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-white/10">
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl flex-1 ${
                            isDark
                              ? 'bg-white/5 border border-white/10 text-white'
                              : 'bg-slate-100 border border-slate-200 text-slate-900'
                          }`}
                        >
                          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <input
                            type="text"
                            value={emojiSearch}
                            onChange={(e) => setEmojiSearch(e.target.value)}
                            placeholder="Search emojis..."
                            className="w-full bg-transparent text-xs outline-none placeholder-slate-400"
                            autoFocus
                          />
                          {emojiSearch && (
                            <button
                              type="button"
                              onClick={() => setEmojiSearch('')}
                              className="text-slate-400 hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(false)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Category Tabs */}
                      {!emojiSearch && (
                        <div className="flex items-center gap-1 mb-2.5 px-0.5 overflow-x-auto no-scrollbar">
                          {Object.entries(EMOJI_CATEGORIES).map(([key, cat]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setActiveEmojiCategory(key)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                                activeEmojiCategory === key
                                  ? `${theme.btn} text-white shadow-xs`
                                  : isDark
                                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                                  : 'text-slate-600 hover:text-black hover:bg-slate-100'
                              }`}
                            >
                              <span>{cat.icon}</span>
                              <span>{cat.name}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Emoji Grid */}
                      <div className="grid grid-cols-8 gap-1 max-h-52 overflow-y-auto p-1 text-xl select-none no-scrollbar">
                        {(emojiSearch
                          ? Object.values(EMOJI_CATEGORIES)
                              .flatMap((c) => c.emojis)
                              .filter((em) => em.includes(emojiSearch))
                          : EMOJI_CATEGORIES[activeEmojiCategory]?.emojis || []
                        ).map((emoji, idx) => (
                          <button
                            key={`${emoji}-${idx}`}
                            type="button"
                            onClick={() => handleEmojiSelect(emoji)}
                            className="p-1.5 rounded-xl hover:scale-125 hover:bg-white/10 transition-all cursor-pointer text-center leading-none active:scale-95"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Paperclip Button for direct File/Document Upload */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-black hover:bg-slate-100'
                  }`}
                  title="Upload Document / File"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Message Input */}
                <input
                  ref={messageInputRef}
                  type="text"
                  value={messageInput}
                  onChange={handleInputChange}
                  placeholder={`Message ${activeContact.name}...`}
                  className={`flex-1 px-4 py-2.5 rounded-full text-xs border focus:outline-none transition-all ${
                    isDark
                      ? `bg-[#0E1122] border-white/[0.08] text-white placeholder-slate-400 ${theme.ring}`
                      : `bg-slate-100 border-slate-200 text-black font-medium placeholder-slate-600 ${theme.ring}`
                  }`}
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className={`w-9 h-9 rounded-full ${theme.btn} text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md`}
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Empty / No Chat Selected State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 shadow-xl">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className={`text-lg font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Your Real-Time Messages
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6 leading-relaxed">
              Select a conversation from the left sidebar or start a new chat with one of your friends to experience instant WebSocket communication.
            </p>
            <button
              onClick={handleOpenNewChatModal}
              className={`px-5 py-2.5 rounded-full text-xs font-bold ${theme.btn} text-white shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2`}
            >
              <Users className="w-4 h-4" />
              <span>Start New Chat</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= 3. NEW CHAT / SELECT FRIEND MODAL ================= */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl transition-all ${
            isDark ? 'bg-[#0C0F22] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold">Start a Conversation</h3>
                  <p className="text-[11px] text-slate-400">Select a friend to begin chatting</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Filter */}
            <div className="py-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={friendsSearchQuery}
                  onChange={(e) => setFriendsSearchQuery(e.target.value)}
                  placeholder="Search your friends by name..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border focus:outline-none transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-slate-400 focus:border-purple-500'
                      : 'bg-slate-100 border-slate-200 text-black placeholder-slate-500 focus:border-purple-500'
                  }`}
                />
              </div>
            </div>

            {/* Friends list */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {isLoadingFriends ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                  <span className="text-xs">Finding your friends...</span>
                </div>
              ) : friendsList.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <p className="text-xs font-semibold">No friends found yet</p>
                  <p className="text-[11px] mt-1 text-slate-500">Add friends via Find People or Friend Requests to start chatting!</p>
                </div>
              ) : (
                friendsList
                  .filter((f) =>
                    !friendsSearchQuery ||
                    (f.displayName || f.username || '').toLowerCase().includes(friendsSearchQuery.toLowerCase())
                  )
                  .map((friend) => (
                    <div
                      key={friend.id}
                      onClick={() => handleSelectFriendToChat(friend)}
                      className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isDark ? 'hover:bg-white/5 border border-white/5' : 'hover:bg-slate-100 border border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={friend.avatarUrl || '/images/boy_1.jpg'}
                          alt={friend.displayName || friend.username}
                          className="w-10 h-10 rounded-full object-cover border border-purple-400/30"
                          onError={(e) => {
                            e.target.src = '/images/boy_1.jpg';
                          }}
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold truncate">
                            {friend.displayName || friend.username}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">@{friend.username}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded-full text-xs font-bold ${theme.btn} text-white shadow-sm flex items-center gap-1 shrink-0`}
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Chat</span>
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Image Viewer */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img
              src={lightboxImage}
              alt="Enlarged preview"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            <div className="flex items-center gap-3 mt-4">
              <a
                href={lightboxImage}
                download="connectx_image.jpg"
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Image</span>
              </a>
              <button
                onClick={() => setLightboxImage(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
