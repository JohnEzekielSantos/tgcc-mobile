import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking, Modal } from 'react-native';
import { T, MINISTRY_TEAM, SERVICE_INFO, SECTION_COLORS } from '../utils/constants';
import { Avatar, CatTag, SectionPill, Divider } from '../components/UI';
import SectionEditor from '../components/SectionEditor';

function SongDetailModal({ song, onClose, onEdit, canEdit }) {
  if (!song) return null;
  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={s.modalRoot}>
        <View style={s.modalHeader}>
          <TouchableOpacity onPress={onClose} style={s.modalClose}><Text style={s.modalCloseText}>✕</Text></TouchableOpacity>
          <Text style={s.modalTitle} numberOfLines={1}>{song.title}</Text>
          {canEdit
            ? <TouchableOpacity onPress={onEdit} style={s.modalEditBtn}><Text style={s.modalEditText}>Edit</Text></TouchableOpacity>
            : <View style={{ width: 56 }} />}
        </View>
        <ScrollView contentContainerStyle={s.modalScroll}>
          <View style={s.metaRow}>
            <CatTag cat={song.category} />
            {song.duration ? <Text style={s.metaDur}>{song.duration}</Text> : null}
          </View>
          <Text style={s.modalSongTitle}>{song.title}</Text>
          <Text style={s.modalArtist}>{song.artist}</Text>
          {!!song.youtubeLink && (
            <TouchableOpacity style={s.ytBtn} onPress={() => Linking.openURL(song.youtubeLink)}>
              <Text style={s.ytText}>▶  Open on YouTube</Text>
            </TouchableOpacity>
          )}
          {(song.sections || []).length > 0 && (
            <View style={s.pillsRow}>
              {song.sections.map(sec => <SectionPill key={sec.id} label={sec.label} color={SECTION_COLORS[sec.type] || '#6b7280'} />)}
            </View>
          )}
          <Divider style={{ marginVertical: 16 }} />
          <Text style={s.structLabel}>SONG STRUCTURE</Text>
          <SectionEditor sections={song.sections || []} onChange={() => {}} readOnly />
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function LineupScreen({ songs, lineup, onToggle, onMove, canEdit, onEditSong }) {
  const [detailSong, setDetailSong] = useState(null);
  const lineupSongs = lineup.map(id => songs.find(s => s.id === id)).filter(Boolean);

  return (
    <View style={s.root}>
      <SongDetailModal song={detailSong} onClose={() => setDetailSong(null)}
        onEdit={() => { onEditSong(detailSong); setDetailSong(null); }} canEdit={canEdit} />

      <ScrollView contentContainerStyle={s.scroll}>
        {/* Service card */}
        <View style={s.serviceCard}>
          <View style={{ flex: 1 }}>
            <Text style={s.serviceEyebrow}>⭐  SUNDAY WORSHIP</Text>
            <Text style={s.serviceTheme}>{SERVICE_INFO.theme}</Text>
            <Text style={s.serviceDate}>{SERVICE_INFO.date}</Text>
            <Text style={s.serviceNote}>{SERVICE_INFO.note}</Text>
          </View>
          <View style={s.dateBox}>
            <Text style={s.dateNum}>{SERVICE_INFO.day}</Text>
            <Text style={s.dateMon}>{SERVICE_INFO.month}</Text>
          </View>
        </View>

        {/* Songs for Sunday */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardHeaderText}>≡  Songs for Sunday</Text>
            <View style={s.countPill}><Text style={s.countText}>({lineupSongs.length})</Text></View>
          </View>
          {lineupSongs.length === 0
            ? <Text style={s.empty}>No songs yet. Go to Library to add songs.</Text>
            : lineupSongs.map((song, i) => (
              <TouchableOpacity key={song.id} onPress={() => setDetailSong(song)} activeOpacity={0.7}>
                <View style={s.songRow}>
                  <Text style={s.songNum}>{i + 1}</Text>
                  <View style={s.playBtn}><Text style={s.playIcon}>▶</Text></View>
                  <View style={s.songInfo}>
                    <Text style={s.songTitle} numberOfLines={1}>{song.title}</Text>
                    <Text style={s.songArtist}>{song.artist}</Text>
                  </View>
                  <CatTag cat={song.category} />
                  {song.duration ? <Text style={s.songDur}>{song.duration}</Text> : null}
                  {canEdit && (
                    <View style={s.rowActions}>
                      <TouchableOpacity onPress={() => onMove(i, -1)} disabled={i === 0}>
                        <Text style={[s.arrowBtn, i === 0 && s.arrowDim]}>▲</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => onMove(i, 1)} disabled={i === lineupSongs.length - 1}>
                        <Text style={[s.arrowBtn, i === lineupSongs.length - 1 && s.arrowDim]}>▼</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => onToggle(song.id)}>
                        <Text style={s.removeBtn}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                {(song.sections || []).length > 0 && (
                  <View style={s.pillsStrip}>
                    {song.sections.map(sec => <SectionPill key={sec.id} label={sec.label} color={SECTION_COLORS[sec.type] || '#6b7280'} />)}
                  </View>
                )}
                <Divider />
              </TouchableOpacity>
            ))
          }
        </View>

        {/* Ministry Team */}
        <View style={s.card}>
          <Text style={s.ministryTitle}>👥  Ministry Team</Text>
          {[['🎸  MUSICIANS', MINISTRY_TEAM.musicians], ['🎤  VOCALS', MINISTRY_TEAM.vocals], ['⚙️  TECHNICAL', MINISTRY_TEAM.technical]].map(([label, members], gi) => (
            <View key={label}>
              {gi > 0 && <Divider style={{ marginVertical: 12 }} />}
              <Text style={s.groupLabel}>{label}</Text>
              {members.map(m => (
                <View key={m.name} style={s.memberRow}>
                  <Avatar user={{ name: m.name, email: m.name }} size={32} />
                  <Text style={s.memberName}>{m.name}</Text>
                  <Text style={s.memberRole}>{m.role}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: T.bg },
  scroll:        { padding: 14, gap: 14 },
  serviceCard:   { backgroundColor: '#1a1520', borderWidth: 1, borderColor: '#2d2850', borderRadius: 14, padding: 18, flexDirection: 'row', gap: 12 },
  serviceEyebrow:{ fontSize: 11, color: T.gold, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  serviceTheme:  { fontSize: 17, fontWeight: '800', color: T.text, marginBottom: 4, lineHeight: 22 },
  serviceDate:   { fontSize: 12, color: T.textSec, marginBottom: 10 },
  serviceNote:   { fontSize: 12, color: T.textMut, lineHeight: 17 },
  dateBox:       { alignItems: 'flex-end', justifyContent: 'flex-start' },
  dateNum:       { fontSize: 44, fontWeight: '800', color: T.gold, lineHeight: 48 },
  dateMon:       { fontSize: 12, color: T.textSec },
  card:          { backgroundColor: T.surface, borderWidth: 1, borderColor: T.border, borderRadius: 14, overflow: 'hidden' },
  cardHeader:    { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderBottomWidth: 1, borderBottomColor: T.border },
  cardHeaderText:{ fontWeight: '700', fontSize: 15, color: T.text },
  countPill:     { backgroundColor: T.card, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 },
  countText:     { fontSize: 12, color: T.textSec },
  empty:         { padding: 28, textAlign: 'center', color: T.textMut, fontSize: 13 },
  songRow:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  songNum:       { color: T.textMut, fontWeight: '700', fontSize: 13, width: 18, textAlign: 'center' },
  playBtn:       { width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  playIcon:      { color: T.textSec, fontSize: 9 },
  songInfo:      { flex: 1, minWidth: 0 },
  songTitle:     { fontWeight: '600', fontSize: 13, color: T.text },
  songArtist:    { fontSize: 11, color: T.textSec, marginTop: 1 },
  songDur:       { fontSize: 11, color: T.textMut },
  rowActions:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  arrowBtn:      { color: T.blue, fontSize: 13, padding: 2 },
  arrowDim:      { color: T.border },
  removeBtn:     { color: T.red, fontSize: 16, padding: 2 },
  pillsStrip:    { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, paddingBottom: 8 },
  ministryTitle: { fontWeight: '700', fontSize: 15, color: T.text, padding: 14, paddingBottom: 12 },
  groupLabel:    { fontSize: 10, color: T.textMut, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10, paddingHorizontal: 14 },
  memberRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, marginBottom: 10 },
  memberName:    { flex: 1, fontSize: 14, color: T.text, fontWeight: '500' },
  memberRole:    { fontSize: 12, color: T.textSec },
  // Detail modal
  modalRoot:     { flex: 1, backgroundColor: T.bg },
  modalHeader:   { flexDirection: 'row', alignItems: 'center', backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border, paddingHorizontal: 16, paddingVertical: 14, paddingTop: 52 },
  modalClose:    { width: 36, alignItems: 'center' },
  modalCloseText:{ color: T.textSec, fontSize: 18 },
  modalTitle:    { flex: 1, textAlign: 'center', color: T.text, fontWeight: '700', fontSize: 15 },
  modalEditBtn:  { backgroundColor: T.card, borderWidth: 1, borderColor: T.border, borderRadius: 7, paddingHorizontal: 12, paddingVertical: 5 },
  modalEditText: { color: T.blue, fontSize: 13, fontWeight: '700' },
  modalScroll:   { padding: 18 },
  metaRow:       { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  metaDur:       { fontSize: 12, color: T.textSec },
  modalSongTitle:{ fontSize: 22, fontWeight: '800', color: T.text, marginBottom: 4, lineHeight: 28 },
  modalArtist:   { fontSize: 14, color: T.textSec, marginBottom: 14 },
  ytBtn:         { backgroundColor: '#2a1010', borderWidth: 1, borderColor: '#7a2020', borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 14 },
  ytText:        { color: '#ff5555', fontWeight: '700', fontSize: 14 },
  pillsRow:      { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  structLabel:   { fontSize: 11, color: T.textMut, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 },
});
