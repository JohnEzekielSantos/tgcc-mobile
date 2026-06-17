import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { T, SECTION_TYPES, SECTION_COLORS, makeId, romanize } from '../utils/constants';

export default function SectionEditor({ sections, onChange, readOnly }) {
  const addSection = (type) => {
    const count = sections.filter(s => s.type === type).length;
    const label = count === 0 ? type : `${type} ${romanize(count + 1)}`;
    if (count === 1) {
      const updated = sections.map(s =>
        s.type === type && s.label === type ? { ...s, label: `${type} ${romanize(1)}` } : s
      );
      onChange([...updated, { id: makeId(), type, label, lyrics: '' }]);
    } else {
      onChange([...sections, { id: makeId(), type, label, lyrics: '' }]);
    }
  };
  const upd  = (id, field, val) => onChange(sections.map(s => s.id === id ? { ...s, [field]: val } : s));
  const del  = (id)  => onChange(sections.filter(s => s.id !== id));
  const move = (idx, dir) => {
    const arr = [...sections]; const t = idx + dir;
    if (t < 0 || t >= arr.length) return;
    [arr[idx], arr[t]] = [arr[t], arr[idx]]; onChange(arr);
  };

  return (
    <View>
      {!readOnly && (
        <View style={s.addRow}>
          <Text style={s.addLabel}>ADD SECTION</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            {SECTION_TYPES.map(type => {
              const col = SECTION_COLORS[type] || '#6b7280';
              return (
                <TouchableOpacity key={type} onPress={() => addSection(type)} activeOpacity={0.7}
                  style={[s.typeBtn, { borderColor: col + '66', backgroundColor: col + '1a' }]}>
                  <Text style={[s.typeBtnText, { color: col }]}>+ {type}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {sections.length === 0 && (
        <Text style={s.empty}>{readOnly ? 'No structure added yet.' : 'Tap buttons above to build the song structure.'}</Text>
      )}

      {sections.map((sec, idx) => {
        const col = SECTION_COLORS[sec.type] || '#6b7280';
        return (
          <View key={sec.id} style={[s.card, { borderColor: col + '44' }]}>
            <View style={[s.header, { backgroundColor: col + '18', borderBottomColor: col + '33' }]}>
              <View style={[s.bar, { backgroundColor: col }]} />
              {readOnly
                ? <Text style={[s.secLabel, { color: col }]}>{sec.label}</Text>
                : <TextInput value={sec.label} onChangeText={v => upd(sec.id, 'label', v)}
                    style={[s.secInput, { color: col }]} />
              }
              <View style={[s.typePill, { backgroundColor: col + '22', borderColor: col + '44' }]}>
                <Text style={[s.typePillText, { color: col }]}>{sec.type}</Text>
              </View>
              {!readOnly && (
                <View style={s.actions}>
                  <TouchableOpacity onPress={() => move(idx, -1)} disabled={idx === 0}>
                    <Text style={[s.arrow, idx === 0 && s.arrowDim]}>▲</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => move(idx, 1)} disabled={idx === sections.length - 1}>
                    <Text style={[s.arrow, idx === sections.length - 1 && s.arrowDim]}>▼</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => del(sec.id)}>
                    <Text style={s.del}>🗑</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {readOnly
              ? <Text style={[s.lyricsRead, !sec.lyrics && s.lyricsEmpty]}>{sec.lyrics || 'No lyrics added.'}</Text>
              : <TextInput value={sec.lyrics} onChangeText={v => upd(sec.id, 'lyrics', v)}
                  placeholder="Type lyrics here, one line per row…" placeholderTextColor={T.textMut}
                  multiline style={s.lyricsInput} />
            }
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  addRow:      { marginBottom: 12 },
  addLabel:    { fontSize: 10, color: T.textMut, fontWeight: '700', letterSpacing: 1.5 },
  typeBtn:     { borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  typeBtnText: { fontSize: 12, fontWeight: '700' },
  empty:       { color: T.textMut, fontSize: 12, textAlign: 'center', paddingVertical: 20, fontStyle: 'italic' },
  card:        { borderWidth: 1, borderRadius: 10, marginBottom: 10, overflow: 'hidden', backgroundColor: T.bg },
  header:      { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, gap: 8 },
  bar:         { width: 3, alignSelf: 'stretch', borderRadius: 2, flexShrink: 0 },
  secLabel:    { fontWeight: '700', fontSize: 13, flex: 1 },
  secInput:    { fontWeight: '700', fontSize: 13, flex: 1, padding: 0 },
  typePill:    { borderWidth: 1, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  typePillText:{ fontSize: 10, fontWeight: '700' },
  actions:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  arrow:       { color: T.blue, fontSize: 13, paddingHorizontal: 2 },
  arrowDim:    { color: T.border },
  del:         { fontSize: 15 },
  lyricsRead:  { padding: 12, fontSize: 13, color: T.text, lineHeight: 20 },
  lyricsEmpty: { color: T.textMut, fontStyle: 'italic' },
  lyricsInput: { padding: 12, fontSize: 13, color: T.text, lineHeight: 20, minHeight: 80, textAlignVertical: 'top' },
});
