export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      // Fetch the JSON file from R2 using the bucket binding
      const object = await env.BUCKET.get('questions.json');
      if (!object) {
        return new Response('Error: Questions file not found in R2 bucket.', { status: 404 });
      }
      
      const questionnaireData = await object.json();

      return new Response(generateQuestionnaireHTML(questionnaireData), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};

// Function to generate the questionnaire HTML
function generateQuestionnaireHTML(data) {
  const questions = data.questions;
  const options = data.options;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Spirit Summer Series Questionnaire</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #000000; color: #FFFFFF; }
        .questionnaire { max-width: 600px; margin: 0 auto; background: #000000; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(255, 255, 255, 0.1); }
        .question { margin-bottom: 20px; }
        .options { margin-top: 10px; }
        .options button { margin-right: 10px; padding: 10px 20px; background-color: #FFFF00; color: #000000; border: none; border-radius: 5px; cursor: pointer; }
        .options a { text-decoration: none; }
        .navigation { margin-top: 20px; }
        .navigation button { background-color: #FFFF00; color: #000000; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
      </style>
      <script>
        let currentQuestionId = 'Q1';

        const questions = ${JSON.stringify(questions)};
        const options = ${JSON.stringify(options)};

        document.addEventListener('DOMContentLoaded', function () {
          renderQuestion(currentQuestionId);
        });

        function renderQuestion(questionId) {
          const questionData = questions.find(q => q.id === questionId);
          const questionContainer = document.getElementById('question-container');

          questionContainer.innerHTML = `
            <div class="question">
              <h3>${questionData.question}</h3>
              <div class="options">
                ${questionData.options.map(option => 
                  '<button onclick="handleAnswer(\\'' + option.next + '\\')">' + option.answer + '</button>'
                ).join('')}
              </div>
            </div>
          `;
          showNavigation();
        }

        function handleAnswer(nextQuestionId) {
          if (options[nextQuestionId]) {
            showOption(nextQuestionId);
          } else {
            renderQuestion(nextQuestionId);
          }
        }

        function showOption(optionId) {
          const questionContainer = document.getElementById('question-container');
          const link = options[optionId];

          questionContainer.innerHTML = `
            <div class="question"><h3>Selected Option:</h3></div>
            <div class="options">
              <a href="${link}" target="_self"><button>${link.includes('http') ? 'Go to Option' : link}</button></a>
            </div>
          `;
          showNavigation();
        }

        function showNavigation() {
          const questionContainer = document.getElementById('question-container');
          const navHTML = `
            <div class="navigation">
              <button onclick="goBack()">Back to Last Question</button>
            </div>
          `;
          questionContainer.innerHTML += navHTML;
        }

        function goBack() {
          // Implement back navigation logic if necessary
        }
      </script>
    </head>
    <body>
      <div class="questionnaire">
        <div id="question-container"></div>
      </div>
    </body>
    </html>
  `;
}
