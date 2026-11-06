export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const API_URL = import.meta.env.VITE_API_URL ?? "";
export const request = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(API_URL + path, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = "Si è verificato un errore";
    let fieldErrors: Record<string, string> | undefined;

    try {
      const problem = await response.json();
      message = problem.detail ?? message;
      fieldErrors = problem.errors;
    } catch {
      // risposta senza corpo JSON : resta il messaggio generico
    }

    throw new ApiError(message, response.status, fieldErrors);
  }

  const text = await response.text();

  if (text === "") {
    return undefined as T;
  }

  return JSON.parse(text) as T;
};
