import { api } from "@/redux/api/apiSlice";

export const featuresApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all feature sets
    getFeatureSets: builder.query({
      query: () => "all-control-features",
    }),

    // Get a specific feature set by name
    getFeatureSetByName: builder.query({
      query: (name) => `control-features/${name}`,
    }),

    // Create a new feature set
    createFeatureSet: builder.mutation({
      query: (featureSetData) => ({
        url: "create-control-feature",
        method: "POST",
        body: featureSetData,
      }),
    }),

    // Update a feature set
    updateFeatureSet: builder.mutation({
      query: ({ name, features }) => ({
        url: `edit-control-feature/${name}`,
        method: "PUT",
        body: { features },
      }),
    }),

    // Delete a feature set
    deleteFeatureSet: builder.mutation({
      query: (name) => ({
        url: `all-control-features/${name}`,
        method: "DELETE",
      }),
    }),

    // Add a feature to a feature set
    addFeature: builder.mutation({
      query: ({ name, feature }) => ({
        url: `add-control-feature/${name}/features`,
        method: "POST",
        body: feature,
      }),
    }),

    // Update a specific feature
    updateFeature: builder.mutation({
      query: ({ name, featureId, feature }) => ({
        url: `edit-control-features/${name}/features/${featureId}`,
        method: "PUT",
        body: feature,
      }),
    }),

    // Delete a specific feature
    deleteFeature: builder.mutation({
      query: ({ name, featureId }) => ({
        url: `delete-control-features/${name}/features/${featureId}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useGetFeatureSetsQuery,
  useGetFeatureSetByNameQuery,
  useCreateFeatureSetMutation,
  useUpdateFeatureSetMutation,
  useDeleteFeatureSetMutation,
  useAddFeatureMutation,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
} = featuresApi;
