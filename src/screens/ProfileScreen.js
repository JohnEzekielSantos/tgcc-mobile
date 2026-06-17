import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { T, ROLE_COLORS, avatarHue, initials } from '../utils/constants';
import { RoleBadge } from '../components/UI';

export default function ProfileScreen({ user, onSave, onClose }) {
  const [name, setName]       = useState(user.name || '');
  const [picture, setPicture] = useState(user.picture || null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Please allow access to your photo library.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const uri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
      setPicture(uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Please allow camera access.'); return; }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.7, base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const uri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
      setPicture(uri);
    }
  };

  const showPicker = () => {
    Alert.alert('Profile Photo', 'Choose how to set your photo', [
      { text: '📷 Take Photo',       onPress: takePhoto },
      { text: '🖼 Choose from Library', onPress: pickImage },
      ...(picture ? [{ text: '🗑 Remove Photo', style: 'destructive', onPress: () => setPicture(null) }] : []),
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const bg  = `hsl(${avatarHue(user.email || user.name)},55%,38%)`;
  const ini = initials(name || user.name);

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={onClose} style={s.closeBtn}>
          <Text style={s.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={() => onSave({ name: name.trim() || user.name, picture })} style={s.saveBtn}>
          <Text style={s.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {/* Avatar */}
        <TouchableOpacity style={s.avatarWrap} onPress={showPicker} activeOpacity={0.8}>
          <View style={[s.avatarCircle, { backgroundColor: bg }]}>
            {picture
              ? <Image source={{ uri: picture }} style={s.avatarImg} />
              : <Text style={s.avatarInitials}>{ini}</Text>
            }
          </View>
          <View style={s.cameraOverlay}>
            <Text style={s.cameraIcon}>📷</Text>
            <Text style={s.cameraLabel}>Change</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={s.uploadBtn} onPress={showPicker} activeOpacity={0.8}>
          <Text style={s.uploadBtnText}>📷  Upload / Take Photo</Text>
        </TouchableOpacity>

        {/* Fields */}
        <View style={s.section}>
          <Text style={s.label}>Display Name</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={T.textMut} style={s.input} />

          <Text style={s.label}>Email</Text>
          <View style={s.readonlyField}>
            <Text style={s.readonlyText}>{user.email}</Text>
          </View>

          <Text style={s.label}>Role</Text>
          <View style={s.readonlyField}>
            <RoleBadge role={user.role} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:           { flex: 1, backgroundColor: T.bg },
  header:         { flexDirection: 'row', alignItems: 'center', backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border, paddingHorizontal: 16, paddingVertical: 14, paddingTop: 52 },
  closeBtn:       { width: 36, alignItems: 'center' },
  closeText:      { color: T.textSec, fontSize: 18 },
  headerTitle:    { flex: 1, textAlign: 'center', color: T.text, fontWeight: '700', fontSize: 16 },
  saveBtn:        { backgroundColor: T.gold, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 6 },
  saveBtnText:    { color: '#000', fontWeight: '700', fontSize: 14 },
  scroll:         { padding: 24, alignItems: 'center' },
  avatarWrap:     { position: 'relative', marginBottom: 12 },
  avatarCircle:   { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 3, borderColor: T.gold + '55' },
  avatarImg:      { width: 100, height: 100 },
  avatarInitials: { color: '#fff', fontSize: 36, fontWeight: '700' },
  cameraOverlay:  { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', paddingVertical: 6, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
  cameraIcon:     { fontSize: 14 },
  cameraLabel:    { fontSize: 9, color: '#fff', fontWeight: '700' },
  uploadBtn:      { borderWidth: 1, borderColor: T.border, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20, marginBottom: 28 },
  uploadBtnText:  { color: T.textSec, fontSize: 14, fontWeight: '600' },
  section:        { width: '100%', gap: 4 },
  label:          { fontSize: 12, color: T.textSec, marginBottom: 5, marginTop: 12 },
  input:          { backgroundColor: T.card, borderWidth: 1, borderColor: T.border, color: T.text, borderRadius: 10, padding: 13, fontSize: 14 },
  readonlyField:  { backgroundColor: T.card, borderWidth: 1, borderColor: T.border, borderRadius: 10, padding: 13, opacity: 0.6 },
  readonlyText:   { color: T.textSec, fontSize: 14 },
});
