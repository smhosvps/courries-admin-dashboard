import { api } from "@/redux/api/apiSlice";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // endpoins here
    register: builder.mutation({
      query: ({
        firstName,
        lastName,
        middleName,
        state_of_origin,
        Local_of_origin,
        email,
        register_source,
        register_device,
        designation,
        ipps,
        nin,
        tin,
        nhf,
        nhi,
        year_of_appointment,
        year_of_retirement,
        department_or_station,
        staffId,
        password,
        role,
        phoneNumber,
        dateOfBirth,
        gender,
        address,
      }) => ({
        url: "register-user",
        method: "POST",
        body: {
          firstName,
          lastName,
          middleName,
          state_of_origin,
          Local_of_origin,
          email,
          register_source,
          register_device,
          designation,
          ipps,
          nin,
          tin,
          nhf,
          nhi,
          year_of_appointment,
          year_of_retirement,
          department_or_station,
          staffId,
          password,
          role,
          phoneNumber,
          dateOfBirth,
          gender,
          address,
        },
        credentials: "include" as const,
      }),
    }),
    // Update user profile
    updateUserProfile: builder.mutation({
      query: (userData) => ({
        url: "profile/update",
        method: "PUT",
        body: userData,
      }),
    }),

    // Admin endpoints
    getAllUsersFcm: builder.query({
      query: () => ({
        url: "admin-manage-users",
      }),
    }),

    getUserDetailsFcm: builder.query({
      query: (id) => `admin-manage-users/users/${id}`,
    }),

    updateUserFcm: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `admin-manage-users/users-edit/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteUserFcm: builder.mutation({
      query: (id) => ({
        url: `admin-manage-users/users-delete/${id}`,
        method: "DELETE",
      }),
    }),

    restoreUserFcm: builder.mutation({
      query: (id) => ({
        url: `admin-manage-users/users-restore/${id}/restore`,
        method: "PUT",
      }),
    }),

    // Admin User Management

    addUser: builder.mutation({
      query: (userData) => ({
        url: "add-user-admin",
        method: "POST",
        body: userData,
      }),
    }),

    getUsers: builder.query({
      query: () => "admin-all-users",
    }),

    updateUser: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `admin-edit-users/${id}`,
        method: "PUT",
        body: updates,
      }),
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `delete-user/${id}`,
        method: "DELETE",
      }),
    }),

    getDetailUser: builder.query({
      query: (id) => `single-user/${id}`,
    }),

    addUserProperty: builder.mutation({
      query: (data: { userId: string; property: string }) => ({
        url: "/add-property",
        method: "POST",
        body: data,
      }),
    }),
    removeUserProperty: builder.mutation({
      query: (data: { userId: string }) => ({
        url: "/remove-property",
        method: "POST",
        body: data,
      }),
    }),

    activation: builder.mutation({
      query: ({ otp, email }: any) => ({
        url: "verify-otp",
        method: "POST",
        body: {
          otp,
          email,
        },
      }),
    }),
    resendOtp: builder.mutation({
      query: ({ email }: any) => ({
        url: "resent-otp",
        method: "POST",
        body: {
          email,
        },
      }),
    }),
    forgot_password: builder.mutation({
      query: ({ email }) => ({
        url: "forgot-password-admin",
        method: "POST",
        // credentials: "include" as const,
        body: {
          email,
        },
      }),
    }),

    reset_password: builder.mutation({
      query: ({ email, otp, newPassword }) => ({
        url: "reset-password",
        method: "POST",
        // credentials: "include" as const,
        body: {
          email,
          otp,
          newPassword,
        },
      }),
    }),

    // Already In use

    updateAvatar: builder.mutation({
      query: (data: { avatar: string }) => ({
        url: "update-user-avatar",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),

    updateProfile: builder.mutation({
      query: (updates) => ({
        url: "profile-update-user",
        method: "PUT",
        body: updates,
      }),
    }),

      changePassword: builder.mutation({
      query: (data) => ({
        url: "change-password",
        method: "PUT",
        body: data,
      }),
    }),

    updateKyc: builder.mutation({
      query: ({ type, id_number, business_name, reg_number }) => ({
        url: "users-kyc",
        method: "PUT",
        body: { type, id_number, business_name, reg_number },
        credentials: "include" as const,
      }),
    }),

    updateUserData: builder.mutation({
      query: ({ name, role, phoneNumber }) => ({
        url: "update-user-info",
        method: "PUT",
        body: {
          name,
          role,
          phoneNumber,
        },
        credentials: "include" as const,
      }),
    }),

    updateUserPreference: builder.mutation({
      query: ({
        propertyDestinationCountry,
        propertyDestinationCity,
        propertyRating,
        propertyType,
        nightlyRate,
      }) => ({
        url: "update-user-info-preference",
        method: "PUT",
        body: {
          propertyDestinationCountry,
          propertyDestinationCity,
          propertyRating,
          propertyType,
          nightlyRate,
        },
        credentials: "include" as const,
      }),
    }),
    updateNotificationData: builder.mutation({
      query: ({ notification }) => ({
        url: "update-user-info-notification",
        method: "PUT",
        body: { notification },
        credentials: "include" as const,
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ currentPassword, newPassword, id }) => ({
        url: `user/${id}/password`,
        method: "PUT",
        body: { currentPassword, newPassword },
        credentials: "include" as const,
      }),
    }),
    addCircle: builder.mutation({
      query: ({ email, name }) => ({
        url: `add-circle`,
        method: "POST",
        body: { email, name },
        credentials: "include" as const,
      }),
    }),
    getAllcircle: builder.query({
      query: () => ({
        url: "all-circle",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    deleteCircle: builder.mutation({
      query: (email) => ({
        url: `remove-cirlcle`,
        method: "POST",
        body: { email },
        credentials: "include" as const,
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "get-users",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `users/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getUserReports: builder.query({
      query: () => ({
        url: `users-report`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    deleteUserAdmin: builder.mutation({
      query: (id) => ({
        url: `/delete-user-admin/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
    updateUserRole: builder.mutation({
      query: ({ role, id, isSuspend, reason }) => ({
        url: "update-user-role",
        method: "PUT",
        body: { role, id, isSuspend, reason },
        credentials: "include" as const,
      }),
    }),

    upgradePro: builder.mutation({
      query: ({ userId, paymentRef, amount }: any) => ({
        url: "upgrade-to-pro",
        method: "POST",
        body: { userId, paymentRef, amount },
        credentials: "include" as const,
      }),
    }),

    getAllProUsers: builder.query({
      query: (params = {}) => {
        const {
          page = 1,
          limit = 10,
          sortBy = "createdAt",
          order = "desc",
        } = params;
        return {
          url: "all-pro-users",
          params: { page, limit, sortBy, order },
          method: "GET",
        };
      },
    }),
    upgradeUserType: builder.mutation({
      query: ({ id, newUserType }) => ({
        url: `upgrade-user-type/${id}`,
        method: "PUT",
        body: { newUserType },
      }),
    }),
    uploadUsersCSV: builder.mutation({
      query: (formData) => ({
        url: "upload-users-csv",
        method: "POST",
        body: formData,
      }),
    }),
    toggleOverallVerification: builder.mutation({
      query: ({
        userId,
        verified,
      }: {
        userId: string;
        verified?: boolean;
      }) => ({
        url: `users/${userId}/verification-status`,
        method: "PUT",
        body: { verified },
      }),
    }),
  }),
});

export const {
  useAddUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetDetailUserQuery,
  useAddUserPropertyMutation,
  useRemoveUserPropertyMutation,
  useDeleteUserAdminMutation,
  useUploadUsersCSVMutation,
  useUpdateAvatarMutation,
  useUpdateUserDataMutation,
  useUpdateNotificationDataMutation,
  useUpdatePasswordMutation,
  useAddCircleMutation,
  useGetAllcircleQuery,
  useDeleteCircleMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useToggleOverallVerificationMutation,
  useUpdateUserRoleMutation,
  useUpdateKycMutation,
  useGetUserReportsQuery,
  useUpdateUserPreferenceMutation,

  useGetAllProUsersQuery,
  useUpgradeProMutation,

  useRegisterMutation,
  useActivationMutation,
  useForgot_passwordMutation,
  useReset_passwordMutation,
  useResendOtpMutation,

  // update user profile
  useUpdateUserProfileMutation,
  useGetAllUsersFcmQuery,
  useGetUserDetailsFcmQuery,
  useUpdateUserFcmMutation,
  useDeleteUserFcmMutation,
  useUpgradeUserTypeMutation,
  useRestoreUserFcmMutation,


    useUpdateProfileMutation,
  useChangePasswordMutation,
} = userApi;
