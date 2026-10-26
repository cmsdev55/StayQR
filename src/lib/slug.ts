import { randomInt } from "node:crypto";

/** Short-link slugs: 6 characters from an alphabet without look-alikes (no 0/o, 1/l/i). about 890 million combinations. */
const ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";
export const newSlug = (len = 6) => Array.from({ length: len }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
