/** Keep Markdown tables keyboard-scrollable at narrow viewport widths. */
export default function rehypeFocusableTables() {
  return (tree) => {
    function visit(node) {
      if (node.type === 'element' && node.tagName === 'table') {
        node.properties ??= {};
        node.properties.tabIndex ??= 0;
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
  };
}
