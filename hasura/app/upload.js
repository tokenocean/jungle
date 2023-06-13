import { v4 } from "uuid";
import fs from "fs-extra";
import { create } from "ipfs-http-client";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import Clone from "readable-stream-clone";
import { app } from "./app.js";
import fastifyMultipart from "@fastify/multipart";
import FormData from "form-data";
import { pipeline } from "stream/promises";
import { fileTypeFromStream } from "file-type";

app.register(fastifyMultipart);

app.post("/upload", async function (req, res) {
  try {
    const ipfs = create(process.env.IPFS_URL);
    const data = await req.file();

    const s1 = new Clone(data.file);
    const s2 = new Clone(data.file);
    const s3 = new Clone(data.file);
    const s4 = new Clone(data.file);
    const s5 = new Clone(data.file);

    let { ext } = await fileTypeFromStream(s5);

    let output;
    let tmp = `/tmp/${v4()}`;

    let results = await Promise.allSettled([
      ipfs.add(s1),
      new Promise(async (resolve, reject) => {
        try {
          if (ext === "gif") throw new Error("process gifs as videos");
          if (ext === "mp3" || ext === "aiff" || ext === "wav" || ext === "m4a") {
            output = `${tmp}.webm`;
            ffmpeg()
              .input(s2)
              .audioCodec("libopus")
              .format("webm")
              .output(output)
              .on("error", reject)
              .on("end", () => resolve(output))
              .run();
          } else if (ext === "mp4") {
            output = `${tmp}.webp`;
            await pipeline(
              s2,
              sharp().rotate().resize(800).webp({ quality: 90 }),
              fs.createWriteStream(output)
            );
            resolve(output);
          } else {
            try {
              await pipeline(s3, fs.createWriteStream(tmp));
            } catch (e) {
              console.log("disk write failed", e);
            }

            output = `${tmp}.webm`;

            ffmpeg()
              .input(tmp)
              .size("400x?")
              .noAudio()
              .withVideoCodec("libvpx-vp9")
              .addOptions(["-b:v", "0", "-crf", "15", "-an", "-t", "4"])
              .on("error", reject)
              .on("end", () => resolve(output))
              .save(output);
          }
        } catch (e) {
          console.log("Conversion error:", e);
          reject(e);
        }
      }),
    ]);

    let filename = results[0].value.cid.toString();
    ext = output.split(".")[1];

    await fs.move(output, `/export/${filename}.${ext}`, { overwrite: true });

    if (process.env.NODE_ENV === "production") {
      const form = new FormData();
      form.append("file", s4, {
        filename,
        contentType: data.mimetype,
      });

      form.submit(
        {
          host: "api.nft.storage",
          path: "/upload",
          method: "POST",
          protocol: "https:",
          headers: {
            Authorization: `Bearer ${process.env.NFT_STORAGE_TOKEN}`,
          },
        },
        (err) => err && console.log(err)
      );
    }

    res.send(filename);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

if (!data || !fs.existsSync(data.file.path)) {
  res.status(400).send("File does not exist");
}