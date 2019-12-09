// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */
import type { GraphQLError } from 'graphql';
/*
 * If user request invalid query param to graphql you trigger bad input validation
 * and receive 400: Bad Request. The right feedback to the client is a 404 page
 * and since graphql does not have a better error handling mechanism this is a dirty check.
 */
export function throwIfGraphql404(error: { graphQLErrors?: GraphQLError[] }) {
  if (
    error.graphQLErrors &&
    error.graphQLErrors.length > 0 &&
    error.graphQLErrors[0].message === '400: Bad Request'
  ) {
    return {
      statusCode: 404
    };
  }
}
