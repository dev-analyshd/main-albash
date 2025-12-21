-- Conversations table to store conversation metadata for messaging

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_a UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_b UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  last_message_preview TEXT,
  last_message_at TIMESTAMPTZ,
  unread_counts JSONB DEFAULT '{}',
  is_archived JSONB DEFAULT '{}',
  is_pinned JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure pair uniqueness (order-agnostic)
CREATE UNIQUE INDEX IF NOT EXISTS conversations_unique_pair ON conversations (LEAST(user_a, user_b), GREATEST(user_a, user_b));

-- Auto-sync conversations when message inserted
CREATE OR REPLACE FUNCTION update_conversation_on_message_insert()
RETURNS TRIGGER AS $$
DECLARE
  conv_id UUID;
BEGIN
  -- Find or create conversation
  SELECT id INTO conv_id FROM conversations
  WHERE (user_a = NEW.sender_id AND user_b = NEW.receiver_id) OR (user_a = NEW.receiver_id AND user_b = NEW.sender_id)
  LIMIT 1;

  IF conv_id IS NULL THEN
    INSERT INTO conversations (user_a, user_b)
    VALUES (LEAST(NEW.sender_id, NEW.receiver_id), GREATEST(NEW.sender_id, NEW.receiver_id))
    RETURNING id INTO conv_id;
  END IF;

  -- Update conversation metadata
  UPDATE conversations
  SET
    last_message_id = NEW.id,
    last_message_preview = LEFT(NEW.content, 100),
    last_message_at = NEW.created_at,
    unread_counts = jsonb_set(COALESCE(unread_counts, '{}'::jsonb), ARRAY[NEW.receiver_id::text], '1')
  WHERE id = conv_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversation_on_message ON messages;
CREATE TRIGGER trigger_update_conversation_on_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_on_message_insert();

-- Auto-mark conversation read when message read
CREATE OR REPLACE FUNCTION update_conversation_on_message_read()
RETURNS TRIGGER AS $$
DECLARE
  conv_id UUID;
BEGIN
  IF NEW.read = TRUE AND OLD.read = FALSE THEN
    SELECT id INTO conv_id FROM conversations
    WHERE (user_a = NEW.sender_id AND user_b = NEW.receiver_id) OR (user_a = NEW.receiver_id AND user_b = NEW.sender_id)
    LIMIT 1;

    IF conv_id IS NOT NULL THEN
      UPDATE conversations
      SET unread_counts = jsonb_set(COALESCE(unread_counts, '{}'::jsonb), ARRAY[NEW.receiver_id::text], '0')
      WHERE id = conv_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversation_on_message_read ON messages;
CREATE TRIGGER trigger_update_conversation_on_message_read
AFTER UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_on_message_read();
