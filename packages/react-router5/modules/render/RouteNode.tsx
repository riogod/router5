import React, { ReactNode, FC, memo } from 'react'
import { shouldUpdateNode } from '@riogz/router5-transition-path'
import { RouteContext } from '../types'
import { routeContext } from '../context'

export interface RouteNodeProps {
    nodeName: string
    children: (routeContext: RouteContext) => ReactNode
}

const RouteNodeRenderer: FC<RouteNodeProps & RouteContext> = memo(
    (props): ReactNode => {
        const { router, route, previousRoute } = props

        return props.children({ router, route, previousRoute })
    },
    (prevProps, nextProps) => {
        return shouldUpdateNode(prevProps.nodeName)(
            nextProps.route,
            nextProps.previousRoute
        )
    }
)

const RouteNode: FC<RouteNodeProps> = props => {
    return (
        <routeContext.Consumer>
            {routeContext => <RouteNodeRenderer {...props} {...routeContext} />}
        </routeContext.Consumer>
    )
}

export default RouteNode
