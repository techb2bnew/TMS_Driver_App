import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import Icon from '../../components/Icon';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import { accentColor, borderColor, cardBgSoft, placeholderColor, textDark, whiteColor } from '../../constant/Color';
import { MessagesText } from '../../constant/Constants';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/format';

type ChatMessage = {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  created_at: string;
};

export default function MessagesScreen() {
  const { driver } = useAuth();
  const [adminId, setAdminId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    let mounted = true;
    supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (mounted) setAdminId(data?.id ?? null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!driver || !adminId) return;

    let mounted = true;

    // Marks every message the admin has sent into this thread as read —
    // called on open, and again for each new one that arrives while the
    // driver is actively looking at this screen (so the tab badge clears).
    function markThreadRead() {
      supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('sender_id', adminId)
        .eq('recipient_id', driver!.id)
        .is('read_at', null)
        .then();
    }

    supabase
      .from('messages')
      .select('id, sender_id, recipient_id, body, created_at')
      .or(
        `and(sender_id.eq.${driver.id},recipient_id.eq.${adminId}),and(sender_id.eq.${adminId},recipient_id.eq.${driver.id})`,
      )
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (mounted) setMessages(data ?? []);
        markThreadRead();
      });

    const channel = supabase
      .channel(`messages-${driver.id}-${adminId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        payload => {
          const row = payload.new as ChatMessage;
          const involvesThisThread =
            (row.sender_id === driver.id && row.recipient_id === adminId) ||
            (row.sender_id === adminId && row.recipient_id === driver.id);
          if (involvesThisThread) {
            setMessages(prev => [...prev, row]);
            if (row.sender_id === adminId) markThreadRead();
          }
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [driver, adminId]);

  useEffect(() => {
    if (messages.length > 0) listRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  async function handleSend() {
    if (!draft.trim() || !driver || !adminId) return;
    setSending(true);
    const { error } = await supabase
      .from('messages')
      .insert({ sender_id: driver.id, recipient_id: adminId, body: draft.trim() });
    setSending(false);
    if (!error) setDraft('');
  }

  return (
    <ScreenContainer style={styles.container}>
      <ScreenHeader title={MessagesText.title} subtitle={MessagesText.subtitle} showBack={false} />

      {!adminId ? (
        <View style={[BaseStyle.flex, BaseStyle.alignItemsCenter, BaseStyle.justifyContentCenter]}>
          <Text style={[style.fontSizeNormal1x, styles.emptyText]}>{MessagesText.noAdmin}</Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={BaseStyle.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 40}
        >
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={[style.fontSizeNormal1x, styles.emptyText]}>{MessagesText.noMessages}</Text>
              </View>
            }
            renderItem={({ item }) => {
              const fromDriver = item.sender_id === driver?.id;
              return (
                <View style={[styles.bubbleRow, fromDriver ? styles.bubbleRowRight : styles.bubbleRowLeft]}>
                  <View style={[styles.bubble, fromDriver ? styles.bubbleMine : styles.bubbleTheirs]}>
                    <Text style={[style.fontSizeNormal1x, fromDriver ? styles.bubbleTextMine : styles.bubbleTextTheirs]}>
                      {item.body}
                    </Text>
                    <Text
                      style={[
                        style.fontSizeSmall,
                        styles.bubbleTimestamp,
                        fromDriver ? styles.bubbleTimestampMine : styles.bubbleTimestampTheirs,
                      ]}
                    >
                      {formatDate(item.created_at)}
                    </Text>
                  </View>
                </View>
              );
            }}
          />

          <View style={styles.inputRow}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={MessagesText.typePlaceholder}
              placeholderTextColor={placeholderColor}
              style={[style.fontSizeSmall2x, styles.input]}
              multiline
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!draft.trim() || sending}
              activeOpacity={0.8}
              style={[styles.sendButton, (!draft.trim() || sending) && styles.sendButtonDisabled]}
            >
              <Icon name="send" size={18} color={whiteColor} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  listContent: {
    paddingHorizontal: spacings.normalx,
    paddingVertical: spacings.normal,
    flexGrow: 1,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacings.xxLarge,
  },
  emptyText: {
    color: textDark,
    opacity: 0.5,
  },
  bubbleRow: {
    marginBottom: spacings.small2x,
    flexDirection: 'row',
  },
  bubbleRowRight: {
    justifyContent: 'flex-end',
  },
  bubbleRowLeft: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 18,
    paddingHorizontal: spacings.medium,
    paddingVertical: spacings.small2x,
  },
  bubbleMine: {
    backgroundColor: accentColor,
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: cardBgSoft,
    borderBottomLeftRadius: 4,
  },
  bubbleTextMine: {
    color: whiteColor,
  },
  bubbleTextTheirs: {
    color: textDark,
  },
  bubbleTimestamp: {
    marginTop: spacings.xxsmall,
  },
  bubbleTimestampMine: {
    color: whiteColor,
    opacity: 0.7,
  },
  bubbleTimestampTheirs: {
    color: textDark,
    opacity: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacings.small,
    paddingHorizontal: spacings.normalx,
    paddingVertical: spacings.small,
    borderTopWidth: 1,
    borderTopColor: borderColor,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 20,
    borderWidth: 1,
    borderColor,
    paddingHorizontal: spacings.normalx,
    paddingVertical: 10,
    textAlignVertical: 'center',
    verticalAlign: 'middle',
    color: textDark,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: accentColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
