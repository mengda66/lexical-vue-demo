import { $isAtNodeEnd } from '@lexical/selection'
import type {
  ElementNode,
  Klass,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
  TextNode,
} from 'lexical'
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
} from 'lexical'


export function registerLexicalTextEntity<T extends TextNode>(
  editor: LexicalEditor,
  getMatch: (text: string) => null | EntityMatch,
  targetNode: Klass<T>,
  createNode: (textNode: TextNode) => T,
) {
  const isTargetNode = (node: LexicalNode | null | undefined): node is T => {
    return node instanceof targetNode
  }

  const replaceWithSimpleText = (node: TextNode): void => {
    const textNode = $createTextNode(node.getTextContent())
    textNode.setFormat(node.getFormat())
    node.replace(textNode)
  }

  const getMode = (node: TextNode): number => {
    return node.getLatest().__mode
  }

  const textNodeTransform = (node: TextNode) => {
    if (!node.isSimpleText())
      return

    const prevSibling = node.getPreviousSibling()
    let text = node.getTextContent()
    let currentNode = node
    let match

    if ($isTextNode(prevSibling)) {
      const previousText = prevSibling.getTextContent()
      const combinedText = previousText + text
      const prevMatch = getMatch(combinedText)

      if (isTargetNode(prevSibling)) {
        if (prevMatch === null || getMode(prevSibling) !== 0) {
          replaceWithSimpleText(prevSibling)
          return
        }
        else {
          const diff = prevMatch.end - previousText.length

          if (diff > 0) {
            const concatText = text.slice(0, diff)
            const newTextContent = previousText + concatText
            prevSibling.select()
            prevSibling.setTextContent(newTextContent)

            if (diff === text.length) {
              node.remove()
            }
            else {
              const remainingText = text.slice(diff)
              node.setTextContent(remainingText)
            }

            return
          }
        }
      }
      else if (prevMatch === null || prevMatch.start < previousText.length) {
        return
      }
    }

    while (true) {
      match = getMatch(text)
      let nextText = match === null ? '' : text.slice(match.end)
      text = nextText

      if (nextText === '') {
        const nextSibling = currentNode.getNextSibling()

        if ($isTextNode(nextSibling)) {
          nextText = currentNode.getTextContent() + nextSibling.getTextContent()
          const nextMatch = getMatch(nextText)

          if (nextMatch === null) {
            if (isTargetNode(nextSibling))
              replaceWithSimpleText(nextSibling)
            else
              nextSibling.markDirty()

            return
          }
          else if (nextMatch.start !== 0) {
            return
          }
        }
      }
      else {
        const nextMatch = getMatch(nextText)

        if (nextMatch !== null && nextMatch.start === 0)
          return
      }

      if (match === null)
        return

      if (match.start === 0 && $isTextNode(prevSibling) && prevSibling.isTextEntity())
        continue

      let nodeToReplace

      if (match.start === 0)
        [nodeToReplace, currentNode] = currentNode.splitText(match.end)
      else
        [, nodeToReplace, currentNode] = currentNode.splitText(match.start, match.end)

      const replacementNode = createNode(nodeToReplace)
      replacementNode.setFormat(nodeToReplace.getFormat())
      nodeToReplace.replace(replacementNode)

      if (currentNode == null)
        return
    }
  }

  const reverseNodeTransform = (node: T) => {
    const text = node.getTextContent()
    const match = getMatch(text)

    if (match === null || match.start !== 0) {
      replaceWithSimpleText(node)
      return
    }

    if (text.length > match.end) {
      // This will split out the rest of the text as simple text
      node.splitText(match.end)
      return
    }

    const prevSibling = node.getPreviousSibling()

    if ($isTextNode(prevSibling) && prevSibling.isTextEntity()) {
      replaceWithSimpleText(prevSibling)
      replaceWithSimpleText(node)
    }

    const nextSibling = node.getNextSibling()

    if ($isTextNode(nextSibling) && nextSibling.isTextEntity()) {
      replaceWithSimpleText(nextSibling) // This may have already been converted in the previous block

      if (isTargetNode(node))
        replaceWithSimpleText(node)
    }
  }

  const removePlainTextTransform = editor.registerNodeTransform(CustomTextNode, textNodeTransform)
  const removeReverseNodeTransform = editor.registerNodeTransform(targetNode, reverseNodeTransform)
  return [removePlainTextTransform, removeReverseNodeTransform]
}

const positionMenu = () => {
  anchorElementRef.current.style.top = anchorElementRef.current.style.bottom;
  const rootElement = editor.getRootElement();
  const containerDiv = anchorElementRef.current;

  const menuEle = containerDiv.firstChild as HTMLElement;
  if (rootElement !== null && resolution !== null) {
    const { left, top, width, height } = resolution.getRect();
    const anchorHeight = anchorElementRef.current.offsetHeight; // use to position under anchor
    containerDiv.style.top = `${top + window.pageYOffset + anchorHeight + 3
      }px`;
    containerDiv.style.left = `${left + window.pageXOffset}px`;
    containerDiv.style.height = `${height}px`;
    containerDiv.style.width = `${width}px`;
    if (menuEle !== null) {
      menuEle.style.top = `${top}`;
      const menuRect = menuEle.getBoundingClientRect();
      const menuHeight = menuRect.height;
      const menuWidth = menuRect.width;

      const rootElementRect = rootElement.getBoundingClientRect();

      if (left + menuWidth > rootElementRect.right) {
        containerDiv.style.left = `${rootElementRect.right - menuWidth + window.pageXOffset
          }px`;
      }
      if (
        (top + menuHeight > window.innerHeight ||
          top + menuHeight > rootElementRect.bottom) &&
        top - rootElementRect.top > menuHeight + height
      ) {
        containerDiv.style.top = `${top - menuHeight + window.pageYOffset - height
          }px`;
      }
    }

    if (!containerDiv.isConnected) {
      if (className != null) {
        containerDiv.className = className;
      }
      containerDiv.setAttribute('aria-label', 'Typeahead menu');
      containerDiv.setAttribute('id', 'typeahead-menu');
      containerDiv.setAttribute('role', 'listbox');
      containerDiv.style.display = 'block';
      containerDiv.style.position = 'absolute';
      parent.append(containerDiv);
    }
    anchorElementRef.current = containerDiv;
    rootElement.setAttribute('aria-controls', 'typeahead-menu');
  }
