import { api } from '@/Services/api';

export const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ GET ALL COURSES
    getCourses: builder.query({
      query: () => ({
        url: "/api/courses",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ _id }) => ({
              type: "Course",
              id: _id,
            })),
            { type: "Course", id: "LIST" },
          ]
          : [{ type: "Course", id: "LIST" }],
    }),
    // ✅ GET COURSE BY ID
    getCourseById: builder.query({

      query: (id) => ({
        url: `/api/courses/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "Course", id },
      ],
    }),

    // ✅ GET FREE COURSES
    getFreeCourse: builder.query({
      query: () => ({
        url: "/api/courses/free",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),

  }),

  overrideExisting: false,
});

export const {
  useGetCoursesQuery,
  useLazyGetCoursesQuery,
  useGetFreeCourseQuery,
  useGetCourseByIdQuery,
} = courseApi;