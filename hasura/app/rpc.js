import wretch from "wretch";
import fetch from "node-fetch";
wretch().polyfills({ fetch });

export default ({ RPCHOST, RPCPORT, RPCUSER, RPCPASS, RPCWALLET }) =>
  new Proxy(
    {},
    {
      get:
        (target, prop) =>
        (...params) =>
          ((method, ...params) =>
            wretch()
              .url(`http://${RPCHOST}:${RPCPORT}/wallet/${RPCWALLET}`)
              .auth(
                `Basic ${Buffer.from(`${RPCUSER}:${RPCPASS}`).toString(
                  "base64"
                )}`
              )
              .post({
                method,
                params,
              })
              .json(({ result }) => result))(prop.toLowerCase(), ...params),
    }
  );
