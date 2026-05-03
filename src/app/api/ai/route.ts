import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const fallbackResponse = {
  answer: "Please verify from official ECI sources. Election rules may vary.",
  steps: ["Visit NVSP website", "Check voter information", "Contact local election office"],
  source: 'fallback',
  confidence: 'low'
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body?.query;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(fallbackResponse, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(fallbackResponse, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are SARTHI, an Indian Election Assistant.
Constraints:
- Answer ONLY concerning Indian civic and voting domains, ECI data, India voting.
- Provide factual, unbiased answers based on Election Commission of India guidelines.
Return the response as a JSON object with this exact structure (no markdown, no extra text):
{
  "answer": "string",
  "steps": ["string"],
  "documents": ["string"],
  "links": [{"label": "string", "url": "string"}],
  "confidence": "high",
  "source": "gemini"
}
User question: "${query}"`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT' as any, threshold: 'BLOCK_MEDIUM_AND_ABOVE' as any },
        { category: 'HARM_CATEGORY_HATE_SPEECH' as any, threshold: 'BLOCK_MEDIUM_AND_ABOVE' as any },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as any, threshold: 'BLOCK_MEDIUM_AND_ABOVE' as any },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as any, threshold: 'BLOCK_MEDIUM_AND_ABOVE' as any }
      ]
    });
    const responseText = result.response.text();
    
    let parsed;
    try {
      const jsonStr = responseText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(jsonStr);
      
      if (!parsed.answer || !Array.isArray(parsed.steps)) {
        // Handle previous "explanation" schema from older code just in case
        if (parsed.explanation && Array.isArray(parsed.steps)) {
          parsed.answer = parsed.explanation;
        } else {
          throw new Error("Invalid AI response shape");
        }
      }
    } catch (parseError) {
      return NextResponse.json(fallbackResponse, { status: 200 });
    }

    return NextResponse.json({
      answer: parsed.answer,
      steps: parsed.steps,
      documents: parsed.documents || [],
      links: parsed.links || [],
      source: parsed.source || 'gemini',
      confidence: parsed.confidence || 'high'
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(fallbackResponse, { status: 500 });
  }
}
