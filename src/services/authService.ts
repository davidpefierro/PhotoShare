import api from './api';
import { LoginRequest, RegisterRequest, AuthUser, ApiResponse } from '../types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const authService = {
  ensureAdminExists: async (): Promise<void> => {
    try {
      // Check if admin user exists in auth.users table
      const { data: { user: adminAuthUser }, error: authCheckError } = await supabase.auth.admin.getUserByEmail('admin@photoshare.com');

      if (!adminAuthUser && !authCheckError) {
        // Create admin auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: 'admin@photoshare.com',
          password: 'Admin123!',
          email_confirm: true,
          user_metadata: {
            name: 'Admin',
            lastname: 'User',
            username: 'admin',
            role: 'ADMIN',
          },
        });

        if (authError) {
          console.error('Error creating admin auth user:', authError);
          return;
        }

        if (!authData.user) {
          console.error('Admin user creation failed - no user returned');
          return;
        }

        // Insert into users table using admin privileges
        const { error: profileError } = await supabase.auth.admin.query(`
          INSERT INTO users (id, name, lastname, username, email, password, role, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          authData.user.id,
          'Admin',
          'User',
          'admin',
          'admin@photoshare.com',
          '',
          'ADMIN',
          'ACTIVE'
        ]);

        if (profileError) {
          console.error('Error creating admin profile:', profileError);
          return;
        }

        console.log('Admin user created successfully');
      }
    } catch (error) {
      console.error('Error in ensureAdminExists:', error);
    }
  },

  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthUser>> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      if (!data.user || !data.session) {
        throw new Error('Login successful but user data is missing');
      }

      // Use RPC function to fetch user data securely
      const { data: userData, error: userError } = await supabase
        .rpc('get_user_profile', { user_id: data.user.id });

      if (userError) throw userError;
      if (!userData) throw new Error('User profile not found');

      return {
        success: true,
        data: {
          id: data.user.id,
          email: data.user.email!,
          name: userData.name,
          lastname: userData.lastname,
          username: userData.username,
          token: data.session.access_token,
          role: userData.role,
          status: userData.status,
          registrationDate: data.user.created_at,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Login failed',
      };
    }
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse<AuthUser>> => {
    try {
      // First create the auth user
      const { data: { user, session }, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            lastname: userData.lastname,
            username: userData.username,
            role: 'USER',
          },
        },
      });

      if (error) throw error;
      if (!user || !session) throw new Error('Registration failed');

      // Insert the user data into our users table using RPC function
      const { error: profileError } = await supabase.rpc('create_user_profile', {
        user_id: user.id,
        user_name: userData.name,
        user_lastname: userData.lastname,
        user_username: userData.username,
        user_email: userData.email
      });

      if (profileError) throw profileError;

      return {
        success: true,
        data: {
          id: user.id,
          email: user.email!,
          name: userData.name,
          lastname: userData.lastname,
          username: userData.username,
          token: session.access_token,
          role: 'USER',
          status: 'ACTIVE',
          registrationDate: user.created_at,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Registration failed',
      };
    }
  },

  logout: async (): Promise<ApiResponse<null>> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Logout failed',
      };
    }
  },

  validateToken: async (): Promise<ApiResponse<AuthUser>> => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (!session) throw new Error('No active session');

      const user = session.user;

      // Use RPC function to fetch user data securely
      const { data: userData, error: userError } = await supabase
        .rpc('get_user_profile', { user_id: user.id });

      if (userError) throw userError;
      if (!userData) throw new Error('User profile not found');

      return {
        success: true,
        data: {
          id: user.id,
          email: user.email!,
          name: userData.name,
          lastname: userData.lastname,
          username: userData.username,
          token: session.access_token,
          role: userData.role,
          status: userData.status,
          registrationDate: user.created_at,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Token validation failed',
      };
    }
  },
};