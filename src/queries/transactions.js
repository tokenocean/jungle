import { editionFields } from "./artworks";

export const createTransaction = `mutation create_transaction($transaction: transactions_insert_input!) {
  insert_transactions_one(object: $transaction) {
    id,
    edition_id
  } 
}`;

export const fields = `
  id
  psbt
  amount 
  hash
  type
  created_at
  asset
  confirmed
  bid {
    id
    user {
      id 
      username
    } 
  } 
  user {
    id
    username
    avatar_url
  } 
  edition_id
`;

export const getArtworkTransactions = (id) => `query {
  transactions(order_by: {created_at: desc}, where: {_and: {edition_id: {_eq: "${id}"}}}) {
    ${fields}
    edition {
      ${editionFields}
    } 
  }
}`;

export const getTransaction = `query($id: uuid!) {
  transactions_by_pk(id: $id) {
    ${fields}
    edition {
      ${editionFields}
    } 
  }
}`;

export const getTransactions = (limit = 10) => `query {
  transactions(where: {edition_id: {_is_null: false}}, order_by: {created_at: desc}, limit: ${limit}) {
    ${fields}
    edition {
      ${editionFields}
    } 
  }
}`;

export const getActiveBids = (id) => `query {
  activebids(where: { user_id: { _eq: "${id}"}}) {
    id
    psbt
    amount
    type
    edition {
      ${editionFields}
    } 
  }
}`;

export const getRecentActivity = (limit = 3) => `query {
  recentactivity(where: { type: { _neq: "royalty" }}, limit: ${limit}) {
    ${fields}
    edition {
      ${editionFields}
    } 
  }
}`;

export const getLatestPieces = (limit = 3) => `query {
  transactions(where: {edition_id: {_is_null: false}, type: {_eq: "creation"}}, order_by: [{created_at: desc}], limit: ${limit}) {
    ${fields}
    edition {
      ${editionFields}
    } 
  }
}`;

export const getOffers = `query($id: uuid!) {
  offers(where: { user_id: { _eq: $id }}) {
    transaction {
      ${fields}
      edition {
        ${editionFields}
      } 
    }
  }
}`;
