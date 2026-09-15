module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("styles");

  // Projects, sorted by each page's `order`
  eleventyConfig.addCollection("projects", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/projects/*.md")
      .sort((a, b) => (a.data.order || 999) - (b.data.order || 999))
  );

  return {
    dir: { input: "src" },
    markdownTemplateEngine: "njk"
  };
};
