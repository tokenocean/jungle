export const getMessages = `query {
  messages {
    message
		created_at
		from
		to
		id
		toUser {
      username
      avatar_url
      id
    }
		fromUser {
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

export const updateMessage = `mutation($message: messages_set_input!, $from: uuid!) {
  update_messages(where: {from: {_eq: $from}}, _set: $message) {
    affected_rows
  }
}`;
