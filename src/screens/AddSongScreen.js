import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { T, CATEGORIES, makeId } from '../utils/constants';
import SectionEditor from '../components/SectionEditor';

const empty = () => ({ title:'', artist:'', category:'Joyful', contentType:'Worship', duration:'', youtubeLink:'', sections:[] });

export default function AddSongScreen({ editSong, isAdmin, onSave, onCancel }) {
  const [form, setForm]   = useState(empty());
  const [secs, setSecs]   = useState([]);

  useEffect(() => {
    if (editSong) {
      setForm({ title:editSong.title, artist:editSong.artist, category:editSong.category,
                contentType:editSong.contentType||'Worship', duration:editSong.duration||'',
                youtubeLink:editSong.youtubeLink||'', sections:editSong.sections||[] });
      setSecs(editSong.sections || []);
    } else {
      setForm(empty()); setSecs([]);
    }
  }, [editSong]);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const valid = form.title.trim() && form.artist.trim();

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <Text style={s.screenTitle}>{editSong ? 'Edit Song' : 'Add New Song'}</Text>

        {/* Song Info */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>SONG INFO</Text>

          <Text style={s.label}>Song Title *</Text>
          <TextInput style={s.input} value={form.title} onChangeText={v=>f('title',v)} placeholder="e.g. Amazing Grace" placeholderTextColor={T.textMut}/>

          <Text style={s.label}>Artist / Band *</Text>
          <TextInput style={s.input} value={form.artist} onChangeText={v=>f('artist',v)} placeholder="e.g. Hillsong Worship" placeholderTextColor={T.textMut}/>

          <View style={s.row2}>
            <View style={s.half}>
              <Text style={s.label}>Duration</Text>
              <TextInput style={s.input} value={form.duration} onChangeText={v=>f('duration',v)} placeholder="4:30" placeholderTextColor={T.textMut}/>
            </View>
            <View style={s.half}>
              <Text style={s.label}>YouTube Link</Text>
              <TextInput style={s.input} value={form.youtubeLink} onChangeText={v=>f('youtubeLink',v)} placeholder="https://…" placeholderTextColor={T.textMut} autoCapitalize="none"/>
            </View>
          </View>

          <Text style={s.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipRow}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity key={cat} onPress={() => f('category', cat)}
                style={[s.chip, form.category===cat && s.chipActive]}>
                <Text style={[s.chipText, form.category===cat && s.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={s.label}>Content Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipRow}>
            {['Worship','Praise','Hymn','Special'].map(ct => (
              <TouchableOpacity key={ct} onPress={() => f('contentType', ct)}
                style={[s.chip, form.contentType===ct && s.chipActive]}>
                <Text style={[s.chipText, form.contentType===ct && s.chipTextActive]}>{ct}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Song Structure */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>LYRICS SECTIONS</Text>
          <SectionEditor sections={secs} onChange={setSecs} readOnly={false}/>
        </View>

        {/* Buttons */}
        <View style={s.btnRow}>
          <TouchableOpacity style={[s.saveBtn, !valid && s.saveBtnDim]} onPress={() => valid && onSave({...form, sections:secs})} activeOpacity={0.85}>
            <Text style={s.saveBtnText}>{editSong ? 'Save Changes' : isAdmin ? 'Add Song' : 'Submit for Approval'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
            <Text style={s.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: T.bg },
  scroll:        { padding: 16 },
  screenTitle:   { fontSize: 16, fontWeight: '800', color: T.gold, marginBottom: 16 },
  section:       { backgroundColor: T.surface, borderWidth: 1, borderColor: T.border, borderRadius: 12, padding: 14, marginBottom: 14 },
  sectionLabel:  { fontSize: 10, color: T.textMut, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 },
  label:         { fontSize: 12, color: T.textSec, marginBottom: 5, marginTop: 8 },
  input:         { backgroundColor: T.card, borderWidth: 1, borderColor: T.border, color: T.text, borderRadius: 10, padding: 12, fontSize: 14 },
  row2:          { flexDirection: 'row', gap: 10 },
  half:          { flex: 1 },
  chipRow:       { marginTop: 4 },
  chip:          { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8, backgroundColor: T.card, borderWidth: 1, borderColor: T.border },
  chipActive:    { backgroundColor: T.gold + '22', borderColor: T.gold },
  chipText:      { fontSize: 13, color: T.textMut, fontWeight: '600' },
  chipTextActive:{ color: T.gold },
  btnRow:        { flexDirection: 'row', gap: 10, marginBottom: 48 },
  saveBtn:       { flex: 1, backgroundColor: T.gold, borderRadius: 10, padding: 14, alignItems: 'center' },
  saveBtnDim:    { backgroundColor: T.card },
  saveBtnText:   { color: '#000', fontWeight: '700', fontSize: 15 },
  cancelBtn:     { backgroundColor: T.card, borderWidth: 1, borderColor: T.border, borderRadius: 10, padding: 14, paddingHorizontal: 20 },
  cancelBtnText: { color: T.textSec, fontWeight: '600', fontSize: 14 },
});
