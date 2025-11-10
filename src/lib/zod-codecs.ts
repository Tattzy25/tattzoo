import { z } from 'zod'
import { createParser } from 'nuqs/server'

/**
 * Zod codecs for (de)serialisation in custom nuqs parser
 *
 * Since zod@^4.1, you can use codecs to add bidirectional serialisation / deserialisation to your validation schemas
 */

function createZodCodecParser<
  Input extends z.ZodCoercedString<string> | z.ZodPipe<any, any>,
  Output extends z.ZodType
>(
  codec: z.ZodCodec<Input, Output> | z.ZodPipe<Input, Output>,
  eq: (a: z.output<Output>, b: z.output<Output>) => boolean = (a, b) => a === b
) {
  return createParser<z.output<Output>>({
    parse(query) {
      return codec.parse(query)
    },
    serialize(value) {
      return codec.encode(value)
    },
    eq
  })
}

// Date/Timestamp codec - Similar to parseAsTimestamp in nuqs
export const dateTimestampCodec = z.codec(z.string().regex(/^\d+$/), z.date(), {
  decode: (query: string) => new Date(parseInt(query)),
  encode: (date: Date) => date.valueOf().toFixed()
})

// Boolean codec with string representation
export const booleanCodec = z.codec(z.string(), z.boolean(), {
  decode: (query: string) => query === 'true',
  encode: (value: boolean) => value.toString()
})

// Number codec
export const numberCodec = z.codec(z.string().regex(/^-?\d+(\.\d+)?$/), z.number(), {
  decode: (query: string) => parseFloat(query),
  encode: (value: number) => value.toString()
})

// Integer codec
export const integerCodec = z.codec(z.string().regex(/^-?\d+$/), z.number().int(), {
  decode: (query: string) => parseInt(query, 10),
  encode: (value: number) => value.toString()
})

// JSON codec for complex objects
export const jsonCodec = <T extends z.ZodType>(schema: T) =>
  z.codec(z.string(), schema, {
    decode: (jsonString: string, ctx) => {
      try {
        return JSON.parse(jsonString)
      } catch (err: any) {
        ctx.issues.push({
          code: 'invalid_format',
          format: 'json',
          input: jsonString,
          message: err.message
        })
        return z.NEVER
      }
    },
    encode: (value: z.input<T>) => JSON.stringify(value)
  })

// Base64 URL to bytes codec
export const base64urlToBytes = z.codec(z.string().base64url(), z.instanceof(Uint8Array), {
  decode: (base64urlString: string) => z.util.base64urlToUint8Array(base64urlString),
  encode: (bytes: Uint8Array) => z.util.uint8ArrayToBase64url(bytes)
})

// UTF-8 string to bytes codec
export const utf8ToBytes = z.codec(z.string(), z.instanceof(Uint8Array), {
  decode: (str: string) => new TextEncoder().encode(str),
  encode: (bytes: Uint8Array) => new TextDecoder().decode(bytes)
})

// Invert codec utility
function invertCodec<A extends z.ZodType, B extends z.ZodType>(
  codec: z.ZodCodec<A, B>
): z.ZodCodec<B, A> {
  return z.codec(codec.out, codec.in, {
    decode(value, ctx) {
      try {
        return codec.encode(value)
      } catch (err) {
        ctx.issues.push({
          code: 'invalid_format',
          format: 'invert.decode',
          input: String(value),
          message: err instanceof z.ZodError ? err.message : String(err)
        })
        return z.NEVER
      }
    },
    encode(value, ctx) {
      try {
        return codec.decode(value)
      } catch (err) {
        ctx.issues.push({
          code: 'invalid_format',
          format: 'invert.encode',
          input: String(value),
          message: err instanceof z.ZodError ? err.message : String(err)
        })
        return z.NEVER
      }
    }
  })
}

// Bytes to UTF-8 codec (inverse of utf8ToBytes)
export const bytesToUtf8 = invertCodec(utf8ToBytes)

// Array codec for comma-separated values
export const arrayCodec = <T extends z.ZodType>(itemSchema: T) =>
  z.codec(z.string(), z.array(itemSchema), {
    decode: (query: string) => {
      if (!query) return []
      return query.split(',').map(item => {
        try {
          return JSON.parse(decodeURIComponent(item))
        } catch {
          return item
        }
      })
    },
    encode: (value: z.input<T>[]) => {
      return value.map(item =>
        typeof item === 'string' ? item : encodeURIComponent(JSON.stringify(item))
      ).join(',')
    }
  })

// UUID codec
export const uuidCodec = z.codec(
  z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
  z.string().uuid(),
  {
    decode: (query: string) => query,
    encode: (value: string) => value
  }
)

// Enum codec factory
export const enumCodec = <T extends string>(enumValues: readonly T[]) =>
  z.codec(z.string(), z.enum(enumValues as [T, ...T[]]), {
    decode: (query: string) => query as T,
    encode: (value: T) => value
  })

// Optional and union codecs removed due to complex type issues
// Use z.optional() and z.union() directly for these patterns

// Example user schema for JSON codec
export const userSchema = z.object({
  name: z.string(),
  age: z.number()
})

// Simple JSON codec example
const userJsonCodec = jsonCodec(userSchema)
export const userJsonParser = createZodCodecParser(userJsonCodec)

// Export common type aliases
export type DateTimestampCodec = typeof dateTimestampCodec
export type BooleanCodec = typeof booleanCodec
export type NumberCodec = typeof numberCodec
export type IntegerCodec = typeof integerCodec
