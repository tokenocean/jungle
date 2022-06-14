import { getRecentActivity } from "$queries/transactions";

export async function get({ locals: { q }}) {
  try {
    let { recentactivity: transactions } = await q(getRecentActivity(80));
    return { body: { transactions }};
  } catch (e) {
    console.log(e);
    return {
      body: {},
      status: 500,
    };
  }
}
