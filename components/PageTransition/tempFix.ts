/**
 * This temporary fix is meant to address the issue where there is a flash of unstyled content during page transitions
 * because NextJS is removeing the CSS from the previous page too quickly.
 * https://github.com/vercel/next.js/issues/17464
 */

export const savePageStyles = () => {
  const previousStylesFixes = document.head.querySelectorAll("[data-fix]");

  // Delete previously created fixes
  if (previousStylesFixes) {
    for (let i = 0; i < previousStylesFixes.length; i++) {
      document.head.removeChild(previousStylesFixes[i]);
    }
  }

  // Get all the styles of the page
  const allStyleElems: NodeListOf<HTMLLinkElement> =
    document.head.querySelectorAll('link[rel="stylesheet"], link[as="style"]');
  // Get all the inline styles of the page, labelled by "data-n-href" ( defined by nextjs )
  const allInlineStylesElems =
    document.head.querySelectorAll("style[data-n-href]");

  // Create doubling links to css sheets that wont be removed unless we say so
  if (allStyleElems) {
    for (let i = 0; i < allStyleElems.length; i++) {
      if (allStyleElems[i].href) {
        const styles = document.createElement("link");
        styles.setAttribute("data-pt-fix", "true");
        styles.setAttribute("rel", "stylesheet");
        styles.setAttribute("href", allStyleElems[i].href);

        document.head.appendChild(styles);
      }
    }
  }

  // Now do the same with the inline styles
  const inlineStyles = document.createElement("style");
  inlineStyles.setAttribute("data-pt-fix", "true");
  if (allInlineStylesElems) {
    for (let i = 0; i < allInlineStylesElems.length; i++) {
      inlineStyles.innerHTML += allInlineStylesElems[i].innerHTML;
    }

    document.head.appendChild(inlineStyles);
  }
};
