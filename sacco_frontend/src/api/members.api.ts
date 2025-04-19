import axiosInstance from './axios';
import { Member, MemberRegistrationRequest, NextOfKin, MemberDocument } from '@/types/member.types';

export const membersApi = {
  // Get all members with optional filtering
  getMembers: async (params?: { page?: number; search?: string }): Promise<{ results: Member[]; count: number }> => {
    const response = await axiosInstance.get('/members/', { params });
    return response.data;
  },
  
  // Get a single member by ID
  getMember: async (id: number): Promise<Member> => {
    const response = await axiosInstance.get(`/members/${id}/`);
    return response.data;
  },
  
  // Create a member (requires authentication, typically for staff)
  createMember: async (data: MemberRegistrationRequest): Promise<Member> => {
    const response = await axiosInstance.post('/members/', data);
    return response.data;
  },
  
  // Update a member
  updateMember: async (id: number, data: Partial<Member>): Promise<Member> => {
    const response = await axiosInstance.put(`/members/${id}/`, data);
    return response.data;
  },
  
  // Delete a member (not typically used, instead might deactivate)
  deleteMember: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/members/${id}/`);
  },
  
  // Update member status (active/inactive)
  updateStatus: async (id: number, status: string): Promise<Member> => {
    const response = await axiosInstance.post(`/members/${id}/update_status/`, { status });
    return response.data;
  },
  
  // Get current logged in member profile
  getCurrentMember: async (): Promise<Member> => {
    const response = await axiosInstance.get('/members/me/');
    return response.data;
  },
  
  // Get next of kin for a member
  getNextOfKin: async (memberId: number): Promise<NextOfKin[]> => {
    const response = await axiosInstance.get(`/next-of-kin/?member=${memberId}`);
    return response.data.results;
  },
  
  // Add next of kin for a member
  addNextOfKin: async (data: Omit<NextOfKin, 'id' | 'created_at' | 'updated_at'>): Promise<NextOfKin> => {
    const response = await axiosInstance.post('/next-of-kin/', data);
    return response.data;
  },
  
  // Update next of kin
  updateNextOfKin: async (id: number, data: Partial<NextOfKin>): Promise<NextOfKin> => {
    const response = await axiosInstance.put(`/next-of-kin/${id}/`, data);
    return response.data;
  },
  
  // Delete next of kin
  deleteNextOfKin: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/next-of-kin/${id}/`);
  },
  
  // Upload a document for a member
  uploadDocument: async (memberId: number, formData: FormData): Promise<MemberDocument> => {
    const response = await axiosInstance.post(`/members/${memberId}/upload_document/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Get member documents
  getMemberDocuments: async (memberId: number): Promise<MemberDocument[]> => {
    const response = await axiosInstance.get(`/members/${memberId}/documents/`);
    return response.data.results;
  }
};

export default membersApi;