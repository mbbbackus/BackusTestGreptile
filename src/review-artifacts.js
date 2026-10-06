const DIAGRAM_BUCKETS = {
  public: 'public-review-diagrams',
  private: 'private-review-diagrams',
};

function selectDiagramDestination(visibility, reviewId) {
  const audience = visibility === 'public' ? 'public' : 'private';
  return {
    bucket: DIAGRAM_BUCKETS[audience],
    prefix: `${audience}/reviews/${reviewId}`,
  };
}

async function publishReviewDiagram({ repository, reviewId, getVisibility, render, upload }) {
  const images = await render();
  const visibility = await getVisibility(repository).catch(() => 'unknown');
  const destination = selectDiagramDestination(visibility, reviewId);
  const keys = await Promise.all(
    ['light', 'dark'].map(async (theme) => {
      const key = `${destination.prefix}/${theme}.png`;
      await upload({ bucket: destination.bucket, key, image: images[theme] });
      return key;
    }),
  );
  return { bucket: destination.bucket, light: keys[0], dark: keys[1] };
}

module.exports = { selectDiagramDestination, publishReviewDiagram };
