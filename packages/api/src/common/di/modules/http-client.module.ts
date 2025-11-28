/**
 * HTTP Client DI Module - SRP Compliant
 * Single Responsibility: Configure HTTP client implementations
 */

import { DIContainer, BaseContainerModule } from '../container';
import { ServiceResult } from '../../interfaces/base-service.interface';
import {
  IHttpClient,
  HttpResponse,
} from '../../interfaces/infrastructure.interface';

export class HttpClientModule extends BaseContainerModule {
  constructor(private environment: string) {
    super();
  }

  async configure(container: DIContainer): Promise<ServiceResult<void>> {
    try {
      await Promise.resolve(); // ESLint requires await in async methods
      container.registerFactory(
        'IHttpClient',
        () => new MockHttpClient(),
        'singleton',
      );
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'HTTP_CLIENT_MODULE_ERROR',
          message: 'Failed to configure HTTP client module',
          details: {
            originalError:
              error instanceof Error ? error.message : 'Unknown error',
          },
        },
      };
    }
  }
}

export class MockHttpClient implements IHttpClient {
  async get<T>(url: string): Promise<ServiceResult<HttpResponse<T>>> {
    return this.makeRequest<T>('GET', url);
  }

  async post<T>(
    url: string,
    data?: any,
  ): Promise<ServiceResult<HttpResponse<T>>> {
    return this.makeRequest<T>('POST', url, data);
  }

  async put<T>(
    url: string,
    data?: any,
  ): Promise<ServiceResult<HttpResponse<T>>> {
    return this.makeRequest<T>('PUT', url, data);
  }

  async patch<T>(
    url: string,
    data?: any,
  ): Promise<ServiceResult<HttpResponse<T>>> {
    return this.makeRequest<T>('PATCH', url, data);
  }

  async delete<T>(url: string): Promise<ServiceResult<HttpResponse<T>>> {
    return this.makeRequest<T>('DELETE', url);
  }

  interceptRequest(): void {}
  interceptResponse(): void {}

  private async makeRequest<T>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _method: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _url: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _data?: any,
  ): Promise<ServiceResult<HttpResponse<T>>> {
    await Promise.resolve(); // ESLint requires await in async methods
    const mockResponse: HttpResponse<T> = {
      data: {} as T,
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    };
    return { success: true, data: mockResponse };
  }
}
