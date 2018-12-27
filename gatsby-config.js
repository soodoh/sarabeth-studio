// TODO probably move dotenv to devdependency as this only is run on build
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

module.exports = {
  plugins: [
    'gatsby-plugin-eslint',
    'gatsby-plugin-layout',
    'gatsby-plugin-remove-trailing-slashes',
    'gatsby-transformer-remark',
    'gatsby-transformer-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        google: {
          families: ['Playfair Display', 'Muli'],
        },
      },
    },
    {
      resolve: 'gatsby-source-contentful',
      options: { spaceId, accessToken },
    },
  ],
};
