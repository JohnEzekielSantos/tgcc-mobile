import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { T, ROLE_COLORS, ROLE_LABELS, ROLE_ICONS, CAT_COLORS, avatarHue, initials } from '../utils/constants';

// ─── AVATAR ──────────────────────────────────────────────────────────────────
export function Avatar({ user, size = 36, onPress }) {
  const name    = user?.name || '?';
  const picture = user?.picture || null;
  const bg      = `hsl(${avatarHue(user?.email || name)},55%,38%)`;
  const ini     = initials(name);
  const content = picture
    ? <Image source={{ uri: picture }} style={{ width: size, height: size, borderRadius: size / 2 }} />
    : <Text style={{ color: '#fff', fontSize: size * 0.36, fontWeight: '700' }}>{ini}</Text>;
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={{ width:size, height:size, borderRadius:size/2, backgroundColor:bg, alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }
  return (
    <View style={{ width:size, height:size, borderRadius:size/2, backgroundColor:bg, alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
      {content}
    </View>
  );
}

// ─── ROLE BADGE ──────────────────────────────────────────────────────────────
export function RoleBadge({ role }) {
  const color = ROLE_COLORS[role] || '#6b7280';
  const label = ROLE_LABELS[role] || role || 'Unknown';
  const icon  = ROLE_ICONS[role]  || '?';
  return (
    <View style={[s.badge, { backgroundColor: color + '22', borderColor: color + '55' }]}>
      <Text style={[s.badgeText, { color }]}>{icon} {label}</Text>
    </View>
  );
}

// ─── CATEGORY TAG ─────────────────────────────────────────────────────────────
export function CatTag({ cat }) {
  const color = CAT_COLORS[cat] || '#6b7280';
  return (
    <View style={[s.catTag, { backgroundColor: color + '22', borderColor: color + '44' }]}>
      <Text style={[s.catTagText, { color }]}>{cat}</Text>
    </View>
  );
}

// ─── SECTION PILL ─────────────────────────────────────────────────────────────
export function SectionPill({ label, color }) {
  return (
    <View style={[s.pill, { backgroundColor: color + '22', borderColor: color + '55' }]}>
      <Text style={[s.pillText, { color }]}>{label}</Text>
    </View>
  );
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
export function Toast({ msg, type = 'success', onDone }) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2400),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(onDone);
  }, []);
  const bg     = type === 'error' ? '#2e0d0d' : type === 'warn' ? '#2e1a00' : '#0d2e1a';
  const border = type === 'error' ? '#ef4444' : type === 'warn' ? '#d97706' : '#10b981';
  const icon   = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : '✅';
  return (
    <Animated.View style={[s.toast, { backgroundColor: bg, borderColor: border, opacity }]}>
      <Text style={s.toastIcon}>{icon}</Text>
      <Text style={s.toastText}>{msg}</Text>
    </Animated.View>
  );
}

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
export function Divider({ style }) {
  return <View style={[{ height: 1, backgroundColor: T.border }, style]} />;
}

const s = StyleSheet.create({
  badge:       { flexDirection:'row', alignItems:'center', borderWidth:1, borderRadius:20, paddingHorizontal:10, paddingVertical:3 },
  badgeText:   { fontSize:11, fontWeight:'700', letterSpacing:0.3 },
  catTag:      { borderWidth:1, borderRadius:20, paddingHorizontal:10, paddingVertical:3 },
  catTagText:  { fontSize:11, fontWeight:'700' },
  pill:        { borderWidth:1, borderRadius:10, paddingHorizontal:7, paddingVertical:2, marginRight:4, marginBottom:4 },
  pillText:    { fontSize:10, fontWeight:'700' },
  toast:       { position:'absolute', top:60, left:16, right:16, zIndex:999, borderWidth:1, borderRadius:12, padding:12, flexDirection:'row', alignItems:'center', gap:10, shadowColor:'#000', shadowOpacity:0.4, shadowRadius:8, elevation:8 },
  toastIcon:   { fontSize:16 },
  toastText:   { color:T.text, fontSize:13, fontWeight:'600', flex:1 },
});
