const IAM_TOKEN_URL = "https://iam.cloud.ibm.com/identity/token";

let cachedIamToken: { token: string; expiresAt: number } | null = null;

export function isWatsonxConfigured(): boolean {
  return !!(process.env.WATSONX_API_KEY && process.env.WATSONX_PROJECT_ID && process.env.WATSONX_URL);
}

async function getIamToken(): Promise<string> {
  if (cachedIamToken && Date.now() < cachedIamToken.expiresAt - 60_000) {
    return cachedIamToken.token;
  }

  const apiKey = process.env.WATSONX_API_KEY;
  if (!apiKey) throw new Error("WATSONX_API_KEY not configured");

  const res = await fetch(IAM_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: apiKey,
    }),
  });

  if (!res.ok) {
    throw new Error(`IBM IAM token exchange failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  cachedIamToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedIamToken.token;
}

export type WatsonxGenerateInput = {
  /** The fully-assembled prompt, including system instructions and injected customer context. */
  prompt: string;
  modelId?: string;
  maxNewTokens?: number;
  temperature?: number;
};

export type WatsonxGenerateResult = {
  text: string;
  inputTokens: number;
  outputTokens: number;
  modelId: string;
  mocked: boolean;
};

/**
 * Calls IBM watsonx.ai text generation. Falls back to a clearly-labeled mock
 * response when WATSONX_* env vars aren't set yet, so the gateway/dashboard
 * flow can be built and demoed before real IBM credentials are provisioned.
 */
export async function watsonxGenerate(input: WatsonxGenerateInput): Promise<WatsonxGenerateResult> {
  const modelId = input.modelId || process.env.WATSONX_MODEL_ID || "ibm/granite-13b-instruct-v2";

  if (!isWatsonxConfigured()) {
    const mockText = `[MOCK — watsonx not configured] This is a placeholder AI response for the prompt you sent. Set WATSONX_API_KEY, WATSONX_PROJECT_ID, and WATSONX_URL to call the real IBM watsonx.ai model.`;
    return {
      text: mockText,
      inputTokens: Math.ceil(input.prompt.length / 4),
      outputTokens: Math.ceil(mockText.length / 4),
      modelId: `${modelId} (mock)`,
      mocked: true,
    };
  }

  const token = await getIamToken();
  const baseUrl = process.env.WATSONX_URL;
  const projectId = process.env.WATSONX_PROJECT_ID;

  const res = await fetch(`${baseUrl}/ml/v1/text/generation?version=2024-05-01`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model_id: modelId,
      project_id: projectId,
      input: input.prompt,
      parameters: {
        max_new_tokens: input.maxNewTokens ?? 500,
        temperature: input.temperature ?? 0.3,
        decoding_method: "greedy",
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`watsonx generation failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const result = data.results?.[0];

  return {
    text: result?.generated_text ?? "",
    inputTokens: result?.input_token_count ?? 0,
    outputTokens: result?.generated_token_count ?? 0,
    modelId,
    mocked: false,
  };
}
