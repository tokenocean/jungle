export const getAnnouncements = `query {
  popups: announcements(limit: 1, order_by: {created_at: desc}, where: {visible_end: {_gte: "now()"}, visible_start: {_lte: "now()"}, type: {_eq: "popup"}}) {
      text
      id
      type
      dismissible
  }
}`;
