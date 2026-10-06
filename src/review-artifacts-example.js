const { publishReviewDiagram } = require('./review-artifacts');

async function runExample() {
  const uploads = [];
  const result = await publishReviewDiagram({
    repository: 'example/public-repo',
    reviewId: 'staging-test',
    getVisibility: async () => 'public',
    render: async () => ({ light: Buffer.from('light fixture'), dark: Buffer.from('dark fixture') }),
    upload: async (object) => uploads.push(object),
  });
  return { result, uploads };
}

if (require.main === module) {
  runExample().then(({ result }) => console.log(result));
}

module.exports = { runExample };
