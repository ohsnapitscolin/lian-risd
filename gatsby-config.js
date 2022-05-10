module.exports = {
  siteMetadata: {
    siteUrl: `https://lian-risd.netlify.app`,
  },
  plugins: [
    `gatsby-plugin-styled-components`,
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /svg/,
        },
      },
    },
    "gatsby-plugin-react-helmet",
  ],
};
