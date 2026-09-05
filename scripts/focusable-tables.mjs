/** Keep Markdown tables keyboard-scrollable at narrow viewport widths. */
export default function focusableTables() {
  return {
    name: 'focusable-tables',
    element: {
      filter: ['table'],
      visit(node, context) {
        if (node.properties?.tabIndex === undefined) context.setProperty(node, 'tabIndex', 0);
      },
    },
  };
}
