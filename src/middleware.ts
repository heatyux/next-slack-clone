import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server'

const isPublicPage = createRouteMatcher(['/auth'])

export default convexAuthNextjsMiddleware(async (req) => {
  const isAuthenticated = await isAuthenticatedNextjs()

  if (!isPublicPage(req) && !isAuthenticated) {
    return nextjsMiddlewareRedirect(req, '/auth')
  }

  // TODO: redirect user away from "/auth" if authenticated
})

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
