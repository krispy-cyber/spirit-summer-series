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
        .navigation { margin-top: 20px; }
        .selections { margin-top: 20px; font-weight: bold; }
      </style>
      <script>
        // Track user selections
        let selections = {
          q1: null,
          q2: null
        };

        document.addEventListener('DOMContentLoaded', function () {
          showQuestion1(); // Start with Question 1
        });

        function showQuestion1() {
          const questionContainer = document.getElementById('question-container');
          questionContainer.innerHTML = \`
            <div class="question">
              <h3>Were you a NWSF AYL or Spirit FC player in 2024?</h3>
              <div class="options">
                <button onclick="handleAnswer('Yes')">Yes</button>
                <button onclick="handleAnswer('No')">No</button>
              </div>
            </div>
            <div class="navigation"></div>
            <div class="selections" id="selections-display"></div>
          \`;
          displaySelections();
        }

        function handleAnswer(answer) {
          selections.q1 = answer;
          if (answer === 'Yes') {
            showQuestion2();
          } else if (answer === 'No') {
            document.getElementById('question-container').innerHTML = '<p>Options for non-players in 2024 will be displayed here.</p>';
            displaySelections();
          }
        }

        function showQuestion2() {
          const questionContainer = document.getElementById('question-container');
          questionContainer.innerHTML = \`
            <div class="question">
              <h3>Do you want group training, personalized training, or both?</h3>
              <div class="options">
                <button onclick="showOptions('Group Training')">Group Training</button>
                <button onclick="showOptions('Personalized Training')">Personalized Training</button>
                <button onclick="showOptions('Both')">Both</button>
              </div>
            </div>
            <div class="navigation">
              <button onclick="goBackToQuestion1()">Back to Question 1</button>
            </div>
            <div class="selections" id="selections-display"></div>
          \`;
          displaySelections();
        }

        function showOptions(trainingType) {
          selections.q2 = trainingType;
          const questionContainer = document.getElementById('question-container');
          let optionsHTML = '';

          if (trainingType === 'Group Training') {
            optionsHTML = \`
              <div class="question"><h3>Group Training Option:</h3></div>
              <div class="options">
                <a href="https://shop.nwsf.com.au/product/spirit-fc-summer-squads/57?cp=true&sa=false&sbp=false&q=false&category_id=10" target="_blank">
                  <button>Spirit FC Summer Squads</button>
                </a>
              </div>
            \`;
          } else if (trainingType === 'Personalized Training') {
            optionsHTML = \`
              <div class="question"><h3>Personalized Training Option:</h3></div>
              <div class="options">
                <a href="https://shop.nwsf.com.au/product/spirit-fc-summer-x-factor/52?cp=true&sa=false&sbp=false&q=false&category_id=10" target="_blank">
                  <button>Spirit FC Summer X-Factor</button>
                </a>
              </div>
            \`;
          } else if (trainingType === 'Both') {
            optionsHTML = \`
              <div class="question"><h3>Combined Training Option:</h3></div>
              <div class="options">
                <a href="#" target="_blank">
                  <button>Spirit FC Summer Squads with X-Factor (Link Pending)</button>
                </a>
              </div>
            \`;
          }

          optionsHTML += \`
            <div class="navigation">
              <button onclick="showQuestion2()">Back to Question 2</button>
            </div>
          \`;

          questionContainer.innerHTML = optionsHTML;
          displaySelections();
        }

        function goBackToQuestion1() {
          selections.q2 = null;  // Reset selections when going back
          showQuestion1();
        }

        function displaySelections() {
          const selectionsDisplay = document.getElementById('selections-display');
          selectionsDisplay.innerHTML = \`
            Selected Options: 
            <ul>
              <li>Question 1: \${selections.q1 || 'Not answered yet'}</li>
              <li>Question 2: \${selections.q2 || 'Not answered yet'}</li>
            </ul>
          \`;
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
