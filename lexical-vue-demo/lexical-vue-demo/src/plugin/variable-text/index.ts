import type { TextNode } from 'lexical'
import { useLexicalTextEntity } from '../../hooks'
import {
  $createVariableValueBlockNode,
  VariableValueBlockNode,
} from './node'
import { useLexicalComposer } from "lexical-vue";
import { getHashtagRegexString } from './utils'

const REGEX = new RegExp(getHashtagRegexString(), 'i')

const VariableValueBlock = () => {
  const editor = useLexicalComposer();

  const createVariableValueBlockNode = (textNode: TextNode): VariableValueBlockNode => {
    return $createVariableValueBlockNode(textNode.getTextContent())
  }

  const getVariableValueMatch = (text: string) => {
    const matchArr = REGEX.exec(text)

    if (matchArr === null)
      return null

    const hashtagLength = matchArr[0].length
    const startOffset = matchArr.index
    const endOffset = startOffset + hashtagLength
    return {
      end: endOffset,
      start: startOffset,
    }
  }

  useLexicalTextEntity<VariableValueBlockNode>(
    getVariableValueMatch,
    VariableValueBlockNode,
    createVariableValueBlockNode,
  )

  return null
}

export default VariableValueBlock
