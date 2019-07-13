// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv');

// Load environment variables from project
dotenv.config();
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_DELIVERY_TOKEN;

if (!spaceId || !accessToken) {
  throw new Error(
    'Contentful spaceId and the delivery token need to be provided.',
  );
}

const siteUrl = 'https://sarabethbelon.com';

module.exports = {
  siteMetadata: {
    siteUrl,
  },
  plugins: [
    'gatsby-plugin-eslint',
    'gatsby-plugin-layout',
    'gatsby-plugin-remove-trailing-slashes',
    'gatsby-transformer-remark',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-remove-serviceworker',
    // 'gatsby-plugin-offline',
    {
      resolve: 'gatsby-plugin-material-ui',
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-141372768-1',
        head: true,
        anonymize: true,
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        serialize: ({ site, allSitePage }) => {
          const pathRegex = /\/(.[^/])+/g;

          return allSitePage.edges
            .sort((a, b) => {
              const aMatch = a.node.path.match(pathRegex);
              const aCount = aMatch ? aMatch.length : 0;
              const bMatch = b.node.path.match(pathRegex);
              const bCount = bMatch ? bMatch.length : 0;
              return aCount - bCount;
            })
            .map((edge) => {
              const slashCount = edge.node.path.match(pathRegex);
              const priorityIndex = slashCount ? slashCount.length : 0;

              return {
                url: site.siteMetadata.siteUrl + edge.node.path,
                lastmod: new Date(),
                changefreq: 'daily',
                priority: 1.0 - (0.2 * priorityIndex),
              };
            });
        },
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: siteUrl,
        sitemap: `${siteUrl}/sitemap.xml`,
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        google: {
          families: ['Playfair Display', 'Muli'],
        },
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Sarabeth Belon Portfolio',
        short_name: 'SB Portfolio',
        start_url: '/',
        background_color: '#1A1A1A',
        theme_color: '#C66470',
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: 'standalone',
        icon: 'src/images/favicon.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-source-contentful',
      options: { spaceId, accessToken },
    },
  ],
};
