import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const ACCENT = '#8B7CFF';   // paars
const SOFT = '#2E2A4A';     // donkerpaars voor operator-knoppen
const GREY = '#2A2A30';     // donkergrijze toetsen
const BG = '#17171B';       // achtergrond
const CARD = '#202026';     // kaart
const TEXT = '#F2F2F7';     // lichte tekst

const fmt = (v) => {
  if (!isFinite(v)) return 'Fout';
  if (Number.isInteger(v) && Math.abs(v) < 1e15) return String(v);
  return String(parseFloat(v.toFixed(10))).replace('.', ',');
};

const calc = (a, o, b) => {
  switch (o) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? NaN : a / b;
    default: return b;
  }
};

export default function App() {
  const [display, setDisplay] = useState('0');
  const [acc, setAcc] = useState(null);
  const [op, setOp] = useState(null);
  const [fresh, setFresh] = useState(true);

  const value = () => parseFloat(display.replace(',', '.'));

  const digit = (d) => {
    if (fresh || display === 'Fout') {
      setDisplay(d);
      setFresh(false);
    } else {
      setDisplay(display === '0' ? d : display + d);
    }
  };

  const comma = () => {
    if (fresh || display === 'Fout') {
      setDisplay('0,');
      setFresh(false);
    } else if (!display.includes(',')) {
      setDisplay(display + ',');
    }
  };

  const operator = (o) => {
    if (display === 'Fout') return;
    if (acc !== null && op && !fresh) {
      const r = calc(acc, op, value());
      setDisplay(fmt(r));
      if (!isFinite(r)) { setAcc(null); setOp(null); setFresh(true); return; }
      setAcc(r);
    } else {
      setAcc(value());
    }
    setOp(o);
    setFresh(true);
  };

  const equals = () => {
    if (acc === null || !op) return;
    setDisplay(fmt(calc(acc, op, value())));
    setAcc(null);
    setOp(null);
    setFresh(true);
  };

  const clear = () => {
    setDisplay('0'); setAcc(null); setOp(null); setFresh(true);
  };

  const sign = () => {
    if (display === '0' || display === 'Fout') return;
    setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
  };

  const percent = () => {
    if (display === 'Fout') return;
    setDisplay(fmt(value() / 100));
    setFresh(true);
  };

  const backspace = () => {
    if (fresh || display === 'Fout') return;
    const short = display.length <= 1 || (display.length === 2 && display.startsWith('-'));
    setDisplay(short ? '0' : display.slice(0, -1));
  };

  const Key = ({ label, onPress, bg = GREY, color = TEXT }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.key, { backgroundColor: bg, opacity: pressed ? 0.7 : 1 }]}
    >
      <Text style={[styles.keyText, { color }]}>{label}</Text>
    </Pressable>
  );
  const D = (n) => <Key label={n} onPress={() => digit(n)} />;
  const O = (s) => <Key label={s} onPress={() => operator(s)} bg={SOFT} color={ACCENT} />;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.title}>▦ Rekenmachine</Text>
        <Text style={styles.tagline}>Kleine sommen. Grote ideeën.</Text>

        <View style={styles.card}>
          <View style={styles.display}>
            <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
              {display}
            </Text>
          </View>

          <View style={styles.row}>
            <Key label="AC" onPress={clear} color={ACCENT} />
            <Key label="±" onPress={sign} color={ACCENT} />
            <Key label="%" onPress={percent} color={ACCENT} />
            {O('÷')}
          </View>
          <View style={styles.row}>{D('7')}{D('8')}{D('9')}{O('×')}</View>
          <View style={styles.row}>{D('4')}{D('5')}{D('6')}{O('−')}</View>
          <View style={styles.row}>{D('1')}{D('2')}{D('3')}{O('+')}</View>
          <View style={styles.row}>
            <Key label="⌫" onPress={backspace} />
            {D('0')}
            <Key label="," onPress={comma} />
            <Key label="=" onPress={equals} bg={ACCENT} color="#fff" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  container: { flex: 1, justifyContent: 'center', padding: 16, width: '100%', maxWidth: 420, alignSelf: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: TEXT },
  tagline: { color: '#8E8E99', marginTop: 4, marginBottom: 16 },
  card: { backgroundColor: CARD, borderRadius: 28, padding: 16 },
  display: { height: 110, backgroundColor: BG, borderRadius: 20, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 16, marginBottom: 8 },
  displayText: { fontSize: 44, fontWeight: '600', color: TEXT },
  row: { flexDirection: 'row' },
  key: { flex: 1, height: 64, margin: 5, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  keyText: { fontSize: 22, fontWeight: '600' },
});