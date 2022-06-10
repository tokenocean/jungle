export async function get() {
  const { artwork } = await fetch(`/artworks/${slug}.json`).then((r) =>
    r.json()
  );

  if (!artwork) return { status: 404 };

  const { default_royalty_recipients } = await fetch(`/royalties.json`).then(
    (r) => r.json()
  );

  return {
    body: {
      artwork,
      default_royalty_recipients,
    },
  };
}
