# use-dehydrated-state

`use-dehydrated-state` is a simple utility [Hook](https://beta.reactjs.org/learn/reusing-logic-with-custom-hooks) for [TanStack Query](https://tanstack.com/query) & [Remix](https://remix.run).

## Installation

### NPM

```bash
npm install use-dehydrated-state
# or
pnpm add use-dehydrated-state
# or
yarn add use-dehydrated-state
```

## Usage

To support caching queries on the server and set up hydration:

- Create a new `QueryClient` instance **inside of your app, and on an instance ref (or in React state). This ensures that data is not shared between different users and requests, while still only creating the QueryClient once per component lifecycle.**
- Wrap your app component with `<QueryClientProvider>` and pass it the client instance
- Wrap your app component with `<Hydrate>` and pass it the `dehydratedState` prop from `useDehydratedState()`

```tsx
// root.tsx
import { Outlet } from "@remix-run/react";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { useDehydratedState } from "use-dehydrated-state";

export default function MyApp() {
  const [queryClient] = React.useState(() => new QueryClient());

  const dehydratedState = useDehydratedState();

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <Outlet />
      </Hydrate>
    </QueryClientProvider>
  );
}
```

Now you are ready to prefetch some data in your [`loader`](https://remix.run/docs/en/v1/api/conventions#loader).

- Create a new `QueryClient` instance **for each page request. This ensures that data is not shared between users and requests.**
- Prefetch the data using the clients `prefetchQuery` method and wait for it to complete
- Use `dehydrate` to dehydrate the query cache and pass it to the page via the `dehydratedState` prop. This is the same prop that `useDehydratedState()` will pick up to cache in your `root.tsx`

```tsx
// pages/invoices.tsx
import { json } from "@remix-run/node";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";

export async function loader() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["invoices"], getInvoices);

  return json({ dehydratedState: dehydrate(queryClient) });
}

export default function Invoices() {
  const { data } = useQuery({ queryKey: ["invoices"], queryFn: getInvoices });

  // ...
}
```
