function generateCacheKey(parts) {
  var text = parts.join(':');
  var hash = 0, i, chr;
  for (i = 0; i < text.length; i++) {
    chr   = text.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return 'openai_chat:' + hash.toString();
}

/**
 * Calls the OpenAI Chat API. Returns cached response when possible.
 * @constructor
 * @param {string} prompt Instructions for the LLM
 * @param {string} system System prompt instructions
 * @param {number} temperature 0 to 1 value to control randomness
 * @return OpenAI's API response.
 * @customfunction
 */
function OPENAI_CHAT(prompt, system="", temperature=0) {
  var cache = CacheService.getScriptCache();
  var cacheKey = generateCacheKey([prompt, system, temperature.toString()]);

  // Try to get cached response
  var cached = cache.get(cacheKey);
  if (cached != null) {
    return cached;
  }

  var conversation = [
    { role: "system", content: system },
    { role: "user", content: prompt },
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

  // Cache the result before returning
  cache.put(cacheKey, result);
  return result;
}
