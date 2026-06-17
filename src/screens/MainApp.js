import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, Modal, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storage } from '../utils/storage';
import { T, SK, DEFAULT_SONGS, DEFAULT_LINEUP, DEMO_USERS, makeId } from '../utils/constants';
import { Avatar, RoleBadge, Toast } from '../components/UI';
import LoginScreen   from './LoginScreen';
import LineupScreen  from './LineupScreen';
import LibraryScreen from './LibraryScreen';
import AddSongScreen from './AddSongScreen';
import AdminScreen   from './AdminScreen';
import ProfileScreen from './ProfileScreen';

export default function MainApp() {
  const [songs,   setSongs]   = useState(null);
  const [lineup,  setLineup]  = useState([]);
  const [users,   setUsers]   = useState(DEMO_USERS);
  const [session, setSession] = useState(null);
  const [tab,     setTab]     = useState('lineup');
  const [editSong,setEditSong]= useState(null);
  const [showAddSong, setShowAddSong] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [toasts,  setToasts]  = useState([]);
  const [loading, setLoading] = useState(true);
  const nextId = useRef(200);
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const openAddSong  = (song = null) => { setEditSong(song); setShowAddSong(true); };
  const closeAddSong = () => { setEditSong(null); setShowAddSong(false); };

  const toast = (msg, type='success') => {
    const id = makeId();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  // ── LOAD ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const [ss, sl, su, se] = await Promise.all([
        storage.get(SK.SONGS), storage.get(SK.LINEUP),
        storage.get(SK.USERS), storage.get(SK.SESSION),
      ]);
      const loaded = ss ? ss.map(s => ({ sections:[], ...s })) : DEFAULT_SONGS;
      setSongs(loaded);
      setLineup(sl || DEFAULT_LINEUP);
      if (su) setUsers(su);
      if (se) setSession(se);
      nextId.current = Math.max(...loaded.map(x => x.id), 199) + 1;
      setLoading(false);
    };
    load();
  }, []);

  const save = async (key, val) => storage.set(key, val);

  // ── AUTH ─────────────────────────────────────────────────────────────────
  const handleLogin = async (u) => {
    let allUsers = [...users];
    const fresh = await storage.get(SK.USERS);
    if (fresh) allUsers = fresh;
    const existing = allUsers.find(x => x.email === u.email);
    const role = allUsers.length === 0 ? 'admin' : existing ? existing.role : u.role || 'pending';
    const rec  = { ...u, role, joinedAt: existing?.joinedAt || new Date().toISOString() };
    const newUsers = existing
      ? allUsers.map(x => x.email === u.email ? { ...x, ...rec } : x)
      : [...allUsers, rec];
    setUsers(newUsers); setSession(rec);
    await save(SK.USERS, newUsers);
    await save(SK.SESSION, rec);
    if (role === 'pending') toast('Signed in — awaiting admin approval', 'warn');
    else toast(`Welcome, ${rec.name}!`);
  };

  const handleLogout = async () => {
    await storage.remove(SK.SESSION);
    setSession(null);
    setTab('lineup');
  };

  const handleSaveProfile = async (updates) => {
    const updated = { ...currentUser, ...updates };
    const newUsers = users.map(u => u.email === updated.email ? updated : u);
    setUsers(newUsers); setSession(updated);
    await save(SK.USERS, newUsers);
    await save(SK.SESSION, updated);
    setShowProfile(false);
    toast('Profile updated!');
  };

  const currentUser = session ? (users.find(u => u.email === session.email) || session) : null;
  const role    = currentUser?.role;
  const canEdit = role === 'admin' || role === 'editor';
  const isAdmin = role === 'admin';

  // ── SONGS ────────────────────────────────────────────────────────────────
  const saveSong = async (formData) => {
    let newSongs;
    const approved = isAdmin;
    if (editSong) {
      newSongs = songs.map(s => s.id === editSong.id
        ? { ...formData, id:editSong.id, approved:editSong.approved, submittedBy:editSong.submittedBy }
        : s);
      toast('Song updated.');
    } else {
      newSongs = [...songs, { ...formData, id:nextId.current++, approved, submittedBy:currentUser.email }];
      toast(approved ? 'Song added to library.' : 'Song submitted for approval.', 'warn');
    }
    setSongs(newSongs); await save(SK.SONGS, newSongs);
    closeAddSong();
  };

  const deleteSong = (id) => {
    Alert.alert('Delete song', 'Remove from library?', [
      { text:'Cancel', style:'cancel' },
      { text:'Delete', style:'destructive', onPress: async () => {
        const ns = songs.filter(s => s.id !== id);
        const nl = lineup.filter(i => i !== id);
        setSongs(ns); setLineup(nl);
        await save(SK.SONGS, ns); await save(SK.LINEUP, nl);
        toast('Song removed.', 'warn');
      }},
    ]);
  };

  const toggleLineup = async (id) => {
    const nl = lineup.includes(id) ? lineup.filter(i => i !== id) : [...lineup, id];
    setLineup(nl); await save(SK.LINEUP, nl);
  };

  const moveLineup = async (i, dir) => {
    const nl = [...lineup]; const t = i + dir;
    if (t < 0 || t >= nl.length) return;
    [nl[i], nl[t]] = [nl[t], nl[i]];
    setLineup(nl); await save(SK.LINEUP, nl);
  };

  const approveSong = async (id) => {
    const ns = songs.map(s => s.id === id ? { ...s, approved:true } : s);
    setSongs(ns); await save(SK.SONGS, ns); toast('Song approved.');
  };
  const rejectSong = async (id) => {
    const ns = songs.filter(s => s.id !== id);
    setSongs(ns); await save(SK.SONGS, ns); toast('Song rejected.', 'warn');
  };
  const updateUsers = async (u) => {
    setUsers(u); await save(SK.USERS, u); toast('Users updated.');
  };

  // ── GUARDS ───────────────────────────────────────────────────────────────
  if (loading) return (
    <View style={s.loading}><Text style={s.loadingText}>Loading…</Text></View>
  );
  if (!session || !currentUser) return <LoginScreen onLogin={handleLogin} />;

  // Pending user — show limited UI
  const isPending = role === 'pending';

  const approvedSongs = (songs || []).filter(s => s.approved);
  const pendingCount  = (songs || []).filter(s => !s.approved).length;

  const TABS = [
    { key:'lineup',  icon:'📋', label:'Line-up'  },
    { key:'library', icon:'🎼', label:'Library', navLabel:'Songs' },
    ...(isAdmin ? [{ key:'admin', icon:'⚙️', label:'Admin',  badge: pendingCount }] : []),
  ];

  return (
    <View style={s.root}>
      {/* Profile modal */}
      {showProfile && (
        <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowProfile(false)}>
          <ProfileScreen user={currentUser} onSave={handleSaveProfile} onClose={() => setShowProfile(false)} />
        </Modal>
      )}

      {/* Add Song modal */}
      {showAddSong && canEdit && (
        <Modal transparent visible animationType="fade" onRequestClose={closeAddSong}>
          <View style={s.modalBackdrop}>
            <View style={s.modalCard}>
              <TouchableOpacity onPress={closeAddSong} style={s.modalCloseBtn}>
                <Text style={s.modalCloseText}>✕</Text>
              </TouchableOpacity>
              <AddSongScreen editSong={editSong} isAdmin={isAdmin} onSave={saveSong} onCancel={closeAddSong} />
            </View>
          </View>
        </Modal>
      )}

      {/* Toasts */}
      <View style={s.toastContainer} pointerEvents="none">
        {toasts.map(t => <Toast key={t.id} msg={t.msg} type={t.type} onDone={() => setToasts(ts => ts.filter(x => x.id !== t.id))} />)}
      </View>

      {/* ── HEADER ── */}
      <SafeAreaView edges={['top']} style={s.headerSafe}>
        <View style={s.header}>
          <Text style={s.headerLogo}>🎵</Text>
          <View style={s.headerInfo}>
            <Text style={s.headerTitle}>TGCC Line-up</Text>
            <Text style={s.headerSub}>WORSHIP SONG MANAGEMENT</Text>
          </View>

          {isWide && !isPending && (
            <View style={s.navLinks}>
              {TABS.map(t => (
                <TouchableOpacity key={t.key} onPress={() => { setEditSong(null); setTab(t.key); }} style={s.navLinkBtn}>
                  <Text style={[s.navLinkText, tab === t.key && s.navLinkTextActive]}>{t.navLabel || t.label}</Text>
                  {t.badge > 0 && <View style={s.tabBadge}><Text style={s.tabBadgeText}>{t.badge}</Text></View>}
                </TouchableOpacity>
              ))}
              {canEdit && (
                <TouchableOpacity onPress={() => openAddSong()} style={s.navAddBtn} activeOpacity={0.85}>
                  <Text style={s.navAddBtnText}>+ Add Song</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={s.headerRight}>
            <RoleBadge role={role} />
            <Avatar user={currentUser} size={34} onPress={() => setShowProfile(true)} />
            <TouchableOpacity onPress={() => Alert.alert('Sign out', 'Are you sure?', [
              { text:'Cancel', style:'cancel' },
              { text:'Sign out', style:'destructive', onPress: handleLogout },
            ])}>
              <Text style={s.logoutIcon}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* ── PENDING BANNER ── */}
      {isPending && (
        <View style={s.pendingBanner}>
          <Text style={s.pendingBannerText}>🕐  Your account is pending approval. Contact an admin to gain access.</Text>
        </View>
      )}

      {/* ── CONTENT ── */}
      <View style={s.content}>
        {isPending ? (
          <View style={s.pendingScreen}>
            <Text style={s.pendingIcon}>🕐</Text>
            <Text style={s.pendingTitle}>Awaiting Approval</Text>
            <Text style={s.pendingMsg}>An admin needs to approve your account before you can view the worship lineup.</Text>
          </View>
        ) : (
          <>
            {tab === 'lineup'  && <LineupScreen  songs={approvedSongs} lineup={lineup} onToggle={toggleLineup} onMove={moveLineup} canEdit={canEdit} onEditSong={openAddSong} />}
            {tab === 'library' && <LibraryScreen songs={approvedSongs} lineup={lineup} onToggle={toggleLineup} onDelete={deleteSong} canEdit={canEdit} onEditSong={openAddSong} />}
            {tab === 'admin'   && isAdmin && <AdminScreen songs={songs||[]} lineup={lineup} users={users} currentUser={currentUser} onUpdateUsers={updateUsers} onApproveSong={approveSong} onRejectSong={rejectSong} />}
          </>
        )}
      </View>

      {/* ── BOTTOM TAB BAR ── */}
      {!isPending && !isWide && (
        <SafeAreaView edges={['bottom']} style={s.tabBarSafe}>
          <View style={s.tabBar}>
            {TABS.map(t => (
              <TouchableOpacity key={t.key} style={s.tabBtn} onPress={() => { setEditSong(null); setTab(t.key); }} activeOpacity={0.7}>
                <View style={s.tabIconWrap}>
                  <Text style={[s.tabIcon, tab === t.key && s.tabIconActive]}>{t.icon}</Text>
                  {t.badge > 0 && <View style={s.tabBadge}><Text style={s.tabBadgeText}>{t.badge}</Text></View>}
                </View>
                <Text style={[s.tabLabel, tab === t.key && s.tabLabelActive]}>{t.label}</Text>
                {tab === t.key && <View style={s.tabDot} />}
              </TouchableOpacity>
            ))}
            {canEdit && (
              <TouchableOpacity style={s.tabBtn} onPress={() => openAddSong()} activeOpacity={0.7}>
                <View style={s.tabIconWrap}>
                  <Text style={s.tabIcon}>➕</Text>
                </View>
                <Text style={s.tabLabel}>Add Song</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root:            { flex:1, backgroundColor:T.bg },
  loading:         { flex:1, backgroundColor:T.bg, alignItems:'center', justifyContent:'center' },
  loadingText:     { color:T.textSec, fontSize:15 },
  toastContainer:  { position:'absolute', top:0, left:0, right:0, zIndex:999 },
  headerSafe:      { backgroundColor:'#13161e', borderBottomWidth:1, borderBottomColor:T.border },
  header:          { flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:10, gap:10 },
  headerLogo:      { fontSize:22 },
  headerInfo:      { flex:1 },
  headerTitle:     { fontSize:16, fontWeight:'800', color:T.text },
  headerSub:       { fontSize:8, color:T.textMut, letterSpacing:1.5 },
  headerRight:     { flexDirection:'row', alignItems:'center', gap:8 },
  logoutIcon:      { color:T.textMut, fontSize:20, paddingLeft:4 },
  navLinks:        { flexDirection:'row', alignItems:'center', gap:18, marginRight:18 },
  navLinkBtn:      { paddingVertical:6 },
  navLinkText:     { fontSize:14, color:T.textSec, fontWeight:'600' },
  navLinkTextActive:{ color:T.gold },
  navAddBtn:       { backgroundColor:T.gold, borderRadius:8, paddingVertical:8, paddingHorizontal:14 },
  navAddBtnText:   { color:'#000', fontWeight:'700', fontSize:13 },
  modalBackdrop:   { flex:1, backgroundColor:'rgba(0,0,0,0.65)', alignItems:'center', justifyContent:'center', padding:20 },
  modalCard:       { backgroundColor:T.surface, borderWidth:1, borderColor:T.border, borderRadius:16, width:'100%', maxWidth:640, height:'90%', overflow:'hidden' },
  modalCloseBtn:   { position:'absolute', top:14, right:14, width:28, height:28, borderRadius:14, backgroundColor:T.card, alignItems:'center', justifyContent:'center', zIndex:10 },
  modalCloseText:  { color:T.textSec, fontSize:14, fontWeight:'700' },
  pendingBanner:   { backgroundColor:'#2e1a00', borderBottomWidth:1, borderBottomColor:T.gold+'44', padding:10, paddingHorizontal:16 },
  pendingBannerText:{ color:T.gold, fontSize:12 },
  content:         { flex:1 },
  pendingScreen:   { flex:1, alignItems:'center', justifyContent:'center', padding:32 },
  pendingIcon:     { fontSize:48, marginBottom:16 },
  pendingTitle:    { fontSize:24, fontWeight:'700', color:T.text, marginBottom:10 },
  pendingMsg:      { fontSize:14, color:T.textSec, textAlign:'center', lineHeight:22 },
  tabBarSafe:      { backgroundColor:T.surface, borderTopWidth:1, borderTopColor:T.border },
  tabBar:          { flexDirection:'row', paddingVertical:6 },
  tabBtn:          { flex:1, alignItems:'center', paddingVertical:4 },
  tabIconWrap:     { position:'relative' },
  tabIcon:         { fontSize:20, opacity:0.35 },
  tabIconActive:   { opacity:1 },
  tabLabel:        { fontSize:10, color:T.textMut, fontWeight:'600', marginTop:2 },
  tabLabelActive:  { color:T.gold, fontWeight:'700' },
  tabDot:          { width:4, height:4, borderRadius:2, backgroundColor:T.gold, marginTop:3 },
  tabBadge:        { position:'absolute', top:-4, right:-8, backgroundColor:T.red, borderRadius:99, minWidth:16, height:16, alignItems:'center', justifyContent:'center' },
  tabBadgeText:    { color:'#fff', fontSize:9, fontWeight:'800', paddingHorizontal:3 },
});
