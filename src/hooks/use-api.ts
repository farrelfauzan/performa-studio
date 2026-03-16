import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'

type QueryKey = string | [string, ...unknown[]]

export const useApiQuery = <TData>(
  key: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<TData>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn,
    ...options,
  })
}

type MutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, unknown, TVariables>,
  'mutationFn'
> & {
  invalidateQueries?: QueryKey[]
}

export const useApiMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: MutationOptions<TData, TVariables>,
) => {
  const queryClient = useQueryClient()
  const { invalidateQueries, onSuccess, ...restOptions } = options || {}

  return useMutation<TData, unknown, TVariables>({
    mutationFn,
    onSuccess: async (...args) => {
      if (invalidateQueries) {
        await Promise.all(
          invalidateQueries.map((key) =>
            queryClient.invalidateQueries({
              queryKey: Array.isArray(key) ? key : [key],
            }),
          ),
        )
      }
      onSuccess?.(...args)
    },
    ...restOptions,
  })
}
