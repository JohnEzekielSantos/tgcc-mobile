import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { T, CATEGORIES, CAT_COLORS, ROLE_COLORS, ROLE_LABELS } from '../utils/constants';
import { Avatar, CatTag, RoleBadge, Divider } from '../components/UI';

export default function AdminScreen({ songs, lineup, users, currentUser, onUpdateUsers, onApproveSong, onRejectSong }) {
  const [subTab, setSubTab] = useState('songs');
  const pending  = songs.filter(s => !s.approved);
  const approved = songs.filter(s => s.approved);

  const setRole = (email, role) => onUpdateUsers(users.map(u => u.email === email ? { ...u, role } : u));
  const removeUser = (email) => {
    Alert.alert('Remove user', `Remove ${email}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => onUpdateUsers(users.filter(u => u.email !== email)) },
    ]);
  };

  return (
    <View style={s.root}>
      {/* Sub-tabs */}
      <View style={s.subTabs}>
        {[['songs', `Songs (${pending.length} pending)`], ['users', `Users (${users.length})`], ['stats', 'Stats']].map(([k, l]) => (
          <TouchableOpacity key={k} onPress={() => setSubTab(k)} style={[s.subTab, subTab === k && s.subTabActive]}>
            <Text style={[s.subTabText, subTab === k && s.subTabTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── SONGS ── */}
      {subTab === 'songs' && (
        <ScrollView contentContainerStyle={s.scroll}>
          {pending.length > 0 && (
            <>
              <Text style={s.groupLabel}>PENDING APPROVAL</Text>
              {pending.map(song => (
                <View key={song.id} style={s.pendingCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.pendingTitle}>{song.title}</Text>
                    <Text style={s.pendingArtist}>{song.artist}</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                      <CatTag cat={song.category} />
                      <Text style={s.submittedBy}>by {song.submittedBy}</Text>
                    </View>
                  </View>
                  <View style={s.approvalBtns}>
                    <TouchableOpacity style={s.approveBtn} onPress={() => onApproveSong(song.id)}>
                      <Text style={s.approveBtnText}>✓ Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.rejectBtn} onPress={() => onRejectSong(song.id)}>
                      <Text style={s.rejectBtnText}>✕ Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <Divider style={{ marginVertical: 16 }} />
            </>
          )}
          <Text style={s.groupLabel}>ALL SONGS</Text>
          {approved.map((song, idx) => (
            <View key={song.id}>
              <View style={s.approvedRow}>
                <CatTag cat={song.category} />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={s.approvedTitle}>{song.title}</Text>
                  <Text style={s.approvedArtist}>{song.artist}</Text>
                </View>
                <Text style={s.approvedLabel}>approved</Text>
              </View>
              {idx < approved.length - 1 && <Divider />}
            </View>
          ))}
        </ScrollView>
      )}

      {/* ── USERS ── */}
      {subTab === 'users' && (
        <ScrollView contentContainerStyle={s.scroll}>
          {users.map(u => (
            <View key={u.email} style={s.userCard}>
              <Avatar user={u} size={40} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={s.userName} numberOfLines={1}>{u.name}</Text>
                <Text style={s.userEmail} numberOfLines={1}>{u.email}</Text>
              </View>
              <View style={s.roleBtns}>
                {['admin','editor','viewer','pending'].map(r => (
                  <TouchableOpacity key={r} onPress={() => setRole(u.email, r)}
                    style={[s.roleBtn, u.role === r && { backgroundColor: ROLE_COLORS[r]+'22', borderColor: ROLE_COLORS[r] }]}>
                    <Text style={[s.roleBtnText, u.role === r && { color: ROLE_COLORS[r] }]}>{ROLE_LABELS[r]}</Text>
                  </TouchableOpacity>
                ))}
                {u.email !== currentUser.email && (
                  <TouchableOpacity onPress={() => removeUser(u.email)} style={s.removeBtn}>
                    <Text style={s.removeBtnText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ── STATS ── */}
      {subTab === 'stats' && (
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={s.statsGrid}>
            {[[songs.filter(s=>s.approved).length,'Total Songs',T.gold],[lineup.length,'In Lineup',T.green],[songs.filter(s=>!s.approved).length,'Pending',T.red],[users.length,'Users',T.purple]].map(([v,l,c])=>(
              <View key={l} style={s.statCard}>
                <Text style={[s.statNum, { color:c }]}>{v}</Text>
                <Text style={s.statLabel}>{l}</Text>
              </View>
            ))}
          </View>
          <Text style={[s.groupLabel,{marginTop:20}]}>BY CATEGORY</Text>
          {CATEGORIES.map(cat => {
            const cnt = songs.filter(s=>s.category===cat&&s.approved).length;
            const pct = songs.length ? cnt/songs.length : 0;
            const col = CAT_COLORS[cat]||'#6b7280';
            return (
              <View key={cat} style={s.barRow}>
                <View style={[s.catChip,{backgroundColor:col+'22',borderColor:col+'44'}]}>
                  <Text style={[s.catChipText,{color:col}]}>{cat}</Text>
                </View>
                <View style={s.barBg}>
                  <View style={[s.barFill,{width:`${pct*100}%`,backgroundColor:col}]}/>
                </View>
                <Text style={s.barCount}>{cnt}</Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root:           { flex:1, backgroundColor:T.bg },
  subTabs:        { flexDirection:'row', backgroundColor:T.surface, borderBottomWidth:1, borderBottomColor:T.border },
  subTab:         { flex:1, padding:13, alignItems:'center', borderBottomWidth:2, borderBottomColor:'transparent' },
  subTabActive:   { borderBottomColor:T.gold },
  subTabText:     { fontSize:12, color:T.textMut, fontWeight:'600' },
  subTabTextActive:{ color:T.gold, fontWeight:'700' },
  scroll:         { padding:14 },
  groupLabel:     { fontSize:10, color:T.textMut, fontWeight:'700', letterSpacing:1.5, marginBottom:12 },
  pendingCard:    { backgroundColor:T.surface, borderWidth:1, borderColor:T.border, borderRadius:12, padding:14, marginBottom:10 },
  pendingTitle:   { fontWeight:'700', fontSize:15, color:T.text },
  pendingArtist:  { fontSize:13, color:T.textSec, marginTop:2 },
  submittedBy:    { fontSize:11, color:T.textMut, alignSelf:'center' },
  approvalBtns:   { flexDirection:'row', gap:8, marginTop:12 },
  approveBtn:     { flex:1, backgroundColor:'#0d2e1e', borderWidth:1, borderColor:T.green, borderRadius:8, padding:9, alignItems:'center' },
  approveBtnText: { color:T.green, fontWeight:'700', fontSize:13 },
  rejectBtn:      { flex:1, backgroundColor:'#2e0d0d', borderWidth:1, borderColor:T.red, borderRadius:8, padding:9, alignItems:'center' },
  rejectBtnText:  { color:T.red, fontWeight:'700', fontSize:13 },
  approvedRow:    { flexDirection:'row', alignItems:'center', paddingVertical:10 },
  approvedTitle:  { fontSize:14, color:T.text, fontWeight:'600' },
  approvedArtist: { fontSize:12, color:T.textSec },
  approvedLabel:  { fontSize:12, color:T.green, fontWeight:'600' },
  userCard:       { backgroundColor:T.surface, borderWidth:1, borderColor:T.border, borderRadius:12, padding:12, marginBottom:8, gap:8 },
  userName:       { fontWeight:'700', fontSize:14, color:T.text },
  userEmail:      { fontSize:11, color:T.textSec },
  roleBtns:       { flexDirection:'row', flexWrap:'wrap', gap:5, marginTop:6 },
  roleBtn:        { borderWidth:1, borderColor:T.border, borderRadius:20, paddingHorizontal:9, paddingVertical:4 },
  roleBtnText:    { fontSize:11, color:T.textMut, fontWeight:'600' },
  removeBtn:      { borderWidth:1, borderColor:'#7f1d1d', borderRadius:20, paddingHorizontal:9, paddingVertical:4 },
  removeBtnText:  { fontSize:12, color:T.red, fontWeight:'700' },
  statsGrid:      { flexDirection:'row', flexWrap:'wrap', gap:10 },
  statCard:       { backgroundColor:T.surface, borderWidth:1, borderColor:T.border, borderRadius:10, padding:14, flex:1, minWidth:'40%' },
  statNum:        { fontSize:26, fontWeight:'800' },
  statLabel:      { fontSize:11, color:T.textSec, marginTop:2 },
  barRow:         { flexDirection:'row', alignItems:'center', gap:8, marginBottom:8 },
  catChip:        { borderWidth:1, borderRadius:20, paddingHorizontal:8, paddingVertical:3, minWidth:70, alignItems:'center' },
  catChipText:    { fontSize:10, fontWeight:'700' },
  barBg:          { flex:1, backgroundColor:T.card, borderRadius:99, height:8, overflow:'hidden' },
  barFill:        { height:'100%', borderRadius:99 },
  barCount:       { fontSize:11, color:T.textMut, width:22, textAlign:'right' },
});
