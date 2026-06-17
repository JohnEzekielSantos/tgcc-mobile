import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { T, CATEGORIES, SECTION_COLORS } from '../utils/constants';
import { CatTag, SectionPill, Divider } from '../components/UI';
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
        <ScrollView contentContainerStyle={{ padding: 18 }}>
          <View style={{ flexDirection:'row', gap:8, marginBottom:10, flexWrap:'wrap' }}>
            <CatTag cat={song.category} />
            {song.duration ? <Text style={{ color:T.textSec, fontSize:12 }}>{song.duration}</Text> : null}
          </View>
          <Text style={s.modalSongTitle}>{song.title}</Text>
          <Text style={s.modalArtist}>{song.artist}</Text>
          {(song.sections||[]).length>0 && <View style={{ flexDirection:'row', flexWrap:'wrap', marginBottom:8 }}>{song.sections.map(sec=><SectionPill key={sec.id} label={sec.label} color={SECTION_COLORS[sec.type]||'#6b7280'}/>)}</View>}
          <Divider style={{ marginVertical:16 }}/>
          <Text style={{ fontSize:11, color:T.textMut, fontWeight:'700', letterSpacing:1.5, marginBottom:12 }}>SONG STRUCTURE</Text>
          <SectionEditor sections={song.sections||[]} onChange={()=>{}} readOnly/>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function LibraryScreen({ songs, lineup, onToggle, onDelete, canEdit, onEditSong }) {
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('All');
  const [detailSong, setDetailSong] = useState(null);

  const filtered = songs.filter(s => {
    const mCat = filter === 'All' || s.category === filter;
    const q    = search.toLowerCase();
    return mCat && (s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
  });

  return (
    <View style={s.root}>
      <SongDetailModal song={detailSong} onClose={() => setDetailSong(null)}
        onEdit={() => { onEditSong(detailSong); setDetailSong(null); }} canEdit={canEdit} />

      {/* Search + filters */}
      <View style={s.controls}>
        <TextInput value={search} onChangeText={setSearch} placeholder="Search songs or artists…"
          placeholderTextColor={T.textMut} style={s.searchInput} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          {['All', ...CATEGORIES].map(cat => {
            const active = filter === cat;
            return (
              <TouchableOpacity key={cat} onPress={() => setFilter(cat)} activeOpacity={0.7}
                style={[s.filterChip, active && s.filterChipActive]}>
                <Text style={[s.filterChipText, active && s.filterChipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <Text style={s.count}>{filtered.length} song{filtered.length !== 1 ? 's' : ''}</Text>

      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.listCard}>
          {filtered.length === 0
            ? <Text style={s.empty}>No songs found.</Text>
            : filtered.map((song, idx) => {
              const inL     = lineup.includes(song.id);
              const hasSec  = (song.sections || []).length > 0;
              return (
                <View key={song.id}>
                  <TouchableOpacity onPress={() => setDetailSong(song)} activeOpacity={0.7}>
                    <View style={s.songRow}>
                      <View style={s.playBtn}><Text style={s.playIcon}>▶</Text></View>
                      <View style={s.songInfo}>
                        <Text style={s.songTitle} numberOfLines={1}>{song.title}</Text>
                        <Text style={s.songArtist}>{song.artist}</Text>
                      </View>
                      <CatTag cat={song.category} />
                      {song.duration ? <Text style={s.dur}>{song.duration}</Text> : null}
                    </View>
                    {hasSec && (
                      <View style={s.pillsRow}>
                        {song.sections.map(sec => <SectionPill key={sec.id} label={sec.label} color={SECTION_COLORS[sec.type] || '#6b7280'} />)}
                      </View>
                    )}
                  </TouchableOpacity>

                  {canEdit && (
                    <View style={s.actionRow}>
                      <TouchableOpacity onPress={() => onEditSong(song)} style={s.editBtn}>
                        <Text style={s.editBtnText}>✏  Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => onDelete(song.id)} style={s.delBtn}>
                        <Text style={s.delBtnText}>🗑  Delete</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => onToggle(song.id)}
                        style={[s.addBtn, inL && s.addBtnActive]}>
                        <Text style={[s.addBtnText, inL && s.addBtnTextActive]}>{inL ? '✓ Added' : '+ Add'}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {!canEdit && (
                    <View style={s.actionRow}>
                      <TouchableOpacity onPress={() => onToggle(song.id)}
                        style={[s.addBtn, inL && s.addBtnActive]}>
                        <Text style={[s.addBtnText, inL && s.addBtnTextActive]}>{inL ? '✓ Chosen' : '+ Choose'}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {idx < filtered.length - 1 && <Divider />}
                </View>
              );
            })
          }
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:              { flex: 1, backgroundColor: T.bg },
  controls:          { backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border, padding: 12 },
  searchInput:       { backgroundColor: T.card, borderWidth: 1, borderColor: T.border, color: T.text, borderRadius: 10, padding: 10, fontSize: 13 },
  filterChip:        { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 7, backgroundColor: T.card, borderWidth: 1, borderColor: T.border },
  filterChipActive:  { backgroundColor: T.gold + '22', borderColor: T.gold },
  filterChipText:    { fontSize: 12, color: T.textMut, fontWeight: '600' },
  filterChipTextActive:{ color: T.gold },
  count:             { fontSize: 11, color: T.textMut, paddingHorizontal: 14, paddingVertical: 8 },
  scroll:            { padding: 14, paddingTop: 0 },
  listCard:          { backgroundColor: T.surface, borderWidth: 1, borderColor: T.border, borderRadius: 14, overflow: 'hidden' },
  empty:             { padding: 32, textAlign: 'center', color: T.textMut, fontSize: 13 },
  songRow:           { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 },
  playBtn:           { width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  playIcon:          { color: T.textSec, fontSize: 9 },
  songInfo:          { flex: 1, minWidth: 0 },
  songTitle:         { fontWeight: '600', fontSize: 13, color: T.text },
  songArtist:        { fontSize: 11, color: T.textSec, marginTop: 1 },
  dur:               { fontSize: 11, color: T.textMut },
  pillsRow:          { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 8 },
  actionRow:         { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingBottom: 10 },
  editBtn:           { backgroundColor: T.card, borderWidth: 1, borderColor: T.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  editBtnText:       { color: T.blue, fontSize: 12, fontWeight: '600' },
  delBtn:            { backgroundColor: '#2e0d0d', borderWidth: 1, borderColor: '#5a2020', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  delBtnText:        { color: T.red, fontSize: 12, fontWeight: '600' },
  addBtn:            { marginLeft: 'auto', backgroundColor: T.card, borderWidth: 1, borderColor: T.border, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  addBtnActive:      { backgroundColor: T.green + '22', borderColor: T.green },
  addBtnText:        { color: T.textSec, fontSize: 12, fontWeight: '700' },
  addBtnTextActive:  { color: T.green },
  modalRoot:         { flex: 1, backgroundColor: T.bg },
  modalHeader:       { flexDirection: 'row', alignItems: 'center', backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border, paddingHorizontal: 16, paddingVertical: 14, paddingTop: 52 },
  modalClose:        { width: 36, alignItems: 'center' },
  modalCloseText:    { color: T.textSec, fontSize: 18 },
  modalTitle:        { flex: 1, textAlign: 'center', color: T.text, fontWeight: '700', fontSize: 15 },
  modalEditBtn:      { backgroundColor: T.card, borderWidth: 1, borderColor: T.border, borderRadius: 7, paddingHorizontal: 12, paddingVertical: 5 },
  modalEditText:     { color: T.blue, fontSize: 13, fontWeight: '700' },
  modalSongTitle:    { fontSize: 22, fontWeight: '800', color: T.text, marginBottom: 4 },
  modalArtist:       { fontSize: 14, color: T.textSec, marginBottom: 14 },
});
