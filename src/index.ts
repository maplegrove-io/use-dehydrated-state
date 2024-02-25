import type { DehydratedState } from "@tanstack/query-core";

import { UIMatch, useMatches } from "@remix-run/react";
import merge from "deepmerge";

type RouteData = Record<string, unknown> & {
  dehydratedState?: DehydratedState | null;
};

const useDehydratedState = (): DehydratedState => {
  const matches = useMatches() as UIMatch<RouteData>[];

  const dehydratedState = matches
    .map((match) => match.data?.dehydratedState)
    .filter(Boolean);

  return dehydratedState.length
    ? dehydratedState.reduce(
        (accumulator, currentValue) => merge(accumulator, currentValue),
        {} as DehydratedState
      )
    : undefined;
};

export { useDehydratedState };
