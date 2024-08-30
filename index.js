export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Serve the main questionnaire page
    if (url.pathname === '/') {
      return new Response(generateQuestionnaireHTML(), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};

// Function to generate the questionnaire HTML
function generateQuestionnaireHTML() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Spirit Summer Series Questionnaire</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .questionnaire { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        .question { margin-bottom: 20px; }
        .options { margin-top: 10px; }
        .options button { margin-right: 10px; padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .options a { text-decoration: none; }
      </style>
      <script>
        document.addEventListener('DOMContentLoaded', function () {
          // Attach event listeners to the initial buttons
          document.getElementById('yes-button').addEventListener('click', function () {
            handleAnswer('Yes');
          });
          document.getElementById('no-button').addEventListener('click', function () {
            handleAnswer('No');
          });
        });

        function handleAnswer(answer) {
          const questionContainer = document.getElementById('question-container');
          let optionsHTML = '';

          if (answer === 'Yes') {
            optionsHTML = `
              <div class="question"><h3>Do you want group training, personalized training, or both?</h3></div>
              <div class="options">
                <button onclick="showOptions('Group Training')">Group Training</button>
                <button onclick="showOptions('Personalized Training')">Personalized Training</button>
                <button onclick="showOptions('Both')">Both</button>
              </div>
            `;
          } else if (answer === 'No') {
            optionsHTML = '<p>Options for non-players in 2024 will be displayed here.</p>';
          }

          questionContainer.innerHTML = optionsHTML;
        }

        function showOptions(trainingType) {
          const questionContainer = document.getElementById('question-container');
          let optionsHTML = '';

          if (trainingType === 'Group Training') {
            optionsHTML = `
              <div class="question"><h3>Group Training Option:</h3></div>
              <div class="options">
                <a href="https://shop.nwsf.com.au/product/spirit-fc-summer-squads/57?cp=true&sa=false&sbp=false&q=false&category_id=10" target="_blank">
                  <button>Spirit FC Summer Squads</button>
                </a>
              </div>
            `;
          } else if (trainingType === 'Personalized Training') {
            optionsHTML = `
              <div class="question"><h3>Personalized Training Option:</h3></div>
              <div class="options">
                <a href="https://shop.nwsf.com.au/product/spirit-fc-summer-x-factor/52?cp=true&sa=false&sbp=false&q=false&category_id=10" target="_blank">
                  <button>Spirit FC Summer X-Factor</button>
                </a>
              </div>
            `;
          } else if (trainingType === 'Both') {
            optionsHTML = `
              <div class="question"><h3>Combined Training Option:</h3></div>
              <div class="options">
                <a href="#" target="_blank">
                  <button>Spirit FC Summer Squads with X-Factor (Link Pending)</button>
                </a>
              </div>
            `;
          }

          questionContainer.innerHTML = optionsHTML;
        }
      </script>
    </head>
    <body>
      <div class="questionnaire">
        <div id="question-container">
          <div class="question">
            <h3>Were you a NWSF AYL or Spirit FC player in 2024?</h3>
            <div class="options">
              <button id="yes-button">Yes</button>
              <button id="no-button">No</button>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
