/**
 * Shared security constants used across API and web packages.
 *
 * Bcrypt salt rounds: 12 is the recommended minimum for production.
 * Existing passwords hashed with different salt rounds still work because
 * bcrypt embeds the salt rounds in the hash itself.
 */
export const BCRYPT_SALT_ROUNDS = 12;
