/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { validate as _validate } from '../../../../lexicons'
import {
  type $Typed,
  is$typed as _is$typed,
  type OmitKey,
} from '../../../../util'

const is$typed = _is$typed,
  validate = _validate
const id = 'fyi.frontpage.feed.generator'

export interface Record {
  $type: 'fyi.frontpage.feed.generator'
  /** DID of the feed generator service. */
  did: string
  /** Display name for the feed. */
  displayName: string
  /** Description of the feed. */
  description?: string
  /** Avatar image for the feed. */
  avatar?: BlobRef
  /** Whether the feed generator accepts interaction feedback. */
  acceptsInteractions?: boolean
  /** Client-declared timestamp when this generator was created. */
  createdAt: string
  [k: string]: unknown
}

const hashRecord = 'main'

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord)
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true)
}
