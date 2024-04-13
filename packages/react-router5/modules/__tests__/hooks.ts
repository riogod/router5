import {
    createTestRouter,
    createTestRouterWithADefaultRoute,
    FnChild,
    renderWithRouter
} from './helpers'
import { useRoute, useRouter, useRouteNode } from '..'

describe('useRoute hook', () => {
    let router

    beforeAll(() => {
        router = createTestRouter()
    })

    it('should inject the router in the wrapped component props', () => {
        const ChildSpy = jest.fn(FnChild)

        renderWithRouter(router)(() => {
            return ChildSpy(useRoute())
        })
        expect(ChildSpy).toHaveBeenCalledWith({
            router,
            route: null,
            previousRoute: null
        })
    })
})

describe('useRouter hook', () => {
    let router

    beforeAll(() => {
        router = createTestRouter()
    })

    it('should inject the router on the wrapped component props', () => {
        const ChildSpy = jest.fn(FnChild)

        renderWithRouter(router)(() => {
            return ChildSpy({ router: useRouter() })
        })

        expect(ChildSpy).toHaveBeenCalledWith({
            router
        })
    })
})

describe('useRouteNode hook', () => {
    let router
    let routerWithADefaultRoute

    beforeAll(() => {
        router = createTestRouter()
        routerWithADefaultRoute = createTestRouterWithADefaultRoute()
    })

    it('should return the router', () => {
        const ChildSpy = jest.fn(FnChild)

        renderWithRouter(router)(() => ChildSpy(useRouteNode('')))
        expect(ChildSpy).toHaveBeenCalledWith({
            router,
            route: null,
            previousRoute: null
        })
    })

    it('should not return a null route with a default route and the router started', () => {
        const ChildSpy = jest.fn(FnChild)

        const BaseComponent = () => ChildSpy(useRouteNode(''))

        routerWithADefaultRoute.start(() => {
            renderWithRouter(routerWithADefaultRoute)(BaseComponent)
            /* first call, first argument */
            expect(ChildSpy.mock.calls[0][0].route.name).toBe('test')
        })
    })
})
