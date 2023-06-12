import { gql } from 'graphql-tag';

export const getDefaultRoyaltyRecipients = gql`
  query {
    default_royalty_recipients {
      amount
      address
      name
      id
    }
  }
`;