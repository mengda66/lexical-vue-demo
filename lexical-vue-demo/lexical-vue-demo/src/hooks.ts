export function useLexicalTextEntity<T extends TextNode>(
  getMatch: (text: string) => null | EntityMatch,
  targetNode: Klass<T>,
  createNode: (textNode: CustomTextNode) => T,
) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return mergeRegister(...registerLexicalTextEntity(editor, getMatch, targetNode, createNode))
  }, [createNode, editor, getMatch, targetNode])
}