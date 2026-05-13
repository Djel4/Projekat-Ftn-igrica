import { SKINS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const skinsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSkins: builder.query({
             query: () => ({

             }),
             keepUnusedDataFor: 5 //milisekunde
        }),
        useGetSkinsQuery: builder.query({
            query: (skinsID) => ({
                url: `${SKINS_URL}/${skinsID},`
            }),
        keepUnusedDataFor: 5
        }),
    })
})

export const { useGetSkinsQuery } = skinsApiSlice;