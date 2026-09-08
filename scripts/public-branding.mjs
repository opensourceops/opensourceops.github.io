const rules = [
  ['maturity branding', /\bpre[\s-]+1\.0\b/i],
  ['release-readiness branding', /\blaunch[\s-]+ready\s+candidate\b/i],
  ['agentctl release branding', /\bagentctl(?:\s+v?|\s*:\s*)\d+\.\d+(?:\.\d+)?\b/i],
  ['placeholder registry', /ghcr\.io\/OWNER\/agentctl/i],
];

export function publicBrandingIssues(content) {
  return rules.filter(([, pattern]) => pattern.test(content)).map(([label]) => label);
}

export function visibleHtmlText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/\s+/g, ' ');
}
