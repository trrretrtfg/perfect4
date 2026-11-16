import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import Text from './Text';
import Icon from './Icon';
import { useColors } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { FONTS, RADIUS } from '../constants/config';
import { timeAgo } from '../lib/format';
import * as api from '../lib/api';

export default function RoomChat({ roomId, targetMessageId = null }) {
  const C = useColors();
  const me = useAuthStore((s) => s.user);
  const listRef = useRef(null);
  const didInitialScroll = useRef(false);
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const rows = await api.listRoomChatMessages(roomId, targetMessageId);
      setMessages(rows || []);
    } catch (e) {
      setError(e.message || 'تعذر تحميل المحادثة.');
    } finally {
      setLoading(false);
    }
  }, [roomId, targetMessageId]);

  useEffect(() => {
    let active = true;
    didInitialScroll.current = false;
    setLoading(true);
    load();
    const unsubscribe = api.subscribeRoomChatMessages(roomId, () => {
      api.listRoomChatMessages(roomId).then((rows) => {
        if (active) setMessages((current) => {
          const byId = new Map(current.map((item) => [item.id, item]));
          (rows || []).forEach((item) => byId.set(item.id, item));
          return [...byId.values()].sort((a, b) => Number(a.seq) - Number(b.seq));
        });
      }).catch(() => {});
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [load, roomId]);

  const scrollToInitialTarget = () => {
    if (didInitialScroll.current || !messages.length) return;
    const index = targetMessageId ? messages.findIndex((item) => item.id === targetMessageId) : -1;
    if (index >= 0) {
      listRef.current?.scrollToIndex({ index, animated: false, viewPosition: 0.5 });
    } else {
      listRef.current?.scrollToEnd({ animated: false });
    }
    didInitialScroll.current = true;
  };

  const send = async () => {
    const body = value.trim();
    if (!body || sending) return;
    setSending(true);
    try {
      const created = await api.sendRoomChatMessage(roomId, body);
      setMessages((current) => current.some((item) => item.id === created.id)
        ? current
        : [...current, created].sort((a, b) => Number(a.seq) - Number(b.seq)));
      setValue('');
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    } catch (e) {
      setError(e.message || 'تعذر إرسال الرسالة.');
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const mine = item.sender_id === me?.id;
    const highlighted = item.id === targetMessageId;
    return (
      <View style={{ width: '100%', alignItems: mine ? 'flex-start' : 'flex-end', paddingVertical: 4 }}>
        <View
          style={{
            maxWidth: '88%',
            minWidth: 72,
            paddingHorizontal: 13,
            paddingVertical: 9,
            borderRadius: RADIUS.card,
            backgroundColor: mine ? C.primary : C.surfaceAlt,
            borderWidth: highlighted ? 2 : 1,
            borderColor: highlighted ? C.primary : (mine ? C.primary : C.border),
          }}
        >
          {!mine ? (
            <Text variant="caption" bold color={C.textMuted} style={{ marginBottom: 3 }}>
              {item.profiles?.display_name || 'عضو'}
            </Text>
          ) : null}
          <Text color={mine ? C.onPrimary : C.text} style={{ lineHeight: 23 }}>
            {item.body}
          </Text>
          <Text
            variant="caption"
            color={mine ? C.onPrimary : C.textMuted}
            style={{ opacity: 0.72, marginTop: 4, textAlign: 'left' }}
          >
            {timeAgo(item.created_at)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, minHeight: 0 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
    >
      <View style={{ flex: 1, minHeight: 0, gap: 10 }}>
        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={C.primary} />
          </View>
        ) : error && messages.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Text color={C.danger}>{error}</Text>
            <Pressable onPress={load} style={{ padding: 10 }}>
              <Text bold color={C.primary}>إعادة المحاولة</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={scrollToInitialTarget}
            onScrollToIndexFailed={() => listRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={(
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 48 }}>
                <Icon name="comment" size={30} color={C.textMuted} />
                <Text bold style={{ marginTop: 10 }}>ابدأ المحادثة</Text>
                <Text variant="caption" muted>أرسل أول رسالة لأعضاء الغرفة.</Text>
              </View>
            )}
          />
        )}

        {error && messages.length > 0 ? (
          <Text variant="caption" color={C.danger}>{error}</Text>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 8,
            paddingTop: 8,
            paddingBottom: 8,
            borderTopWidth: 1,
            borderTopColor: C.border,
          }}
        >
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="اكتب رسالة..."
            placeholderTextColor={C.textMuted}
            multiline
            maxLength={4000}
            editable={!sending}
            textAlign="right"
            textAlignVertical="center"
            style={{
              flex: 1,
              minHeight: 46,
              maxHeight: 120,
              paddingHorizontal: 14,
              paddingVertical: 11,
              borderRadius: RADIUS.button,
              borderWidth: 1,
              borderColor: C.border,
              backgroundColor: C.surfaceAlt,
              color: C.text,
              fontFamily: FONTS.medium,
              fontSize: 14,
              writingDirection: 'rtl',
            }}
          />
          <Pressable
            onPress={send}
            disabled={!value.trim() || sending}
            accessibilityRole="button"
            accessibilityLabel="إرسال الرسالة"
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: !value.trim() || sending ? C.surfaceAlt : C.primary,
              opacity: sending ? 0.6 : 1,
            }}
          >
            {sending ? <ActivityIndicator size="small" color={!value.trim() || sending ? C.textMuted : C.onPrimary} /> : <Icon name="send" size={19} color={!value.trim() ? C.textMuted : C.onPrimary} />}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
