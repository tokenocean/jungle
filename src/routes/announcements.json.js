import { getAnnouncements } from "$queries/helpers";
export async function get({ request: { headers }, locals: { q } }) {
  try {
    let { popups } = await q(getAnnouncements);
    return {
      body: {
        popup: popups.length ? popups[0] : null,
      },
      headers,
    };
  } catch (e) {
    console.log(e);
    return {
      body: {},
      status: 500,
    };
  }
}
