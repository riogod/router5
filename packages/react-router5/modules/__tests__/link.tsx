import * as React from 'react'
import { createTestRouter } from './helpers'
import { RouterProvider, Link, ConnectedLink } from '..'
import { fireEvent, render } from '@testing-library/react'

describe('Link component', () => {
    let router

    beforeAll(() => {
        router = createTestRouter()
    })

    it('should render an hyperlink element', () => {
        router.addNode('home', '/home')
        const output = render(
            <RouterProvider router={router}>
                <Link routeName={'home'} data-testid="test-link" />
            </RouterProvider>
        )
        expect(output.getByTestId('test-link').getAttribute('href')).toBe(
            '/home'
        )
        expect(output.getByTestId('test-link').className).not.toBe('active')
    })

    it('should have an active class if associated route is active', () => {
        router.setOption('defaultRoute', 'home')
        router.start()
        const output = render(
            <RouterProvider router={router}>
                <Link routeName={'home'} data-testid="test-link" />
            </RouterProvider>
        )
        expect(output.getByTestId('test-link').className).toBe('active')
    })

    it('should not call router’s navigate method when used with target="_blank"', () => {
        router.start()
        const output = render(
            <RouterProvider router={router}>
                <ConnectedLink
                    routeName="home"
                    title="Hello"
                    target="_blank"
                    data-testid="test-link"
                />
            </RouterProvider>
        )
        const a = output.getByTestId('test-link')
        const navSpy = jest.spyOn(router, 'navigate')

        fireEvent.click(a)

        expect(a.getAttribute('target')).toBeDefined()
        expect(navSpy).not.toHaveBeenCalled()
    })

    it('should spread other props to its link', () => {
        router.start()
        const onMouseLeave = () => {}
        const output = render(
            <RouterProvider router={router}>
                <ConnectedLink
                    routeName={'home'}
                    title="Hello"
                    data-test-id="Link"
                    onMouseLeave={onMouseLeave}
                    data-testid="test-link"
                />
            </RouterProvider>
        )

        const props = output.getByTestId('test-link')

        expect(props.getAttribute('href')).toBe('/home')
        expect(props.className).toBe('active')
        expect(props.getAttribute('title')).toBe('Hello')
        expect(props.children.length).toBe(0)
        expect(props.onclick).toBeDefined()
        expect(props.onmouseleave).toBeDefined()
    })
})
