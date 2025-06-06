// User related types
export interface User {
  id: number;
  name: string;
  lastname: string;
  username: string;
  email: string;
  registrationDate: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'BLOCKED';
}

export interface AuthUser extends User {
  token: string;
}

export interface LoginRequest {
  nombreUsuario: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  apellidos: string;
  nombreUsuario: string;
  correo: string;
  contrasena: string;
}

// Photo related types
export interface Photo {
  id: number;
  userId: number;
  username: string;
  url: string;
  description: string;
  datePosted: string;
  likesCount: number;
  commentsCount: number;
  userLiked: boolean;
}

export interface PhotoCreateRequest {
  description: string;
  imageFile: File;
}

// Comment related types
export interface Comment {
  id: number;
  userId: number;
  username: string;
  photoId: number;
  content: string;
  datePosted: string;
}

export interface CommentCreateRequest {
  photoId: number;
  content: string;
}

// Message related types
export interface Message {
  id: number;
  senderId: number;
  senderUsername: string;
  receiverId: number;
  receiverUsername: string;
  content: string;
  dateSent: string;
  status: 'READ' | 'UNREAD';
}

export interface MessageCreateRequest {
  receiverId: number;
  content: string;
}

// Notification related types
export interface Notification {
  id: number;
  userId: number;
  type: 'LIKE' | 'COMMENT' | 'MESSAGE' | 'SYSTEM';
  content: string;
  dateCreated: string;
  read: boolean;
  relatedId?: number;
}

// Report related types
export interface Report {
  id: number;
  reporterId: number;
  reportedId: number;
  contentType: 'PHOTO' | 'COMMENT' | 'MESSAGE';
  contentId: number;
  reason: string;
  dateReported: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
}

export interface ReportCreateRequest {
  reportedId: number;
  contentType: 'PHOTO' | 'COMMENT' | 'MESSAGE';
  contentId: number;
  reason: string;
}

// Pagination and response types
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}