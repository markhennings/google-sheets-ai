/**
 * Calls the OpenAI Chat API.
 * @constructor
 * @param {string} prompt Instructions for the LLM
 * @param {string} system System prompt instructions
 * @param {number} temperature 0 to 1 value to control randomness
 * @return OpenAI's API response.
 * @customfunction
 */
function OPENAI_CHAT(prompt, system="", temperature=0) {
  var conversation = [
    { 
      role: "system", 
      content: system,
    },
    { 
      role: "user", 
      content: prompt,
    },
  ];

  var body = {
    model: "gpt-4",
    messages: conversation,
    temperature: temperature,
    max_tokens: 256,
  };

  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(body),
    'headers': {
      Authorization: 'Bearer sk-proj-XXXXXXX',
    },
  };

  var response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', options);
  var json = JSON.parse(response.getContentText());
  var result = json.choices[0].message.content;

  return result;
}
