import { QueryClient, QueryClientConfig } from '@tanstack/react-query';

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export interface ApiClientOptions {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
}

export class ApiClient {
  private readonly baseUrl: string;

  private readonly defaultHeaders: Record<string, string>;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.defaultHeaders,
    };
  }

  async get<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
    const response = await fetch(this.buildUrl(path), {
      method: 'GET',
      headers: this.defaultHeaders,
      ...init,
    });
    return this.parseResponse<TResponse>(response);
  }

  async post<TPayload, TResponse>(
    path: string,
    payload: TPayload,
    init?: RequestInit,
  ): Promise<TResponse> {
    const response = await fetch(this.buildUrl(path), {
      method: 'POST',
      headers: this.defaultHeaders,
      body: JSON.stringify(payload),
      ...init,
    });
    return this.parseResponse<TResponse>(response);
  }

  async patch<TPayload, TResponse>(
    path: string,
    payload: TPayload,
    init?: RequestInit,
  ): Promise<TResponse> {
    const response = await fetch(this.buildUrl(path), {
      method: 'PATCH',
      headers: this.defaultHeaders,
      body: JSON.stringify(payload),
      ...init,
    });
    return this.parseResponse<TResponse>(response);
  }

  private buildUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    if (!this.baseUrl) {
      throw new Error('API base URL is not configured.');
    }
    return `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  private async parseResponse<TResponse>(response: Response): Promise<TResponse> {
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Request failed with status ${response.status}`);
    }
    if (response.status === 204) {
      return undefined as TResponse;
    }
    return (await response.json()) as TResponse;
  }
}

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
};

export const apiClient = new ApiClient();

export const createQueryClient = () => new QueryClient(queryClientConfig);
