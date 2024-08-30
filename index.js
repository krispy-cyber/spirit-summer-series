export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    console.log(`Request received for path: ${url.pathname}`);  // Log the requested path

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
    } 
    // Handle requests for summer-series-logo.jpeg
    else if (url.pathname === '/summer-series-logo.jpeg') {
      console.log('Handling request for summer-series-logo.jpeg');
      return fetchImageFromR2(env, 'summer-series-logo.jpeg', 'image/jpeg');
    } 
    // Fallback for any other path
    else {
      console.log(`Path not found: ${url.pathname}`);
      return new Response('Not found', { status: 404 });
    }
  },
};

// Helper function to fetch image from R2 and return the response
async function fetchImageFromR2(env, key, contentType) {
  try {
    // Fetch the image file from R2 using the bucket binding
    const imageObject = await env.BUCKET.get(key);
    if (!imageObject) {
      console.log(`Image "${key}" not found in R2 bucket.`);
      return new Response(`Error: Image "${key}" file not found in R2 bucket.`, { status: 404 });
    }

    console.log(`Successfully fetched ${key} from R2.`);

    // Serve the image file with the correct MIME type
    return new Response(imageObject.body, {
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    console.log(`Error fetching image ${key} from R2:`, error);
    return new Response(`Error fetching image "${key}" from R2 bucket.`, { status: 522 });
  }
}

// Function to generate the questionnaire HTML
function generateQuestionnaireHTML(data) {
  const heading = data.heading; // Get the heading from JSON
  const questions = data.questions;
  const options = data.options;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${heading}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #000000; color: #FFFFFF; }
        .questionnaire { max-width: 600px; margin: 0 auto; background: #000000; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(255, 255, 255, 0.1); }
        .header-strip { display: flex; align-items: center; background-color: #FFEB00; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
        .header-strip img { height: 60px; width: auto; margin-right: 10px; }
        .heading { font-size: 24px; font-weight: bold; color: #000000; }
        .question { margin-bottom: 20px; }
        .options { margin-top: 10px; }
        .options button { margin-right: 10px; padding: 10px 20px; background-color: #FFEB00; color: #000000; border: none; border-radius: 5px; cursor: pointer; }
        .options a { text-decoration: none; }
        .navigation { margin-top: 20px; }
        .navigation button { background-color: #FFEB00; color: #000000; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
      </style>
      <script>
        let currentQuestionId = 'Q1';
        let historyStack = []; // Stack to keep track of navigation history

        const questions = ${JSON.stringify(questions)};
        const options = ${JSON.stringify(options)};

        document.addEventListener('DOMContentLoaded', function () {
          renderQuestion(currentQuestionId);
        });

        function renderQuestion(questionId) {
          const questionData = questions.find(q => q.id === questionId);
          const questionContainer = document.getElementById('question-container');

          questionContainer.innerHTML = getQuestionHTML(questionData);
          showNavigation();
        }

        function getQuestionHTML(questionData) {
          return '<div class="question">' +
            '<h3>' + questionData.question + '</h3>' +
            '<div class="options">' +
              questionData.options.map(option => 
                '<button onclick="handleAnswer(\\'' + option.next + '\\')">' + option.answer + '</button>'
              ).join('') +
            '</div>' +
          '</div>';
        }

        function handleAnswer(nextQuestionId) {
          // Save the current question ID to history stack
          historyStack.push(currentQuestionId);

          if (options[nextQuestionId]) {
            showOption(nextQuestionId);
          } else {
            currentQuestionId = nextQuestionId; // Update the current question ID
            renderQuestion(nextQuestionId);
          }
        }

        function showOption(optionId) {
          const questionContainer = document.getElementById('question-container');
          const link = options[optionId];

          questionContainer.innerHTML = getOptionHTML(link);
          showNavigation();
        }

        function getOptionHTML(option) {
          return '<div class="question"><h3>Selected Option:</h3></div>' +
            '<div class="options">' +
              '<a href="' + option.link + '" target="_self"><button>' + option.text + '</button></a>' +
            '</div>';
        }

        function showNavigation() {
          const questionContainer = document.getElementById('question-container');
          const navHTML = '<div class="navigation"><button onclick="goBack()">Back to Last Question</button></div>';
          questionContainer.innerHTML += navHTML;
        }

        function goBack() {
          if (historyStack.length > 0) {
            const lastQuestionId = historyStack.pop(); // Get the last question ID from the stack
            currentQuestionId = lastQuestionId; // Update the current question ID
            renderQuestion(lastQuestionId);
          }
        }
      </script>
    </head>
    <body>
      <div class="questionnaire">
        <div class="header-strip">
          <img src="/summer-series-logo.jpeg" alt="Logo" /> <!-- Corrected image path -->
          <div class="heading">${heading}</div>
        </div>
        <div id="question-container"></div>
      </div>
    </body>
    </html>
  `;
}
