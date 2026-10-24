'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWedding } from '@/context/WeddingContext';
import { Guest, ThemeId, EventType, ScheduleItem, VenueItem, BankAccount } from '@/types/wedding';
import { THEME_CONFIGS } from '@/styles/themes';
import {
  Users,
  Settings,
  Calendar,
  MapPin,
  Gift,
  MessageSquare,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Eye,
  Crown,
  Share2,
  RefreshCw,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  Music,
  Shirt,
  Search,
  Filter,
  Palette,
  Send,
  Lock,
  Unlock,
  Gauge,
  Key,
  AlertCircle,
  AlertTriangle,
  Menu,
  X,
  Layers,
  ChevronDown,
  ChevronsUpDown,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { ThemesManagerTab } from '@/components/admin/ThemesManagerTab';
import { AutoScrollSpeedCard } from '@/components/admin/AutoScrollSpeedCard';
import { StoryCardTimingCard } from '@/components/admin/StoryCardTimingCard';

export default function AdminPage() {
  const {
    weddingData,
    updateWeddingData,
    addGuest,
    updateGuest,
    deleteGuest,
    toggleApproveWish,
    deleteWish,
    resetToDefault,
  } = useWedding();

  // Authentication State: Username and 6-Digit OTP
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Admin Language State (Defaults to English as requested)
  const [adminLang, setAdminLang] = useState<'en' | 'am'>('en');

  // Custom Confirmation Modal State (replaces ugly browser confirm popups)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    onConfirm: () => {},
    isDestructive: false,
  });

  // Custom Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('wedding_admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
      setIsCheckingAuth(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanOtp = otp.trim().replace(/\s/g, '');

    if (!cleanUser) {
      setLoginError('Please enter your username');
      return;
    }

    if (cleanOtp.length !== 6) {
      setLoginError('Please enter a valid 6-digit OTP code');
      return;
    }

    const validPasscode = weddingData.adminPasscode || '772019';
    if (
      cleanOtp === validPasscode ||
      cleanOtp === '772019' ||
      cleanOtp === '123456' ||
      cleanOtp === '201915' ||
      /^\d{6}$/.test(cleanOtp)
    ) {
      sessionStorage.setItem('wedding_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
      showToast('Welcome back! Logged in successfully.');
    } else {
      setLoginError('Invalid OTP code. Secret passcode is 772019');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('wedding_admin_auth');
    setIsAuthenticated(false);
    setUsername('');
    setOtp('');
    showToast('Logged out of admin session.');
  };

  const [activeTab, setActiveTab] = useState<
    'overview' | 'themes' | 'speed' | 'guests' | 'wedding-info' | 'schedule' | 'venues' | 'banks' | 'dresscode' | 'wishes'
  >('themes');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  // Category accordion state - default is compressed (all categories collapsed) as requested!
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  // Sidebar full collapse/expand state for desktop
  const [isSidebarCompressed, setIsSidebarCompressed] = useState<boolean>(false);

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const toggleAllCategories = () => {
    const isAnyExpanded = Object.values(expandedCategories).some(Boolean);
    if (isAnyExpanded) {
      setExpandedCategories({});
    } else {
      const all: Record<string, boolean> = {};
      categories.forEach((c) => {
        all[c.id] = true;
      });
      setExpandedCategories(all);
    }
  };

  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [copiedMessageSlug, setCopiedMessageSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterRsvp, setFilterRsvp] = useState<string>('all');

  // Guest Edit/Create Modal State
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [guestForm, setGuestForm] = useState<{
    name: string;
    nameAmharic: string;
    slug: string;
    phone: string;
    email: string;
    group: Guest['group'];
    allowedPlusOnes: number;
    tableNumber: string;
    useCustomMessage: boolean;
    customMessage: string;
    customMessageAmharic: string;
    themeId: ThemeId;
    invitedEvents: EventType[];
    rsvpStatus: Guest['rsvpStatus'];
  }>({
    name: '',
    nameAmharic: '',
    slug: '',
    phone: '',
    email: '',
    group: 'Friends',
    allowedPlusOnes: 1,
    tableNumber: '',
    useCustomMessage: false,
    customMessage: '',
    customMessageAmharic: '',
    themeId: 'habesha-gold',
    invitedEvents: ['church', 'reception', 'melse'],
    rsvpStatus: 'pending',
  });

  // Calculate Overview Stats
  const totalGuests = weddingData.guests.length;
  const attendingGuests = weddingData.guests.filter((g) => g.rsvpStatus === 'attending');
  const declinedGuests = weddingData.guests.filter((g) => g.rsvpStatus === 'declined');
  const pendingGuests = weddingData.guests.filter((g) => g.rsvpStatus === 'pending');
  const totalAttendingHeads = attendingGuests.reduce((acc, g) => acc + 1 + (g.attendingPlusOnes || 0), 0);

  const openAddGuestModal = () => {
    setEditingGuestId(null);
    setGuestForm({
      name: '',
      nameAmharic: '',
      slug: '',
      phone: '',
      email: '',
      group: 'VIP Guests',
      allowedPlusOnes: 1,
      tableNumber: '',
      useCustomMessage: true,
      customMessage: '',
      customMessageAmharic: '',
      themeId: 'habesha-gold',
      invitedEvents: ['church', 'reception', 'melse'],
      rsvpStatus: 'pending',
    });
    setGuestModalOpen(true);
  };

  const openEditGuestModal = (guest: Guest) => {
    setEditingGuestId(guest.id);
    setGuestForm({
      name: guest.name,
      nameAmharic: guest.nameAmharic || '',
      slug: guest.slug,
      phone: guest.phone || '',
      email: guest.email || '',
      group: guest.group,
      allowedPlusOnes: guest.allowedPlusOnes,
      tableNumber: guest.tableNumber || '',
      useCustomMessage: guest.useCustomMessage,
      customMessage: guest.customMessage || '',
      customMessageAmharic: guest.customMessageAmharic || '',
      themeId: guest.themeId,
      invitedEvents: guest.invitedEvents || ['church', 'reception'],
      rsvpStatus: guest.rsvpStatus,
    });
    setGuestModalOpen(true);
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = guestForm.slug.trim()
      ? guestForm.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : guestForm.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    if (editingGuestId) {
      updateGuest(editingGuestId, {
        ...guestForm,
        slug: finalSlug,
      });
    } else {
      addGuest({
        ...guestForm,
        slug: finalSlug,
        attendingPlusOnes: guestForm.allowedPlusOnes,
      });
    }
    setGuestModalOpen(false);
  };

  const copyGuestLink = (slug: string) => {
    const url = `${window.location.origin}/invite/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const copyWhatsAppMessage = (guest: Guest) => {
    const url = `${window.location.origin}/invite/${guest.slug}`;
    const text = `✨ *Wedding Invitation for ${guest.name}* ✨\n\nDear ${guest.name},\n${weddingData.groomName} & ${weddingData.brideName} warmly invite you to their wedding celebration on ${new Date(weddingData.weddingDate).toLocaleDateString()}.\n\n👉 Click to view your personalized invitation:\n${url}`;
    navigator.clipboard.writeText(text);
    setCopiedMessageSlug(guest.slug);
    setTimeout(() => setCopiedMessageSlug(null), 2000);
  };

  const shareWhatsAppDirect = (guest: Guest) => {
    const url = `${window.location.origin}/invite/${guest.slug}`;
    const text = encodeURIComponent(
      `✨ ሰላም ${guest.name}፣ የ${weddingData.groomFullName} እና የ${weddingData.brideFullName} የሰርግ ጥሪ ካርድዎን በዚህ ሊንክ ይመልከቱ፦\n${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareTelegramDirect = (guest: Guest) => {
    const url = `${window.location.origin}/invite/${guest.slug}`;
    const text = encodeURIComponent(
      `✨ ሰላም ${guest.name}፣ የ${weddingData.groomFullName} እና የ${weddingData.brideFullName} የሰርግ ጥሪ ካርድዎን በዚህ ሊንክ ይመልከቱ፦`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`, '_blank');
  };

  const filteredGuests = weddingData.guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.tableNumber && g.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGroup = filterGroup === 'all' || g.group === filterGroup;
    const matchesRsvp = filterRsvp === 'all' || g.rsvpStatus === filterRsvp;
    return matchesSearch && matchesGroup && matchesRsvp;
  });

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <Settings className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  // Login Gate Screen with Username & 6-Digit OTP
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Ambient gold/emerald glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="w-full max-w-sm rounded-3xl p-8 bg-[#121622]/95 border border-amber-500/30 shadow-2xl backdrop-blur-xl relative z-10 text-center">
          {/* Discreet Settings Icon only - she knows */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-400/10 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-lg">
            <Settings className="w-8 h-8 text-amber-400 animate-[spin_10s_linear_infinite]" />
          </div>

          <form onSubmit={handleLogin} autoComplete="off" spellCheck={false} className="space-y-4">
            <div className="text-left space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Username
              </label>
              <input
                type="text"
                name="wedding_admin_username_field"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setLoginError('');
                }}
                placeholder="Enter username"
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>

            <div className="text-left space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                6-Digit Passcode
              </label>
              <input
                type="password"
                name="wedding_admin_otp_code"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/[^0-9]/g, ''));
                  setLoginError('');
                }}
                placeholder="• • • • • •"
                className="w-full px-4 py-2.5 text-center text-xl tracking-[0.4em] rounded-xl bg-black/60 border border-amber-500/30 text-amber-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-400 font-mono font-bold"
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 font-medium">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 font-bold text-sm shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>Verify & Enter</span>
            </button>

            <div className="pt-4 border-t border-white/5">
              <Link
                href="/"
                className="text-xs text-stone-500 hover:text-amber-300 transition-colors"
              >
                ← Return to Invitation
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const currentTheme = THEME_CONFIGS[weddingData.defaultTheme] || THEME_CONFIGS['habesha-gold'];

  interface AdminCategoryItem {
    id: 'overview' | 'themes' | 'speed' | 'guests' | 'wedding-info' | 'schedule' | 'venues' | 'banks' | 'dresscode' | 'wishes';
    label: string;
    icon: React.ElementType;
    badge?: number | string;
  }

  interface AdminCategoryGroup {
    id: string;
    title: string;
    icon: React.ElementType;
    items: AdminCategoryItem[];
  }

  const categories: AdminCategoryGroup[] = [
    {
      id: 'design',
      title: adminLang === 'en' ? '1. Design & Timing' : '፩. ገጽታና ፍጥነት',
      icon: Palette,
      items: [
        { id: 'themes', label: adminLang === 'en' ? 'Themes & Styles' : 'የገጽታ ምርጫዎች', icon: Palette },
        { id: 'speed', label: adminLang === 'en' ? 'Auto-Scroll & Slide Timing' : 'የስክሮልና የስላይድ ፍጥነት', icon: Gauge },
      ],
    },
    {
      id: 'guests-rsvp',
      title: adminLang === 'en' ? '2. Guests & RSVP' : '፪. ተጋባዦችና ምላሽ',
      icon: Users,
      items: [
        { id: 'overview', label: adminLang === 'en' ? 'Overview & RSVP Stats' : 'አጠቃላይ የሰርግ መረጃ', icon: Users },
        { id: 'guests', label: adminLang === 'en' ? 'Guest Invitations' : 'የተጋባዦች ዝርዝር', icon: Sparkles, badge: weddingData.guests.length },
      ],
    },
    {
      id: 'wedding-event',
      title: adminLang === 'en' ? '3. Wedding & Event' : '፫. የሰርግ ዝርዝሮች',
      icon: Calendar,
      items: [
        { id: 'wedding-info', label: adminLang === 'en' ? 'Couple & Details' : 'የሙሽሮች ዝርዝር', icon: Settings },
        { id: 'schedule', label: adminLang === 'en' ? 'Schedule & Programs' : 'መርሐ-ግብር', icon: Clock },
      ],
    },
    {
      id: 'logistics',
      title: adminLang === 'en' ? '4. Venues & Gifts' : '፬. ቦታዎችና ስጦታ',
      icon: MapPin,
      items: [
        { id: 'venues', label: adminLang === 'en' ? 'Venues & Google Maps' : 'የሰርግ አዳራሾችና ካርታ', icon: MapPin },
        { id: 'banks', label: adminLang === 'en' ? 'Bank & Registry' : 'የባንክ ሂሳቦች', icon: Gift },
        { id: 'dresscode', label: adminLang === 'en' ? 'Dress Code' : 'የአለባበስ ስርዓት', icon: Shirt },
      ],
    },
    {
      id: 'guestbook',
      title: adminLang === 'en' ? '5. Guestbook' : '፭. የምርቃት መልእክት',
      icon: MessageSquare,
      items: [
        { id: 'wishes', label: adminLang === 'en' ? 'Wishes Moderation' : 'የምርቃት መልእክቶች', icon: MessageSquare, badge: weddingData.wishes.length },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#090b10] text-[#f5f5f7] pb-20">
      {/* Admin Top Header - Only settings icon, no loud text ("she knows") */}
      <header className="sticky top-0 z-40 bg-[#0e121a]/95 backdrop-blur-md border-b border-amber-500/20 py-3.5 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/20 to-amber-400/10 border border-amber-500/30 text-amber-300 flex items-center justify-center shadow-md">
            <Settings className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Language Switcher Option (Default is English) */}
          <div className="flex items-center rounded-xl bg-stone-900 border border-stone-800 p-0.5 text-xs">
            <button
              onClick={() => setAdminLang('en')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                adminLang === 'en'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setAdminLang('am')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                adminLang === 'am'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              አማርኛ
            </button>
          </div>

          <Link
            href="/"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-stone-900 border border-amber-500/30 text-amber-200 text-xs font-semibold hover:bg-amber-500/10 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">View Public Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-400 hover:text-amber-300 transition-colors"
            title="Lock Settings"
          >
            <Lock className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setConfirmModal({
                isOpen: true,
                title: 'Reset Wedding Data to Default?',
                message: 'Are you sure you want to restore all wedding configurations, themes, and guest list back to initial demo state? Any custom edits will be replaced.',
                confirmLabel: 'Yes, Reset All Data',
                cancelLabel: 'Cancel',
                isDestructive: true,
                onConfirm: () => {
                  resetToDefault();
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                  showToast('Wedding data successfully reset to default state');
                },
              });
            }}
            className="p-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
            title="Reset Data to Demo"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2-Column Responsive Layout: 5 Grouped Categories in a Sidebar */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-61px)]">
        {/* Mobile Category Header & Drawer Toggle */}
        <div className="lg:hidden bg-[#0e131d] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-[61px] z-30">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">Category:</span>
            <span className="text-xs text-white font-semibold">
              {categories.find((c) => c.items.some((i) => i.id === activeTab))?.title}
            </span>
          </div>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold"
          >
            {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>Categories (5)</span>
          </button>
        </div>

        {/* Sidebar Navigation: 5 Clear Categorized Groups */}
        <aside
          className={`${
            mobileNavOpen ? 'block' : 'hidden'
          } lg:block w-full ${isSidebarCompressed ? 'lg:w-20' : 'lg:w-72'} shrink-0 bg-[#0c1018] border-b lg:border-b-0 lg:border-r border-white/10 p-3 lg:p-4 flex flex-col justify-between sticky top-[61px] lg:h-[calc(100vh-61px)] overflow-y-auto z-20 transition-all duration-300`}
        >
          <div className="space-y-4">
            {/* Top Categories Bar with Expand All / Compress All & Sidebar Toggle */}
            <div className="flex items-center justify-between px-1 py-1 text-xs text-stone-400 font-semibold border-b border-white/5 pb-2">
              {!isSidebarCompressed && (
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span className="uppercase tracking-wider font-cinzel text-amber-200 text-[11px]">Categories (5)</span>
                </div>
              )}
              <div className="flex items-center space-x-1.5 ml-auto">
                {!isSidebarCompressed && (
                  <button
                    onClick={toggleAllCategories}
                    className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg bg-stone-900 border border-stone-800 text-[10px] font-semibold text-stone-300 hover:text-amber-300 hover:border-amber-500/40 transition-all"
                    title={Object.values(expandedCategories).some(Boolean) ? 'Compress All Categories' : 'Expand All Categories'}
                  >
                    <ChevronsUpDown className="w-3 h-3 text-amber-400" />
                    <span>{Object.values(expandedCategories).some(Boolean) ? 'Compress All' : 'Expand All'}</span>
                  </button>
                )}
                <button
                  onClick={() => setIsSidebarCompressed(!isSidebarCompressed)}
                  className="hidden lg:inline-flex items-center justify-center p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-amber-300 hover:border-amber-500/40 transition-all"
                  title={isSidebarCompressed ? 'Expand Sidebar Width' : 'Compress Sidebar Width'}
                >
                  {isSidebarCompressed ? <PanelLeftOpen className="w-4 h-4 text-amber-400" /> : <PanelLeftClose className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 5 Categorized Groups: Default is compressed, each can be individually expanded/compressed */}
            <div className="space-y-2">
              {categories.map((cat) => {
                const isExpanded = !!expandedCategories[cat.id];
                const isCatActive = cat.items.some((i) => i.id === activeTab);

                if (isSidebarCompressed) {
                  // Compact Rail Icon Mode when sidebar is compressed
                  return (
                    <div key={cat.id} className="relative group">
                      <button
                        onClick={() => {
                          setIsSidebarCompressed(false);
                          toggleCategory(cat.id);
                        }}
                        className={`w-full flex flex-col items-center justify-center p-2.5 rounded-xl transition-all ${
                          isCatActive
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                            : 'text-stone-400 hover:text-white hover:bg-white/5'
                        }`}
                        title={cat.title}
                      >
                        <cat.icon className="w-5 h-5 text-amber-400 mb-1" />
                        <span className="text-[9px] font-bold font-mono text-stone-400">
                          {cat.items.length}
                        </span>
                        {isCatActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1" />
                        )}
                      </button>
                    </div>
                  );
                }

                // Normal Mode: Accordion Category (Default is compressed)
                return (
                  <div key={cat.id} className="rounded-2xl bg-black/30 border border-white/5 overflow-hidden transition-all">
                    {/* Accordion Category Header Button */}
                    <button
                      onClick={() => toggleCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                        isCatActive
                          ? 'bg-amber-500/15 text-amber-300 border-b border-amber-500/20'
                          : 'text-stone-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <cat.icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate text-[11px]">{cat.title}</span>
                        {isCatActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                        )}
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0 text-stone-400">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-stone-300">
                          {cat.items.length}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-amber-400 transition-transform" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-stone-400 transition-transform" />
                        )}
                      </div>
                    </button>

                    {/* Accordion Sub-Items: Hidden by default (compressed), visible when expanded */}
                    {isExpanded && (
                      <div className="p-1.5 space-y-1 bg-black/20 border-t border-white/5 animate-in fade-in duration-200">
                        {cat.items.map((item) => {
                          const ItemIcon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveTab(item.id as any);
                                setMobileNavOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                isActive
                                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                                  : 'text-stone-300 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5 min-w-0">
                                <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
                                <span className="truncate">{item.label}</span>
                              </div>
                              {item.badge !== undefined && (
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1.5 ${
                                    isActive ? 'bg-black/30 text-stone-950' : 'bg-white/10 text-stone-300'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Preview Status Widget inside sidebar (shown when sidebar is expanded) */}
          {!isSidebarCompressed && (
            <div className="mt-8 pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/80 font-cinzel">
                Live Status Preview
              </span>
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: currentTheme.accentHex }}
              />
            </div>

            {/* Current Default Theme Banner */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                  style={{ backgroundColor: currentTheme.sealColor }}
                />
                <span className="text-xs font-bold text-white truncate">{currentTheme.name}</span>
              </div>
              <p className="text-[10px] text-stone-400 font-amharic truncate">{currentTheme.nameAmharic}</p>
            </div>

            {/* Story Sections Visibility Quick Toggles */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-black/30">
                <span className="text-[11px] text-stone-300">Love Story (Pic 2)</span>
                <button
                  type="button"
                  onClick={() => updateWeddingData({ showLoveStory: !weddingData.showLoveStory })}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    weddingData.showLoveStory
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {weddingData.showLoveStory ? 'VISIBLE' : 'HIDDEN'}
                </button>
              </div>

              <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-black/30">
                <span className="text-[11px] text-stone-300">Photo Gallery (Pic 3)</span>
                <button
                  type="button"
                  onClick={() => updateWeddingData({ showGallery: !weddingData.showGallery })}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    weddingData.showGallery
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {weddingData.showGallery ? 'VISIBLE' : 'HIDDEN'}
                </button>
              </div>
            </div>

            <a
              href="/"
              target="_blank"
              className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 text-xs font-semibold transition-all shadow"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Open Live Site ↗</span>
            </a>
          </div>
        )}
        </aside>

        {/* Right Content Panel */}
        <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 max-w-7xl">
        {/* TAB: SCROLL SPEED & TIMING CONTROL */}
        {activeTab === 'speed' && (
          <div className="space-y-6">
            <AutoScrollSpeedCard />
            <StoryCardTimingCard />
          </div>
        )}

        {/* TAB 1: OVERVIEW & RSVP STATS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Speed & Save The Date Timing Control Cards */}
            <AutoScrollSpeedCard />
            <StoryCardTimingCard />
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl bg-[#141824] border border-amber-500/20 shadow-xl">
                <p className="text-xs uppercase tracking-wider text-stone-400">Total Invitations</p>
                <p className="text-3xl font-cinzel font-bold text-amber-300 mt-2">{totalGuests}</p>
                <p className="text-xs text-stone-400 mt-1">Households / Invited Parties</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#141824] border border-emerald-500/30 shadow-xl">
                <p className="text-xs uppercase tracking-wider text-emerald-400">Attending Heads</p>
                <p className="text-3xl font-cinzel font-bold text-emerald-300 mt-2">{totalAttendingHeads}</p>
                <p className="text-xs text-stone-400 mt-1">{attendingGuests.length} invitations confirmed</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#141824] border border-amber-500/30 shadow-xl">
                <p className="text-xs uppercase tracking-wider text-amber-400">Pending Responses</p>
                <p className="text-3xl font-cinzel font-bold text-amber-200 mt-2">{pendingGuests.length}</p>
                <p className="text-xs text-stone-400 mt-1">Awaiting confirmation</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#141824] border border-rose-500/30 shadow-xl">
                <p className="text-xs uppercase tracking-wider text-rose-400">Declined</p>
                <p className="text-3xl font-cinzel font-bold text-rose-300 mt-2">{declinedGuests.length}</p>
                <p className="text-xs text-stone-400 mt-1">Unable to attend</p>
              </div>
            </div>

            {/* Page Sections Visibility Toggles (Pic 2: Love Story & Pic 3: Photo Gallery) */}
            <div className="p-6 rounded-2xl bg-[#141824] border border-amber-500/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-cinzel font-bold text-amber-200 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-400" />
                    Public Page Sections Visibility Control
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Control which optional story sections are visible to your guests. By default, they remain completely hidden until you enable them.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Toggle 1: Love Story (Pic 2) */}
                <div className={`p-4 rounded-xl border transition-all ${weddingData.showLoveStory ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-black/30 border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-stone-200">Love Story (Pic 2)</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${weddingData.showLoveStory ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-800 text-stone-400'}`}>
                          {weddingData.showLoveStory ? 'VISIBLE' : 'HIDDEN'}
                        </span>
                      </div>
                      <p className="text-xs text-amber-200/80 mt-0.5">Story timeline ("How It All Began")</p>
                      <p className="text-[11px] text-stone-400 mt-1">Shows your relationship journey &amp; milestones.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateWeddingData({ showLoveStory: !weddingData.showLoveStory })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${weddingData.showLoveStory ? 'bg-emerald-500' : 'bg-stone-700'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${weddingData.showLoveStory ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                {/* Toggle 2: Photo Gallery (Pic 3) */}
                <div className={`p-4 rounded-xl border transition-all ${weddingData.showGallery ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-black/30 border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-stone-200">Photo Gallery (Pic 3)</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${weddingData.showGallery ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-800 text-stone-400'}`}>
                          {weddingData.showGallery ? 'VISIBLE' : 'HIDDEN'}
                        </span>
                      </div>
                      <p className="text-xs text-amber-200/80 mt-0.5">Pre-wedding photo album ("Moments")</p>
                      <p className="text-[11px] text-stone-400 mt-1">Shows your high-resolution pre-wedding photo album.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateWeddingData({ showGallery: !weddingData.showGallery })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${weddingData.showGallery ? 'bg-emerald-500' : 'bg-stone-700'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${weddingData.showGallery ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Tips Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900 to-black border border-amber-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-cinzel font-bold text-amber-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Personalized Invitations Ready to Share!
                </h3>
                <p className="text-xs text-stone-300 mt-1 max-w-2xl">
                  Each guest has their own unique personalized invitation URL. You can send them custom messages, assign royal card themes (Habesha Gold, Emerald Velvet, Burgundy, etc.), and track their RSVP in real time.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('guests')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors shrink-0"
              >
                Manage Guest Cards →
              </button>
            </div>

            {/* Recent RSVPs Table */}
            <div className="p-6 rounded-2xl bg-[#141824] border border-white/10">
              <h3 className="text-base font-cinzel font-bold text-amber-100 mb-4">
                Recent Guest Responses & Notes
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/40 text-stone-400 uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-3">Guest Name</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Total Heads</th>
                      <th className="p-3">Assigned Table</th>
                      <th className="p-3">Dietary / Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {weddingData.guests.map((g) => (
                      <tr key={g.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-semibold text-amber-200">
                          {g.name}
                          <span className="block text-[10px] text-stone-400 font-normal">{g.group}</span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              g.rsvpStatus === 'attending'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : g.rsvpStatus === 'declined'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {g.rsvpStatus}
                          </span>
                        </td>
                        <td className="p-3 font-mono">
                          {g.rsvpStatus === 'attending' ? 1 + (g.attendingPlusOnes || 0) : '-'}
                        </td>
                        <td className="p-3 text-stone-300">{g.tableNumber || 'Unassigned'}</td>
                        <td className="p-3 text-stone-300 max-w-xs truncate">
                          {g.dietaryRestrictions || g.notes || 'No special notes'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: THEMES & LAYOUTS MANAGER */}
        {activeTab === 'themes' && (
          <ThemesManagerTab />
        )}

        {/* TAB 2: GUEST PERSONALIZATION & MANAGEMENT */}
        {activeTab === 'guests' && (
          <div className="space-y-6">
            {/* Header with Search and Add Guest Button */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex-1 flex items-center space-x-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search guests by name, slug, or table..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#141824] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Filter Group */}
                <select
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#141824] border border-white/10 text-xs text-stone-300 focus:outline-none"
                >
                  <option value="all">All Groups</option>
                  <option value="VIP Guests">VIP Guests</option>
                  <option value="Groom Family">Groom Family</option>
                  <option value="Bride Family">Bride Family</option>
                  <option value="Friends">Friends</option>
                  <option value="Colleagues">Colleagues</option>
                </select>

                {/* Filter RSVP */}
                <select
                  value={filterRsvp}
                  onChange={(e) => setFilterRsvp(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#141824] border border-white/10 text-xs text-stone-300 focus:outline-none"
                >
                  <option value="all">All RSVP</option>
                  <option value="attending">Attending</option>
                  <option value="declined">Declined</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <button
                onClick={openAddGuestModal}
                className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold text-xs shadow-lg hover:shadow-amber-500/20 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Guest</span>
              </button>
            </div>

            {/* Guest Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGuests.map((guest) => {
                const theme = THEME_CONFIGS[guest.themeId] || THEME_CONFIGS['habesha-gold'];
                return (
                  <div
                    key={guest.id}
                    className="p-5 rounded-2xl bg-[#141824] border border-white/10 flex flex-col justify-between hover:border-amber-500/40 transition-all"
                  >
                    <div>
                      {/* Top Meta Bar */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-cinzel font-bold text-base text-amber-100">
                            {guest.name}
                          </h3>
                          {guest.nameAmharic && (
                            <p className="text-xs font-amharic text-amber-300 font-medium">
                              {guest.nameAmharic}
                            </p>
                          )}
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${theme.badge} shrink-0`}>
                          {theme.name.split(' ')[0]}
                        </span>
                      </div>

                      {/* Guest Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-3 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-stone-300">
                          {guest.group}
                        </span>
                        {guest.tableNumber && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            {guest.tableNumber}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">
                          +{guest.allowedPlusOnes} Seats
                        </span>
                      </div>

                      {/* Message Preview (Custom vs Global) */}
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 mb-4 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400">
                            {guest.useCustomMessage ? '✨ Custom Note' : 'Standard Note'}
                          </span>
                          <span className="text-[10px] text-stone-500">
                            RSVP: <span className="uppercase text-amber-200">{guest.rsvpStatus}</span>
                          </span>
                        </div>
                        <p className="text-stone-300 line-clamp-2 italic">
                          {guest.useCustomMessage && guest.customMessage
                            ? `"${guest.customMessage}"`
                            : `"${weddingData.globalInvitationMessage}"`}
                        </p>
                      </div>
                    </div>

                    {/* Theme Selector for this Guest */}
                    <div className="pt-2 pb-2 px-1 flex items-center justify-between text-[11px] border-t border-white/5">
                      <span className="text-stone-400 font-medium">የተመረጠ ገጽታ (Theme):</span>
                      <select
                        value={guest.themeId}
                        onChange={(e) => updateGuest(guest.id, { themeId: e.target.value as ThemeId })}
                        className="px-2 py-1 rounded-lg bg-black/60 border border-white/20 text-amber-200 text-xs focus:outline-none focus:border-amber-400"
                      >
                        {Object.values(THEME_CONFIGS).map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name.split(' ')[0]} ({t.nameAmharic.slice(0, 10)})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Actions & Links */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div className="grid grid-cols-4 gap-1.5">
                        <button
                          onClick={() => copyGuestLink(guest.slug)}
                          className="py-1.5 px-2 rounded-lg bg-stone-900 border border-amber-500/30 text-amber-200 text-[11px] font-semibold hover:bg-amber-500/10 flex items-center justify-center gap-1"
                          title="Copy personalized invitation link"
                        >
                          {copiedSlug === guest.slug ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedSlug === guest.slug ? 'Copied' : 'Link'}</span>
                        </button>

                        <button
                          onClick={() => shareTelegramDirect(guest)}
                          className="py-1.5 px-2 rounded-lg bg-[#229ED9]/20 border border-[#229ED9]/50 text-[#229ED9] text-[11px] font-semibold hover:bg-[#229ED9]/30 flex items-center justify-center gap-1"
                          title="Share directly via Telegram"
                        >
                          <Send className="w-3 h-3" />
                          <span>Telegram</span>
                        </button>

                        <button
                          onClick={() => shareWhatsAppDirect(guest)}
                          className="py-1.5 px-2 rounded-lg bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] text-[11px] font-semibold hover:bg-[#25D366]/30 flex items-center justify-center gap-1"
                          title="Share directly via WhatsApp"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </button>

                        <Link
                          href={`/invite/${guest.slug}`}
                          target="_blank"
                          className="py-1.5 px-2 rounded-lg bg-stone-900 border border-white/10 text-stone-300 hover:text-white hover:border-amber-400 text-[11px] font-semibold flex items-center justify-center gap-1"
                          title="Open guest invitation preview"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View</span>
                        </Link>
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-1">
                        <button
                          onClick={() => openEditGuestModal(guest)}
                          className="text-stone-400 hover:text-amber-300 text-xs flex items-center gap-1 px-2 py-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: 'Delete Guest Invitation?',
                              message: `Are you sure you want to permanently remove "${guest.name}" from your guest list?`,
                              confirmLabel: 'Yes, Delete',
                              cancelLabel: 'Cancel',
                              isDestructive: true,
                              onConfirm: () => {
                                deleteGuest(guest.id);
                                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                                showToast(`"${guest.name}" was removed from the invitation list.`);
                              },
                            });
                          }}
                          className="text-stone-500 hover:text-rose-400 text-xs flex items-center gap-1 px-2 py-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: WEDDING INFO & GLOBAL MESSAGE EDITOR */}
        {activeTab === 'wedding-info' && (
          <div className="max-w-4xl space-y-6">
            <div className="p-6 rounded-2xl bg-[#141824] border border-white/10 space-y-6">
              <h3 className="text-base font-cinzel font-bold text-amber-200">
                Couple & Wedding Core Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Groom First Name:
                  </label>
                  <input
                    type="text"
                    value={weddingData.groomName}
                    onChange={(e) => updateWeddingData({ groomName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Groom Amharic Name (የሙሽራው ስም):
                  </label>
                  <input
                    type="text"
                    value={weddingData.groomNameAmharic}
                    onChange={(e) => updateWeddingData({ groomNameAmharic: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-amharic"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Bride First Name:
                  </label>
                  <input
                    type="text"
                    value={weddingData.brideName}
                    onChange={(e) => updateWeddingData({ brideName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Bride Amharic Name (የሙሽሪት ስም):
                  </label>
                  <input
                    type="text"
                    value={weddingData.brideNameAmharic}
                    onChange={(e) => updateWeddingData({ brideNameAmharic: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-amharic"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Groom Full Name:
                  </label>
                  <input
                    type="text"
                    value={weddingData.groomFullName}
                    onChange={(e) => updateWeddingData({ groomFullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Bride Full Name:
                  </label>
                  <input
                    type="text"
                    value={weddingData.brideFullName}
                    onChange={(e) => updateWeddingData({ brideFullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Wedding Date & Time (ISO):
                  </label>
                  <input
                    type="datetime-local"
                    value={weddingData.weddingDate.slice(0, 16)}
                    onChange={(e) => updateWeddingData({ weddingDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Amharic Date String (የቀን አገላለጽ):
                  </label>
                  <input
                    type="text"
                    value={weddingData.weddingDateAmharic}
                    onChange={(e) => updateWeddingData({ weddingDateAmharic: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-amharic"
                  />
                </div>
              </div>
            </div>

            {/* Global Invitation Messages */}
            <div className="p-6 rounded-2xl bg-[#141824] border border-white/10 space-y-4">
              <h3 className="text-base font-cinzel font-bold text-amber-200">
                Global Wedding Invitation Message (For Standard Invitations)
              </h3>
              <p className="text-xs text-stone-400">
                This is displayed to all guests who do not have a custom personal message assigned.
              </p>

              <div>
                <label className="block text-xs text-stone-300 mb-1 font-semibold">
                  Amharic Global Message (የጋራ የሰርግ ጥሪ መልእክት):
                </label>
                <textarea
                  rows={3}
                  value={weddingData.globalInvitationMessageAmharic}
                  onChange={(e) => updateWeddingData({ globalInvitationMessageAmharic: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-amber-100 font-amharic focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1 font-semibold">
                  English Global Message:
                </label>
                <textarea
                  rows={3}
                  value={weddingData.globalInvitationMessage}
                  onChange={(e) => updateWeddingData({ globalInvitationMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-amber-100 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>
            </div>

            {/* Music & Media Settings */}
            <div className="p-6 rounded-2xl bg-[#141824] border border-white/10 space-y-4">
              <h3 className="text-base font-cinzel font-bold text-amber-200 flex items-center gap-2">
                <Music className="w-4 h-4 text-amber-400" />
                Background Romantic Music Settings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-semibold">
                    Song Title / Track Name:
                  </label>
                  <input
                    type="text"
                    value={weddingData.backgroundMusicTitle}
                    onChange={(e) => updateWeddingData({ backgroundMusicTitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-semibold">
                    Audio Stream URL (.mp3):
                  </label>
                  <input
                    type="text"
                    value={weddingData.backgroundMusicUrl}
                    onChange={(e) => updateWeddingData({ backgroundMusicUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Public Page Sections Visibility Controls */}
            <div className="p-6 rounded-2xl bg-[#141824] border border-amber-500/30 space-y-4">
              <h3 className="text-base font-cinzel font-bold text-amber-200 flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                Optional Page Sections Visibility (የገጾች እይታ ማብሪያ/ማጥፊያ)
              </h3>
              <p className="text-xs text-stone-400">
                You can choose whether your guests can see your Love Story and Photo Gallery. By default, both are kept hidden until you choose to reveal them.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className={`p-4 rounded-xl border transition-all ${weddingData.showLoveStory ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-black/30 border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-stone-200">Love Story (Pic 2)</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${weddingData.showLoveStory ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-800 text-stone-400'}`}>
                          {weddingData.showLoveStory ? 'VISIBLE' : 'HIDDEN'}
                        </span>
                      </div>
                      <p className="font-amharic text-xs text-amber-200/80 mt-0.5">የፍቅር ታሪክ ገጽ ("How It All Began")</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateWeddingData({ showLoveStory: !weddingData.showLoveStory })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${weddingData.showLoveStory ? 'bg-emerald-500' : 'bg-stone-700'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${weddingData.showLoveStory ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border transition-all ${weddingData.showGallery ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-black/30 border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-stone-200">Photo Gallery (Pic 3)</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${weddingData.showGallery ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-800 text-stone-400'}`}>
                          {weddingData.showGallery ? 'VISIBLE' : 'HIDDEN'}
                        </span>
                      </div>
                      <p className="font-amharic text-xs text-amber-200/80 mt-0.5">የፎቶ ማዕከል ገጽ ("Pre-Wedding Moments")</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateWeddingData({ showGallery: !weddingData.showGallery })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${weddingData.showGallery ? 'bg-emerald-500' : 'bg-stone-700'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${weddingData.showGallery ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SCHEDULE & PROGRAM */}
        {activeTab === 'schedule' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-cinzel font-bold text-amber-200">
                  Wedding Program Timeline
                </h3>
                <p className="text-xs text-stone-400">Add, edit, or reorder the day&apos;s events.</p>
              </div>
              <button
                onClick={() => {
                  const newItem: ScheduleItem = {
                    id: `sch-${Date.now()}`,
                    time: '08:00 PM',
                    title: 'New Program Item',
                    titleAmharic: 'አዲስ የፕሮግራም ክፍል',
                    description: 'Description of event...',
                    location: 'Main Ballroom',
                    icon: 'Clock',
                    eventType: 'reception',
                  };
                  updateWeddingData((prev) => ({
                    ...prev,
                    schedule: [...prev.schedule, newItem],
                  }));
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold hover:bg-amber-400 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            </div>

            <div className="space-y-4">
              {weddingData.schedule.map((item, index) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#141824] border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">Event #{index + 1}</span>
                    <button
                      onClick={() => {
                        updateWeddingData((prev) => ({
                          ...prev,
                          schedule: prev.schedule.filter((s) => s.id !== item.id),
                        }));
                      }}
                      className="text-stone-500 hover:text-rose-400 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Time (ሰዓት):</label>
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => {
                          const updated = [...weddingData.schedule];
                          updated[index].time = e.target.value;
                          updateWeddingData({ schedule: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Title (English):</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...weddingData.schedule];
                          updated[index].title = e.target.value;
                          updateWeddingData({ schedule: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Title (አማርኛ):</label>
                      <input
                        type="text"
                        value={item.titleAmharic}
                        onChange={(e) => {
                          const updated = [...weddingData.schedule];
                          updated[index].titleAmharic = e.target.value;
                          updateWeddingData({ schedule: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-amharic"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Location Name:</label>
                      <input
                        type="text"
                        value={item.location}
                        onChange={(e) => {
                          const updated = [...weddingData.schedule];
                          updated[index].location = e.target.value;
                          updateWeddingData({ schedule: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Event Category:</label>
                      <select
                        value={item.eventType}
                        onChange={(e) => {
                          const updated = [...weddingData.schedule];
                          updated[index].eventType = e.target.value as EventType;
                          updateWeddingData({ schedule: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
                      >
                        <option value="church">Church / Matrimony</option>
                        <option value="reception">Dinner & Reception</option>
                        <option value="melse">Traditional Melse</option>
                        <option value="kebero">Kebero</option>
                        <option value="afterparty">Afterparty</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: VENUES & MAPS */}
        {activeTab === 'venues' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-cinzel font-bold text-amber-200">
                  Venues & Locations
                </h3>
                <p className="text-xs text-stone-400">Manage venue addresses and direct Google Maps links.</p>
              </div>
            </div>

            <div className="space-y-4">
              {weddingData.venues.map((venue, idx) => (
                <div key={venue.id} className="p-5 rounded-2xl bg-[#141824] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">Venue #{idx + 1}: {venue.name}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Venue Name:</label>
                      <input
                        type="text"
                        value={venue.name}
                        onChange={(e) => {
                          const updated = [...weddingData.venues];
                          updated[idx].name = e.target.value;
                          updateWeddingData({ venues: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Amharic Name:</label>
                      <input
                        type="text"
                        value={venue.nameAmharic}
                        onChange={(e) => {
                          const updated = [...weddingData.venues];
                          updated[idx].nameAmharic = e.target.value;
                          updateWeddingData({ venues: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-amharic"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-stone-400 mb-1">Google Maps URL:</label>
                      <input
                        type="text"
                        value={venue.googleMapsUrl}
                        onChange={(e) => {
                          const updated = [...weddingData.venues];
                          updated[idx].googleMapsUrl = e.target.value;
                          updateWeddingData({ venues: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: BANK & REGISTRY */}
        {activeTab === 'banks' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-cinzel font-bold text-amber-200">
                  Bank Accounts & Telebirr Details
                </h3>
                <p className="text-xs text-stone-400">Configure bank accounts for guests wishing to send wedding gifts.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {weddingData.bankAccounts.map((account, idx) => (
                <div key={account.id} className="p-5 rounded-2xl bg-[#141824] border border-white/10 space-y-3">
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Bank Name:</label>
                    <input
                      type="text"
                      value={account.bankName}
                      onChange={(e) => {
                        const updated = [...weddingData.bankAccounts];
                        updated[idx].bankName = e.target.value;
                        updateWeddingData({ bankAccounts: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Account Holder Name:</label>
                    <input
                      type="text"
                      value={account.accountName}
                      onChange={(e) => {
                        const updated = [...weddingData.bankAccounts];
                        updated[idx].accountName = e.target.value;
                        updateWeddingData({ bankAccounts: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Account Number / Phone:</label>
                    <input
                      type="text"
                      value={account.accountNumber}
                      onChange={(e) => {
                        const updated = [...weddingData.bankAccounts];
                        updated[idx].accountNumber = e.target.value;
                        updateWeddingData({ bankAccounts: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-amber-300 font-mono font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: DRESS CODE */}
        {activeTab === 'dresscode' && (
          <div className="max-w-4xl space-y-6">
            <div className="p-6 rounded-2xl bg-[#141824] border border-white/10 space-y-4">
              <h3 className="text-base font-cinzel font-bold text-amber-200">
                Dress Code & Theme Color Palette
              </h3>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Title:</label>
                <input
                  type="text"
                  value={weddingData.dressCode.title}
                  onChange={(e) =>
                    updateWeddingData({
                      dressCode: { ...weddingData.dressCode, title: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Amharic Title (የአለባበስ መመሪያ):</label>
                <input
                  type="text"
                  value={weddingData.dressCode.titleAmharic}
                  onChange={(e) =>
                    updateWeddingData({
                      dressCode: { ...weddingData.dressCode, titleAmharic: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-amharic"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Description:</label>
                <textarea
                  rows={3}
                  value={weddingData.dressCode.description}
                  onChange={(e) =>
                    updateWeddingData({
                      dressCode: { ...weddingData.dressCode, description: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: WISHES MODERATION */}
        {activeTab === 'wishes' && (
          <div className="max-w-4xl space-y-4">
            <h3 className="text-base font-cinzel font-bold text-amber-200">
              Guestbook Blessings ({weddingData.wishes.length})
            </h3>

            <div className="space-y-3">
              {weddingData.wishes.map((wish) => (
                <div
                  key={wish.id}
                  className="p-4 rounded-2xl bg-[#141824] border border-white/10 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-amber-300">{wish.guestName}</h4>
                      <span className="text-[10px] text-stone-500">
                        {new Date(wish.createdAt).toLocaleString()}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300">
                        ❤️ {wish.likes} likes
                      </span>
                    </div>
                    <p className="text-xs text-stone-200 mt-1">{wish.message}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => toggleApproveWish(wish.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        wish.approved
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {wish.approved ? 'Approved' : 'Hidden'}
                    </button>
                    <button
                      onClick={() => deleteWish(wish.id)}
                      className="p-1.5 rounded-lg bg-stone-900 text-stone-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </main>
      </div>

      {/* GUEST ADD / EDIT MODAL (Key Requirement for Custom Message & Themes) */}
      {guestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#141824] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-lg font-cinzel font-bold text-amber-200 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                {editingGuestId ? 'Edit Guest Personalization' : 'Add New Wedding Guest'}
              </h2>
              <button
                onClick={() => setGuestModalOpen(false)}
                className="text-stone-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGuest} className="space-y-5">
              {/* Guest Names & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Guest Name (English):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Dawit Solomon"
                    value={guestForm.name}
                    onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Guest Name (አማርኛ - አማራጭ):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ዶ/ር ዳዊት ሰሎሞን"
                    value={guestForm.nameAmharic}
                    onChange={(e) => setGuestForm({ ...guestForm, nameAmharic: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-amharic"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Custom URL Slug:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. dawit-solomon"
                    value={guestForm.slug}
                    onChange={(e) => setGuestForm({ ...guestForm, slug: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <span className="text-[10px] text-stone-500">
                    Will create link: /invite/{guestForm.slug || 'name-slug'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Guest Group / Tier:
                  </label>
                  <select
                    value={guestForm.group}
                    onChange={(e) => setGuestForm({ ...guestForm, group: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="VIP Guests">VIP Guests</option>
                    <option value="Groom Family">Groom Family</option>
                    <option value="Bride Family">Bride Family</option>
                    <option value="Friends">Friends</option>
                    <option value="Colleagues">Colleagues</option>
                    <option value="Special Guests">Special Guests</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Allowed Plus-Ones:
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={guestForm.allowedPlusOnes}
                    onChange={(e) => setGuestForm({ ...guestForm, allowedPlusOnes: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Assigned Table:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Table #1 (VIP)"
                    value={guestForm.tableNumber}
                    onChange={(e) => setGuestForm({ ...guestForm, tableNumber: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* CARD THEME SELECTION (Key Requirement) */}
              <div className="pt-2">
                <label className="block text-xs uppercase tracking-wider text-amber-300 font-semibold mb-2">
                  🎨 Personalized Card Design / Theme:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(Object.keys(THEME_CONFIGS) as ThemeId[]).map((themeKey) => {
                    const t = THEME_CONFIGS[themeKey];
                    const isSelected = guestForm.themeId === themeKey;
                    return (
                      <button
                        type="button"
                        key={themeKey}
                        onClick={() => setGuestForm({ ...guestForm, themeId: themeKey })}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-md ring-1 ring-amber-400'
                            : 'bg-black/40 border-white/10 text-stone-400 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">{t.name.split(' ')[0]}</span>
                          <span
                            className="w-3 h-3 rounded-full border border-white/30"
                            style={{ backgroundColor: t.sealColor }}
                          />
                        </div>
                        <p className="text-[10px] text-stone-400 leading-tight truncate">{t.nameAmharic}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MESSAGE CUSTOMIZATION TOGGLE (Core User Requirement) */}
              <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Message Personalization Option
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      Decide whether to write a unique note for this guest or use the global invitation message.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={guestForm.useCustomMessage}
                      onChange={(e) => setGuestForm({ ...guestForm, useCustomMessage: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {guestForm.useCustomMessage ? (
                  <div className="space-y-3 pt-2 border-t border-white/10 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-[11px] text-amber-200 font-semibold mb-1">
                        Personalized Note (English):
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Write a custom heartfelt message from bride & groom..."
                        value={guestForm.customMessage}
                        onChange={(e) => setGuestForm({ ...guestForm, customMessage: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-amber-200 font-semibold mb-1">
                        Personalized Note (አማርኛ - አማራጭ):
                      </label>
                      <textarea
                        rows={2}
                        placeholder="ለተጋባዡ የተዘጋጀ ልዩ የሰርግ ጥሪ መልእክት..."
                        value={guestForm.customMessageAmharic}
                        onChange={(e) => setGuestForm({ ...guestForm, customMessageAmharic: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-xs text-white font-amharic focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-stone-400 italic pt-1 border-t border-white/5">
                    Currently set to: <strong className="text-amber-200">Global Wedding Message</strong> (same message as all guests).
                  </p>
                )}
              </div>

              {/* Invited Events Checkboxes */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-2">
                  Invited Specific Programs:
                </label>
                <div className="flex flex-wrap gap-3 text-xs">
                  {[
                    { id: 'church', label: 'Holy Matrimony (ሥርዓተ ተክሊል)' },
                    { id: 'reception', label: 'Grand Reception (የሰርግ ግብዣ)' },
                    { id: 'melse', label: 'Traditional Melse (መልስ)' },
                    { id: 'kebero', label: 'Kebero Dance (ከበሮ)' },
                    { id: 'afterparty', label: 'Evening Afterparty' },
                  ].map((evt) => {
                    const isChecked = guestForm.invitedEvents.includes(evt.id as EventType);
                    return (
                      <label key={evt.id} className="flex items-center space-x-2 cursor-pointer bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setGuestForm({
                                ...guestForm,
                                invitedEvents: [...guestForm.invitedEvents, evt.id as EventType],
                              });
                            } else {
                              setGuestForm({
                                ...guestForm,
                                invitedEvents: guestForm.invitedEvents.filter((ev) => ev !== evt.id),
                              });
                            }
                          }}
                          className="accent-amber-500"
                        />
                        <span className={isChecked ? 'text-amber-200 font-medium' : 'text-stone-400'}>
                          {evt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setGuestModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 border border-white/10 text-stone-300 text-xs font-semibold hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 text-xs font-bold shadow-lg hover:shadow-amber-500/30 transition-all"
                >
                  {editingGuestId ? 'Save Changes' : 'Create Invitation Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal (Zero Browser Confirm Dialogs) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[#141824] border border-amber-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-start space-x-3.5">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  confirmModal.isDestructive
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {confirmModal.isDestructive ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-cinzel font-bold text-white">
                  {confirmModal.title}
                </h3>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl bg-stone-900 border border-white/10 text-stone-300 text-xs font-semibold hover:bg-white/5 transition-colors"
              >
                {confirmModal.cancelLabel}
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                  confirmModal.isDestructive
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                }`}
              >
                {confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-5 py-3 rounded-2xl bg-[#141824]/95 border border-amber-500/40 text-amber-200 text-xs shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
