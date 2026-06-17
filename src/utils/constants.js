// ─── THEME ────────────────────────────────────────────────────────────────────
export const T = {
  bg:      '#0d0f14',
  surface: '#13161e',
  card:    '#1a1d27',
  cardHov: '#1e2230',
  border:  '#252836',
  gold:    '#d97706',
  goldLt:  '#f59e0b',
  text:    '#e8eaf0',
  textSec: '#8b90a0',
  textMut: '#555870',
  green:   '#10b981',
  blue:    '#3b82f6',
  purple:  '#8b5cf6',
  red:     '#ef4444',
};

export const CATEGORIES   = ['Joyful','Solemn','Meditative','Praise','Worship','Hymn','Special'];
export const SECTION_TYPES= ['Intro','Verse','Pre-Chorus','Chorus','Bridge','Interlude','Outro','Tag'];

export const SECTION_COLORS = {
  Intro:'#3b82f6', Verse:'#10b981', 'Pre-Chorus':'#f59e0b',
  Chorus:'#f59e0b', Bridge:'#8b5cf6', Interlude:'#06b6d4',
  Outro:'#6366f1', Tag:'#f97316',
};

export const CAT_COLORS = {
  Joyful:'#d97706', Solemn:'#6366f1', Meditative:'#8b5cf6',
  Praise:'#10b981', Worship:'#3b82f6', Hymn:'#06b6d4', Special:'#f43f5e',
};

export const ROLE_COLORS  = { admin:'#d97706', editor:'#3b82f6', viewer:'#10b981', pending:'#d97706' };
export const ROLE_LABELS  = { admin:'Admin', editor:'Editor', viewer:'Viewer', pending:'Pending' };
export const ROLE_ICONS   = { admin:'🛡', editor:'✏️', viewer:'👁', pending:'🕐' };

export const MINISTRY_TEAM = {
  musicians: [
    { name:'Michael', role:'Piano' },
    { name:'John',    role:'Guitar 1' },
    { name:'Mark',    role:'Guitar 2' },
    { name:'El',      role:'Bass' },
    { name:'Joey',    role:'Drums' },
  ],
  vocals: [
    { name:'Mina',   role:'Song Leader' },
    { name:'Erick',  role:'Backup' },
    { name:'Merlyn', role:'Backup' },
  ],
  technical: [
    { name:'Jhun',   role:'Sounds & Audio' },
    { name:'Girlie', role:'AVP' },
    { name:'Hanie',  role:'Camera' },
  ],
};

export const DEMO_USERS = [
  { email:'juan@tgcc.org',  name:'Juan dela Cruz', role:'admin',  picture:null },
  { email:'maria@tgcc.org', name:'Maria Santos',   role:'editor', picture:null },
  { email:'pedro@tgcc.org', name:'Pedro Reyes',    role:'viewer', picture:null },
  { email:'ana@gmail.com',  name:'Ana Garcia',     role:'pending',picture:null },
];

export const DEFAULT_SONGS = [
  { id:1, title:'Passion Overcome',     artist:'Planetshakers',       category:'Joyful', duration:'5:23', sections:[], approved:true,  submittedBy:'admin' },
  { id:2, title:'Overflow',             artist:'The Corners & Co',    category:'Solemn', duration:'7:15', sections:[], approved:true,  submittedBy:'admin' },
  { id:3, title:'Great Are You Lord',   artist:'All Sons & Daughters', category:'Praise', duration:'4:48', sections:[], approved:true,  submittedBy:'admin' },
  { id:4, title:'Mighty Praise Music',  artist:'Victory Worship',     category:'Joyful', duration:'4:10', sections:[], approved:true,  submittedBy:'admin' },
  { id:5, title:'Bishop Rip Domination',artist:'Bishop Rip',          category:'Joyful', duration:'3:55', sections:[], approved:true,  submittedBy:'admin' },
  { id:6, title:'Faithful God',         artist:'All Sons & Daughters', category:'Hymn',   duration:'5:12', sections:[], approved:false, submittedBy:'ana@gmail.com' },
];

export const DEFAULT_LINEUP = [1,2,3,4];

export const SERVICE_INFO = {
  theme: 'He Is Risen — Walking in New Life',
  date:  'Monday, June 22, 2026',
  day:   '22',
  month: 'Jun 2026',
  note:  'Please be at the church by 7:30 AM for sound check. Rehearsal starts at 8:00 AM sharp.',
};

export const SK = {
  SONGS:   'tgcc_v4_songs',
  LINEUP:  'tgcc_v4_lineup',
  SESSION: 'tgcc_v4_session',
  USERS:   'tgcc_v4_users',
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
export const avatarHue  = (s='') => s.split('').reduce((a,c)=>a+c.charCodeAt(0),0)%360;
export const makeId     = () => Date.now() + Math.floor(Math.random()*1000);
export const romanize   = (n) => ['','I','II','III','IV','V'][n]||String(n);
export const initials   = (name='') => name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
