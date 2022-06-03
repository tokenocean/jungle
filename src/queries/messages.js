export const getMessages = `query {
  messages {
    message
		created_at
		from
		to
		id
		user {
username
avatar_url
id
}
  }
}`;

export const createMessage = `mutation create_message($message: messages_insert_input!) {
  insert_messages_one(object: $message) {
    id
  }
}`;
