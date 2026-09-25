// View Transition names must be valid CSS identifiers, including for Japanese slugs.
export const postTitleTransitionName = (slug) =>
    `dcc-post-${Array.from(slug, (char) => char.codePointAt(0).toString(16)).join('-')}`;
