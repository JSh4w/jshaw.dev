module.exports = function(eleventyConfig) {
  // Copy assets and static files
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("styles");

  // Create projects collection
  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/projects/*.md").sort((a, b) => {
      return (a.data.order || 999) - (b.data.order || 999);
    });
  });

  // Set input and output directories
  return {
    dir: {
      input: "src",
      output: "_site"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};