import { api } from "@/redux/api/apiSlice";

export const bibleApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getBooks: builder.query({
            query: () => 'scriptures'
        }),
        getBook: builder.query({
            query: (bookName) => `scriptures/${bookName}`,
        }),

        getChapter: builder.query({
            query: ({ bookName, chapterNumber }) => `scriptures/${bookName}/${chapterNumber}`,
        }),


        addBook: builder.mutation({
            query: (newBook) => ({
                url: 'scriptures-create',
                method: 'POST',
                body: newBook,
            }),
        }),
        addChapter: builder.mutation({
            query: ({ bookId, newChapter }) => ({
                url: `scriptures/${bookId}/chapters`,
                method: 'POST',
                body: newChapter,
            }),
            // invalidatesTags: (result, error, { bookId }) => [{ type: 'Book', id: bookId }],
        }),
        addVerse: builder.mutation({
            query: ({ bookId, chapterId, newVerse }) => ({
                url: `scriptures/${bookId}/chapters/${chapterId}/verses`,
                method: 'POST',
                body: newVerse,
            }),
        }),
        updateBook: builder.mutation({
            query: ({ bookId, updatedBook }) => ({
                url: `scriptures/${bookId}`,
                method: 'PUT',
                body: updatedBook,
            }),
        }),
        updateChapter: builder.mutation({
            query: ({ bookId, chapterId, updatedChapter }) => ({
                url: `scriptures/${bookId}/chapters/${chapterId}`,
                method: 'PUT',
                body: updatedChapter,
            }),
        }),
        updateVerse: builder.mutation({
            query: ({ bookId, chapterId, verseId, updatedVerse }) => ({
                url: `scriptures/${bookId}/chapters/${chapterId}/verses/${verseId}`,
                method: 'PUT',
                body: updatedVerse,
            }),
        }),
        deleteBook: builder.mutation<void, string>({
            query: (bookName) => ({
              url: `scriptures/${bookName}`,
              method: 'DELETE',
            }),
          }),
        deleteChapter: builder.mutation<void, { bookName: string; chapterId: string }>({
            query: ({ bookName, chapterId }) => ({
                url: `scriptures/${bookName}/chapters/${chapterId}`,
                method: 'DELETE',
            }),
        }),
        deleteVerse: builder.mutation<void, { bookName: string; chapterNumber: number; verseId: string }>({
            query: ({ bookName, chapterNumber, verseId }) => ({
                url: `scriptures/${bookName}/chapters/${chapterNumber}/verses/${verseId}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetBooksQuery,
    useGetBookQuery,
    useGetChapterQuery,
    useAddBookMutation,
    useAddChapterMutation,
    useAddVerseMutation,
    useUpdateBookMutation,
    useUpdateChapterMutation,
    useUpdateVerseMutation,
    useDeleteBookMutation,
    useDeleteChapterMutation,
    useDeleteVerseMutation,
} = bibleApi;

