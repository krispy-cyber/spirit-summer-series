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
        // Track the current question and the last answered state
        let currentQuestion = 1;
        let lastAnswer = null;

        document.addEventListener('DOMContentLoaded', function () {
          showQuestion1(); // Start with Question 1
        });

        function showQuestion1() {
          currentQuestion = 1; // Set current question to 1
          const questionContainer = document.getElementById('question-container');
          questionContainer.innerHTML = \`
            <div class="question">
              <h3>Were you a NWSF AYL or Spirit FC player in 2024?</h3>
              <div class="options">
                <button onclick="handleAnswer('Yes')">Yes</button>
                <button onclick="handleAnswer('No')">No</button>
              </div>
            </div>
          \`;
        }

        function handleAnswer(answer) {
          lastAnswer = answer;
          currentQuestion = 2; // Move to question 2

          if (answer === 'Yes') {
            showQuestion2YesPath();
          } else if (answer === 'No') {
            showQuestion2NoPath();
          }
        }

        function showQuestion2YesPath() {
          currentQuestion = 2; // Set current question to 2
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
          \`;
          showNavigation();
        }

        function showQuestion2NoPath() {
          currentQuestion = 2; // Set current question to 2
          const questionContainer = document.getElementById('question-container');
          questionContainer.innerHTML = \`
            <div class="question">
              <h3>Is your player currently 8 years of age or older?</h3>
              <div class="options">
                <button onclick="handleAgeQuestion('Yes')">Yes</button>
                <button onclick="handleAgeQuestion('No')">No</button>
              </div>
            </div>
          \`;
          showNavigation();
        }

        function handleAgeQuestion(answer) {
          lastAnswer = answer;
          currentQuestion = 3; // Move to question 3
          if (answer === 'Yes') {
            showQuestion3ForOlder();
          } else if (answer === 'No') {
            showPreAcademyOption();
          }
        }

        function showQuestion3ForOlder() {
          currentQuestion = 3; // Set current question to 3
          const questionContainer = document.getElementById('question-container');
          questionContainer.innerHTML = \`
            <div class="question">
              <h3>Did you attend NWS Academy in winter this year?</h3>
              <div class="options">
                <button onclick="handleNWSAcademyAnswer('Yes')">Yes</button>
                <button onclick="handleNWSAcademyAnswer('No')">No</button>
              </div>
            </div>
          \`;
          showNavigation();
        }

        function handleNWSAcademyAnswer(answer) {
          lastAnswer = answer;
          currentQuestion = 4; // Set current question to 4
          const questionContainer = document.getElementById('question-container');

          if (answer === 'Yes') {
            showTrainingOptionsForAcademy();
          } else {
            showNonAcademyOptions();
          }
        }

        function showTrainingOptionsForAcademy() {
          currentQuestion = 4; // Set current question to 4
          const questionContainer = document.getElementById('question-container');
          questionContainer.innerHTML = \`
            <div class="question">
              <h3>Do you want group training, personalized training, or both?</h3>
              <div class="options">
                <button onclick="showAcademyOption('Group Training')">Group Training</button>
                <button onclick="showAcademyOption('Personalized Training')">Personalized Training</button>
                <button onclick="showAcademyOption('Both')">Both</button>
              </div>
            </div>
          \`;
          showNavigation();
        }
        
        function showNonAcademyOptions() {
          currentQuestion = 4; // Set current question to 4
          const questionContainer = document.getElementById('question-container');
          questionContainer.innerHTML = \`
            <div class="question">
              <h3>Choose your preferred option:</h3>
              <div class="options">
                <a href="https://shop.nwsf.com.au/product/nwsf-summer-academy/54?cp=true&sa=false&sbp=false&q=false&category_id=10">
                  <button>Group Training (NWSF Summer Academy)</button>
                </a>
                <a href="#">
                  <button>NWSF Summer Academy with additional personalised sessions (Link Pending)</button>
                </a>
              </div>
            </div>
          \`;
          showNavigation();
        }

        function showAcademyOption(trainingType) {
          lastAnswer = trainingType;
          currentQuestion = 5; // Move to options display for academy
          const questionContainer = document.getElementById('question-container');
          let optionsHTML = '';

          if (trainingType === 'Group Training') {
            optionsHTML = \`
              <div class="question"><h3>NWSF Summer Academy Option:</h3></div>
              <div class="options">
                <a href="https://shop.nwsf.com.au/product/nwsf-summer-academy/54?cp=true&sa=false&sbp=false&q=false&category_id=10">
                  <button>NWSF Summer Academy</button>
                </a>
              </div>
            \`;
          } else if (trainingType === 'Personalized Training') {
            optionsHTML = \`
              <div class="question"><h3>NWSF Academy X-Factor Option:</h3></div>
              <div class="options">
                <a href="https://shop.nwsf.com.au/product/nwsf-academy-x-factor/55?cp=true&sa=false&sbp=false&q=false&category_id=10">
                  <button>NWSF Academy X-Factor</button>
                </a>
              </div>
            \`;
          } else if (trainingType === 'Both') {
            optionsHTML = \`
              <div class="question"><h3>Combined Training Option:</h3></div>
              <div class="options">
                <a href="#">
                  <button>NWSF Summer Academy with X-Factor (Link Pending)</button>
                </a>
              </div>
            \`;
          }

          questionContainer.innerHTML = optionsHTML;
          showNavigation();
        }

        function showPreAcademyOption() {
          currentQuestion = 3; // Set current question to 3
          const questionContainer = document.getElementById('question-container');
          questionContainer.innerHTML = \`
            <div class="question"><h3>NWSF Summer Pre-Academy Option:</h3></div>
            <div class="options">
              <a href="https://shop.nwsf.com.au/product/nwsf-summer-pre-academy/59?cp=true&sa=false&sbp=false&q=false&category_id=10">
                <button>NWSF Summer Pre-Academy</button>
              </a>
            </div>
          \`;
          showNavigation();
        }

        function showOptions(trainingType) {
          lastAnswer = trainingType;
          currentQuestion = 3; // Move to options display (Question 3 equivalent)
          const questionContainer = document.getElementById('question-container');
          let optionsHTML = '';

          if (trainingType === 'Group Training') {
            optionsHTML = \`
              <div class="question"><h3>Group Training Option:</h3></div>
              <div class="options">
                <a href="https://shop.nwsf.com.au/product/spirit-fc-summer-squads/57?cp=true&sa=false&sbp=false&q=false&category_id=10">
                  <button>Spirit FC Summer Squads</button>
                </a>
              </div>
            \`;
          } else if (trainingType === 'Personalized Training') {
            optionsHTML = \`
              <div class="question"><h3>Personalized Training Option:</h3></div>
              <div class="options">
                <a href="https://shop.nwsf.com.au/product/spirit-fc-summer-x-factor/52?cp=true&sa=false&sbp=false&q=false&category_id=10">
                  <button>Spirit FC Summer X-Factor</button>
                </a>
              </div>
            \`;
          } else if (trainingType === 'Both') {
            optionsHTML = \`
              <div class="question"><h3>Combined Training Option:</h3></div>
              <div class="options">
                <a href="#">
                  <button>Spirit FC Summer Squads with X-Factor (Link Pending)</button>
                </a>
              </div>
            \`;
          }

          questionContainer.innerHTML = optionsHTML;
          showNavigation();
        }

        function showNavigation() {
          const questionContainer = document.getElementById('question-container');
          const navHTML = \`
            <div class="navigation">
              <button onclick="goBack()">Back to Last Question</button>
            </div>
          \`;
          questionContainer.innerHTML += navHTML;
        }

        function goBack() {
          if (currentQuestion === 5) {
            showTrainingOptionsForAcademy(); // Go back to training options for academy
          } else if (currentQuestion === 4) {
            showQuestion3ForOlder(); // Go back to Question 3 (Age Question for older players)
          } else if (currentQuestion === 3) {
            if (lastAnswer === 'Yes' || lastAnswer === 'No') {
              showQuestion2NoPath(); // Go back to Question 2 No Path
            } else {
              showQuestion2YesPath(); // Go back to Question 2 Yes Path
            }
          } else if (currentQuestion === 2) {
            showQuestion1(); // Go back to Question 1
          }
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
