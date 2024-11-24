import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export default class ApiClient {
  protected static client: AxiosInstance;

  protected static async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(endpoint, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  protected static async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private static handleError(error: any): void {
    // Обробка помилок (наприклад, логування чи показ повідомлень)
    console.error("API Error:", error);
  }
}