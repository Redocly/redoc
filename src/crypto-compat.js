// `ulid` resolves `crypto` through its browser field, which points at an empty stub, so the
// Node branch of its PRNG detection finds no `randomBytes` when the bundle renders on a server.
// Web Crypto is available both in browsers and in Node, so it backs one implementation for both.
export function randomBytes(size) {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(size));
  // `ulid` reads the byte back through the Node Buffer API.
  bytes.readUInt8 = (offset = 0) => bytes[offset];
  return bytes;
}

export default { randomBytes };
