export interface RequestHandlerProps<T = unknown, E = Error> {
  onSuccess?: (data: T) => void | unknown | Promise<void | unknown>;
  onError?: (error: E) => void | unknown | Promise<void | unknown>;
}