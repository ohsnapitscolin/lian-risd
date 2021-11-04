module.exports = {
    siteMetadata: {
        siteUrl: `https://www.yourdomain.tld`,
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
    ],
}
