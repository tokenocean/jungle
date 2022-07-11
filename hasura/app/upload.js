import fs from "fs";
import ipfsClient from "ipfs-http-client";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import { PassThrough } from "stream";
import Clone from "readable-stream-clone";
import { app } from "./app.js";
import fastifyMultipart from "@fastify/multipart";
import FormData from "form-data";

app.register(fastifyMultipart);

app.post("/upload", async function (req, res) {
  try {
    const ipfs = ipfsClient(process.env.IPFS_URL);
    const data = await req.file();

    const s1 = new Clone(data.file);
    const s2 = new Clone(data.file);
    const s3 = new Clone(data.file);
    const s4 = new Clone(data.file);

    const { cid } = await ipfs.add(s1);
    const name = cid.toString();

    const [format, ext] = data.mimetype.split("/");
    const path = `/export/${name}`;
    const thumb = `${path}.${ext}`;
    const tmp = `/tmp/${name}`;

    await new Promise((resolve) =>
      s2.pipe(fs.createWriteStream(tmp).on("finish", resolve))
    );


    const form = new FormData();
    form.append("file", s4, {
      filename: name,
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
      (err, res) => err && console.log(err)
    );

    try {
      if (format === "video" || ext === "gif") {
        ffmpeg()
          .input(tmp)
          .size("400x?")
          .noAudio()
          .withVideoCodec("libvpx-vp9")
          .addOptions(["-b:v 0", "-crf 30", "-an", "-t 4"])
          .output(thumb)
          .outputFormat("webm")
          .run();
      } else {
        let t = sharp().rotate().resize(1000).webp();
        s3.pipe(t).pipe(fs.createWriteStream(thumb));
      }
    } catch (e) {
      console.log("processing failed", e);
      s3.pipe(fs.createWriteStream(thumb));
    }

    res.send(name);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});
