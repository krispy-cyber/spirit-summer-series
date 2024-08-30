export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      // Fetch the JSON file from R2 using the bucket binding
      const object = await env.BUCKET.get('questions.json');
      if (!object) {
        console.log('Questions JSON not found in R2 bucket.');
        return new Response('Error: Questions file not found in R2 bucket.', { status: 404 });
      }

      const questionnaireData = await object.json();
      console.log('Successfully fetched questions.json from R2.');

      return new Response(generateQuestionnaireHTML(questionnaireData), {
        headers: { 'Content-Type': 'text/html' },
      });
    } else if (url.pathname === '/summer-series-logo.jpeg') {
      // Fetch the image file from R2
      try {
        const imageObject = await env.BUCKET.get('summer-series-logo.jpeg');
        if (!imageObject) {
          console.log('Image not found in R2 bucket.');
          return new Response('Error: Image file not found in R2 bucket.', { status: 404 });
        }

        console.log('Successfully fetched summer-series-logo.jpeg from R2.');

        // Serve the image file with the correct MIME type
        return new Response(imageObject.body, {
          headers: { 'Content-Type': 'image/jpeg' },
        });
      } catch (error) {
        console.log('Error fetching image from R2:', error);
        return new Response('Error fetching image from R2 bucket.', { status: 522 });
      }
    } else {
      console.log(`Path not found: ${url.pathname}`);
    }

    return new Response('Not found', { status: 404 });
  },
};
