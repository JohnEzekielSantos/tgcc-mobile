import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { T, DEMO_USERS, ROLE_COLORS, ROLE_LABELS, ROLE_ICONS, avatarHue, initials } from '../utils/constants';
import { RoleBadge } from '../components/UI';

export default function LoginScreen({ onLogin }) {
  const [step, setStep]       = useState('main'); // main | email | name
  const [showDemo, setShowDemo] = useState(false);
  const [email, setEmail]     = useState('');
  const [name, setName]       = useState('');
  const [err, setErr]         = useState('');

  const handleNext = () => {
    const t = email.trim().toLowerCase();
    if (!t || !t.includes('@') || !t.includes('.')) { setErr('Enter a valid email address.'); return; }
    setErr('');
    setName(t.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
    setStep('name');
  };

  const handleSignIn = () => {
    onLogin({ email: email.trim().toLowerCase(), name: name.trim() || email.split('@')[0], picture: null, role: 'pending' });
  };

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={s.logoWrap}>
          <View style={s.logoBox}><Text style={s.logoIcon}>🎵</Text></View>
          <Text style={s.title}>TGCC Line-up</Text>
          <Text style={s.subtitle}>Worship Song Management System</Text>
        </View>

        <View style={s.card}>
          {/* ── MAIN ── */}
          {step === 'main' && (
            <>
              <Text style={s.cardSub}>Sign in to access the worship lineup</Text>
              <TouchableOpacity style={s.googleBtn} onPress={() => setStep('email')} activeOpacity={0.85}>
                <Text style={s.googleG}>G</Text>
                <Text style={s.googleText}>Continue with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.demoBtn} onPress={() => setShowDemo(true)} activeOpacity={0.8}>
                <Text style={s.demoBtnText}>Try Demo Accounts</Text>
              </TouchableOpacity>
              <Text style={s.hint}>Access is restricted. New accounts require admin approval before use.</Text>
            </>
          )}

          {/* ── EMAIL ── */}
          {step === 'email' && (
            <>
              <TouchableOpacity onPress={() => setStep('main')} style={s.backBtn}>
                <Text style={s.backText}>← Back</Text>
              </TouchableOpacity>
              <Text style={s.fieldLabel}>Email address</Text>
              <TextInput className="input" value={email} onChangeText={t => { setEmail(t); setErr(''); }}
                onSubmitEditing={handleNext} placeholder="you@gmail.com" placeholderTextColor={T.textMut}
                keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
                style={[s.input, err && s.inputErr]} />
              {!!err && <Text style={s.err}>{err}</Text>}
              <TouchableOpacity style={s.goldBtn} onPress={handleNext} activeOpacity={0.85}>
                <Text style={s.goldBtnText}>Continue →</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── NAME ── */}
          {step === 'name' && (
            <>
              <TouchableOpacity onPress={() => setStep('email')} style={s.backBtn}>
                <Text style={s.backText}>← Back</Text>
              </TouchableOpacity>
              <Text style={s.fieldLabel}>Display name</Text>
              <TextInput value={name} onChangeText={setName} onSubmitEditing={handleSignIn}
                placeholder="Your name" placeholderTextColor={T.textMut} style={s.input} />
              <Text style={s.hint}>Signing in as <Text style={{ color: T.gold }}>{email}</Text></Text>
              <TouchableOpacity style={s.goldBtn} onPress={handleSignIn} activeOpacity={0.85}>
                <Text style={s.goldBtnText}>Sign In</Text>
              </TouchableOpacity>
            </>
          )}

        </View>

        <Text style={s.footer}>The Grace Christian Church · Worship Ministry</Text>
      </ScrollView>

      {/* ── DEMO ACCOUNTS MODAL ── */}
      <Modal transparent visible={showDemo} animationType="fade" onRequestClose={() => setShowDemo(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <ScrollView contentContainerStyle={s.modalScroll} keyboardShouldPersistTaps="handled">
              <View style={s.modalHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardTitle}>Demo: Choose Account</Text>
                  <Text style={s.modalSub}>Simulate different role logins</Text>
                </View>
                <TouchableOpacity onPress={() => setShowDemo(false)} style={s.modalCloseBtn}>
                  <Text style={s.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              {DEMO_USERS.map(u => (
                <TouchableOpacity key={u.email} onPress={() => { setShowDemo(false); onLogin(u); }} activeOpacity={0.8}
                  style={s.demoRow}>
                  <View style={s.demoAvatar}><Text style={s.demoAvatarText}>{initials(u.name)}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.demoName}>{u.name}</Text>
                    <Text style={s.demoEmail}>{u.email}</Text>
                  </View>
                  <RoleBadge role={u.role} />
                </TouchableOpacity>
              ))}
              <View style={s.legendBox}>
                <Text style={s.legendTitle}>PERMISSIONS:</Text>
                {[['admin','full control: users, songs, lyrics, lineup'],['editor','add songs & edit lyrics only'],['viewer','choose & view Sunday lineup'],['pending','awaiting admin approval']].map(([r,desc])=>(
                  <Text key={r} style={[s.legendRow, { color: ROLE_COLORS[r] }]}>
                    <Text style={{ fontWeight:'700' }}>{ROLE_LABELS[r]}</Text> — {desc}
                  </Text>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:       { flex: 1, backgroundColor: T.bg },
  scroll:     { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logoWrap:   { alignItems: 'center', marginBottom: 32 },
  logoBox:    { width: 80, height: 80, borderRadius: 20, backgroundColor: '#2a1f00', borderWidth: 1, borderColor: T.gold + '44', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  logoIcon:   { fontSize: 36 },
  title:      { fontSize: 28, fontWeight: '800', color: T.text, letterSpacing: 0.5, marginBottom: 4 },
  subtitle:   { fontSize: 13, color: T.textSec },
  card:       { backgroundColor: T.surface, borderWidth: 1, borderColor: T.border, borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 },
  cardTitle:  { fontSize: 17, fontWeight: '700', color: T.text, marginBottom: 4 },
  cardSub:    { fontSize: 13, color: T.textSec, marginBottom: 20, textAlign: 'center' },
  googleBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12 },
  googleG:    { fontSize: 18, fontWeight: '800', color: '#4285F4' },
  googleText: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  demoBtn:    { borderWidth: 1, borderColor: T.border, borderRadius: 12, padding: 13, alignItems: 'center', marginBottom: 16 },
  demoBtnText:{ fontSize: 14, color: T.textSec, fontWeight: '600' },
  hint:       { fontSize: 11, color: T.textMut, textAlign: 'center', lineHeight: 16, marginBottom: 12 },
  backBtn:    { marginBottom: 14 },
  backText:   { color: T.textSec, fontSize: 13 },
  fieldLabel: { fontSize: 12, color: T.textSec, marginBottom: 6 },
  input:      { backgroundColor: T.card, borderWidth: 1, borderColor: T.border, color: T.text, borderRadius: 10, padding: 13, fontSize: 14, marginBottom: 8 },
  inputErr:   { borderColor: T.red },
  err:        { color: T.red, fontSize: 12, marginBottom: 8 },
  goldBtn:    { backgroundColor: T.gold, borderRadius: 10, padding: 13, alignItems: 'center', marginTop: 4 },
  goldBtnText:{ color: '#000', fontWeight: '700', fontSize: 15 },
  demoRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, borderRadius: 12, padding: 14, marginBottom: 8 },
  demoName:   { fontWeight: '700', fontSize: 14, color: T.text, marginBottom: 2 },
  demoEmail:  { fontSize: 12, color: T.textSec },
  legendBox:  { marginTop: 16, borderTopWidth: 1, borderTopColor: T.border, paddingTop: 14, gap: 4 },
  legendTitle:{ fontSize: 10, color: T.textMut, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  legendRow:  { fontSize: 12, lineHeight: 18 },
  footer:     { marginTop: 24, fontSize: 12, color: T.textMut },
  modalBackdrop:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalCard:      { backgroundColor: T.surface, borderWidth: 1, borderColor: T.border, borderRadius: 16, width: '100%', maxWidth: 440, maxHeight: '85%' },
  modalScroll:    { padding: 24 },
  modalHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  modalSub:       { fontSize: 13, color: T.textSec, marginTop: 2 },
  modalCloseBtn:  { width: 28, height: 28, borderRadius: 14, backgroundColor: T.card, alignItems: 'center', justifyContent: 'center' },
  modalCloseText: { color: T.textSec, fontSize: 14, fontWeight: '700' },
  demoAvatar:     { width: 44, height: 44, borderRadius: 22, backgroundColor: T.gold, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  demoAvatarText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
