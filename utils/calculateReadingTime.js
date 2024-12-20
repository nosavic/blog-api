module.exports = (body) => {
  const wordsPerMinute = 200; // Average reading speed
  const words = body.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};
