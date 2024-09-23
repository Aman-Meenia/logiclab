// Response type

export interface responseType {
  message: string;
  status: number;
  success: "true" | "false";
  messages?: object[];
  error?: string;
}

// Problem Request type
