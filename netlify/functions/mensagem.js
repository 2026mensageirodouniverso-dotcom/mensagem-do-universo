exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { mood, nome } = JSON.parse(event.body || "{}");

  const moodMap = {
    geral: "geral, sem contexto específico",
    ansioso: "ansioso ou preocupado com algo",
    triste: "triste ou desanimado",
    animado: "animado e cheio de energia",
    cansado: "cansado ou exausto",
    grato: "grato e em paz",
  };

  const nomeTexto = nome ? ` A mensagem é para ${nome}.` : "";

  const prompt = `Você é o oráculo do "Mensagem do Universo" — um biscoito da sorte digital brasileiro, sábio, acolhedor e poético.

A pessoa está se sentindo: ${moodMap[mood] || moodMap.geral}.${nomeTexto}

Crie UMA mensagem especial para ela. A mensagem deve:
- Ter 2 a 3 frases curtas e poéticas
- Soar como o universo sussurrando diretamente para a pessoa
- Trazer conforto, coragem ou reflexão suave
- Ser em português brasileiro cálido e natural
- Se houver nome, pode usá-lo com naturalidade dentro da mensagem (máximo 1 vez)
- Apenas o texto puro, sem aspas, travessões ou formatação

Responda SOMENTE com a mensagem. Nada mais.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const mensagem = data.content[0].text.trim();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ mensagem }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao gerar mensagem" }),
    };
  }
};
