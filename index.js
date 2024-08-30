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
      </style>
      <script>
        function handleAnswer(answer) {
          const questionContainer = document.getElementById('question-container');
          let optionsHTML = '';

          if (answer === 'Spirit FC') {
            optionsHTML = '<button onclick="selectProgram(\'Program A\')">Program A</button>' +
                          '<button onclick="selectProgram(\'Program B\')">Program B</button>';
          } else if (answer === 'NWSF') {
            optionsHTML = '<button onclick="selectProgram(\'Program C\')">Program C</button>' +
                          '<button onclick="selectProgram(\'Program D\')">Program D</button>';
          }

          questionContainer.innerHTML = '<div class="question"><h3>Choose your program:</h3></div><div class="options">' + optionsHTML + '</div>';
        }

        function selectProgram(program) {
          alert('You selected ' + program + '!');
          // Here you can add code to handle the program selection, such as sending it to a backend or displaying more information.
        }
      </script>
    </head>
    <body>
      <div class="questionnaire">
        <div id="question-container">
          <div class="question">
            <h3>Were you a NWSF AYL or Spirit FC player in 2024?</h3>
            <div class="options">
              <button onclick="handleAnswer('Spirit FC')">Spirit FC</button>
              <button onclick="handleAnswer('NWSF')">NWSF</button>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
