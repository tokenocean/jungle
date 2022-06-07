import { app } from "./app.js";
import { auth } from "./auth.js";
import { q } from  "./api.js";
import { getUser } from "./utils.js";
import { updateMessages } from "./queries.js";

app.post("/markRead", auth, async (req, res) => {
  let { message, from } = req.body;

  let user = await getUser(req);

  res.send(
    await q(updateMessages, {
      message: { message, viewed: true },
      from,
      to: user.id,
    })
  );
});
